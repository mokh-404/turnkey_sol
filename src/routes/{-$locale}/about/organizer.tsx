import { createFileRoute } from "@tanstack/react-router";

import turquoiseSkyline from "@/assets/turquoise-skyline.webp";
import apexLogo from "@/assets/logos/apex-logo.png";
import { PageHero, Reveal, SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/about/organizer")({
  component: OrganizerPage,
  head: () => ({
    meta: [
      { title: "Organizer | About | Turnkey Show Alamein 2027" },
      {
        name: "description",
        content:
          "Apex Conventions and Trade Fairs L.L.C — trade-fair organizer with more than 15 years of experience.",
      },
      { property: "og:title", content: "Organizer | About" },
      { property: "og:type", content: "website" },
    ],
  }),
});

function OrganizerPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Organizer"
        image={turquoiseSkyline}
        imageAlt="Turnkey Show organizer"
      />

      <section className="page-width organizer-page-section" id="organizer-profile">
        <Reveal className="organizer-page-inner">
          <div className="organizer-logo-wrap">
            <img
              src={apexLogo}
              alt="Apex Conventions and Trade Fairs"
              className="organizer-apex-logo"
              width={280}
              height={90}
              loading="eager"
            />
          </div>
          <div className="organizer-page-copy">
            <h2>Apex Conventions and Trade Fairs L.L.C</h2>
            <p>Apex is a trade-fair organizer with more than 15 years of experience in developing and delivering specialized exhibitions.</p>
            <p>Our work is built around a simple principle: a successful trade fair starts with understanding the market.</p>
            <p style={{ marginBottom: 0 }}>
              We identify the industry, understand its business environment, define the right audience, and develop an
              exhibition platform that brings the relevant companies and professionals together.
            </p>
          </div>
        </Reveal>
      </section>
    </SiteLayout>
  );
}

