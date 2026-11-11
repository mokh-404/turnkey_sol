import { useEffect, useRef, useState } from "react";

const DEMAND_STEPS = [
  "DEVELOPMENT",
  "UNIT HANDOVER",
  "FURNISHING & FIT-OUT",
  "EQUIPPING & SMART TECHNOLOGY",
  "RENTAL / HOSPITALITY OPERATION",
  "UPGRADE & RENOVATION",
  "RECURRING DEMAND",
];

export function DemandCycle() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [hasTriggered, setHasTriggered] = useState<boolean>(false);

  useEffect(() => {
    // If user prefers reduced motion, activate all steps immediately
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActiveStepIndex(DEMAND_STEPS.length - 1);
      return;
    }

    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || hasTriggered) return;
        setHasTriggered(true);
        observer.disconnect();

        // Staggered activation of the 7 steps
        let current = 0;
        setActiveStepIndex(0);
        const timer = setInterval(() => {
          current += 1;
          if (current < DEMAND_STEPS.length) {
            setActiveStepIndex(current);
          } else {
            clearInterval(timer);
          }
        }, 160);
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasTriggered]);

  return (
    <div ref={containerRef} className="demand-cycle-container" aria-label="Seven Stages of Property Demand Cycle">
      <div className="demand-cycle-stepper">
        {DEMAND_STEPS.map((step, idx) => {
          const isActive = idx <= activeStepIndex;
          const isCurrent = idx === activeStepIndex;
          const isArrowDrawn = idx < activeStepIndex;

          return (
            <div key={step} className="demand-cycle-item">
              <div
                className={`demand-step-card ${isActive ? "is-active" : ""} ${isCurrent ? "is-current" : ""}`}
                data-step={idx + 1}
              >
                <div className="demand-step-header">
                  <span className="demand-step-num">0{idx + 1}</span>
                  <span className="demand-step-indicator" aria-hidden="true" />
                </div>
                <span className="demand-step-label">{step}</span>
              </div>

              {idx < DEMAND_STEPS.length - 1 && (
                <div className="demand-arrow-slot" aria-hidden="true">
                  <svg
                    className={`demand-arrow-svg ${isArrowDrawn ? "is-drawn" : ""}`}
                    viewBox="0 0 28 20"
                    width="28"
                    height="20"
                  >
                    <path
                      d="M2 10 L22 10 M14 3 L22 10 L14 17"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

