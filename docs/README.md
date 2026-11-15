# Turnkey Show Alamein 2027

**The Coast's Complete Property Solutions Platform**  
**Dates:** 06 – 09 May 2027  
**Venue:** New Alamein International Convention and Exhibition Center  
**Organizer:** Apex Conventions and Trade Fairs L.L.C (`+20 10 1777 5757 – +20 1041555455` | `02 389 77 258` | `info@apextradefairs.com`)

Turnkey Show Alamein connects property owners, investors, developers, and hospitality operators with leading brands and solution providers across furniture, fit-out, kitchens, home appliances, outdoor living, modern lighting, and smart unit automation.

---

## 1. Tech Stack & Architecture

- **Framework:** [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router) (file-based SSR & client routing)
- **Bundler & Dev Server:** Vite 8 + Nitro Server
- **UI & Styling:** React 19, TypeScript, Tailwind CSS v4 + Master Brand Stylesheet (`src/site.css`) built strictly to **TURN KEY Guideline 2026**
- **Typography & Palette:** `League Spartan` & `Archivo Black` (Latin) + `Noto Kufi Arabic` (Arabic), using the 55% Black (`#080808`) / 30% White (`#FFFFFF`) / 15% Brand Red (`#E92924`) architectural palette
- **Email & Forms Backend:** Custom SSR API routes (`/api/forms` and `/api/brochure`) powered by `nodemailer` (SMTP / Gmail / Custom SMTP), Resend API support, and HMAC-SHA256 signed brochure download tokens

---

## 2. Website Pages & Route Structure

All public routes live in `src/routes/` and share the global header, mobile accordion drawer, and architectural white footer in `src/components/SiteLayout.tsx`:

| Route | File | Description |
| :--- | :--- | :--- |
| `/` | `src/routes/index.tsx` | **Homepage:** Full-bleed coastal hero with animated counters (`13,000 sqm`, `120` brands, `8,000+` visitors), *About the Expo* with primary CTA buttons, infinite *Marquee Ribbon*, *Market Overview* (*The North Coast Is Entering a New Era*), bottom-aligned *Two Markets… One Opportunity* cards, *Core Sectors* showcase, *The Concept* ecosystem overview, *Venue* highlight, and the *Supported By* banner featuring the transparent Apex logo. |
| `/about/turnkey-show` | `src/routes/about/turnkey-show.tsx` | **About the Show:** Platform overview, concept, show promise, vision, opportunity, 8 core sectors, and *Why Now* market signals. |
| `/about/market-overview` | `src/routes/about/market-overview.tsx` | **Market Overview:** North Coast & New Alamein growth analysis, bottom-aligned *Two Markets… One Opportunity* supply cards, and *The Market at a Glance* animated indicators (`EGP 1.2T`, `EGP 185B`, `46,189+` units). |
| `/about/venue` | `src/routes/about/venue.tsx` | **Venue:** New Alamein International Convention and Exhibition Center overview, Google Maps link, and 4 key facility feature blocks. |
| `/about/organizer` | `src/routes/about/organizer.tsx` | **Organizer:** Centered profile for **Apex Conventions and Trade Fairs L.L.C** with the transparent Apex logo (`apex-logo-no-bg.png`) positioned above the centered company bio and contact details. |
| `/exhibit/why-exhibit` | `src/routes/exhibit/why-exhibit.tsx` | **Why Exhibit:** `15,000+` unit delivery pipeline highlight, exhibitor value proposition, and standardized action buttons. |
| `/exhibit/visitor-profile` | `src/routes/exhibit/visitor-profile.tsx` | **Visitor Profile:** Target buyer & decision-maker categories, with the primary CTA redirecting to `/visit/visitor-registration`. |
| `/exhibit/book-your-space` | `src/routes/exhibit/book-your-space.tsx` | **Book Your Space:** Two-part exhibitor application form (*Exhibitor Information* + *Exhibitor Profile & Stand Requirements*) with in-website popup validation and automated emails. |
| `/exhibit/download-brochure` | `src/routes/exhibit/download-brochure.tsx` | **Download Brochure:** Sales brochure request form that simultaneously triggers an immediate browser PDF download (`Brochure Turnkey Show 2027.pdf`) and emails the brochure as a PDF attachment + signed download link. |
| `/visit/why-visit` | `src/routes/visit/why-visit.tsx` | **Why Visit:** Visitor overview and quick links to registration and exhibitor profiles. |
| `/visit/exhibitor-profile` | `src/routes/visit/exhibitor-profile.tsx` | **Exhibitor Profile:** Interactive 8-sector showcase cards (grayscale to full color on hover). |
| `/visit/visitor-registration` | `src/routes/visit/visitor-registration.tsx` | **Visitor Registration:** Free visitor entry badge registration form with category & sector selection. |
| `/services/special-decoration` | `src/routes/services/special-decoration.tsx` | **Special Decoration:** Official Stand Design & Fit-Out Contractor (**EXPO TECH**) profile and contact details. |
| `/services/freight-forwarding` | `src/routes/services/freight-forwarding.tsx` | **Freight Forwarding:** Official logistics & customs clearance partner page. |
| `/services/travel` | `src/routes/services/travel.tsx` | **Travel & Accommodation:** Hotel rates, shuttle transfers, and VIP travel page. |
| `/contact` | `src/routes/contact.tsx` | **Contact Us:** Enlarged Turnkey Show logo (`150px`) with action buttons directly below it, followed by the two *Key Contacts* cards (*Apex Conventions & Trade Fairs* and *Exhibition Venue*) positioned above the general inquiry form. |

