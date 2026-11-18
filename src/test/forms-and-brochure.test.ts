import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import {
  generateBrochureToken,
  verifyBrochureToken,
  handleFormSubmission,
} from "../server/forms-handler";
import { handleBrochureDownload } from "../server/brochure-handler";

describe("Brochure Token HMAC & Verification", () => {
  const secret = "test-secret-key-12345";
  const email = "buyer@example.com";

  it("generates and verifies a valid unexpired token", () => {
    const futureExp = Date.now() + 3600 * 1000;
    const { token, exp } = generateBrochureToken(email, secret, futureExp);

    expect(token).toBeDefined();
    expect(token.length).toBe(64);

    const isValid = verifyBrochureToken(email, exp, token, secret);
    expect(isValid).toBe(true);
  });

  it("rejects an expired token", () => {
    const pastExp = Date.now() - 10000;
    const { token, exp } = generateBrochureToken(email, secret, pastExp);

    const isValid = verifyBrochureToken(email, exp, token, secret);
    expect(isValid).toBe(false);
  });

  it("rejects a tampered email or token", () => {
    const futureExp = Date.now() + 3600 * 1000;
    const { token, exp } = generateBrochureToken(email, secret, futureExp);

    expect(verifyBrochureToken("different@example.com", exp, token, secret)).toBe(false);
    expect(verifyBrochureToken(email, exp, token, "wrong-secret")).toBe(false);
    expect(verifyBrochureToken(email, exp, token.slice(0, -2) + "00", secret)).toBe(false);
  });
});

describe("Forms Submission Handler", () => {
  const mockEnv = {
    SITE_URL: "https://turnkeyshow.com",
    FORMS_TO_EMAIL: "info@turnkeyshow.com",
    BROCHURE_TOKEN_SECRET: "test-secret",
  };

  it("silently drops bot submission if honeypot is filled", async () => {
    const result = await handleFormSubmission(
      {
        form_key: "visitor_registration",
        name: "Bot User",
        email: "bot@example.com",
        website_hp: "http://spam-link.com",
      },
      "0.0.0.0",
      mockEnv,
    );

    expect(result.success).toBe(true);
    expect(result.message).toContain("Thank you");
  });

  it("successfully processes exhibitor_brochure and returns secure brochure download URL", async () => {
    const result = await handleFormSubmission(
      {
        form_key: "exhibitor_brochure",
        locale: "en",
        name: "Jane Doe",
        email: "jane@company.com",
        company: "Acme Interiors",
        phone: "+201012345678",
      },
      "0.0.0.0",
      mockEnv,
    );

    expect(result.success).toBe(true);
    expect(result.brochureUrl).toBeDefined();
    expect(result.brochureUrl).toContain("/api/brochure?token=");
    expect(result.brochureUrl).toContain("email=jane%40company.com");
    expect(result.locale).toBe("en");
  });

  it("sends English-only auto-reply for English forms and Arabic-only auto-reply for Arabic forms", async () => {
    const enResult = await handleFormSubmission(
      {
        form_key: "visitor_registration",
        locale: "en",
        fullName: "John Visitor",
        email: "john@example.com",
        mobile: "+201012345678",
        visitorCategory: "Developer",
      },
      "0.0.0.0",
      mockEnv,
    );
    expect(enResult.success).toBe(true);
    expect(enResult.locale).toBe("en");
    expect(enResult.registrationNumber).toMatch(/^TKS\d{4}$/);

    const arResult = await handleFormSubmission(
      {
        form_key: "visitor_registration",
        locale: "ar",
        fullName: "أحمد علي",
        email: "ahmed.ar@example.com",
        mobile: "+201012345678",
        visitorCategory: "مطور عقاري",
      },
      "0.0.0.0",
      mockEnv,
    );
    expect(arResult.success).toBe(true);
    expect(arResult.locale).toBe("ar");

    const previewDir = path.resolve(process.cwd(), ".mail-preview");
    const files = fs.readdirSync(previewDir).sort();
    const lastEnReply = files.filter((f) => f.endsWith("_reply_visitor_registration_en.html")).pop();
    const lastArReply = files.filter((f) => f.endsWith("_reply_visitor_registration_ar.html")).pop();

    expect(lastEnReply).toBeDefined();
    expect(lastArReply).toBeDefined();

    const enHtml = fs.readFileSync(path.join(previewDir, lastEnReply!), "utf-8");
    expect(enHtml).toContain('lang="en" dir="ltr"');
    expect(enHtml).toContain("Hello");
    expect(enHtml).toContain("John Visitor");
    expect(enHtml).not.toContain("مرحبا");

    const arHtml = fs.readFileSync(path.join(previewDir, lastArReply!), "utf-8");
    expect(arHtml).toContain('lang="ar" dir="rtl"');
    expect(arHtml).toContain("مرحبا");
    expect(arHtml).toContain("أحمد علي");
    expect(arHtml).not.toContain("Hello ");
  });

  it("successfully processes general_inquiry contact form", async () => {
    const result = await handleFormSubmission(
      {
        form_key: "general_inquiry",
        fullName: "Ahmed Ali",
        email: "ahmed@example.com",
        mobile: "+201012345678",
        subject: "Booth space pricing",
        message: "Hello, I would like to inquire about 36sqm booth options.",
      },
      "0.0.0.0",
      mockEnv,
    );

    expect(result.success).toBe(true);
  });

  it("rejects general_inquiry when mobile number is missing or invalid", async () => {
    const missing = await handleFormSubmission(
      {
        form_key: "general_inquiry",
        fullName: "Ahmed Ali",
        email: "ahmed@example.com",
        subject: "Booth space pricing",
        message: "Hello, I would like to inquire about 36sqm booth options.",
      },
      "0.0.0.0",
      mockEnv,
    );
    expect(missing.success).toBe(false);

    const invalid = await handleFormSubmission(
      {
        form_key: "general_inquiry",
        fullName: "Ahmed Ali",
        email: "ahmed@example.com",
        mobile: "123",
        subject: "Booth space pricing",
        message: "Hello, I would like to inquire about 36sqm booth options.",
      },
      "0.0.0.0",
      mockEnv,
    );
    expect(invalid.success).toBe(false);
  });
});

