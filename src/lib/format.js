import { CURRENCY_BY_CODE, LOCALE } from "../config/currencies";

const formatters = new Map();

function numberFormat(options) {
  const key = JSON.stringify(options);
  if (!formatters.has(key))
    formatters.set(key, new Intl.NumberFormat(LOCALE, options));
  return formatters.get(key);
}

// Monto en una moneda, con los decimales propios de cada una (el guaraní no usa).
// Los valores menores a 1 (p. ej. 1 PYG en USD) se muestran con 4 cifras
// significativas para no redondearlos a "0,00".
export function formatMoney(value, code) {
  if (!Number.isFinite(value)) return "—";
  if (value !== 0 && Math.abs(value) < 1) {
    return numberFormat({ maximumSignificantDigits: 4 }).format(value);
  }
  const decimals = CURRENCY_BY_CODE[code]?.decimals ?? 2;
  return numberFormat({
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

// Tasa unitaria ("1 USD = 7.312,5 PYG"): un poco más de precisión que un monto.
export function formatRate(value) {
  if (!Number.isFinite(value)) return "—";
  if (Math.abs(value) < 1) {
    return numberFormat({ maximumSignificantDigits: 4 }).format(value);
  }
  return numberFormat({ maximumFractionDigits: 4 }).format(value);
}

// Interpreta lo que escribe el usuario. Devuelve `null` si está vacío y `NaN` si es inválido.
// Sigue la convención local (1.500.000,50) pero también acepta "10.5" o "10,5".
export function parseAmount(input) {
  const text = String(input ?? "").replace(/\s/g, "");
  if (text === "") return null;
  if (!/^[\d.,]+$/.test(text) || !/\d/.test(text)) return NaN;

  let normalized;
  if (text.includes(",")) {
    // Con coma: la coma es el decimal y los puntos son separadores de miles.
    if (text.split(",").length > 2) return NaN;
    normalized = text.replace(/\./g, "").replace(",", ".");
  } else {
    const parts = text.split(".");
    const looksLikeThousands =
      parts.length > 2 ||
      (parts.length === 2 && parts[0] !== "" && parts[1].length === 3);
    normalized = looksLikeThousands ? parts.join("") : text;
  }

  const value = Number(normalized);
  return Number.isFinite(value) ? value : NaN;
}

// Texto que se vuelve a mostrar en el input al salir del campo (agrega separadores).
export function formatAmountInput(value, code) {
  const decimals = CURRENCY_BY_CODE[code]?.decimals ?? 2;
  return numberFormat({ maximumFractionDigits: decimals }).format(value);
}

const dateTimeFormat = new Intl.DateTimeFormat(LOCALE, {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZoneName: "short",
});

const dateOnlyFormat = new Intl.DateTimeFormat(LOCALE, {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

// `precision: "date"` se usa cuando la fuente sólo informa el día: en ese caso
// se formatea en UTC para no correr la fecha al día anterior en zonas UTC-x.
export function formatUpdatedAt(isoString, precision = "datetime") {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "fecha desconocida";
  return precision === "date"
    ? dateOnlyFormat.format(date)
    : dateTimeFormat.format(date);
}
