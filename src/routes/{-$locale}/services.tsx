import { createFileRoute, Outlet, useLocation, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/services")({
  component: ServicesLayout,
});

function ServicesLayout() {
  const location = useLocation();
  if (location.pathname === "/services" || location.pathname === "/services/") {
    return <Navigate to="/services/special-decoration" replace />;
  }
  return <Outlet />;
}
