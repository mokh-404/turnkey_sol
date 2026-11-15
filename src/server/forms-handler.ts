import fs from "fs";
import path from "path";
import crypto from "crypto";
import nodemailer from "nodemailer";
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

interface SubmittedField {
  section?: string;
  label: string;
  value: string;
}

interface EmailAttachment {
  filename: string;
  contentType: string;
  filePath: string;
  cid?: string;
}

// Read .env file dynamically from disk so changes take effect immediately without restarting Vite
function loadDotEnv(): Record<string, string> {
  const result: Record<string, string> = {};
  const candidates = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "turnkey_sol_main", ".env"),
  ];
  const envFile = candidates.find((p) => fs.existsSync(p));
  if (!envFile) return result;

  try {
    const content = fs.readFileSync(envFile, "utf-8");
    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const eqIdx = line.indexOf("=");
      if (eqIdx === -1) continue;
      const key = line.slice(0, eqIdx).trim();
      let val = line.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (key) result[key] = val;
    }
  } catch {
    // ignore read errors
  }
  return result;
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
    return (
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Africa/Cairo",
        dateStyle: "full",
        timeStyle: "medium",
      }).format(new Date()) + " (Africa/Cairo)"
    );
  } catch {
    return new Date().toISOString();
  }
}

function getLogoPaths(): { turnkeyPath?: string; apexPath?: string } {
  const turnkeyCandidates = [
    path.resolve(process.cwd(), "public", "logos", "turnkey-show-logo.png"),
    path.resolve(process.cwd(), "src", "assets", "logos", "turnkey-show-logo.png"),
    path.resolve(process.cwd(), "public", "turnkey-logo.png"),
  ];
  const apexCandidates = [
    path.resolve(process.cwd(), "apex-logo-no-bg.png"),
    path.resolve(process.cwd(), "public", "logos", "apex-logo.png"),
    path.resolve(process.cwd(), "src", "assets", "logos", "apex-logo.png"),
  ];
  return {
    turnkeyPath: turnkeyCandidates.find((p) => fs.existsSync(p)),
    apexPath: apexCandidates.find((p) => fs.existsSync(p)),
  };
}

let cachedLogos: { turnkeyDataUri: string; apexDataUri: string } | null = null;

function getEmbeddedLogoDataUris(siteUrl: string): { turnkeyDataUri: string; apexDataUri: string } {
  if (cachedLogos) return cachedLogos;
  const { turnkeyPath, apexPath } = getLogoPaths();

  let turnkeyDataUri = `${siteUrl}/logos/turnkey-show-logo.png`;
  let apexDataUri = `${siteUrl}/logos/apex-logo.png`;

  try {
    if (turnkeyPath) {
      turnkeyDataUri = `data:image/png;base64,${fs.readFileSync(turnkeyPath).toString("base64")}`;
    }
  } catch {
    // fallback
  }

  try {
    if (apexPath) {
      apexDataUri = `data:image/png;base64,${fs.readFileSync(apexPath).toString("base64")}`;
    }
  } catch {
    // fallback
  }

  cachedLogos = { turnkeyDataUri, apexDataUri };
  return cachedLogos;
}

function findBrochurePdfPath(env: Record<string, string | undefined> = {}): string | undefined {
  const candidates = [
    env["BROCHURE_FILE_PATH"],
    path.resolve(process.cwd(), "public", "Brochure Turnkey Show 2027.pdf"),
    path.resolve(process.cwd(), "Brochure Turnkey Show 2027.pdf"),
    path.resolve(process.cwd(), "..", "Brochure Turnkey Show 2027.pdf"),
  ].filter(Boolean) as string[];
  return candidates.find((p) => fs.existsSync(p));
}

function generateRegistrationNumber(email: string): string {
  const hash = crypto.createHash("md5").update(`${email}:${Date.now()}`).digest("hex");
  const num = (parseInt(hash.slice(0, 6), 16) % 9000) + 1000;
  return `TKS${num}`;
}

