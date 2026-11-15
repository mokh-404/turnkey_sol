import { createFileRoute } from "@tanstack/react-router";
import { Clock } from "lucide-react";

import lobbyImage from "@/assets/lobby-ocean.webp";
import { PageHero, Reveal, SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/services/travel")({
  component: TravelPage,
  head: () => ({
    meta: [
      { title: "Travel | Services | Turnkey Show Alamein 2027" },
      {
        name: "description",
        content:
          "Travel and accommodation arrangements for Turnkey Show 2027 exhibitors — coming soon.",
      },
      { property: "og:title", content: "Travel | Services" },
      { property: "og:type", content: "website" },
    ],
  }),
});

const COMING_SOON = "Coming SOON";

function TravelPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Travel"
        pageName="Travel & Accommodation"
        title={"TRAVEL &\nACCOMMODATION"}
        description="Special hotel rates, shuttle transfers, and VIP travel arrangements for Turnkey Show 2027 — coming soon."
        image={lobbyImage}
        imageAlt="Travel and accommodation services"
        primaryBtn={{ label: "Contact us", href: "/contact" }}
        secondaryBtn={{ label: "Special decoration", href: "/services/special-decoration" }}
      />
      <section className="services-grid-section page-width" id="travel-info">
        <Reveal className="service-card service-card-pending">
          <div className="service-coming-soon">
            <Clock aria-hidden="true" />
            <span>{COMING_SOON}</span>
          </div>
          <p>
            Special hotel rates, shuttle transfers between Cairo / Alexandria and New Alamein, and VIP travel
            arrangements will be available through our appointed travel agency.
          </p>
        </Reveal>
      </section>
    </SiteLayout>
  );
}

