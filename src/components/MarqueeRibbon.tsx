import React from "react";

const SECTORS = [
  "Furniture",
  "Appliances",
  "Outdoor",
  "Smart Home",
  "Hospitality Fit-Out",
  "Complete Solutions",
];

export function MarqueeRibbon() {
  return (
    <div className="marquee-ribbon-container" role="region" aria-label="Core Exhibition Sectors">
      <div className="marquee-ribbon-track">
        {/* Repeating the sectors 4 times ensures seamless infinite CSS scroll across ultrawide monitors */}
        {[...SECTORS, ...SECTORS, ...SECTORS, ...SECTORS].map((sector, idx) => (
          <span key={`${sector}-${idx}`} className="marquee-item">
            <span className="marquee-label">{sector}</span>
            <span className="marquee-chevron" aria-hidden="true">&gt;</span>
          </span>
        ))}
      </div>
    </div>
  );
}

