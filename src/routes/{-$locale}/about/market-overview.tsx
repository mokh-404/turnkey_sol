import { createFileRoute } from "@tanstack/react-router";

import lobbyOcean from "@/assets/lobby-ocean.webp";
import { AnimatedCounter, PageHero, Reveal, SiteLayout } from "@/components/SiteLayout";
import { resolveLocale, useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/{-$locale}/about/market-overview")({
  component: MarketOverviewPage,
  head: ({ params }) => {
    const isAr = resolveLocale((params as { locale?: string }).locale) === "ar";
    return {
      meta: [
        {
          title: isAr
            ? "نظرة على السوق | عن المعرض | معرض العلمين تيرن كي شو ٢٠٢٧"
            : "Market Overview | About | Turnkey Show Alamein 2027",
        },
        {
          name: "description",
          content: isAr
            ? "يشهد الساحل الشمالي ومدينة العلمين الجديدة مرحلة جديدة من النمو. تعرّف على حجم السوق ومؤشراته الرئيسية."
            : "The North Coast and New Alamein are experiencing a new phase of growth. Discover the market at a glance.",
        },
        {
          property: "og:title",
          content: isAr ? "نظرة على السوق | عن المعرض" : "Market Overview | About",
        },
        { property: "og:type", content: "website" },
      ],
    };
  },
});

