import { useEffect, useRef, useState } from "react";
import { formatNumberForLocale, useLocale } from "@/lib/i18n";

interface AnimatedCounterProps {
  value: string;
  className?: string;
  duration?: number;
}

export function AnimatedCounter({ value, className = "", duration = 900 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [prevValue, setPrevValue] = useState<string>(value);
  const [displayValue, setDisplayValue] = useState<string>(value);
  const hasAnimatedRef = useRef(false);
  // Western digits drive the animation; Arabic pages display Arabic-Indic digits.
  const { locale } = useLocale();

  if (value !== prevValue) {
    setPrevValue(value);
    setDisplayValue(value);
  }

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (hasAnimatedRef.current) {
      setDisplayValue(value);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayValue(value);
      return;
    }

    // Parse prefix, number, suffix
    // Examples: "15,000+", "46,189+", "EGP 1.2T", "EGP 185B", "100+"
    const match = value.match(/^([^\d.]*)(\d+(?:,\d+)*(?:\.\d+)?)([^\d.]*)$/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const prefix = match[1] || "";
    const numStr = (match[2] || "0").replace(/,/g, "");
    const suffix = match[3] || "";
    const targetNum = parseFloat(numStr);
    const isFloat = numStr.includes(".");
    const decimalPlaces = isFloat ? (numStr.split(".")[1]?.length || 1) : 0;

    let rafId = 0;

    const runAnimation = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;

      const startTime = performance.now();

      const step = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic: 1 - (1 - p)^3
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = targetNum * easeOut;

        const formattedNum = isFloat
          ? current.toFixed(decimalPlaces)
          : Math.floor(current).toLocaleString("en-US");

        setDisplayValue(`${prefix}${formattedNum}${suffix}`);

        if (progress < 1) {
          rafId = requestAnimationFrame(step);
        } else {
          setDisplayValue(value);
        }
      };

      rafId = requestAnimationFrame(step);
    };

    // If already in (or above) the viewport on load/refresh, start immediately without waiting
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 80 && rect.bottom > 0) {
      runAnimation();
      return () => {
        if (rafId) cancelAnimationFrame(rafId);
      };
    }

    // Otherwise set initial 0 state while off-screen and trigger as soon as it nears the viewport
    setDisplayValue(`${prefix}0${suffix}`);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        runAnimation();
      },
      { threshold: 0.01, rootMargin: "0px 0px 120px 0px" }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {formatNumberForLocale(displayValue, locale)}
    </span>
  );
}
