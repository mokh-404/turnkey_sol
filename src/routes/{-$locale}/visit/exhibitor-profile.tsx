import { createFileRoute } from "@tanstack/react-router";

import livingRoom from "@/assets/living-room.webp";
import terraceSunset from "@/assets/terrace-sunset.webp";
import smartLiving from "@/assets/smart-living.webp";
import smartHome from "@/assets/smart-home.webp";
import smokedOakApplianceWall from "@/assets/smoked-oak-appliance-wall.webp";
import warmKitchen from "@/assets/warm-kitchen.webp";
import villaShowcase from "@/assets/villa-showcase.webp";
import lobbyOcean from "@/assets/lobby-ocean.webp";
import { PageHero, Reveal, SiteLayout } from "@/components/SiteLayout";
import { LocaleLink, resolveLocale, useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/{-$locale}/visit/exhibitor-profile")({
  component: ExhibitorProfilePage,
  head: ({ params }) => {
    const isAr = resolveLocale((params as { locale?: string }).locale) === "ar";
    return {
      meta: [
        {
          title: isAr
            ? "قطاعات العارضين | للزوار | معرض العلمين تيرن كي شو ٢٠٢٧"
            : "Exhibitor Profile | Visit | Turnkey Show Alamein 2027",
        },
        {
          name: "description",
          content: isAr
            ? "تعرّف على قطاعات العارضين في معرض العلمين تيرن كي شو ٢٠٢٧ — من الأثاث والتصميم الداخلي إلى الحلول العقارية المتكاملة."
            : "Discover the exhibitor sectors at Turnkey Show 2027 — from furniture & interiors to complete property solutions.",
        },
        {
          property: "og:title",
          content: isAr ? "قطاعات العارضين | للزوار" : "Exhibitor Profile | Visit",
        },
        { property: "og:type", content: "website" },
      ],
    };
  },
});

const SECTORS_BY_LOCALE = {
  en: [
    {
      title: "Furniture & Interiors",
      image: livingRoom,
      detail: "Furnishing solutions for new handovers and existing coastal properties.",
    },
    {
      title: "Kitchens & Equipment",
      image: warmKitchen,
      detail: "Custom kitchen cabinetry, built-in appliances, fixtures and premium kitchen fit-outs.",
    },
    {
      title: "Home Appliances",
      image: smokedOakApplianceWall,
      detail: "Essential, built-in and lifestyle appliances for ready-to-operate units.",
    },
    {
      title: "Outdoor Living",
      image: terraceSunset,
      detail: "Outdoor furniture and solutions designed for the Mediterranean coastal lifestyle.",
    },
    {
      title: "Smart Unit Automation",
      image: smartHome,
      detail: "Smart home automation, climate control, energy efficiency and connected living.",
    },
    {
      title: "Modern Lighting Technology",
      image: smartLiving,
      detail: "Architectural lighting, ambient systems, modern illumination and decorative fixtures.",
    },
    {
      title: "Hospitality Fit-Out",
      image: lobbyOcean,
      detail: "High-spec commercial solutions for hotels, serviced apartments and rental properties.",
    },
    {
      title: "Complete Solutions",
      image: villaShowcase,
      detail: "Integrated turnkey solutions taking properties from handover to investment-ready.",
    },
  ],
  ar: [
    {
      title: "الأثاث والتصميم الداخلي",
      image: livingRoom,
      detail: "حلول تأثيث متكاملة للوحدات الجديدة والوحدات القائمة.",
    },
    {
      title: "المطابخ وتجهيزاتها",
      image: warmKitchen,
      detail: "خزائن مطابخ مخصصة، وأجهزة مدمجة، وتجهيزات متكاملة للمطابخ العصرية.",
    },
    {
      title: "الأجهزة المنزلية",
      image: smokedOakApplianceWall,
      detail: "أجهزة منزلية أساسية ومدمجة وعصرية، لتجهيز الوحدات وجعلها جاهزة للاستخدام.",
    },
    {
      title: "المساحات الخارجية",
      image: terraceSunset,
      detail: "أثاث وحلول للمساحات الخارجية مصممة لتناسب أسلوب الحياة الساحلي.",
    },
    {
      title: "المنازل الذكية",
      image: smartHome,
      detail: "تقنيات ذكية لتعزيز الراحة والأمان وكفاءة استهلاك الطاقة وتوفير تجربة معيشية متصلة.",
    },
    {
      title: "تقنيات الإضاءة الحديثة",
      image: smartLiving,
      detail: "حلول الإضاءة المعمارية والأنظمة المحيطية ووحدات الإضاءة الديكورية الحديثة.",
    },
    {
      title: "تجهيزات الضيافة",
      image: lobbyOcean,
      detail: "حلول متخصصة لتجهيز الفنادق والشقق الفندقية والوحدات المخصصة للتأجير.",
    },
    {
      title: "الحلول المتكاملة",
      image: villaShowcase,
      detail: "حلول شاملة تنقل العقار من مرحلة التسليم إلى الجاهزية الكاملة للاستثمار.",
    },
  ],
} as const;

function ExhibitorProfilePage() {
  const { locale, isAr } = useLocale();
  const sectors = SECTORS_BY_LOCALE[locale];

  return (
    <SiteLayout>
      <PageHero
        eyebrow={isAr ? "قطاعات العارضين" : "Exhibitor Profile"}
        title={
          isAr
            ? "يجمع المعرض كافة القطاعات\nالمعنية بمجال التركيبات والتجهيزات"
            : "THE SHOW CONNECTS THE ENTIRE\nUNIT-FITTING SECTORS"
        }
        description={
          isAr
            ? "تعرّف على قطاعات العارضين في معرض العلمين تيرن كي شو ٢٠٢٧ — من الأثاث والتصميم الداخلي إلى الحلول العقارية المتكاملة."
            : "Discover the exhibitor sectors at Turnkey Show 2027 — from furniture & interiors to complete property solutions."
        }
        image={livingRoom}
        imageAlt={isAr ? "تصميمات داخلية لوحدات ساحلية" : "Coastal property interiors"}
        primaryBtn={{
          label: isAr ? "سجّل زيارتك" : "Register to visit",
          href: "/visit/visitor-registration",
        }}
      />

      {/* Core Sectors */}
      <section className="sectors-section section-band" id="exhibitor-sectors">
        <div className="page-width">
          <Reveal className="section-heading">
            <div>
              <p className="eyebrow">{isAr ? "القطاعات الرئيسية" : "Core Sectors"}</p>
              <div className="section-red-bar" aria-hidden="true" />
              <h2>
                {isAr ? (
                  <>
                    جميع الاحتياجات تحت <span className="headline-accent">سقف واحد</span>
                  </>
                ) : (
                  <>
                    All Needs Under One <span className="headline-accent">Roof</span>
                  </>
                )}
              </h2>
              <p>
                {isAr
                  ? "يجمع المعرض جميع القطاعات اللازمة لتحويل العقار إلى مساحة متكاملة التأثيث والتشطيب وجاهزة للاستخدام."
                  : "Complete fitting-out sectors required to transform a property into a fully furnished, finished space."}
              </p>
            </div>
          </Reveal>
          <div className="sector-grid">
            {sectors.map((sector) => (
              <Reveal key={sector.title}>
                <LocaleLink to="/exhibit/why-exhibit" className="sector-card" aria-label={sector.title}>
                  <img src={sector.image} alt={sector.title} width={1600} height={1024} decoding="async" />
                  <div className="sector-card-copy">
                    <h3>{sector.title}</h3>
                    <p>{sector.detail}</p>
                  </div>
                </LocaleLink>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
