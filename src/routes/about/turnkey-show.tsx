import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import heroImage from "@/assets/hero-coast.webp";
import livingRoom from "@/assets/living-room.webp";
import kitchen from "@/assets/kitchen.webp";
import warmKitchen from "@/assets/warm-kitchen.webp";
import smartHome from "@/assets/smart-home.webp";
import smartLiving from "@/assets/smart-living.webp";
import terraceSunset from "@/assets/terrace-sunset.webp";
import lobbyOcean from "@/assets/lobby-ocean.webp";
import villaShowcase from "@/assets/villa-showcase.webp";
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
  { name: "Furniture & Interiors", img: livingRoom },
  { name: "Kitchens & Equipment", img: warmKitchen },
  { name: "Home Appliances", img: kitchen },
  { name: "Outdoor Living", img: terraceSunset },
  { name: "Smart Unit Automation", img: smartHome },
  { name: "Modern Lighting Technology", img: smartLiving },
  { name: "Hospitality Fit-Out", img: lobbyOcean },
  { name: "Complete Solutions", img: villaShowcase },
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
      <section className="page-width editorial-section-grid" id="intro">
        <Reveal className="editorial-copy">
          <div className="editorial-copy-content">
            <p className="eyebrow">The Platform</p>
            <div className="section-red-bar" aria-hidden="true" />
            <h2>CONNECTING THE COAST'S COMPLETE PROPERTY <span className="headline-accent">ECOSYSTEM</span></h2>
            <p style={{ fontSize: "1.15rem", lineHeight: 1.7, color: "#222222", marginBottom: "1.25rem" }}>
              Turnkey Show connects property owners, investors, developers and hospitality professionals with leading
              brands and solution providers, offering everything needed to transform delivered properties into
              ready-to-live, ready-to-rent and investment-ready destinations.
            </p>
          </div>
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
          <div className="editorial-copy-content">
            <p className="eyebrow">THE CONCEPT</p>
            <div className="section-red-bar" aria-hidden="true" />
            <h2>FROM PROPERTY DELIVERY TO PROPERTY VALUE</h2>
            <p>A property's journey doesn't end at handover. It needs to be furnished, equipped, connected and continuously upgraded.</p>
          </div>
          <p className="editorial-copy-statement">
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
        <Reveal className="editorial-copy">
          <div className="editorial-copy-content">
            <p className="eyebrow">THE SHOW PROMISE</p>
            <div className="section-red-bar" aria-hidden="true" />
            <h2>ONE DESTINATION. THE COMPLETE PROPERTY FIT-OUT.</h2>
            <p>
              From the first furniture piece to the latest smart-home solution, the show is designed to showcase
              everything required to create a complete, functional and attractive coastal property.
            </p>
          </div>
          <p className="editorial-copy-statement">
            It connects <strong>Furniture &amp; Interiors, Home Appliances, Outdoor Living, Smart Home Technology,
            Lighting &amp; Accessories, Hospitality Fit-Out, Property Solutions</strong> under one roof.
          </p>
        </Reveal>
        <Reveal className="editorial-media">
          <img src={kitchen} alt="Smart appliances and fixtures" width={1600} height={1024} loading="lazy" />
        </Reveal>
      </section>

      {/* Block A-4 — The Vision */}
      <section className="page-width editorial-section-grid" id="vision">
        <Reveal className="editorial-copy">
          <div className="editorial-copy-content">
            <p className="eyebrow">THE VISION</p>
            <div className="section-red-bar" aria-hidden="true" />
            <h2>THE DESTINATION FOR COASTAL PROPERTY SOLUTIONS</h2>
            <p>
              To create the leading platform connecting real estate, design, technology and hospitality — transforming
              coastal properties into furnished, connected, functional and investment-ready experiences.
            </p>
          </div>
          <div className="editorial-stat-tag">
            <span className="editorial-tag-dot" aria-hidden="true" />
            <span>CONNECTING REAL ESTATE, DESIGN &amp; HOSPITALITY</span>
          </div>
        </Reveal>
        <Reveal className="editorial-media">
          <img src={smartHome} alt="Connected smart living solutions" width={1600} height={1024} loading="lazy" />
        </Reveal>
      </section>

      {/* Block A-5 — The Opportunity */}
      <section className="page-width editorial-section-grid" id="opportunity">
        <Reveal className="editorial-copy">
          <div className="editorial-copy-content">
            <p className="eyebrow">THE OPPORTUNITY</p>
            <div className="section-red-bar" aria-hidden="true" />
            <h2>FROM PROPERTY DELIVERY... TO PROPERTY VALUE</h2>
            <p>
              The growth of North Coast &amp; New Alamein is creating more than real estate supply. It is creating a
              growing ecosystem of Furnished, Equipped, Connected, Operated and Investment-ready properties.
            </p>
          </div>
          <div className="editorial-stat-tag">
            <span className="editorial-tag-dot" aria-hidden="true" />
            <span>FURNISHED • EQUIPPED • CONNECTED • OPERATED</span>
          </div>
        </Reveal>
        <Reveal className="editorial-media">
          <img src={livingRoom} alt="Coastal property opportunity" width={1600} height={1024} loading="lazy" />
        </Reveal>
      </section>

      {/* Block A-6 — Sector Cards */}
      <section className="exhibit-sectors section-band" id="sectors">
        <div className="page-width">
          <Reveal className="section-heading">
            <div>
              <p className="eyebrow">SHOW SECTORS</p>
              <div className="section-red-bar" aria-hidden="true" />
              <h2>THE SHOW CONNECTS THE ENTIRE UNIT-FITTING SECTORS</h2>
            </div>
          </Reveal>
          <div className="sector-grid">
            {sectors.map((sector) => (
              <Reveal key={sector.name}>
                <a href="/exhibit/why-exhibit" className="sector-card" aria-label={sector.name}>
                  <img src={sector.img} alt={sector.name} width={1600} height={1024} loading="lazy" />
                  <div className="sector-card-copy">
                    <h3>{sector.name}</h3>
                  </div>
                </a>
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
              <p className="eyebrow">WHY NOW?</p>
              <div className="section-red-bar" aria-hidden="true" />
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

    </SiteLayout>
  );
}

