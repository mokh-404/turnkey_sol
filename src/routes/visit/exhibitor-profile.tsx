import { createFileRoute } from "@tanstack/react-router";

import livingRoom from "@/assets/living-room.webp";
import terraceSunset from "@/assets/terrace-sunset.webp";
import smartLiving from "@/assets/smart-living.webp";
import smartHome from "@/assets/smart-home.webp";
import smokedOakApplianceWall from "@/assets/smoked-oak-appliance-wall.webp";
import warmKitchen from "@/assets/warm-kitchen.webp";
import villaShowcase from "@/assets/villa-showcase.webp";
import lobbyOcean from "@/assets/lobby-ocean.webp";
import { PageHero, Reveal, SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/visit/exhibitor-profile")({
  component: ExhibitorProfilePage,
  head: () => ({
    meta: [
      { title: "Exhibitor Profile | Visit | Turnkey Show Alamein 2027" },
      {
        name: "description",
        content:
          "Discover the exhibitor sectors at Turnkey Show 2027 — from furniture & interiors to complete property solutions.",
      },
      { property: "og:title", content: "Exhibitor Profile | Visit" },
      { property: "og:type", content: "website" },
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

function ExhibitorProfilePage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Exhibitor Profile"
        title={"THE SHOW CONNECTS THE ENTIRE\nUNIT-FITTING SECTORS"}
        description="Discover the exhibitor sectors at Turnkey Show 2027 — from furniture & interiors to complete property solutions."
        image={livingRoom}
        imageAlt="Coastal property interiors"
        primaryBtn={{ label: "Register to visit", href: "/visit/visitor-registration" }}
      />

      {/* Core Sectors — identical to Home page (grayscale default, color on hover) */}
      <section className="sectors-section section-band" id="exhibitor-sectors">
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
    </SiteLayout>
  );
}

