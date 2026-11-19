# Where Everything Is — Complete Project Directory & Editing Map

This document is a quick-lookup map for finding and editing **any text, page, section, image, logo, PDF brochure, animation, form, email template, style rule, or server setting** on **Turnkey Show Alamein 2027** (`https://turnkeyshow.com`).

---

## 1. Global Event Details (Dates, Venue, Phones, Emails, Social Links & Sectors)

If you need to change the **event dates, venue name, email address, phone/WhatsApp numbers, social media URLs, or the 8 Core Sectors (in English or Arabic)** across the entire site at once:

- **File:** `src/config/event.ts`
  - **`EVENT_CONFIG` (Lines 6–47):**
    - Event name, edition (`2027`), dates (`06 – 09 May 2027`), venue, official email (`info@turnkeyshow.com`), live domain (`https://turnkeyshow.com`).
    - Social links (`facebook`, `linkedin`, `instagram`).
    - Organizer details (`Apex Conventions and Trade Fairs L.L.C`, phone `02 389 77 258`, mobile/WhatsApp `+2 010 17 57 57 57`, `+2 010 41 55 54 55`, email `info@apextradefairs.com`).
    - Special Decoration contractor details (`EXPO TECH`).
  - **`SHOW_SECTORS` (Lines 52–61):** The 8 official English exhibition sector names.
  - **`EVENT_TEXT` (Lines 68–92):** English (`en`) and Arabic (`ar`) display strings for the event name, dates, venue, and tagline.
  - **`SHOW_SECTORS_AR` (Lines 95–104):** The 8 official Arabic exhibition sector names.

---

## 2. Global Header, Menus, Footer & Page Hero Banner

All global layout elements shared across every page live in **one file**:

- **File:** `src/components/SiteLayout.tsx`
  - **Navigation Menu Items (EN & AR):** `NAV_ITEMS_BY_LOCALE` (Lines 31–110) — Controls all top menu links and dropdown items for both English and Arabic.
  - **Top Utility Strip (Dates, Venue, Email, Social Icons, EN/AR Switcher):** Lines 200–250.
  - **Header Red Scroll Progress Bar:** Line 194 (`.header-scroll-progress`).
  - **Main Sticky White Header Bar (Logo, Desktop Dropdown Menu, Book Space Button):** Lines 252–376.
  - **Mobile Accordion Drawer Menu:** Lines 378–473.
  - **Footer Top Dark Crown Bar (`"THE COAST’S COMPLETE PROPERTY SOLUTIONS PLATFORM"` + CTA Buttons):** `SiteFooter` (Lines 501–541).
  - **Footer Main Columns (Brand/Socials, Quick Links, Contact & Inquiries, "Organized By" Apex Card):** Lines 543–675.
  - **Subpage Top Hero Banner Component (`PageHero`):** Lines 714–775.

---

## 3. Every Animation & Interactive Effect (What It Is & Where It Is)

