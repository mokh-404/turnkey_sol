import { createFileRoute } from "@tanstack/react-router";

import turquoiseSkyline from "@/assets/turquoise-skyline.webp";
import apexLogo from "@/assets/logos/apex-logo.png";
import { PageHero, Reveal, SiteLayout } from "@/components/SiteLayout";
import { EVENT_CONFIG } from "@/config/event";

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
        title={"BUILT ON A DEEP UNDERSTANDING\nOF MARKETS."}
        description="Apex Conventions and Trade Fairs L.L.C — trade-fair organizer with more than 15 years of experience."
        image={turquoiseSkyline}
        imageAlt="Turnkey Show organizer"
        primaryBtn={{ label: "Contact Us", href: "/contact" }}
        secondaryBtn={{ label: "Book Your Space", href: "/exhibit/book-your-space" }}
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
            <p>
              We identify the industry, understand its business environment, define the right audience, and develop an
              exhibition platform that brings the relevant companies and professionals together.
            </p>
            <div className="organizer-contact-block">
              <p>
                <strong>Phone:</strong>{" "}
                <a href={`tel:${EVENT_CONFIG.organizer.phone.replace(/\s/g, "")}`}>{EVENT_CONFIG.organizer.phone}</a>
              </p>
              <p>
                <strong>Mobile:</strong> {EVENT_CONFIG.organizer.mobile}
              </p>
              <p>
                <strong>E-mail:</strong>{" "}
                <a href={`mailto:${EVENT_CONFIG.organizer.email}`}>{EVENT_CONFIG.organizer.email}</a>
              </p>
            </div>
          </div>
        </Reveal>
      </section>
    </SiteLayout>
  );
}

