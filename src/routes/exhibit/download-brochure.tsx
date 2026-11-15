import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Download } from "lucide-react";

import villaShowcase from "@/assets/villa-showcase.webp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validateContactFields } from "@/lib/formAlerts";
import { PageHero, Reveal, SiteLayout } from "@/components/SiteLayout";
import { EVENT_CONFIG } from "@/config/event";

export const Route = createFileRoute("/exhibit/download-brochure")({
  component: DownloadBrochurePage,
  head: () => ({
    meta: [
      { title: "Download Brochure | Exhibit | Turnkey Show Alamein 2027" },
      {
        name: "description",
        content:
          "Download the Turnkey Show 2027 Exhibitor Sales Brochure. Get floor plans, pricing, sponsorship packages, and audience demographics.",
      },
      { property: "og:title", content: "Download Brochure | Exhibit" },
      { property: "og:type", content: "website" },
    ],
  }),
});

type FormStatus = "idle" | "sending" | "success" | "error";

function DownloadBrochurePage() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [brochureUrl, setBrochureUrl] = useState<string | null>(null);
  const [submittedName, setSubmittedName] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    const form = e.currentTarget;
    if (!validateContactFields(form, { checkRequired: true })) {
      setStatus("idle");
      return;
    }
    const nameVal = (form.elements.namedItem("name") as HTMLInputElement).value;
    const data = {
      form_key: "exhibitor_brochure",
      name: nameVal,
      company: (form.elements.namedItem("company") as HTMLInputElement).value,
      title: (form.elements.namedItem("title") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      website_hp: (form.elements.namedItem("website") as HTMLInputElement).value, // honeypot
    };
    setSubmittedName(nameVal);
    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setStatus("success");
        if (json.brochureUrl) {
          setBrochureUrl(json.brochureUrl);
          // Auto-trigger download
          window.location.href = json.brochureUrl;
        }
      } else {
        setStatus("error");
        setErrorMsg(json.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  }

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Download Brochure"
        title={"DOWNLOAD THE EXHIBITOR\nSALES BROCHURE & RATE CARD"}
        description="Get complete insight into floor plans, booth categories, sponsorship packages, audience demographics, and early-booking benefits for Turnkey Show 2027."
        image={villaShowcase}
        imageAlt="Turnkey Show 2027 sales brochure"
        primaryBtn={{ label: "Fill the form below", href: "#brochure-form" }}
        secondaryBtn={{ label: "Book your space", href: "/exhibit/book-your-space" }}
      />

      <section className="brochure-download-section section-band full-width-section" id="brochure-form">
        <div className="page-width brochure-download-inner">
          {/* Two-column layout on desktop: Event details card on one side (Section 8) */}
          <Reveal className="brochure-copy">
            <p className="eyebrow">Brochure Contents</p>
            <div className="section-red-bar" aria-hidden="true" />
            <h2>
              What&rsquo;s Inside the <span className="headline-accent">Brochure</span>
            </h2>
            <p>
              Complete event overview, floor plans, booth categories, sponsorship packages, audience demographics, and
              early-booking benefits for Turnkey Show 2027.
            </p>

            <div className="brochure-event-meta-card" style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderLeft: "4px solid var(--tk-red)", padding: "1.5rem", margin: "1.5rem 0", boxShadow: "0 4px 16px rgba(0,0,0,0.04)" }}>
              <div style={{ marginBottom: "1rem" }}>
                <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#666666", fontWeight: 700, display: "block" }}>Event</span>
                <strong style={{ fontSize: "1.15rem", color: "#111111" }}>{EVENT_CONFIG.name}</strong>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#666666", fontWeight: 700, display: "block" }}>Dates (Decision D1)</span>
                <strong style={{ fontSize: "1.1rem", color: "var(--tk-red)" }}>{EVENT_CONFIG.dates}</strong>
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#666666", fontWeight: 700, display: "block" }}>Official Venue</span>
                <strong style={{ fontSize: "1rem", color: "#111111" }}>{EVENT_CONFIG.venue}</strong>
              </div>
            </div>

            <ul className="brochure-highlights">
              <li>
                <CheckCircle2 aria-hidden="true" /> Detailed floor plan &amp; hall zoning
              </li>
              <li>
                <CheckCircle2 aria-hidden="true" /> Space-only vs shell scheme options &amp; pricing
              </li>
              <li>
                <CheckCircle2 aria-hidden="true" /> Sponsorship &amp; marketing opportunities
              </li>
              <li>
                <CheckCircle2 aria-hidden="true" /> Coastal market data &amp; visitor demographics
              </li>
            </ul>
          </Reveal>

          {/* Form on the other side */}
          <Reveal className="brochure-form-card">
            {status === "success" ? (
              <div className="brochure-success">
                <CheckCircle2 className="success-icon" aria-hidden="true" />
                <h3>Thank you, {submittedName || "valued partner"}.</h3>
                <p>
                  Your sales brochure download has started automatically. If it didn&rsquo;t start, please click the button below.
                </p>
                {brochureUrl && (
                  <Button asChild size="lg" className="show-button" style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                    <a href={brochureUrl} download="Brochure Turnkey Show 2027.pdf">
                      <Download aria-hidden="true" className="w-4 h-4 mr-2" /> Download brochure
                    </a>
                  </Button>
                )}
                <p className="brochure-email-note" style={{ color: "#555555", fontSize: "0.95rem" }}>
                  A copy of the download link was also sent to your email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="brochure-form" noValidate>
                <h3>Request Sales Brochure</h3>
                <p>Fill out the form below to receive the official digital brochure.</p>
                {/* Honeypot */}
                <input
                  type="text"
                  name="website"
                  aria-hidden="true"
                  tabIndex={-1}
                  autoComplete="off"
                  style={{ position: "absolute", left: "-9999px", opacity: 0 }}
                />
                <div className="form-field">
                  <label htmlFor="b-name">Your Name *</label>
                  <Input id="b-name" name="name" placeholder="Full name" required />
                </div>
                <div className="form-field">
                  <label htmlFor="b-phone">Mobile / Phone *</label>
                  <Input id="b-phone" name="phone" type="tel" placeholder="+20 xxx xxx xxxx" required />
                </div>
                <div className="form-field">
                  <label htmlFor="b-email">Business Email *</label>
                  <Input id="b-email" name="email" type="email" placeholder="you@company.com" required />
                </div>
                <div className="form-field">
                  <label htmlFor="b-company">Company Name *</label>
                  <Input id="b-company" name="company" placeholder="Company name" required />
                </div>
                <div className="form-field">
                  <label htmlFor="b-title">Job Title *</label>
                  <Input id="b-title" name="title" placeholder="Your job title" required />
                </div>
                {status === "error" && (
                  <p className="form-error-msg" role="alert">
                    {errorMsg}
                  </p>
                )}
                <Button type="submit" size="lg" className="show-button w-full" disabled={status === "sending"}>
                  <Download aria-hidden="true" className="w-4 h-4 mr-2" />
                  {status === "sending" ? "SUBMITTING…" : "Submit & download"}{" "}
                  <span className="btn-arrow" style={{ marginLeft: "8px" }}>&gt;</span>
                </Button>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}

