// Monedas soportadas por el conversor. El orden define cómo aparecen en la UI.
export const CURRENCIES = [
  {
    code: "USD",
    name: "Dólar estadounidense",
    plural: "dólares",
    flag: "🇺🇸",
    decimals: 2,
  },
  { code: "EUR", name: "Euro", plural: "euros", flag: "🇪🇺", decimals: 2 },
  {
    code: "BRL",
    name: "Real brasileño",
    plural: "reales",
    flag: "🇧🇷",
    decimals: 2,
  },
  {
    code: "ARS",
    name: "Peso argentino",
    plural: "pesos argentinos",
    flag: "🇦🇷",
    decimals: 2,
  },
  {
    code: "PYG",
    name: "Guaraní paraguayo",
    plural: "guaraníes",
    flag: "🇵🇾",
    decimals: 0,
  },
];

export const CURRENCY_CODES = CURRENCIES.map((c) => c.code);

export const CURRENCY_BY_CODE = Object.fromEntries(
  CURRENCIES.map((c) => [c.code, c]),
);

export const DEFAULT_FROM = "USD";
export const DEFAULT_TO = "PYG";
export const DEFAULT_AMOUNT = "1";

// Formato numérico de Paraguay: punto para miles, coma para decimales.
export const LOCALE = "es-PY";
