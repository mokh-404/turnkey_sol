import { createFileRoute } from "@tanstack/react-router";

import venueImage from "@/assets/venue.webp";
import { PageHero, Reveal, SiteLayout } from "@/components/SiteLayout";
import { EVENT_CONFIG } from "@/config/event";
import type { ReactNode, SVGProps } from "react";

export const Route = createFileRoute("/about/venue")({
  component: VenuePage,
  head: () => ({
    meta: [
      { title: "Venue | About | Turnkey Show Alamein 2027" },
      {
        name: "description",
        content:
          "Turnkey Show is hosted at the New Alamein International Convention & Exhibition Center — a purpose-built venue for high-level international events.",
      },
      { property: "og:title", content: "Venue | About" },
      { property: "og:type", content: "website" },
    ],
  }),
});

/**
 * Venue feature icons traced 1:1 from the vector artwork on page 15 of the
 * Turnkey Show 2027 brochure. Paths keep the brochure's PDF coordinates
 * (y-up), flipped with scale(1,-1); each viewBox is a 50×50 window centred on
 * its icon so the four icons keep the same relative scale as in the brochure.
 */
function BrochureIcon({ viewBox, children, ...props }: SVGProps<SVGSVGElement> & { children: ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.835}
      strokeMiterlimit={11.339}
      aria-hidden="true"
      {...props}
    >
      <g transform="scale(1 -1)">{children}</g>
    </svg>
  );
}

function ModernFacilitiesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BrochureIcon viewBox="30.11 -266.687 50 50" {...props}>
      <circle cx={48.744} cy={236.757} r={4.246} />
      <circle cx={61.482} cy={236.757} r={4.246} />
      <circle cx={55.113} cy={257.231} r={4.246} />
      <path
        transform="translate(48.7442 242.543)"
        d="M0 0V6.369C0 12.738 12.738 12.738 12.738 6.369V0M6.369 -20.646V-14.277C6.369 -7.909 19.106 -7.909 19.106 -14.277V-20.646M-6.369 -20.646V-14.277C-6.369 -7.909 6.369 -7.909 6.369 -14.277V-20.646"
      />
    </BrochureIcon>
  );
}

function AdvancedTechnologyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BrochureIcon viewBox="30.74 -215.99 50 50" {...props}>
      <rect x={41.016} y={185.635} width={29.453} height={18.743} />
      <path d="M49.0485 177.602H62.4365M55.7424 185.635V177.602" />
    </BrochureIcon>
  );
}

function IntegratedServicesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BrochureIcon viewBox="30.742 -166.456 50 50" {...props}>
      <path
        transform="translate(46.528 156.182)"
        d="M0 0H18.429C19.994 0 21.263 -1.269 21.263 -2.835V-26.618C21.263 -28.184 19.994 -29.453 18.429 -29.453H0C-1.566 -29.453 -2.835 -28.184 -2.835 -26.618V-2.835C-2.835 -1.269 -1.566 0 0 0Z"
      />
      <circle cx={55.742} cy={145.472} r={4.016} />
      <path transform="translate(49.0485 132.084)" d="M0 0C4.463 7.14 8.925 7.14 13.388 0" />
    </BrochureIcon>
  );
}

function ProfessionalExperienceIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BrochureIcon viewBox="29.404 -108.888 50 50" {...props}>
      <path
        transform="translate(54.4036 105.308)"
        d="M0 0L16.065 -5.355V-18.743C16.065 -29.453 8.033 -37.486 0 -42.841C-8.033 -37.486 -16.065 -29.453 -16.065 -18.743V-5.355Z"
      />
      <path transform="translate(46.3709 86.5654)" d="M0 0L5.355 -5.355L16.065 8.033" />
    </BrochureIcon>
  );
}

const featureBlocks = [
  { icon: ModernFacilitiesIcon, title: "MODERN FACILITIES", desc: "Conference halls & fully equipped meeting rooms." },
  { icon: AdvancedTechnologyIcon, title: "ADVANCED TECHNOLOGY", desc: "Audiovisual & interpretation systems." },
  { icon: IntegratedServicesIcon, title: "INTEGRATED SERVICES", desc: "Registration, accreditation, information, business & media facilities." },
  { icon: ProfessionalExperienceIcon, title: "PROFESSIONAL EXPERIENCE", desc: "A secure, efficient and comfortable environment Powered By professional staff and integrated technical services." },
];

function VenuePage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="The Venue"
        title={"New Alamein International Convention\nand Exhibition Center"}
        image={venueImage}
        imageAlt="Al Alamein International Conference & Exhibition Center"
      />

      {/* Venue description */}
      <section className="page-width editorial-section-grid" id="venue-info" style={{ paddingTop: "0.5rem" }}>
        <Reveal className="editorial-copy">
          <p>
            The Show will be hosted at the New Alamein International Convention & Exhibition Center — a purpose-built
            venue equipped to support high-level international events. The facility offers modern conference halls,
            fully equipped meeting rooms, and advanced audiovisual and interpretation systems to accommodate plenary
            sessions and parallel meetings.
          </p>
          <p>
            On-site services include registration and accreditation areas, information desks, business and media
            facilities, and dedicated spaces for bilateral engagements. The venue is designed to ensure a secure,
            efficient, and comfortable environment, Powered By professional staff and integrated technical services.
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
            decoding="async"
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
                  <block.icon className="venue-feature-svg" />
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

