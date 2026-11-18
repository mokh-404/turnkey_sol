# Turnkey Show Alamein 2027 — Official Website Repository

**The Coast's Complete Property Solutions Platform**  
- **Live Domain:** [https://turnkeyshow.com](https://turnkeyshow.com) (`EN` at `/` · `AR` at `/ar`)  
- **Event Dates:** 06 – 09 May 2027 (`٦ - ٩ مايو ٢٠٢٧`)  
- **Venue:** New Alamein International Convention & Exhibition Center — Arab Republic of Egypt  
- **Organizer:** Apex Conventions and Trade Fairs L.L.C  
  - **Phone:** `02 389 77 258`  
  - **Mobile / WhatsApp:** `+2 010 17 57 57 57` · `+2 010 41 55 54 55`  
  - **Emails:** `info@turnkeyshow.com` · `info@apextradefairs.com`

Turnkey Show Alamein connects property owners, investors, developers, and hospitality operators with leading brands and solution providers across furniture, interior furnishings, kitchens, home appliances, outdoor living, modern lighting, hospitality fit-out, and smart unit automation.

---

## Table of Contents

1. [Tech Stack & Architecture](#1-tech-stack--architecture)
2. [Bilingual (EN / AR) Route & Permalink Structure](#2-bilingual-en--ar-route--permalink-structure)
3. [Repository Structure](#3-repository-structure)
4. [Forms, Brochure Auto-Download & SMTP Email System](#4-forms-brochure-auto-download--smtp-email-system)
5. [SEO, Sitemap & Apache `.htaccess` Configuration](#5-seo-sitemap--apache-htaccess-configuration)
6. [cPanel Production Deployment Guide (No SSH Required)](#6-cpanel-production-deployment-guide-no-ssh-required)
7. [Local Development, Testing & Production Build](#7-local-development-testing--production-build)

---

## 1. Tech Stack & Architecture

- **Frontend & Routing:** [React 19](https://react.dev/) + [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router) (`src/routes/{-$locale}/...`)
- **Build System & Static Prerendering:** [Vite 8](https://vite.dev/) with a custom in-process static prerender plugin (`cpanelInProcessPrerenderPlugin` in `vite.config.ts`) that renders all **32 English & Arabic routes** + `404.html` + `sitemap.xml` directly into `dist/client/<route>/index.html` at build time so every page is a real static permalink on Apache/cPanel without requiring a Node.js server in production.
- **Styling & Design System:** Tailwind CSS v4 + Master Brand Stylesheet (`src/site.css`) + RTL Overrides (`src/styles/rtl.css`) + Book Your Space Styles (`src/styles/book-your-space.css`).
  - **Typography:** `Archivo Black` & `League Spartan` (English) + `Noto Kufi Arabic` (Arabic, with Arabic-Indic numerals `٠١٢٣٤٥٦٧٨٩`).
  - **Brand Palette:** 55% Architectural Black (`#080808`) · 30% Pure White (`#FFFFFF`) · 15% Turnkey Red (`#E92824` / `#E92924`).
- **Production Backend (cPanel Shared Hosting):** Self-contained PHP 8 endpoints (`public/api/send-mail.php` and `public/api/brochure.php`) bundled with **PHPMailer v6.10.0** (`public/api/lib/PHPMailer/`) so authenticated SMTPS (`mail.turnkeyshow.com:465`) works out of the box without SSH or `composer install`.
- **Local Dev Backend:** Node SSR middleware (`src/server.ts`, `src/server/forms-handler.ts`, `src/server/brochure-handler.ts`) that intercepts `/api/send-mail.php`, `/api/forms`, `/api/brochure.php`, and `/api/brochure` during `npm run dev` and `npm test`, saving HTML/text email previews to `.mail-preview/`.

---

## 2. Bilingual (EN / AR) Route & Permalink Structure

Every page route lives under `src/routes/{-$locale}/` and is prerendered at build time into both an English permalink (`/<path>/index.html`) and an Arabic RTL permalink (`/ar/<path>/index.html`):

| English Permalink | Arabic Permalink | Source File | Description |
| :--- | :--- | :--- | :--- |
| `/` | `/ar` | `src/routes/{-$locale}/index.tsx` | **Homepage:** Full-bleed coastal hero, animated counters (`13,000 SQM`, `120` brands, `8,000+` visitors), *About the Expo*, infinite *Marquee Ribbon*, *Market Overview*, *Two Markets… One Opportunity*, *Demand Cycle*, *8 Core Sectors*, *Venue*, and *Organized By* showcase. |
| `/about/turnkey-show` | `/ar/about/turnkey-show` | `src/routes/{-$locale}/about/turnkey-show.tsx` | **About Turnkey Show:** Platform overview, concept, show promise, vision, opportunity, 8 core sectors, and market signals. |
| `/about/market-overview` | `/ar/about/market-overview` | `src/routes/{-$locale}/about/market-overview.tsx` | **Market Overview:** North Coast & New Alamein transformation, *Two Markets… One Opportunity* supply analysis, and animated market indicators (`EGP 1.2T`, `EGP 185B`, `46,189+` units). |
| `/about/organizer` | `/ar/about/organizer` | `src/routes/{-$locale}/about/organizer.tsx` | **The Organizer:** Profile and direct contact details for **Apex Conventions and Trade Fairs L.L.C**. |
| `/about/venue` | `/ar/about/venue` | `src/routes/{-$locale}/about/venue.tsx` | **The Venue:** New Alamein International Convention & Exhibition Center specifications, location, and Google Maps link. |
| `/exhibit/why-exhibit` | `/ar/exhibit/why-exhibit` | `src/routes/{-$locale}/exhibit/why-exhibit.tsx` | **Why Exhibit:** `15,000+` unit delivery pipeline, exhibitor value proposition, and key advantages. |
| `/exhibit/visitor-profile` | `/ar/exhibit/visitor-profile` | `src/routes/{-$locale}/exhibit/visitor-profile.tsx` | **Visitor Profile:** Target buyer categories (property owners, developers, hospitality operators, architects, contractors). |
| `/exhibit/book-your-space` | `/ar/exhibit/book-your-space` | `src/routes/{-$locale}/exhibit/book-your-space.tsx` | **Book Your Space:** Two-section exhibitor space application form (*Exhibitor Information* + *Exhibitor Profile & Stand Requirements*). |
| `/exhibit/download-brochure` | `/ar/exhibit/download-brochure` | `src/routes/{-$locale}/exhibit/download-brochure.tsx` | **Download Brochure:** Sales brochure request form with instant automatic PDF download (English or Arabic PDF), persistent download button, and emailed PDF attachment. |
| `/visit/exhibitor-profile` | `/ar/visit/exhibitor-profile` | `src/routes/{-$locale}/visit/exhibitor-profile.tsx` | **Exhibitor Profile:** Interactive 8-sector showcase cards. |
| `/visit/why-visit` | `/ar/visit/why-visit` | `src/routes/{-$locale}/visit/why-visit.tsx` | **Why Visit:** Visitor benefits and quick links to registration and exhibitor categories. |
| `/visit/visitor-registration` | `/ar/visit/visitor-registration` | `src/routes/{-$locale}/visit/visitor-registration.tsx` | **Visitor Registration:** Online visitor pre-registration form for free entry badge. |
| `/services/special-decoration` | `/ar/services/special-decoration` | `src/routes/{-$locale}/services/special-decoration.tsx` | **Special Decoration:** Official stand contractor (**EXPO TECH**) profile and contacts. |
| `/services/freight-forwarding` | `/ar/services/freight-forwarding` | `src/routes/{-$locale}/services/freight-forwarding.tsx` | **Freight Forwarding:** Official logistics and customs clearance partner page. |
| `/services/travel` | `/ar/services/travel` | `src/routes/{-$locale}/services/travel.tsx` | **Travel & Accommodation:** Hotel rates, transfers, and travel support page. |
| `/contact` | `/ar/contact` | `src/routes/{-$locale}/contact.tsx` | **Contact Us:** Direct organizer contact card side-by-side with the General Inquiry form. |

### Section Index Redirects (Client + `.htaccess` 301 Redirects)
- `/about` → `/about/turnkey-show` (`/ar/about` → `/ar/about/turnkey-show`)
- `/exhibit` → `/exhibit/why-exhibit` (`/ar/exhibit` → `/ar/exhibit/why-exhibit`)
- `/visit` → `/visit/exhibitor-profile` (`/ar/visit` → `/ar/visit/exhibitor-profile`)
- `/services` → `/services/special-decoration` (`/ar/services` → `/ar/services/special-decoration`)

---

## 3. Repository Structure

```text
red-thread-visitor-guide/
├── .cpanel.yml                       # cPanel Git™ Version Control deployment tasks
├── .env.example                      # Safe template for local Node dev environment variables
├── .gitignore                        # Ignores mail-config.php, .env, node_modules, dist/server (tracks dist/client)
├── mail-config.example.php           # Safe committed template for cPanel PHP SMTP config
├── mail-config.php                   # GIT-IGNORED real cPanel SMTP config (upload via File Manager)
├── package.json                      # Scripts & dependencies
├── vite.config.ts                    # Vite config + 32-route in-process static prerender & sitemap plugin
├── vitest.config.ts                  # Vitest test runner config
├── public/                           # Static files copied verbatim to dist/client/
│   ├── .htaccess                     # Apache HTTPS enforcement, security blocks, API rewrites, SPA fallback
│   ├── Brochure Turnkey Show 2027.pdf
│   ├── Brochure Turnkey Show Arabic 2027.pdf
│   ├── favicon.ico
│   ├── logo.png
│   ├── robots.txt
│   ├── site.webmanifest
│   ├── sitemap.xml
│   ├── turnkey-logo.png
│   ├── logos/                        # Official Turnkey Show, Apex, and ExpoTech logos
│   └── api/                          # Production cPanel PHP backend
│       ├── send-mail.php             # Form handler + SMTPS email dispatcher
│       ├── brochure.php              # HMAC-SHA256 signed PDF brochure download endpoint
│       └── lib/
│           ├── bootstrap.php         # Config loader, sanitizers, rate limiter, PHPMailer factory
│           └── PHPMailer/            # Bundled PHPMailer v6.10.0 (PHPMailer.php, SMTP.php, Exception.php)
├── src/
│   ├── assets/                       # Optimized .webp & .png images bundled by Vite into dist/client/assets/
│   ├── components/                   # SiteLayout (Header/Footer), AnimatedCounter, DemandCycle, MarqueeRibbon, UI kit
│   ├── config/event.ts               # Single source of truth for event dates, venue, emails, phones, sectors (EN/AR)
│   ├── lib/
│   │   ├── i18n.tsx                  # Locale detection, LocaleLink, Arabic-Indic digit conversion
│   │   └── formAlerts.ts             # Branded in-website validation popup modal (showSiteAlert)
│   ├── routes/                       # File-based TanStack Router routes (__root.tsx + {-$locale}/*)
│   ├── server/                       # Local Node dev & Vitest handlers (forms-handler.ts, brochure-handler.ts)
│   ├── styles/                       # rtl.css & book-your-space.css
│   ├── site.css                      # Master stylesheet
│   └── test/                         # Vitest unit & routing test suites (46 tests)
└── dist/
    └── client/                       # Tracked production build output deployed to /home/turnkeyshow/public_html
```

---

## 4. Forms, Brochure Auto-Download & SMTP Email System

### The 4 Website Forms
All 4 forms use in-website modal validation (`src/lib/formAlerts.ts`) and `POST` JSON to `/api/send-mail.php` with `locale: "en" | "ar"`:
1. **Book Your Space** (`form_key: "exhibitor_booking"`) — `/exhibit/book-your-space` & `/ar/exhibit/book-your-space`
2. **Download Brochure** (`form_key: "exhibitor_brochure"`) — `/exhibit/download-brochure` & `/ar/exhibit/download-brochure`
3. **Visitor Registration** (`form_key: "visitor_registration"`) — `/visit/visitor-registration` & `/ar/visit/visitor-registration`
4. **Contact Us** (`form_key: "general_inquiry"`) — `/contact` & `/ar/contact`

### Emails Dispatched on Every Form Submission
1. **Owner Notification Email → `info@turnkeyshow.com`:**
   - **Subject:** `[Turnkey Show 2027] <Category> — <Company/Visitor Name>`
   - **Headers:** `From: "Turnkey Show Alamein" <info@turnkeyshow.com>` and `Reply-To: <visitor's submitted email>` (ensuring SPF, DKIM, and DMARC alignment).
   - **Body:** Displays the clean form title (`Book Your Space (Exhibitor Application Form)`, `Download Brochure (Sales Brochure Request Form)`, `Visitor Registration (Visitor Entry Badge Form)`, or `Contact Us (General Inquiry Form)`), submission language (`English (EN)` or `Arabic (AR)`), source page path, Cairo timestamp (`Africa/Cairo`), client IP, and all submitted fields grouped into sections.
2. **Visitor Auto-Reply Email → Visitor's Email Address:**
   - Styled after `Registration (updated).docx` with embedded Turnkey Show and Apex logos (`cid:turnkey-logo` and `cid:apex-logo`), bold red recipient name and generated reference number (`TKS1000`–`TKS9999`), form-specific confirmation text, and a full summary table of submitted fields.
   - **Language-Matched:**
     - **English form submissions (`locale: "en"`)** receive an **English-only (`lang="en" dir="ltr"`)** auto-reply (and attach `Brochure Turnkey Show 2027.pdf` for brochure requests).
     - **Arabic form submissions (`locale: "ar"`)** receive an **Arabic-only (`lang="ar" dir="rtl"`)** auto-reply with Arabic subject, Arabic greeting, Arabic body, and Arabic section/field labels (and attach `Brochure Turnkey Show Arabic 2027.pdf` for brochure requests).

### Automatic Brochure Download Behavior
When a visitor submits `/exhibit/download-brochure` (or `/ar/exhibit/download-brochure`):
- `public/api/send-mail.php` sends the owner notification email first and immediately flushes the HTTP `200` JSON response (`fastcgi_finish_request()` / `flush()`) before uploading the 2.4 MB PDF attachment in the visitor auto-reply email.
- The frontend immediately triggers an automatic browser file download of `Brochure Turnkey Show 2027.pdf` (on English) or `Brochure Turnkey Show Arabic 2027.pdf` (on Arabic), while keeping the **"Download brochure" / "حمّل البروشور"** button visible on the confirmation screen.

---

## 5. SEO, Sitemap & Apache `.htaccess` Configuration

- **Canonical & `hreflang` Tags (`src/routes/__root.tsx`):** Every page renders its exact `<link rel="canonical" href="https://turnkeyshow.com/...">`, `<meta property="og:url">`, `<meta property="og:image" content="https://turnkeyshow.com/turnkey-logo.png">`, and `hreflang="en"`, `hreflang="ar"`, and `hreflang="x-default"` alternate links.
- **XML Sitemap (`public/sitemap.xml`):** Auto-generated on every `npm run build` with all 32 English and Arabic URLs and `xhtml:link` alternates.
- **Apache `.htaccess` (`public/.htaccess`):**
  - Enforces `https://turnkeyshow.com` (301 redirect from HTTP and `www.turnkeyshow.com`).
  - Blocks direct browser access (`403 Forbidden`) to `.env*`, `.git*`, `.cpanel.yml`, `mail-config.php`, `mail-config.example.php`, and `/api/lib/`.
  - Maps `/api/forms` → `/api/send-mail.php` and `/api/brochure` → `/api/brochure.php`.
  - Sets `Content-Disposition: attachment` on `.pdf` files for direct downloads.
  - Serves prerendered `<route>/index.html` directories cleanly and falls back to `/index.html` for client-side routing while excluding `/api/` and `.php`.

---

## 6. cPanel Production Deployment Guide (No SSH Required)

### Server Details
- **Domain:** `https://turnkeyshow.com`
- **cPanel Username:** `turnkeyshow`
- **Document Root:** `/home/turnkeyshow/public_html`
- **Git Repository Path on Server:** `/home/turnkeyshow/repositories/turnkey_solution`
- **Server IP:** `209.42.31.214`

### One-Time Setup: Upload `mail-config.php`
Because `mail-config.php` contains the live SMTP password, it is git-ignored. Upload your local `mail-config.php` via **cPanel → File Manager** to either:
- `/home/turnkeyshow/public_html/mail-config.php` *(protected by `.htaccess` and `TK_MAIL_CONFIG` check)*, **or**
- `/home/turnkeyshow/mail-config.php` *(one level above `public_html`)*.

**SMTP Settings Used in `mail-config.php`:**
- **SMTP Host:** `mail.turnkeyshow.com`
- **SMTP Port:** `465`
- **Encryption:** `ssl` (SMTPS)
- **Username / From / To:** `info@turnkeyshow.com`

### Deploying Updates via cPanel Git™ Version Control
1. Locally, after making any code or style changes, run:
   ```bash
   npm run build
   ```
   *(This rebuilds `dist/client/` with all 32 prerendered pages, hashed images/CSS/JS, `.htaccess`, and `api/`.)*
2. Commit and push to GitHub (`origin/main`).
3. In **cPanel → Git™ Version Control** → **Manage** (`repositories/turnkey_solution`) → **Pull or Deploy**:
   - Click **Update from Remote**
   - Click **Deploy HEAD Commit**
   - `.cpanel.yml` automatically backs up `mail-config.php` and `.env`, copies `dist/client/*` and `dist/client/.htaccess` into `/home/turnkeyshow/public_html`, and restores `mail-config.php` and `.env`.

---

## 7. Local Development, Testing & Production Build

All commands are run inside the `red-thread-visitor-guide/` directory:

```bash
# 1. Install dependencies
npm install

# 2. Start local development server (http://localhost:8080)
npm run dev

# 3. Type-check with TypeScript
npx tsc --noEmit -p .

# 4. Run ESLint / Prettier
npm run lint
npm run format

# 5. Run Vitest unit & routing tests (46 tests)
npm test

# 6. Build static production output into dist/client/
npm run build
```