| Animation / Effect | Component File | CSS Styling File | Where It Appears on the Website |
| :--- | :--- | :--- | :--- |
| **1. Stats Count-Up Number Animation** (`0` → `13,000 SQM`, `120`, `8,000+`, `EGP 1.2T`, `EGP 185B`, `46,189+`, `15,000+`) | `src/components/Animation_StatsCountUp_HeroAndMarketNumbers.tsx` | `src/site.css` (`.info-strip-value`, `.market-stat-number`) | • **Homepage (`/`)** — Bottom bar inside the Hero (`13,000 SQM`, `120`, `8,000+`)<br>• **Homepage (`/`)** — *"The Market at a Glance"* section<br>• **About → Market Overview (`/about/market-overview`)** — Market indicators<br>• **Exhibit → Why Exhibit (`/exhibit/why-exhibit`)** — `15,000+` units card |
| **2. Infinite 8-Sectors Horizontal Ticker Ribbon** (Continuous scrolling sector strip with red chevrons) | `src/components/Animation_InfiniteSectorsTickerRibbon_HomeBelowAbout.tsx` | `src/site.css` (`.marquee-ribbon`, `@keyframes marqueeScroll` / `marqueeScrollRtl`, Lines 5525–5583) | • **Homepage (`/`)** — Full-width dark ticker ribbon directly below *"About the Expo"* and above *"Two Markets… One Opportunity"* |
| **3. 7-Step Property Demand Cycle Timeline Animation** (Sequential step-by-step highlight & progress track) | `src/components/Animation_PropertyDemandCycleTimeline_HomeAndMarketOverview.tsx` | `src/site.css` (`.dc-section`, `.dc-track`, `.dc-step`, Lines 5665–5820) | • **Homepage (`/`)** — *"The Market: The Cycle That Creates the Demand"*<br>• **About → Market Overview (`/about/market-overview`)** — *"The Cycle That Creates the Demand"* |
| **4. Scroll-Into-View Section Fade-Up & Red Accent Bar Expand (`Reveal`)** | `src/components/SiteLayout.tsx` (`Reveal`, Lines 680–712) | `src/site.css` (`.reveal`, `.section-red-bar`, Lines 5445–5465 & 7360–7425) | • **All 16 Pages (EN & AR)** — Wraps every section heading, red accent bar, card grid, image frame, and form card |
| **5. Sticky Header Bottom Red Scroll Progress Line** | `src/components/SiteLayout.tsx` (Line 194) | `src/site.css` (`.header-scroll-progress`, Lines 5585–5596) | • **Global Sticky Header** on all pages (scales `0% → 100%` as user scrolls; `z-index: 90` behind menus) |
| **6. Homepage Hero Background Slow Zoom & Floating Red Corner Chevron** | `src/routes/{-$locale}/index.tsx` (Lines 159–179) | `src/site.css` (`@keyframes heroZoom`, `@keyframes chevronPulseFloat`, Lines 1020–1085) | • **Homepage (`/`)** — Top full-screen Hero banner |
| **7. 8 Core Sector Cards Hover Expand & Red Top Bar Sweep** | `src/routes/{-$locale}/index.tsx` & `src/routes/{-$locale}/visit/exhibitor-profile.tsx` | `src/site.css` (`.sector-card`, `.sector-card::before`, Lines 5625–5660) | • **Homepage (`/`)** — *"Core Exhibition Sectors"* 8-card grid<br>• **Visit → Exhibitor Profile (`/visit/exhibitor-profile`)** — 8-card grid |

---

## 4. Every Image, Logo & PDF Brochure (Where the File Is & Where It Shows on the Site)

### A. Site Photos (`src/assets/`)

| File in `src/assets/` | What the Photo Shows | Exact Pages & Sections Where It Appears |
| :--- | :--- | :--- |
| `home-hero-and-exhibit-pages-banner-sector8-complete-solutions.webp` | Luxury furnished coastal villa interior | 1. **Homepage (`/`)** — Main full-screen Hero background<br>2. **Exhibit → Why Exhibit (`/exhibit/why-exhibit`)** — Top page hero banner<br>3. **Exhibit → Visitor Profile (`/exhibit/visitor-profile`)** — Top page hero banner<br>4. **Exhibit → Download Brochure (`/exhibit/download-brochure`)** — Top page hero banner<br>5. **Sector 8 Card (*Complete Integrated Solutions*)** — Homepage, About → Turnkey Show, and Visit → Exhibitor Profile |
| `home-about-expo-and-sector1-furniture-interiors.webp` | Contemporary coastal living room & furniture | 1. **Homepage (`/`)** — *"About the Expo"* right-hand framed photo (*"From Handover to Value"*)<br>2. **Sector 1 Card (*Furniture & Interior Furnishings*)** — Homepage, About → Turnkey Show, and Visit → Exhibitor Profile<br>3. **About → Turnkey Show (`/about/turnkey-show`)** — Top page hero banner<br>4. **Visit → Exhibitor Profile (`/visit/exhibitor-profile`)** — Top page hero banner |
| `sector2-kitchens-and-equipment-card.webp` | Warm modern kitchen & cabinetry | • **Sector 2 Card (*Kitchens & Equipment*)** — Homepage, About → Turnkey Show, and Visit → Exhibitor Profile |
| `sector3-home-appliances-card.webp` | Smoked-oak built-in kitchen appliance wall | • **Sector 3 Card (*Home Appliances*)** — Homepage, About → Turnkey Show, and Visit → Exhibitor Profile |
| `sector4-outdoor-living-and-about-concept-photo.webp` | Coastal sunset terrace & outdoor lounge | 1. **Sector 4 Card (*Outdoor Living*)** — Homepage, About → Turnkey Show, and Visit → Exhibitor Profile<br>2. **About → Turnkey Show (`/about/turnkey-show`)** — *"The Concept"* editorial section photo |
| `sector5-smart-unit-automation-card.webp` | Smart home automation control tablet in coastal room | • **Sector 5 Card (*Smart Unit Automation*)** — Homepage, About → Turnkey Show, and Visit → Exhibitor Profile |
| `sector6-modern-lighting-technology-card.webp` | Architectural ambient & modern interior lighting | • **Sector 6 Card (*Modern Lighting Technology*)** — Homepage, About → Turnkey Show, and Visit → Exhibitor Profile |
| `sector7-hospitality-fitout-and-market-services-banner.webp` | Luxury hotel & resort ocean-view lobby | 1. **Sector 7 Card (*Hospitality Fit-Out Solutions*)** — Homepage, About → Turnkey Show, and Visit → Exhibitor Profile<br>2. **About → Market Overview (`/about/market-overview`)** — Top page hero banner & intro section photo<br>3. **All 3 Services Pages (`/services/special-decoration`, `/services/freight-forwarding`, `/services/travel`)** — Top page hero banner |
| `home-two-markets-north-coast-section-photo.webp` | Oceanfront Mediterranean terrace (*"From Handover to Ready-to-Live"*) | • **Homepage (`/`)** — *"The North Coast Is Entering a New Era / Two Markets… One Opportunity"* left-hand section photo |
| `alamein-convention-center-venue-photo-and-book-space-banner.webp` | New Alamein International Convention & Exhibition Center exterior | 1. **Homepage (`/`)** — Bottom *"Exhibition Venue"* showcase photo<br>2. **About → Venue (`/about/venue`)** — Top page hero banner & venue feature photo<br>3. **Exhibit → Book Your Space (`/exhibit/book-your-space`)** — Top page hero banner |
| `visit-why-visit-and-visitor-registration-banner.webp` | Coastal chalet & pool lifestyle | • **Visit → Why Visit (`/visit/why-visit`)** & **Visit → Visitor Registration (`/visit/visitor-registration`)** — Top page hero banner |
| `contact-us-and-organizer-page-banner.webp` | New Alamein turquoise coastline & towers skyline | • **Contact Us (`/contact`)** & **About → The Organizer (`/about/organizer`)** — Top page hero banner |
| `default-subpage-hero-fallback-banner.webp` | Coastal view fallback banner | • `src/components/SiteLayout.tsx` (`PageHero`) — Default fallback hero image if a subpage does not pass an `image` prop |

