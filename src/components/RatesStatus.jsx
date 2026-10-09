import { formatUpdatedAt } from "../lib/format";
import { useI18n } from "../i18n/context";
import styles from "./RatesStatus.module.css";

export default function RatesStatus({ data, loading, error, onRefresh }) {
  const { t, locale } = useI18n();
  const date =
    formatUpdatedAt(data.updatedAt, data.precision, locale) ?? t("unknownDate");
  return (
    <footer className={styles.status}>
      {error && (
        <p className={styles.warning} role="alert">
          {t("staleWarning")}
        </p>
      )}
      <p className={styles.meta}>
        {t("updatedAt", { date })} · {t("source")}:{" "}
        <a href={data.source.homepage} target="_blank" rel="noreferrer">
          {data.source.name}
        </a>
      </p>
      <button
        type="button"
        className={styles.refresh}
        onClick={onRefresh}
        disabled={loading}
      >
        {loading ? t("refreshing") : t("refresh")}
      </button>
    </footer>
  );
}
