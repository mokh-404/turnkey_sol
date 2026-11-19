# Turnkey Show Alamein 2027 — Assets & Animations Map (What & Where on the Site)

Every image file in `src/assets/` and every animation component in `src/components/` is named so you can immediately tell **what it is** and **which page/section of the site it appears on**.

---

## 1. Site Animations (`src/components/` & `src/site.css`)

| File / CSS Selector | Animation Name & Type | Exact Location on the Website |
| :--- | :--- | :--- |
| `src/components/Animation_StatsCountUp_HeroAndMarketNumbers.tsx` | **Stats Count-Up Number Animation (`AnimatedCounter`)** — Smoothly counts numbers up from `0` to target value (e.g. `13,000 SQM`, `120`, `8,000+`, `EGP 1.2T`, `EGP 185B`, `46,189+`, `15,000+`) using cubic ease-out when scrolled into view, automatically converting to Arabic-Indic digits (`٠-٩`) on `/ar/...` pages. | 1. **Homepage Hero Bottom Bar** (`13,000 SQM`, `120` brands, `8,000+` visitors)<br>2. **Homepage "The Market at a Glance"** section<br>3. **About → Market Overview** (`/about/market-overview`) bottom stats cards<br>4. **Exhibit → Why Exhibit** (`/exhibit/why-exhibit`) `15,000+` units card |
| `src/components/Animation_InfiniteSectorsTickerRibbon_HomeBelowAbout.tsx` | **Infinite 8-Sectors Horizontal Ticker Ribbon Animation (`MarqueeRibbon`)** — Continuous seamless horizontal loop scrolling the 8 Core Exhibition Sectors with red chevron separators (`marqueeScroll` / `marqueeScrollRtl` in `src/site.css`). | **Homepage (`/`)** — Full-width dark ribbon directly below the *"About the Expo"* section and above *"Two Markets… One Opportunity"*. |
| `src/components/Animation_PropertyDemandCycleTimeline_HomeAndMarketOverview.tsx` | **7-Step Coastal Property Demand Cycle Timeline Animation (`DemandCycle`)** — Sequential step-by-step highlight and connecting progress track animation across the 7 lifecycle stages (*Project Launch → Construction → Unit Handover → Furnishing & Fit-Out → Operation & Rental → Continuous Upgrade → Complete Readiness*). | **Homepage (`/`)** & **About → Market Overview (`/about/market-overview`)** — *"The Market: The Cycle That Creates the Demand"* section. |
| `src/components/SiteLayout.tsx` (`Reveal` component) | **Scroll-Into-View Section Fade-Up & Red Accent Bar Scale Animation (`Reveal`)** — Uses `IntersectionObserver` to fade/slide content blocks up (`translateY(18px) -> 0`) and animate the red section bar (`.section-red-bar` `scaleX(0) -> scaleX(1)`) as the visitor scrolls down any page. | **All 16 Pages (EN & AR)** — Wraps every section heading, card grid, editorial photo, and form card across the entire site. |
| `src/components/SiteLayout.tsx` (`.header-scroll-progress`) | **Header Bottom Red Scroll Progress Bar Animation** — 3px red progress line anchored along the bottom edge of the sticky white header that scales from `0%` to `100%` (`scaleX`) as the user scrolls down the page. | **Global Sticky Header** on all pages (`z-index: 90`, positioned behind desktop dropdown menus and mobile drawer). |
| `src/site.css` (`.hero-bg-img.hero-zoom` & `.hero-corner-chevron`) | **Homepage Hero Slow Ken-Burns Background Zoom & Floating Red Corner Chevron Animation** — Subtle zoom-in on the hero background image (`heroZoom`) paired with a floating/pulsing red chevron (`chevronPulseFloat`) in the top corner of the hero. | **Homepage (`/`) Main Hero Banner**. |

---

## 2. Image Assets (`src/assets/`)

All unused duplicate images have been removed. Every file in `src/assets/` is actively rendered on the site:

