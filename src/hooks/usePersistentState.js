import { useEffect, useState } from "react";
import { readJson, writeJson } from "../lib/storage";

// useState que recuerda su valor entre visitas. Como en useState, `initialValue`
// puede ser una función que se evalúa sólo la primera vez. `isValid` descarta valores
// guardados que ya no sirven (p. ej. una moneda que se quitó de la lista).
export function usePersistentState(key, initialValue, isValid = () => true) {
  const [value, setValue] = useState(() => {
    const stored = readJson(key);
    if (stored !== null && isValid(stored)) return stored;
    return typeof initialValue === "function" ? initialValue() : initialValue;
  });

  useEffect(() => {
    writeJson(key, value);
  }, [key, value]);

  return [value, setValue];
}
