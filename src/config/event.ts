/**
 * Global Event Configuration & Single Source of Truth
 * Applied per Decisions D1, D7, D9, D11 in TURNKEY_PROMPT.md
 */

export const EVENT_CONFIG = {
  name: "Turnkey Show",
  fullName: "Turnkey Show Alamein",
  edition: "2027",
  dates: "06 – 09 May 2027", // D1: Single source of truth for dates across header, pages, and emails
  venue: "New Alamein International Convention & Exhibition Center",
  venueShort: "New Alamein Convention Center",
  email: "info@turnkeyshow.com",
  website: "www.turnkeyshow.com",

  // D9: Social links configuration
  socialLinks: {
    twitter: "",
    facebook: "https://www.facebook.com/profile.php?id=61596095223202",
    linkedin: "https://www.linkedin.com/company/alamein-turnkey-show/",
    instagram: "https://www.instagram.com/alameinturnkeyshow/",
  },

  // Organizer details from docx (D8, D11)
  organizer: {
    name: "Apex Conventions and Trade Fairs L.L.C",
    phone: "02 389 77 258",
    mobile: "+2 010 17 57 57 57 +2 010 41 55 54 55",
    whatsapp: "+2 010 17 57 57 57",
    email: "info@apextradefairs.com",
  },

  // Special decoration partner (Section 5.1)
  specialDecoration: {
    company: "EXPO TECH",
    contact: "Eng. Yasser Ramadan - Mr. Amr Mahmoud",
    title: "Operation Manager",
    email: "yasser@expotech-eg.com",
    mobile: "002 0111 166 2345",
    phone: "00202 23 868 555 – 23 868 999",
    address: "60 Al Tayaran St., Nasr City, Cairo, Egypt.",
  },

  // D7: Placeholder for pages with no content
  contentComingSoon: "Content coming soon.",
} as const;

/**
 * Official 8 Core Exhibition Sectors
 */
export const SHOW_SECTORS = [
  "Furniture & Interior Furnishings",
  "Kitchens & Equipment",
  "Home Appliances",
  "Outdoor Living",
  "Smart Unit Automation",
  "Modern Lighting Technology",
  "Hospitality Fit-Out Solutions",
  "Complete Integrated Solutions",
] as const;

