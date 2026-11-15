import { createFileRoute } from "@tanstack/react-router";

import livingRoom from "@/assets/living-room.webp";
import terraceSunset from "@/assets/terrace-sunset.webp";
import smartLiving from "@/assets/smart-living.webp";
import kitchen from "@/assets/kitchen.webp";
import villaShowcase from "@/assets/villa-showcase.webp";
import lobbyOcean from "@/assets/lobby-ocean.webp";
import { AnimatedCounter, PageHero, Reveal, SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/exhibit/why-exhibit")({
  component: WhyExhibitPage,
  head: () => ({
    meta: [
      { title: "Why Exhibit | Exhibit | Turnkey Show Alamein 2027" },
      {
        name: "description",
        content:
          "Position your brand at the heart of the North Coast's next wave of demand. Exhibit at Turnkey Show 2027.",
      },
      { property: "og:title", content: "Why Exhibit | Exhibit" },
      { property: "og:type", content: "website" },
    ],
  }),
});

const sectors = [
  { name: "Furniture", img: livingRoom, desc: "Furnishing solutions for new handovers and existing coastal properties." },
  { name: "Appliances", img: kitchen, desc: "Essential, built-in and lifestyle appliances for ready-to-operate units." },
  { name: "Outdoor", img: terraceSunset, desc: "Outdoor furniture and solutions designed for the coastal lifestyle." },
  { name: "Smart Home", img: smartLiving, desc: "Technology for comfort, security, energy efficiency and connected living." },
  { name: "Hospitality Fit-Out", img: lobbyOcean, desc: "Solutions for hotels, serviced apartments and rental properties." },
  { name: "Complete Solutions", img: villaShowcase, desc: "Integrated solutions taking properties from handover to investment-ready." },
];

function WhyExhibitPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Why Exhibit"
        title={"POSITION YOUR BRAND AT THE HEART OF\nTHE NORTH COAST'S NEXT WAVE OF DEMAND."}
        description="Alamein Turnkey Show comes at a pivotal moment for the residential, hospitality, and tourism market in New Alamein and the North Coast."
        image={villaShowcase}
        imageAlt="Luxury coastal villa showcase"
        primaryBtn={{ label: "Book your space", href: "/exhibit/book-your-space" }}
        secondaryBtn={{ label: "Download brochure", href: "/exhibit/download-brochure" }}
      />

      {/* Highlight Key Stat */}
      <section className="page-width exhibit-key-stat" style={{ paddingTop: "2.5rem", paddingBottom: "2.5rem" }}>
        <Reveal className="exhibit-stat-card" style={{ minHeight: "180px", padding: "2.5rem 3rem", boxSizing: "border-box" }}>
          <div className="stat-number" style={{ minWidth: "260px", width: "260px", flexShrink: 0, fontVariantNumeric: "tabular-nums" }}>
            <AnimatedCounter value="15,000+" />
          </div>
          <div className="stat-text">
            <div className="section-red-bar" aria-hidden="true" />
            <h3>UNITS ENTERING FINISHING &amp; <span className="headline-accent">FURNISHING</span> STAGE</h3>
            <p>
              With the 2027 delivery pipeline indicating more than 15,000 residential and tourism units entering delivery across New Alamein and the North Coast, a significant wave of demand is surging for furniture, interiors, technology, finishing, and turnkey solutions.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Intro */}
      <section className="page-width exhibit-statement" id="why-exhibit-intro">
        <Reveal className="exhibit-statement-main">
          <p>
            With the 2027 delivery pipeline indicating more than 15,000 residential and tourism units entering the
            finishing and furnishing stage, a significant new wave of demand is emerging for furniture, interiors,
            technology, finishing, and turnkey solutions.
          </p>
          <p className="statement-punchline">
            Exhibit where demand is being created — and purchasing decisions are being made.
          </p>
        </Reveal>
      </section>

      {/* Under One Roof */}
      <section className="page-width editorial-section-grid" id="all-needs">
        <Reveal className="editorial-copy">
          <p className="eyebrow">Comprehensive Range</p>
          <div className="section-red-bar" aria-hidden="true" />
          <h2>ALL NEEDS UNDER ONE <span className="headline-accent">ROOF</span>, From Smart Furniture to Full Solutions.</h2>
          <p>
            The show brings together the complete fitting-out sectors required to transform a property into a fully
            furnished, finished, and ready-to-use space.
          </p>
          <p>
            Specialized sectors and dedicated halls create a seamless visitor experience while giving exhibitors direct
            access to a highly relevant target audience.
          </p>
          <p className="statement-punchline">One destination. Every solution. One complete purchase journey.</p>
          <div className="exhibit-cta-row" style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center", marginTop: "2rem" }}>
            <a href="/exhibit/book-your-space" className="hero-btn hero-btn-primary">
              Book your space
              <svg className="hero-btn-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 3.5L10.5 8L6 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a href="/exhibit/download-brochure" className="hero-btn hero-btn-editorial">
              Download brochure
              <span className="btn-arrow" style={{ marginLeft: "6px", color: "var(--tk-red)", fontWeight: 900 }}>&gt;</span>
            </a>
          </div>
        </Reveal>
      </section>

    </SiteLayout>
  );
}

