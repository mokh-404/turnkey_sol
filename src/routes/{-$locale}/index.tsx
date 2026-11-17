import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, ArrowRight } from "lucide-react";

import heroImage from "@/assets/hero-coast.webp";
import livingRoom from "@/assets/living-room.webp";
import terraceSunset from "@/assets/terrace-sunset.webp";
import lobbyOcean from "@/assets/lobby-ocean.webp";
import smartHome from "@/assets/smart-home.webp";
import smokedOakApplianceWall from "@/assets/smoked-oak-appliance-wall.webp";
import warmKitchen from "@/assets/warm-kitchen.webp";
import villaShowcase from "@/assets/villa-showcase.webp";
import oceanfrontTerrace from "@/assets/oceanfront-terrace.webp";
import smartLiving from "@/assets/smart-living.webp";
import venueImage from "@/assets/venue.webp";
import apexLogo from "@/assets/logos/apex-logo.png";
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
    image: smokedOakApplianceWall,
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
            <div className="hero-top-split">
              <div className="hero-title-col">
                <h1 className="hero-headline">
                  Alamein<br />Turnkey<br />Show
                </h1>
                <div className="hero-red-bar" aria-hidden="true" />
              </div>
              <div className="hero-meta-right">
                <p className="hero-subhead hero-definition-right">
                  The Alamein Trade Show for Furniture,<br />
                  Smart Furnishing Technologies &amp; Complete<br />
                  Fit-Out Solutions for Coastal Units
                </p>
                <p className="hero-subhead hero-date-venue-right">
                  <span className="hero-date-only-red">{EVENT_CONFIG.dates}</span>
                  <span className="hero-venue-line1">
                    <span>New</span> <span>Alamein</span> <span>International</span>
                  </span>
                  <span className="hero-venue-line2">Convention and Exhibition Center</span>
                </p>
              </div>
            </div>

            {/* 8 Sectors in a 2×7 grid: all sector labels centered in their columns */}
            <div className="hero-sectors-text" aria-label="Exhibition Sectors">
              {[sectors.slice(0, 4), sectors.slice(4, 8)].map((row) =>
                row.map((sector, idx) => (
                  <span key={sector.title} className="hero-sector-group">
                    {idx > 0 && <span className="hero-sector-pipe" aria-hidden="true" />}
                    <span className="hero-sector-label">{sector.title}</span>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Anchored Info Strip */}
          <div className="hero-info-strip liquid-glass-dark" role="region" aria-label="Event Key Information">
            <div className="info-strip-col">
              <span className="info-strip-label">Exhibition space</span>
              <span className="info-strip-value">
                <AnimatedCounter value="13000 sqm" />
              </span>
            </div>
            <div className="info-strip-col">
              <span className="info-strip-label">Exhibitors / Brands</span>
              <span className="info-strip-value">
                <AnimatedCounter value="120" />
              </span>
            </div>
            <div className="info-strip-col info-strip-focus">
              <span className="info-strip-label">Visitors</span>
              <span className="info-strip-value">
                <AnimatedCounter value="8000+" />
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
            <p style={{ fontSize: "1.08rem", lineHeight: 1.68, color: "#222222", marginBottom: "1rem" }}>
              The first-of-its-kind trade exhibition in the heart of New Alamein City, this pioneering event serves as an integrated strategic platform connecting leading investors, owners of coastal and hospitality properties, and top real estate developers with premier companies specializing in furniture, interior furnishing, and smart property solutions.
            </p>
            <p style={{ fontSize: "1.08rem", lineHeight: 1.68, color: "#333333", marginBottom: "1rem" }}>
              Designed to redefine the property furnishing experience, the exhibition offers an exclusive, all-in-one destination that eliminates the need for lengthy searches and multiple suppliers. From luxury furniture and contemporary décor to smart home management systems and sustainable energy solutions, visitors and investors can discover everything they need under one roof.
            </p>
            <p style={{ fontSize: "1.08rem", lineHeight: 1.68, color: "#333333", marginBottom: 0 }}>
              More than just an exhibition, this event is a dynamic hub for business connections and investment opportunities, empowering exhibitors to maximize their sales potential and connect directly with a highly targeted audience of serious buyers with immediate purchasing intent.
            </p>
          </Reveal>

          <Reveal className="expo-intro-media">
            <div className="expo-media-frame">
              <img
                src={livingRoom}
                alt="Turnkey Show contemporary coastal furnishing and design"
                width={1600}
                height={1024}
                decoding="async"
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

      {/* 2. Second Section: Two Markets, One Opportunity next to the image */}
      <section className="intro-section page-width" id="market-overview">
        <div className="intro-main-row intro-markets-row">
          <Reveal className="intro-image-wrap">
            <img
              src={oceanfrontTerrace}
              alt="Luxury oceanfront terrace overlooking the Mediterranean coast"
              width={1600}
              height={1024}
              decoding="async"
            />
            <span className="image-index liquid-glass-dark">From Handover to Ready-to-Live</span>
          </Reveal>

          <div className="two-markets-section two-markets-side" id="two-markets">
            <Reveal className="section-heading two-markets-heading">
              <div>
                <div className="section-red-bar" aria-hidden="true" />
                <h2>
                  THE NORTH COAST IS ENTERING A NEW <span className="headline-accent">ERA</span>
                </h2>
                <p className="two-markets-subtitle">
                  TWO MARKETS… <span className="headline-accent">ONE OPPORTUNITY</span>
                </p>
              </div>
            </Reveal>
            <div className="two-markets-grid">
              <Reveal className="market-col market-col-new">
                <h3 className="market-col-title">
                  <svg className="tk-chevron-icon" viewBox="0 0 100 120" fill="currentColor" aria-hidden="true">
                    <polygon points="0,0 45,0 100,60 45,120 0,120 55,60" />
                  </svg>
                  <span>NEW SUPPLY</span>
                </h3>
                <p className="market-col-lead">New handovers create immediate demand.</p>
                <ul className="market-list">
                  <li>Furniture</li>
                  <li>Home Appliances</li>
                  <li>Lighting &amp; Accessories</li>
                  <li>Outdoor Furniture</li>
                  <li>Smart Home Solutions</li>
                  <li>Complete Fit-Out</li>
                </ul>
              </Reveal>
              <Reveal className="market-col market-col-existing">
                <h3 className="market-col-title">
                  <svg className="tk-chevron-icon" viewBox="0 0 100 120" fill="currentColor" aria-hidden="true">
                    <polygon points="0,0 45,0 100,60 45,120 0,120 55,60" />
                  </svg>
                  <span>EXISTING SUPPLY</span>
                </h3>
                <p className="market-col-lead">Existing properties create recurring demand.</p>
                <ul className="market-list">
                  <li>Renovation</li>
                  <li>Furniture Replacement</li>
                  <li>Interior Upgrades</li>
                  <li>Smart Technology</li>
                  <li>Outdoor Upgrades</li>
                  <li>Rental Optimization</li>
                </ul>
              </Reveal>
            </div>
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
          </Reveal>
          <div className="sector-grid">
            {sectors.map((sector) => (
              <Reveal key={sector.title}>
                <a href="/exhibit/why-exhibit" className="sector-card" aria-label={sector.title}>
                  <img src={sector.image} alt={sector.title} width={1600} height={1024} decoding="async" />
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

      {/* Venue Section */}
      <section className="venue-section" id="venue">
        <div className="venue-image">
          <img
            src={venueImage}
            alt="New Alamein International Convention & Exhibition Center"
            width={1600}
            height={1024}
            decoding="async"
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

      {/* Powered By Section */}
      {/*
      <section className="supported-by-section" id="supported-by" aria-label="Powered By">
        <div className="supported-by-banner">
          <img
            src={lobbyOcean}
            alt="Powered By background"
            className="supported-by-bg-img"
            width={1600}
            height={400}
            decoding="async"
          />
          <div className="supported-by-overlay" aria-hidden="true" />
          <h2 className="supported-by-title">Powered By</h2>
        </div>
        <div className="supported-by-logos page-width">
          <Reveal className="supported-by-logo-item">
            <img
              src={apexLogo}
              alt="Apex Conventions and Trade Fairs"
              className="supported-by-apex-logo"
              width={260}
              height={80}
              decoding="async"
            />
          </Reveal>
        </div>
      </section>
      */}
    </SiteLayout>
  );
}
