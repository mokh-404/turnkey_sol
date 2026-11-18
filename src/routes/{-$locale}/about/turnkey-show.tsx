import { createFileRoute } from "@tanstack/react-router";

import livingRoom from "@/assets/living-room.webp";
import smokedOakApplianceWall from "@/assets/smoked-oak-appliance-wall.webp";
import warmKitchen from "@/assets/warm-kitchen.webp";
import smartHome from "@/assets/smart-home.webp";
import smartLiving from "@/assets/smart-living.webp";
import terraceSunset from "@/assets/terrace-sunset.webp";
import lobbyOcean from "@/assets/lobby-ocean.webp";
import villaShowcase from "@/assets/villa-showcase.webp";
import { PageHero, Reveal, SiteLayout } from "@/components/SiteLayout";
import { EVENT_TEXT } from "@/config/event";
import { LocaleLink, resolveLocale, useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/{-$locale}/about/turnkey-show")({
  component: TurnkeyShowPage,
  head: ({ params }) => {
    const isAr = resolveLocale((params as { locale?: string }).locale) === "ar";
    return {
      meta: [
        {
          title: isAr
            ? "معرض تيرن كي | عن المعرض | معرض العلمين تيرن كي شو ٢٠٢٧"
            : "Turnkey Show | About | Turnkey Show Alamein 2027",
        },
        {
          name: "description",
          content: isAr
            ? "معرض متخصص يجمع الأثاث والتشطيبات والأجهزة المنزلية وحلول المساحات الخارجية وتكنولوجيا المنازل الذكية للوحدات الساحلية ومشروعات الضيافة."
            : "A premium show dedicated to furniture, fit-out, appliances, outdoor living and smart technology for coastal and hospitality properties.",
        },
        {
          property: "og:title",
          content: isAr ? "معرض تيرن كي | عن المعرض" : "Turnkey Show | About",
        },
        { property: "og:type", content: "website" },
      ],
    };
  },
});

const SECTORS_BY_LOCALE = {
  en: [
    { name: "Furniture & Interiors", img: livingRoom },
    { name: "Kitchens & Equipment", img: warmKitchen },
    { name: "Home Appliances", img: smokedOakApplianceWall },
    { name: "Outdoor Living", img: terraceSunset },
    { name: "Smart Unit Automation", img: smartHome },
    { name: "Modern Lighting Technology", img: smartLiving },
    { name: "Hospitality Fit-Out", img: lobbyOcean },
    { name: "Complete Solutions", img: villaShowcase },
  ],
  ar: [
    { name: "الأثاث والتصميم الداخلي", img: livingRoom },
    { name: "المطابخ وتجهيزاتها", img: warmKitchen },
    { name: "الأجهزة المنزلية", img: smokedOakApplianceWall },
    { name: "المساحات الخارجية", img: terraceSunset },
    { name: "المنازل الذكية", img: smartHome },
    { name: "تقنيات الإضاءة الحديثة", img: smartLiving },
    { name: "تجهيزات الضيافة", img: lobbyOcean },
    { name: "الحلول المتكاملة", img: villaShowcase },
  ],
} as const;

