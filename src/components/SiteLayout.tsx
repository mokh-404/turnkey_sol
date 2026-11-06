import { useEffect, useRef, useState, type PropsWithChildren } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Menu, X, Mail, Phone } from "lucide-react";

import logoImage from "@/assets/logo.png";
import heroCoast from "@/assets/hero-coast.webp";
import iconInstagram from "@/assets/icon-instagram.png";
import iconLinkedin from "@/assets/icon-linkedin.png";
import iconYoutube from "@/assets/icon-youtube.png";
import { Button } from "@/components/ui/button";

const navigation = [
  { label: "Home", to: "/" as const },
  { label: "About", to: "/about" as const },
  { label: "Exhibit", to: "/exhibit" as const },
  { label: "Visit", to: "/visit" as const },
  { label: "Services", to: "/services" as const },
  { label: "Contact", to: "/contact" as const },
];

export function SiteLayout({ children }: PropsWithChildren) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerClass = scrolled
    ? "site-header header-scrolled"
    : "site-header header-transparent";

  return (
    <div className="site-shell">
      <header className={headerClass}>
        <div className="header-inner page-width">
          <Link to="/" className="brand-logo-link" aria-label="Turnkey Show home" onClick={() => setMenuOpen(false)}>
            <img src={logoImage} alt="TURNKEY SHOW ALAMEIN" className="brand-logo-img" />
          </Link>
          <nav className={`main-navigation${menuOpen ? " is-open" : ""}`} id="main-navigation" aria-label="Main navigation">
            {navigation.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "navigation-link is-active" }}
                inactiveProps={{ className: "navigation-link" }}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Button asChild size="sm" className="mobile-register">
              <Link to="/contact" hash="visitor-registration" onClick={() => setMenuOpen(false)}>
                Register to visit <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </nav>
          <div className="header-actions">
            <Button asChild size="sm" className="header-register show-button">
              <Link to="/contact" hash="visitor-registration">
                Register to visit <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="mobile-menu-toggle"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
        </div>
      </header>
      {children}
      <SiteFooter />
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-width footer-main">
        <div className="footer-brand-block">
          <Link to="/" className="footer-brand-link" aria-label="Turnkey Show home">
            <img src={logoImage} alt="TURNKEY SHOW" className="footer-logo-img" />
          </Link>
          <p className="footer-tagline">
            The coast’s complete<br />property solutions platform.
          </p>
          <div className="footer-social-icons">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <img src={iconInstagram} alt="" className="social-icon" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <img src={iconLinkedin} alt="" className="social-icon" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
              <img src={iconYoutube} alt="" className="social-icon" />
            </a>
          </div>
        </div>

        <div className="footer-column">
          <span className="footer-label">Navigation</span>
          {navigation.map((item) => (
            <Link key={item.to} to={item.to}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="footer-column">
          <span className="footer-label">Contact &amp; Inquiries</span>
          <a href="mailto:info@turnkeyshow.com" className="footer-link-flex">
            <Mail className="w-4 h-4" aria-hidden="true" /> info@turnkeyshow.com
          </a>
          <a href="/contact#exhibitor-enquiry" className="footer-link-flex">
            Book Space <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </a>
          <a href="/contact#visitor-registration" className="footer-link-flex">
            Visitor Registration <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>

        <div className="footer-organizer">
          <span className="footer-label">Organized by</span>
          <strong className="organizer-title">Apex Conventions and Trade Fairs L.L.C</strong>
          <p className="organizer-desc">
            More than 15 years of excellence in developing specialized international exhibitions.
          </p>
          <div className="organizer-contacts">
            <a href="tel:+20236971091"><Phone className="w-3.5 h-3.5 inline mr-1" /> 02 369 71 091</a>
            <a href="tel:+201017575757"><Phone className="w-3.5 h-3.5 inline mr-1" /> +2 010 17 57 57 57</a>
            <a href="tel:+201041555455"><Phone className="w-3.5 h-3.5 inline mr-1" /> +2 010 41 55 54 55</a>
            <a href="mailto:info@turnkeyshow.com"><Mail className="w-3.5 h-3.5 inline mr-1" /> info@turnkeyshow.com</a>
          </div>
        </div>
      </div>

      <div className="page-width footer-bottom">
        <span>Turnkey Show · Al Alamein International Conference &amp; Exhibition Center – New Alamein, Egypt</span>
        <span>06 – 09 May 2027 · All Rights Reserved</span>
      </div>
    </footer>
  );
}

export function Reveal({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    node.dataset["revealReady"] = "true";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        node.dataset["revealed"] = "true";
        observer.disconnect();
      },
      { threshold: 0.12 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={nodeRef} className={`reveal ${className}`.trim()}>
      {children}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  index = "01",
  primaryBtn,
  secondaryBtn,
  pillars,
}: {
  eyebrow: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  index?: string;
  primaryBtn?: { label: string; href: string };
  secondaryBtn?: { label: string; href: string };
  pillars?: Array<{ label: string; value: string }>;
}) {
  return (
    <section className="hero-section page-sub-hero" aria-label={eyebrow}>
      <div className="hero-media">
        <img
          className="hero-bg-img"
          src={image || heroCoast}
          alt={imageAlt || ""}
          width={2400}
          height={1350}
          fetchPriority="high"
        />
        <div className="hero-gradient-directional" aria-hidden="true" />
        <div className="hero-gradient-bottom" aria-hidden="true" />
        <div className="hero-corner-chevron" aria-hidden="true">
          <svg viewBox="0 0 100 120" fill="var(--tk-red)" width="100%" height="100%">
            <polygon points="0,0 45,0 100,60 45,120 0,120 55,60" />
          </svg>
        </div>
      </div>

      <div className="page-width hero-container">
        <div className="hero-stack">
          <div className="hero-red-rule" aria-hidden="true" />
          <p className="eyebrow hero-eyebrow">
            <span>{index}</span> {eyebrow}
          </p>
          <h1 className="hero-headline page-hero-title">
            {title}
          </h1>
          <p className="hero-subhead page-hero-subhead">
            {description}
          </p>
          {(primaryBtn || secondaryBtn) && (
            <div className="hero-btn-row">
              {primaryBtn && (
                <a href={primaryBtn.href} className="hero-btn hero-btn-primary">
                  {primaryBtn.label}
                  <svg className="hero-btn-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M6 3.5L10.5 8L6 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              )}
              {secondaryBtn && (
                <a href={secondaryBtn.href} className="hero-btn hero-btn-secondary">
                  {secondaryBtn.label}
                  <svg className="hero-btn-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M6 3.5L10.5 8L6 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>

        {pillars && pillars.length > 0 && (
          <div className="hero-info-strip liquid-glass-dark" role="region" aria-label="Key Information">
            {pillars.map((p, i) => (
              <div key={i} className="info-strip-col">
                <span className="info-strip-label">{p.label}</span>
                <span className="info-strip-value">{p.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function SectionLabel({ children }: PropsWithChildren) {
  return <p className="eyebrow section-label">{children}</p>;
}

export function ArrowLink({ href, children }: PropsWithChildren<{ href: string }>) {
  return (
    <a className="text-link" href={href}>
      {children} <ArrowUpRight aria-hidden="true" />
    </a>
  );
}

export function CtaBand({
  eyebrow = "Be part of what’s next",
  title,
  href = "/contact#exhibitor-enquiry",
  label = "Get in touch",
}: {
  eyebrow?: string;
  title: string;
  href?: string;
  label?: string;
}) {
  return (
    <section className="cta-band">
      <img src={heroCoast} alt="" width={1920} height={1024} loading="lazy" />
      <div className="cta-band-shade" />
      <div className="page-width cta-band-content">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <Button asChild size="lg" className="show-button">
          <a href={href}>
            {label} <ArrowRight aria-hidden="true" />
          </a>
        </Button>
      </div>
    </section>
  );
}
