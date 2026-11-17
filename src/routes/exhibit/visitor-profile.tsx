import { createFileRoute } from "@tanstack/react-router";

import villaShowcase from "@/assets/villa-showcase.webp";
import { PageHero, Reveal, SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/exhibit/visitor-profile")({
  component: VisitorProfilePage,
  head: () => ({
    meta: [
      { title: "Visitor Profile | Exhibit | Turnkey Show Alamein 2027" },
      {
        name: "description",
        content:
          "A business audience with real projects, real needs & real purchasing potential. Discover who visits Turnkey Show.",
      },
      { property: "og:title", content: "Visitor Profile | Exhibit" },
      { property: "og:type", content: "website" },
    ],
  }),
});

const audienceCategories = [
  "Property Owners",
  "Investors",
  "Developers",
  "Hospitality Operators",
  "Architects & Interior Designers",
  "Contractors & Procurement Teams",
  "Corporate & Commercial Buyers",
];

function VisitorProfilePage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Visitor Profile"
        title={"A BUSINESS AUDIENCE WITH\nREAL PROJECTS, REAL NEEDS & REAL PURCHASING POTENTIAL."}
        description="Alamein Turnkey Show brings together a high-value audience actively involved in property ownership, investment, development, furnishing, hospitality, and project execution across New Alamein and the North Coast."
        image={villaShowcase}
        imageAlt="Coastal property audience"
      />

      <section className="page-width visitor-profile-page" id="audience-categories">
        <Reveal>
          <h2>Audience Categories</h2>
        </Reveal>
        <div className="audience-list">
          {audienceCategories.map((cat) => (
            <Reveal key={cat} className="audience-item">
              <h3>{cat}</h3>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="profile-closing-statement">
            A BUSINESS AUDIENCE WITH REAL PROJECTS, REAL NEEDS &amp; REAL PURCHASING POTENTIAL.
          </p>
        </Reveal>
      </section>
    </SiteLayout>
  );
}

