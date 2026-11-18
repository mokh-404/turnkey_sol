import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { getLocaleFromPath, LocaleLink, localizePath, stripLocale, useLocale } from "@/lib/i18n";
import { EVENT_CONFIG } from "@/config/event";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  const { isAr } = useLocale();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">{isAr ? "٤٠٤" : "404"}</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          {isAr ? "الصفحة غير موجودة" : "Page not found"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {isAr
            ? "الصفحة التي تبحث عنها غير متوفرة أو تم نقلها."
            : "The page you're looking for doesn't exist or has been moved."}
        </p>
        <div className="mt-6">
          <LocaleLink
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {isAr ? "العودة إلى الرئيسية" : "Go home"}
          </LocaleLink>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  const { isAr, lp } = useLocale();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {isAr ? "تعذر تحميل الصفحة" : "This page didn't load"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isAr
            ? "حدث خلل غير متوقع. يمكنك إعادة المحاولة أو العودة إلى الصفحة الرئيسية."
            : "Something went wrong on our end. You can try refreshing or head back home."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {isAr ? "إعادة المحاولة" : "Try again"}
          </button>
          <a
            href={lp("/")}
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            {isAr ? "العودة إلى الرئيسية" : "Go home"}
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: ({ matches }) => {
    const lastMatch = matches[matches.length - 1];
    const rawPath = lastMatch?.pathname || "/";
    const cleanPath = rawPath === "/" ? "/" : rawPath.replace(/\/+$/, "");
    const siteUrl = EVENT_CONFIG.siteUrl;
    const canonicalUrl = `${siteUrl}${cleanPath}`;
    const neutralPath = stripLocale(cleanPath);
    const enUrl = `${siteUrl}${localizePath(neutralPath, "en")}`;
    const arUrl = `${siteUrl}${localizePath(neutralPath, "ar")}`;

    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "author", content: "Turnkey Show" },
        { property: "og:site_name", content: "Turnkey Show Alamein 2027" },
        { property: "og:url", content: canonicalUrl },
        { property: "og:image", content: `${siteUrl}/turnkey-logo.png` },
      ],
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
        { rel: "canonical", href: canonicalUrl },
        { rel: "alternate", hrefLang: "en", href: enUrl },
        { rel: "alternate", hrefLang: "ar", href: arUrl },
        { rel: "alternate", hrefLang: "x-default", href: enUrl },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Archivo+Black&family=League+Spartan:wght@300;400;500;600;700;800;900&family=Noto+Kufi+Arabic:wght@400;500;600;700;800;900&display=swap",
        },
        { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
        { rel: "icon", href: "/turnkey-logo.png", type: "image/png" },
        { rel: "apple-touch-icon", href: "/turnkey-logo.png" },
        { rel: "manifest", href: "/site.webmanifest" },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const locale = getLocaleFromPath(pathname);
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const { locale, dir } = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
