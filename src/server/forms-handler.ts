import fs from "fs";
import path from "path";
import crypto from "crypto";
import { EVENT_CONFIG } from "../config/event";

export interface FormSubmissionPayload {
  form_key: "exhibitor_booking" | "exhibitor_brochure" | "visitor_registration" | "general_inquiry";
  // Honeypot field (hidden in UI)
  website_hp?: string;
  // Common fields
  name?: string;
  fullName?: string;
  email: string;
  mobile?: string;
  phone?: string;
  company?: string;
  companyName?: string;
  title?: string;
  jobTitle?: string;
  // Exhibitor booking
  sectors?: string[];
  message?: string;
  // Visitor registration
  visitorCategory?: string;
  // General inquiry
  subject?: string;
}

// In-memory rate limiting: IP / Email -> timestamp array
const rateLimitMap = new Map<string, number[]>();

function checkRateLimit(identifier: string, limit = 5, windowMs = 3600000): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(identifier) || [];
  const valid = timestamps.filter((t) => now - t < windowMs);
  if (valid.length >= limit) {
    return false;
  }
  valid.push(now);
  rateLimitMap.set(identifier, valid);
  return true;
}

// Strip CR/LF to prevent header injection
function sanitizeHeader(val?: string): string {
  if (!val) return "";
  return val.replace(/[\r\n]+/g, " ").trim();
}

// HTML-escape user strings
function escapeHtml(str?: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export const DEFAULT_BROCHURE_SECRET = "turnkey-show-secret-token-key-2027";

export function generateBrochureToken(
  email: string,
  secret: string = DEFAULT_BROCHURE_SECRET,
  customExp?: number
): { token: string; exp: number } {
  // 14 days expiry (in milliseconds) unless customExp provided
  const exp = customExp ?? Date.now() + 14 * 24 * 60 * 60 * 1000;
  const hmac = crypto.createHmac("sha256", secret || DEFAULT_BROCHURE_SECRET);
  hmac.update(`${email}:${exp}`);
  const token = hmac.digest("hex");
  return { token, exp };
}

export function verifyBrochureToken(
  email: string,
  exp: number,
  token: string,
  secret: string = DEFAULT_BROCHURE_SECRET
): boolean {
  if (!email || !exp || !token) return false;
  if (Date.now() > exp) return false; // Expired
  const hmac = crypto.createHmac("sha256", secret || DEFAULT_BROCHURE_SECRET);
  hmac.update(`${email}:${exp}`);
  const expected = hmac.digest("hex");
  const bufToken = Buffer.from(token);
  const bufExpected = Buffer.from(expected);
  if (bufToken.length !== bufExpected.length) return false;
  return crypto.timingSafeEqual(bufToken, bufExpected);
}

// Format Cairo Time (Africa/Cairo)
function getCairoTimeString(): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Cairo",
      dateStyle: "full",
      timeStyle: "medium",
    }).format(new Date()) + " (Africa/Cairo)";
  } catch {
    return new Date().toISOString();
  }
}

