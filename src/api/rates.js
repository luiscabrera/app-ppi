import { CURRENCY_CODES } from "../config/currencies";

// Las tasas del BCE (vatcomply, frankfurter) no incluyen el guaraní ni el peso argentino, por eso se
// usan fuentes que sí lo publican. Ambas son gratuitas, sin API key y con CORS.
export const PROVIDERS = [
  {
    name: "ExchangeRate-API",
    homepage: "https://www.exchangerate-api.com",
    url: "https://open.er-api.com/v6/latest/USD",
    parse(data) {
      if (data?.result !== "success") throw new Error("Respuesta inválida");
      return {
        rates: data.rates,
        updatedAt: new Date(data.time_last_update_unix * 1000).toISOString(),
        precision: "datetime",
      };
    },
  },
  {
    name: "Currency API",
    homepage: "https://github.com/fawazahmed0/exchange-api",
    url: "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.min.json",
    mirror: "https://latest.currency-api.pages.dev/v1/currencies/usd.min.json",
    parse(data) {
      const usd = data?.usd;
      if (!usd) throw new Error("Respuesta inválida");
      const rates = Object.fromEntries(
        Object.entries(usd).map(([code, rate]) => [code.toUpperCase(), rate]),
      );
      return { rates, updatedAt: `${data.date}T00:00:00Z`, precision: "date" };
    },
  },
];

const TIMEOUT_MS = 8000;

async function fetchJson(url, signal) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const abort = () => controller.abort();
  signal?.addEventListener("abort", abort);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", abort);
  }
}

// Se queda sólo con las monedas que usa la app y verifica que estén todas.
function pickRates(allRates) {
  const rates = {};
  for (const code of CURRENCY_CODES) {
    const rate = code === "USD" ? 1 : allRates?.[code];
    if (typeof rate !== "number" || !(rate > 0)) {
      throw new Error(`Falta la cotización de ${code}`);
    }
    rates[code] = rate;
  }
  return rates;
}

// Prueba cada fuente (y su espejo) en orden hasta que alguna responda bien.
export async function fetchRates({ signal } = {}) {
  const errors = [];
  for (const provider of PROVIDERS) {
    for (const url of [provider.url, provider.mirror].filter(Boolean)) {
      try {
        const parsed = provider.parse(await fetchJson(url, signal));
        return {
          rates: pickRates(parsed.rates),
          updatedAt: parsed.updatedAt,
          precision: parsed.precision,
          source: { name: provider.name, homepage: provider.homepage },
        };
      } catch (error) {
        if (signal?.aborted) throw error;
        errors.push(`${provider.name}: ${error.message}`);
      }
    }
  }
  throw new Error(
    `No se pudieron obtener las cotizaciones (${errors.join("; ")})`,
  );
}
