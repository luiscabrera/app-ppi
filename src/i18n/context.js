import { createContext, useContext } from "react";

export const I18nContext = createContext(null);

// { lang, locale, language, setLang, t, currencyName, currencyPlural }
export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n debe usarse dentro de <I18nProvider>");
  return value;
}