describe("Brochure Download Endpoint", () => {
  it("returns 403 HTML page when token is invalid or expired", async () => {
    const req = new Request(
      "https://turnkeyshow.com/api/brochure?token=invalid&email=test@example.com&exp=123",
    );
    const response = handleBrochureDownload(req, { BROCHURE_TOKEN_SECRET: "secret" });

    expect(response.status).toBe(403);
    const html = await response.text();
    expect(html).toContain("Brochure Link Expired");
  });

  it("returns Arabic 403 HTML page when lang=ar and token is invalid", async () => {
    const req = new Request(
      "https://turnkeyshow.com/api/brochure?token=invalid&email=test@example.com&exp=123&lang=ar",
    );
    const response = handleBrochureDownload(req, { BROCHURE_TOKEN_SECRET: "secret" });

    expect(response.status).toBe(403);
    const html = await response.text();
    expect(html).toContain('lang="ar" dir="rtl"');
    expect(html).toContain("انتهت صلاحية رابط التحميل");
  });

  it("serves the Arabic brochure PDF when lang=ar and token is valid", () => {
    const email = "buyer@example.com";
    const secret = "test-secret-key-12345";
    const { token, exp } = generateBrochureToken(email, secret, Date.now() + 60_000);
    const req = new Request(
      `https://turnkeyshow.com/api/brochure?token=${token}&email=${encodeURIComponent(email)}&exp=${exp}&lang=ar`,
    );
    const response = handleBrochureDownload(req, { BROCHURE_TOKEN_SECRET: secret });

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/pdf");
    expect(response.headers.get("Content-Disposition")).toContain(
      "Brochure Turnkey Show Arabic 2027.pdf",
    );
  });
});
