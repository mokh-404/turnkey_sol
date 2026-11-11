/**
 * Global Event Configuration & Single Source of Truth
 * Applied per Decisions D1, D7, D9, D11 in TURNKEY_PROMPT.md
 */

export const EVENT_CONFIG = {
  name: "Turnkey Show",
  fullName: "Turnkey Show Alamein",
  edition: "2027",
  dates: "06 – 09 May 2027", // D1: Single source of truth for dates across header, pages, and emails
  venue: "New Alamein International Convention and Exhibition Center",
  venueShort: "New Alamein Convention Center",
  email: "info@turnkeyshow.com",
  website: "www.turnkeyshow.com",
  
  // D9: Social links configuration (empty until client supplies profile URLs)
  socialLinks: {
    twitter: "",
    facebook: "",
    linkedin: "",
    instagram: "",
  },

  // Organizer details from docx (D8, D11)
  organizer: {
    name: "Apex Conventions and Trade Fairs L.L.C",
    phone: "02 36 971 091",
    mobile: "010 41 555 455 – 010 10 16 58 64",
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

