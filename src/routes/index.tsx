import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, ArrowRight } from "lucide-react";

import heroImage from "@/assets/hero-coast.webp";
import livingRoom from "@/assets/living-room.webp";
import terraceSunset from "@/assets/terrace-sunset.webp";
import lobbyOcean from "@/assets/lobby-ocean.webp";
import smartHome from "@/assets/smart-home.webp";
import kitchen from "@/assets/kitchen.webp";
import warmKitchen from "@/assets/warm-kitchen.webp";
import villaShowcase from "@/assets/villa-showcase.webp";
import oceanfrontTerrace from "@/assets/oceanfront-terrace.webp";
import smartLiving from "@/assets/smart-living.webp";
import venueImage from "@/assets/venue.webp";
import { AnimatedCounter, Reveal, SiteLayout } from "@/components/SiteLayout";
import { MarqueeRibbon } from "@/components/MarqueeRibbon";
import { EVENT_CONFIG, SHOW_SECTORS } from "@/config/event";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Turnkey Show Alamein | The Coast's Complete Property Solutions Platform" },
      {
        name: "description",
        content:
          "The coast's complete property solutions platform. Turnkey Show Alamein connects property owners, developers, and hospitality operators with complete furnishing, fit-out, appliances, and smart living solutions.",
      },
      { property: "og:title", content: "Turnkey Show Alamein | The Coast's Complete Property Solutions Platform" },
      {
        property: "og:description",
        content: "The coast's complete property solutions platform. Connecting the entire property fit-out ecosystem at New Alamein.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const sectors = [
  {
    title: "Furniture & Interiors",
    image: livingRoom,
    detail: "Furnishing solutions for new handovers and existing coastal properties.",
  },
  {
    title: "Kitchens & Equipment",
    image: warmKitchen,
    detail: "Custom kitchen cabinetry, built-in appliances, fixtures and premium kitchen fit-outs.",
  },
  {
    title: "Home Appliances",
    image: kitchen,
    detail: "Essential, built-in and lifestyle appliances for ready-to-operate units.",
  },
  {
    title: "Outdoor Living",
    image: terraceSunset,
    detail: "Outdoor furniture and solutions designed for the Mediterranean coastal lifestyle.",
  },
  {
    title: "Smart Unit Automation",
    image: smartHome,
    detail: "Smart home automation, climate control, energy efficiency and connected living.",
  },
  {
    title: "Modern Lighting Technology",
    image: smartLiving,
    detail: "Architectural lighting, ambient systems, modern illumination and decorative fixtures.",
  },
  {
    title: "Hospitality Fit-Out",
    image: lobbyOcean,
    detail: "High-spec commercial solutions for hotels, serviced apartments and rental properties.",
  },
  {
    title: "Complete Solutions",
    image: villaShowcase,
    detail: "Integrated turnkey solutions taking properties from handover to investment-ready.",
  },
];

const stats = [
  { value: "1.2T EGP", label: "Real Estate Transactions", sub: "North Coast | 2024–2025" },
  { value: "185B EGP", label: "Targeted Investment", sub: "New Alamein" },
  { value: "46,189+", label: "Residential Units", sub: "New Alamein" },
];

