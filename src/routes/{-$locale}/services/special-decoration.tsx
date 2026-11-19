import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";

import lobbyImage from "@/assets/sector7-hospitality-fitout-and-market-services-banner.webp";
import { PageHero, Reveal, SiteLayout } from "@/components/SiteLayout";
import { resolveLocale, useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/{-$locale}/services/special-decoration")({
  component: SpecialDecorationPage,
  head: ({ params }) => {
    const isAr = resolveLocale((params as { locale?: string }).locale) === "ar";
    return {
      meta: [
        {
          title: isAr
            ? "التجهيزات والديكورات الخاصة | الخدمات | معرض العلمين تيرن كي شو ٢٠٢٧"
            : "Special Decoration | Services | Turnkey Show Alamein 2027",
        },
        {
          name: "description",
          content: isAr
            ? "EXPO TECH — المقاول الرسمي لتصميم وتنفيذ أجنحة العرض في معرض العلمين تيرن كي شو ٢٠٢٧."
            : "EXPO TECH — Official Stand Design & Fit-Out Contractor for Turnkey Show 2027. Contact Eng. Yasser Ramadan.",
        },
        {
          property: "og:title",
          content: isAr ? "التجهيزات والديكورات الخاصة | الخدمات" : "Special Decoration | Services",
        },
        { property: "og:type", content: "website" },
      ],
    };
  },
});

function SpecialDecorationPage() {
  const { isAr } = useLocale();

  return (
    <SiteLayout>
      <PageHero
        eyebrow={isAr ? "التجهيزات والديكورات الخاصة" : "Special Decoration"}
        title={isAr ? "المقاول الرسمي المعتمد" : "Official Contractor"}
        image={lobbyImage}
        imageAlt={
          isAr ? "خدمات تصميم وتنفيذ أجنحة العرض" : "Exhibition stand and decoration services"
        }
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
            <span>
              {isAr
                ? "المقاول الرسمي لتصميم وتنفيذ أجنحة العرض"
                : "Official Stand Design & Fit-Out Contractor"}
            </span>
          </div>

          <div className="service-contact-info">
            <div className="service-contact-row">
              <Phone aria-hidden="true" />
              <div>
                <strong>
                  {isAr
                    ? "مسؤول التواصل: م. ياسر رمضان - أ. عمرو محمود"
                    : "Contact: Eng. Yasser Ramadan - Mr. Amr Mahmoud"}
                </strong>
                <span>{isAr ? "المنصب: مدير العمليات" : "Title: Operation Manager"}</span>
              </div>
            </div>
            <div className="service-contact-row">
              <Mail aria-hidden="true" />
              <a href="mailto:yasser@expotech-eg.com" className="ltr-inline">
                yasser@expotech-eg.com
              </a>
            </div>
            <div className="service-contact-row">
              <Phone aria-hidden="true" />
              <div>
                <span>
                  {isAr ? "موبايل: " : "Mobile: "}
                  <span className="ltr-inline">002 0111 166 2345</span>
                </span>
                <span>
                  {isAr ? "هاتف: " : "Phone: "}
                  <span className="ltr-inline">00202 23 868 555 – 23 868 999</span>
                </span>
              </div>
            </div>
            <div className="service-contact-row">
              <MapPin aria-hidden="true" />
              <span>
                {isAr
                  ? "العنوان: ٦٠ شارع الطيران، مدينة نصر، القاهرة، مصر."
                  : "Address: 60 Al Tayaran St., Nasr City, Cairo, Egypt."}
              </span>
            </div>
          </div>
        </Reveal>
      </section>
    </SiteLayout>
  );
}
