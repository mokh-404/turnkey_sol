import { createFileRoute, Outlet, useLocation, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/exhibit")({
  component: ExhibitLayout,
});

function ExhibitLayout() {
  const location = useLocation();
  if (location.pathname === "/exhibit" || location.pathname === "/exhibit/") {
    return <Navigate to="/exhibit/why-exhibit" replace />;
  }
  return <Outlet />;
}
