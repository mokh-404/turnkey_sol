import { createFileRoute, Outlet, useLocation, Navigate } from "@tanstack/react-router";
import { stripLocale, useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/{-$locale}/about")({
  component: AboutLayout,
});

function AboutLayout() {
  const location = useLocation();
  const { isAr } = useLocale();
  const neutral = stripLocale(location.pathname);
  if (neutral === "/about" || neutral === "/about/") {
    return (
      <Navigate
        to="/{-$locale}/about/turnkey-show"
        params={{ locale: isAr ? "ar" : undefined }}
        replace
      />
    );
  }
  return <Outlet />;
}
