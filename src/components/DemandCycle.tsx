import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/lib/i18n";

const DEMAND_STEPS_BY_LOCALE = {
  en: [
    "DEVELOPMENT",
    "UNIT HANDOVER",
    "FURNISHING & FIT-OUT",
    "EQUIPPING & SMART TECHNOLOGY",
    "RENTAL / HOSPITALITY OPERATION",
    "UPGRADE & RENOVATION",
    "RECURRING DEMAND",
  ],
  ar: [
    "التطوير العقاري",
    "استلام الوحدة",
    "التأثيث والتجهيز",
    "الأجهزة والتكنولوجيا الذكية",
    "التشغيل التأجيري والضيافة",
    "التطوير والتجديد",
    "الطلب المتجدد",
  ],
} as const;

export function DemandCycle() {
  const { locale, isAr } = useLocale();
  const steps = DEMAND_STEPS_BY_LOCALE[locale];
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [animState, setAnimState] = useState<"idle" | "running" | "done">("idle");
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const reducedMotion = useRef(
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );

  const startedRef = useRef(false);

  useEffect(() => {
    // With reduced motion or JS off: show finished state immediately
    if (reducedMotion.current) {
      setActiveIndex(steps.length - 1);
      setAnimState("done");
      return;
    }

    const node = containerRef.current;
    if (!node || startedRef.current) return;

    let timer: ReturnType<typeof setInterval> | undefined;

    const startCycle = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      setAnimState("running");

      let idx = 0;
      setActiveIndex(0);
      timer = setInterval(() => {
        idx += 1;
        if (idx < steps.length) {
          setActiveIndex(idx);
        } else {
          clearInterval(timer);
          setAnimState("done");
        }
      }, 150);
    };

    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight + 60 && rect.bottom > 0) {
      startCycle();
      return () => {
        if (timer) clearInterval(timer);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        startCycle();
      },
      { threshold: 0.05, rootMargin: "0px 0px 80px 0px" }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (timer) clearInterval(timer);
    };
  }, [steps.length]);

  const isLast = (idx: number) => idx === steps.length - 1;
  const isActive = (idx: number) => idx <= activeIndex;

  return (
    <div ref={containerRef} className="dc-root">
      {/* Track + progress line (decorative, hidden from SR) */}
      <div className="dc-track-wrap" aria-hidden="true">
        <div className="dc-track-bg" />
        <div
          ref={trackRef}
          className={`dc-track-fill ${animState !== "idle" ? "dc-track-fill--active" : ""}`}
        />
      </div>

      {/* Steps as ordered list (semantic) */}
      <ol
        className="dc-steps"
        aria-label={isAr ? "مراحل دورة الطلب العقاري السبع" : "Seven stages of property demand cycle"}
      >
        {steps.map((step, idx) => (
          <li
            key={step}
            className={`dc-step ${isActive(idx) ? "dc-step--active" : ""} ${isLast(idx) ? "dc-step--last" : ""} ${animState === "done" && isLast(idx) ? "dc-step--pulse" : ""}`}
          >
            {/* Node (decorative) */}
            <div className="dc-node" aria-hidden="true">
              <svg
                className="dc-chevron"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                {isLast(idx) ? (
                  /* Loop-back arrow for last step */
                  <path
                    d="M2 6 C2 3 5 1 7 3 L10 6 M7 3 L10 6 L7 9"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : (
                  /* Chevron for other steps */
                  <path
                    d="M4 2.5L8.5 6L4 9.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </svg>
            </div>
            {/* Label */}
            <span className="dc-label">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
