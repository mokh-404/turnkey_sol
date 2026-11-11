import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";

import coastImage from "@/assets/turquoise-skyline.webp";
import venueImage from "@/assets/venue.webp";
import apexLogo from "@/assets/logos/apex-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type FormStatus = "idle" | "sending" | "success" | "error";

function ContactPage() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    const form = e.currentTarget;
    const data = {
      form_key: "general_inquiry",
      full_name: (form.elements.namedItem("full_name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      mobile: (form.elements.namedItem("mobile") as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
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
        title={"LET'S START A\nCONVERSATION."}
        description="Whether you're interested in exhibiting, visiting, or exploring sponsorship packages for Turnkey Show 2027, our dedicated event management team is ready to assist."
        image={coastImage}
        imageAlt="Turquoise coastline of New Alamein"
        primaryBtn={{ label: "Send a message", href: "#contact-form" }}
        secondaryBtn={{ label: "View organizer details", href: "#organizer-info" }}
      />

      {/* General Inquiry Form with Visual Showcase */}
      <section className="contact-form-section page-width" id="contact-form" style={{ padding: "clamp(3rem, 5vw, 4.5rem) 0" }}>
        <Reveal className="contact-form-section-intro" style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto 2.5rem" }}>
          <p className="eyebrow" style={{ justifyContent: "center" }}>Direct Inquiries</p>
          <div className="section-red-bar" style={{ margin: "0.5rem auto 1rem" }} aria-hidden="true" />
          <h2>CONTACT <span className="headline-accent">US</span></h2>
          <p style={{ fontSize: "1.15rem", color: "#444444" }}>Fill in the form below and our team will get back to you.</p>
        </Reveal>

        <div className="contact-main-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "2.5rem", alignItems: "start" }}>
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
                    <Input id="full_name" name="full_name" placeholder="Your full name" required />
                  </div>
                  <div className="form-field">
                    <label htmlFor="email" style={{ fontWeight: 700, fontSize: "0.95rem", display: "block", marginBottom: "0.4rem" }}>Email Address *</label>
                    <Input id="email" name="email" type="email" placeholder="you@example.com" required />
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
                    <Input id="subject" name="subject" placeholder="How can we help?" required />
                  </div>
                </div>
                <div className="form-field" style={{ marginBottom: "1.75rem" }}>
                  <label htmlFor="message" style={{ fontWeight: 700, fontSize: "0.95rem", display: "block", marginBottom: "0.4rem" }}>Message *</label>
                  <Textarea id="message" name="message" placeholder="Your message..." rows={5} required />
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

          {/* Visual Showcase Card */}
          <Reveal className="contact-visual-card">
            <div style={{ position: "relative", overflow: "hidden", border: "1px solid #e5e7eb", boxShadow: "0 8px 30px rgba(0,0,0,0.06)", background: "#111111" }}>
              <img
                src={venueImage}
                alt="New Alamein International Convention and Exhibition Center"
                width={1600}
                height={1024}
                style={{ width: "100%", height: "280px", objectFit: "cover" }}
                loading="lazy"
              />
              <div style={{ padding: "1.75rem 2rem", background: "#ffffff" }}>
                <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--tk-red)", fontWeight: 800 }}>Event Venue</span>
                <h3 style={{ fontSize: "1.35rem", fontWeight: 800, margin: "0.4rem 0 0.85rem", color: "#111111" }}>
                  New Alamein International Convention &amp; Exhibition Center
                </h3>
                <p style={{ fontSize: "0.95rem", color: "#555555", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                  Egypt's premier Mediterranean venue hosting plenary conference halls, advanced audiovisual systems, and turnkey exhibition facilities.
                </p>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <a href={`mailto:${EVENT_CONFIG.email}`} className="hero-btn hero-btn-primary" style={{ height: "44px", padding: "0 20px", fontSize: "0.9rem" }}>
                    <Mail className="w-4 h-4 mr-1.5" /> Email Team
                  </a>
                  <a href="/about/venue" className="hero-btn hero-btn-editorial" style={{ height: "44px", padding: "0 20px", fontSize: "0.9rem", border: "1.5px solid #111", background: "#fff", color: "#111", fontWeight: 700, display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
                    Explore Venue &gt;
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Organizer Contact Info — Centered per user instruction */}
      <section className="contact-info-section page-width" id="organizer-info" style={{ paddingBottom: "clamp(3rem, 5vw, 5rem)" }}>
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
    </SiteLayout>
  );
}
