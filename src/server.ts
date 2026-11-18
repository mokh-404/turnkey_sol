import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { handleFormSubmission, type FormSubmissionPayload } from "./server/forms-handler";
import { handleBrochureDownload } from "./server/brochure-handler";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      const envRecord = (env && typeof env === "object" ? env : process.env) as Record<
        string,
        string | undefined
      >;

      // 1. Intercept Form Submissions API (/api/send-mail.php and /api/forms)
      if (
        (url.pathname === "/api/forms" || url.pathname === "/api/send-mail.php") &&
        request.method === "POST"
      ) {
        try {
          const payload = (await request.json()) as FormSubmissionPayload;
          const clientIp =
            request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "0.0.0.0";
          const proto = request.headers.get("x-forwarded-proto") || url.protocol.replace(":", "");
          const host =
            request.headers.get("x-forwarded-host") || request.headers.get("host") || url.host;
          const detectedOrigin = `${proto}://${host}`;
          const result = await handleFormSubmission(payload, clientIp, {
            SITE_URL: envRecord["SITE_URL"] || detectedOrigin,
            ...envRecord,
          });
          return new Response(JSON.stringify(result), {
            status: result.success ? 200 : 400,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Invalid submission";
          return new Response(JSON.stringify({ success: false, message, error: message }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
      }

      // 2. Intercept Brochure Download API (/api/brochure.php and /api/brochure)
      if (
        (url.pathname === "/api/brochure" || url.pathname === "/api/brochure.php") &&
        request.method === "GET"
      ) {
        return handleBrochureDownload(request, envRecord);
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