export async function handleFormSubmission(
  payload: FormSubmissionPayload,
  clientIp = "127.0.0.1",
  passedEnv: Record<string, string | undefined> = {}
): Promise<{ success: boolean; message: string; brochureUrl?: string }> {
  const dotEnv = loadDotEnv();
  const env: Record<string, string | undefined> = {
    ...process.env,
    ...dotEnv,
    ...passedEnv,
  };

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

  const siteUrl = env["SITE_URL"] || dotEnv["SITE_URL"] || "http://localhost:8080";
  const formsToEmail = env["FORMS_TO_EMAIL"] || dotEnv["FORMS_TO_EMAIL"] || "mustafa.khafaga@gmail.com";
  const brochureSecret = env["BROCHURE_TOKEN_SECRET"] || dotEnv["BROCHURE_TOKEN_SECRET"] || DEFAULT_BROCHURE_SECRET;

  let formTitle = "";
  let formPagePath = "";
  let classificationLabel = "";
  let subjectDetail = "";
  const submittedFields: SubmittedField[] = [];
  const registrationNumber = generateRegistrationNumber(email);

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

  // 4. Form-specific field extraction with clear section separation
  switch (payload.form_key) {
    case "exhibitor_booking": {
      formTitle = "FORM 1: BOOK YOUR SPACE (Exhibitor Application Form)";
      formPagePath = "/exhibit/book-your-space";
      classificationLabel = "EXHIBITOR · Book Your Space";
      subjectDetail = `${displayCompany || displayName} (${displayName})`;
      if (!companyVal) return { success: false, message: "Company name is required." };
      if (!nameVal) return { success: false, message: "Contact person name is required." };
      if (!mobileVal) return { success: false, message: "Mobile number is required." };

      submittedFields.push(
        { section: "Section 1 — Exhibitor & Company Information", label: "Application Reference Number", value: registrationNumber },
        { section: "Section 1 — Exhibitor & Company Information", label: "Company Name", value: companyVal },
        {
          section: "Section 1 — Exhibitor & Company Information",
          label: "Company Website",
          value: (payload as any).companyWebsite || (payload as any).websiteUrl || "—",
        },
        { section: "Section 1 — Exhibitor & Company Information", label: "Country", value: (payload as any).country || "—" },
        { section: "Section 1 — Exhibitor & Company Information", label: "City", value: (payload as any).city || "—" },
        { section: "Section 1 — Exhibitor & Company Information", label: "Phone / Mobile Number", value: mobileVal },
        { section: "Section 1 — Exhibitor & Company Information", label: "Email Address", value: email },
        { section: "Section 1 — Exhibitor & Company Information", label: "Contact Person Name", value: nameVal },
        { section: "Section 1 — Exhibitor & Company Information", label: "Job Title", value: titleVal || "—" },
        {
          section: "Section 1 — Exhibitor & Company Information",
          label: "LinkedIn Profile URL",
          value: (payload as any).linkedin || "—",
        },
        {
          section: "Section 2 — Exhibitor Profile & Stand Requirements",
          label: "Core Industry Sectors",
          value: payload.sectors?.length ? payload.sectors.join(", ") : "All sectors",
        },
        {
          section: "Section 2 — Exhibitor Profile & Stand Requirements",
          label: "Preferred Stand Type",
          value: (payload as any).standType || "—",
        },
        {
          section: "Section 2 — Exhibitor Profile & Stand Requirements",
          label: "Estimated Booth Space (SQM)",
          value: (payload as any).standSize || "—",
        },
        {
          section: "Section 2 — Exhibitor Profile & Stand Requirements",
          label: "Additional Requirements / Space Inquiries",
          value: payload.message || "—",
        }
      );
      break;
    }

    case "exhibitor_brochure": {
      formTitle = "FORM 2: DOWNLOAD BROCHURE (Sales Brochure Request Form)";
      formPagePath = "/exhibit/download-brochure";
      classificationLabel = "EXHIBITOR · Sales Brochure Download";
      subjectDetail = `${displayCompany || displayName} (${displayName})`;
      if (!nameVal) return { success: false, message: "Name is required." };
      if (!mobileVal) return { success: false, message: "Mobile number is required." };
      if (!companyVal) return { success: false, message: "Company name is required." };

      submittedFields.push(
        { section: "Brochure Request Form Fields", label: "Reference Number", value: registrationNumber },
        { section: "Brochure Request Form Fields", label: "Your Name", value: nameVal },
        { section: "Brochure Request Form Fields", label: "Mobile / Phone", value: mobileVal },
        { section: "Brochure Request Form Fields", label: "Business Email", value: email },
        { section: "Brochure Request Form Fields", label: "Company Name", value: companyVal },
        { section: "Brochure Request Form Fields", label: "Job Title", value: titleVal || "—" }
      );
      break;
    }

    case "visitor_registration": {
      formTitle = "FORM 3: VISITOR REGISTRATION (Visitor Entry Badge Form)";
      formPagePath = "/visit/visitor-registration";
      classificationLabel = "VISITOR · Registration";
      subjectDetail = `${displayName} (${registrationNumber})`;
      if (!nameVal) return { success: false, message: "Full name is required." };
      const category = (payload.visitorCategory || (payload as any).interest || "General Visitor").trim();

      submittedFields.push(
        { section: "Section 1 — Visitor Personal & Contact Information", label: "Registration Number", value: registrationNumber },
        { section: "Section 1 — Visitor Personal & Contact Information", label: "Full Name", value: nameVal },
        { section: "Section 1 — Visitor Personal & Contact Information", label: "Email Address", value: email },
        { section: "Section 1 — Visitor Personal & Contact Information", label: "Mobile Number", value: mobileVal || "—" },
        { section: "Section 2 — Visitor Profile & Interests", label: "Visitor Category", value: category },
        { section: "Section 2 — Visitor Profile & Interests", label: "Company / Organization", value: companyVal || "—" },
        { section: "Section 2 — Visitor Profile & Interests", label: "Job Title", value: titleVal || "—" },
        {
          section: "Section 2 — Visitor Profile & Interests",
          label: "Sectors of Interest",
          value: payload.sectors?.length ? payload.sectors.join(", ") : "—",
        }
      );
      break;
    }

    case "general_inquiry": {
      formTitle = "FORM 4: CONTACT US (General Inquiry Form)";
      formPagePath = "/contact";
      classificationLabel = "GENERAL INQUIRY · Contact Us";
      subjectDetail = `${displayName} — ${sanitizeHeader(payload.subject)}`;
      if (!nameVal) return { success: false, message: "Full name is required." };
      if (!payload.subject?.trim()) return { success: false, message: "Subject is required." };
      if (!payload.message?.trim()) return { success: false, message: "Message is required." };

      submittedFields.push(
        { section: "Section 1 — Sender Contact Information", label: "Inquiry Reference Number", value: registrationNumber },
        { section: "Section 1 — Sender Contact Information", label: "Full Name", value: nameVal },
        { section: "Section 1 — Sender Contact Information", label: "Email Address", value: email },
        { section: "Section 1 — Sender Contact Information", label: "Mobile Number", value: mobileVal || "—" },
        { section: "Section 2 — Inquiry Subject & Message", label: "Subject", value: payload.subject },
        { section: "Section 2 — Inquiry Subject & Message", label: "Message", value: payload.message }
      );
      break;
    }

    default:
      return { success: false, message: "Invalid form key." };
  }

  // 5. Generate brochure link & attachment if brochure download
  let brochureDownloadUrl = "";
  let fullBrochureEmailUrl = "";
  const userAttachments: EmailAttachment[] = [];

  if (payload.form_key === "exhibitor_brochure") {
    const { token, exp } = generateBrochureToken(email, brochureSecret);
    brochureDownloadUrl = `/api/brochure?token=${token}&email=${encodeURIComponent(email)}&exp=${exp}`;
    fullBrochureEmailUrl = `${siteUrl.replace(/\/$/, "")}${brochureDownloadUrl}`;

    const brochureFilePath = findBrochurePdfPath(env);
    if (brochureFilePath) {
      userAttachments.push({
        filename: "Brochure Turnkey Show 2027.pdf",
        contentType: "application/pdf",
        filePath: brochureFilePath,
      });
    }
  }

  // 6. Build Owner Notification Email (to mustafa.khafaga@gmail.com)
  const teamSubject = `[Turnkey Show 2027] ${classificationLabel} — ${subjectDetail}`;
  const teamEmail = buildOwnerNotificationEmail({
    formTitle,
    formKey: payload.form_key,
    formPagePath,
    classificationLabel,
    submittedFields,
    senderEmail: email,
    senderName: displayName,
    siteUrl,
  });

  // 7. Build User Auto-Reply Email (separated by form type, styled like Registration (updated).docx)
  const userAutoReply = buildAutoReplyHtml({
    form_key: payload.form_key,
    formTitle,
    fullName: displayName,
    registrationNumber,
    submittedFields,
    brochureUrl: fullBrochureEmailUrl || brochureDownloadUrl,
    siteUrl,
  });

  // 8. Dispatch Both Emails (Owner + User Auto-Reply)
  await dispatchEmail({
    to: formsToEmail,
    replyTo: email,
    subject: teamSubject,
    html: teamEmail.html,
    text: teamEmail.text,
    env,
    tag: `team_${payload.form_key}`,
  });

  await dispatchEmail({
    to: email,
    replyTo: EVENT_CONFIG.email,
    subject: userAutoReply.subject,
    html: userAutoReply.html,
    text: userAutoReply.text,
    attachments: userAttachments,
    env,
    tag: `reply_${payload.form_key}`,
  });

  return {
    success: true,
    message: "Thank you. Your submission has been received.",
    brochureUrl: brochureDownloadUrl,
  };
}

