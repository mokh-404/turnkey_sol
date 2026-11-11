import { createFileRoute } from "@tanstack/react-router";

import chalet from "@/assets/chalet.webp";
import { PageHero, Reveal, SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/visit/why-visit")({
  component: WhyVisitPage,
  head: () => ({
    meta: [
      { title: "Why Visit | Visit | Turnkey Show Alamein 2027" },
      {
        name: "description",
        content: "Plan your visit to Turnkey Show 2027. One destination for the complete coastal property fit-out.",
      },
      { property: "og:title", content: "Why Visit | Visit" },
      { property: "og:type", content: "website" },
    ],
  }),
});

// Content coming soon — single constant so it can be replaced later
const COMING_SOON_COPY = "Content coming soon.";

function WhyVisitPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Why Visit"
        title={"WHY VISIT\nTURNKEY SHOW 2027"}
        description="Plan your visit to Turnkey Show at Al Alamein International Conference & Exhibition Center."
        image={chalet}
        imageAlt="Coastal living space"
        primaryBtn={{ label: "Register to visit", href: "/visit/visitor-registration" }}
        secondaryBtn={{ label: "Exhibitor profile", href: "/visit/exhibitor-profile" }}
      />
      <section className="page-width" id="why-visit-content">
        <Reveal>
          <p className="coming-soon-text">{COMING_SOON_COPY}</p>
        </Reveal>
      </section>
    </SiteLayout>
  );
}

