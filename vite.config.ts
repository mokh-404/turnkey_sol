import { defineConfig } from "@lovable.dev/vite-tanstack-config";

/**
 * Production target: cPanel shared hosting (Apache + PHP, no Node.js runtime).
 *
 * Every public page is PRERENDERED at build time into a real HTML file
 * (e.g. `/about/venue` -> `dist/client/about/venue/index.html`), so each URL is a
 * true permalink that works on direct visit / refresh / crawl without a Node server.
 * Form submissions are handled in production by `public/api/send-mail.php`.
 *
 * Keep this list in sync when adding a new page route. Arabic (`/ar/...`)
 * versions are generated automatically.
 * Section roots (/about, /exhibit, /visit, /services) are NOT listed: they only
 * redirect, and production handles them with 301s in `public/.htaccess`.
 */
const PAGE_PATHS = [
  "/",
  "/about/turnkey-show",
  "/about/market-overview",
  "/about/organizer",
  "/about/venue",
  "/contact",
  "/exhibit/why-exhibit",
  "/exhibit/visitor-profile",
  "/exhibit/book-your-space",
  "/exhibit/download-brochure",
  "/visit/exhibitor-profile",
  "/visit/why-visit",
  "/visit/visitor-registration",
  "/services/special-decoration",
  "/services/freight-forwarding",
  "/services/travel",
];

const ALL_PAGES = PAGE_PATHS.flatMap((p) => [p, p === "/" ? "/ar" : `/ar${p}`]);

export default defineConfig({
  vite: {
    server: {
      allowedHosts: true,
    },
  },
  // No Node/Cloudflare server bundle is deployed — the output is static files.
  nitro: false,
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // Used for local `npm run dev` and for the build-time prerender pass only.
    server: { entry: "server" },
    prerender: {
      enabled: true,
      autoSubfolderIndex: true,
      crawlLinks: false,
      failOnError: true,
      concurrency: 4,
    },
    pages: ALL_PAGES.map((path) => ({ path, prerender: { enabled: true } })),
    // SPA shell (`/_shell.html`) used by .htaccess as the client-side routing fallback.
    spa: {
      enabled: true,
    },
  },
});
