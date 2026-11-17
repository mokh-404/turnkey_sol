import { createFileRoute, Outlet, useLocation, Navigate } from "@tanstack/react-router";
import { stripLocale, useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/{-$locale}/visit")({
  component: VisitLayout,
});

function VisitLayout() {
  const location = useLocation();
  const { isAr } = useLocale();
  const neutral = stripLocale(location.pathname);
  if (neutral === "/visit" || neutral === "/visit/") {
    return (
      <Navigate
        to="/{-$locale}/visit/exhibitor-profile"
        params={{ locale: isAr ? "ar" : undefined }}
        replace
      />
    );
  }
  return <Outlet />;
}
