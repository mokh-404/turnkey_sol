import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";

import lobbyImage from "@/assets/lobby-ocean.webp";
import { Button } from "@/components/ui/button";
import { PageHero, Reveal, SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/services/special-decoration")({
  component: SpecialDecorationPage,
  head: () => ({
    meta: [
      { title: "Special Decoration | Services | Turnkey Show Alamein 2027" },
      {
        name: "description",
        content:
          "EXPO TECH — Official Stand Design & Fit-Out Contractor for Turnkey Show 2027. Contact Eng. Yasser Ramadan.",
      },
      { property: "og:title", content: "Special Decoration | Services" },
      { property: "og:type", content: "website" },
    ],
  }),
});

function SpecialDecorationPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Special Decoration"
        title={"EXPO TECH\nOFFICIAL STAND DESIGN & FIT-OUT CONTRACTOR"}
        description="Contact EXPO TECH for bespoke stand design, custom shell enhancements, graphic production, audiovisual rentals, and full on-site project execution."
        image={lobbyImage}
        imageAlt="Exhibition stand and decoration services"
        primaryBtn={{ label: "Contact the contractor", href: "#contractor-contact" }}
        secondaryBtn={{ label: "Book your space", href: "/exhibit/book-your-space" }}
      />

      <section className="services-grid-section page-width" id="contractor-contact">
        <Reveal className="service-card service-card-featured">
          <div className="service-contractor-logo">
            <img
              src="/logos/expotech-logo.png"
              alt="EXPO TECH"
              className="expotech-logo"
              width={300}
              height={120}
              loading="eager"
            />
          </div>

          <div className="service-contractor-badge">
            <strong>EXPO TECH</strong>
            <span>Official Stand Design &amp; Fit-Out Contractor</span>
          </div>

          <div className="service-contact-info">
            <div className="service-contact-row">
              <Phone aria-hidden="true" />
              <div>
                <strong>Contact: Eng. Yasser Ramadan - Mr. Amr Mahmoud</strong>
                <span>Title: Operation Manager</span>
              </div>
            </div>
            <div className="service-contact-row">
              <Mail aria-hidden="true" />
              <a href="mailto:yasser@expotech-eg.com">yasser@expotech-eg.com</a>
            </div>
            <div className="service-contact-row">
              <Phone aria-hidden="true" />
              <div>
                <span>Mobile: 002 0111 166 2345</span>
                <span>Phone: 00202 23 868 555 – 23 868 999</span>
              </div>
            </div>
            <div className="service-contact-row">
              <MapPin aria-hidden="true" />
              <span>Address: 60 Al Tayaran St., Nasr City, Cairo, Egypt.</span>
            </div>
          </div>

          <Button asChild size="lg" className="show-button">
            <a href="mailto:yasser@expotech-eg.com">
              CONTACT CONTRACTOR <span className="btn-arrow">&gt;</span>
            </a>
          </Button>
        </Reveal>
      </section>
    </SiteLayout>
  );
}

