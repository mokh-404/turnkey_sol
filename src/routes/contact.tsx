import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";

import coastImage from "@/assets/turquoise-skyline.webp";
import turnkeyLogo from "@/assets/logos/turnkey-show-logo.png";
import apexLogo from "@/assets/logos/apex-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { showSiteAlert, useScrollOnSuccess, validateContactFields } from "@/lib/formAlerts";
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
  const successRef = useScrollOnSuccess(status === "success");

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
    const mobileEl = form.elements.namedItem("mobile") as HTMLInputElement;
    const subjectEl = form.elements.namedItem("subject") as HTMLInputElement;
    const messageEl = form.elements.namedItem("message") as HTMLTextAreaElement;

    const mobileVal = mobileEl.value.trim();
    const mobileDigits = mobileVal.replace(/\D/g, "");

    if (!nameEl.value.trim()) errors["full_name"] = "Full Name is required.";
    if (!emailEl.value.trim()) errors["email"] = "Email Address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) errors["email"] = "Please enter a valid email address.";
    if (!mobileVal) errors["mobile"] = "Mobile number is required.";
    else if (!/^\+?[0-9\s\-().]{7,20}$/.test(mobileVal) || mobileDigits.length < 7 || mobileDigits.length > 15) {
      errors["mobile"] = "Please enter a valid phone number (7–15 digits, optional + prefix).";
    }
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
        title={"LET'S START A CONVERSATION."}
        description={"Whether you're interested in exhibiting, visiting, or exploring sponsorship\npackages for Turnkey Show 2027, our dedicated event management team is ready to assist."}
        image={coastImage}
        imageAlt="Turquoise coastline of New Alamein"
      />

      {/* General Inquiry Form + Organizer Card Side-by-Side */}
      <section className="contact-form-section page-width" id="contact-form" style={{ paddingTop: "clamp(2rem, 4vw, 3rem)", paddingBottom: "clamp(3rem, 5vw, 4.5rem)", borderTop: "1px solid #eaeaea" }}>
        <Reveal className="contact-form-section-intro" style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto 2.5rem" }}>
          <p className="eyebrow" style={{ justifyContent: "center" }}>Direct Inquiries</p>
          <div className="section-red-bar" style={{ margin: "0.5rem auto 1rem" }} aria-hidden="true" />
          <h2>CONTACT <span className="headline-accent">US</span></h2>
          <p style={{ fontSize: "1.15rem", color: "#444444" }}>Fill in the form below and our team will get back to you.</p>
        </Reveal>

        <div className="contact-main-grid" id="organizer-info">
          {/* Apex Organizer Card */}
          <Reveal className="organized-by-card contact-apex-side-card" style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderTop: "4px solid var(--tk-red)", padding: "2.25rem 1.5rem", boxShadow: "0 8px 30px rgba(0,0,0,0.06)", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.25rem" }}>
              <img src={apexLogo} alt="Apex Conventions & Trade Fairs" style={{ height: "54px", width: "auto" }} />
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "1.5rem", color: "#111111" }}>
              Apex Conventions &amp; Trade Fairs L.L.C
            </h3>
            <ul className="contact-apex-contact-list">
              <li className="contact-apex-contact-item">
                <Phone className="w-4 h-4 text-red-600 flex-shrink-0" aria-hidden="true" />
                <a href={`tel:${EVENT_CONFIG.organizer.phone.replace(/\s/g, "")}`} style={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                  Phone: {EVENT_CONFIG.organizer.phone}
                </a>
              </li>
              <li className="contact-apex-contact-item">
                <Phone className="w-4 h-4 text-red-600 flex-shrink-0" aria-hidden="true" />
                <span className="contact-apex-mobile-numbers">
                  Mobile:{" "}
                  <a href="tel:+201017575757" style={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                    +2 010 17 57 57 57
                  </a>{" "}
                  <a href="tel:+201041555455" style={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                    +2 010 41 55 54 55
                  </a>
                </span>
              </li>
              <li className="contact-apex-contact-item">
                <Mail className="w-4 h-4 text-red-600 flex-shrink-0" aria-hidden="true" />
                <a href={`mailto:${EVENT_CONFIG.organizer.email}`} style={{ fontWeight: 600, color: "var(--tk-red)", whiteSpace: "nowrap" }}>
                  {EVENT_CONFIG.organizer.email}
                </a>
              </li>
            </ul>
          </Reveal>

          {/* Form Card */}
          <Reveal className="contact-form-card" style={{ background: "#ffffff", padding: "clamp(1.75rem, 3.5vw, 2.75rem)", border: "1px solid #e5e7eb", boxShadow: "0 8px 30px rgba(0,0,0,0.06)" }}>
            {status === "success" ? (
              <div ref={successRef} className="form-success-message">
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
                      Mobile *
                    </label>
                    <Input id="mobile" name="mobile" type="tel" placeholder="+20 xxx xxx xxxx" required className={fieldErrors["mobile"] ? "field-invalid" : ""} />
                    {fieldErrors["mobile"] && <p className="field-error">{fieldErrors["mobile"]}</p>}
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
