import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: ".", // Project root is frontend/
  publicDir: "public", // Public assets in frontend/public/
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: false,
    open: true,
  },
  base: "/", // For SPA routing with react-router-dom
  build: {
    outDir: "dist", // Output directory for build
  },
  logLevel: "info", // Enable verbose logging
});