function renderGroupedSectionsHtmlAndText(submittedFields: SubmittedField[]): {
  sectionsHtml: string;
  sectionsText: string;
} {
  const sectionsMap = new Map<string, SubmittedField[]>();
  for (const field of submittedFields) {
    const secName = field.section || "Submitted Form Fields";
    const list = sectionsMap.get(secName) || [];
    list.push(field);
    sectionsMap.set(secName, list);
  }

  let sectionsHtml = "";
  let sectionsText = "";

  for (const [sectionTitle, fields] of sectionsMap.entries()) {
    sectionsHtml += `
      <div style="margin-top: 20px; margin-bottom: 8px; padding: 9px 14px; background-color: #080808; color: #ffffff; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.8px; border-left: 4px solid #E92924;">
        ${escapeHtml(sectionTitle)}
      </div>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px; margin-bottom: 16px;">
        ${fields
          .map(
            (f, idx) => `
          <tr style="background-color: ${idx % 2 === 0 ? "#fafafa" : "#ffffff"};">
            <td style="padding: 11px 14px; border: 1px solid #e5e7eb; width: 38%; font-weight: bold; color: #111111; vertical-align: top;">
              ${escapeHtml(f.label)}
            </td>
            <td style="padding: 11px 14px; border: 1px solid #e5e7eb; color: #222222; vertical-align: top; white-space: pre-wrap;">
              ${escapeHtml(f.value)}
            </td>
          </tr>`
          )
          .join("")}
      </table>
    `;

    sectionsText += `\n=== ${sectionTitle.toUpperCase()} ===\n`;
    for (const f of fields) {
      sectionsText += `${f.label}: ${f.value}\n----------------------------------------\n`;
    }
  }

  return { sectionsHtml, sectionsText };
}

