import fs from "fs";
import path from "path";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { EVENT_CONFIG } from "../config/event";

export interface FormSubmissionPayload {
  form_key: "exhibitor_booking" | "exhibitor_brochure" | "visitor_registration" | "general_inquiry";
  locale?: "en" | "ar" | string;
  lang?: "en" | "ar" | string;
  // Honeypot field (hidden in UI)
  website_hp?: string;
  website?: string;
  // Common fields
  name?: string;
  fullName?: string;
  full_name?: string;
  contact?: string;
  email: string;
  mobile?: string;
  phone?: string;
  company?: string;
  companyName?: string;
  title?: string;
  jobTitle?: string;
  job_title?: string;
  // Exhibitor booking
  companyWebsite?: string;
  websiteUrl?: string;
  country?: string;
  city?: string;
  standType?: string;
  standSize?: string;
  sectors?: string[];
  message?: string;
  // Visitor registration
  visitorCategory?: string;
  interest?: string;
  // General inquiry
  subject?: string;
}

interface SubmittedField {
  section?: string;
  sectionAr?: string;
  label: string;
  labelAr?: string;
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
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
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
  customExp?: number,
): { token: string; exp: number } {
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
  secret: string = DEFAULT_BROCHURE_SECRET,
): boolean {
  if (!email || !exp || !token) return false;
  if (Date.now() > exp) return false;
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

function getLogoPaths(): { turnkeyPath: string | undefined; apexPath: string | undefined } {
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

function getEmbeddedLogoDataUris(siteUrl: string): {
  turnkeyDataUri: string;
  apexDataUri: string;
} {
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

function findBrochurePdfPath(
  env: Record<string, string | undefined> = {},
  isAr = false,
): string | undefined {
  const filename = isAr
    ? "Brochure Turnkey Show Arabic 2027.pdf"
    : "Brochure Turnkey Show 2027.pdf";
  const candidates = [
    isAr ? env["ARABIC_BROCHURE_FILE_PATH"] : env["BROCHURE_FILE_PATH"],
    path.resolve(process.cwd(), "public", filename),
    path.resolve(process.cwd(), filename),
    path.resolve(process.cwd(), "..", filename),
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
  clientIp = "0.0.0.0",
  passedEnv: Record<string, string | undefined> = {},
): Promise<{
  success: boolean;
  message: string;
  error?: string | undefined;
  brochureUrl?: string | undefined;
  registrationNumber?: string | undefined;
  locale?: "en" | "ar" | undefined;
}> {
  const dotEnv = loadDotEnv();
  const env: Record<string, string | undefined> = {
    ...process.env,
    ...dotEnv,
    ...passedEnv,
  };

  const rawLocale = (payload.locale || payload.lang || "en").toString().toLowerCase().trim();
  const isAr = rawLocale === "ar";
  const locale: "en" | "ar" = isAr ? "ar" : "en";

  // 1. Honeypot check: silently succeed if bot filled the honeypot
  const honeypot = payload.website_hp || payload.website;
  if (honeypot && typeof honeypot === "string" && honeypot.trim().length > 0) {
    console.warn(`[Security] Honeypot triggered from ${clientIp}. Silently dropping.`);
    return {
      success: true,
      message: isAr ? "شكراً لتواصلكم معنا." : "Thank you for your submission.",
      locale,
    };
  }

  // 2. Validate email
  const email = sanitizeHeader(payload.email);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    const msg = isAr ? "يرجى إدخال بريد إلكتروني صحيح." : "Please provide a valid email address.";
    return { success: false, message: msg, error: msg };
  }

  // 3. Rate limiting (skip or soften in development)
  const isLocalDev =
    clientIp === "0.0.0.0" ||
    clientIp === "127.0.0.1" ||
    clientIp === "::1" ||
    clientIp === "localhost";
  if (!isLocalDev && (!checkRateLimit(clientIp, 15) || !checkRateLimit(email, 10))) {
    const msg = isAr
      ? "تم إرسال عدد كبير من الطلبات. يرجى الانتظار قليلاً قبل المحاولة مرة أخرى."
      : "Too many submissions. Please wait a little while before trying again.";
    return {
      success: false,
      message: msg,
      error: msg,
    };
  }

  const siteUrl = env["SITE_URL"] || dotEnv["SITE_URL"] || EVENT_CONFIG.siteUrl;
  const formsToEmail = env["FORMS_TO_EMAIL"] || dotEnv["FORMS_TO_EMAIL"] || EVENT_CONFIG.email;
  const brochureSecret =
    env["BROCHURE_TOKEN_SECRET"] || dotEnv["BROCHURE_TOKEN_SECRET"] || DEFAULT_BROCHURE_SECRET;

  let formTitle = "";
  let formTitleAr = "";
  let formPagePath = "";
  let classificationLabel = "";
  let subjectDetail = "";
  const submittedFields: SubmittedField[] = [];
  const registrationNumber = generateRegistrationNumber(email);

  const nameVal = (
    payload.fullName ||
    payload.name ||
    payload.contact ||
    payload.full_name ||
    ""
  ).trim();
  const companyVal = (payload.companyName || payload.company || "").trim();
  const mobileVal = (payload.mobile || payload.phone || "").trim();
  const titleVal = (payload.title || payload.jobTitle || payload.job_title || "").trim();

  const displayName = sanitizeHeader(nameVal || (isAr ? "عميلنا الكريم" : "Subscriber"));
  const displayCompany = sanitizeHeader(companyVal || "");

  // 4. Form-specific field extraction with clear section separation (English & Arabic labels)
  switch (payload.form_key) {
    case "exhibitor_booking": {
      formTitle = "FORM 1: BOOK YOUR SPACE (Exhibitor Application Form)";
      formTitleAr = "نموذج حجز مساحة عرض (طلب مشاركة عارض)";
      formPagePath = isAr ? "/ar/exhibit/book-your-space" : "/exhibit/book-your-space";
      classificationLabel = "EXHIBITOR · Book Your Space";
      subjectDetail = `${displayCompany || displayName} (${displayName})`;
      if (!companyVal) {
        const m = isAr ? "يرجى إدخال اسم الشركة." : "Company name is required.";
        return { success: false, message: m, error: m };
      }
      if (!nameVal) {
        const m = isAr ? "يرجى إدخال اسم مسؤول التواصل." : "Contact person name is required.";
        return { success: false, message: m, error: m };
      }
      if (!mobileVal) {
        const m = isAr ? "يرجى إدخال رقم الموبايل." : "Mobile number is required.";
        return { success: false, message: m, error: m };
      }

      const sec1En = "Section 1 — Exhibitor & Company Information";
      const sec1Ar = "القسم الأول — بيانات الشركة والعارض";
      const sec2En = "Section 2 — Exhibitor Profile & Stand Requirements";
      const sec2Ar = "القسم الثاني — ملف المشاركة ومتطلبات الجناح";

      submittedFields.push(
        {
          section: sec1En,
          sectionAr: sec1Ar,
          label: "Application Reference Number",
          labelAr: "رقم مرجع الطلب",
          value: registrationNumber,
        },
        {
          section: sec1En,
          sectionAr: sec1Ar,
          label: "Company Name",
          labelAr: "اسم الشركة",
          value: companyVal,
        },
        {
          section: sec1En,
          sectionAr: sec1Ar,
          label: "Company Website",
          labelAr: "الموقع الإلكتروني للشركة",
          value: payload.companyWebsite || payload.websiteUrl || "—",
        },
        {
          section: sec1En,
          sectionAr: sec1Ar,
          label: "Country",
          labelAr: "الدولة",
          value: payload.country || "—",
        },
        {
          section: sec1En,
          sectionAr: sec1Ar,
          label: "City",
          labelAr: "المدينة",
          value: payload.city || "—",
        },
        {
          section: sec1En,
          sectionAr: sec1Ar,
          label: "Phone / Mobile Number",
          labelAr: "رقم الهاتف / الموبايل",
          value: mobileVal,
        },
        {
          section: sec1En,
          sectionAr: sec1Ar,
          label: "Email Address",
          labelAr: "البريد الإلكتروني",
          value: email,
        },
        {
          section: sec1En,
          sectionAr: sec1Ar,
          label: "Contact Person Name",
          labelAr: "اسم مسؤول التواصل",
          value: nameVal,
        },
        {
          section: sec1En,
          sectionAr: sec1Ar,
          label: "Job Title",
          labelAr: "المسمى الوظيفي",
          value: titleVal || "—",
        },
        {
          section: sec2En,
          sectionAr: sec2Ar,
          label: "Core Industry Sectors",
          labelAr: "القطاعات الرئيسية",
          value: payload.sectors?.length
            ? payload.sectors.join(", ")
            : isAr
              ? "جميع القطاعات"
              : "All sectors",
        },
        {
          section: sec2En,
          sectionAr: sec2Ar,
          label: "Preferred Stand Type",
          labelAr: "نوع الجناح المفضل",
          value: payload.standType || "—",
        },
        {
          section: sec2En,
          sectionAr: sec2Ar,
          label: "Estimated Booth Space (SQM)",
          labelAr: "المساحة التقديرية المطلوبة (م²)",
          value: payload.standSize || "—",
        },
        {
          section: sec2En,
          sectionAr: sec2Ar,
          label: "Additional Requirements / Space Inquiries",
          labelAr: "متطلبات إضافية / استفسارات المساحة",
          value: payload.message || "—",
        },
      );
      break;
    }

    case "exhibitor_brochure": {
      formTitle = "FORM 2: DOWNLOAD BROCHURE (Sales Brochure Request Form)";
      formTitleAr = "نموذج تحميل البروشور التعريفي للمعرض";
      formPagePath = isAr ? "/ar/exhibit/download-brochure" : "/exhibit/download-brochure";
      classificationLabel = "EXHIBITOR · Sales Brochure Download";
      subjectDetail = `${displayCompany || displayName} (${displayName})`;
      if (!nameVal) {
        const m = isAr ? "يرجى إدخال الاسم." : "Name is required.";
        return { success: false, message: m, error: m };
      }
      if (!mobileVal) {
        const m = isAr ? "يرجى إدخال رقم الموبايل." : "Mobile number is required.";
        return { success: false, message: m, error: m };
      }
      if (!companyVal) {
        const m = isAr ? "يرجى إدخال اسم الشركة." : "Company name is required.";
        return { success: false, message: m, error: m };
      }

      const secEn = "Brochure Request Form Fields";
      const secAr = "بيانات طلب تحميل البروشور التعريفي";

      submittedFields.push(
        {
          section: secEn,
          sectionAr: secAr,
          label: "Reference Number",
          labelAr: "رقم المرجع",
          value: registrationNumber,
        },
        {
          section: secEn,
          sectionAr: secAr,
          label: "Your Name",
          labelAr: "الاسم الكامل",
          value: nameVal,
        },
        {
          section: secEn,
          sectionAr: secAr,
          label: "Mobile / Phone",
          labelAr: "رقم الموبايل / الهاتف",
          value: mobileVal,
        },
        {
          section: secEn,
          sectionAr: secAr,
          label: "Business Email",
          labelAr: "البريد الإلكتروني للعمل",
          value: email,
        },
        {
          section: secEn,
          sectionAr: secAr,
          label: "Company Name",
          labelAr: "اسم الشركة",
          value: companyVal,
        },
        {
          section: secEn,
          sectionAr: secAr,
          label: "Job Title",
          labelAr: "المسمى الوظيفي",
          value: titleVal || "—",
        },
      );
      break;
    }

    case "visitor_registration": {
      formTitle = "FORM 3: VISITOR REGISTRATION (Visitor Entry Badge Form)";
      formTitleAr = "نموذج تسجيل الزوار (بطاقة الدخول للمعرض)";
      formPagePath = isAr ? "/ar/visit/visitor-registration" : "/visit/visitor-registration";
      classificationLabel = "VISITOR · Registration";
      subjectDetail = `${displayName} (${registrationNumber})`;
      if (!nameVal) {
        const m = isAr ? "يرجى إدخال الاسم الكامل." : "Full name is required.";
        return { success: false, message: m, error: m };
      }
      const category = (payload.visitorCategory || payload.interest || "General Visitor").trim();

      const sec1En = "Section 1 — Visitor Personal & Contact Information";
      const sec1Ar = "القسم الأول — البيانات الشخصية وبيانات التواصل للزائر";
      const sec2En = "Section 2 — Visitor Profile & Interests";
      const sec2Ar = "القسم الثاني — فئة الزائر والقطاعات محل الاهتمام";

      submittedFields.push(
        {
          section: sec1En,
          sectionAr: sec1Ar,
          label: "Registration Number",
          labelAr: "رقم التسجيل",
          value: registrationNumber,
        },
        {
          section: sec1En,
          sectionAr: sec1Ar,
          label: "Full Name",
          labelAr: "الاسم الكامل",
          value: nameVal,
        },
        {
          section: sec1En,
          sectionAr: sec1Ar,
          label: "Email Address",
          labelAr: "البريد الإلكتروني",
          value: email,
        },
        {
          section: sec1En,
          sectionAr: sec1Ar,
          label: "Mobile Number",
          labelAr: "رقم الموبايل",
          value: mobileVal || "—",
        },
        {
          section: sec2En,
          sectionAr: sec2Ar,
          label: "Visitor Category",
          labelAr: "فئة الزائر",
          value: category,
        },
        {
          section: sec2En,
          sectionAr: sec2Ar,
          label: "Company / Organization",
          labelAr: "الشركة / المؤسسة",
          value: companyVal || "—",
        },
        {
          section: sec2En,
          sectionAr: sec2Ar,
          label: "Job Title",
          labelAr: "المسمى الوظيفي",
          value: titleVal || "—",
        },
        {
          section: sec2En,
          sectionAr: sec2Ar,
          label: "Sectors of Interest",
          labelAr: "القطاعات محل الاهتمام",
          value: payload.sectors?.length ? payload.sectors.join(", ") : "—",
        },
      );
      break;
    }

    case "general_inquiry": {
      formTitle = "FORM 4: CONTACT US (General Inquiry Form)";
      formTitleAr = "نموذج تواصل معنا (استفسار عام)";
      formPagePath = isAr ? "/ar/contact" : "/contact";
      classificationLabel = "GENERAL INQUIRY · Contact Us";
      subjectDetail = `${displayName} — ${sanitizeHeader(payload.subject)}`;
      if (!nameVal) {
        const m = isAr ? "يرجى إدخال الاسم الكامل." : "Full name is required.";
        return { success: false, message: m, error: m };
      }
      const mobileDigits = mobileVal.replace(/\D/g, "");
      if (!mobileVal) {
        const m = isAr ? "يرجى إدخال رقم الموبايل." : "Mobile number is required.";
        return { success: false, message: m, error: m };
      }
      if (
        !/^\+?[0-9\s\-().]{7,20}$/.test(mobileVal) ||
        mobileDigits.length < 7 ||
        mobileDigits.length > 15
      ) {
        const m = isAr ? "يرجى إدخال رقم موبايل صحيح." : "Please provide a valid mobile number.";
        return { success: false, message: m, error: m };
      }
      if (!payload.subject?.trim()) {
        const m = isAr ? "يرجى إدخال موضوع الرسالة." : "Subject is required.";
        return { success: false, message: m, error: m };
      }
      if (!payload.message?.trim()) {
        const m = isAr ? "يرجى كتابة نص الرسالة." : "Message is required.";
        return { success: false, message: m, error: m };
      }

      const sec1En = "Section 1 — Sender Contact Information";
      const sec1Ar = "القسم الأول — بيانات التواصل للمرسل";
      const sec2En = "Section 2 — Inquiry Subject & Message";
      const sec2Ar = "القسم الثاني — موضوع وتفاصيل الاستفسار";

      submittedFields.push(
        {
          section: sec1En,
          sectionAr: sec1Ar,
          label: "Inquiry Reference Number",
          labelAr: "رقم مرجع الاستفسار",
          value: registrationNumber,
        },
        {
          section: sec1En,
          sectionAr: sec1Ar,
          label: "Full Name",
          labelAr: "الاسم الكامل",
          value: nameVal,
        },
        {
          section: sec1En,
          sectionAr: sec1Ar,
          label: "Email Address",
          labelAr: "البريد الإلكتروني",
          value: email,
        },
        {
          section: sec1En,
          sectionAr: sec1Ar,
          label: "Mobile Number",
          labelAr: "رقم الموبايل",
          value: mobileVal,
        },
        {
          section: sec2En,
          sectionAr: sec2Ar,
          label: "Subject",
          labelAr: "الموضوع",
          value: payload.subject,
        },
        {
          section: sec2En,
          sectionAr: sec2Ar,
          label: "Message",
          labelAr: "الرسالة",
          value: payload.message,
        },
      );
      break;
    }

    default:
      return { success: false, message: "Invalid form key.", error: "Invalid form key." };
  }

  // 5. Generate brochure link & attachment if brochure download
  let brochureDownloadUrl = "";
  let fullBrochureEmailUrl = "";
  const userAttachments: EmailAttachment[] = [];

  if (payload.form_key === "exhibitor_brochure") {
    const { token, exp } = generateBrochureToken(email, brochureSecret);
    brochureDownloadUrl = `/api/brochure?token=${token}&email=${encodeURIComponent(email)}&exp=${exp}${isAr ? "&lang=ar" : ""}`;
    fullBrochureEmailUrl = `${siteUrl.replace(/\/$/, "")}${brochureDownloadUrl}`;

    const brochureFilePath = findBrochurePdfPath(env, isAr);
    if (brochureFilePath) {
      userAttachments.push({
        filename: isAr ? "Brochure Turnkey Show Arabic 2027.pdf" : "Brochure Turnkey Show 2027.pdf",
        contentType: "application/pdf",
        filePath: brochureFilePath,
      });
    }
  }

  // 6. Build Owner Notification Email (to info@turnkeyshow.com)
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
    isAr,
  });

  // 7. Build User Auto-Reply Email (English-only for EN forms, Arabic-only for AR forms, styled after Registration (updated).docx)
  const userAutoReply = buildAutoReplyHtml({
    form_key: payload.form_key,
    formTitle,
    formTitleAr,
    fullName: displayName,
    registrationNumber,
    submittedFields,
    brochureUrl: fullBrochureEmailUrl || brochureDownloadUrl,
    siteUrl,
    isAr,
  });

  // 8. Dispatch Both Emails (Owner + User Auto-Reply)
  await dispatchEmail({
    to: formsToEmail,
    replyTo: email,
    subject: teamSubject,
    html: teamEmail.html,
    text: teamEmail.text,
    env,
    tag: `team_${payload.form_key}_${locale}`,
  });

  await dispatchEmail({
    to: email,
    replyTo: EVENT_CONFIG.email,
    subject: userAutoReply.subject,
    html: userAutoReply.html,
    text: userAutoReply.text,
    attachments: userAttachments,
    env,
    tag: `reply_${payload.form_key}_${locale}`,
  });

  return {
    success: true,
    message: isAr
      ? "شكراً لك، تم استلام طلبك بنجاح."
      : "Thank you. Your submission has been received.",
    brochureUrl: brochureDownloadUrl || undefined,
    registrationNumber,
    locale,
  };
}

function renderGroupedSectionsHtmlAndText(
  submittedFields: SubmittedField[],
  forAr = false,
): {
  sectionsHtml: string;
  sectionsText: string;
} {
  const sectionsMap = new Map<string, SubmittedField[]>();
  for (const field of submittedFields) {
    const secName = forAr
      ? field.sectionAr || field.section || "البيانات المرسلة"
      : field.section || "Submitted Form Fields";
    const list = sectionsMap.get(secName) || [];
    list.push(field);
    sectionsMap.set(secName, list);
  }

  const borderSide = forAr ? "border-right: 4px solid #E92924;" : "border-left: 4px solid #E92924;";
  const textAlign = forAr ? "right" : "left";
  const dirAttr = forAr ? ' dir="rtl"' : "";
  const fontStack = forAr ? "'Segoe UI', Tahoma, Arial, sans-serif" : "Arial, sans-serif";

  let sectionsHtml = "";
  let sectionsText = "";

  for (const [sectionTitle, fields] of sectionsMap.entries()) {
    sectionsHtml += `
      <div${dirAttr} style="margin-top: 20px; margin-bottom: 8px; padding: 9px 14px; background-color: #080808; color: #ffffff; font-family: ${fontStack}; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.8px; text-align: ${textAlign}; ${borderSide}">
        ${escapeHtml(sectionTitle)}
      </div>
      <table${dirAttr} width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-collapse: collapse; font-family: ${fontStack}; font-size: 14px; margin-bottom: 16px;">
        ${fields
          .map(
            (f, idx) => `
          <tr style="background-color: ${idx % 2 === 0 ? "#fafafa" : "#ffffff"};">
            <td style="padding: 11px 14px; border: 1px solid #e5e7eb; width: 38%; font-weight: bold; color: #111111; vertical-align: top; text-align: ${textAlign};">
              ${escapeHtml(forAr ? f.labelAr || f.label : f.label)}
            </td>
            <td style="padding: 11px 14px; border: 1px solid #e5e7eb; color: #222222; vertical-align: top; white-space: pre-wrap; text-align: ${textAlign};">
              ${escapeHtml(f.value)}
            </td>
          </tr>`,
          )
          .join("")}
      </table>
    `;

    sectionsText += `\n=== ${sectionTitle.toUpperCase()} ===\n`;
    for (const f of fields) {
      const label = forAr ? f.labelAr || f.label : f.label;
      sectionsText += `${label}: ${f.value}\n----------------------------------------\n`;
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
  isAr,
}: {
  formTitle: string;
  formKey: string;
  formPagePath: string;
  classificationLabel: string;
  submittedFields: SubmittedField[];
  senderEmail: string;
  senderName: string;
  siteUrl: string;
  isAr: boolean;
}): { html: string; text: string } {
  const { turnkeyDataUri, apexDataUri } = getEmbeddedLogoDataUris(siteUrl);
  const cairoTime = getCairoTimeString();
  const { sectionsHtml, sectionsText } = renderGroupedSectionsHtmlAndText(submittedFields, false);
  const langLabel = isAr ? "Arabic (AR)" : "English (EN)";

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8" /></head>
    <body style="font-family: Arial, Helvetica, sans-serif; background-color: #f3f4f6; margin: 0; padding: 24px;">
      <div style="max-width: 680px; margin: 0 auto; background: #ffffff; border: 1px solid #d1d5db; border-top: 5px solid #E92924;">
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

        <div style="background-color: #fef2f2; border-bottom: 2px solid #E92924; padding: 18px 28px;">
          <div style="display: inline-block; padding: 4px 10px; background: #E92924; color: #ffffff; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
            ${escapeHtml(classificationLabel)}
          </div>
          <h2 style="margin: 0 0 6px 0; font-size: 20px; color: #080808; font-family: 'Arial Black', Arial, sans-serif;">
            ${escapeHtml(formTitle)}
          </h2>
          <div style="font-size: 13px; color: #374151; line-height: 1.6;">
            <strong>Form Identifier:</strong> <code>${escapeHtml(formKey)}</code> &nbsp;|&nbsp;
            <strong>Language:</strong> <code>${langLabel}</code> &nbsp;|&nbsp;
            <strong>Submitted From Page:</strong> <code>${escapeHtml(formPagePath)}</code><br />
            <strong>Submitted At:</strong> ${escapeHtml(cairoTime)}
          </div>
        </div>

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
LANGUAGE       : ${langLabel}
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
  formTitleAr,
  fullName,
  registrationNumber,
  submittedFields,
  brochureUrl,
  siteUrl,
  isAr,
}: {
  form_key: string;
  formTitle: string;
  formTitleAr: string;
  fullName: string;
  registrationNumber: string;
  submittedFields: SubmittedField[];
  brochureUrl?: string;
  siteUrl: string;
  isAr: boolean;
}): { subject: string; html: string; text: string } {
  const { turnkeyDataUri, apexDataUri } = getEmbeddedLogoDataUris(siteUrl);
  const { sectionsHtml, sectionsText } = renderGroupedSectionsHtmlAndText(submittedFields, isAr);

  let subject = "";
  let formTypeBadge = "";
  let bodyLines: string[] = [];
  let brochureButtonHtml = "";
  let brochureTextLink = "";

  if (isAr) {
    // Arabic-only Auto-Reply for Arabic form submissions (styled after Registration (updated).docx)
    switch (form_key) {
      case "visitor_registration":
        subject = "تأكيد تسجيل الزوار — معرض العلمين تيرن كي شو 2027";
        formTypeBadge = "تأكيد تسجيل الزوار";
        bodyLines = [
          `شكراً لتسجيل زيارة <strong style="color: #1D2228;">معرض العلمين تيرن كي شو 2027</strong>، رقم التسجيل الخاص بك هو : <strong style="color: #C00000;">${escapeHtml(registrationNumber)}</strong>.`,
          `نتطلع للترحيب بك خلال الفترة من <strong>06 – 09 مايو 2027</strong> بمركز العلمين الجديدة الدولي للمؤتمرات والمعارض – جمهورية مصر العربية.`,
          `يرجى إظهار تأكيد التسجيل الخاص بك لفريق تيرن كي شو 2027 عند الوصول لقاعات المعرض لتسهيل دخولك.`,
        ];
        break;

      case "exhibitor_brochure":
        subject = "الكتيب التعريفي الرسمي — معرض العلمين تيرن كي شو 2027";
        formTypeBadge = "تأكيد طلب وتحميل الكتيب التعريفي للمعرض";
        bodyLines = [
          `شكراً لطلب الكتيب التعريفي الخاص بـ <strong style="color: #1D2228;">معرض العلمين تيرن كي شو 2027</strong>، رقم المرجع الخاص بك هو : <strong style="color: #C00000;">${escapeHtml(registrationNumber)}</strong>.`,
          `تم إرفاق نسخة من الكتيب التعريفي الرسمي (PDF) مع هذا البريد الإلكتروني، كما يمكنك تحميله في أي وقت عبر الزر أدناه.`,
          `نتطلع للترحيب بك خلال الفترة من <strong>06 – 09 مايو 2027</strong> بمركز العلمين الجديدة الدولي للمؤتمرات والمعارض – جمهورية مصر العربية.`,
        ];
        brochureButtonHtml = `
          <div style="margin: 22px 0; text-align: right;">
            <a href="${escapeHtml(brochureUrl)}" target="_blank" style="background: #E92924; color: #ffffff; text-decoration: none; padding: 14px 28px; font-weight: bold; font-size: 14px; display: inline-block;">
              تحميل الكتيب التعريفي (PDF)
            </a>
          </div>
        `;
        brochureTextLink = `\nرابط تحميل الكتيب التعريفي (PDF): ${brochureUrl}\n`;
        break;

      case "exhibitor_booking":
        subject = "تأكيد طلب حجز مساحة عرض — معرض العلمين تيرن كي شو 2027";
        formTypeBadge = "تأكيد استلام طلب حجز مساحة عرض";
        bodyLines = [
          `شكراً لتقديم طلب حجز مساحة عرض في <strong style="color: #1D2228;">معرض العلمين تيرن كي شو 2027</strong>، رقم مرجع الطلب الخاص بك هو : <strong style="color: #C00000;">${escapeHtml(registrationNumber)}</strong>.`,
          `لقد تلقى فريق مبيعات المعرض تفاصيل طلبكم الموضحة أدناه، وسيتواصل معكم قريباً بمخطط القاعات وخيارات الأجنحة المتاحة.`,
          `نتطلع للترحيب بك خلال الفترة من <strong>06 – 09 مايو 2027</strong> بمركز العلمين الجديدة الدولي للمؤتمرات والمعارض – جمهورية مصر العربية.`,
        ];
        break;

      case "general_inquiry":
      default:
        subject = "تأكيد استلام استفساركم — معرض العلمين تيرن كي شو 2027";
        formTypeBadge = "تأكيد استلام استفساركم — تواصل معنا";
        bodyLines = [
          `شكراً لتواصلكم مع <strong style="color: #1D2228;">معرض العلمين تيرن كي شو 2027</strong>، رقم مرجع الاستفسار الخاص بك هو : <strong style="color: #C00000;">${escapeHtml(registrationNumber)}</strong>.`,
          `لقد تم استلام رسالتكم بنجاح وسيقوم فريق إدارة المعرض بمراجعتها والرد عليكم في أقرب وقت ممكن.`,
          `نتطلع للترحيب بك خلال الفترة من <strong>06 – 09 مايو 2027</strong> بمركز العلمين الجديدة الدولي للمؤتمرات والمعارض – جمهورية مصر العربية.`,
        ];
        break;
    }

    const html = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${escapeHtml(subject)}</title>
      </head>
      <body dir="rtl" style="margin: 0; padding: 0; background-color: #ffffff; font-family: 'Segoe UI', Tahoma, Arial, sans-serif; color: #1D2228; -webkit-font-smoothing: antialiased;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" dir="rtl" style="background-color: #ffffff; padding: 24px 12px;">
          <tr>
            <td align="center">
              <table width="680" cellpadding="0" cellspacing="0" border="0" dir="rtl" style="max-width: 680px; width: 100%; background-color: #ffffff; border: 1px solid #e5e7eb; border-top: 4px solid #E92924; padding: 12px 24px;">
                <tr>
                  <td style="padding: 16px 4px 24px 4px; border-bottom: 2px solid #e5e7eb;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" dir="rtl">
                      <tr>
                        <td align="right" valign="middle" style="width: 50%;">
                          <img src="${turnkeyDataUri}" data-cid="turnkey-logo" alt="Turnkey Show Alamein" style="height: 110px; width: auto; display: block;" />
                        </td>
                        <td align="left" valign="middle" style="width: 50%; text-align: left;">
                          <div style="display: inline-block; text-align: center;">
                            <div style="font-size: 11px; font-weight: bold; color: #666666; margin-bottom: 6px;">
                              تنظيم
                            </div>
                            <img src="${apexDataUri}" data-cid="apex-logo" alt="Apex Conventions & Trade Fairs" style="height: 58px; width: auto; display: block; margin: 0 auto;" />
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td dir="rtl" style="padding: 14px 16px; background-color: #fafafa; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 13px; font-weight: bold; color: #E92924;">
                    ${escapeHtml(formTypeBadge)}
                  </td>
                </tr>

                <tr>
                  <td dir="rtl" style="padding: 24px 4px 24px 4px; text-align: right; font-size: 15px; line-height: 1.85; color: #1D2228; border-bottom: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 14px 0;">مرحبا <strong style="color: #C00000;">${escapeHtml(fullName)}</strong>،</p>
                    ${bodyLines.map((line) => `<p style="margin: 0 0 14px 0;">${line}</p>`).join("")}
                    ${brochureButtonHtml}
                  </td>
                </tr>

                <tr>
                  <td dir="rtl" style="padding: 18px 4px 10px 4px; text-align: right;">
                    <div style="font-size: 12px; font-weight: bold; color: #6b7280; margin-bottom: 4px;">
                      ملخص البيانات المرسلة (${escapeHtml(formTitleAr)})
                    </div>
                    ${sectionsHtml}
                  </td>
                </tr>

                <tr>
                  <td dir="rtl" style="padding: 18px 4px; border-top: 1px solid #e5e7eb; text-align: right; font-size: 13px; color: #555555; line-height: 1.8;">
                    <strong>معرض العلمين تيرن كي شو ٢٠٢٧</strong> &middot; ٠٦ – ٠٩ مايو ٢٠٢٧ &middot; مركز العلمين الدولي للمؤتمرات والمعارض<br />
                    تنظيم <strong>${EVENT_CONFIG.organizer.name}</strong> | هاتف: <span dir="ltr">${EVENT_CONFIG.organizer.phone}</span> | موبايل: <span dir="ltr">${EVENT_CONFIG.organizer.mobile}</span><br />
                    البريد الإلكتروني: <a href="mailto:${EVENT_CONFIG.email}" style="color: #E92924; text-decoration: none;">${EVENT_CONFIG.email}</a> | الموقع الإلكتروني: <a href="https://${EVENT_CONFIG.website}/ar" style="color: #E92924; text-decoration: none;">${EVENT_CONFIG.website}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const text = `[${formTypeBadge}]

مرحبا ${fullName}،

${bodyLines.map((l) => l.replace(/<[^>]+>/g, "")).join("\n")}
${brochureTextLink}
${sectionsText}
--------------------------------------------------------
معرض العلمين تيرن كي شو 2027 | 06 – 09 مايو 2027
مركز العلمين الدولي للمؤتمرات والمعارض – جمهورية مصر العربية
تنظيم ${EVENT_CONFIG.organizer.name}
هاتف: ${EVENT_CONFIG.organizer.phone} | موبايل: ${EVENT_CONFIG.organizer.mobile}
البريد الإلكتروني: ${EVENT_CONFIG.email}
`;

    return { subject, html, text };
  }

  // English-only Auto-Reply for English form submissions (styled after Registration (updated).docx)
  switch (form_key) {
    case "visitor_registration":
      subject = "Visitor Registration Confirmation — Turnkey Show Alamein 2027";
      formTypeBadge = "VISITOR REGISTRATION CONFIRMATION";
      bodyLines = [
        `Thanks for registering to <strong style="color: #1D2228;">Turnkey Show Alamein 2027</strong>, Your registration number is: <strong style="color: #C00000;">${escapeHtml(registrationNumber)}.</strong>`,
        `Looking forward welcoming you during <strong>06 – 09 May 2027</strong> at New Alamein International Convention & Exhibition Center - Arab Republic of Egypt.`,
        `Please show your registration confirmation to Turnkey Show 2027 team upon arrival that will ease up your access.`,
      ];
      break;

    case "exhibitor_brochure":
      subject = "Official Sales Brochure — Turnkey Show Alamein 2027";
      formTypeBadge = "SALES BROCHURE DOWNLOAD & REQUEST CONFIRMATION";
      bodyLines = [
        `Thanks for requesting the official brochure for <strong style="color: #1D2228;">Turnkey Show Alamein 2027</strong>, Your reference number is: <strong style="color: #C00000;">${escapeHtml(registrationNumber)}.</strong>`,
        `We have attached a copy of <strong>Brochure Turnkey Show 2027.pdf</strong> directly to this email, and you can also download it anytime using the button below.`,
        `Looking forward welcoming you during <strong>06 – 09 May 2027</strong> at New Alamein International Convention & Exhibition Center - Arab Republic of Egypt.`,
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
      formTypeBadge = "EXHIBITOR SPACE BOOKING APPLICATION";
      bodyLines = [
        `Thanks for applying to exhibit at <strong style="color: #1D2228;">Turnkey Show Alamein 2027</strong>, Your application reference number is: <strong style="color: #C00000;">${escapeHtml(registrationNumber)}.</strong>`,
        `Our exhibition sales team has received your space booking details below and will contact you shortly with stand options and floor plans.`,
        `Looking forward welcoming you during <strong>06 – 09 May 2027</strong> at New Alamein International Convention & Exhibition Center - Arab Republic of Egypt.`,
      ];
      break;

    case "general_inquiry":
    default:
      subject = "We Received Your Inquiry — Turnkey Show Alamein 2027";
      formTypeBadge = "CONTACT US — GENERAL INQUIRY CONFIRMATION";
      bodyLines = [
        `Thanks for contacting <strong style="color: #1D2228;">Turnkey Show Alamein 2027</strong>, Your inquiry reference number is: <strong style="color: #C00000;">${escapeHtml(registrationNumber)}.</strong>`,
        `We have received your message and our team will review your inquiry and get back to you shortly.`,
        `Looking forward welcoming you during <strong>06 – 09 May 2027</strong> at New Alamein International Convention & Exhibition Center - Arab Republic of Egypt.`,
      ];
      break;
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en" dir="ltr">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${escapeHtml(subject)}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: Helvetica, Calibri, Arial, sans-serif; color: #1D2228; -webkit-font-smoothing: antialiased;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 24px 12px;">
        <tr>
          <td align="center">
            <table width="680" cellpadding="0" cellspacing="0" border="0" style="max-width: 680px; width: 100%; background-color: #ffffff; border: 1px solid #e5e7eb; border-top: 4px solid #E92924; padding: 12px 24px;">
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

              <tr>
                <td style="padding: 14px 16px; background-color: #fafafa; border-bottom: 1px solid #e5e7eb; text-align: left; font-size: 12px; font-weight: bold; color: #E92924; text-transform: uppercase; letter-spacing: 0.8px;">
                  ${escapeHtml(formTypeBadge)}
                </td>
              </tr>

              <tr>
                <td style="padding: 24px 4px 24px 4px; text-align: left; font-size: 15px; line-height: 1.75; color: #1D2228; border-bottom: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 14px 0;">Hello <strong style="color: #C00000;">${escapeHtml(fullName)},</strong></p>
                  ${bodyLines.map((line) => `<p style="margin: 0 0 14px 0;">${line}</p>`).join("")}
                  ${brochureButtonHtml}
                </td>
              </tr>

              <tr>
                <td style="padding: 18px 4px 10px 4px;">
                  <div style="font-size: 12px; font-weight: bold; color: #6b7280; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px;">
                    Summary of Submitted Form (${escapeHtml(formTitle)})
                  </div>
                  ${sectionsHtml}
                </td>
              </tr>

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

  const text = `[${formTypeBadge}]

Hello ${fullName},

${bodyLines.map((l) => l.replace(/<[^>]+>/g, "")).join("\n")}
${brochureTextLink}
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

  // Replace data-cid images with cid: references for real email clients
  const { turnkeyPath, apexPath } = getLogoPaths();
  let smtpHtml = html;
  const inlineAttachments: Array<{ filename: string; path: string; cid: string }> = [];

  if (turnkeyPath) {
    smtpHtml = smtpHtml.replace(
      /src="data:image\/png;base64,[^"]+"\s+data-cid="turnkey-logo"/g,
      'src="cid:turnkey-logo"',
    );
    inlineAttachments.push({
      filename: "turnkey-show-logo.png",
      path: turnkeyPath,
      cid: "turnkey-logo",
    });
  }
  if (apexPath) {
    smtpHtml = smtpHtml.replace(
      /src="data:image\/png;base64,[^"]+"\s+data-cid="apex-logo"/g,
      'src="cid:apex-logo"',
    );
    inlineAttachments.push({
      filename: "apex-logo.png",
      path: apexPath,
      cid: "apex-logo",
    });
  }

  // 1. Send via SMTP if configured (skip network in Vitest runs)
  const isVitest = Boolean(process.env["VITEST"]);
  if (!isVitest && smtpHost && smtpUser && smtpPass && !smtpPass.startsWith("[PASTE_")) {
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
        from: `"${mailFromName}" <${smtpHost.includes("gmail") ? smtpUser : mailFromAddress}>`,
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
  if (!isVitest && resendApiKey) {
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

  console.warn(`[Email Notice] Preview saved to .mail-preview/ for ${to}.`);
}
