import { createFileRoute } from "@tanstack/react-router";

import villaShowcase from "@/assets/home-hero-and-exhibit-pages-banner-sector8-complete-solutions.webp";
import { AnimatedCounter, PageHero, Reveal, SiteLayout } from "@/components/SiteLayout";
import { resolveLocale, useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/{-$locale}/exhibit/why-exhibit")({
  component: WhyExhibitPage,
  head: ({ params }) => {
    const isAr = resolveLocale((params as { locale?: string }).locale) === "ar";
    return {
      meta: [
        {
          title: isAr
            ? "لماذا تشارك كعارض | للعارضين | معرض العلمين تيرن كي شو ٢٠٢٧"
            : "Why Exhibit | Exhibit | Turnkey Show Alamein 2027",
        },
        {
          name: "description",
          content: isAr
            ? "ضع علامتك التجارية في قلب موجة الطلب الجديدة بالساحل الشمالي. شارك كعارض في معرض العلمين تيرن كي شو ٢٠٢٧."
            : "Position your brand at the heart of the North Coast's next wave of demand. Exhibit at Turnkey Show 2027.",
        },
        {
          property: "og:title",
          content: isAr ? "لماذا تشارك كعارض | للعارضين" : "Why Exhibit | Exhibit",
        },
        { property: "og:type", content: "website" },
      ],
    };
  },
});

