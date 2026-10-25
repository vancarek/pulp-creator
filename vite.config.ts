import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// GitHub Pages serves no server-side rewrites, so a hard refresh or deep
// link to a client-routed path (e.g. a character's link) 404s unless
// something static exists there. Pages falls back to /404.html for any
// unresolved path, so shipping a copy of the SPA shell under that name lets
// React Router pick up the real route once the app boots.
function spaFallback(): Plugin {
  return {
    name: "spa-fallback-404",
    apply: "build",
    closeBundle() {
      const outDir = resolve(import.meta.dirname, "dist");
      writeFileSync(
        resolve(outDir, "404.html"),
        readFileSync(resolve(outDir, "index.html")),
      );
    },
  };
}

// DEPLOY_BASE_PATH lets a PR preview override the base path without
// touching this file.
const base = process.env.DEPLOY_BASE_PATH ?? "/pulp-creator/";

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      // The app registers the worker itself — see
      // src/app/register-service-worker.ts.
      injectRegister: false,
      // The manifest is a hand-written static file (public/manifest.json),
      // linked manually from index.html.
      manifest: false,
      injectManifest: {
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
      },
      devOptions: {
        enabled: false,
      },
    }),
    spaFallback(),
  ],
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "src"),
    },
  },
});