export async function handleFormSubmission(
  payload: FormSubmissionPayload,
  clientIp = "127.0.0.1",
  env: Record<string, string | undefined> = {}
): Promise<{ success: boolean; message: string; brochureUrl?: string }> {
  // 1. Honeypot check: silently succeed if bot filled the honeypot
  const honeypot = payload.website_hp || (payload as any).website;
  if (honeypot && typeof honeypot === "string" && honeypot.trim().length > 0) {
    console.warn(`[Security] Honeypot triggered from ${clientIp}. Silently dropping.`);
    return { success: true, message: "Thank you for your submission." };
  }

  // 2. Validate email
  const email = sanitizeHeader(payload.email);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, message: "Please provide a valid email address." };
  }

  // 3. Rate limiting (skip or soften in development / localhost)
  const isLocalDev = clientIp === "127.0.0.1" || clientIp === "::1" || clientIp === "localhost";
  if (!isLocalDev && (!checkRateLimit(clientIp, 15) || !checkRateLimit(email, 10))) {
    return {
      success: false,
      message: "Too many submissions. Please wait a little while before trying again.",
    };
  }

  const siteUrl = env["SITE_URL"] || "https://turnkeyshow.com";
  const formsToEmail = env["FORMS_TO_EMAIL"] || "mustafa.khafaga@gmail.com";
  const brochureSecret = env["BROCHURE_TOKEN_SECRET"] || DEFAULT_BROCHURE_SECRET;

  let classificationLabel = "";
  let subjectDetail = "";
  const submittedFields: Array<{ label: string; value: string }> = [];

  const nameVal = (
    payload.fullName ||
    payload.name ||
    (payload as any).contact ||
    (payload as any).full_name ||
    ""
  ).trim();
  const companyVal = (payload.companyName || payload.company || "").trim();
  const mobileVal = (payload.mobile || payload.phone || "").trim();
  const titleVal = (payload.title || payload.jobTitle || (payload as any).job_title || "").trim();

  const displayName = sanitizeHeader(nameVal || "Subscriber");
  const displayCompany = sanitizeHeader(companyVal || "");

  // 4. Form-specific field extraction
  switch (payload.form_key) {
    case "exhibitor_booking": {
      classificationLabel = "EXHIBITOR · Book your space";
      subjectDetail = `${displayCompany || displayName} (${displayName})`;
      if (!companyVal) return { success: false, message: "Company name is required." };
      if (!nameVal) return { success: false, message: "Contact person name is required." };
      if (!mobileVal) return { success: false, message: "Mobile number is required." };

      submittedFields.push(
        { label: "Company Name", value: companyVal },
        { label: "Company Website", value: (payload as any).companyWebsite || (payload as any).websiteUrl || "—" },
        { label: "Country", value: (payload as any).country || "—" },
        { label: "City", value: (payload as any).city || "—" },
        { label: "Contact Person", value: nameVal },
        { label: "Job Title", value: titleVal || "—" },
        { label: "Email", value: email },
        { label: "Phone / Mobile", value: mobileVal },
        { label: "LinkedIn Profile", value: (payload as any).linkedin || "—" },
        {
          label: "Sectors of Interest",
          value: payload.sectors?.length ? payload.sectors.join(", ") : "All sectors",
        },
        { label: "Stand Type", value: (payload as any).standType || "—" },
        { label: "Estimated Space (SQM)", value: (payload as any).standSize || "—" },
        { label: "Message / Specific Requirements", value: payload.message || "—" }
      );
      break;
    }

    case "exhibitor_brochure": {
      classificationLabel = "EXHIBITOR · Sales brochure download";
      subjectDetail = `${displayCompany || displayName} (${displayName})`;
      if (!nameVal) return { success: false, message: "Name is required." };
      if (!mobileVal) return { success: false, message: "Mobile number is required." };
      if (!companyVal) return { success: false, message: "Company name is required." };

      submittedFields.push(
        { label: "Name", value: nameVal },
        { label: "Email", value: email },
        { label: "Mobile", value: mobileVal },
        { label: "Company Name", value: companyVal },
        { label: "Job Title", value: titleVal || "—" }
      );
      break;
    }

    case "visitor_registration": {
      classificationLabel = "VISITOR · Registration";
      subjectDetail = displayName;
      if (!nameVal) return { success: false, message: "Full name is required." };
      const category = (payload.visitorCategory || (payload as any).interest || "General Visitor").trim();

      submittedFields.push(
        { label: "Full Name", value: nameVal },
        { label: "Email", value: email },
        { label: "Mobile", value: mobileVal || "—" },
        { label: "Company / Organization", value: companyVal || "—" },
        { label: "Job Title", value: titleVal || "—" },
        { label: "Visitor Category", value: category },
        {
          label: "Sectors of Interest",
          value: payload.sectors?.length ? payload.sectors.join(", ") : "—",
        }
      );
      break;
    }

    case "general_inquiry": {
      classificationLabel = "GENERAL INQUIRY · Contact us";
      subjectDetail = displayName;
      if (!nameVal) return { success: false, message: "Full name is required." };
      if (!payload.subject?.trim()) return { success: false, message: "Subject is required." };
      if (!payload.message?.trim()) return { success: false, message: "Message is required." };

      submittedFields.push(
        { label: "Full Name", value: nameVal },
        { label: "Email", value: email },
        { label: "Mobile", value: mobileVal || "—" },
        { label: "Subject", value: payload.subject },
        { label: "Message", value: payload.message }
      );
      break;
    }

    default:
      return { success: false, message: "Invalid form key." };
  }

  // 5. Generate brochure link if brochure download
  let brochureDownloadUrl = "";
  let fullBrochureEmailUrl = "";
  if (payload.form_key === "exhibitor_brochure") {
    const { token, exp } = generateBrochureToken(email, brochureSecret);
    brochureDownloadUrl = `/api/brochure?token=${token}&email=${encodeURIComponent(
      email
    )}&exp=${exp}`;
    fullBrochureEmailUrl = `${siteUrl}${brochureDownloadUrl}`;
  }

  // 6. Build Team Notification Email
  const teamSubject = `[Turnkey Show] ${classificationLabel}: ${subjectDetail}`;
  const teamHtml = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8" /></head>
    <body style="font-family: Arial, sans-serif; background-color: #f7f7f7; margin:0; padding:24px;">
      <div style="max-width:600px; margin:0 auto; background:#ffffff; border:1px solid #e0e0e0; padding:28px;">
        <div style="border-bottom:2px solid #E92824; padding-bottom:12px; margin-bottom:20px;">
          <h2 style="margin:0; font-family:Arial Black, Arial, sans-serif; color:#080808; font-size:20px;">TURNKEY SHOW NOTIFICATION</h2>
          <span style="display:inline-block; margin-top:8px; padding:4px 10px; background:#E92824; color:#ffffff; font-size:12px; font-weight:bold; text-transform:uppercase;">
            ${escapeHtml(classificationLabel)}
          </span>
        </div>
        <p style="color:#555; font-size:13px; margin-bottom:16px;">
          Submitted at: <strong>${getCairoTimeString()}</strong>
        </p>
        <table style="width:100%; border-collapse:collapse; font-size:14px;">
          ${submittedFields
            .map(
              (f) => `
            <tr>
              <td style="padding:10px 12px; border:1px solid #eeeeee; background:#fbfbfb; width:35%; font-weight:bold; color:#333;">
                ${escapeHtml(f.label)}
              </td>
              <td style="padding:10px 12px; border:1px solid #eeeeee; color:#111;">
                ${escapeHtml(f.value)}
              </td>
            </tr>
          `
            )
            .join("")}
        </table>
        <div style="margin-top:24px; padding-top:14px; border-top:1px solid #eeeeee; font-size:12px; color:#888;">
          Sender Reply-To: <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>
        </div>
      </div>
    </body>
    </html>
  `;

  const teamTxt = `[Turnkey Show] ${classificationLabel}
