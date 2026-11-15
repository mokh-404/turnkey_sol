import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import venueImage from "@/assets/venue.webp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { validateContactFields } from "@/lib/formAlerts";
import { PageHero, Reveal, SiteLayout } from "@/components/SiteLayout";
import { EVENT_CONFIG, SHOW_SECTORS } from "@/config/event";

export const Route = createFileRoute("/exhibit/book-your-space")({
  component: BookYourSpacePage,
  head: () => ({
    meta: [
      { title: "Book Your Space | Exhibit | Turnkey Show Alamein 2027" },
      {
        name: "description",
        content:
          "Book your exhibition space at Turnkey Show 2027. Contact our sales team for floor plans, stand options, and custom packages.",
      },
      { property: "og:title", content: "Book Your Space | Exhibit" },
      { property: "og:type", content: "website" },
    ],
  }),
});

type FormStatus = "idle" | "sending" | "success" | "error";

const COUNTRIES = [
  "Egypt",
  "Saudi Arabia",
  "United Arab Emirates",
  "Kuwait",
  "Qatar",
  "Bahrain",
  "Oman",
  "Jordan",
  "Lebanon",
  "Turkey",
  "Italy",
  "Germany",
  "Spain",
  "United Kingdom",
  "United States",
  "China",
  "Other",
];

const SECTORS_LIST = SHOW_SECTORS;