function buildOwnerNotificationEmail({
  formTitle,
  formKey,
  formPagePath,
  classificationLabel,
  submittedFields,
  senderEmail,
  senderName,
  siteUrl,
}: {
  formTitle: string;
  formKey: string;
  formPagePath: string;
  classificationLabel: string;
  submittedFields: SubmittedField[];
  senderEmail: string;
  senderName: string;
  siteUrl: string;
}): { html: string; text: string } {
  const { turnkeyDataUri, apexDataUri } = getEmbeddedLogoDataUris(siteUrl);
  const cairoTime = getCairoTimeString();
  const { sectionsHtml, sectionsText } = renderGroupedSectionsHtmlAndText(submittedFields);

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8" /></head>
    <body style="font-family: Arial, Helvetica, sans-serif; background-color: #f3f4f6; margin: 0; padding: 24px;">
      <div style="max-width: 680px; margin: 0 auto; background: #ffffff; border: 1px solid #d1d5db; border-top: 5px solid #E92924;">
        <!-- Header with Official Site Logo & New Apex Logo -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding: 20px 28px; border-bottom: 2px solid #e5e7eb; background: #ffffff;">
          <tr>
            <td align="left" valign="middle">
              <img src="${turnkeyDataUri}" data-cid="turnkey-logo" alt="Turnkey Show" style="height: 68px; width: auto; display: block;" />
            </td>
            <td align="right" valign="middle">
              <img src="${apexDataUri}" data-cid="apex-logo" alt="Apex Conventions and Trade Fairs" style="height: 46px; width: auto; display: block;" />
            </td>
          </tr>
        </table>

        <!-- Clear Form Identification Banner -->
        <div style="background-color: #fef2f2; border-bottom: 2px solid #E92924; padding: 18px 28px;">
          <div style="display: inline-block; padding: 4px 10px; background: #E92924; color: #ffffff; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
            ${escapeHtml(classificationLabel)}
          </div>
          <h2 style="margin: 0 0 6px 0; font-size: 20px; color: #080808; font-family: 'Arial Black', Arial, sans-serif;">
            ${escapeHtml(formTitle)}
          </h2>
          <div style="font-size: 13px; color: #374151; line-height: 1.6;">
            <strong>Form Identifier:</strong> <code>${escapeHtml(formKey)}</code> &nbsp;|&nbsp;
            <strong>Submitted From Page:</strong> <code>${escapeHtml(formPagePath)}</code><br />
            <strong>Submitted At:</strong> ${escapeHtml(cairoTime)}
          </div>
        </div>

        <!-- All Form Fields Separated by Section -->
        <div style="padding: 20px 28px 28px;">
          ${sectionsHtml}

          <div style="margin-top: 24px; padding: 14px 16px; background: #f9fafb; border: 1px solid #e5e7eb; font-size: 13px; color: #374151;">
            <strong>Direct Reply to Submitter:</strong>
            <a href="mailto:${escapeHtml(senderEmail)}" style="color: #E92924; font-weight: bold; text-decoration: none;">
              ${escapeHtml(senderName)} &lt;${escapeHtml(senderEmail)}&gt;
            </a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `========================================================
NEW WEBSITE FORM SUBMISSION — TURNKEY SHOW ALAMEIN 2027
========================================================
FORM SPECIFIED : ${formTitle}
CATEGORY       : ${classificationLabel}
FORM KEY       : ${formKey}
SOURCE PAGE    : ${formPagePath}
SUBMITTED AT   : ${cairoTime}
SUBMITTER      : ${senderName} <${senderEmail}>
${sectionsText}
========================================================
`;

  return { html, text };
}

