import { useEffect, useMemo } from "react";
import { usePersistentState } from "../hooks/usePersistentState";
import { I18nContext } from "./context";
import { LANGUAGES, MESSAGES } from "./messages";

export const LANG_KEY = "app-ppi:lang";

const isLang = (code) => LANGUAGES.some((l) => l.code === code);

// Primera visita: el idioma del navegador si está soportado; si no, español.
function detectLanguage() {
  const preferred =
    typeof navigator === "undefined"
      ? []
      : navigator.languages || [navigator.language];
  for (const tag of preferred) {
    const code = String(tag).slice(0, 2).toLowerCase();
    if (isLang(code)) return code;
  }
  return LANGUAGES[0].code;
}

function interpolate(text, vars) {
  return text.replace(/\{(\w+)\}/g, (match, key) =>
    key in vars ? vars[key] : match,
  );
}

export default function I18nProvider({ children }) {
  const [lang, setLang] = usePersistentState(LANG_KEY, detectLanguage, isLang);
  const language = LANGUAGES.find((l) => l.code === lang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = MESSAGES[lang].pageTitle;
  }, [lang]);

  const value = useMemo(() => {
    const messages = MESSAGES[lang];
    return {
      lang,
      locale: language.locale,
      language,
      setLang,
      t: (key, vars = {}) => interpolate(messages[key] ?? key, vars),
      currencyName: (code) => messages.currencies[code]?.name ?? code,
      currencyPlural: (code) => messages.currencies[code]?.plural ?? code,
    };
  }, [lang, language, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
