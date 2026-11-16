import { createFileRoute } from "@tanstack/react-router";

import livingRoom from "@/assets/living-room.webp";
import terraceSunset from "@/assets/terrace-sunset.webp";
import smartLiving from "@/assets/smart-living.webp";
import smartHome from "@/assets/smart-home.webp";
import kitchen from "@/assets/kitchen.webp";
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

const exhibitorSectors = [
  {
    title: "FURNITURE & INTERIORS",
    desc: "Furnishing solutions for new handovers and existing properties.",
    image: livingRoom,
  },
  {
    title: "KITCHENS & EQUIPMENT",
    desc: "Custom kitchen cabinetry, built-in appliances and fixtures.",
    image: warmKitchen,
  },
  {
    title: "HOME APPLIANCES",
    desc: "Essential, built-in and lifestyle appliances for ready-to-operate units.",
    image: kitchen,
  },
  {
    title: "OUTDOOR LIVING",
    desc: "Outdoor furniture and solutions designed for the coastal lifestyle.",
    image: terraceSunset,
  },
  {
    title: "SMART UNIT AUTOMATION",
    desc: "Technology for comfort, security, energy efficiency and connected living.",
    image: smartHome,
  },
  {
    title: "MODERN LIGHTING TECHNOLOGY",
    desc: "Architectural lighting, ambient systems and illumination solutions.",
    image: smartLiving,
  },
  {
    title: "HOSPITALITY FIT-OUT",
    desc: "Solutions for hotels, serviced apartments and rental properties.",
    image: lobbyOcean,
  },
  {
    title: "COMPLETE PROPERTY SOLUTIONS",
    desc: "Integrated solutions that take a property from handover to investment ready.",
    image: villaShowcase,
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
        secondaryBtn={{ label: "Why visit", href: "/visit/why-visit" }}
      />

      {/* Six image cards — grayscale → colour on hover */}
      <section className="exhibitor-profile-section section-band" id="exhibitor-sectors">
        <div className="page-width">
          <div className="exhibitor-profile-grid">
            {exhibitorSectors.map((sector) => (
              <Reveal key={sector.title} className="exhibitor-profile-card">
                <div className="profile-card-image">
                  <img src={sector.image} alt={sector.title} width={800} height={500} decoding="async" />
                </div>
                <div className="profile-card-body" style={{ textAlign: "center" }}>
                  <h3>{sector.title}</h3>
                  <p>{sector.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