function buildAutoReplyHtml({
  form_key,
  formTitle,
  fullName,
  registrationNumber,
  submittedFields,
  brochureUrl,
  siteUrl,
}: {
  form_key: string;
  formTitle: string;
  fullName: string;
  registrationNumber: string;
  submittedFields: SubmittedField[];
  brochureUrl?: string;
  siteUrl: string;
}): { subject: string; html: string; text: string } {
  const { turnkeyDataUri, apexDataUri } = getEmbeddedLogoDataUris(siteUrl);
  const { sectionsHtml, sectionsText } = renderGroupedSectionsHtmlAndText(submittedFields);

  let subject = "Your Submission in Turnkey Show Alamein 2027";
  let formTypeBadgeEn = "";
  let formTypeBadgeAr = "";
  let enLines: string[] = [];
  let arLines: string[] = [];
  let brochureButtonHtml = "";
  let brochureTextLink = "";

  switch (form_key) {
    case "visitor_registration":
      subject = "Visitor Registration Confirmation — Turnkey Show Alamein 2027";
      formTypeBadgeEn = "VISITOR REGISTRATION CONFIRMATION";
      formTypeBadgeAr = "تأكيد تسجيل الزوار";
      enLines = [
        `Thanks for registering to Turnkey Show Alamein 2027, Your registration number is: <strong>${escapeHtml(registrationNumber)}</strong>.`,
        `Looking forward welcoming you during 06 – 09 May 2027 at New Alamein International Convention and Exhibition Center - Arab Republic of Egypt.`,
        `Please show your registration confirmation to Turnkey Show 2027 team upon arrival that will ease up your access.`,
      ];
      arLines = [
        `شكراً لتسجيل زيارة معرض تيرن كي شو العلمين 2027، رقم التسجيل الخاص بك هو : <strong>${escapeHtml(registrationNumber)}</strong>`,
        `نتطلع للترحيب بك خلال الفترة من 06 – 09 مايو 2027 بمركز العلمين الجديدة الدولي للمؤتمرات والمعارض – جمهورية مصر العربية.`,
        `يرجى إظهار تأكيد التسجيل الخاص بك لفريق تيرن كي شو 2027 عند الوصول لقاعات المعرض.`,
      ];
      break;

    case "exhibitor_brochure":
      subject = "Official Sales Brochure — Turnkey Show Alamein 2027";
      formTypeBadgeEn = "SALES BROCHURE DOWNLOAD & REQUEST CONFIRMATION";
      formTypeBadgeAr = "تأكيد طلب وتحميل الكتيب التعريفي للمعرض";
      enLines = [
        `Thanks for requesting the official brochure for Turnkey Show Alamein 2027 (Reference: <strong>${escapeHtml(registrationNumber)}</strong>).`,
        `We have attached a copy of <strong>Brochure Turnkey Show 2027.pdf</strong> directly to this email, and you can also download it anytime using the button below.`,
        `Looking forward welcoming you during 06 – 09 May 2027 at New Alamein International Convention and Exhibition Center - Arab Republic of Egypt.`,
      ];
      arLines = [
        `شكراً لطلب الكتيب التعريفي لمعرض تيرن كي شو العلمين 2027 (رقم المرجع: <strong>${escapeHtml(registrationNumber)}</strong>).`,
        `تم إرفاق نسخة من الكتيب التعريفي (PDF) مع هذا البريد الإلكتروني، كما يمكنك تحميله مباشرة عبر الزر أدناه.`,
        `نتطلع للترحيب بك خلال الفترة من 06 – 09 مايو 2027 بمركز العلمين الجديدة الدولي للمؤتمرات والمعارض – جمهورية مصر العربية.`,
      ];
      brochureButtonHtml = `
        <div style="margin: 22px 0; text-align: left;">
          <a href="${escapeHtml(brochureUrl)}" target="_blank" style="background: #E92924; color: #ffffff; text-decoration: none; padding: 14px 28px; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 0.8px; display: inline-block;">
            Download Brochure (PDF)
          </a>
        </div>
      `;
      brochureTextLink = `\nDownload Brochure (PDF): ${brochureUrl}\n`;
      break;

    case "exhibitor_booking":
      subject = "Exhibitor Space Booking Confirmation — Turnkey Show Alamein 2027";
      formTypeBadgeEn = "EXHIBITOR SPACE BOOKING APPLICATION";
      formTypeBadgeAr = "تأكيد استلام طلب حجز مساحة عرض";
      enLines = [
        `Thanks for applying to exhibit at Turnkey Show Alamein 2027, Your application reference number is: <strong>${escapeHtml(registrationNumber)}</strong>.`,
        `Our exhibition sales team has received your space booking details below and will contact you shortly with stand options and floor plans.`,
        `Looking forward welcoming you during 06 – 09 May 2027 at New Alamein International Convention and Exhibition Center - Arab Republic of Egypt.`,
      ];
      arLines = [
        `شكراً لتقديم طلب حجز مساحة عرض في معرض تيرن كي شو العلمين 2027، رقم مرجع الطلب الخاص بك هو : <strong>${escapeHtml(registrationNumber)}</strong>`,
        `لقد تلقى فريق المبيعات تفاصيل طلبكم الموضحة أدناه وسيتواصل معكم قريباً.`,
        `نتطلع للترحيب بك خلال الفترة من 06 – 09 مايو 2027 بمركز العلمين الجديدة الدولي للمؤتمرات والمعارض – جمهورية مصر العربية.`,
      ];
      break;

    case "general_inquiry":
    default:
      subject = "We Received Your Inquiry — Turnkey Show Alamein 2027";
      formTypeBadgeEn = "CONTACT US — GENERAL INQUIRY CONFIRMATION";
      formTypeBadgeAr = "تأكيد استلام استفساركم — تواصل معنا";
      enLines = [
        `Thanks for contacting Turnkey Show Alamein 2027 (Inquiry Reference: <strong>${escapeHtml(registrationNumber)}</strong>).`,
        `We have received your message and our team will review your inquiry and get back to you shortly.`,
        `Looking forward welcoming you during 06 – 09 May 2027 at New Alamein International Convention and Exhibition Center - Arab Republic of Egypt.`,
      ];
      arLines = [
        `شكراً لتواصلكم مع معرض تيرن كي شو العلمين 2027 (رقم الاستفسار: <strong>${escapeHtml(registrationNumber)}</strong>).`,
        `لقد تم استلام رسالتكم بنجاح وسيقوم فريقنا بالرد عليكم في أقرب وقت ممكن.`,
        `نتطلع للترحيب بك خلال الفترة من 06 – 09 مايو 2027 بمركز العلمين الجديدة الدولي للمؤتمرات والمعارض – جمهورية مصر العربية.`,
      ];
      break;
  }

  // Built strictly after Registration (updated).docx layout, with ONLY the official site logo and new Apex logo,
  // plus clear form-type separation and submitted fields summary
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${escapeHtml(subject)}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: Calibri, Arial, Helvetica, sans-serif; color: #111111; -webkit-font-smoothing: antialiased;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 24px 12px;">
        <tr>
          <td align="center">
            <table width="680" cellpadding="0" cellspacing="0" border="0" style="max-width: 680px; width: 100%; background-color: #ffffff; border: 1px solid #e5e7eb; border-top: 4px solid #E92924; padding: 12px 24px;">
              <!-- Top Header Row: Official Site Logo & New Apex Logo Only (No partner logos) -->
              <tr>
                <td style="padding: 16px 4px 24px 4px; border-bottom: 2px solid #e5e7eb;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="left" valign="middle" style="width: 50%;">
                        <img src="${turnkeyDataUri}" data-cid="turnkey-logo" alt="Turnkey Show Alamein" style="height: 110px; width: auto; display: block;" />
                      </td>
                      <td align="right" valign="middle" style="width: 50%; text-align: right;">
                        <div style="display: inline-block; text-align: center;">
                          <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #666666; margin-bottom: 6px;">
                            Organized By
                          </div>
                          <img src="${apexDataUri}" data-cid="apex-logo" alt="Apex Conventions & Trade Fairs" style="height: 58px; width: auto; display: block; margin: 0 auto;" />
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Form Type Separation Banner -->
              <tr>
                <td style="padding: 14px 16px; background-color: #fafafa; border-bottom: 1px solid #e5e7eb;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="left" style="font-size: 12px; font-weight: bold; color: #E92924; text-transform: uppercase; letter-spacing: 0.8px;">
                        ${escapeHtml(formTypeBadgeEn)}
                      </td>
                      <td align="right" dir="rtl" style="font-size: 13px; font-weight: bold; color: #111111; font-family: 'Segoe UI', Tahoma, Arial, sans-serif;">
                        ${escapeHtml(formTypeBadgeAr)}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- English Greeting & Confirmation -->
              <tr>
                <td style="padding: 24px 4px 14px 4px; text-align: left; font-size: 15px; line-height: 1.7; color: #111111;">
                  <p style="margin: 0 0 14px 0;">Hello ${escapeHtml(fullName)},</p>
                  ${enLines.map((line) => `<p style="margin: 0 0 12px 0;">${line}</p>`).join("")}
                  ${brochureButtonHtml}
                </td>
              </tr>

              <!-- Arabic Greeting & Confirmation -->
              <tr>
                <td dir="rtl" style="padding: 14px 4px 24px 4px; text-align: right; font-family: 'Segoe UI', Tahoma, Arial, sans-serif; font-size: 15px; line-height: 1.8; color: #111111; border-bottom: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 14px 0;">مرحبا ${escapeHtml(fullName)}</p>
                  ${arLines.map((line) => `<p style="margin: 0 0 12px 0;">${line}</p>`).join("")}
                </td>
              </tr>

              <!-- Submitted Details Summary Separated by Section -->
              <tr>
                <td style="padding: 18px 4px 10px 4px;">
                  <div style="font-size: 12px; font-weight: bold; color: #6b7280; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px;">
                    Summary of Submitted Form (${escapeHtml(formTitle)})
                  </div>
                  ${sectionsHtml}
                </td>
              </tr>

              <!-- Footer Contact Bar -->
              <tr>
                <td style="padding: 18px 4px; border-top: 1px solid #e5e7eb; font-size: 13px; color: #555555; line-height: 1.6;">
                  <strong>${EVENT_CONFIG.fullName}</strong> &middot; ${EVENT_CONFIG.dates} &middot; ${EVENT_CONFIG.venue}<br />
                  Organized by <strong>${EVENT_CONFIG.organizer.name}</strong> | Phone: ${EVENT_CONFIG.organizer.phone} | Mobile: ${EVENT_CONFIG.organizer.mobile}<br />
                  Email: <a href="mailto:${EVENT_CONFIG.email}" style="color: #E92924; text-decoration: none;">${EVENT_CONFIG.email}</a> | Website: <a href="https://${EVENT_CONFIG.website}" style="color: #E92924; text-decoration: none;">${EVENT_CONFIG.website}</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const text = `[${formTypeBadgeEn} | ${formTypeBadgeAr}]

Hello ${fullName},

${enLines.map((l) => l.replace(/<[^>]+>/g, "")).join("\n")}
${brochureTextLink}
مرحبا ${fullName}

${arLines.map((l) => l.replace(/<[^>]+>/g, "")).join("\n")}
${sectionsText}
--------------------------------------------------------
${EVENT_CONFIG.fullName} | ${EVENT_CONFIG.dates}
${EVENT_CONFIG.venue}
Organized by ${EVENT_CONFIG.organizer.name}
Phone: ${EVENT_CONFIG.organizer.phone} | Mobile: ${EVENT_CONFIG.organizer.mobile}
Email: ${EVENT_CONFIG.email}
`;

  return { subject, html, text };
}

