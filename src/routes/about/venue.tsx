import { createFileRoute } from "@tanstack/react-router";

import venueImage from "@/assets/venue.webp";
import { PageHero, Reveal, SiteLayout } from "@/components/SiteLayout";
import { EVENT_CONFIG } from "@/config/event";
import { Building2, Monitor, Users, Shield } from "lucide-react";

export const Route = createFileRoute("/about/venue")({
  component: VenuePage,
  head: () => ({
    meta: [
      { title: "Venue | About | Turnkey Show Alamein 2027" },
      {
        name: "description",
        content:
          "Turnkey Show is hosted at the New Alamein International Convention and Exhibition Center — a purpose-built venue for high-level international events.",
      },
      { property: "og:title", content: "Venue | About" },
      { property: "og:type", content: "website" },
    ],
  }),
});

const featureBlocks = [
  { icon: Building2, title: "MODERN FACILITIES", desc: "Conference halls & fully equipped meeting rooms." },
  { icon: Monitor, title: "ADVANCED TECHNOLOGY", desc: "Audiovisual & interpretation systems." },
  { icon: Users, title: "INTEGRATED SERVICES", desc: "Registration, accreditation, information, business & media facilities." },
  { icon: Shield, title: "PROFESSIONAL EXPERIENCE", desc: "A secure, efficient and comfortable environment supported by professional staff and integrated technical services." },
];

function VenuePage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="The Venue"
        title={"New Alamein International Convention\nand Exhibition Center"}
        description={`${EVENT_CONFIG.dates} · ${EVENT_CONFIG.venue}`}
        image={venueImage}
        imageAlt="Al Alamein International Conference & Exhibition Center"
        primaryBtn={{ label: "Register to Visit", href: "/visit/visitor-registration" }}
        secondaryBtn={{ label: "Plan Your Route", href: "#venue-info" }}
      />

      {/* Venue description */}
      <section className="page-width editorial-section-grid" id="venue-info">
        <Reveal className="editorial-copy">
          <p className="eyebrow">Venue Overview</p>
          <div className="section-red-bar" aria-hidden="true" />
          <p>
            The Show will be hosted at the New Alamein International Convention and Exhibition Center — a purpose-built
            venue equipped to support high-level international events. The facility offers modern conference halls,
            fully equipped meeting rooms, and advanced audiovisual and interpretation systems to accommodate plenary
            sessions and parallel meetings.
          </p>
          <p>
            On-site services include registration and accreditation areas, information desks, business and media
            facilities, and dedicated spaces for bilateral engagements. The venue is designed to ensure a secure,
            efficient, and comfortable environment, supported by professional staff and integrated technical services.
          </p>
          <a
            className="text-link"
            href="https://www.google.com/maps/search/?api=1&query=New+Alamein+International+Convention+and+Exhibition+Center"
            target="_blank"
            rel="noreferrer"
          >
            Explore Location on Google Maps →
          </a>
        </Reveal>
        <Reveal className="editorial-media">
          <img
            src={venueImage}
            alt="Al Alamein International Conference and Exhibition Center"
            width={1600}
            height={1024}
            loading="lazy"
          />
        </Reveal>
      </section>

      {/* Feature Blocks [BROCHURE] */}
      <section className="venue-features-section section-band full-width-section" id="venue-features">
        <div className="page-width">
          <div className="venue-features-grid">
            {featureBlocks.map((block) => (
              <Reveal key={block.title} className="venue-feature-card">
                <div className="venue-feature-icon">
                  <block.icon className="w-8 h-8" aria-hidden="true" />
                </div>
                <h3>{block.title}</h3>
                <p>{block.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

