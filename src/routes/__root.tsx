import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { WhatsAppButton } from "@/components/WhatsAppButton";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow text-muted-foreground">404</p>
        <h1 className="mt-4 text-5xl text-foreground">Lost in the mist</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          This path doesn't lead anywhere in our village.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center rounded-sm border border-primary px-6 py-3 text-xs uppercase tracking-widest text-primary transition hover:bg-primary hover:text-primary-foreground"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error("Root Route Error caught:", error);

  const handleResetAndClear = () => {
    try {
      localStorage.removeItem("pretty_village_active_booking");
    } catch {
      // ignore
    }
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="max-w-md text-center bg-card p-8 rounded-3xl border border-border/40 shadow-xl space-y-4 animate-fadeIn">
        <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 mx-auto flex items-center justify-center text-xl font-bold">
          🏡
        </div>
        <h1 className="text-2xl font-light text-foreground">Something drifted off course</h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {error?.message || "We encountered an unexpected page transition state."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={() => {
              reset();
              window.location.reload();
            }}
            className="flex-1 rounded-2xl bg-forest text-mist py-3.5 text-xs uppercase tracking-widest font-semibold hover:bg-moss transition ios-springy-btn"
          >
            Try Again
          </button>
          <button
            onClick={handleResetAndClear}
            className="flex-1 rounded-2xl border border-border/60 text-foreground py-3.5 text-xs uppercase tracking-widest font-medium hover:bg-muted/40 transition ios-springy-btn"
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Pretty Village Musanze — Boutique Apartments in Rwanda" },
      { name: "description", content: "Pretty Village Musanze — warm, boutique apartments at the foot of the Virunga volcanoes in Northern Rwanda." },
      { name: "author", content: "Pretty Village Musanze" },
      { property: "og:title", content: "Pretty Village Musanze — Boutique Apartments" },
      { property: "og:description", content: "A warm, quiet retreat at the foot of the Virunga volcanoes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..700;1,400..700&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <WhatsAppButton />
    </QueryClientProvider>
  );
}
