import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import heroImage from "@/assets/hero-coast.webp";
import livingRoom from "@/assets/living-room.webp";
import kitchen from "@/assets/kitchen.webp";
import smartHome from "@/assets/smart-home.webp";
import terraceSunset from "@/assets/terrace-sunset.webp";
import { PageHero, Reveal, SiteLayout } from "@/components/SiteLayout";
import { EVENT_CONFIG } from "@/config/event";

export const Route = createFileRoute("/about/turnkey-show")({
  component: TurnkeyShowPage,
  head: () => ({
    meta: [
      { title: "Turnkey Show | About | Turnkey Show Alamein 2027" },
      {
        name: "description",
        content:
          "A premium show dedicated to furniture, fit-out, appliances, outdoor living and smart technology for coastal and hospitality properties.",
      },
      { property: "og:title", content: "Turnkey Show | About" },
      { property: "og:type", content: "website" },
    ],
  }),
});

const sectors = [
  { name: "Furniture", img: livingRoom },
  { name: "Appliances", img: kitchen },
  { name: "Outdoor", img: livingRoom },
  { name: "Smart Home", img: smartHome },
  { name: "Hospitality Fit-Out", img: kitchen },
  { name: "Complete Solutions", img: smartHome },
];

function TurnkeyShowPage() {
  return (
    <SiteLayout>
      {/* Block A-1 */}
      <PageHero
        eyebrow="About the Show"
        title={"TURNKEY SHOW…THE COAST'S COMPLETE PROPERTY SOLUTIONS PLATFORM"}
        description="A premium show dedicated to furniture, fit-out, appliances, outdoor living and smart technology for coastal and hospitality properties."
        image={livingRoom}
        imageAlt="Luxury coastal interior living room"
        primaryBtn={{ label: "Explore Exhibiting", href: "/exhibit/why-exhibit" }}
        secondaryBtn={{ label: "Plan Your Visit", href: "/visit/why-visit" }}
      />

      {/* Block A-1 continued (Enriched with image & key highlights) */}
      <section className="page-width editorial-section-grid" id="intro" style={{ alignItems: "center" }}>
        <Reveal className="editorial-copy">
          <p className="eyebrow">The Platform</p>
          <div className="section-red-bar" aria-hidden="true" />
          <h2>CONNECTING THE COAST'S COMPLETE PROPERTY <span className="headline-accent">ECOSYSTEM</span></h2>
          <p style={{ fontSize: "1.15rem", lineHeight: 1.7, color: "#222222", marginBottom: "1.25rem" }}>
            Turnkey Show connects property owners, investors, developers and hospitality professionals with leading
            brands and solution providers, offering everything needed to transform delivered properties into
            ready-to-live, ready-to-rent and investment-ready destinations.
          </p>
          <div className="expo-pillar-chips" style={{ marginTop: "1rem" }}>
            <div className="pillar-chip">
              <span className="pillar-dot" aria-hidden="true" />
              <span>15,000+ Delivered Units</span>
            </div>
            <div className="pillar-chip">
              <span className="pillar-dot" aria-hidden="true" />
              <span>New Alamein &amp; North Coast</span>
            </div>
            <div className="pillar-chip">
              <span className="pillar-dot" aria-hidden="true" />
              <span>Full Fit-Out &amp; Smart Living</span>
            </div>
          </div>
        </Reveal>
        <Reveal className="editorial-media">
          <div className="expo-media-frame">
            <img src={terraceSunset} alt="Mediterranean coastal living and luxury interiors" width={1600} height={1024} loading="lazy" />
            <div className="expo-media-badge liquid-glass-dark">
              <span className="badge-title">06 – 09 May 2027</span>
              <span className="badge-subtitle">New Alamein International Convention Center</span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Block A-2 — The Concept */}
      <section className="page-width editorial-section-grid" id="concept">
        <Reveal className="editorial-copy">
          <p className="section-eyebrow">THE CONCEPT</p>
          <h2>FROM PROPERTY DELIVERY TO PROPERTY VALUE</h2>
          <p>A property's journey doesn't end at handover. It needs to be furnished, equipped, connected and continuously upgraded.</p>
          <p>
            Turnkey Show brings these complete sectors together — connecting the growing coastal property market with
            the brands and solutions that shape its next stage.
          </p>
        </Reveal>
        <Reveal className="editorial-media">
          <img src={livingRoom} alt="Complete furnishing for coastal property" width={1600} height={1024} loading="lazy" />
        </Reveal>
      </section>

      {/* Block A-3 — The Show Promise */}
      <section className="page-width editorial-section-grid" id="promise">
        <Reveal className="editorial-media">
          <img src={kitchen} alt="Smart appliances and fixtures" width={1600} height={1024} loading="lazy" />
        </Reveal>
        <Reveal className="editorial-copy">
          <p className="section-eyebrow">THE SHOW PROMISE</p>
          <h2>ONE DESTINATION. THE COMPLETE PROPERTY FIT-OUT.</h2>
          <p>
            From the first furniture piece to the latest smart-home solution, the show is designed to showcase
            everything required to create a complete, functional and attractive coastal property.
          </p>
          <p>
            It connects <strong>Furniture &amp; Interiors, Home Appliances, Outdoor Living, Smart Home Technology,
            Lighting &amp; Accessories, Hospitality Fit-Out, Property Solutions</strong> under one roof.
          </p>
        </Reveal>
      </section>

      {/* Block A-4 — The Vision */}
      <section className="page-width editorial-section-grid" id="vision">
        <Reveal className="editorial-copy">
          <p className="section-eyebrow">THE VISION</p>
          <h2>THE DESTINATION FOR COASTAL PROPERTY SOLUTIONS</h2>
          <p>
            To create the leading platform connecting real estate, design, technology and hospitality — transforming
            coastal properties into furnished, connected, functional and investment-ready experiences.
          </p>
        </Reveal>
        <Reveal className="editorial-media">
          <img src={smartHome} alt="Connected smart living solutions" width={1600} height={1024} loading="lazy" />
        </Reveal>
      </section>

      {/* Block A-5 — The Opportunity */}
      <section className="page-width editorial-section-grid" id="opportunity">
        <Reveal className="editorial-media">
          <img src={livingRoom} alt="Coastal property opportunity" width={1600} height={1024} loading="lazy" />
        </Reveal>
        <Reveal className="editorial-copy">
          <p className="section-eyebrow">THE OPPORTUNITY</p>
          <h2>FROM PROPERTY DELIVERY... TO PROPERTY VALUE</h2>
          <p>
            The growth of North Coast &amp; New Alamein is creating more than real estate supply. It is creating a
            growing ecosystem of Furnished, Equipped, Connected, Operated and Investment-ready properties.
          </p>
        </Reveal>
      </section>

      {/* Block A-6 — Sector Cards */}
      <section className="exhibit-sectors section-band" id="sectors">
        <div className="page-width">
          <Reveal className="section-heading">
            <div>
              <p className="section-eyebrow">SHOW SECTORS</p>
              <h2>THE SHOW CONNECTS THE ENTIRE UNIT-FITTING SECTORS</h2>
            </div>
          </Reveal>
          <div className="sector-grid">
            {sectors.map((sector, index) => (
              <Reveal key={sector.name} className={`sector-card sector-card-${index + 1}`}>
                <img src={sector.img} alt={sector.name} width={1600} height={1024} loading="lazy" />
                <div className="sector-card-copy">
                  <h3>{sector.name}</h3>
                  <span className="card-arrow">&gt;</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Block A-7 — Why Now */}
      <section className="why-now-section section-band" id="why-now">
        <div className="page-width">
          <Reveal className="section-heading">
            <div>
              <p className="section-eyebrow">WHY NOW?</p>
              <h2>A market moving from property delivery to property value creation.</h2>
            </div>
          </Reveal>
          <div className="market-signals">
            {[
              ["MORE DEVELOPMENT", "More properties entering the market."],
              ["MORE HANDOVERS", "More units entering the furnishing and fit-out cycle."],
              ["MORE TOURISM", "Growing seasonal and hospitality activity."],
              ["MORE RENTAL ACTIVITY", "Greater demand for attractive, ready-to-operate properties."],
              ["MORE UPGRADES", "Continuous demand for renovation, technology and property enhancement."],
            ].map(([title, text]) => (
              <Reveal key={title} className="signal">
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="cta-band" aria-label="Call to Action">
        <div className="cta-band-media">
          <img
            src={heroImage}
            alt="New Alamein Mediterranean coast"
            width={2400}
            height={900}
            loading="lazy"
          />
          <div className="cta-band-shade" aria-hidden="true" />
        </div>
        <div className="page-width cta-band-content">
          <div className="cta-band-text">
            <p className="eyebrow" style={{ color: "var(--tk-red)", fontWeight: 800, letterSpacing: "0.12em", marginBottom: "0.75rem" }}>
              EXHIBIT AT TURNKEY SHOW · {EVENT_CONFIG.dates}
            </p>
            <h2 style={{ color: "#ffffff", fontWeight: 900, marginBottom: "1rem" }}>
              Showcase Your Solutions to the Coast's Next Wave of <span className="headline-accent">Demand.</span>
            </h2>
            <p style={{ color: "#f3f4f6", fontSize: "1.25rem", lineHeight: 1.6, maxWidth: "680px", marginBottom: "1.5rem" }}>
              Position your brand where 15,000+ delivered units enter the finishing, furnishing, and smart living cycle.
            </p>
          </div>
          <div className="cta-band-actions">
            <a href="/exhibit/book-your-space" className="hero-btn hero-btn-primary">
              Book your space
              <ArrowUpRight className="hero-btn-icon" width="16" height="16" />
            </a>
            <a href="/exhibit/download-brochure" className="hero-btn hero-btn-secondary" style={{ color: "#ffffff", borderColor: "rgba(255, 255, 255, 0.85)" }}>
              Download brochure
              <ArrowRight className="hero-btn-icon" width="16" height="16" />
            </a>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