async function dispatchEmail({
  to,
  replyTo,
  subject,
  html,
  text,
  attachments = [],
  env,
  tag,
}: {
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
  attachments?: EmailAttachment[];
  env: Record<string, string | undefined>;
  tag: string;
}) {
  const smtpHost = (env["SMTP_HOST"] || "").trim();
  const smtpUser = (env["SMTP_USER"] || "").trim();
  const smtpPass = (env["SMTP_PASS"] || "").trim();
  const smtpPort = parseInt(env["SMTP_PORT"] || "465", 10);
  const smtpSecure =
    env["SMTP_SECURE"] !== undefined
      ? env["SMTP_SECURE"] === "true" || env["SMTP_SECURE"] === "1"
      : smtpPort === 465;
  const mailFromAddress = (env["MAIL_FROM"] || smtpUser || EVENT_CONFIG.email).trim();
  const mailFromName = (env["MAIL_FROM_NAME"] || "Turnkey Show Alamein").trim();
  const resendApiKey = (env["RESEND_API_KEY"] || "").trim();

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

    const attachmentSummary = attachments.length
      ? `Attachments: ${attachments.map((a) => `${a.filename} (${a.filePath})`).join(", ")}\n`
      : "";
    const meta = `To: ${to}\nReply-To: ${replyTo || ""}\nSubject: ${subject}\n${attachmentSummary}\n`;
    fs.writeFileSync(htmlPath, meta + html, "utf-8");
    fs.writeFileSync(txtPath, meta + text, "utf-8");
    console.log(`[Email Preview Generated] Saved to ${htmlPath}`);
  } catch (err) {
    console.error(`[Email Preview Error] Failed to write preview file:`, err);
  }

  // Replace data-cid images with cid: references for real email clients (like Gmail)
  const { turnkeyPath, apexPath } = getLogoPaths();
  let smtpHtml = html;
  const inlineAttachments: Array<{ filename: string; path: string; cid: string }> = [];

  if (turnkeyPath) {
    smtpHtml = smtpHtml.replace(/src="data:image\/png;base64,[^"]+"\s+data-cid="turnkey-logo"/g, 'src="cid:turnkey-logo"');
    inlineAttachments.push({
      filename: "turnkey-show-logo.png",
      path: turnkeyPath,
      cid: "turnkey-logo",
    });
  }
  if (apexPath) {
    smtpHtml = smtpHtml.replace(/src="data:image\/png;base64,[^"]+"\s+data-cid="apex-logo"/g, 'src="cid:apex-logo"');
    inlineAttachments.push({
      filename: "apex-logo.png",
      path: apexPath,
      cid: "apex-logo",
    });
  }

  // 1. Send via SMTP (Gmail / custom SMTP) if configured
  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"${mailFromName}" <${ smtpHost.includes("gmail") ? smtpUser : mailFromAddress }>`,
        to,
        replyTo: replyTo || EVENT_CONFIG.email,
        subject,
        text,
        html: smtpHtml,
        attachments: [
          ...inlineAttachments,
          ...attachments
            .filter((a) => fs.existsSync(a.filePath))
            .map((a) => ({
              filename: a.filename,
              path: a.filePath,
              contentType: a.contentType,
            })),
        ],
      });
      console.log(`[Email Sent] Delivered via SMTP (${smtpHost}:${smtpPort}) to ${to}`);
      return;
    } catch (err) {
      console.error(`[Email SMTP Error] Failed to deliver via ${smtpHost} to ${to}:`, err);
    }
  }

  // 2. Or send via Resend API if RESEND_API_KEY is configured
  if (resendApiKey) {
    try {
      const resendAttachments = attachments
        .filter((a) => fs.existsSync(a.filePath))
        .map((a) => ({
          filename: a.filename,
          content: fs.readFileSync(a.filePath).toString("base64"),
        }));
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `${mailFromName} <${mailFromAddress}>`,
          to: [to],
          reply_to: replyTo || EVENT_CONFIG.email,
          subject,
          html,
          text,
          attachments: resendAttachments.length ? resendAttachments : undefined,
        }),
      });
      if (res.ok) {
        console.log(`[Email Sent] Delivered via Resend API to ${to}`);
        return;
      } else {
        console.error(`[Email Resend Error]`, await res.text());
      }
    } catch (err) {
      console.error(`[Email Resend Error]`, err);
    }
  }

  console.warn(
    `[Email Notice] Real email delivery skipped because SMTP_USER / SMTP_PASS are not set in .env yet. Preview saved to .mail-preview/ for ${to}.`
  );
}