### B. Logos & Icons (`src/assets/logos/` & `public/`)

| File Path | What It Is & Where It Is Used |
| :--- | :--- |
| `src/assets/logos/header-and-footer-turnkey-show-logo.png` | **Turnkey Show Alamein Logo** rendered in the Global Header & Global Footer (`SiteLayout.tsx`). |
| `src/assets/logos/footer-and-contact-organizer-apex-logo.png` | **Apex Conventions & Trade Fairs Transparent Logo** rendered in the Global Footer (*"Organized By"*), **About → The Organizer**, and **Contact Us** organizer side card. |
| `public/logos/turnkey-show-logo.png` & `public/logos/apex-logo.png` | Public logo copies embedded inline (`cid:turnkey-logo` & `cid:apex-logo`) into outgoing owner and visitor auto-reply emails. |
| `public/favicon.ico` & `public/turnkey-logo.png` | Browser tab favicon, Apple touch icon, and Open Graph share image (`og:image`). |

### C. Downloadable PDF Brochures (`public/`)

| File Path | What It Is & Where It Is Used |
| :--- | :--- |
| `public/Brochure Turnkey Show 2027.pdf` | **English Exhibitor Sales Brochure (PDF)** — Auto-downloaded and emailed on `/exhibit/download-brochure`. |
| `public/Brochure Turnkey Show Arabic 2027.pdf` | **Arabic Exhibitor Sales Brochure (PDF)** — Auto-downloaded and emailed on `/ar/exhibit/download-brochure`. |

---

## 5. Every Website Page (English & Arabic Content Files)

Every route file in `src/routes/{-$locale}/` contains **both** the English (`en`) and Arabic (`ar`) copy for that page:

