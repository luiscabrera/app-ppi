import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Rutas relativas: el build funciona en cualquier hosting estático
  // (GitHub Pages, Netlify, una subcarpeta, etc.).
  base: "./",
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    restoreMocks: true,
  },
});
