import { createFileRoute } from "@tanstack/react-router";
import { Clock } from "lucide-react";

import lobbyImage from "@/assets/lobby-ocean.webp";
import { PageHero, Reveal, SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/services/freight-forwarding")({
  component: FreightForwardingPage,
  head: () => ({
    meta: [
      { title: "Freight Forwarding | Services | Turnkey Show Alamein 2027" },
      {
        name: "description",
        content:
          "Official freight forwarding and customs clearance partner details for Turnkey Show 2027 — coming soon.",
      },
      { property: "og:title", content: "Freight Forwarding | Services" },
      { property: "og:type", content: "website" },
    ],
  }),
});

const COMING_SOON = "Coming SOON";

function FreightForwardingPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Freight Forwarding"
        title={"FREIGHT FORWARDING\n& CUSTOMS CLEARANCE"}
        image={lobbyImage}
        imageAlt="Freight and logistics services"
      />
      <section className="services-grid-section page-width" id="freight-info">
        <Reveal className="service-card service-card-pending">
          <div className="service-coming-soon">
            <Clock aria-hidden="true" />
            <span>{COMING_SOON}</span>
          </div>
          <p>
            Details of the appointed official freight forwarding and customs clearance partner will be announced
            shortly. Exhibitors will receive full door-to-stand handling guidelines.
          </p>
        </Reveal>
      </section>
    </SiteLayout>
  );
}

