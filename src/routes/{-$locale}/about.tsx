import { createFileRoute, Outlet, useLocation, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutLayout,
});

function AboutLayout() {
  const location = useLocation();
  if (location.pathname === "/about" || location.pathname === "/about/") {
    return <Navigate to="/about/turnkey-show" replace />;
  }
  return <Outlet />;
}
