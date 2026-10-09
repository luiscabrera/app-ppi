// Monedas soportadas por el conversor. El orden define cómo aparecen en la UI.
// Los nombres de cada moneda están en las traducciones (src/i18n/messages.js).
export const CURRENCIES = [
  { code: "USD", flag: "🇺🇸", decimals: 2 },
  { code: "EUR", flag: "🇪🇺", decimals: 2 },
  { code: "BRL", flag: "🇧🇷", decimals: 2 },
  { code: "ARS", flag: "🇦🇷", decimals: 2 },
  { code: "PYG", flag: "🇵🇾", decimals: 0 },
];

export const CURRENCY_CODES = CURRENCIES.map((c) => c.code);

export const CURRENCY_BY_CODE = Object.fromEntries(
  CURRENCIES.map((c) => [c.code, c]),
);

export const DEFAULT_FROM = "USD";
export const DEFAULT_TO = "PYG";
export const DEFAULT_AMOUNT = "1";
