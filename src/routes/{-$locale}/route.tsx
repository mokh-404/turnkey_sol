import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";

/**
 * Locale segment layout.
 * `/…` renders English, `/ar/…` renders Arabic (RTL). Any other value in the
 * optional segment is not a language and falls through to the 404 page.
 */
export const Route = createFileRoute("/{-$locale}")({
  beforeLoad: ({ params }) => {
    const { locale } = params as { locale?: string };
    if (locale !== undefined && locale !== "ar") {
      throw notFound();
    }
  },
  component: () => <Outlet />,
});