function MarketOverviewPage() {
  const { isAr } = useLocale();

  return (
    <SiteLayout>
      <PageHero
        eyebrow={isAr ? "نظرة عامة على السوق" : "Market Overview"}
        image={lobbyOcean}
        imageAlt={isAr ? "تصميم معماري لمنتجعات الضيافة" : "Hospitality and resort architectural design"}
      />

      {/* Block M-1 */}
      <section className="page-width editorial-section-grid editorial-section-grid--fit-copy" id="market-intro">
        <Reveal className="editorial-copy">
          <p className="eyebrow">{isAr ? "رؤى السوق" : "Market Context"}</p>
          <div className="section-red-bar" aria-hidden="true" />
          <h2>
            {isAr ? (
              <>
                الساحل الشمالي يدخل <span className="headline-accent">مرحلة جديدة</span>
              </>
            ) : (
              <>
                A NEW PHASE OF <span className="headline-accent">GROWTH</span>
              </>
            )}
          </h2>
          {isAr ? (
            <>
              <p>
                يشهد الساحل الشمالي ومدينة العلمين الجديدة مرحلة جديدة من النمو، مدفوعة بالتوسع العقاري، وزيادة الطاقة الاستيعابية للفنادق والوحدات السكنية، وارتفاع النشاط السياحي، إلى جانب التوجه لتحويل المنطقة إلى وجهة تعمل على مدار العام.
              </p>
              <p className="editorial-copy-statement">
                ولا يقتصر هذا النمو على زيادة المعروض العقاري، بل يخلق سوقًا متناميًا للوحدات الجاهزة للسكن والتأجير والتشغيل والاستثمار، وما يرتبط بها من أثاث وأجهزة منزلية وإضاءة وإكسسوارات وتجهيزات وحلول للمساحات الخارجية والمنازل الذكية.
              </p>
            </>
          ) : (
            <>
              <p>
                The North Coast and the city of New Alamein are experiencing a new phase of growth, driven by real estate
                expansion, increased hotel and residential capacity, and a surge in tourism activity, alongside a growing
                trend to transform the region into a year-round destination.
              </p>
              <p className="editorial-copy-statement">
                This growth is generating not only new real estate units but also a burgeoning market for properties ready
                for occupancy, rental, operation, and investment—as well as the associated Furniture, Home Appliances,
                Lighting &amp; Accessories, fixtures, outdoor living solutions, Smart Home Solutions, Complete Fit-Out.
              </p>
            </>
          )}
        </Reveal>
        <Reveal className="editorial-media">
          <img
            src={lobbyOcean}
            alt={isAr ? "نمو الساحل الشمالي" : "North Coast growth"}
            width={1600}
            height={1024}
            decoding="async"
          />
        </Reveal>
      </section>

      {/* Two Markets, One Opportunity */}
      <section className="two-markets-section page-width" id="two-markets">
        <Reveal className="section-heading" style={{ marginBottom: "2rem" }}>
          <div>
            <div className="section-red-bar" aria-hidden="true" />
            <h2>
              {isAr ? (
                <>
                  سوقان... <span className="headline-accent">فرصة واحدة</span>
                </>
              ) : (
                <>
                  TWO MARKETS… <span className="headline-accent">ONE OPPORTUNITY</span>
                </>
              )}
            </h2>
            <p style={{ maxWidth: "60ch", fontSize: "1.1rem", color: "#444" }}>
              {isAr
                ? "كل عقار جديد يخلق دورة جديدة من الطلب — بدءًا من التجهيز والتأثيث الأولي، وصولًا إلى التطوير والتجديد وتحسين العائد من التأجير."
                : "Every new property creates a new demand cycle — from development to handover, furnishing, equipping, and ongoing upgrades."}
            </p>
          </div>
        </Reveal>
        <div className="two-markets-grid">
          <Reveal className="market-col market-col-new">
            <h3 className="market-col-title">
              <svg className="tk-chevron-icon" viewBox="0 0 100 120" fill="currentColor" aria-hidden="true">
                <polygon points="0,0 45,0 100,60 45,120 0,120 55,60" />
              </svg>
              <span>{isAr ? "وحدات حديثة التسليم" : "NEW SUPPLY"}</span>
            </h3>
            <p className="market-col-lead">
              {isAr
                ? "الوحدات العقارية التي يتم تسليمها حديثًا تخلق طلبًا فوريًا على"
                : "New handovers create immediate demand."}
            </p>
            <ul className="market-list">
              {isAr ? (
                <>
                  <li>الأثاث</li>
                  <li>الأجهزة المنزلية</li>
                  <li>الإضاءة والإكسسوارات</li>
                  <li>الأثاث الخارجي</li>
                  <li>حلول المنازل الذكية</li>
                  <li>حلول التشطيب والتجهيز المتكاملة</li>
                </>
              ) : (
                <>
                  <li>Furniture</li>
                  <li>Home Appliances</li>
                  <li>Lighting &amp; Accessories</li>
                  <li>Outdoor Furniture</li>
                  <li>Smart Home Solutions</li>
                  <li>Complete Fit-Out</li>
                </>
              )}
            </ul>
          </Reveal>
          <Reveal className="market-col market-col-existing">
            <h3 className="market-col-title">
              <svg className="tk-chevron-icon" viewBox="0 0 100 120" fill="currentColor" aria-hidden="true">
                <polygon points="0,0 45,0 100,60 45,120 0,120 55,60" />
              </svg>
              <span>{isAr ? "وحدات تحت التجديد" : "EXISTING SUPPLY"}</span>
            </h3>
            <p className="market-col-lead">
              {isAr
                ? "الوحدات القائمة تخلق طلبًا متكررًا ومستمرًا على"
                : "Existing properties create recurring demand."}
            </p>
            <ul className="market-list">
              {isAr ? (
                <>
                  <li>التجديد والتطوير</li>
                  <li>استبدال الأثاث</li>
                  <li>تحديث التصميمات الداخلية</li>
                  <li>التكنولوجيا الذكية</li>
                  <li>تطوير المساحات الخارجية</li>
                  <li>تحسين جاهزية الوحدات للتأجير</li>
                </>
              ) : (
                <>
                  <li>Renovation</li>
                  <li>Furniture Replacement</li>
                  <li>Interior Upgrades</li>
                  <li>Smart Technology</li>
                  <li>Outdoor Upgrades</li>
                  <li>Rental Optimization</li>
                </>
              )}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Block M-3 — Market at a Glance */}
      <section className="market-glance-section section-band full-width-section" id="market-glance">
        <div className="page-width">
          <Reveal className="section-heading">
            <div>
              <p className="eyebrow">{isAr ? "حجم السوق" : "Key Indicators"}</p>
              <div className="section-red-bar" aria-hidden="true" />
              <h2 style={{ color: "#ffffff" }}>
                {isAr ? (
                  <>
                    حجم السوق في <span className="headline-accent">أرقام</span>
                  </>
                ) : (
                  <>
                    THE MARKET AT A <span className="headline-accent">GLANCE</span>
                  </>
                )}
              </h2>
              <p style={{ color: "#d1d5db" }}>
                {isAr
                  ? "ثلاثة مؤشرات تعكس حجم السوق وزخم نموه."
                  : "Three indicators reflect the scale and momentum of the market."}
              </p>
            </div>
          </Reveal>
          <div className="market-stats-grid">
            <Reveal className="market-stat">
              <span className="stat-figure">
                <AnimatedCounter value={isAr ? "1.2 تريليون جنيه" : "EGP 1.2T"} />
              </span>
              <span className="stat-label">
                {isAr ? "حجم التعاملات العقارية" : "REAL ESTATE TRANSACTIONS"}
              </span>
              <span className="stat-context">
                {isAr ? "الساحل الشمالي | ٢٠٢٤ - ٢٠٢٥" : "North Coast | 2024–2025"}
              </span>
            </Reveal>
            <Reveal className="market-stat">
              <span className="stat-figure">
                <AnimatedCounter value={isAr ? "145 مليار جنيه" : "EGP 185B"} />
              </span>
              <span className="stat-label">
                {isAr ? "الاستثمارات المستهدفة" : "TARGETED INVESTMENT"}
              </span>
              <span className="stat-context">{isAr ? "العلمين الجديدة" : "New Alamein"}</span>
            </Reveal>
            <Reveal className="market-stat">
              <span className="stat-figure">
                <AnimatedCounter value="46,189+" />
              </span>
              <span className="stat-label">{isAr ? "وحدة سكنية" : "RESIDENTIAL UNITS"}</span>
              <span className="stat-context">{isAr ? "العلمين الجديدة" : "New Alamein"}</span>
            </Reveal>
          </div>
          <p className="market-stat-footnote" style={{ color: "#9ca3af" }}>
            {isAr
              ? "المصدر: مؤشرات سوق منشورة خلال ٢٠٢٥–٢٠٢٦. تعكس الأرقام مقاييس مختلفة ولا تمثل قيمة استثمارية موحدة."
              : "Market indicators reported across 2025–2026 sources. Figures represent different market measures and should not be treated as a single investment value."}
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