function BookYourSpacePage() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [country, setCountry] = useState("Egypt");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  function toggleSector(sector: string) {
    setSelectedSectors((prev) =>
      prev.includes(sector) ? prev.filter((s) => s !== sector) : [...prev, sector]
    );
    if (selectedSectors.length === 0) {
      setFieldErrors((prev) => ({ ...prev, sectors: "" }));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");

    const form = e.currentTarget;
    if (!validateContactFields(form)) {
      setStatus("idle");
      return;
    }

    // Validate required fields
    const required: Array<{ name: string; label: string }> = [
      { name: "companyName", label: "Company Name" },
      { name: "companyWebsite", label: "Company Website" },
      { name: "city", label: "City" },
      { name: "phone", label: "Phone Number" },
      { name: "email", label: "Email" },
      { name: "contactName", label: "Contact Person Name" },
      { name: "jobTitle", label: "Job Title" },
    ];

    const errors: Record<string, string> = {};
    for (const field of required) {
      const el = form.elements.namedItem(field.name) as HTMLInputElement | null;
      if (!el || !el.value.trim()) {
        errors[field.name] = `${field.label} is required.`;
      }
    }
    // Email format
    const emailEl = form.elements.namedItem("email") as HTMLInputElement | null;
    if (emailEl && emailEl.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
      errors["email"] = "Please enter a valid email address.";
    }
    if (selectedSectors.length === 0) {
      errors["sectors"] = "Please select at least one sector.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setStatus("error");
      setErrorMsg("Please correct the highlighted fields above.");
      return;
    }

    setFieldErrors({});
    setStatus("sending");

    const data = {
      form_key: "exhibitor_booking",
      companyName: (form.elements.namedItem("companyName") as HTMLInputElement).value,
      companyWebsite: (form.elements.namedItem("companyWebsite") as HTMLInputElement).value,
      country: country,
      city: (form.elements.namedItem("city") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      contact: (form.elements.namedItem("contactName") as HTMLInputElement).value,
      title: (form.elements.namedItem("jobTitle") as HTMLInputElement).value,
      linkedin: (form.elements.namedItem("linkedin") as HTMLInputElement).value,
      sectors: selectedSectors,
      standType: (form.elements.namedItem("standType") as HTMLSelectElement)?.value || "Space Only",
      standSize: (form.elements.namedItem("standSize") as HTMLInputElement)?.value || "",
      message: (form.elements.namedItem("message") as HTMLTextAreaElement)?.value || "",
      website_hp: (form.elements.namedItem("website") as HTMLInputElement)?.value || "", // honeypot
    };

    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(json.message ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  }

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Book Your Space"
        title={"SECURE YOUR EXHIBITION SPACE\nAT TURNKEY SHOW 2027."}
        description={`${EVENT_CONFIG.dates} · ${EVENT_CONFIG.venue}`}
        image={venueImage}
        imageAlt="Al Alamein International Conference & Exhibition Center"
        primaryBtn={{ label: "Fill the form below", href: "#booking-form-wrap" }}
        secondaryBtn={{ label: "Download brochure", href: "/exhibit/download-brochure" }}
      />

      <section className="page-width booking-page-wrap" id="booking-form-wrap" style={{ paddingTop: "clamp(2.5rem, 5vw, 4.5rem)", paddingBottom: "clamp(2.5rem, 5vw, 4.5rem)" }}>
        <Reveal>
          <div className="booking-intro-banner" style={{ marginBottom: "2rem", borderBottom: "1px solid #e5e7eb", paddingBottom: "1.5rem" }}>
            <p style={{ fontSize: "1.2rem", fontWeight: 700, color: "#111111", marginBottom: "0.5rem" }}>
              This form is not a contract.
            </p>
            <p style={{ fontSize: "0.95rem", color: "#666666" }}>
              &ldquo;*&rdquo; indicates required fields
            </p>
          </div>
        </Reveal>

        <Reveal>
          {status === "success" ? (
            <div className="form-success-message">
              <h3>Exhibitor Application Received</h3>
              <p>
                Thank you for applying to exhibit at Turnkey Show 2027. Our exhibition sales team will review your application and contact you promptly with stand options, hall floor plans, and pricing packages.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="book-space-custom-form" noValidate>
              {/* Honeypot */}
              <input
                type="text"
                name="website"
                aria-hidden="true"
                tabIndex={-1}
                autoComplete="off"
                style={{ position: "absolute", left: "-9999px", opacity: 0 }}
              />

              {/* Section 1: Exhibitor Information */}
              <div className="form-section-block" style={{ marginBottom: "3rem" }}>
                <h3 style={{ color: "var(--tk-red)", fontSize: "1.5rem", fontWeight: 900, marginBottom: "1.5rem", textTransform: "none" }}>
                  Exhibitor Information
                </h3>

                <div className="form-two-col-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
                  <div className="form-field">
                    <label htmlFor="companyName" style={{ fontWeight: 700, fontSize: "0.95rem", display: "block", marginBottom: "0.5rem" }}>
                      Company Name *
                    </label>
                    <Input id="companyName" name="companyName" placeholder="Your registered company name" required className={fieldErrors["companyName"] ? "field-invalid" : ""} />
                    {fieldErrors["companyName"] && <p className="field-error">{fieldErrors["companyName"]}</p>}
                  </div>
                  <div className="form-field">
                    <label htmlFor="companyWebsite" style={{ fontWeight: 700, fontSize: "0.95rem", display: "block", marginBottom: "0.5rem" }}>
                      Company Website *
                    </label>
                    <Input id="companyWebsite" name="companyWebsite" placeholder="e.g. https://www.company.com" required className={fieldErrors["companyWebsite"] ? "field-invalid" : ""} />
                    {fieldErrors["companyWebsite"] && <p className="field-error">{fieldErrors["companyWebsite"]}</p>}
                  </div>
                </div>

                <div className="form-two-col-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
                  <div className="form-field">
                    <label htmlFor="country" style={{ fontWeight: 700, fontSize: "0.95rem", display: "block", marginBottom: "0.5rem" }}>
                      Country *
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                      style={{
                        height: "46px",
                        width: "100%",
                        borderRadius: "0",
                        border: "1px solid #d1d5db",
                        padding: "0 14px",
                        background: "#ffffff",
                        fontSize: "0.95rem",
                      }}
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-field">
                    <label htmlFor="city" style={{ fontWeight: 700, fontSize: "0.95rem", display: "block", marginBottom: "0.5rem" }}>
                      City *
                    </label>
                    <Input id="city" name="city" placeholder="e.g. Cairo, Dubai, Riyadh" required className={fieldErrors["city"] ? "field-invalid" : ""} />
                    {fieldErrors["city"] && <p className="field-error">{fieldErrors["city"]}</p>}
                  </div>
                </div>

                <div className="form-two-col-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
                  <div className="form-field">
                    <label htmlFor="phone" style={{ fontWeight: 700, fontSize: "0.95rem", display: "block", marginBottom: "0.5rem" }}>
                      Phone Number *
                    </label>
                    <Input id="phone" name="phone" type="tel" placeholder="+20 xxx xxx xxxx" required className={fieldErrors["phone"] ? "field-invalid" : ""} />
                    {fieldErrors["phone"] && <p className="field-error">{fieldErrors["phone"]}</p>}
                  </div>
                  <div className="form-field">
                    <label htmlFor="email" style={{ fontWeight: 700, fontSize: "0.95rem", display: "block", marginBottom: "0.5rem" }}>
                      Email *
                    </label>
                    <Input id="email" name="email" type="email" placeholder="you@company.com" required className={fieldErrors["email"] ? "field-invalid" : ""} />
                    {fieldErrors["email"] && <p className="field-error">{fieldErrors["email"]}</p>}
                  </div>
                </div>

                <div className="form-two-col-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
                  <div className="form-field">
                    <label htmlFor="contactName" style={{ fontWeight: 700, fontSize: "0.95rem", display: "block", marginBottom: "0.5rem" }}>
                      Contact Person Name *
                    </label>
                    <Input id="contactName" name="contactName" placeholder="Full name of representative" required className={fieldErrors["contactName"] ? "field-invalid" : ""} />
                    {fieldErrors["contactName"] && <p className="field-error">{fieldErrors["contactName"]}</p>}
                  </div>
                  <div className="form-field">
                    <label htmlFor="jobTitle" style={{ fontWeight: 700, fontSize: "0.95rem", display: "block", marginBottom: "0.5rem" }}>
                      Job Title *
                    </label>
                    <Input id="jobTitle" name="jobTitle" placeholder="e.g. Managing Director, Sales Head" required className={fieldErrors["jobTitle"] ? "field-invalid" : ""} />
                    {fieldErrors["jobTitle"] && <p className="field-error">{fieldErrors["jobTitle"]}</p>}
                  </div>
                </div>

                <div className="form-field" style={{ marginBottom: "1.5rem" }}>
                  <label htmlFor="linkedin" style={{ fontWeight: 700, fontSize: "0.95rem", display: "block", marginBottom: "0.5rem" }}>
                    LinkedIn Profile URL
                  </label>
                  <Input id="linkedin" name="linkedin" placeholder="https://linkedin.com/in/..." />
                </div>
              </div>

              {/* Section 2: Exhibitor Profile */}
              <div className="form-section-block" style={{ marginBottom: "3rem", paddingTop: "1rem", borderTop: "1px solid #e5e7eb" }}>
                <h3 style={{ color: "var(--tk-red)", fontSize: "1.5rem", fontWeight: 900, marginBottom: "1.5rem", textTransform: "none" }}>
                  Exhibitor Profile
                </h3>

                {/* Sectors of interest */}
                <div className="form-field" style={{ marginBottom: "2rem" }}>
                  <label style={{ fontWeight: 700, fontSize: "1rem", display: "block", marginBottom: "0.75rem" }}>
                    Core Industry Sectors (Select all that apply) *
                  </label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                      gap: "0.75rem",
                      background: "#fafafa",
                      padding: "1.25rem",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    {SECTORS_LIST.map((sector) => (
                      <label
                        key={sector}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.6rem",
                          cursor: "pointer",
                          fontSize: "0.95rem",
                          color: "#111111",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedSectors.includes(sector)}
                          onChange={() => toggleSector(sector)}
                          style={{ accentColor: "var(--tk-red)", width: "18px", height: "18px" }}
                        />
                        <span>{sector}</span>
                      </label>
                    ))}
                  </div>
                  {fieldErrors["sectors"] && <p className="field-error" style={{ marginTop: "0.5rem" }}>{fieldErrors["sectors"]}</p>}
                </div>

                <div className="form-two-col-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
                  <div className="form-field">
                    <label htmlFor="standType" style={{ fontWeight: 700, fontSize: "0.95rem", display: "block", marginBottom: "0.5rem" }}>
                      Preferred Stand Type
                    </label>
                    <select
                      id="standType"
                      name="standType"
                      style={{
                        height: "46px",
                        width: "100%",
                        borderRadius: "0",
                        border: "1px solid #d1d5db",
                        padding: "0 14px",
                        background: "#ffffff",
                        fontSize: "0.95rem",
                      }}
                    >
                      <option value="Space Only (Raw Space)">Space Only (Raw Space)</option>
                      <option value="Shell Scheme (Equipped Stand)">Shell Scheme (Equipped Stand)</option>
                      <option value="Custom Pavilion / Undecided">Custom Pavilion / Undecided</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label htmlFor="standSize" style={{ fontWeight: 700, fontSize: "0.95rem", display: "block", marginBottom: "0.5rem" }}>
                      Estimated Booth Space (SQM)
                    </label>
                    <Input id="standSize" name="standSize" placeholder="e.g. 18 sqm, 36 sqm, 54+ sqm" />
                  </div>
                </div>

                <div className="form-field" style={{ marginBottom: "2rem" }}>
                  <label htmlFor="message" style={{ fontWeight: 700, fontSize: "0.95rem", display: "block", marginBottom: "0.5rem" }}>
                    Additional Requirements or Space Inquiries
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Provide any specific booth location preferences, custom design needs, or questions..."
                    rows={4}
                  />
                </div>
              </div>

              {status === "error" && (
                <p className="form-error-msg" role="alert" style={{ marginBottom: "1.5rem", fontSize: "1rem" }}>
                  {errorMsg}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                className="show-button"
                disabled={status === "sending"}
                style={{ minWidth: "260px", padding: "14px 28px", fontSize: "1rem" }}
              >
                {status === "sending" ? "SUBMITTING APPLICATION…" : "SUBMIT EXHIBITOR APPLICATION"}{" "}
                <span className="btn-arrow">&gt;</span>
              </Button>
            </form>
          )}
        </Reveal>
      </section>
    </SiteLayout>
  );
}
