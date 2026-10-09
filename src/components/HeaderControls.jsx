import { useI18n } from "../i18n/context";
import { LANGUAGES } from "../i18n/messages";
import { useTheme } from "../hooks/useTheme";
import Flag from "./Flag";
import styles from "./HeaderControls.module.css";

const sun = (
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </>
);
const moon = <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />;

export default function HeaderControls() {
  const { t, language, setLang } = useI18n();
  const { theme, toggleTheme } = useTheme();

  // Con pocos idiomas, el botón pasa al siguiente; muestra la bandera del actual.
  const next = LANGUAGES[(LANGUAGES.indexOf(language) + 1) % LANGUAGES.length];
  const languageLabel = t("changeLanguage", {
    current: language.name,
    next: next.name,
  });
  const themeLabel = theme === "dark" ? t("darkModeOff") : t("darkModeOn");

  return (
    <div className={styles.controls}>
      <button
        type="button"
        className={styles.button}
        onClick={() => setLang(next.code)}
        aria-label={languageLabel}
        title={languageLabel}
      >
        <Flag code={language.flag} />
      </button>
      <button
        type="button"
        className={styles.button}
        onClick={toggleTheme}
        aria-label={themeLabel}
        title={themeLabel}
      >
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Muestra el modo al que se va a pasar: luna en claro, sol en oscuro. */}
          {theme === "dark" ? sun : moon}
        </svg>
      </button>
    </div>
  );
}
