import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: string;
  className?: string;
  duration?: number;
}

export function AnimatedCounter({ value, className = "", duration = 1800 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState<string>("0");
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || hasAnimated) return;
        setHasAnimated(true);
        observer.disconnect();

        const startTime = performance.now();

        const step = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic: 1 - (1 - p)^3
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const current = targetNum * easeOut;

          let formattedNum = "";
          if (isFloat) {
            formattedNum = current.toFixed(decimalPlaces);
          } else {
            formattedNum = Math.floor(current).toLocaleString("en-US");
          }

          setDisplayValue(`${prefix}${formattedNum}${suffix}`);

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            setDisplayValue(value);
          }
        };

        requestAnimationFrame(step);
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  );
}