function TurnkeyShowPage() {
  const { locale, isAr } = useLocale();
  const eventText = EVENT_TEXT[locale];
  const sectors = SECTORS_BY_LOCALE[locale];

  return (
    <SiteLayout>
      {/* Block A-1 */}
      <PageHero
        eyebrow={isAr ? "عن المعرض" : "About the Show"}
        image={livingRoom}
        imageAlt={isAr ? "تصميم داخلي لوحدة ساحلية مجهزة" : "Luxury coastal interior living room"}
      />

      {/* Block A-1 continued */}
      <section className="page-width editorial-section-grid" id="intro">
        <Reveal className="editorial-copy">
          <div className="editorial-copy-content">
            {isAr ? (
              <>
                <h2>
                  المنصة المتكاملة لحلول تجهيز{" "}
                  <span className="headline-accent">الوحدات الساحلية</span>
                </h2>
                <p>
                  الحدث التجاري الأول من نوعه في قلب مدينة العلمين الجديدة، ومنصة استراتيجية متكاملة
                  تجمع كبار المستثمرين وملاك الوحدات الساحلية والمنشآت الفندقية والمطورين العقاريين
                  بأبرز العلامات التجارية والشركات المتخصصة في الأثاث والتصميم الداخلي والحلول
                  العقارية الذكية.
                </p>
                <p>
                  صُمم المعرض ليقدم تجربة متكاملة تغني عن عناء البحث المطوّل وتعدد الموردين؛ حيث
                  يجمع تحت سقف واحد الأثاث الفاخر والتشطيبات العصرية، وأنظمة المنازل الذكية، وحلول
                  الطاقة المستدامة، وكل ما يلزم لتحويل الوحدة العقارية إلى مساحة متكاملة وعملية
                  وجذابة.
                </p>
                <p style={{ marginBottom: 0 }}>
                  يربط معرض تيرن كي ملاك الوحدات والمستثمرين والمطورين العقاريين والمتخصصين في قطاع
                  الضيافة بأبرز العلامات التجارية ومقدمي الحلول المتكاملة، ويوفر كل ما يلزم لتحويل
                  الوحدات العقارية المستلمة إلى مساحات جاهزة للسكن والتأجير والاستثمار.
                </p>
              </>
            ) : (
              <>
                <h2>
                  CONNECTING THE COAST'S COMPLETE PROPERTY{" "}
                  <span className="headline-accent">ECOSYSTEM</span>
                </h2>
                <p>
                  The first-of-its-kind trade exhibition in the heart of New Alamein City, this
                  pioneering event serves as an integrated strategic platform connecting leading
                  investors, owners of coastal and hospitality properties, and top real estate
                  developers with premier companies specializing in furniture, interior furnishing,
                  and smart property solutions.
                </p>
                <p>
                  Designed to redefine the property furnishing experience, the exhibition offers an
                  exclusive, all-in-one destination that eliminates the need for lengthy searches
                  and multiple suppliers. From luxury furniture and contemporary décor to smart home
                  management systems and sustainable energy solutions, visitors and investors can
                  discover everything they need under one roof.
                </p>
                <p style={{ marginBottom: 0 }}>
                  More than just an exhibition, this event is a dynamic hub for business connections
                  and investment opportunities, empowering exhibitors to maximize their sales
                  potential and connect directly with a highly targeted audience of serious buyers
                  with immediate purchasing intent.
                </p>
              </>
            )}
          </div>
        </Reveal>
        <Reveal className="editorial-media">
          <div className="expo-media-frame">
            <img
              src={terraceSunset}
              alt={
                isAr
                  ? "أسلوب الحياة الساحلي والتصميم الداخلي الفاخر"
                  : "Mediterranean coastal living and luxury interiors"
              }
              width={1600}
              height={1024}
              decoding="async"
            />
            <div className="expo-media-badge liquid-glass-dark">
              <span className="badge-title">{eventText.dates}</span>
              <span className="badge-subtitle">{eventText.venue}</span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Blocks A-2 to A-5 — 2-Row Editorial Pillars */}
      <section className="page-width turnkey-pillars-section" id="pillars">
        <div className="turnkey-pillars-grid">
          <Reveal className="turnkey-pillar-card">
            <div id="concept">
              <h2>{isAr ? "الفكرة" : "THE CONCEPT"}</h2>
              <div className="section-red-bar" aria-hidden="true" />
              {isAr ? (
                <>
                  <p>
                    <strong>من استلام العقار إلى تعظيم قيمته.</strong> لا تنتهي رحلة العقار عند
                    استلامه، بل يحتاج إلى التأثيث والتجهيز وربطه بالتكنولوجيا وتطويره باستمرار.
                  </p>
                  <p>
                    يجمع معرض تيرن كي جميع القطاعات المتكاملة في مكان واحد، ليربط بين سوق الوحدات
                    الساحلية المتنامي والعلامات التجارية والحلول التي تساهم في تشكيل مرحلته المقبلة.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>From property delivery to property value.</strong> A property&apos;s
                    journey doesn&apos;t end at handover. It needs to be furnished, equipped,
                    connected and continuously upgraded.
                  </p>
                  <p>
                    Turnkey Show brings these complete sectors together — connecting the growing
                    coastal property market with the brands and solutions that shape its next stage.
                  </p>
                </>
              )}
            </div>
          </Reveal>

          <Reveal className="turnkey-pillar-card">
            <div id="promise">
              <h2>{isAr ? "القيمة" : "THE SHOW PROMISE"}</h2>
              <div className="section-red-bar" aria-hidden="true" />
              {isAr ? (
                <>
                  <p>
                    <strong>وجهة واحدة. حلول متكاملة لتجهيز الوحدات.</strong> من أول قطعة أثاث إلى
                    أحدث حلول المنازل الذكية، صُمم المعرض ليقدم كل ما يلزم لتحويل الوحدة العقارية
                    إلى مساحة متكاملة وعملية وجذابة.
                  </p>
                  <p>
                    ويجمع تحت سقف واحد{" "}
                    <strong>
                      الأثاث والتصميم الداخلي، والأجهزة المنزلية، وحلول المساحات الخارجية،
                      وتكنولوجيا المنازل الذكية، والإضاءة والإكسسوارات، وتجهيزات الضيافة، والحلول
                      العقارية المتكاملة
                    </strong>
                    .
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>One destination. The complete property fit-out.</strong> From the first
                    furniture piece to the latest smart-home solution, the show is designed to
                    showcase everything required to create a complete, functional and attractive
                    coastal property.
                  </p>
                  <p>
                    It connects{" "}
                    <strong>
                      Furniture &amp; Interiors, Home Appliances, Outdoor Living, Smart Home
                      Technology, Lighting &amp; Accessories, Hospitality Fit-Out, Property
                      Solutions
                    </strong>{" "}
                    under one roof.
                  </p>
                </>
              )}
            </div>
          </Reveal>

          <Reveal className="turnkey-pillar-card">
            <div id="vision">
              <h2>{isAr ? "الرؤية" : "THE VISION"}</h2>
              <div className="section-red-bar" aria-hidden="true" />
              {isAr ? (
                <p>
                  <strong>الوجهة الرائدة لحلول الوحدات الساحلية.</strong> أن يصبح المعرض المنصة
                  الرائدة التي تربط بين الوحدات الساحلية والتصميم والتكنولوجيا والضيافة، لتحويل
                  الوحدات إلى مساحات متكاملة ومفروشة ومتصلة بالتكنولوجيا وعملية وجاهزة للاستثمار.
                </p>
              ) : (
                <p>
                  <strong>The destination for coastal property solutions.</strong> To create the
                  leading platform connecting real estate, design, technology and hospitality —
                  transforming coastal properties into furnished, connected, functional and
                  investment-ready experiences.
                </p>
              )}
            </div>
          </Reveal>

          <Reveal className="turnkey-pillar-card">
            <div id="opportunity">
              <h2>{isAr ? "الفرصة" : "THE OPPORTUNITY"}</h2>
              <div className="section-red-bar" aria-hidden="true" />
              {isAr ? (
                <p>
                  <strong>من تسليم العقار إلى تعظيم قيمته.</strong> يساهم النمو المتسارع في الساحل
                  الشمالي ومدينة العلمين الجديدة في خلق فرص تتجاوز مجرد زيادة المعروض العقاري، فهو
                  يفتح المجال أمام منظومة متنامية من الوحدات المفروشة والمجهزة والمتصلة
                  بالتكنولوجيا، والجاهزة للتشغيل والاستثمار.
                </p>
              ) : (
                <p>
                  <strong>From property delivery... to property value.</strong> The growth of North
                  Coast &amp; New Alamein is creating more than real estate supply. It is creating a
                  growing ecosystem of Furnished, Equipped, Connected, Operated and Investment-ready
                  properties.
                </p>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Block A-6 — Sector Cards */}
      <section className="exhibit-sectors section-band" id="sectors">
        <div className="page-width">
          <Reveal className="section-heading">
            <div>
              <p className="eyebrow">{isAr ? "قطاعات المعرض" : "SHOW SECTORS"}</p>
              <div className="section-red-bar" aria-hidden="true" />
              <h2>
                {isAr
                  ? "يجمع المعرض كافة القطاعات المعنية بمجال التركيبات والتجهيزات"
                  : "THE SHOW CONNECTS THE ENTIRE UNIT-FITTING SECTORS"}
              </h2>
            </div>
          </Reveal>
          <div className="sector-grid">
            {sectors.map((sector) => (
              <Reveal key={sector.name}>
                <LocaleLink
                  to="/exhibit/why-exhibit"
                  className="sector-card"
                  aria-label={sector.name}
                >
                  <img
                    src={sector.img}
                    alt={sector.name}
                    width={1600}
                    height={1024}
                    decoding="async"
                  />
                  <div className="sector-card-copy">
                    <h3>{sector.name}</h3>
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
