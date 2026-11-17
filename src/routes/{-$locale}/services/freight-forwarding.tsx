import { createFileRoute } from "@tanstack/react-router";
import { Clock } from "lucide-react";

import lobbyImage from "@/assets/lobby-ocean.webp";
import { PageHero, Reveal, SiteLayout } from "@/components/SiteLayout";
import { resolveLocale, useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/{-$locale}/services/freight-forwarding")({
  component: FreightForwardingPage,
  head: ({ params }) => {
    const isAr = resolveLocale((params as { locale?: string }).locale) === "ar";
    return {
      meta: [
        {
          title: isAr
            ? "الشحن والتخليص الجمركي | الخدمات | معرض العلمين تيرن كي شو ٢٠٢٧"
            : "Freight Forwarding | Services | Turnkey Show Alamein 2027",
        },
        {
          name: "description",
          content: isAr
            ? "بيانات الشريك الرسمي لخدمات الشحن والتخليص الجمركي لمعرض العلمين تيرن كي شو ٢٠٢٧ — قريباً."
            : "Official freight forwarding and customs clearance partner details for Turnkey Show 2027 — coming soon.",
        },
        {
          property: "og:title",
          content: isAr ? "الشحن والتخليص الجمركي | الخدمات" : "Freight Forwarding | Services",
        },
        { property: "og:type", content: "website" },
      ],
    };
  },
});

function FreightForwardingPage() {
  const { isAr } = useLocale();

  return (
    <SiteLayout>
      <PageHero
        eyebrow={isAr ? "الشحن والتخليص الجمركي" : "Freight Forwarding"}
        title={isAr ? "خدمات الشحن\nوالتخليص الجمركي" : "FREIGHT FORWARDING\n& CUSTOMS CLEARANCE"}
        image={lobbyImage}
        imageAlt={isAr ? "خدمات الشحن واللوجستيات" : "Freight and logistics services"}
      />
      <section className="services-grid-section page-width" id="freight-info">
        <Reveal className="service-card service-card-pending">
          <div className="service-coming-soon">
            <Clock aria-hidden="true" />
            <span>{isAr ? "قريباً" : "Coming SOON"}</span>
          </div>
          <p>
            {isAr
              ? "سيتم الإعلان قريباً عن الشريك الرسمي المعتمد لخدمات الشحن والتخليص الجمركي، مع تزويد العارضين بالإرشادات الكاملة لنقل المعروضات ومناولتها حتى الجناح."
              : "Details of the appointed official freight forwarding and customs clearance partner will be announced shortly. Exhibitors will receive full door-to-stand handling guidelines."}
          </p>
        </Reveal>
      </section>
    </SiteLayout>
  );
}
