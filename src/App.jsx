import { useExchangeRates } from "./hooks/useExchangeRates";
import Converter from "./components/Converter";
import ErrorState from "./components/ErrorState";
import Spinner from "./components/Spinner";
import styles from "./App.module.css";

export default function App() {
  const { data, loading, error, refresh } = useExchangeRates();

  let content;
  if (data) {
    content = (
      <Converter
        data={data}
        loading={loading}
        error={error}
        onRefresh={refresh}
      />
    );
  } else if (error) {
    content = (
      <div className={styles.panel}>
        <ErrorState onRetry={refresh} retrying={loading} />
      </div>
    );
  } else {
    content = (
      <div className={styles.panel}>
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <p className={styles.brand}>Conversor de monedas</p>
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>
            Dólares, euros, reales, pesos y guaraníes
          </h1>
          <p className={styles.subtitle}>
            Convertí al instante con la cotización del día.
          </p>
          {content}
        </div>
      </main>
    </>
  );
}
