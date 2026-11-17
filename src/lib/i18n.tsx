/**
 * Lightweight bilingual (EN / AR) support.
 *
 * Every page route lives under the optional `{-$locale}` segment, so the same
 * route file serves both `/about/venue` (English) and `/ar/about/venue`
 * (Arabic, RTL). The active locale is derived from the URL — never from
 * cookies or browser settings — so every page is shareable and SSR renders
 * the correct `lang` / `dir` on first paint.
 */
import { forwardRef, type AnchorHTMLAttributes } from "react";
import { Link, useRouterState, type LinkProps } from "@tanstack/react-router";

export type Locale = "en" | "ar";

export const LOCALES: readonly Locale[] = ["en", "ar"] as const;
export const DEFAULT_LOCALE: Locale = "en";

/** Normalises the raw `{-$locale}` route param into a supported locale. */
export function resolveLocale(param: string | undefined | null): Locale {
  return param === "ar" ? "ar" : "en";
}

export function getLocaleFromPath(pathname: string): Locale {
  return /^\/ar(\/|$)/.test(pathname) ? "ar" : "en";
}

/** Removes the `/ar` prefix (if any) and returns the locale-neutral path. */
export function stripLocale(pathname: string): string {
  const stripped = pathname.replace(/^\/ar(?=\/|$)/, "");
  return stripped === "" ? "/" : stripped;
}

/**
 * Prefixes an internal path for the given locale.
 * External URLs, `mailto:` / `tel:` links and pure hashes pass through.
 */
export function localizePath(path: string, locale: Locale): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  const neutral = stripLocale(path);
  if (locale === "en") return neutral;
  return neutral === "/" ? "/ar" : `/ar${neutral}`;
}

export function useLocale() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const locale = getLocaleFromPath(pathname);
  const isAr = locale === "ar";
  return {
    locale,
    isAr,
    dir: (isAr ? "rtl" : "ltr") as "rtl" | "ltr",
    /** Localise an internal path for the current locale. */
    lp: (path: string) => localizePath(path, locale),
    /** Same page in the other language. */
    alternatePath: localizePath(stripLocale(pathname), isAr ? "en" : "ar"),
    pathname,
  };
}

/** Pick the copy for the active locale from a `{ en, ar }` dictionary. */
export function useCopy<T>(copy: { en: T; ar: T }): T {
  const { locale } = useLocale();
  return copy[locale];
}

/* ------------------------------------------------------------------ */
/* Arabic-Indic numerals (as used across the Arabic brochure)          */
/* ------------------------------------------------------------------ */

const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

/** 2027 → ٢٠٢٧, 1.2 → ١٫٢, 46,189 → ٤٦٬١٨٩ */
export function toArabicDigits(value: string): string {
  return value
    .replace(/(\d)\.(\d)/g, "$1٫$2")
    .replace(/(\d),(\d)/g, "$1٬$2")
    .replace(/\d/g, (d) => ARABIC_DIGITS[Number(d)] ?? d);
}

export function formatNumberForLocale(value: string, locale: Locale): string {
  return locale === "ar" ? toArabicDigits(value) : value;
}

/* ------------------------------------------------------------------ */
/* Locale-aware link                                                   */
/* ------------------------------------------------------------------ */

type LocaleLinkProps = Omit<LinkProps, "to" | "params"> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    /** Locale-neutral internal path, e.g. "/exhibit/book-your-space". */
    to: string;
  };

/**
 * Drop-in replacement for `<Link>` that keeps the visitor in their language.
 * Pass the English (locale-neutral) path; `/ar` is prefixed automatically.
 */
export const LocaleLink = forwardRef<HTMLAnchorElement, LocaleLinkProps>(function LocaleLink(
  { to, ...rest },
  ref,
) {
  const { lp } = useLocale();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const AnyLink = Link as any;
  return <AnyLink ref={ref} to={lp(to)} {...rest} />;
});
