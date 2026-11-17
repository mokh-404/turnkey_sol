import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Download } from "lucide-react";

import villaShowcase from "@/assets/villa-showcase.webp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useScrollOnSuccess, validateContactFields } from "@/lib/formAlerts";
import { PageHero, Reveal, SiteLayout } from "@/components/SiteLayout";

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
  const successRef = useScrollOnSuccess(status === "success");

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
        const downloadUrl = json.brochureUrl || "/Brochure Turnkey Show 2027.pdf";
        setBrochureUrl(downloadUrl);
        // Auto-trigger download without leaving the page
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "Brochure Turnkey Show 2027.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
        title="DOWNLOAD THE EXHIBITOR SALES BROCHURE"
        description="To download Brochure, please provide the following information:"
        image={villaShowcase}
        imageAlt="Turnkey Show 2027 sales brochure"
      />

      <section className="brochure-download-section section-band full-width-section" id="brochure-form">
        <div className="page-width brochure-download-inner brochure-download-inner--full">
          <Reveal className="brochure-form-card brochure-form-card--full">
            {status === "success" ? (
              <div ref={successRef} className="brochure-success">
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
                {/* Honeypot */}
                <input
                  type="text"
                  name="website"
                  aria-hidden="true"
                  tabIndex={-1}
                  autoComplete="off"
                  style={{ position: "absolute", left: "-9999px", opacity: 0 }}
                />
                <div className="brochure-form-grid">
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
                  <div className="form-field brochure-form-field--wide">
                    <label htmlFor="b-title">Job Title *</label>
                    <Input id="b-title" name="title" placeholder="Your job title" required />
                  </div>
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

