import styles from "./ErrorState.module.css";

export default function ErrorState({ onRetry, retrying }) {
  return (
    <div className={styles.wrapper} role="alert">
      <h2 className={styles.title}>No pudimos obtener las cotizaciones</h2>
      <p className={styles.text}>
        Revisá tu conexión a internet y volvé a intentar.
      </p>
      <button
        type="button"
        className={styles.button}
        onClick={onRetry}
        disabled={retrying}
      >
        {retrying ? "Reintentando…" : "Reintentar"}
      </button>
    </div>
  );
}
