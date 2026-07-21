import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";

// Security headers applied during dev via Vite's server.headers.
// In production (Vercel), these are set in vercel.json.
const SECURITY_HEADERS = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
  "X-XSS-Protection": "1; mode=block",
};

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    headers: SECURITY_HEADERS,
  },
  plugins: [
    // tanstackStart already includes the router plugin internally.
    // Adding tanstackRouter() separately causes its code-splitter to
    // run twice on every route file, producing Duplicate declaration errors.
    tanstackStart({
      server: {
        entry: "server",
      },
    }),
    react(),
    tailwindcss(),
  ],
});
