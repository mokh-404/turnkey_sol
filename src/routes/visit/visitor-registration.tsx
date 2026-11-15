import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import chalet from "@/assets/chalet.webp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validateContactFields } from "@/lib/formAlerts";
import { PageHero, Reveal, SiteLayout } from "@/components/SiteLayout";
import { EVENT_CONFIG, SHOW_SECTORS } from "@/config/event";

export const Route = createFileRoute("/visit/visitor-registration")({
  component: VisitorRegistrationPage,
  head: () => ({
    meta: [
      { title: "Visitor Registration | Visit | Turnkey Show Alamein 2027" },
      {
        name: "description",
        content:
          "Register to visit Turnkey Show 2027. Free entry badge, access to the digital exhibitor directory, and event updates.",
      },
      { property: "og:title", content: "Visitor Registration | Visit" },
      { property: "og:type", content: "website" },
    ],
  }),
});

type FormStatus = "idle" | "sending" | "success" | "error";

const VISITOR_CATEGORIES = [
  "Property Owner",
  "Investor",
  "Developer",
  "Hospitality Operator",
  "Architect & Interior Designer",
  "Contractor & Procurement Team",
  "Corporate & Commercial Buyer",
  "Other",
];

const SECTORS_LIST = SHOW_SECTORS;

function VisitorRegistrationPage() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  function toggleSector(sector: string) {
    setSelectedSectors((prev) =>
      prev.includes(sector) ? prev.filter((s) => s !== sector) : [...prev, sector]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");
    const form = e.currentTarget;
    if (!validateContactFields(form)) {
      setStatus("idle");
      return;
    }

    const errors: Record<string, string> = {};
    const nameEl = form.elements.namedItem("name") as HTMLInputElement;
    const emailEl = form.elements.namedItem("email") as HTMLInputElement;
    const mobileEl = form.elements.namedItem("mobile") as HTMLInputElement;
    const categoryEl = form.elements.namedItem("category") as HTMLSelectElement;

    if (!nameEl.value.trim()) errors["name"] = "Full Name is required.";
    if (!emailEl.value.trim()) errors["email"] = "Email Address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) errors["email"] = "Please enter a valid email address.";
    if (!mobileEl.value.trim()) errors["mobile"] = "Mobile number is required.";
    if (!categoryEl.value) errors["category"] = "Please select a visitor category.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setStatus("error");
      setErrorMsg("Please correct the highlighted fields above.");
      return;
    }

    setFieldErrors({});
    setStatus("sending");

    const data = {
      form_key: "visitor_registration",
      fullName: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      mobile: (form.elements.namedItem("mobile") as HTMLInputElement).value,
      company: (form.elements.namedItem("company") as HTMLInputElement).value,
      jobTitle: (form.elements.namedItem("jobTitle") as HTMLInputElement).value,
      visitorCategory: categoryEl.value,
      sectors: selectedSectors,
      website_hp: (form.elements.namedItem("website") as HTMLInputElement).value, // honeypot
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
        eyebrow="Visitor Registration"
        title={"REGISTER TO VISIT\nTURNKEY SHOW 2027"}
        description={`Sign up now to receive your free entry badge, access the digital exhibitor directory, and get event updates. ${EVENT_CONFIG.dates} · ${EVENT_CONFIG.venue}`}
        image={chalet}
        imageAlt="Coastal living experience at Turnkey Show"
        primaryBtn={{ label: "Fill the form below", href: "#registration-form" }}
        secondaryBtn={{ label: "Exhibitor profile", href: "/visit/exhibitor-profile" }}
      />

      <section className="contact-form-section contact-visitor-section section-band page-width" id="registration-form">
        <Reveal>
          {status === "success" ? (
            <div className="form-success-message">
              <h3>Registration Received</h3>
              <p>
                Thank you for registering! We&rsquo;ll send your visitor pass and event details to your email address.
              </p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <p style={{ fontWeight: 700, marginBottom: "1rem" }}>This form is not a contract.</p>
              {/* Honeypot */}
              <input
                type="text"
                name="website"
                aria-hidden="true"
                tabIndex={-1}
                autoComplete="off"
                style={{ position: "absolute", left: "-9999px", opacity: 0 }}
              />
              <div className="form-group">
                <div className="form-field">
                  <label htmlFor="visitor-name">Full Name *</label>
                  <Input id="visitor-name" name="name" placeholder="Your full name" required className={fieldErrors["name"] ? "field-invalid" : ""} />
                  {fieldErrors["name"] && <p className="field-error">{fieldErrors["name"]}</p>}
                </div>
                <div className="form-field">
                  <label htmlFor="visitor-email">Email Address *</label>
                  <Input id="visitor-email" name="email" type="email" placeholder="you@example.com" required className={fieldErrors["email"] ? "field-invalid" : ""} />
                  {fieldErrors["email"] && <p className="field-error">{fieldErrors["email"]}</p>}
                </div>
              </div>

              <div className="form-group">
                <div className="form-field">
                  <label htmlFor="visitor-mobile">Mobile *</label>
                  <Input id="visitor-mobile" name="mobile" type="tel" placeholder="+20 xxx xxx xxxx" required className={fieldErrors["mobile"] ? "field-invalid" : ""} />
                  {fieldErrors["mobile"] && <p className="field-error">{fieldErrors["mobile"]}</p>}
                </div>
                <div className="form-field">
                  <label htmlFor="visitor-category">Visitor Category *</label>
                  <select
                    id="visitor-category"
                    name="category"
                    required
                    style={{
                      height: "44px",
                      width: "100%",
                      borderRadius: "4px",
                      border: fieldErrors["category"] ? "1px solid var(--tk-red)" : "1px solid #e5e7eb",
                      padding: "0 12px",
                      background: "#ffffff",
                      fontSize: "0.95rem",
                      color: "#111111",
                      appearance: "auto" as const,
                      cursor: "pointer",
                    }}
                  >
                    <option value="">Select your visitor category...</option>
                    {VISITOR_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {fieldErrors["category"] && <p className="field-error">{fieldErrors["category"]}</p>}
                </div>
              </div>

              <div className="form-group">
                <div className="form-field">
                  <label htmlFor="visitor-company">
                    Company / Organization <span className="optional">(optional)</span>
                  </label>
                  <Input id="visitor-company" name="company" placeholder="Company or studio" />
                </div>
                <div className="form-field">
                  <label htmlFor="visitor-title">
                    Job Title <span className="optional">(optional)</span>
                  </label>
                  <Input id="visitor-title" name="jobTitle" placeholder="e.g. Interior Designer, Project Manager" />
                </div>
              </div>

              {/* Sectors of interest (optional multi-select) */}
              <div className="form-field" style={{ marginTop: "1rem" }}>
                <label style={{ fontWeight: 700, marginBottom: "0.5rem", display: "block" }}>
                  Sectors of Interest <span className="optional">(optional)</span>
                </label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "0.5rem",
                    background: "#f9f9f9",
                    padding: "1rem",
                    border: "1px solid #e5e5e5",
                  }}
                >
                  {SECTORS_LIST.map((sector) => (
                    <label
                      key={sector}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSectors.includes(sector)}
                        onChange={() => toggleSector(sector)}
                        style={{ accentColor: "var(--tk-red)", width: "16px", height: "16px" }}
                      />
                      <span>{sector}</span>
                    </label>
                  ))}
                </div>
              </div>

              {status === "error" && (
                <p className="form-error-msg" role="alert">
                  {errorMsg}
                </p>
              )}
              <Button
                type="submit"
                size="lg"
                className="show-button"
                disabled={status === "sending"}
                style={{ marginTop: "1rem" }}
              >
                {status === "sending" ? "SENDING…" : "CONFIRM VISITOR REGISTRATION"}{" "}
                <span className="btn-arrow">&gt;</span>
              </Button>
            </form>
          )}
        </Reveal>
      </section>
    </SiteLayout>
  );
}
