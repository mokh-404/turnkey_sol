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
      />

      {/* Highlight Key Stat */}
      <section className="page-width exhibit-key-stat">
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

      {/* 2-Row Organized Pillars */}
      <section className="page-width turnkey-pillars-section" style={{ paddingTop: "1rem" }}>
        <div className="turnkey-pillars-grid">
          <Reveal className="turnkey-pillar-card">
            <div id="why-exhibit-intro">
              <h2>WHERE DEMAND IS CREATED</h2>
              <div className="section-red-bar" aria-hidden="true" />
              <p>
                <strong>Exhibit where demand is being created — and purchasing decisions are being made.</strong>{" "}
                With the 2027 delivery pipeline indicating more than 15,000 residential and tourism units entering the
                finishing and furnishing stage, a significant new wave of demand is emerging for furniture, interiors,
                technology, finishing, and turnkey solutions.
              </p>
            </div>
          </Reveal>

          <Reveal className="turnkey-pillar-card">
            <div id="all-needs">
              <h2>ALL NEEDS UNDER ONE <span className="headline-accent">ROOF</span></h2>
              <div className="section-red-bar" aria-hidden="true" />
              <p>
                <strong>From Smart Furniture to Full Solutions.</strong> The show brings together the complete
                fitting-out sectors required to transform a property into a fully furnished, finished, and ready-to-use
                space.
              </p>
            </div>
          </Reveal>

          <Reveal className="turnkey-pillar-card">
            <div id="targeted-audience">
              <h2>SPECIALIZED SECTORS &amp; DEDICATED HALLS</h2>
              <div className="section-red-bar" aria-hidden="true" />
              <p>
                Specialized sectors and dedicated halls create a seamless visitor experience while giving exhibitors
                direct access to a highly relevant target audience.
              </p>
            </div>
          </Reveal>

          <Reveal className="turnkey-pillar-card">
            <div id="purchase-journey">
              <h2>ONE COMPLETE PURCHASE JOURNEY</h2>
              <div className="section-red-bar" aria-hidden="true" />
              <p>
                <strong>One destination. Every solution. One complete purchase journey.</strong> Covering Furniture,
                Appliances, Outdoor, Smart Home, Hospitality Fit-Out, and Complete Solutions.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

    </SiteLayout>
  );
}