function Index() {
  return (
    <SiteLayout>
      {/* Homepage Hero Section */}
      <section className="hero-section" aria-label="Introduction">
        <div className="hero-media">
          <img
            className="hero-bg-img hero-zoom"
            src={villaShowcase}
            alt="Turnkey Show 2027 Luxury Furnished Coastal Interior"
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
            <h1 className="hero-headline">
              Turnkey Show<br />Alamein
            </h1>
            <div className="hero-red-bar" aria-hidden="true" />
            <p className="hero-subhead">
              {EVENT_CONFIG.dates} · {EVENT_CONFIG.venue}
            </p>
            <div className="hero-btn-row">
              <a href="/exhibit/book-your-space" className="hero-btn hero-btn-primary">
                Book Your Space
                <svg className="hero-btn-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M6 3.5L10.5 8L6 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a href="/exhibit/download-brochure" className="hero-btn hero-btn-secondary">
                Download Brochure
                <svg className="hero-btn-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M6 3.5L10.5 8L6 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>

          {/* Anchored Info Strip */}
          <div className="hero-info-strip liquid-glass-dark" role="region" aria-label="Event Key Information">
            <div className="info-strip-col">
              <span className="info-strip-label">Exhibition space</span>
              <span className="info-strip-value">
                <AnimatedCounter value="13000 sqm" duration={2000} />
              </span>
            </div>
            <div className="info-strip-col">
              <span className="info-strip-label">Exhibitors / Brands</span>
              <span className="info-strip-value">
                <AnimatedCounter value="120" duration={1600} />
              </span>
            </div>
            <div className="info-strip-col info-strip-focus">
              <span className="info-strip-label">Visitors</span>
              <span className="info-strip-value">
                <AnimatedCounter value="8000+" duration={1800} />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 1. First Section after hero: About the Expo (Block A-1, Decision D10) */}
      <section className="expo-intro-section page-width" style={{ padding: "calc(var(--section-gap) + 10px) 0" }}>
        <div className="expo-intro-grid">
          <Reveal className="expo-intro-content">
            <p className="eyebrow">About the Expo</p>
            <div className="section-red-bar" aria-hidden="true" />
            <h2>
              TURNKEY SHOW…THE COAST’S COMPLETE PROPERTY <span className="headline-accent">SOLUTIONS</span> PLATFORM
            </h2>
            <p style={{ fontSize: "1.15rem", lineHeight: 1.7, color: "#222222", marginBottom: "1rem" }}>
              A premium show dedicated to furniture, fit-out, appliances, outdoor living and smart technology for coastal and hospitality properties.
            </p>
            <p style={{ fontSize: "1.15rem", lineHeight: 1.7, color: "#333333", marginBottom: "1.5rem" }}>
              Turnkey Show connects property owners, investors, developers and hospitality professionals with leading brands and solution providers, offering everything needed to transform delivered properties into ready-to-live, ready-to-rent and investment-ready destinations.
            </p>
          </Reveal>

          <Reveal className="expo-intro-media">
            <div className="expo-media-frame">
              <img
                src={livingRoom}
                alt="Turnkey Show contemporary coastal furnishing and design"
                width={1600}
                height={1024}
                loading="lazy"
              />
              <div className="expo-media-badge liquid-glass-dark">
                <span className="badge-title">From Handover to Value</span>
                <span className="badge-subtitle">Alamein International Convention Center</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Marquee Ribbon: Seamless infinite sector loop (Section 12.2.8) */}
      <MarqueeRibbon />

      {/* 2. Second Section: Industry Section with 'Learn more' button -> /about/market-overview (Decision D10) */}
      <section className="intro-section page-width" id="market-overview" style={{ paddingTop: "calc(var(--section-gap) + 10px)" }}>
        <div className="intro-main-row">
          <Reveal className="intro-image-wrap">
            <img
              src={oceanfrontTerrace}
              alt="Luxury oceanfront terrace overlooking the Mediterranean coast"
              width={1600}
              height={1024}
              loading="lazy"
            />
            <span className="image-index liquid-glass-dark">From Handover to Ready-to-Live</span>
          </Reveal>
          <Reveal className="intro-copy">
            <p className="eyebrow">Market Overview</p>
            <div className="section-red-bar" aria-hidden="true" />
            <h2>
              THE NORTH COAST IS ENTERING A NEW <span className="headline-accent">ERA</span>
            </h2>
            <p style={{ fontWeight: 600, color: "var(--tk-red)", marginBottom: "0.75rem", fontSize: "0.975rem" }}>
              From seasonal destinations to a growing year-round investment, hospitality and lifestyle economy.
            </p>
            <p style={{ fontSize: "0.975rem", lineHeight: 1.65, color: "#333333" }}>
              The North Coast and the city of New Alamein are experiencing a new phase of growth, driven by real estate expansion, increased hotel and residential capacity, and a surge in tourism activity, alongside a growing trend to transform the region into a year-round destination.
            </p>
            <div style={{ marginTop: "1.75rem" }}>
              <a className="hero-btn hero-btn-primary" href="/about/market-overview" style={{ display: "inline-flex" }}>
                Learn more
                <ArrowUpRight className="hero-btn-icon" width="16" height="16" />
              </a>
            </div>
          </Reveal>
        </div>

      {/* Two Markets, One Opportunity — above Core Sectors */}
      <div className="two-markets-section" id="two-markets">
        <Reveal className="section-heading" style={{ marginBottom: "2rem" }}>
          <div>
            <div className="section-red-bar" aria-hidden="true" />
            <h2>TWO MARKETS… <span className="headline-accent">ONE OPPORTUNITY</span></h2>
            <p style={{ maxWidth: "60ch", fontSize: "1.1rem", color: "#444" }}>
              Every new property creates a new demand cycle — from development to handover, furnishing, equipping, and ongoing upgrades.
            </p>
          </div>
        </Reveal>
        <div className="two-markets-grid">
          <Reveal className="market-col market-col-new">
            <h3 style={{ color: "var(--tk-red)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>→ New Supply</h3>
            <ul className="market-list">
              <li>For sale</li>
              <li>Hotel facilities</li>
              <li>Utilities &amp; Accessories</li>
              <li>Outdoor Furniture</li>
              <li>Smart Technology</li>
              <li>Complete Fit-Out</li>
            </ul>
          </Reveal>
          <Reveal className="market-col market-col-existing">
            <h3 style={{ color: "var(--tk-black)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>→ Existing Supply</h3>
            <ul className="market-list">
              <li>Re-creation</li>
              <li>Furniture Renewal</li>
              <li>Home furnishings</li>
              <li>Smart Technology</li>
              <li>Fit-Out Optimization</li>
            </ul>
          </Reveal>
        </div>
      </div>

        {/* Full-width numbers banner spanning across the entire section width with counting animation */}
        <Reveal className="home-stats-banner">
          {stats.map((stat) => (
            <div className="home-stat-box" key={stat.value}>
              <strong className="stat-num">
                <AnimatedCounter value={stat.value} />
              </strong>
              <span className="stat-label">{stat.label}</span>
              <span className="stat-sub">{stat.sub}</span>
            </div>
          ))}
        </Reveal>
      </section>

      {/* 3. Sectors Section: Grayscale default, color on hover, NO number labels (Section 4.3 & 4.4) */}
      <section className="sectors-section section-band" id="sectors">
        <div className="page-width">
          <Reveal className="section-heading">
            <div>
              <p className="eyebrow">Core Sectors</p>
              <div className="section-red-bar" aria-hidden="true" />
              <h2>All Needs Under One <span className="headline-accent">Roof</span></h2>
              <p>Complete fitting-out sectors required to transform a property into a fully furnished, finished space.</p>
            </div>
            <a className="text-link" href="/exhibit/why-exhibit">
              Exhibitor Opportunities <ArrowUpRight className="w-4 h-4 ml-1 inline" aria-hidden="true" />
            </a>
          </Reveal>
          <div className="sector-grid">
            {sectors.map((sector) => (
              <Reveal key={sector.title}>
                <a href="/exhibit/why-exhibit" className="sector-card" aria-label={sector.title}>
                  <img src={sector.image} alt={sector.title} width={1600} height={1024} loading="lazy" />
                  <div className="sector-card-copy">
                    <h3>{sector.title}</h3>
                    <p>{sector.detail}</p>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Ecosystem / Opportunity Section */}
      <section className="opportunity-section page-width">
        <Reveal className="opportunity-copy">
          <p className="eyebrow">The Concept</p>
          <div className="section-red-bar" aria-hidden="true" />
          <h2>
            From Property Delivery<br />
            to Property <span className="headline-accent">Value.</span>
          </h2>
          <p>
            A property's journey doesn't end at handover. It needs to be furnished, equipped, connected, and continuously upgraded.
            Turnkey Show connects the entire ecosystem — manufacturers, suppliers, developers, operators, and property buyers — under one roof.
          </p>
          <div className="expo-pillar-chips">
            {SHOW_SECTORS.map((sector) => (
              <div key={sector} className="pillar-chip">
                <span className="pillar-dot" aria-hidden="true" />
                <span>{sector}</span>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal className="opportunity-visual">
          <img
            src={smartLiving}
            alt="Smart coastal living space with modern furnishings"
            width={1600}
            height={1024}
            loading="lazy"
          />
          <div className="opportunity-stamp liquid-glass-dark">
            <span>ONE DESTINATION</span>
            <span>EVERY SOLUTION</span>
            <span className="stamp-sub">COMPLETE PURCHASE JOURNEY</span>
          </div>
        </Reveal>
      </section>

      {/* Venue Section */}
      <section className="venue-section" id="venue">
        <div className="venue-image">
          <img
            src={venueImage}
            alt="New Alamein International Convention and Exhibition Center"
            width={1600}
            height={1024}
            loading="lazy"
          />
        </div>
        <div className="page-width venue-content-wrap">
          <Reveal className="venue-copy">
            <p className="eyebrow">Venue</p>
            <div className="section-red-bar" aria-hidden="true" />
            <h2>
              New Alamein International<br />
              <span className="headline-accent">Convention &amp; Exhibition Center</span>
            </h2>
            <p>
              A purpose-built international venue equipped with plenary conference halls, advanced audiovisual and interpretation systems, dedicated bilateral meeting suites, and integrated professional services on Egypt's Mediterranean coast.
            </p>
            <div className="venue-specs">
              <div className="venue-spec-item">
                <span className="spec-val">Plenary</span>
                <span className="spec-label">Halls &amp; Meeting Suites</span>
              </div>
              <div className="venue-spec-item">
                <span className="spec-val">Modern</span>
                <span className="spec-label">AV &amp; Interpretation</span>
              </div>
              <div className="venue-spec-item">
                <span className="spec-val">Integrated</span>
                <span className="spec-label">Technical Services</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
