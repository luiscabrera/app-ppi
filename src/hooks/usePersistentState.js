import { useEffect, useState } from "react";
import { readJson, writeJson } from "../lib/storage";

// useState que recuerda su valor entre visitas. `isValid` descarta valores
// guardados que ya no sirven (p. ej. una moneda que se quitó de la lista).
export function usePersistentState(key, initialValue, isValid = () => true) {
  const [value, setValue] = useState(() => {
    const stored = readJson(key);
    return stored !== null && isValid(stored) ? stored : initialValue;
  });

  useEffect(() => {
    writeJson(key, value);
  }, [key, value]);

  return [value, setValue];
}