| Page Name | URL (English / Arabic) | File to Edit |
| :--- | :--- | :--- |
| **Homepage** | `/` · `/ar` | `src/routes/{-$locale}/index.tsx` |
| **About → Turnkey Show** | `/about/turnkey-show` · `/ar/about/turnkey-show` | `src/routes/{-$locale}/about/turnkey-show.tsx` |
| **About → Market Overview** | `/about/market-overview` · `/ar/about/market-overview` | `src/routes/{-$locale}/about/market-overview.tsx` |
| **About → The Organizer** | `/about/organizer` · `/ar/about/organizer` | `src/routes/{-$locale}/about/organizer.tsx` |
| **About → The Venue** | `/about/venue` · `/ar/about/venue` | `src/routes/{-$locale}/about/venue.tsx` |
| **Exhibit → Why Exhibit** | `/exhibit/why-exhibit` · `/ar/exhibit/why-exhibit` | `src/routes/{-$locale}/exhibit/why-exhibit.tsx` |
| **Exhibit → Visitor Profile** | `/exhibit/visitor-profile` · `/ar/exhibit/visitor-profile` | `src/routes/{-$locale}/exhibit/visitor-profile.tsx` |
| **Exhibit → Book Your Space** | `/exhibit/book-your-space` · `/ar/exhibit/book-your-space` | `src/routes/{-$locale}/exhibit/book-your-space.tsx` |
| **Exhibit → Download Brochure** | `/exhibit/download-brochure` · `/ar/exhibit/download-brochure` | `src/routes/{-$locale}/exhibit/download-brochure.tsx` |
| **Visit → Exhibitor Profile** | `/visit/exhibitor-profile` · `/ar/visit/exhibitor-profile` | `src/routes/{-$locale}/visit/exhibitor-profile.tsx` |
| **Visit → Why Visit** | `/visit/why-visit` · `/ar/visit/why-visit` | `src/routes/{-$locale}/visit/why-visit.tsx` |
| **Visit → Visitor Registration** | `/visit/visitor-registration` · `/ar/visit/visitor-registration` | `src/routes/{-$locale}/visit/visitor-registration.tsx` |
| **Services → Special Decoration** | `/services/special-decoration` · `/ar/services/special-decoration` | `src/routes/{-$locale}/services/special-decoration.tsx` |
| **Services → Freight Forwarding** | `/services/freight-forwarding` · `/ar/services/freight-forwarding` | `src/routes/{-$locale}/services/freight-forwarding.tsx` |
| **Services → Travel & Accommodation** | `/services/travel` · `/ar/services/travel` | `src/routes/{-$locale}/services/travel.tsx` |
| **Contact Us** | `/contact` · `/ar/contact` | `src/routes/{-$locale}/contact.tsx` |
| **404 Not Found & HTML `<head>` SEO** | All routes | `src/routes/__root.tsx` |

---

## 6. Forms, Validation Modal & Email Templates

| What You Want to Edit | Exact File Path |
| :--- | :--- |
| **In-Website Form Validation Popup Modal (`showSiteAlert`, email/phone regex)** | `src/lib/formAlerts.ts` |
| **Live Production Email Handler & HTML Email Templates (cPanel PHP / SMTPS)** | `public/api/send-mail.php` |
| **Live Production Signed Brochure Download Handler (cPanel PHP)** | `public/api/brochure.php` |
| **PHPMailer & Shared PHP SMTP/Security Helpers** | `public/api/lib/bootstrap.php` & `public/api/lib/PHPMailer/` |
| **Production SMTP Password & Mail Config (Git-Ignored — Upload to cPanel `public_html/`)** | `mail-config.php` *(template in `mail-config.example.php`)* |
| **Local Dev Server Email Handler & Previews (Node / Vitest)** | `src/server/forms-handler.ts` & `src/server/brochure-handler.ts` |

---

## 7. CSS & Styling Files

| What You Want to Style | Exact File Path |
| :--- | :--- |
| **Master Site Stylesheet** (Header, Footer, Hero, Cards, Buttons, Sections, Responsive Breakpoints) | `src/site.css` |
| **Arabic RTL Overrides** (`html[dir="rtl"]` typography, spacing, flipped chevrons, RTL tables/forms) | `src/styles/rtl.css` |
| **Book Your Space & Visitor Registration Form Banner Styles** | `src/styles/book-your-space.css` |
| **Tailwind v4 Entry & CSS Imports** | `src/styles.css` |

---

## 8. Production Hosting, SEO & Build Config Files

| File Path | Purpose |
| :--- | :--- |
| `public/.htaccess` | Apache rules for `/home/turnkeyshow/public_html`: forces `https://turnkeyshow.com`, blocks `.env`/`mail-config.php`/`.git`, maps `/api/forms` → `/api/send-mail.php`, forces PDF attachment download, and handles SPA routing fallback. |
| `.cpanel.yml` | cPanel **Git™ Version Control** deployment tasks: copies `dist/client/*` and `dist/client/.htaccess` to `/home/turnkeyshow/public_html` while preserving `mail-config.php` and `.env`. |
| `vite.config.ts` | Vite bundler config + `cpanelInProcessPrerenderPlugin()` that prerenders all 32 EN/AR routes into `dist/client/<route>/index.html`, generates `dist/client/404.html`, and builds `sitemap.xml`. |
| `public/sitemap.xml` | Bilingual XML sitemap for `https://turnkeyshow.com` (regenerated automatically on every `npm run build`). |
| `public/robots.txt` | Search crawler rules pointing to `https://turnkeyshow.com/sitemap.xml`. |
| `dist/client/` | Compiled production folder ready for cPanel deployment. Always run `npm run build` after making code/asset edits so `dist/client/` is updated before committing. |

