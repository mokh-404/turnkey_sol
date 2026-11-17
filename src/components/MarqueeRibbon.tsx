import { SHOW_SECTORS, SHOW_SECTORS_AR } from "@/config/event";
import { useLocale } from "@/lib/i18n";

export function MarqueeRibbon() {
  const { isAr } = useLocale();
  const list = isAr ? SHOW_SECTORS_AR : SHOW_SECTORS;

  return (
    <div
      className="marquee-ribbon-container"
      role="region"
      aria-label={isAr ? "قطاعات المعرض الرئيسية" : "Core Exhibition Sectors"}
    >
      <div className="marquee-ribbon-track">
        {/* Repeating the sectors 4 times ensures seamless infinite CSS scroll across ultrawide monitors */}
        {[...list, ...list, ...list, ...list].map((sector, idx) => (
          <span key={`${sector}-${idx}`} className="marquee-item">
            <span className="marquee-label">{sector}</span>
            <span className="marquee-chevron" aria-hidden="true">
              {isAr ? "<" : ">"}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
