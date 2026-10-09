import { useEffect, useState } from "react";
import { usePersistentState } from "./usePersistentState";

export const THEME_KEY = "app-ppi:theme";

const query = "(prefers-color-scheme: dark)";
const isTheme = (v) => v === "light" || v === "dark";

function systemTheme() {
  return typeof window !== "undefined" && window.matchMedia?.(query).matches
    ? "dark"
    : "light";
}

// Tema claro u oscuro. Mientras el usuario no elija, sigue al sistema operativo;
// al tocar el botón, su elección queda guardada. El script de index.html aplica
// el tema guardado antes de que cargue React, para que no haya un parpadeo.
export function useTheme() {
  const [preference, setPreference] = usePersistentState(
    THEME_KEY,
    null,
    isTheme,
  );
  const [system, setSystem] = useState(systemTheme);

  useEffect(() => {
    const media = window.matchMedia?.(query);
    if (!media) return undefined;
    const onChange = () => setSystem(systemTheme());
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (preference) root.dataset.theme = preference;
    else delete root.dataset.theme;
  }, [preference]);

  const theme = preference ?? system;
  const toggleTheme = () => setPreference(theme === "dark" ? "light" : "dark");
  return { theme, toggleTheme };
}
