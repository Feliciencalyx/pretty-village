import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";

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
    tanstackRouter(),
    react(),
    tailwindcss(),
  ],
});
