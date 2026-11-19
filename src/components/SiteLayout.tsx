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
} from "lucide-react";

import turnkeyLogo from "@/assets/logos/header-and-footer-turnkey-show-logo.png";
import apexLogo from "@/assets/logos/footer-and-contact-organizer-apex-logo.png";
import heroCoast from "@/assets/default-subpage-hero-fallback-banner.webp";
import { Button } from "@/components/ui/button";
import { EVENT_CONFIG, EVENT_TEXT } from "@/config/event";
import { LocaleLink, stripLocale, useLocale, type Locale } from "@/lib/i18n";

export interface NavItem {
  label: string;
  to: string;
  children?: Array<{ label: string; to: string }>;
}

export const navigationMenus: Record<Locale, NavItem[]> = {
  en: [
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
      to: "/visit/exhibitor-profile",
      children: [
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
  ],
  ar: [
    { label: "الرئيسية", to: "/" },
    {
      label: "عن المعرض",
      to: "/about/turnkey-show",
      children: [
        { label: "معرض تيرن كي", to: "/about/turnkey-show" },
        { label: "نظرة على السوق", to: "/about/market-overview" },
        { label: "مكان إقامة المعرض", to: "/about/venue" },
        { label: "المنظم", to: "/about/organizer" },
      ],
    },
    {
      label: "للعارضين",
      to: "/exhibit/why-exhibit",
      children: [
        { label: "لماذا تشارك كعارض", to: "/exhibit/why-exhibit" },
        { label: "الفئات المستهدفة من الزوار", to: "/exhibit/visitor-profile" },
        { label: "احجز مساحتك", to: "/exhibit/book-your-space" },
        { label: "حمّل البروشور", to: "/exhibit/download-brochure" },
      ],
    },
    {
      label: "للزوار",
      to: "/visit/exhibitor-profile",
      children: [
        { label: "قطاعات العارضين", to: "/visit/exhibitor-profile" },
        { label: "سجّل زيارتك", to: "/visit/visitor-registration" },
      ],
    },
    {
      label: "الخدمات",
      to: "/services/special-decoration",
      children: [
        { label: "التجهيزات والديكورات الخاصة", to: "/services/special-decoration" },
        { label: "الشحن والتخليص الجمركي", to: "/services/freight-forwarding" },
        { label: "السفر والإقامة", to: "/services/travel" },
      ],
    },
    { label: "تواصل معنا", to: "/contact" },
  ],
};

export const navigationMenu: NavItem[] = navigationMenus.en;

export function SiteLayout({ children }: PropsWithChildren) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({});
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const prevPathnameRef = useRef(location.pathname);

  const { locale, isAr, alternatePath } = useLocale();
  const eventText = EVENT_TEXT[locale];
  const navItems = navigationMenus[locale];
  const currentNeutralPath = stripLocale(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;
      setScrollProgress(progress);
      setIsScrolled((prev) => (prev ? scrollTop > 8 : scrollTop > 36));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", mobileMenuOpen);
    document.documentElement.classList.toggle("menu-open", mobileMenuOpen);
    return () => {
      document.body.classList.remove("menu-open");
      document.documentElement.classList.remove("menu-open");
    };
  }, [mobileMenuOpen]);

  // Close menus and scroll to top ONLY on actual route navigation (never on initial load/refresh)
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
    if (prevPathnameRef.current !== location.pathname) {
      prevPathnameRef.current = location.pathname;
      if (!location.hash) {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      }
    }
  }, [location.pathname, location.hash]);

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

  const toggleMobileAccordion = (to: string) => {
    setMobileExpanded((prev) => ({
      ...prev,
      [to]: !prev[to],
    }));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const AnyLink = Link as any;

  return (
    <div className="site-shell">
      {/* 4.1 Header: Solid white at all times */}
      <header
        className={`site-header header-solid-white ${isScrolled ? "is-scrolled" : ""}`}
        role="banner"
      >
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
              <span className="top-strip-dates">{eventText.dates}</span>
              <span className="top-strip-sep">·</span>
              <span className="top-strip-venue">{eventText.venue}</span>
            </div>
            <div className="top-strip-right">
              <a href={`mailto:${EVENT_CONFIG.email}`} className="top-strip-email">
                <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="ltr-inline">{EVENT_CONFIG.email}</span>
              </a>
              <div className="top-strip-social">
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
              <AnyLink
                to={alternatePath}
                className="top-strip-lang"
                lang={isAr ? "en" : "ar"}
                hrefLang={isAr ? "en" : "ar"}
                aria-label={isAr ? "Switch to English" : "التبديل إلى العربية"}
              >
                {isAr ? "EN" : "العربية"}
              </AnyLink>
            </div>
          </div>
        </div>

        {/* Main Header Bar */}
        <div className="header-main-bar">
          <div className="page-width header-inner">
            {/* Logo + Compact Event Meta Block */}
            <div className="header-brand-group">
              <LocaleLink
                to="/"
                className="brand-logo-link"
                aria-label={isAr ? "الرئيسية - معرض تيرن كي" : "Turnkey Show home"}
              >
                <img
                  src={turnkeyLogo}
                  alt="TURNKEY SHOW"
                  className="brand-logo-img"
                  width={140}
                  height={132}
                />
              </LocaleLink>
              <div className="header-event-meta">
                <strong className="header-meta-title">{eventText.name}</strong>
                <span className="header-meta-dates">{eventText.dates}</span>
                <span className="header-meta-venue">{eventText.venueShort}</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav
              className="desktop-navigation"
              aria-label={isAr ? "القائمة الرئيسية" : "Main navigation"}
            >
              <ul className="nav-list">
                {navItems.map((item) => {
                  const hasDropdown = Boolean(item.children && item.children.length > 0);
                  const isTopActive =
                    item.to === "/"
                      ? currentNeutralPath === "/"
                      : currentNeutralPath.startsWith(
                          item.to.split("/")[1] ? `/${item.to.split("/")[1]}` : item.to,
                        );

                  return (
                    <li
                      key={item.to}
                      className={`nav-item ${hasDropdown ? "has-dropdown" : ""} ${
                        openDropdown === item.to ? "dropdown-open" : ""
                      }`}
                      onMouseEnter={() => hasDropdown && setOpenDropdown(item.to)}
                      onMouseLeave={() => hasDropdown && setOpenDropdown(null)}
                    >
                      <LocaleLink
                        to={item.to}
                        className={`navigation-link ${isTopActive ? "is-active" : ""}`}
                        onFocus={() => hasDropdown && setOpenDropdown(item.to)}
                      >
                        {item.label}
                        {hasDropdown && (
                          <ChevronDown className="w-3.5 h-3.5 ms-1 dropdown-chevron" />
                        )}
                      </LocaleLink>

                      {hasDropdown && (
                        <ul className="dropdown-menu" role="menu">
                          {item.children?.map((sub) => {
                            const isSubActive = currentNeutralPath === sub.to;
                            return (
                              <li key={sub.to} role="none">
                                <LocaleLink
                                  to={sub.to}
                                  role="menuitem"
                                  className={`dropdown-link ${isSubActive ? "is-active" : ""}`}
                                  onClick={() => setOpenDropdown(null)}
                                >
                                  {sub.label}
                                </LocaleLink>
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
              <AnyLink
                to={alternatePath}
                className="lang-switch-btn"
                lang={isAr ? "en" : "ar"}
                hrefLang={isAr ? "en" : "ar"}
                aria-label={isAr ? "Switch to English" : "التبديل إلى العربية"}
              >
                {isAr ? "EN" : "عربي"}
              </AnyLink>
              <Button asChild size="sm" className="header-cta-btn">
                <LocaleLink to="/exhibit/book-your-space">
                  {isAr ? "احجز مساحتك" : "Book Space"}{" "}
                  <ArrowUpRight className="w-3.5 h-3.5 ms-1 rtl-flip-icon" />
                </LocaleLink>
              </Button>
              <button
                type="button"
                className="mobile-menu-toggle"
                aria-label={
                  mobileMenuOpen
                    ? isAr
                      ? "إغلاق القائمة"
                      : "Close navigation"
                    : isAr
                      ? "فتح القائمة"
                      : "Open navigation"
                }
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen((o) => !o)}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" aria-hidden="true" />
                ) : (
                  <Menu className="w-6 h-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Accordion Drawer */}
        <div className={`mobile-drawer ${mobileMenuOpen ? "is-open" : ""}`}>
          <div className="mobile-drawer-inner">
            <div className="mobile-drawer-header">
              <div className="mobile-meta">
                <strong>{eventText.name}</strong>
                <span>{eventText.dates}</span>
              </div>
              <AnyLink
                to={alternatePath}
                className="lang-switch-btn"
                lang={isAr ? "en" : "ar"}
                hrefLang={isAr ? "en" : "ar"}
                onClick={() => setMobileMenuOpen(false)}
              >
                {isAr ? "English" : "العربية"}
              </AnyLink>
            </div>

            <nav className="mobile-nav" aria-label={isAr ? "قائمة الجوال" : "Mobile navigation"}>
              {navItems.map((item) => {
                const hasChildren = Boolean(item.children && item.children.length > 0);
                const isExpanded = mobileExpanded[item.to] ?? false;

                if (!hasChildren) {
                  return (
                    <LocaleLink
                      key={item.to}
                      to={item.to}
                      className="mobile-nav-link"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </LocaleLink>
                  );
                }

                return (
                  <div key={item.to} className="mobile-accordion-item">
                    <button
                      type="button"
                      className="mobile-accordion-btn"
                      onClick={() => toggleMobileAccordion(item.to)}
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
                          <LocaleLink
                            key={sub.to}
                            to={sub.to}
                            className="mobile-subnav-link"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {sub.label}
                          </LocaleLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className="mobile-drawer-footer">
              <Button asChild className="w-full mb-3" size="sm">
                <LocaleLink
                  to="/visit/visitor-registration"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {isAr ? "سجّل زيارتك" : "Register to Visit"}{" "}
                  <ArrowRight className="w-4 h-4 ms-1 rtl-flip-icon" />
                </LocaleLink>
              </Button>
              <Button asChild variant="outline" className="w-full" size="sm">
                <LocaleLink
                  to="/exhibit/download-brochure"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {isAr ? "حمّل البروشور" : "Download Brochure"}{" "}
                  <ArrowUpRight className="w-4 h-4 ms-1 rtl-flip-icon" />
                </LocaleLink>
              </Button>
              <div className="mobile-contacts-strip">
                <a href={`mailto:${EVENT_CONFIG.email}`} className="ltr-inline">
                  {EVENT_CONFIG.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">{children}</main>

      {/* 7. Footer: "Organized By" block on every page (D8) */}
      <SiteFooter pathname={location.pathname} />
    </div>
  );
}

function SiteFooter({ pathname }: { pathname: string }) {
  const { locale, isAr } = useLocale();
  const eventText = EVENT_TEXT[locale];
  const normalizedPath = stripLocale(pathname).replace(/\/+$/, "") || "/";

  const secondaryAction =
    normalizedPath === "/exhibit/download-brochure"
      ? { label: isAr ? "تواصل معنا" : "Contact Us", to: "/contact" }
      : { label: isAr ? "حمّل البروشور" : "Download Brochure", to: "/exhibit/download-brochure" };
  const primaryAction =
    normalizedPath === "/exhibit/book-your-space"
      ? { label: isAr ? "تواصل معنا" : "Contact Us", to: "/contact" }
      : { label: isAr ? "احجز مساحتك" : "Book Your Space", to: "/exhibit/book-your-space" };

  return (
    <footer className="site-footer">
      {/* Majestic Architectural Crown Separator */}
      <div className="footer-crown-bar">
        <div className="page-width footer-crown-inner">
          <div className="footer-crown-brand">
            <span className="footer-crown-chevrons" aria-hidden="true">
              <svg viewBox="0 0 100 120" fill="var(--tk-red)">
                <polygon points="0,0 45,0 100,60 45,120 0,120 55,60" />
              </svg>
              <svg viewBox="0 0 100 120" fill="var(--tk-red)">
                <polygon points="0,0 45,0 100,60 45,120 0,120 55,60" />
              </svg>
            </span>
            <span className="footer-crown-tagline">
              {isAr ? (
                <>
                  المنصة المتكاملة لحلول تجهيز{" "}
                  <span className="headline-accent">الوحدات الساحلية</span>
                </>
              ) : (
                <>
                  THE COAST’S COMPLETE PROPERTY <span className="headline-accent">SOLUTIONS</span>{" "}
                  PLATFORM
                </>
              )}
            </span>
          </div>
          <div className="footer-crown-actions">
            <LocaleLink
              to={secondaryAction.to}
              className="footer-crown-cta footer-crown-cta-secondary"
            >
              {secondaryAction.label}
              <ArrowUpRight className="w-4 h-4 rtl-flip-icon" aria-hidden="true" />
            </LocaleLink>
            <LocaleLink to={primaryAction.to} className="footer-crown-cta">
              {primaryAction.label}
              <ArrowUpRight className="w-4 h-4 rtl-flip-icon" aria-hidden="true" />
            </LocaleLink>
          </div>
        </div>
      </div>

      <div className="page-width footer-main">
        {/* Brand & Show Meta */}
        <div className="footer-brand-block">
          <LocaleLink
            to="/"
            className="footer-brand-link"
            aria-label={isAr ? "الرئيسية - معرض تيرن كي" : "Turnkey Show home"}
          >
            <img src={turnkeyLogo} alt="TURNKEY SHOW" className="footer-logo-img" />
          </LocaleLink>
          <div className="footer-event-info" style={{ marginBottom: "1.25rem", marginTop: 0 }}>
            <div className="footer-event-date">{eventText.dates}</div>
            <div className="footer-event-venue">{eventText.venue}</div>
          </div>
          <div className="footer-social-icons">
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

        {/* Quick Links Column */}
        <div className="footer-column">
          <span className="footer-label">{isAr ? "روابط سريعة" : "Quick Links"}</span>
          <div className="footer-nav-list">
            <LocaleLink to="/contact" className="footer-nav-main-link">
              {isAr ? "تواصل معنا" : "Contact Us"}
            </LocaleLink>
            <LocaleLink to="/visit/visitor-registration" className="footer-nav-main-link">
              {isAr ? "سجّل زيارتك" : "Register to Visit"}
            </LocaleLink>
            <LocaleLink to="/exhibit/book-your-space" className="footer-nav-main-link">
              {isAr ? "احجز مساحتك" : "Book Your Space"}
            </LocaleLink>
            <LocaleLink to="/exhibit/download-brochure" className="footer-nav-main-link">
              {isAr ? "حمّل البروشور" : "Download Brochure"}
            </LocaleLink>
            <LocaleLink to="/about/venue" className="footer-nav-main-link">
              {isAr ? "مكان إقامة المعرض" : "Venue"}
            </LocaleLink>
          </div>
        </div>

        {/* Contact & Inquiries Column */}
        <div className="footer-column footer-contact-column">
          <span className="footer-label">
            {isAr ? "للتواصل والاستفسارات" : "Contact & Inquiries"}
          </span>
          <div className="footer-contact-info" style={{ marginBottom: 0 }}>
            <a href={`mailto:${EVENT_CONFIG.email}`} className="footer-contact-item">
              <span className="footer-contact-icon" aria-hidden="true">
                <Mail className="w-4 h-4" />
              </span>
              <span className="ltr-inline">{EVENT_CONFIG.email}</span>
            </a>
            <a
              href="https://wa.me/201017575757"
              className="footer-contact-item"
              target="_blank"
              rel="noreferrer"
            >
              <span className="footer-contact-icon" aria-hidden="true">
                <Phone className="w-4 h-4" />
              </span>
              <span>
                {isAr ? "واتساب: " : "WhatsApp: "}
                <span className="ltr-inline">+2 010 17 57 57 57</span>
              </span>
            </a>
            <a href="tel:+2 010 41 55 54 55" className="footer-contact-item">
              <span className="footer-contact-icon" aria-hidden="true">
                <Phone className="w-4 h-4" />
              </span>
              <span>
                {isAr ? "موبايل: " : "mobile: "}
                <span className="ltr-inline">+2 010 41 55 54 55</span>
              </span>
            </a>
          </div>
        </div>

        {/* Organized By Block (from docx last table, Section 7) */}
        <div className="footer-organizer-block">
          <span className="footer-label">{isAr ? "تنظيم:" : "Organized By:"}</span>
          <div className="organizer-logo-card">
            <img
              src={apexLogo}
              alt="Apex Conventions and Trade Fairs"
              className="apex-footer-logo"
            />
          </div>
          <strong className="organizer-company-name">{eventText.organizerName}</strong>
          <div className="organizer-contact-lines">
            <p className="organizer-contact-item">
              <span>{isAr ? "البريد الإلكتروني:" : "E-mail:"}</span>{" "}
              <a href={`mailto:${EVENT_CONFIG.organizer.email}`} className="ltr-inline">
                {EVENT_CONFIG.organizer.email}
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div className="page-width footer-bottom">
          <span>
            {isAr
              ? "© ٢٠٢٧ معرض العلمين تيرن كي شو. جميع الحقوق محفوظة."
              : "© 2027 Turnkey Show Alamein. All rights reserved."}
          </span>
        </div>
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

    // If element is already in or above the viewport on load/refresh, reveal immediately
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight + 40) {
      node.dataset["revealed"] = "true";
      return;
    }

    node.dataset["revealReady"] = "true";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        node.dataset["revealed"] = "true";
        observer.disconnect();
      },
      { threshold: 0.01, rootMargin: "0px 0px 80px 0px" },
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
 * Sub-Page Hero Banner & Intro Component
 * Renders:
 * 1. A small full-width banner with centered page name (Lift City Expo style)
 * 2. An intro section right after with the title, description, and action buttons
 */
export function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  primaryBtn,
  secondaryBtn,
  pageName,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  primaryBtn?: { label: string; href: string };
  secondaryBtn?: { label: string; href: string };
  pageName?: string;
}) {
  const bannerTitle = (pageName || eyebrow || "").trim();
  const hasIntroContent = Boolean(
    (title && title.trim()) || (description && description.trim()) || primaryBtn || secondaryBtn,
  );

  return (
    <>
      {/* 1. Small Full-Width Banner with Centered Page Name */}
      <section className="subpage-banner" aria-label={bannerTitle}>
        <div className="subpage-banner-media">
          <img
            className="subpage-banner-img"
            src={image || heroCoast}
            alt={imageAlt || bannerTitle}
            width={2400}
            height={600}
            fetchPriority="high"
          />
          <div className="subpage-banner-overlay" aria-hidden="true" />
        </div>
        <div className="subpage-banner-content">
          <h1 className="subpage-banner-heading">{bannerTitle}</h1>
        </div>
      </section>

      {/* 2. New Section Right After with Previous Hero Content */}
      {hasIntroContent && (
        <section className="subpage-intro-section page-width">
          <Reveal className="subpage-intro-wrap">
            {title && title.trim() && <h2 className="subpage-intro-title">{title}</h2>}
            <div className="subpage-intro-red-rule" aria-hidden="true" />
            {description && description.trim() && (
              <p className="subpage-intro-desc">{description}</p>
            )}
            {(primaryBtn || secondaryBtn) && (
              <div className="subpage-intro-btn-row">
                {primaryBtn && (
                  <LocaleLink to={primaryBtn.href} className="hero-btn hero-btn-primary">
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
                  </LocaleLink>
                )}
                {secondaryBtn && (
                  <LocaleLink to={secondaryBtn.href} className="hero-btn subpage-btn-ghost">
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
                  </LocaleLink>
                )}
              </div>
            )}
          </Reveal>
        </section>
      )}
    </>
  );
}

export { AnimatedCounter } from "./Animation_StatsCountUp_HeroAndMarketNumbers";
