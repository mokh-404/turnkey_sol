import fs from "fs";
import path from "path";
import { verifyBrochureToken, DEFAULT_BROCHURE_SECRET } from "./forms-handler";

export function handleBrochureDownload(request: Request, env: Record<string, string | undefined> = {}): Response {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") || "";
  const email = url.searchParams.get("email") || "";
  const expStr = url.searchParams.get("exp") || "0";
  const exp = parseInt(expStr, 10);
  const isAr = url.searchParams.get("lang") === "ar";

  const secret = env["BROCHURE_TOKEN_SECRET"] || DEFAULT_BROCHURE_SECRET;

  // Check token validity
  const isValid = verifyBrochureToken(email, exp, token, secret);
  if (!isValid) {
    const expiredTitle = isAr ? "انتهت صلاحية رابط التحميل | معرض تيرن كي" : "Download Link Expired | Turnkey Show";
    const expiredHeading = isAr ? "انتهت صلاحية رابط التحميل" : "Brochure Link Expired";
    const expiredBody = isAr
      ? "انتهت صلاحية هذا الرابط أو أنه غير صالح. يرجى طلب نسخة جديدة عبر نموذج تحميل البروشور."
      : "This download link has expired or is invalid. Please request a new copy using the brochure download form.";
    const expiredCta = isAr ? "طلب البروشور" : "Request Brochure";
    const retryPath = isAr ? "/ar/exhibit/download-brochure" : "/exhibit/download-brochure";

    return new Response(
      `<!DOCTYPE html>
      <html lang="${isAr ? "ar" : "en"}" dir="${isAr ? "rtl" : "ltr"}">
      <head>
        <title>${expiredTitle}</title>
        <style>
          body { font-family: ${isAr ? "'Noto Kufi Arabic', sans-serif" : "sans-serif"}; background: #080808; color: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
          .card { background: #161616; border: 1px solid #333; padding: 40px; max-width: 480px; text-align: center; }
          h2 { color: #E92824; margin-top: 0; }
          p { color: #aaa; line-height: 1.6; }
          a { display: inline-block; margin-top: 20px; background: #E92824; color: #fff; padding: 12px 24px; text-decoration: none; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>${expiredHeading}</h2>
          <p>${expiredBody}</p>
          <a href="${retryPath}">${expiredCta}</a>
        </div>
      </body>
      </html>`,
      {
        status: 403,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  }

  // Find brochure file
  const candidatePaths = isAr
    ? [
        env["ARABIC_BROCHURE_FILE_PATH"],
        path.resolve(process.cwd(), "public", "Brochure Turnkey Show Arabic 2027.pdf"),
        path.resolve(process.cwd(), "Brochure Turnkey Show Arabic 2027.pdf"),
        path.resolve(process.cwd(), "..", "Brochure Turnkey Show Arabic 2027_compressed.pdf"),
        path.resolve(process.cwd(), "..", "Brochure Turnkey Show Arabic 2027.pdf"),
        "z:\\molla\\Turnkey_Developer_Handoff\\red-thread-visitor-guide\\public\\Brochure Turnkey Show Arabic 2027.pdf",
        "z:\\molla\\Turnkey_Developer_Handoff\\Brochure Turnkey Show Arabic 2027_compressed.pdf",
      ].filter(Boolean) as string[]
    : [
        env["BROCHURE_FILE_PATH"],
        path.resolve(process.cwd(), "public", "Brochure Turnkey Show 2027.pdf"),
        path.resolve(process.cwd(), "Brochure Turnkey Show 2027.pdf"),
        path.resolve(process.cwd(), "..", "Brochure Turnkey Show 2027_compressed.pdf"),
        path.resolve(process.cwd(), "..", "Brochure Turnkey Show 2027.pdf"),
        "z:\\molla\\Turnkey_Developer_Handoff\\red-thread-visitor-guide\\public\\Brochure Turnkey Show 2027.pdf",
        "z:\\molla\\Turnkey_Developer_Handoff\\Brochure Turnkey Show 2027_compressed.pdf",
        "z:\\molla\\Turnkey_Developer_Handoff\\Brochure Turnkey Show 2027.pdf",
      ].filter(Boolean) as string[];

  const downloadFilename = isAr
    ? "Brochure Turnkey Show Arabic 2027.pdf"
    : "Brochure Turnkey Show 2027.pdf";

  let filePath = candidatePaths.find((p) => fs.existsSync(p));

  if (!filePath) {
    console.error(`[Brochure] Could not locate ${downloadFilename} on disk.`);
    return new Response("Brochure file is temporarily unavailable.", { status: 404 });
  }

  const stat = fs.statSync(filePath);
  const stream = fs.createReadStream(filePath);

  // Convert Node ReadStream to Web ReadableStream
  const webStream = new ReadableStream({
    start(controller) {
      stream.on("data", (chunk) => controller.enqueue(chunk));
      stream.on("end", () => controller.close());
      stream.on("error", (err) => controller.error(err));
    },
    cancel() {
      stream.destroy();
    },
  });

  return new Response(webStream, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${downloadFilename}"`,
      "Content-Length": stat.size.toString(),
      "Cache-Control": "private, max-age=3600",
    },
  });
}

