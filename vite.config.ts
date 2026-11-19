import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { Plugin } from "vite";

const SITE_URL = "https://turnkeyshow.com";

/**
 * All public routes to prerender into static `dist/client/<route>/index.html` permalinks
 * for cPanel shared hosting (Apache + PHP, no Node runtime required on server).
 */
const EN_PATHS = [
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

const ALL_PATHS = EN_PATHS.flatMap((p) => [p, p === "/" ? "/ar" : `/ar${p}`]);

/**
 * Maps internal Vite/TanStack route & component chunk names to clear, self-explanatory
 * filenames in `public_html/assets/` with no random hash suffixes.
 */
const MEANINGFUL_CHUNK_NAMES: Record<string, string> = {
  "_-_locale_": "page-homepage",
  "turnkey-show": "page-about-turnkey-show",
  "market-overview": "page-about-market-overview",
  organizer: "page-about-organizer",
  venue: "page-about-venue",
  "why-exhibit": "page-exhibit-why-exhibit",
  "visitor-profile": "page-exhibit-visitor-profile",
  "book-your-space": "page-exhibit-book-your-space-form",
  "download-brochure": "page-exhibit-download-brochure-form",
  "exhibitor-profile": "page-visit-exhibitor-profile",
  "why-visit": "page-visit-why-visit",
  "visitor-registration": "page-visit-visitor-registration-form",
  "special-decoration": "page-services-special-decoration",
  "freight-forwarding": "page-services-freight-forwarding",
  travel: "page-services-travel-and-accommodation",
  contact: "page-contact-us-form",
  about: "redirect-about-section",
  exhibit: "redirect-exhibit-section",
  visit: "redirect-visit-section",
  services: "redirect-services-section",
  route: "locale-language-route-guard",
  index: "app-main-client-entry",
  SiteLayout: "layout-global-header-footer-and-scroll-reveal-animation",
  Animation_StatsCountUp_HeroAndMarketNumbers: "animation-stats-count-up-numbers",
  Animation_InfiniteSectorsTickerRibbon_HomeBelowAbout:
    "animation-infinite-sectors-ticker-ribbon",
  Animation_PropertyDemandCycleTimeline_HomeAndMarketOverview:
    "animation-property-demand-cycle-timeline",
  formAlerts: "form-validation-popup-alert-modal",
  textarea: "ui-form-textarea-input",
  clock: "ui-clock-icon",
  useLocation: "router-location-hook",
};

function getMeaningfulJsName(rawName: string): string {
  const mapped = MEANINGFUL_CHUNK_NAMES[rawName];
  if (mapped) {
    return `assets/${mapped}.js`;
  }
  // Shared image-URL reference modules generated when multiple routes import the same .webp image
  return `assets/image-url-module-${rawName}.js`;
}

function getMeaningfulAssetName(assetInfo: { name?: string; names?: string[] }): string {
  const raw = assetInfo.names?.[0] || assetInfo.name || "asset";
  const ext = path.extname(raw);
  const base = path.basename(raw, ext);
  if (base === "styles") {
    return `assets/site-master-styles${ext}`;
  }
  return `assets/${base}${ext}`;
}

function buildSitemapXml(): string {
  const entries = EN_PATHS.flatMap((enPath) => {
    const arPath = enPath === "/" ? "/ar" : `/ar${enPath}`;
    const enUrl = `${SITE_URL}${enPath}`;
    const arUrl = `${SITE_URL}${arPath}`;
    const priority = enPath === "/" ? "1.0" : "0.8";

    const renderUrl = (loc: string) => `  <url>
    <loc>${loc}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="ar" href="${arUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}" />
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;

    return [renderUrl(enUrl), renderUrl(arUrl)];
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join("\n")}
</urlset>
`;
}

/**
 * In-process static prerender plugin:
 * Calls the compiled SSR bundle (`dist/server/server.js`) directly in memory
 * so all 32 English & Arabic permalinks + 404.html + sitemap.xml are written
 * to `dist/client/` without opening any localhost TCP sockets.
 */
function cpanelInProcessPrerenderPlugin(): Plugin {
  let rootDir = process.cwd();

  return {
    name: "turnkey:cpanel-in-process-prerender",
    apply: "build",
    enforce: "post",
    configResolved(config) {
      rootDir = config.root;
    },
    buildApp: {
      order: "post",
      async handler() {
        const serverEntryPath = path.resolve(rootDir, "dist", "server", "server.js");
        const clientOutDir = path.resolve(rootDir, "dist", "client");

        const serverMod = (await import(pathToFileURL(serverEntryPath).href)) as {
          default: {
            fetch: (req: Request, env?: unknown, ctx?: unknown) => Promise<Response>;
          };
        };

        const handler = serverMod.default;
        console.log(`[cpanel-prerender] Rendering ${ALL_PATHS.length} static route permalinks...`);

        for (const routePath of ALL_PATHS) {
          const url = `${SITE_URL}${routePath}`;
          const res = await handler.fetch(new Request(url));
          if (!res.ok) {
            throw new Error(
              `[cpanel-prerender] Failed to prerender ${routePath}: HTTP ${res.status}`,
            );
          }
          const html = await res.text();
          const outFile =
            routePath === "/"
              ? path.join(clientOutDir, "index.html")
              : path.join(clientOutDir, routePath.replace(/^\/+/, ""), "index.html");
          await fs.mkdir(path.dirname(outFile), { recursive: true });
          await fs.writeFile(outFile, html, "utf-8");
        }

        // Also render static 404.html for Apache ErrorDocument 404 /404.html
        const notFoundRes = await handler.fetch(new Request(`${SITE_URL}/__404__`));
        const notFoundHtml = await notFoundRes.text();
        await fs.writeFile(path.join(clientOutDir, "404.html"), notFoundHtml, "utf-8");

        // Write sitemap.xml to both public/ and dist/client/
        const sitemapXml = buildSitemapXml();
        await fs.writeFile(path.join(rootDir, "public", "sitemap.xml"), sitemapXml, "utf-8");
        await fs.writeFile(path.join(clientOutDir, "sitemap.xml"), sitemapXml, "utf-8");

        console.log(
          `[cpanel-prerender] Prerendered ${ALL_PATHS.length} pages + 404.html + sitemap.xml into dist/client/.`,
        );
      },
    },
  };
}

export default defineConfig({
  vite: {
    server: {
      allowedHosts: true,
    },
    environments: {
      client: {
        build: {
          rollupOptions: {
            output: {
              entryFileNames: (chunkInfo) => getMeaningfulJsName(chunkInfo.name),
              chunkFileNames: (chunkInfo) => getMeaningfulJsName(chunkInfo.name),
              assetFileNames: (assetInfo) => getMeaningfulAssetName(assetInfo),
            },
          },
        },
      },
    },
    plugins: [cpanelInProcessPrerenderPlugin()],
  },
  nitro: false,
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
  },
});
