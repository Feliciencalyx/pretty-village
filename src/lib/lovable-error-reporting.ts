type ErrorOptions = {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

/**
 * Generic client-side error reporter.
 * Logs to console in development; extend this to send to your own monitoring
 * endpoint (e.g. Sentry, Datadog) in production.
 */
export function reportError(
  error: unknown,
  context: Record<string, unknown> = {},
  options: ErrorOptions = {},
) {
  const message = error instanceof Error ? error.message : String(error);
  const severity = options.severity ?? "error";

  const payload = {
    message,
    severity,
    mechanism: options.mechanism ?? "manual",
    handled: options.handled ?? true,
    route: typeof window !== "undefined" ? window.location.pathname : "ssr",
    ...context,
  };

  if (severity === "error") {
    console.error("[Pretty Village] Error captured:", payload);
  } else if (severity === "warning") {
    console.warn("[Pretty Village] Warning:", payload);
  } else {
    console.info("[Pretty Village] Info:", payload);
  }
}

/** @deprecated Use reportError instead */
export const reportLovableError = reportError;
