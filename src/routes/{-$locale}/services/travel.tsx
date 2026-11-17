import { createFileRoute } from "@tanstack/react-router";
import { Clock } from "lucide-react";

import lobbyImage from "@/assets/lobby-ocean.webp";
import { PageHero, Reveal, SiteLayout } from "@/components/SiteLayout";
import { resolveLocale, useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/{-$locale}/services/travel")({
  component: TravelPage,
  head: ({ params }) => {
    const isAr = resolveLocale((params as { locale?: string }).locale) === "ar";
    return {
      meta: [
        {
          title: isAr
            ? "السفر والإقامة | الخدمات | معرض العلمين تيرن كي شو ٢٠٢٧"
            : "Travel | Services | Turnkey Show Alamein 2027",
        },
        {
          name: "description",
          content: isAr
            ? "ترتيبات السفر والإقامة الفندقية للعارضين والزوار في معرض العلمين تيرن كي شو ٢٠٢٧ — قريباً."
            : "Travel and accommodation arrangements for Turnkey Show 2027 exhibitors — coming soon.",
        },
        {
          property: "og:title",
          content: isAr ? "السفر والإقامة | الخدمات" : "Travel | Services",
        },
        { property: "og:type", content: "website" },
      ],
    };
  },
});

function TravelPage() {
  const { isAr } = useLocale();

  return (
    <SiteLayout>
      <PageHero
        eyebrow={isAr ? "السفر" : "Travel"}
        pageName={isAr ? "السفر والإقامة" : "Travel & Accommodation"}
        title={isAr ? "السفر\nوالإقامة الفندقية" : "TRAVEL &\nACCOMMODATION"}
        image={lobbyImage}
        imageAlt={isAr ? "خدمات السفر والإقامة" : "Travel and accommodation services"}
      />
      <section className="services-grid-section page-width" id="travel-info">
        <Reveal className="service-card service-card-pending">
          <div className="service-coming-soon">
            <Clock aria-hidden="true" />
            <span>{isAr ? "قريباً" : "Coming SOON"}</span>
          </div>
          <p>
            {isAr
              ? "ستتوفر قريباً عبر وكالة السفر المعتمدة أسعار خاصة للإقامة الفندقية، وخدمات الانتقال بين القاهرة والإسكندرية ومدينة العلمين الجديدة، إلى جانب ترتيبات السفر لكبار الشخصيات."
              : "Special hotel rates, shuttle transfers between Cairo / Alexandria and New Alamein, and VIP travel arrangements will be available through our appointed travel agency."}
          </p>
        </Reveal>
      </section>
    </SiteLayout>
  );
}
