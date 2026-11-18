import { createFileRoute } from "@tanstack/react-router";

import livingRoom from "@/assets/living-room.webp";
import terraceSunset from "@/assets/terrace-sunset.webp";
import lobbyOcean from "@/assets/lobby-ocean.webp";
import smartHome from "@/assets/smart-home.webp";
import smokedOakApplianceWall from "@/assets/smoked-oak-appliance-wall.webp";
import warmKitchen from "@/assets/warm-kitchen.webp";
import villaShowcase from "@/assets/villa-showcase.webp";
import oceanfrontTerrace from "@/assets/oceanfront-terrace.webp";
import smartLiving from "@/assets/smart-living.webp";
import venueImage from "@/assets/venue.webp";
import { AnimatedCounter, Reveal, SiteLayout } from "@/components/SiteLayout";
import { MarqueeRibbon } from "@/components/MarqueeRibbon";
import { EVENT_TEXT } from "@/config/event";
import { LocaleLink, resolveLocale, useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/{-$locale}/")({
  component: Index,
  head: ({ params }) => {
    const isAr = resolveLocale((params as { locale?: string }).locale) === "ar";
    const title = isAr
      ? "معرض العلمين تيرن كي شو | المنصة المتكاملة لحلول تجهيز الوحدات الساحلية"
      : "Turnkey Show Alamein | The Coast's Complete Property Solutions Platform";
    const description = isAr
      ? "معرض العلمين التجاري للأثاث وتكنولوجيا التجهيز الذكي للوحدات الفندقية والساحلية. المنصة المتكاملة لحلول تجهيز الوحدات الساحلية في مدينة العلمين الجديدة."
      : "The coast's complete property solutions platform. Turnkey Show Alamein connects property owners, developers, and hospitality operators with complete furnishing, fit-out, appliances, and smart living solutions.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
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
      detail:
        "Custom kitchen cabinetry, built-in appliances, fixtures and premium kitchen fit-outs.",
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
      detail:
        "Architectural lighting, ambient systems, modern illumination and decorative fixtures.",
    },
    {
      title: "Hospitality Fit-Out",
      image: lobbyOcean,
      detail:
        "High-spec commercial solutions for hotels, serviced apartments and rental properties.",
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

const STATS_BY_LOCALE = {
  en: [
    { value: "1.2T EGP", label: "Real Estate Transactions", sub: "North Coast | 2024–2025" },
    { value: "185B EGP", label: "Targeted Investment", sub: "New Alamein" },
    { value: "46,189+", label: "Residential Units", sub: "New Alamein" },
  ],
  ar: [
    {
      value: "1.2 تريليون جنيه",
      label: "حجم التعاملات العقارية",
      sub: "الساحل الشمالي | ٢٠٢٤ - ٢٠٢٥",
    },
    { value: "145 مليار جنيه", label: "الاستثمارات المستهدفة", sub: "العلمين الجديدة" },
    { value: "46,189+", label: "وحدة سكنية", sub: "العلمين الجديدة" },
  ],
} as const;

function Index() {
  const { locale, isAr } = useLocale();
  const eventText = EVENT_TEXT[locale];
  const sectors = SECTORS_BY_LOCALE[locale];
  const stats = STATS_BY_LOCALE[locale];

  return (
    <SiteLayout>
      {/* Homepage Hero Section */}
      <section className="hero-section" aria-label={isAr ? "مقدمة المعرض" : "Introduction"}>
        <div className="hero-media">
          <img
            className="hero-bg-img hero-zoom"
            src={villaShowcase}
            alt={
              isAr
                ? "معرض العلمين تيرن كي شو ٢٠٢٧ — تصميم داخلي ساحلي متكامل"
                : "Turnkey Show 2027 Luxury Furnished Coastal Interior"
            }
            width={2400}
            height={1350}
            fetchPriority="high"
          />
          <div className="hero-diagonal-overlay" aria-hidden="true" />
          <div className="hero-gradient-directional" aria-hidden="true" />
          <div className="hero-gradient-bottom" aria-hidden="true" />
          <div className="hero-corner-chevron" aria-hidden="true">
            <svg viewBox="0 0 100 120" fill="var(--tk-red)" width="100%" height="100%">
              <polygon points="0,0 45,0 100,60 45,120 0,120 55,60" />
            </svg>
          </div>
        </div>

        <div className="page-width hero-container">
          <div className="hero-stack">
            <div className="hero-top-split">
              <div className="hero-title-col">
                <h1 className="hero-headline">
                  {isAr ? (
                    <>
                      العلمين
                      <br />
                      تيرن كي
                      <br />
                      شو
                    </>
                  ) : (
                    <>
                      Alamein
                      <br />
                      Turnkey
                      <br />
                      Show
                    </>
                  )}
                </h1>
                <div className="hero-red-bar" aria-hidden="true" />
              </div>
              <div className="hero-meta-right">
                <p className="hero-subhead hero-definition-right">
                  {isAr ? (
                    <>
                      معرض العلمين التجاري للأثاث
                      <br />
                      وتكنولوجيا التجهيز الذكي
                      <br />
                      للوحدات الفندقية والساحلية
                    </>
                  ) : (
                    <>
                      The Alamein Trade Show for Furniture,
                      <br />
                      Smart Furnishing Technologies &amp; Complete
                      <br />
                      Fit-Out Solutions for Coastal Units
                    </>
                  )}
                </p>
                <p className="hero-subhead hero-date-venue-right">
                  <span className="hero-date-only-red">{eventText.dates}</span>
                  {isAr ? (
                    <>
                      <span className="hero-venue-line1">
                        <span>مركز</span> <span>العلمين</span> <span>الدولي</span>
                      </span>
                      <span className="hero-venue-line2">للمؤتمرات والمعارض</span>
                    </>
                  ) : (
                    <>
                      <span className="hero-venue-line1">
                        <span>New</span> <span>Alamein</span> <span>International</span>
                      </span>
                      <span className="hero-venue-line2">Convention and Exhibition Center</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* 8 Sectors in a 2×4 grid */}
            <div
              className="hero-sectors-text"
              aria-label={isAr ? "قطاعات المعرض" : "Exhibition Sectors"}
            >
              {[sectors.slice(0, 4), sectors.slice(4, 8)].map((row) =>
                row.map((sector, idx) => (
                  <span key={sector.title} className="hero-sector-group">
                    {idx > 0 && <span className="hero-sector-pipe" aria-hidden="true" />}
                    <span className="hero-sector-label">{sector.title}</span>
                  </span>
                )),
              )}
            </div>
          </div>

          {/* Anchored Info Strip */}
          <div
            className="hero-info-strip liquid-glass-dark"
            role="region"
            aria-label={isAr ? "أرقام المعرض الرئيسية" : "Event Key Information"}
          >
            <div className="info-strip-col">
              <span className="info-strip-label">{isAr ? "مساحة العرض" : "Exhibition space"}</span>
              <span className="info-strip-value">
                <AnimatedCounter value={isAr ? "13000 م²" : "13000 SQM"} />
              </span>
            </div>
            <div className="info-strip-col">
              <span className="info-strip-label">
                {isAr ? "العارضون والعلامات التجارية" : "Exhibitors / Brands"}
              </span>
              <span className="info-strip-value">
                <AnimatedCounter value="120" />
              </span>
            </div>
            <div className="info-strip-col info-strip-focus">
              <span className="info-strip-label">{isAr ? "الزوار" : "Visitors"}</span>
              <span className="info-strip-value">
                <AnimatedCounter value="8000+" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 1. First Section after hero: About the Expo */}
      <section
        className="expo-intro-section page-width"
        style={{
          paddingTop: "calc(var(--section-gap) + 10px)",
          paddingBottom: "calc(var(--section-gap) + 10px)",
        }}
      >
        <div className="expo-intro-grid">
          <Reveal className="expo-intro-content">
            <p className="eyebrow">{isAr ? "نظرة عامة على المعرض" : "About the Expo"}</p>
            <div className="section-red-bar" aria-hidden="true" />
            {isAr ? (
              <>
                <h2>
                  معرض تيرن كي... المنصة المتكاملة لحلول تجهيز{" "}
                  <span className="headline-accent">الوحدات الساحلية</span>
                </h2>
                <p
                  style={{
                    fontSize: "1.08rem",
                    lineHeight: 1.75,
                    color: "#222222",
                    marginBottom: "1rem",
                  }}
                >
                  الحدث التجاري الأول من نوعه في قلب مدينة العلمين الجديدة، ومنصة استراتيجية متكاملة
                  تجمع كبار المستثمرين وملاك الوحدات الساحلية والمنشآت الفندقية والمطورين العقاريين
                  بأبرز العلامات التجارية والشركات المتخصصة في الأثاث والتصميم الداخلي والحلول
                  العقارية الذكية.
                </p>
                <p
                  style={{
                    fontSize: "1.08rem",
                    lineHeight: 1.75,
                    color: "#333333",
                    marginBottom: "1rem",
                  }}
                >
                  صُمم المعرض ليقدم تجربة متكاملة تغني عن عناء البحث المطوّل وتعدد الموردين؛ حيث
                  يجمع تحت سقف واحد الأثاث الفاخر والتشطيبات العصرية، وأنظمة المنازل الذكية، وحلول
                  الطاقة المستدامة، وكل ما يلزم لتحويل الوحدة العقارية إلى مساحة متكاملة وعملية
                  وجذابة.
                </p>
                <p
                  style={{
                    fontSize: "1.08rem",
                    lineHeight: 1.75,
                    color: "#333333",
                    marginBottom: 0,
                  }}
                >
                  ويمتد دور المعرض إلى ما هو أبعد من العرض التقليدي، ليكون مركزًا حيويًا للصفقات
                  التجارية والفرص الاستثمارية، يتيح للعارضين الوصول المباشر إلى جمهور مستهدف من
                  أصحاب المشروعات والقرار الشرائي الفعلي.
                </p>
              </>
            ) : (
              <>
                <h2>
                  TURNKEY SHOW…THE COAST’S COMPLETE PROPERTY{" "}
                  <span className="headline-accent">SOLUTIONS</span> PLATFORM
                </h2>
                <p
                  style={{
                    fontSize: "1.08rem",
                    lineHeight: 1.68,
                    color: "#222222",
                    marginBottom: "1rem",
                  }}
                >
                  The first-of-its-kind trade exhibition in the heart of New Alamein City, this
                  pioneering event serves as an integrated strategic platform connecting leading
                  investors, owners of coastal and hospitality properties, and top real estate
                  developers with premier companies specializing in furniture, interior furnishing,
                  and smart property solutions.
                </p>
                <p
                  style={{
                    fontSize: "1.08rem",
                    lineHeight: 1.68,
                    color: "#333333",
                    marginBottom: "1rem",
                  }}
                >
                  Designed to redefine the property furnishing experience, the exhibition offers an
                  exclusive, all-in-one destination that eliminates the need for lengthy searches
                  and multiple suppliers. From luxury furniture and contemporary décor to smart home
                  management systems and sustainable energy solutions, visitors and investors can
                  discover everything they need under one roof.
                </p>
                <p
                  style={{
                    fontSize: "1.08rem",
                    lineHeight: 1.68,
                    color: "#333333",
                    marginBottom: 0,
                  }}
                >
                  More than just an exhibition, this event is a dynamic hub for business connections
                  and investment opportunities, empowering exhibitors to maximize their sales
                  potential and connect directly with a highly targeted audience of serious buyers
                  with immediate purchasing intent.
                </p>
              </>
            )}
          </Reveal>

          <Reveal className="expo-intro-media">
            <div className="expo-media-frame">
              <img
                src={livingRoom}
                alt={
                  isAr
                    ? "تأثيث وتصميم داخلي معاصر للوحدات الساحلية في معرض تيرن كي"
                    : "Turnkey Show contemporary coastal furnishing and design"
                }
                width={1600}
                height={1024}
                decoding="async"
              />
              <div className="expo-media-badge liquid-glass-dark">
                <span className="badge-title">
                  {isAr ? "من استلام العقار إلى تعظيم قيمته" : "From Handover to Value"}
                </span>
                <span className="badge-subtitle">
                  {isAr
                    ? "مركز العلمين الدولي للمؤتمرات والمعارض"
                    : "Alamein International Convention Center"}
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Marquee Ribbon: Seamless infinite sector loop */}
      <MarqueeRibbon />

      {/* 2. Second Section: Two Markets, One Opportunity next to the image */}
      <section className="intro-section page-width" id="market-overview">
        <div className="intro-main-row intro-markets-row">
          <Reveal className="intro-image-wrap">
            <img
              src={oceanfrontTerrace}
              alt={
                isAr
                  ? "إطلالة ساحلية على البحر المتوسط لوحدة مجهزة بالكامل"
                  : "Luxury oceanfront terrace overlooking the Mediterranean coast"
              }
              width={1600}
              height={1024}
              decoding="async"
            />
            <span className="image-index liquid-glass-dark">
              {isAr ? "من التسليم إلى الجاهزية للسكن" : "From Handover to Ready-to-Live"}
            </span>
          </Reveal>

          <div className="two-markets-section two-markets-side" id="two-markets">
            <Reveal className="section-heading two-markets-heading">
              <div>
                <div className="section-red-bar" aria-hidden="true" />
                <h2>
                  {isAr ? (
                    <>
                      الساحل الشمالي يدخل مرحلة <span className="headline-accent">جديدة</span>
                    </>
                  ) : (
                    <>
                      THE NORTH COAST IS ENTERING A NEW <span className="headline-accent">ERA</span>
                    </>
                  )}
                </h2>
                <p className="two-markets-subtitle">
                  {isAr ? (
                    <>
                      سوقان... <span className="headline-accent">فرصة واحدة</span>
                    </>
                  ) : (
                    <>
                      TWO MARKETS… <span className="headline-accent">ONE OPPORTUNITY</span>
                    </>
                  )}
                </p>
              </div>
            </Reveal>
            <div className="two-markets-grid">
              <Reveal className="market-col market-col-new">
                <h3 className="market-col-title">
                  <svg
                    className="tk-chevron-icon"
                    viewBox="0 0 100 120"
                    fill="currentColor"
                    aria-hidden="true"
                  >
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
                  <svg
                    className="tk-chevron-icon"
                    viewBox="0 0 100 120"
                    fill="currentColor"
                    aria-hidden="true"
                  >
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
          </div>
        </div>

        {/* Full-width numbers banner */}
        <Reveal className="home-stats-banner">
          {stats.map((stat) => (
            <div className="home-stat-box" key={stat.value}>
              <strong className="stat-num">
                <AnimatedCounter value={stat.value} />
              </strong>
              <span className="stat-label">{stat.label}</span>
              <span className="stat-sub">{stat.sub}</span>
            </div>
          ))}
        </Reveal>
      </section>

      {/* 3. Sectors Section */}
      <section className="sectors-section section-band" id="sectors">
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
                <LocaleLink
                  to="/exhibit/why-exhibit"
                  className="sector-card"
                  aria-label={sector.title}
                >
                  <img
                    src={sector.image}
                    alt={sector.title}
                    width={1600}
                    height={1024}
                    decoding="async"
                  />
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

      {/* Venue Section */}
      <section className="venue-section" id="venue">
        <div className="venue-image">
          <img src={venueImage} alt={eventText.venue} width={1600} height={1024} decoding="async" />
        </div>
        <div className="page-width venue-content-wrap">
          <Reveal className="venue-copy">
            <p className="eyebrow">{isAr ? "مكان إقامة المعرض" : "Venue"}</p>
            <div className="section-red-bar" aria-hidden="true" />
            <h2>
              {isAr ? (
                <>
                  مركز العلمين الدولي
                  <br />
                  <span className="headline-accent">للمؤتمرات والمعارض</span>
                </>
              ) : (
                <>
                  New Alamein International
                  <br />
                  <span className="headline-accent">Convention &amp; Exhibition Center</span>
                </>
              )}
            </h2>
            <p>
              {isAr
                ? "يُقام المعرض في مركز العلمين الدولي للمؤتمرات والمعارض، وهو وجهة مجهزة خصيصًا لاستضافة الفعاليات الدولية رفيعة المستوى؛ حيث يضم قاعات مؤتمرات حديثة، وغرف اجتماعات مجهزة بالكامل، وأنظمة متطورة للصوت والصورة والترجمة الفورية، إلى جانب مساحات للاجتماعات الثنائية وخدمات متكاملة على ساحل مصر المتوسطي."
                : "A purpose-built international venue equipped with plenary conference halls, advanced audiovisual and interpretation systems, dedicated bilateral meeting suites, and integrated professional services on Egypt's Mediterranean coast."}
            </p>
            <div className="venue-specs">
              <div className="venue-spec-item">
                <span className="spec-val">{isAr ? "مرافق حديثة" : "Plenary"}</span>
                <span className="spec-label">
                  {isAr ? "قاعات مؤتمرات وغرف اجتماعات" : "Halls & Meeting Suites"}
                </span>
              </div>
              <div className="venue-spec-item">
                <span className="spec-val">{isAr ? "تكنولوجيا متطورة" : "Modern"}</span>
                <span className="spec-label">
                  {isAr ? "الصوت والصورة والترجمة الفورية" : "AV & Interpretation"}
                </span>
              </div>
              <div className="venue-spec-item">
                <span className="spec-val">{isAr ? "خدمات متكاملة" : "Integrated"}</span>
                <span className="spec-label">
                  {isAr ? "التسجيل والأعمال والإعلام" : "Technical Services"}
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
