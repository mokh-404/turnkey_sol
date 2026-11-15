import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";

import coastImage from "@/assets/turquoise-skyline.webp";
import turnkeyLogo from "@/assets/logos/turnkey-show-logo.png";
import apexLogo from "@/assets/logos/apex-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { showSiteAlert, validateContactFields } from "@/lib/formAlerts";
import { PageHero, Reveal, SiteLayout } from "@/components/SiteLayout";
import { EVENT_CONFIG } from "@/config/event";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact us | Turnkey Show Alamein 2027" },
      {
        name: "description",
        content:
          "Get in touch with the Turnkey Show team for space booking, visitor registration, and general inquiries.",
      },
      { property: "og:title", content: "Contact us | Turnkey Show Alamein 2027" },
      { property: "og:description", content: "Direct contact with organizers Apex Conventions & Trade Fairs L.L.C." },
      { property: "og:type", content: "website" },
    ],
  }),
});

type FormStatus = "idle" | "sending" | "success" | "error";

function ContactPage() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");
    const form = e.currentTarget;
    if (!validateContactFields(form)) {
      setStatus("idle");
      return;
    }

    const errors: Record<string, string> = {};
    const nameEl = form.elements.namedItem("full_name") as HTMLInputElement;
    const emailEl = form.elements.namedItem("email") as HTMLInputElement;
    const subjectEl = form.elements.namedItem("subject") as HTMLInputElement;
    const messageEl = form.elements.namedItem("message") as HTMLTextAreaElement;

    if (!nameEl.value.trim()) errors["full_name"] = "Full Name is required.";
    if (!emailEl.value.trim()) errors["email"] = "Email Address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) errors["email"] = "Please enter a valid email address.";
    if (!subjectEl.value.trim()) errors["subject"] = "Subject is required.";
    if (!messageEl.value.trim()) errors["message"] = "Message is required.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setStatus("error");
      const firstErr = Object.values(errors)[0] || "Please correct the highlighted fields above.";
      setErrorMsg(firstErr);
      showSiteAlert(firstErr);
      return;
    }

    setFieldErrors({});
    setStatus("sending");
    setErrorMsg("");

    const data = {
      form_key: "general_inquiry",
      full_name: nameEl.value,
      email: emailEl.value,
      mobile: (form.elements.namedItem("mobile") as HTMLInputElement).value,
      subject: subjectEl.value,
      message: messageEl.value,
      website: (form.elements.namedItem("website") as HTMLInputElement).value, // honeypot
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
        eyebrow="Get in Touch"
        pageName="Contact Us"
        title={"LET'S START A\nCONVERSATION."}
        description="Whether you're interested in exhibiting, visiting, or exploring sponsorship packages for Turnkey Show 2027, our dedicated event management team is ready to assist."
        image={coastImage}
        imageAlt="Turquoise coastline of New Alamein"
      />

      {/* Enlarged Site Logo + Top Action Buttons Below Logo */}
      <section className="page-width" style={{ paddingTop: "clamp(2rem, 4vw, 3rem)", paddingBottom: "1rem", textAlign: "center" }}>
        <Reveal style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
          <img
            src={turnkeyLogo}
            alt="Turnkey Show"
            style={{ height: "150px", width: "auto", objectFit: "contain" }}
          />
          <div className="subpage-intro-btn-row" style={{ justifyContent: "center", marginTop: "0.25rem" }}>
            <a href="#contact-form" className="hero-btn hero-btn-primary">
              Send a message
              <svg
                className="hero-btn-icon"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 3.5L10.5 8L6 12.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a href="#organizer-info" className="hero-btn subpage-btn-ghost">
              View organizer details
              <svg
                className="hero-btn-icon"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 3.5L10.5 8L6 12.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </Reveal>
      </section>

      {/* Organizer Contact Info (Two Cards) — Placed Above the Form */}
      <section className="contact-info-section page-width" id="organizer-info" style={{ paddingTop: "clamp(2rem, 4vw, 3rem)", paddingBottom: "clamp(2rem, 4vw, 3rem)", borderTop: "none" }}>
        <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 2.5rem" }}>
          <p className="eyebrow" style={{ justifyContent: "center" }}>Official Organizer &amp; Venue</p>
          <div className="section-red-bar" style={{ margin: "0.5rem auto 1rem" }} aria-hidden="true" />
          <h2>KEY <span className="headline-accent">CONTACTS</span></h2>
        </div>

        <Reveal className="contact-info-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem", maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <div className="organized-by-card" style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderTop: "4px solid var(--tk-red)", padding: "2.5rem 2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
              <img src={apexLogo} alt="Apex Conventions & Trade Fairs" style={{ height: "48px", width: "auto" }} />
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "1.25rem", color: "#111111" }}>
              Apex Conventions &amp; Trade Fairs L.L.C
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center" }}>
              <li style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#333333", fontSize: "1rem" }}>
                <Phone className="w-4 h-4 text-red-600" aria-hidden="true" />
                <a href={`tel:${EVENT_CONFIG.organizer.phone.replace(/\s/g, "")}`} style={{ fontWeight: 600 }}>
                  Phone: {EVENT_CONFIG.organizer.phone}
                </a>
              </li>
              <li style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#333333", fontSize: "1rem" }}>
                <Phone className="w-4 h-4 text-red-600" aria-hidden="true" />
                <a href={`tel:${EVENT_CONFIG.organizer.mobile.replace(/[\s–]/g, "")}`} style={{ fontWeight: 600 }}>
                  Mobile: {EVENT_CONFIG.organizer.mobile}
                </a>
              </li>
              <li style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#333333", fontSize: "1rem" }}>
                <Mail className="w-4 h-4 text-red-600" aria-hidden="true" />
                <a href={`mailto:${EVENT_CONFIG.organizer.email}`} style={{ fontWeight: 600, color: "var(--tk-red)" }}>
                  {EVENT_CONFIG.organizer.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="organized-by-card" style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderTop: "4px solid var(--tk-red)", padding: "2.5rem 2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(233,41,36,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--tk-red)" }}>
                <MapPin className="w-6 h-6" />
              </div>
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "1.25rem", color: "#111111" }}>
              Exhibition Venue
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center" }}>
              <li style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#333333", fontSize: "1rem", textAlign: "center" }}>
                <MapPin className="w-4 h-4 text-red-600 flex-shrink-0" aria-hidden="true" />
                <span style={{ fontWeight: 600 }}>{EVENT_CONFIG.venue}</span>
              </li>
              <li style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#666666", fontSize: "0.925rem" }}>
                New Alamein City, Matrouh Governorate, Egypt
              </li>
              <li style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#333333", fontSize: "1rem" }}>
                <Mail className="w-4 h-4 text-red-600 flex-shrink-0" aria-hidden="true" />
                <a href={`mailto:${EVENT_CONFIG.email}`} style={{ fontWeight: 600, color: "var(--tk-red)" }}>
                  {EVENT_CONFIG.email}
                </a>
              </li>
            </ul>
          </div>
        </Reveal>
      </section>

      {/* General Inquiry Form */}
      <section className="contact-form-section page-width" id="contact-form" style={{ paddingTop: "clamp(2rem, 4vw, 3rem)", paddingBottom: "clamp(3rem, 5vw, 4.5rem)", borderTop: "1px solid #eaeaea" }}>
        <Reveal className="contact-form-section-intro" style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto 2.5rem" }}>
          <p className="eyebrow" style={{ justifyContent: "center" }}>Direct Inquiries</p>
          <div className="section-red-bar" style={{ margin: "0.5rem auto 1rem" }} aria-hidden="true" />
          <h2>CONTACT <span className="headline-accent">US</span></h2>
          <p style={{ fontSize: "1.15rem", color: "#444444" }}>Fill in the form below and our team will get back to you.</p>
        </Reveal>

        <div className="contact-main-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2.5rem", alignItems: "start" }}>
          {/* Form Card */}
          <Reveal className="contact-form-card" style={{ background: "#ffffff", padding: "clamp(1.75rem, 3.5vw, 2.75rem)", border: "1px solid #e5e7eb", boxShadow: "0 8px 30px rgba(0,0,0,0.06)" }}>
            {status === "success" ? (
              <div className="form-success-message">
                <h3>Message Sent</h3>
                <p>Thank you for reaching out. We'll get back to you shortly.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                {/* Honeypot — hidden from humans */}
                <input
                  type="text"
                  name="website"
                  aria-hidden="true"
                  tabIndex={-1}
                  autoComplete="off"
                  style={{ position: "absolute", left: "-9999px", opacity: 0 }}
                />
                <div className="form-group" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "1.25rem" }}>
                  <div className="form-field">
                    <label htmlFor="full_name" style={{ fontWeight: 700, fontSize: "0.95rem", display: "block", marginBottom: "0.4rem" }}>Full Name *</label>
                    <Input id="full_name" name="full_name" placeholder="Your full name" required className={fieldErrors["full_name"] ? "field-invalid" : ""} />
                    {fieldErrors["full_name"] && <p className="field-error">{fieldErrors["full_name"]}</p>}
                  </div>
                  <div className="form-field">
                    <label htmlFor="email" style={{ fontWeight: 700, fontSize: "0.95rem", display: "block", marginBottom: "0.4rem" }}>Email Address *</label>
                    <Input id="email" name="email" type="email" placeholder="you@example.com" required className={fieldErrors["email"] ? "field-invalid" : ""} />
                    {fieldErrors["email"] && <p className="field-error">{fieldErrors["email"]}</p>}
                  </div>
                </div>
                <div className="form-group" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "1.25rem" }}>
                  <div className="form-field">
                    <label htmlFor="mobile" style={{ fontWeight: 700, fontSize: "0.95rem", display: "block", marginBottom: "0.4rem" }}>
                      Mobile <span className="optional" style={{ color: "#888888", fontWeight: 400 }}>(optional)</span>
                    </label>
                    <Input id="mobile" name="mobile" type="tel" placeholder="+20 xxx xxx xxxx" />
                  </div>
                  <div className="form-field">
                    <label htmlFor="subject" style={{ fontWeight: 700, fontSize: "0.95rem", display: "block", marginBottom: "0.4rem" }}>Subject *</label>
                    <Input id="subject" name="subject" placeholder="How can we help?" required className={fieldErrors["subject"] ? "field-invalid" : ""} />
                    {fieldErrors["subject"] && <p className="field-error">{fieldErrors["subject"]}</p>}
                  </div>
                </div>
                <div className="form-field" style={{ marginBottom: "1.75rem" }}>
                  <label htmlFor="message" style={{ fontWeight: 700, fontSize: "0.95rem", display: "block", marginBottom: "0.4rem" }}>Message *</label>
                  <Textarea id="message" name="message" placeholder="Your message..." rows={5} required className={fieldErrors["message"] ? "field-invalid" : ""} />
                  {fieldErrors["message"] && <p className="field-error">{fieldErrors["message"]}</p>}
                </div>
                {status === "error" && (
                  <p className="form-error-msg" role="alert" style={{ marginBottom: "1.25rem" }}>
                    {errorMsg}
                  </p>
                )}
                <Button type="submit" size="lg" className="show-button w-full" disabled={status === "sending"} style={{ width: "100%", justifyContent: "center" }}>
                  {status === "sending" ? "SENDING…" : "SEND MESSAGE"}{" "}
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
