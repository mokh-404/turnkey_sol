import { createFileRoute } from "@tanstack/react-router";

import chalet from "@/assets/chalet.webp";
import { PageHero, Reveal, SiteLayout } from "@/components/SiteLayout";
import { EVENT_TEXT } from "@/config/event";
import { resolveLocale, useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/{-$locale}/visit/why-visit")({
  component: WhyVisitPage,
  head: ({ params }) => {
    const isAr = resolveLocale((params as { locale?: string }).locale) === "ar";
    return {
      meta: [
        {
          title: isAr
            ? "لماذا تزور المعرض | للزوار | معرض العلمين تيرن كي شو ٢٠٢٧"
            : "Why Visit | Visit | Turnkey Show Alamein 2027",
        },
        {
          name: "description",
          content: isAr
            ? "خطّط لزيارتك إلى معرض العلمين تيرن كي شو ٢٠٢٧ — وجهة واحدة لحلول التجهيز والفرش المتكامل للوحدات الساحلية."
            : "Plan your visit to Turnkey Show 2027. One destination for the complete coastal property fit-out.",
        },
        {
          property: "og:title",
          content: isAr ? "لماذا تزور المعرض | للزوار" : "Why Visit | Visit",
        },
        { property: "og:type", content: "website" },
      ],
    };
  },
});

function WhyVisitPage() {
  const { locale, isAr } = useLocale();
  const comingSoon = EVENT_TEXT[locale].contentComingSoon;

    return (
      <SiteLayout>
        <PageHero
          eyebrow={isAr ? "لماذا تزور المعرض" : "Why Visit"}
          title={isAr ? "لماذا تزور\nمعرض العلمين تيرن كي شو ٢٠٢٧" : "WHY VISIT\nTURNKEY SHOW 2027"}
          description={
            isAr
              ? "خطّط لزيارتك إلى معرض تيرن كي في مركز العلمين الدولي للمؤتمرات والمعارض."
              : "Plan your visit to Turnkey Show at Al Alamein International Conference & Exhibition Center."
          }
          image={chalet}
          imageAlt={isAr ? "مساحة معيشة ساحلية متكاملة" : "Coastal living space"}
          primaryBtn={{
            label: isAr ? "سجّل زيارتك" : "Register to visit",
            href: "/visit/visitor-registration",
          }}
          secondaryBtn={{
            label: isAr ? "قطاعات العارضين" : "Exhibitor profile",
            href: "/visit/exhibitor-profile",
          }}
        />
        <section className="page-width" id="why-visit-content">
          <Reveal>
            <p className="coming-soon-text">{comingSoon}</p>
          </Reveal>
        </section>
      </SiteLayout>
    );
  }
