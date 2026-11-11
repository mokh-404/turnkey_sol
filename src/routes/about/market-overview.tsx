import { createFileRoute } from "@tanstack/react-router";

import lobbyOcean from "@/assets/lobby-ocean.webp";
import { AnimatedCounter, PageHero, Reveal, SiteLayout } from "@/components/SiteLayout";
import { DemandCycle } from "@/components/DemandCycle";

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
        title={"THE NORTH COAST IS ENTERING\nA NEW ERA"}
        description="From seasonal destinations to a growing year-round investment, hospitality and lifestyle economy."
        image={lobbyOcean}
        imageAlt="Hospitality and resort architectural design"
        primaryBtn={{ label: "Exhibit at the Show", href: "/exhibit/why-exhibit" }}
        secondaryBtn={{ label: "Download Brochure", href: "/exhibit/download-brochure" }}
      />

      {/* Block M-1 */}
      <section className="page-width editorial-section-grid" id="market-intro">
        <Reveal className="editorial-copy">
          <p>
            The North Coast and the city of New Alamein are experiencing a new phase of growth, driven by real estate
            expansion, increased hotel and residential capacity, and a surge in tourism activity, alongside a growing
            trend to transform the region into a year-round destination.
          </p>
          <p>
            This growth is generating not only new real estate units but also a burgeoning market for properties ready
            for occupancy, rental, operation, and investment—as well as the associated Furniture, Home Appliances,
            Lighting &amp; Accessories, fixtures, outdoor living solutions, Smart Home Solutions, Complete Fit-Out.
          </p>
        </Reveal>
        <Reveal className="editorial-media">
          <img src={lobbyOcean} alt="North Coast growth" width={1600} height={1024} loading="lazy" />
        </Reveal>
      </section>

      {/* Block M-2 — Two Markets One Opportunity */}
      <section className="two-market-section page-width" id="two-markets">
        <Reveal className="two-market-heading">
          <p className="eyebrow">Market Dynamics</p>
          <div className="section-red-bar" aria-hidden="true" />
          <h2>TWO MARKETS ONE <span className="headline-accent">OPPORTUNITY</span></h2>
        </Reveal>
        <div className="market-columns">
          <Reveal className="market-column">
            <span className="column-index">01 — NEW SUPPLY</span>
            <p>New handovers create immediate demand. Existing properties create recurring demand.</p>
            <ul>
              <li>Furniture</li>
              <li>Home Appliances</li>
              <li>Lighting &amp; Accessories</li>
              <li>Outdoor Furniture</li>
              <li>Smart Home Solutions</li>
              <li>Complete Fit-Out</li>
            </ul>
            <p className="market-outcome">
              <strong>The opportunity:</strong> Converting the unit from a &ldquo;delivered property&rdquo; to a
              &ldquo;ready-to-live&rdquo; or &ldquo;ready-to-rent&rdquo; property.
            </p>
          </Reveal>
          <Reveal className="market-column market-column-second">
            <span className="column-index">02 — EXISTING SUPPLY</span>
            <p>EXISTING UNITS CREATE RECURRING DEMAND</p>
            <ul>
              <li>Renovation</li>
              <li>Furniture Replacement</li>
              <li>Interior Upgrades</li>
              <li>Smart Technology</li>
              <li>Outdoor Upgrades</li>
              <li>Rental Optimization</li>
            </ul>
            <p className="market-outcome">
              <strong>The opportunity:</strong> Enhancing the unit&rsquo;s appeal, improving the user experience, and
              revitalizing its operational and investment value.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Block M-3 — Market at a Glance [BROCHURE] */}
      <section className="market-glance-section section-band full-width-section" id="market-glance">
        <div className="page-width">
          <Reveal className="section-heading">
            <div>
              <p className="eyebrow" style={{ color: "var(--tk-red)" }}>Key Indicators</p>
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

      {/* Block M-4 — The Demand Cycle [BROCHURE] (Section 12.2.7) */}
      <section className="demand-cycle-section page-width" id="demand-cycle">
        <Reveal className="section-heading">
          <div>
            <p className="eyebrow">Transformation Cycle</p>
            <div className="section-red-bar" aria-hidden="true" />
            <h2>THE <span className="headline-accent">DEMAND</span> CYCLE</h2>
            <p className="section-subtitle">FROM REAL ESTATE GROWTH TO FURNISHING DEMAND</p>
          </div>
          <p>Every new property creates a new demand cycle.</p>
        </Reveal>

        {/* Sequential 7-step light-up flow with drawn SVG arrows */}
        <Reveal>
          <DemandCycle />
        </Reveal>

        <Reveal>
          <p className="demand-cycle-closing">
            Each stage creates new demand — from initial fit-out and furnishing to upgrades, renovation and rental
            optimization.
          </p>
        </Reveal>
      </section>

      {/* Block M-5 — Market Sources [BROCHURE] */}
      <section className="market-sources-section page-width" id="market-sources">
        <p className="market-sources-text">
          <strong>MARKET SOURCES</strong> — Selected market indicators based on reported 2025–2026 industry and
          government sources, including Ahram Online, State Information Service (SIS), and AmCham Egypt Real Estate
          Industry Insight.
        </p>
      </section>
    </SiteLayout>
  );
}