---

## 9. Every File Inside `public_html/assets/` on the Live cPanel Server

All random hash suffixes (`-BYZ3ur9d`, `-sHA9craO`, etc.) and cryptic names (`_-_locale_`) have been removed from the production build output. Every file inside `/home/turnkeyshow/public_html/assets/` (and `dist/client/assets/`) is named after its exact role on the website:

### A. Images & Logos in `public_html/assets/`
You can replace any of these `.webp` or `.png` files directly in cPanel File Manager (`public_html/assets/`) using the exact same filename:
- `home-hero-and-exhibit-pages-banner-sector8-complete-solutions.webp`
- `home-about-expo-and-sector1-furniture-interiors.webp`
- `home-two-markets-north-coast-section-photo.webp`
- `sector2-kitchens-and-equipment-card.webp`
- `sector3-home-appliances-card.webp`
- `sector4-outdoor-living-and-about-concept-photo.webp`
- `sector5-smart-unit-automation-card.webp`
- `sector6-modern-lighting-technology-card.webp`
- `sector7-hospitality-fitout-and-market-services-banner.webp`
- `alamein-convention-center-venue-photo-and-book-space-banner.webp`
- `visit-why-visit-and-visitor-registration-banner.webp`
- `contact-us-and-organizer-page-banner.webp`
- `default-subpage-hero-fallback-banner.webp`
- `header-and-footer-turnkey-show-logo.png`
- `footer-and-contact-organizer-apex-logo.png`

### B. Stylesheet in `public_html/assets/`
- `site-master-styles.css` — Compiled master CSS stylesheet (`src/site.css` + `src/styles/rtl.css` + `src/styles/book-your-space.css`).

### C. Page, Animation & Layout Scripts in `public_html/assets/`
- `page-homepage.js` — Homepage (`/`, `/ar`) + Infinite 8-Sectors Ticker Ribbon animation
- `page-about-turnkey-show.js` — About → Turnkey Show (`/about/turnkey-show`)
- `page-about-market-overview.js` — About → Market Overview (`/about/market-overview`)
- `page-about-organizer.js` — About → The Organizer (`/about/organizer`)
- `page-about-venue.js` — About → The Venue (`/about/venue`)
- `page-exhibit-why-exhibit.js` — Exhibit → Why Exhibit (`/exhibit/why-exhibit`)
- `page-exhibit-visitor-profile.js` — Exhibit → Visitor Profile (`/exhibit/visitor-profile`)
- `page-exhibit-book-your-space-form.js` — Exhibit → Book Your Space form (`/exhibit/book-your-space`)
- `page-exhibit-download-brochure-form.js` — Exhibit → Download Brochure form (`/exhibit/download-brochure`)
- `page-visit-exhibitor-profile.js` — Visit → Exhibitor Profile (`/visit/exhibitor-profile`)
- `page-visit-why-visit.js` — Visit → Why Visit (`/visit/why-visit`)
- `page-visit-visitor-registration-form.js` — Visit → Visitor Registration form (`/visit/visitor-registration`)
- `page-services-special-decoration.js` — Services → Special Decoration (`/services/special-decoration`)
- `page-services-freight-forwarding.js` — Services → Freight Forwarding (`/services/freight-forwarding`)
- `page-services-travel-and-accommodation.js` — Services → Travel & Accommodation (`/services/travel`)
- `page-contact-us-form.js` — Contact Us form (`/contact`)
- `animation-stats-count-up-numbers.js` — Animated number counter (`13,000 SQM`, `120`, `8,000+`, `1.2T`, `185B`, `46,189+`)
- `layout-global-header-footer-and-scroll-reveal-animation.js` — Global Header, Footer, PageHero, and Scroll Fade-Up Reveal animation
- `form-validation-popup-alert-modal.js` — In-website form validation popup alert modal (`showSiteAlert`)
- `app-main-client-entry.js` — React & TanStack Router core runtime