function WhyExhibitPage() {
  const { isAr } = useLocale();

  return (
    <SiteLayout>
      <PageHero
        eyebrow={isAr ? "لماذا تشارك كعارض" : "Why Exhibit"}
        title={
          isAr
            ? "ضع علامتك التجارية في قلب\nموجة الطلب الجديدة بالساحل الشمالي"
            : "POSITION YOUR BRAND AT THE HEART OF\nTHE NORTH COAST'S NEXT WAVE OF DEMAND."
        }
        description={
          isAr
            ? "يأتي معرض تيرن كي العلمين في توقيت محوري لسوق الوحدات السكنية والضيافة والسياحة في العلمين الجديدة والساحل الشمالي."
            : "Alamein Turnkey Show comes at a pivotal moment for the residential, hospitality, and tourism market in New Alamein and the North Coast."
        }
        image={villaShowcase}
        imageAlt={isAr ? "فيلا ساحلية فاخرة مجهزة بالكامل" : "Luxury coastal villa showcase"}
      />

      {/* Highlight Key Stat */}
      <section className="page-width exhibit-key-stat">
        <Reveal
          className="exhibit-stat-card"
          style={{ minHeight: "180px", padding: "2.5rem 3rem", boxSizing: "border-box" }}
        >
          <div
            className="stat-number"
            style={{
              minWidth: "260px",
              width: "260px",
              flexShrink: 0,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            <AnimatedCounter value="15,000+" />
          </div>
          <div className="stat-text">
            <div className="section-red-bar" aria-hidden="true" />
            {isAr ? (
              <>
                <h3>
                  وحدة تدخل مراحل <span className="headline-accent">التشطيب والتأثيث</span>
                </h3>
                <p>
                  ومع خطة تسليم أكثر من ١٥٬٠٠٠ وحدة سكنية وسياحية خلال عام ٢٠٢٧ في العلمين الجديدة
                  والساحل الشمالي، تدخل آلاف الوحدات الجديدة مراحل التشطيب والتأثيث، مما يخلق موجة
                  متنامية من الطلب على الأثاث والتصميمات الداخلية والتكنولوجيا والتشطيبات والحلول
                  المتكاملة.
                </p>
              </>
            ) : (
              <>
                <h3>
                  UNITS ENTERING FINISHING &amp; <span className="headline-accent">FURNISHING</span>{" "}
                  STAGE
                </h3>
                <p>
                  With the 2027 delivery pipeline indicating more than 15,000 residential and
                  tourism units entering delivery across New Alamein and the North Coast, a
                  significant wave of demand is surging for furniture, interiors, technology,
                  finishing, and turnkey solutions.
                </p>
              </>
            )}
          </div>
        </Reveal>
      </section>

      {/* 2-Row Organized Pillars */}
      <section className="page-width turnkey-pillars-section" style={{ paddingTop: "1rem" }}>
        <div className="turnkey-pillars-grid">
          <Reveal className="turnkey-pillar-card">
            <div id="why-exhibit-intro">
              <h2>{isAr ? "شارك حيث يتشكل الطلب" : "WHERE DEMAND IS CREATED"}</h2>
              <div className="section-red-bar" aria-hidden="true" />
              {isAr ? (
                <p>
                  <strong>شارك حيث يتشكل الطلب وتُتخذ قرارات الشراء.</strong> مع دخول آلاف الوحدات
                  السكنية والسياحية الجديدة مراحل التشطيب والتأثيث في ٢٠٢٧، تتصاعد موجة قوية من
                  الطلب على الأثاث والتصميمات الداخلية والتكنولوجيا الذكية والتشطيبات والحلول
                  المتكاملة.
                </p>
              ) : (
                <p>
                  <strong>
                    Exhibit where demand is being created — and purchasing decisions are being made.
                  </strong>{" "}
                  With the 2027 delivery pipeline indicating more than 15,000 residential and
                  tourism units entering the finishing and furnishing stage, a significant new wave
                  of demand is emerging for furniture, interiors, technology, finishing, and turnkey
                  solutions.
                </p>
              )}
            </div>
          </Reveal>

          <Reveal className="turnkey-pillar-card">
            <div id="all-needs">
              <h2>
                {isAr ? (
                  <>
                    جميع الاحتياجات تحت <span className="headline-accent">سقف واحد</span>
                  </>
                ) : (
                  <>
                    ALL NEEDS UNDER ONE <span className="headline-accent">ROOF</span>
                  </>
                )}
              </h2>
              <div className="section-red-bar" aria-hidden="true" />
              {isAr ? (
                <p>
                  <strong>من التكنولوجيا الذكية إلى فخامة التصميمات الداخلية.</strong> يجمع المعرض
                  جميع القطاعات اللازمة لتحويل العقار إلى مساحة متكاملة التأثيث والتشطيب وجاهزة
                  للاستخدام.
                </p>
              ) : (
                <p>
                  <strong>From Smart Technology to Full Solutions.</strong> The show brings together
                  the complete fitting-out sectors required to transform a property into a fully
                  furnished, finished, and ready-to-use space.
                </p>
              )}
            </div>
          </Reveal>

          <Reveal className="turnkey-pillar-card">
            <div id="targeted-audience">
              <h2>
                {isAr ? "قطاعات متخصصة وقاعات مخصصة" : "SPECIALIZED SECTORS & DEDICATED HALLS"}
              </h2>
              <div className="section-red-bar" aria-hidden="true" />
              <p>
                {isAr
                  ? "تُوفر القطاعات المتخصصة والقاعات المخصصة تجربة زيارة سلسة ومتكاملة، وتمنح العارضين فرصة الوصول المباشر إلى جمهور مستهدف ذي صلة."
                  : "Specialized sectors and dedicated halls create a seamless visitor experience while giving exhibitors direct access to a highly relevant target audience."}
              </p>
            </div>
          </Reveal>

          <Reveal className="turnkey-pillar-card">
            <div id="purchase-journey">
              <h2>{isAr ? "رحلة شراء متكاملة" : "ONE COMPLETE PURCHASE JOURNEY"}</h2>
              <div className="section-red-bar" aria-hidden="true" />
              {isAr ? (
                <p>
                  <strong>وجهة واحدة. كل الحلول. رحلة شراء متكاملة.</strong> يغطي المعرض قطاعات
                  الأثاث، والأجهزة المنزلية، والمساحات الخارجية، والمنازل الذكية، وتجهيزات الضيافة،
                  والحلول المتكاملة.
                </p>
              ) : (
                <p>
                  <strong>One destination. Every solution. One complete purchase journey.</strong>{" "}
                  Covering Furniture, Appliances, Outdoor, Smart Home, Hospitality Fit-Out, and
                  Complete Solutions.
                </p>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
