import { useI18n } from "../i18n/context";
import styles from "./ErrorState.module.css";

export default function ErrorState({ onRetry, retrying }) {
  const { t } = useI18n();
  return (
    <div className={styles.wrapper} role="alert">
      <h2 className={styles.title}>{t("errorTitle")}</h2>
      <p className={styles.text}>{t("errorText")}</p>
      <button
        type="button"
        className={styles.button}
        onClick={onRetry}
        disabled={retrying}
      >
        {retrying ? t("retrying") : t("retry")}
      </button>
    </div>
  );
}
