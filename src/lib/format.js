import { CURRENCY_BY_CODE } from "../config/currencies";

// Locale por defecto: español de Argentina (punto para miles, coma para decimales).
export const DEFAULT_LOCALE = "es-AR";

const cache = new Map();

function cached(key, create) {
  if (!cache.has(key)) cache.set(key, create());
  return cache.get(key);
}

function numberFormat(locale, options) {
  return cached(
    `n|${locale}|${JSON.stringify(options)}`,
    () => new Intl.NumberFormat(locale, options),
  );
}

// Separadores de miles y decimales del locale, p. ej. { group: ".", decimal: "," }.
export function separators(locale = DEFAULT_LOCALE) {
  return cached(`s|${locale}`, () => {
    const parts = new Intl.NumberFormat(locale).formatToParts(1234567.5);
    return {
      group: parts.find((p) => p.type === "group")?.value ?? ",",
      decimal: parts.find((p) => p.type === "decimal")?.value ?? ".",
    };
  });
}

// Monto en una moneda, con los decimales propios de cada una (el guaraní no usa).
// Los valores menores a 1 (p. ej. 1 PYG en USD) se muestran con 4 cifras
// significativas para no redondearlos a "0,00".
export function formatMoney(value, code, locale = DEFAULT_LOCALE) {
  if (!Number.isFinite(value)) return "—";
  if (value !== 0 && Math.abs(value) < 1) {
    return numberFormat(locale, { maximumSignificantDigits: 4 }).format(value);
  }
  const decimals = CURRENCY_BY_CODE[code]?.decimals ?? 2;
  return numberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

// Tasa unitaria ("1 USD = 7.312,5 PYG"): un poco más de precisión que un monto.
export function formatRate(value, locale = DEFAULT_LOCALE) {
  if (!Number.isFinite(value)) return "—";
  if (Math.abs(value) < 1) {
    return numberFormat(locale, { maximumSignificantDigits: 4 }).format(value);
  }
  return numberFormat(locale, { maximumFractionDigits: 4 }).format(value);
}

// Interpreta lo que escribe el usuario. Devuelve `null` si está vacío y `NaN` si es inválido.
// Sigue la convención del locale (1.500.000,50 en español, 1,500,000.50 en inglés) pero
// es tolerante: "10.5" y "10,5" se leen como diez y medio en ambos idiomas.
export function parseAmount(input, locale = DEFAULT_LOCALE) {
  const text = String(input ?? "").replace(/\s/g, "");
  if (text === "") return null;
  if (!/^[\d.,]+$/.test(text) || !/\d/.test(text)) return NaN;

  const { group, decimal } = separators(locale);
  let normalized;
  if (text.includes(decimal)) {
    // Con el separador decimal presente, el otro sólo puede ser de miles.
    if (text.split(decimal).length > 2) return NaN;
    normalized = text.split(group).join("").replace(decimal, ".");
  } else {
    // Sin separador decimal: el otro es de miles si agrupa de a 3 dígitos,
    // si no, se toma como decimal ("10.5" en español, "10,5" en inglés).
    const parts = text.split(group);
    const looksLikeThousands =
      parts.length > 2 ||
      (parts.length === 2 && parts[0] !== "" && parts[1].length === 3);
    normalized = looksLikeThousands ? parts.join("") : parts.join(".");
  }

  const value = Number(normalized);
  return Number.isFinite(value) ? value : NaN;
}

// Texto que se vuelve a mostrar en el input al salir del campo (agrega separadores).
export function formatAmountInput(value, code, locale = DEFAULT_LOCALE) {
  const decimals = CURRENCY_BY_CODE[code]?.decimals ?? 2;
  return numberFormat(locale, { maximumFractionDigits: decimals }).format(
    value,
  );
}

// `precision: "date"` se usa cuando la fuente sólo informa el día: en ese caso
// se formatea en UTC para no correr la fecha al día anterior en zonas UTC-x.
export function formatUpdatedAt(
  isoString,
  precision = "datetime",
  locale = DEFAULT_LOCALE,
) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return null;
  const options =
    precision === "date"
      ? { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }
      : {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZoneName: "short",
        };
  return cached(
    `d|${locale}|${precision}`,
    () => new Intl.DateTimeFormat(locale, options),
  ).format(date);
}
