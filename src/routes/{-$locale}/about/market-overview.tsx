import { createFileRoute } from "@tanstack/react-router";

import lobbyOcean from "@/assets/lobby-ocean.webp";
import { AnimatedCounter, PageHero, Reveal, SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/about/market-overview")({
  component: MarketOverviewPage,
  head: () => ({
    meta: [
      { title: "Market Overview | About | Turnkey Show Alamein 2027" },
      {
        name: "description",
        content:
          "The North Coast and New Alamein are experiencing a new phase of growth. Discover the market at a glance.",
      },
      { property: "og:title", content: "Market Overview | About" },
      { property: "og:type", content: "website" },
    ],
  }),
});

function MarketOverviewPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Market Overview"
        image={lobbyOcean}
        imageAlt="Hospitality and resort architectural design"
      />

      {/* Block M-1 — copy flows naturally (no forced gap); the image is sized
          to the copy column so its top and bottom edges align with the text. */}
      <section className="page-width editorial-section-grid editorial-section-grid--fit-copy" id="market-intro">
        <Reveal className="editorial-copy">
          <p className="eyebrow">Market Context</p>
          <div className="section-red-bar" aria-hidden="true" />
          <h2>A NEW PHASE OF <span className="headline-accent">GROWTH</span></h2>
          <p>
            The North Coast and the city of New Alamein are experiencing a new phase of growth, driven by real estate
            expansion, increased hotel and residential capacity, and a surge in tourism activity, alongside a growing
            trend to transform the region into a year-round destination.
          </p>
          <p className="editorial-copy-statement">
            This growth is generating not only new real estate units but also a burgeoning market for properties ready
            for occupancy, rental, operation, and investment—as well as the associated Furniture, Home Appliances,
            Lighting &amp; Accessories, fixtures, outdoor living solutions, Smart Home Solutions, Complete Fit-Out.
          </p>
        </Reveal>
        <Reveal className="editorial-media">
          <img src={lobbyOcean} alt="North Coast growth" width={1600} height={1024} decoding="async" />
        </Reveal>
      </section>

      {/* Two Markets, One Opportunity — above Core Sectors */}
      <section className="two-markets-section page-width" id="two-markets">
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
      </section>

      {/* Block M-3 — Market at a Glance [BROCHURE] */}
      <section className="market-glance-section section-band full-width-section" id="market-glance">
        <div className="page-width">
          <Reveal className="section-heading">
            <div>
              <p className="eyebrow">Key Indicators</p>
              <div className="section-red-bar" aria-hidden="true" />
              <h2 style={{ color: "#ffffff" }}>THE MARKET AT A <span className="headline-accent">GLANCE</span></h2>
              <p style={{ color: "#d1d5db" }}>Three indicators reflect the scale and momentum of the market.</p>
            </div>
          </Reveal>
          <div className="market-stats-grid">
            <Reveal className="market-stat">
              <span className="stat-figure"><AnimatedCounter value="EGP 1.2T" /></span>
              <span className="stat-label">REAL ESTATE TRANSACTIONS</span>
              <span className="stat-context">North Coast | 2024–2025</span>
            </Reveal>
            <Reveal className="market-stat">
              <span className="stat-figure"><AnimatedCounter value="EGP 185B" /></span>
              <span className="stat-label">TARGETED INVESTMENT</span>
              <span className="stat-context">New Alamein</span>
            </Reveal>
            <Reveal className="market-stat">
              <span className="stat-figure"><AnimatedCounter value="46,189+" /></span>
              <span className="stat-label">RESIDENTIAL UNITS</span>
              <span className="stat-context">New Alamein</span>
            </Reveal>
          </div>
          <p className="market-stat-footnote" style={{ color: "#9ca3af" }}>
            Market indicators reported across 2025–2026 sources. Figures represent different market measures and should
            not be treated as a single investment value.
          </p>
        </div>
      </section>

    </SiteLayout>
  );
}