---

## 3. Summary of Completed Features & Customizations

1. **Header & Footer Architecture (`src/components/SiteLayout.tsx`):**
   - Solid white header with top utility strip, scroll progress indicator, desktop dropdowns, and mobile accordion navigation.
   - Footer *Contact & Inquiries* column updated to display `info@turnkeyshow.com`, `Download Brochure`, and the event dates/venue (`06 – 09 May 2027` / `New Alamein International Convention and Exhibition Center`).
   - Replaced all instances of the Apex logo across the site and emails with the transparent-background `apex-logo-no-bg.png` and updated the second Apex mobile number to `+20 1041555455` everywhere (`src/config/event.ts`).
2. **Homepage Layout & Sections (`src/routes/index.tsx`):**
   - Moved hero CTA buttons (*Book Your Space* and *Download Brochure*) into the *About the Expo* section directly below the hero.
   - Removed the duplicate *Market Overview* eyebrow heading and placed *Two Markets… One Opportunity* directly under the main *Market Overview* section.
   - Aligned both *New Supply* and *Existing Supply* cards at the top and bottom on both the Homepage and Market Overview page.
   - Added the *Supported By* section at the bottom of the homepage with an architectural background image banner and the centered Apex logo underneath.
3. **Uniform Site-Wide Button System (`src/site.css`):**
   - Standardized all button variants (`.hero-btn`, `.hero-btn-primary`, `.hero-btn-secondary`, `.hero-btn-editorial`, `.subpage-btn-ghost`, `.show-button`) to identical height (`52px`), padding (`0 30px`), border width (`1.5px`), and typography (`League Spartan`, `0.875rem`, `800` weight, `0.08em` tracking, uppercase), differing only in color.
4. **In-Website Form Validation Popup Modal (`src/lib/formAlerts.ts`):**
   - Replaced native browser `alert()` dialogs with `showSiteAlert()`, rendering a branded Turnkey Show modal overlay inside the website for all form validation and error messages across all 4 forms.
5. **Automated Owner & Bilingual Auto-Reply Emails (`src/server/forms-handler.ts`):**
   - **Owner Notification Email (`mustafa.khafaga@gmail.com`):** Clearly identifies which of the 4 forms was submitted (`FORM 1: BOOK YOUR SPACE`, `FORM 2: DOWNLOAD BROCHURE`, `FORM 3: VISITOR REGISTRATION`, `FORM 4: CONTACT US`), the source page, Cairo timestamp, and all submitted fields separated by section.
   - **User Auto-Reply Email:** Styled after `Registration (updated).docx` on a clean white layout with **only** the official Turnkey Show logo and new Apex logo (using inline `cid:` attachments for Gmail compatibility), form-specific bilingual (English + Arabic) confirmation messages, a summary table of submitted fields, and `Brochure Turnkey Show 2027.pdf` attached directly on brochure requests.

---

## 4. Development, Testing & Production Build

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```

### Run Unit & Routing Tests
```bash
npm test
```

### Build & Preview for Production
```bash
npm run build
npm run preview
```

For instructions on configuring live email delivery when publishing to a server, see [DEPLOYMENT_AND_EMAIL_SETUP.md](./DEPLOYMENT_AND_EMAIL_SETUP.md).
