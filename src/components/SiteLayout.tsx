import { useEffect, useRef, useState, type PropsWithChildren } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  Mail,
  Phone,
  ChevronDown,
  Instagram,
  Linkedin,
  Facebook,
  Twitter,
} from "lucide-react";

import turnkeyLogo from "@/assets/logos/turnkey-show-logo.png";
import apexLogo from "@/assets/logos/apex-logo.png";
import heroCoast from "@/assets/hero-coast.webp";
import { Button } from "@/components/ui/button";
import { EVENT_CONFIG } from "@/config/event";

export interface NavItem {
  label: string;
  to: string;
  children?: Array<{ label: string; to: string }>;
}

export const navigationMenu: NavItem[] = [
  { label: "Home", to: "/" },
  {
    label: "About",
    to: "/about/turnkey-show",
    children: [
      { label: "Turnkey Show", to: "/about/turnkey-show" },
      { label: "Market Overview", to: "/about/market-overview" },
      { label: "Venue", to: "/about/venue" },
      { label: "Organizer", to: "/about/organizer" },
    ],
  },
  {
    label: "Exhibit",
    to: "/exhibit/why-exhibit",
    children: [
      { label: "Why Exhibit", to: "/exhibit/why-exhibit" },
      { label: "Visitor Profile", to: "/exhibit/visitor-profile" },
      { label: "Book your space", to: "/exhibit/book-your-space" },
      { label: "Download brochure", to: "/exhibit/download-brochure" },
    ],
  },
  {
    label: "Visit",
    to: "/visit/why-visit",
    children: [
      { label: "Why Visit", to: "/visit/why-visit" },
      { label: "Exhibitor Profile", to: "/visit/exhibitor-profile" },
      { label: "Visitor Registration", to: "/visit/visitor-registration" },
    ],
  },
  {
    label: "Services",
    to: "/services/special-decoration",
    children: [
      { label: "Special Decoration", to: "/services/special-decoration" },
      { label: "Freight Forwarding", to: "/services/freight-forwarding" },
      { label: "Travel", to: "/services/travel" },
    ],
  },
  { label: "Contact us", to: "/contact" },
];

