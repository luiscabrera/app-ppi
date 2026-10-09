import { useI18n } from "../i18n/context";
import styles from "./Spinner.module.css";

export default function Spinner() {
  const { t } = useI18n();
  return (
    <div className={styles.wrapper} role="status">
      <span className={styles.spinner} aria-hidden="true" />
      <span>{t("loading")}</span>
    </div>
  );
}
