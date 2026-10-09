import { formatUpdatedAt } from "../lib/format";
import styles from "./RatesStatus.module.css";

export default function RatesStatus({ data, loading, error, onRefresh }) {
  return (
    <footer className={styles.status}>
      {error && (
        <p className={styles.warning} role="alert">
          No se pudo actualizar: se muestran las últimas cotizaciones guardadas.
        </p>
      )}
      <p className={styles.meta}>
        Cotización actualizada el{" "}
        {formatUpdatedAt(data.updatedAt, data.precision)} · Fuente:{" "}
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
        {loading ? "Actualizando…" : "Actualizar"}
      </button>
    </footer>
  );
}