export function SiteLayout({ children }: PropsWithChildren) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({});
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;
      setScrollProgress(progress);
      setIsScrolled(scrollTop > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", mobileMenuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [mobileMenuOpen]);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  // Handle escape key to close dropdowns
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenDropdown(null);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleMobileAccordion = (label: string) => {
    setMobileExpanded((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <div className="site-shell">
      {/* 4.1 Header: Solid white at all times */}
      <header className={`site-header header-solid-white ${isScrolled ? "is-scrolled" : ""}`} role="banner">
        {/* Thin red scroll progress line under header (Section 12.2.9) */}
        <div
          className="header-scroll-progress"
          style={{ transform: `scaleX(${scrollProgress})` }}
          aria-hidden="true"
        />
        {/* Slim Top Utility Strip */}
        <div className="header-top-strip">
          <div className="page-width top-strip-inner">
            <div className="top-strip-left">
              <span className="top-strip-dates">{EVENT_CONFIG.dates}</span>
              <span className="top-strip-sep">·</span>
              <span className="top-strip-venue">{EVENT_CONFIG.venue}</span>
            </div>
            <div className="top-strip-right">
              <a href={`mailto:${EVENT_CONFIG.email}`} className="top-strip-email">
                <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{EVENT_CONFIG.email}</span>
              </a>
              <div className="top-strip-social">
                <a
                  href={EVENT_CONFIG.socialLinks.twitter || "#"}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter"
                >
                  <Twitter className="w-3.5 h-3.5" />
                </a>
                <a
                  href={EVENT_CONFIG.socialLinks.facebook || "#"}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                >
                  <Facebook className="w-3.5 h-3.5" />
                </a>
                <a
                  href={EVENT_CONFIG.socialLinks.linkedin || "#"}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
                <a
                  href={EVENT_CONFIG.socialLinks.instagram || "#"}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header Bar */}
        <div className="header-main-bar">
          <div className="page-width header-inner">
            {/* Logo + Compact Event Meta Block */}
            <div className="header-brand-group">
              <Link to="/" className="brand-logo-link" aria-label="Turnkey Show home">
                <img
                  src={turnkeyLogo}
                  alt="TURNKEY SHOW"
                  className="brand-logo-img"
                  width={140}
                  height={132}
                />
              </Link>
              <div className="header-event-meta">
                <strong className="header-meta-title">{EVENT_CONFIG.name}</strong>
                <span className="header-meta-dates">{EVENT_CONFIG.dates}</span>
                <span className="header-meta-venue">{EVENT_CONFIG.venueShort}</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="desktop-navigation" aria-label="Main navigation">
              <ul className="nav-list">
                {navigationMenu.map((item) => {
                  const hasDropdown = Boolean(item.children && item.children.length > 0);
                  const isTopActive =
                    item.to === "/"
                      ? location.pathname === "/"
                      : location.pathname.startsWith(item.to.split("/")[1] ? `/${item.to.split("/")[1]}` : item.to);

                  return (
                    <li
                      key={item.label}
                      className={`nav-item ${hasDropdown ? "has-dropdown" : ""} ${
                        openDropdown === item.label ? "dropdown-open" : ""
                      }`}
                      onMouseEnter={() => hasDropdown && setOpenDropdown(item.label)}
                      onMouseLeave={() => hasDropdown && setOpenDropdown(null)}
                    >
                      <Link
                        to={item.to}
                        className={`navigation-link ${isTopActive ? "is-active" : ""}`}
                        onFocus={() => hasDropdown && setOpenDropdown(item.label)}
                      >
                        {item.label}
                        {hasDropdown && <ChevronDown className="w-3.5 h-3.5 ml-1 dropdown-chevron" />}
                      </Link>

                      {hasDropdown && (
                        <ul className="dropdown-menu" role="menu">
                          {item.children?.map((sub) => {
                            const isSubActive = location.pathname === sub.to;
                            return (
                              <li key={sub.to} role="none">
                                <Link
                                  to={sub.to}
                                  role="menuitem"
                                  className={`dropdown-link ${isSubActive ? "is-active" : ""}`}
                                  onClick={() => setOpenDropdown(null)}
                                >
                                  {sub.label}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Header Right Action & Mobile Toggle */}
            <div className="header-actions">
              <Button asChild size="sm" className="header-cta-btn">
                <Link to="/exhibit/book-your-space">
                  Book Space <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </Button>
              <button
                type="button"
                className="mobile-menu-toggle"
                aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen((o) => !o)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Accordion Drawer */}
        <div className={`mobile-drawer ${mobileMenuOpen ? "is-open" : ""}`}>
          <div className="mobile-drawer-inner">
            <div className="mobile-drawer-header">
              <div className="mobile-meta">
                <strong>{EVENT_CONFIG.name}</strong>
                <span>{EVENT_CONFIG.dates}</span>
              </div>
            </div>

            <nav className="mobile-nav" aria-label="Mobile navigation">
              {navigationMenu.map((item) => {
                const hasChildren = Boolean(item.children && item.children.length > 0);
                const isExpanded = mobileExpanded[item.label] ?? false;

                if (!hasChildren) {
                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      className="mobile-nav-link"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <div key={item.label} className="mobile-accordion-item">
                    <button
                      type="button"
                      className="mobile-accordion-btn"
                      onClick={() => toggleMobileAccordion(item.label)}
                      aria-expanded={isExpanded}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`w-4 h-4 accordion-arrow ${isExpanded ? "rotated" : ""}`}
                      />
                    </button>
                    {isExpanded && (
                      <div className="mobile-accordion-body">
                        {item.children?.map((sub) => (
                          <Link
                            key={sub.to}
                            to={sub.to}
                            className="mobile-subnav-link"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className="mobile-drawer-footer">
              <Button asChild className="w-full mb-3" size="sm">
                <Link to="/visit/visitor-registration" onClick={() => setMobileMenuOpen(false)}>
                  Register to Visit <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full" size="sm">
                <Link to="/exhibit/download-brochure" onClick={() => setMobileMenuOpen(false)}>
                  Download Brochure <ArrowUpRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
              <div className="mobile-contacts-strip">
                <a href={`mailto:${EVENT_CONFIG.email}`}>{EVENT_CONFIG.email}</a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">{children}</main>

      {/* 7. Footer: "Organized By" block on every page (D8) */}
      <SiteFooter />
    </div>
  );
}

function SiteFooter() {
  const location = useLocation();
  return (
    <footer className="site-footer">
      <div className="page-width footer-main">
        {/* Brand & Show Meta */}
        <div className="footer-brand-block">
          <Link to="/" className="footer-brand-link" aria-label="Turnkey Show home">
            <img src={turnkeyLogo} alt="TURNKEY SHOW" className="footer-logo-img" />
          </Link>
          <p className="footer-tagline">
            The coast’s complete<br />property solutions platform.
          </p>
          <p className="footer-dates-venue">
            <strong>{EVENT_CONFIG.dates}</strong><br />
            {EVENT_CONFIG.venue}
          </p>
          <div className="footer-social-icons">
            <a
              href={EVENT_CONFIG.socialLinks.twitter || "#"}
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href={EVENT_CONFIG.socialLinks.facebook || "#"}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href={EVENT_CONFIG.socialLinks.linkedin || "#"}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={EVENT_CONFIG.socialLinks.instagram || "#"}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Navigation Column: Old classic structure with hover flyout for submenus */}
        <div className="footer-column footer-nav-column">
          <span className="footer-label">Navigation</span>
          <div className="footer-nav-list">
            {navigationMenu.map((item) => {
              const hasSub = Boolean(item.children && item.children.length > 0);
              const isTopActive =
                item.to === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.to.split("/")[1] ? `/${item.to.split("/")[1]}` : item.to);

              return (
                <div key={item.label} className={`footer-nav-item ${hasSub ? "has-sub" : ""}`}>
                  <Link to={item.to} className={`footer-nav-main-link ${isTopActive ? "is-active" : ""}`}>
                    {item.label}
                    {hasSub && <ChevronDown className="w-3 h-3 ml-1.5 opacity-60 inline" />}
                  </Link>

                  {hasSub && (
                    <div className="footer-sub-flyout">
                      {item.children?.map((sub) => {
                        const isSubActive = location.pathname === sub.to;
                        return (
                          <Link key={sub.to} to={sub.to} className={`footer-sub-link ${isSubActive ? "is-active" : ""}`}>
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact & Inquiries Column */}
        <div className="footer-column">
          <span className="footer-label">Contact &amp; Inquiries</span>
          <a href={`mailto:${EVENT_CONFIG.email}`} className="footer-link-flex">
            <Mail className="w-4 h-4" aria-hidden="true" /> {EVENT_CONFIG.email}
          </a>
          <Link to="/exhibit/book-your-space" className="footer-link-flex" style={{ color: "var(--tk-red)", fontWeight: 700, marginTop: "0.5rem" }}>
            Book Your Space <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <Link to="/exhibit/download-brochure" className="footer-link-flex">
            Download Brochure <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <Link to="/visit/visitor-registration" className="footer-link-flex">
            Visitor Registration <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Organized By Block (from docx last table, Section 7) */}
        <div className="footer-organizer-block">
          <span className="footer-label">Organized By:</span>
          {/* White panel container to preserve black text and green chevron */}
          <div className="organizer-logo-card">
            <img src={apexLogo} alt="Apex Conventions and Trade Fairs" className="apex-footer-logo" />
          </div>
          <strong className="organizer-company-name">{EVENT_CONFIG.organizer.name}</strong>
          <div className="organizer-contact-lines">
            <p className="organizer-contact-item">
              <span>Phone no.:</span> <a href={`tel:${EVENT_CONFIG.organizer.phone.replace(/\s+/g, "")}`}>{EVENT_CONFIG.organizer.phone}</a>
            </p>
            <p className="organizer-contact-item">
              <span>Mobile:</span> {EVENT_CONFIG.organizer.mobile}
            </p>
            <p className="organizer-contact-item">
              <span>E-mail:</span>{" "}
              <a href={`mailto:${EVENT_CONFIG.organizer.email}`}>{EVENT_CONFIG.organizer.email}</a>
            </p>
          </div>
        </div>
      </div>

      <div className="page-width footer-bottom">
        <span>Turnkey Show · {EVENT_CONFIG.venue}</span>
        <span>{EVENT_CONFIG.dates} · {EVENT_CONFIG.website}</span>
      </div>
    </footer>
  );
}

export function Reveal({
  children,
  className = "",
  style,
}: PropsWithChildren<{ className?: string; style?: React.CSSProperties }>) {
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
    <div ref={nodeRef} style={style} className={`reveal ${className}`.trim()}>
      {children}
    </div>
  );
}

/**
 * Sub-Page Hero Component
 * Note: Numbering has been removed per Decision D2 & Section 4.5.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  primaryBtn,
  secondaryBtn,
}: {
  eyebrow: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  primaryBtn?: { label: string; href: string };
  secondaryBtn?: { label: string; href: string };
}) {
  return (
    <section className="hero-section page-sub-hero" aria-label={eyebrow}>
      <div className="hero-media">
        <img
          className="hero-bg-img hero-zoom"
          src={image || heroCoast}
          alt={imageAlt || ""}
          width={2400}
          height={1350}
          fetchPriority="high"
        />
        <div className="hero-diagonal-overlay" aria-hidden="true" />
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
          {/* Eyebrow WITHOUT numbering (Section 4.5) */}
          <p className="eyebrow hero-eyebrow">{eyebrow}</p>
          <h1 className="hero-headline page-hero-title">{title}</h1>
          <p className="hero-subhead page-hero-subhead">{description}</p>
          {(primaryBtn || secondaryBtn) && (
            <div className="hero-btn-row">
              {primaryBtn && (
                <a href={primaryBtn.href} className="hero-btn hero-btn-primary">
                  {primaryBtn.label}
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
              )}
              {secondaryBtn && (
                <a href={secondaryBtn.href} className="hero-btn hero-btn-secondary">
                  {secondaryBtn.label}
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
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export { AnimatedCounter } from "./AnimatedCounter";

