import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach } from "vitest";
import { cleanup } from "@testing-library/react";

// jsdom informa el navegador en inglés; los tests usan español salvo que pidan otro idioma.
beforeEach(() => {
  window.localStorage.setItem("app-ppi:lang", JSON.stringify("es"));
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  delete document.documentElement.dataset.theme;
});
