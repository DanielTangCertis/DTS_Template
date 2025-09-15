import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Explicitly configure public directory
  publicDir: "public",
  // Ensure static assets are served
  assetsInclude: ["**/*.js"],
});