| Filename in `src/assets/` | Visual Content | Exact Page(s) & Section(s) Where It Is Used |
| :--- | :--- | :--- |
| `home-hero-and-exhibit-pages-banner-sector8-complete-solutions.webp` | Luxury furnished coastal villa interior | 1. **Homepage (`/`)** — Main full-screen Hero background<br>2. **Exhibit → Why Exhibit (`/exhibit/why-exhibit`)** — Top page hero banner<br>3. **Exhibit → Visitor Profile (`/exhibit/visitor-profile`)** — Top page hero banner<br>4. **Exhibit → Download Brochure (`/exhibit/download-brochure`)** — Top page hero banner<br>5. **Sector 8 Card (*Complete Integrated Solutions*)** — Homepage, About → Turnkey Show, and Visit → Exhibitor Profile |
| `home-about-expo-and-sector1-furniture-interiors.webp` | Contemporary coastal living room & furniture | 1. **Homepage (`/`)** — *"About the Expo"* right-hand framed photo (*"From Handover to Value"*)<br>2. **Sector 1 Card (*Furniture & Interior Furnishings*)** — Homepage, About → Turnkey Show, and Visit → Exhibitor Profile<br>3. **About → Turnkey Show (`/about/turnkey-show`)** — Top page hero banner<br>4. **Visit → Exhibitor Profile (`/visit/exhibitor-profile`)** — Top page hero banner |
| `sector2-kitchens-and-equipment-card.webp` | Warm modern kitchen & cabinetry | **Sector 2 Card (*Kitchens & Equipment*)** — Homepage, About → Turnkey Show, and Visit → Exhibitor Profile |
| `sector3-home-appliances-card.webp` | Smoked-oak built-in kitchen appliance wall | **Sector 3 Card (*Home Appliances*)** — Homepage, About → Turnkey Show, and Visit → Exhibitor Profile |
| `sector4-outdoor-living-and-about-concept-photo.webp` | Coastal sunset terrace & outdoor lounge | 1. **Sector 4 Card (*Outdoor Living*)** — Homepage, About → Turnkey Show, and Visit → Exhibitor Profile<br>2. **About → Turnkey Show (`/about/turnkey-show`)** — *"The Concept"* editorial section photo |
| `sector5-smart-unit-automation-card.webp` | Smart home automation control tablet in coastal room | **Sector 5 Card (*Smart Unit Automation*)** — Homepage, About → Turnkey Show, and Visit → Exhibitor Profile |
| `sector6-modern-lighting-technology-card.webp` | Architectural ambient & modern interior lighting | **Sector 6 Card (*Modern Lighting Technology*)** — Homepage, About → Turnkey Show, and Visit → Exhibitor Profile |
| `sector7-hospitality-fitout-and-market-services-banner.webp` | Luxury hotel & resort ocean-view lobby | 1. **Sector 7 Card (*Hospitality Fit-Out Solutions*)** — Homepage, About → Turnkey Show, and Visit → Exhibitor Profile<br>2. **About → Market Overview (`/about/market-overview`)** — Top page hero banner & intro section photo<br>3. **All 3 Services Pages (`/services/special-decoration`, `/services/freight-forwarding`, `/services/travel`)** — Top page hero banner |
| `home-two-markets-north-coast-section-photo.webp` | Oceanfront Mediterranean terrace (*"From Handover to Ready-to-Live"*) | **Homepage (`/`)** — *"The North Coast Is Entering a New Era / Two Markets… One Opportunity"* left-hand section photo |
| `alamein-convention-center-venue-photo-and-book-space-banner.webp` | New Alamein International Convention & Exhibition Center exterior | 1. **Homepage (`/`)** — Bottom *"Exhibition Venue"* showcase photo<br>2. **About → Venue (`/about/venue`)** — Top page hero banner & venue feature photo<br>3. **Exhibit → Book Your Space (`/exhibit/book-your-space`)** — Top page hero banner |
| `visit-why-visit-and-visitor-registration-banner.webp` | Coastal chalet & pool lifestyle | **Visit → Why Visit (`/visit/why-visit`)** & **Visit → Visitor Registration (`/visit/visitor-registration`)** — Top page hero banner |
| `contact-us-and-organizer-page-banner.webp` | New Alamein turquoise coastline & towers skyline | **Contact Us (`/contact`)** & **About → The Organizer (`/about/organizer`)** — Top page hero banner |
| `default-subpage-hero-fallback-banner.webp` | Coastal view fallback banner | `SiteLayout.tsx` (`PageHero`) — Default fallback hero image if a subpage does not specify an `image` prop |
| `logos/header-and-footer-turnkey-show-logo.png` | Official Turnkey Show Alamein logo | **Global Header & Footer** brand logo across all pages |
| `logos/footer-and-contact-organizer-apex-logo.png` | Official transparent Apex Conventions & Trade Fairs logo | **Global Footer (*"Organized By"* card)**, **About → The Organizer (`/about/organizer`)**, and **Contact Us (`/contact`)** organizer card |
| `logos/expotech-logo.png` | Official EXPO TECH logo | Official Stand Contractor asset |
