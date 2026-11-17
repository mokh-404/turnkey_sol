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
    const futureExp = Date.now() + 3600 * 1000; // 1 hour future
    const { token, exp } = generateBrochureToken(email, secret, futureExp);

    expect(token).toBeDefined();
    expect(token.length).toBe(64); // SHA256 hex string

    const isValid = verifyBrochureToken(email, exp, token, secret);
    expect(isValid).toBe(true);
  });

  it("rejects an expired token", () => {
    const pastExp = Date.now() - 10000; // in the past
    const { token, exp } = generateBrochureToken(email, secret, pastExp);

    const isValid = verifyBrochureToken(email, exp, token, secret);
    expect(isValid).toBe(false);
  });

  it("rejects a tampered email or token", () => {
    const futureExp = Date.now() + 3600 * 1000;
    const { token, exp } = generateBrochureToken(email, secret, futureExp);

    // Tampered email
    expect(verifyBrochureToken("different@example.com", exp, token, secret)).toBe(false);

    // Tampered secret
    expect(verifyBrochureToken(email, exp, token, "wrong-secret")).toBe(false);

    // Tampered token
    expect(verifyBrochureToken(email, exp, token.slice(0, -2) + "00", secret)).toBe(false);
  });
});

describe("Forms Submission Handler", () => {
  const mockEnv = {
    SITE_URL: "http://localhost:8081",
    FORMS_TO_EMAIL: "mustafa.khafaga@gmail.com",
    BROCHURE_TOKEN_SECRET: "test-secret",
  };

  it("silently drops bot submission if honeypot is filled", async () => {
    const result = await handleFormSubmission(
      {
        form_key: "visitor_registration",
        name: "Bot User",
        email: "bot@example.com",
        website_hp: "http://spam-link.com", // honeypot
      },
      "127.0.0.1",
      mockEnv
    );

    expect(result.success).toBe(true);
    expect(result.message).toContain("Thank you");
  });

  it("successfully processes exhibitor_brochure and returns secure brochure download URL", async () => {
    const result = await handleFormSubmission(
      {
        form_key: "exhibitor_brochure",
        name: "Jane Doe",
        email: "jane@company.com",
        company: "Acme Interiors",
        phone: "+201012345678",
      },
      "127.0.0.1",
      mockEnv
    );

    expect(result.success).toBe(true);
    expect(result.brochureUrl).toBeDefined();
    expect(result.brochureUrl).toContain("/api/brochure?token=");
    expect(result.brochureUrl).toContain("email=jane%40company.com");
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
      "127.0.0.1",
      mockEnv
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
      "127.0.0.1",
      mockEnv
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
      "127.0.0.1",
      mockEnv
    );
    expect(invalid.success).toBe(false);
  });
});

describe("Brochure Download Endpoint", () => {
  it("returns 403 HTML page when token is invalid or expired", async () => {
    const req = new Request("http://localhost:8081/api/brochure?token=invalid&email=test@example.com&exp=123");
    const response = handleBrochureDownload(req, { BROCHURE_TOKEN_SECRET: "secret" });

    expect(response.status).toBe(403);
    const html = await response.text();
    expect(html).toContain("Brochure Link Expired");
  });

  it("returns Arabic 403 HTML page when lang=ar and token is invalid", async () => {
    const req = new Request("http://localhost:8081/api/brochure?token=invalid&email=test@example.com&exp=123&lang=ar");
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
      `http://localhost:8081/api/brochure?token=${token}&email=${encodeURIComponent(email)}&exp=${exp}&lang=ar`,
    );
    const response = handleBrochureDownload(req, { BROCHURE_TOKEN_SECRET: secret });

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/pdf");
    expect(response.headers.get("Content-Disposition")).toContain("Brochure Turnkey Show Arabic 2027.pdf");
  });
});
