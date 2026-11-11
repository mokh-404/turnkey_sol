import { createFileRoute, Outlet, useLocation, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/visit")({
  component: VisitLayout,
});

function VisitLayout() {
  const location = useLocation();
  if (location.pathname === "/visit" || location.pathname === "/visit/") {
    return <Navigate to="/visit/why-visit" replace />;
  }
  return <Outlet />;
}
