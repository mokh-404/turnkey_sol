import { createFileRoute, Outlet, useLocation, Navigate } from "@tanstack/react-router";
import { stripLocale, useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/{-$locale}/services")({
  component: ServicesLayout,
});

function ServicesLayout() {
  const location = useLocation();
  const { isAr } = useLocale();
  const neutral = stripLocale(location.pathname);
  if (neutral === "/services" || neutral === "/services/") {
    return (
      <Navigate
        to="/{-$locale}/services/special-decoration"
        params={{ locale: isAr ? "ar" : undefined }}
        replace
      />
    );
  }
  return <Outlet />;
}
