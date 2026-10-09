import { useExchangeRates } from "./hooks/useExchangeRates";
import { useI18n } from "./i18n/context";
import Converter from "./components/Converter";
import HeaderControls from "./components/HeaderControls";
import ErrorState from "./components/ErrorState";
import Spinner from "./components/Spinner";
import styles from "./App.module.css";

export default function App() {
  const { t } = useI18n();
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
        <div className={`${styles.container} ${styles.headerInner}`}>
          <p className={styles.brand}>{t("brand")}</p>
          <HeaderControls />
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>{t("title")}</h1>
          <p className={styles.subtitle}>{t("subtitle")}</p>
          {content}
        </div>
      </main>
    </>
  );
}
