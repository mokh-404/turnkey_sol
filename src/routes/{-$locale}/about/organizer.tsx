import { createFileRoute } from "@tanstack/react-router";

import turquoiseSkyline from "@/assets/turquoise-skyline.webp";
import apexLogo from "@/assets/logos/apex-logo.png";
import { PageHero, Reveal, SiteLayout } from "@/components/SiteLayout";
import { resolveLocale, useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/{-$locale}/about/organizer")({
  component: OrganizerPage,
  head: ({ params }) => {
    const isAr = resolveLocale((params as { locale?: string }).locale) === "ar";
    return {
      meta: [
        {
          title: isAr
            ? "المنظم | عن المعرض | معرض العلمين تيرن كي شو ٢٠٢٧"
            : "Organizer | About | Turnkey Show Alamein 2027",
        },
        {
          name: "description",
          content: isAr
            ? "أبكس للمؤتمرات والمعارض التجارية — خبرة تتجاوز ١٥ عامًا في تنظيم وتطوير المعارض التجارية المتخصصة."
            : "Apex Conventions and Trade Fairs L.L.C — trade-fair organizer with more than 15 years of experience.",
        },
        {
          property: "og:title",
          content: isAr ? "المنظم | عن المعرض" : "Organizer | About",
        },
        { property: "og:type", content: "website" },
      ],
    };
  },
});

function OrganizerPage() {
  const { isAr } = useLocale();

  return (
    <SiteLayout>
      <PageHero
        eyebrow={isAr ? "المنظم" : "Organizer"}
        image={turquoiseSkyline}
        imageAlt={isAr ? "المنظم لمعرض تيرن كي" : "Turnkey Show organizer"}
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
            {isAr ? (
              <>
                <p>
                  شركة متخصصة في تنظيم المعارض والمؤتمرات بخبرة تتجاوز ١٥ عامًا في تطوير وإدارة
                  المعارض التجارية المتخصصة.
                </p>
                <p>يقوم عملنا على مبدأ واضح: نجاح أي معرض تجاري يبدأ من الفهم الدقيق للسوق.</p>
                <p style={{ marginBottom: 0 }}>
                  نحلل طبيعة القطاع وبيئة الأعمال المحيطة به، ونحدد الجمهور المستهدف بدقة، لنبني
                  منصة معرض متكاملة تجمع الشركات الرائدة وصنّاع القرار والمتخصصين تحت سقف واحد.
                </p>
              </>
            ) : (
              <>
                <p>
                  Apex is a trade-fair organizer with more than 15 years of experience in developing
                  and delivering specialized exhibitions.
                </p>
                <p>
                  Our work is built around a simple principle: a successful trade fair starts with
                  understanding the market.
                </p>
                <p style={{ marginBottom: 0 }}>
                  We identify the industry, understand its business environment, define the right
                  audience, and develop an exhibition platform that brings the relevant companies
                  and professionals together.
                </p>
              </>
            )}
          </div>
        </Reveal>
      </section>
    </SiteLayout>
  );
}