Submitted at: ${getCairoTimeString()}

${submittedFields.map((f) => `${f.label}: ${f.value}`).join("\n")}
`;

  // 7. Build User Auto-Reply Email
  const userAutoReply = buildAutoReplyHtml({
    form_key: payload.form_key,
    firstName: displayName.split(" ")[0] || "Valued Guest",
    submittedFields,
    brochureUrl: fullBrochureEmailUrl || brochureDownloadUrl,
  });

  // 8. Dispatch Emails (or write to .mail-preview)
  await dispatchEmail({
    to: formsToEmail,
    replyTo: email,
    subject: teamSubject,
    html: teamHtml,
    text: teamTxt,
    env,
    tag: `team_${payload.form_key}`,
  });

  await dispatchEmail({
    to: email,
    replyTo: EVENT_CONFIG.email,
    subject: userAutoReply.subject,
    html: userAutoReply.html,
    text: userAutoReply.text,
    env,
    tag: `reply_${payload.form_key}`,
  });

  return {
    success: true,
    message: "Thank you. Your submission has been received.",
    brochureUrl: brochureDownloadUrl,
  };
}

function buildAutoReplyHtml({
  form_key,
  firstName,
  submittedFields,
  brochureUrl,
}: {
  form_key: string;
  firstName: string;
  submittedFields: Array<{ label: string; value: string }>;
  brochureUrl?: string;
}): { subject: string; html: string; text: string } {
  let subject = "";
  let bodyIdea = "";
  let brochureCtaHtml = "";
  let brochureCtaTxt = "";

  switch (form_key) {
    case "exhibitor_booking":
      subject = "Thank you for your interest in exhibiting at Turnkey Show 2027";
      bodyIdea =
        "We have received your space booking request for Turnkey Show 2027. Our exhibition team is reviewing your requirements and will contact you directly to discuss booth placement and customized solutions.";
      break;

    case "exhibitor_brochure":
      subject = "Your Turnkey Show 2027 brochure";
      bodyIdea =
        "Thank you for requesting the official Turnkey Show 2027 sales brochure. You can access and download your complete copy below:";
      brochureCtaHtml = `
        <div style="margin:24px 0; text-align:center;">
          <a href="${escapeHtml(brochureUrl)}" target="_blank" style="background:#E92824; color:#ffffff; text-decoration:none; padding:14px 28px; font-weight:bold; font-size:15px; display:inline-block; border-radius:0;">
            Download the brochure
          </a>
          <p style="margin-top:12px; font-size:12px; color:#777777;">
            If the button doesn't work, copy and paste this URL into your browser:<br/>
            <a href="${escapeHtml(brochureUrl)}" style="color:#E92824;">${escapeHtml(brochureUrl)}</a>
          </p>
        </div>
      `;
      brochureCtaTxt = `\nDownload the brochure here:\n${brochureUrl}\n`;
      break;

    case "visitor_registration":
      subject = "We've received your Turnkey Show 2027 registration details";
      bodyIdea =
        "Thank you for registering your interest in visiting Turnkey Show 2027. We have successfully logged your visitor details, and our visitor service team will provide further attendance updates.";
      break;

    case "general_inquiry":
      subject = "We received your message: Turnkey Show";
      bodyIdea =
        "Thank you for getting in touch with the Turnkey Show team. We have received your inquiry, and a representative will review your message and reply promptly.";
      break;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${escapeHtml(subject)}</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, Helvetica, sans-serif; color:#222222; -webkit-font-smoothing:antialiased;">
      <!-- Preheader line (hidden preview text) -->
      <div style="display:none; font-size:1px; color:#f4f4f4; line-height:1px; max-height:0px; max-width:0px; opacity:0; overflow:hidden;">
        ${escapeHtml(bodyIdea)}
      </div>

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f4; padding:24px 12px;">
        <tr>
          <td align="center">
            <!-- 600px Email Container -->
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%; background-color:#ffffff; border:1px solid #e2e2e2;">
              
              <!-- Top Band: Black with Logo & Red Accent Line -->
              <tr>
                <td style="background-color:#080808; padding:24px 32px; text-align:left;">
                  <span style="color:#ffffff; font-family:'Arial Black', Arial, sans-serif; font-size:22px; letter-spacing:1px; font-weight:900;">
                    TURN<span style="color:#E92824;"> &gt; </span>KEY SHOW
                  </span>
                </td>
              </tr>
              <tr>
                <td style="height:3px; background-color:#E92824; font-size:0; line-height:0;">&nbsp;</td>
              </tr>

              <!-- Body Content -->
              <tr>
                <td style="padding:36px 32px;">
                  <h1 style="margin:0 0 16px 0; font-family:'Arial Black', Arial, sans-serif; font-size:24px; color:#080808; letter-spacing:-0.5px;">
                    Thank you, ${escapeHtml(firstName)}
                  </h1>
                  
                  <p style="font-size:15px; line-height:1.6; color:#444444; margin:0 0 20px 0;">
                    ${escapeHtml(bodyIdea)}
                  </p>

                  ${brochureCtaHtml}

                  <!-- Submission Echo Table -->
                  <div style="margin-top:28px;">
                    <h3 style="margin:0 0 12px 0; font-family:'Arial Black', Arial, sans-serif; font-size:14px; text-transform:uppercase; color:#080808; letter-spacing:0.5px;">
                      Your submission
                    </h3>
                    <table width="100%" cellpadding="8" cellspacing="0" border="0" style="border:1px solid #eaeaea; font-size:13px; line-height:1.5;">
                      ${submittedFields
                        .map(
                          (f, i) => `
                        <tr style="background-color:${i % 2 === 0 ? "#fafafa" : "#ffffff"};">
                          <td style="padding:10px 12px; border-bottom:1px solid #eeeeee; font-weight:bold; color:#555555; width:38%;">
                            ${escapeHtml(f.label)}
                          </td>
                          <td style="padding:10px 12px; border-bottom:1px solid #eeeeee; color:#111111;">
                            ${escapeHtml(f.value)}
                          </td>
                        </tr>
                      `
                        )
                        .join("")}
                    </table>
                  </div>

                  <!-- Event Strip -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px; background-color:#fafafa; border-left:3px solid #E92824;">
                    <tr>
                      <td style="padding:14px 16px; font-size:13px; color:#333333; line-height:1.5;">
                        <strong>${EVENT_CONFIG.dates}</strong><br/>
                        ${EVENT_CONFIG.venue}
                      </td>
                    </tr>
                  </table>

                  <!-- Contact Line -->
                  <p style="margin:24px 0 0 0; font-size:13px; color:#666666;">
                    Have questions? Contact our team at <a href="mailto:${EVENT_CONFIG.email}" style="color:#E92824; text-decoration:none; font-weight:bold;">${EVENT_CONFIG.email}</a>.
                  </p>
                </td>
              </tr>

              <!-- Footer Block -->
              <tr>
                <td style="background-color:#141414; color:#a0a0a0; padding:24px 32px; font-size:12px; line-height:1.6; border-top:1px solid #282828;">
                  <strong style="color:#ffffff;">Organized by ${EVENT_CONFIG.organizer.name}</strong><br/>
                  Phone: ${EVENT_CONFIG.organizer.phone} | Mobile: ${EVENT_CONFIG.organizer.mobile}<br/>
                  Email: <a href="mailto:${EVENT_CONFIG.organizer.email}" style="color:#a0a0a0; text-decoration:none;">${EVENT_CONFIG.organizer.email}</a> | Website: <a href="https://${EVENT_CONFIG.website}" style="color:#a0a0a0; text-decoration:none;">${EVENT_CONFIG.website}</a>
                  <p style="margin:12px 0 0 0; font-size:11px; color:#777777;">
                    This is an automated notification regarding your Turnkey Show submission.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const text = `
