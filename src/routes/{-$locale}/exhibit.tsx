import { createFileRoute, Outlet, useLocation, Navigate } from "@tanstack/react-router";
import { stripLocale, useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/{-$locale}/exhibit")({
  component: ExhibitLayout,
});

function ExhibitLayout() {
  const location = useLocation();
  const { isAr } = useLocale();
  const neutral = stripLocale(location.pathname);
  if (neutral === "/exhibit" || neutral === "/exhibit/") {
    return (
      <Navigate
        to="/{-$locale}/exhibit/why-exhibit"
        params={{ locale: isAr ? "ar" : undefined }}
        replace
      />
    );
  }
  return <Outlet />;
}
