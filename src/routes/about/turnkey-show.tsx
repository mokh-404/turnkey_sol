import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import heroImage from "@/assets/hero-coast.webp";
import livingRoom from "@/assets/living-room.webp";
import kitchen from "@/assets/kitchen.webp";
import smokedOakApplianceWall from "@/assets/smoked-oak-appliance-wall.webp";
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
  { name: "Home Appliances", img: smokedOakApplianceWall },
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
        image={livingRoom}
        imageAlt="Luxury coastal interior living room"
      />

      {/* Block A-1 continued (Enriched with image & key highlights) */}
      <section className="page-width editorial-section-grid" id="intro">
        <Reveal className="editorial-copy">
          <div className="editorial-copy-content">
            <h2>CONNECTING THE COAST'S COMPLETE PROPERTY <span className="headline-accent">ECOSYSTEM</span></h2>
            <p>
              The first-of-its-kind trade exhibition in the heart of New Alamein City, this pioneering event serves as
              an integrated strategic platform connecting leading investors, owners of coastal and hospitality
              properties, and top real estate developers with premier companies specializing in furniture, interior
              furnishing, and smart property solutions.
            </p>
            <p>
              Designed to redefine the property furnishing experience, the exhibition offers an exclusive, all-in-one
              destination that eliminates the need for lengthy searches and multiple suppliers. From luxury furniture
              and contemporary décor to smart home management systems and sustainable energy solutions, visitors and
              investors can discover everything they need under one roof.
            </p>
            <p style={{ marginBottom: 0 }}>
              More than just an exhibition, this event is a dynamic hub for business connections and investment
              opportunities, empowering exhibitors to maximize their sales potential and connect directly with a highly
              targeted audience of serious buyers with immediate purchasing intent.
            </p>
          </div>
        </Reveal>
        <Reveal className="editorial-media">
          <div className="expo-media-frame">
            <img src={terraceSunset} alt="Mediterranean coastal living and luxury interiors" width={1600} height={1024} decoding="async" />
            <div className="expo-media-badge liquid-glass-dark">
              <span className="badge-title">06 – 09 May 2027</span>
              <span className="badge-subtitle">New Alamein International Convention Center</span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Blocks A-2 to A-5 — 2-Row Editorial Pillars (no images) */}
      <section className="page-width turnkey-pillars-section" id="pillars">
        <div className="turnkey-pillars-grid">
          <Reveal className="turnkey-pillar-card">
            <div id="concept">
              <h2>THE CONCEPT</h2>
              <div className="section-red-bar" aria-hidden="true" />
              <p>
                <strong>From property delivery to property value.</strong> A property&apos;s journey doesn&apos;t end at
                handover. It needs to be furnished, equipped, connected and continuously upgraded.
              </p>
              <p>
                Turnkey Show brings these complete sectors together — connecting the growing coastal property market
                with the brands and solutions that shape its next stage.
              </p>
            </div>
          </Reveal>

          <Reveal className="turnkey-pillar-card">
            <div id="promise">
              <h2>THE SHOW PROMISE</h2>
              <div className="section-red-bar" aria-hidden="true" />
              <p>
                <strong>One destination. The complete property fit-out.</strong> From the first furniture piece to the
                latest smart-home solution, the show is designed to showcase everything required to create a complete,
                functional and attractive coastal property.
              </p>
              <p>
                It connects{" "}
                <strong>
                  Furniture &amp; Interiors, Home Appliances, Outdoor Living, Smart Home Technology, Lighting &amp;
                  Accessories, Hospitality Fit-Out, Property Solutions
                </strong>{" "}
                under one roof.
              </p>
            </div>
          </Reveal>

          <Reveal className="turnkey-pillar-card">
            <div id="vision">
              <h2>THE VISION</h2>
              <div className="section-red-bar" aria-hidden="true" />
              <p>
                <strong>The destination for coastal property solutions.</strong> To create the leading platform
                connecting real estate, design, technology and hospitality — transforming coastal properties into
                furnished, connected, functional and investment-ready experiences.
              </p>
            </div>
          </Reveal>

          <Reveal className="turnkey-pillar-card">
            <div id="opportunity">
              <h2>THE OPPORTUNITY</h2>
              <div className="section-red-bar" aria-hidden="true" />
              <p>
                <strong>From property delivery... to property value.</strong> The growth of North Coast &amp; New
                Alamein is creating more than real estate supply. It is creating a growing ecosystem of Furnished,
                Equipped, Connected, Operated and Investment-ready properties.
              </p>
            </div>
          </Reveal>
        </div>
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
                  <img src={sector.img} alt={sector.name} width={1600} height={1024} decoding="async" />
                  <div className="sector-card-copy">
                    <h3>{sector.name}</h3>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