Thank you, ${firstName}

${bodyIdea}
${brochureCtaTxt}
Your submission:
${submittedFields.map((f) => `${f.label}: ${f.value}`).join("\n")}

Event:
${EVENT_CONFIG.dates}
${EVENT_CONFIG.venue}

Contact: ${EVENT_CONFIG.email}

Organized by ${EVENT_CONFIG.organizer.name}
Phone: ${EVENT_CONFIG.organizer.phone} | Mobile: ${EVENT_CONFIG.organizer.mobile}
Email: ${EVENT_CONFIG.organizer.email}
Website: https://${EVENT_CONFIG.website}
`;

  return { subject, html, text };
}

async function dispatchEmail({
  to,
  replyTo,
  subject,
  html,
  text,
  env,
  tag,
}: {
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
  env: Record<string, string | undefined>;
  tag: string;
}) {
  const smtpHost = env["SMTP_HOST"];
  const previewDir = path.resolve(process.cwd(), ".mail-preview");

  // Always write preview file in development or when SMTP is not configured
  try {
    if (!fs.existsSync(previewDir)) {
      fs.mkdirSync(previewDir, { recursive: true });
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const baseName = `${timestamp}_${tag}`;
    const htmlPath = path.join(previewDir, `${baseName}.html`);
    const txtPath = path.join(previewDir, `${baseName}.txt`);

    const meta = `To: ${to}\nReply-To: ${replyTo || ""}\nSubject: ${subject}\n\n`;
    fs.writeFileSync(htmlPath, meta + html, "utf-8");
    fs.writeFileSync(txtPath, meta + text, "utf-8");
    console.log(`[Email Preview Generated] Saved to ${htmlPath}`);
  } catch (err) {
    console.error(`[Email Preview Error] Failed to write preview file:`, err);
  }

  // If SMTP is configured, send via SMTP
  if (smtpHost && env["SMTP_USER"] && env["SMTP_PASS"]) {
    // Basic SMTP socket sender or integration point
    console.log(`[Email] SMTP host configured (${smtpHost}). Attempting delivery to ${to}`);
  }
}

