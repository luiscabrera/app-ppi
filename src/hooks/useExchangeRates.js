import { useCallback, useEffect, useRef, useState } from "react";
import { fetchRates } from "../api/rates";
import { CURRENCY_CODES } from "../config/currencies";
import { readJson, writeJson } from "../lib/storage";

export const CACHE_KEY = "app-ppi:rates:v1";
// Las fuentes actualizan una vez por día; con una hora de caché alcanza y sobra.
export const CACHE_TTL_MS = 60 * 60 * 1000;

function readCache() {
  const cached = readJson(CACHE_KEY);
  const rates = cached?.data?.rates;
  const valid = rates && CURRENCY_CODES.every((code) => rates[code] > 0);
  return valid ? cached : null;
}

// Devuelve las cotizaciones y cómo se obtuvieron. Si hay datos guardados se
// muestran de inmediato; si la red falla, se siguen mostrando con un aviso.
export function useExchangeRates() {
  const [state, setState] = useState(() => {
    const cached = readCache();
    return {
      data: cached?.data ?? null,
      fetchedAt: cached?.fetchedAt ?? null,
      loading: !cached,
      error: null,
    };
  });
  const controllerRef = useRef(null);

  const refresh = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await fetchRates({ signal: controller.signal });
      const fetchedAt = Date.now();
      writeJson(CACHE_KEY, { data, fetchedAt });
      setState({ data, fetchedAt, loading: false, error: null });
    } catch (error) {
      if (controller.signal.aborted) return;
      setState((prev) => ({ ...prev, loading: false, error }));
    }
  }, []);

  useEffect(() => {
    const cached = readCache();
    if (!cached || Date.now() - cached.fetchedAt > CACHE_TTL_MS) refresh();
    return () => controllerRef.current?.abort();
  }, [refresh]);

  return { ...state, refresh };
}
