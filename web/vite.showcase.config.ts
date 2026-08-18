import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

/**
 * Standalone build for the Vila de Oyó showcase — static, mock-data,
 * no-auth walkthrough meant for its own separate Vercel deploy. Same
 * `@` alias as vite.config.ts, its own entry/outDir, so `npm run build`
 * (the real dashboard build, into ../hermes_cli/web_dist) is untouched.
 *
 * No `tailwindcss()` plugin here, unlike the main config: the whole
 * village/ tree (confirmed file-by-file) uses neither Tailwind utility
 * classes nor @nous-research/ui components.
 *
 * `@hermes/shared` IS still needed to *resolve*, even though nothing the
 * showcase actually renders calls into it (no WebSocket usage) —
 * @/lib/api.ts, pulled in transitively by the 3 panels that still import
 * `fetchJSON` for their showcase-guarded real-API path, has a top-level
 * `import ... from "@hermes/shared"`. Rather than depend on the sibling
 * `../apps/shared` folder (which the standalone `vila-de-oyo` repo this
 * showcase gets copied into does NOT have — that was the actual build
 * blocker), the alias below points at a vendored copy checked into
 * `web/vendor/hermes-shared/` instead, so this config never needs
 * anything outside `web/`. `vite.config.ts` (the real dashboard build)
 * is untouched and keeps pointing at the real `../apps/shared/src`.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@hermes/shared": path.resolve(__dirname, "./vendor/hermes-shared/src"),
    },
    dedupe: ["react", "react-dom"],
  },
  build: {
    outDir: "dist-showcase",
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "index.showcase.html"),
    },
  },
});
