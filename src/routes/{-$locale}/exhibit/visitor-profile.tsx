import { createFileRoute } from "@tanstack/react-router";

import villaShowcase from "@/assets/villa-showcase.webp";
import { PageHero, Reveal, SiteLayout } from "@/components/SiteLayout";
import { resolveLocale, useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/{-$locale}/exhibit/visitor-profile")({
  component: VisitorProfilePage,
  head: ({ params }) => {
    const isAr = resolveLocale((params as { locale?: string }).locale) === "ar";
    return {
      meta: [
        {
          title: isAr
            ? "الفئات المستهدفة من الزوار | للعارضين | معرض العلمين تيرن كي شو ٢٠٢٧"
            : "Visitor Profile | Exhibit | Turnkey Show Alamein 2027",
        },
        {
          name: "description",
          content: isAr
            ? "جمهور أعمال يمتلك مشروعات حقيقية واحتياجات فعلية وقدرة شرائية واعدة. تعرّف على الفئات المستهدفة من زوار معرض تيرن كي."
            : "A business audience with real projects, real needs & real purchasing potential. Discover who visits Turnkey Show.",
        },
        {
          property: "og:title",
          content: isAr ? "الفئات المستهدفة من الزوار | للعارضين" : "Visitor Profile | Exhibit",
        },
        { property: "og:type", content: "website" },
      ],
    };
  },
});

const AUDIENCE_BY_LOCALE = {
  en: [
    "Property Owners",
    "Investors",
    "Developers",
    "Hospitality Operators",
    "Architects & Interior Designers",
    "Contractors & Procurement Teams",
    "Corporate & Commercial Buyers",
  ],
  ar: [
    "ملاك الوحدات",
    "المستثمرون",
    "المطورون العقاريون",
    "مشغلو المنشآت الفندقية والضيافة",
    "المهندسون المعماريون ومصممو الديكور الداخلي",
    "المقاولون وفرق المشتريات",
    "ممثلو الشركات والمشترون التجاريون",
  ],
} as const;

function VisitorProfilePage() {
  const { locale, isAr } = useLocale();
  const audienceCategories = AUDIENCE_BY_LOCALE[locale];

  return (
    <SiteLayout>
      <PageHero
        eyebrow={isAr ? "الفئات المستهدفة من الزوار" : "Visitor Profile"}
        title={
          isAr
            ? "جمهور أعمال يمتلك مشروعات حقيقية\nواحتياجات فعلية وقدرة شرائية واعدة"
            : "A BUSINESS AUDIENCE WITH\nREAL PROJECTS, REAL NEEDS & REAL PURCHASING POTENTIAL."
        }
        description={
          isAr
            ? "يجمع معرض تيرن كي العلمين نخبة من الزوار ذوي القيمة التجارية العالية، ممن يشاركون بفاعلية في ملكية الوحدات والاستثمار والتطوير والتأثيث والضيافة وتنفيذ المشروعات في العلمين الجديدة والساحل الشمالي."
            : "Alamein Turnkey Show brings together a high-value audience actively involved in property ownership, investment, development, furnishing, hospitality, and project execution across New Alamein and the North Coast."
        }
        image={villaShowcase}
        imageAlt={isAr ? "جمهور زوار معرض الوحدات الساحلية" : "Coastal property audience"}
      />

      <section className="page-width visitor-profile-page" id="audience-categories">
        <Reveal>
          <h2>{isAr ? "فئات الزوار المستهدفة" : "Audience Categories"}</h2>
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
            {isAr
              ? "جمهور أعمال يمتلك مشروعات حقيقية واحتياجات فعلية وقدرة شرائية واعدة."
              : "A BUSINESS AUDIENCE WITH REAL PROJECTS, REAL NEEDS & REAL PURCHASING POTENTIAL."}
          </p>
        </Reveal>
      </section>
    </SiteLayout>
  );
}
