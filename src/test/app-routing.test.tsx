import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";
import { localizePath, stripLocale, toArabicDigits } from "@/lib/i18n";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  const routesToTest = [
    "/about/turnkey-show",
    "/about/market-overview",
    "/about/venue",
    "/about/organizer",
    "/exhibit/why-exhibit",
    "/exhibit/visitor-profile",
    "/exhibit/book-your-space",
    "/exhibit/download-brochure",
    "/visit/why-visit",
    "/visit/exhibitor-profile",
    "/visit/visitor-registration",
    "/services/special-decoration",
    "/services/freight-forwarding",
    "/services/travel",
    "/contact",
  ];

  for (const path of routesToTest) {
    it(`matches a valid route for ${path}`, () => {
      const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
      const matches = router.matchRoutes(path);
      const leaf = matches.at(-1);
      expect(leaf?.routeId).not.toBe(rootRouteId);
      expect(leaf?.routeId).toBe(`/{-$locale}${path}`);
      expect((leaf?.params as { locale?: string }).locale).toBeUndefined();
    });

    it(`matches the Arabic route for /ar${path}`, () => {
      const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
      const matches = router.matchRoutes(`/ar${path}`);
      const leaf = matches.at(-1);
      expect(leaf?.routeId).toBe(`/{-$locale}${path}`);
      expect((leaf?.params as { locale?: string }).locale).toBe("ar");
    });
  }

  it("matches the Arabic home page for /ar", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    const leaf = router.matchRoutes("/ar").at(-1);
    expect(leaf?.routeId).toBe("/{-$locale}/");
    expect((leaf?.params as { locale?: string }).locale).toBe("ar");
  });
});

describe("i18n helpers", () => {
  it("localizes and strips paths", () => {
    expect(localizePath("/", "ar")).toBe("/ar");
    expect(localizePath("/contact", "ar")).toBe("/ar/contact");
    expect(localizePath("/ar/contact", "en")).toBe("/contact");
    expect(localizePath("/ar/contact", "ar")).toBe("/ar/contact");
    expect(localizePath("mailto:info@turnkeyshow.com", "ar")).toBe("mailto:info@turnkeyshow.com");
    expect(stripLocale("/ar")).toBe("/");
    expect(stripLocale("/arabic")).toBe("/arabic");
  });

  it("converts to Arabic-Indic digits", () => {
    expect(toArabicDigits("2027")).toBe("٢٠٢٧");
    expect(toArabicDigits("1.2")).toBe("١٫٢");
    expect(toArabicDigits("46,189+")).toBe("٤٦٬١٨٩+");
  });
});
