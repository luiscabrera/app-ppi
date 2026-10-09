import { useEffect, useRef, useState } from "react";
import {
  CURRENCIES,
  CURRENCY_BY_CODE,
  CURRENCY_CODES,
  DEFAULT_AMOUNT,
  DEFAULT_FROM,
  DEFAULT_TO,
} from "../config/currencies";
import { convert, rateBetween } from "../lib/convert";
import {
  formatAmountInput,
  formatMoney,
  formatRate,
  parseAmount,
} from "../lib/format";
import { usePersistentState } from "../hooks/usePersistentState";
import { useI18n } from "../i18n/context";
import AmountInput from "./AmountInput";
import CurrencySelect from "./CurrencySelect";
import SwapButton from "./SwapButton";
import RatesStatus from "./RatesStatus";
import styles from "./Converter.module.css";

const isCurrency = (code) => CURRENCY_CODES.includes(code);

export default function Converter({ data, loading, error, onRefresh }) {
  const { t, locale, currencyName, currencyPlural } = useI18n();
  const [amountText, setAmountText] = usePersistentState(
    "app-ppi:amount",
    DEFAULT_AMOUNT,
    (v) => typeof v === "string",
  );
  const [from, setFrom] = usePersistentState(
    "app-ppi:from",
    DEFAULT_FROM,
    isCurrency,
  );
  const [to, setTo] = usePersistentState("app-ppi:to", DEFAULT_TO, isCurrency);
  const [touched, setTouched] = useState(false);

  // Al cambiar de idioma cambian los separadores ("1.500,5" ↔ "1,500.5"):
  // se reescribe el monto con el formato nuevo para que siga valiendo lo mismo.
  const previousLocale = useRef(locale);
  useEffect(() => {
    if (previousLocale.current === locale) return;
    const value = parseAmount(amountText, previousLocale.current);
    previousLocale.current = locale;
    if (value !== null && !Number.isNaN(value)) {
      setAmountText(formatAmountInput(value, from, locale));
    }
  }, [locale, amountText, from, setAmountText]);

  const { rates } = data;
  const amount = parseAmount(amountText, locale);
  const hasAmount = amount !== null && !Number.isNaN(amount);
  const result = hasAmount ? convert(amount, from, to, rates) : NaN;
  const money = (value, code) => formatMoney(value, code, locale);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  // Elegir la misma moneda en ambos lados equivale a invertirlas.
  const changeFrom = (code) => (code === to ? swap() : setFrom(code));
  const changeTo = (code) => (code === from ? swap() : setTo(code));

  const handleBlur = () => {
    setTouched(true);
    if (hasAmount) setAmountText(formatAmountInput(amount, from, locale));
  };

  let amountError = null;
  if (Number.isNaN(amount)) amountError = t("invalidAmount");
  else if (touched && amount === null) amountError = t("emptyAmount");

  return (
    <section className={styles.card} aria-labelledby="converter-title">
      <h2 id="converter-title" className={styles.visuallyHidden}>
        {t("converterHeading", {
          from: currencyPlural(from),
          to: currencyPlural(to),
        })}
      </h2>

      <div className={styles.form}>
        <div className={styles.amount}>
          <AmountInput
            label={t("amount")}
            value={amountText}
            onChange={setAmountText}
            onBlur={handleBlur}
            error={amountError}
          />
        </div>
        <CurrencySelect label={t("from")} value={from} onChange={changeFrom} />
        <div className={styles.swap}>
          <SwapButton label={t("swap")} onClick={swap} />
        </div>
        <CurrencySelect label={t("to")} value={to} onChange={changeTo} />
      </div>

      <div className={styles.body}>
        <div className={styles.result} aria-live="polite">
          <p className={styles.resultFrom}>
            {hasAmount
              ? `${money(amount, from)} ${from} =`
              : `${CURRENCY_BY_CODE[from].flag} ${currencyName(from)} =`}
          </p>
          <p className={styles.resultTo} data-testid="result">
            {money(result, to)} <span className={styles.resultCode}>{to}</span>
          </p>
          <p className={styles.rates}>
            <span>{`1 ${from} = ${formatRate(rateBetween(from, to, rates), locale)} ${to}`}</span>
            <span>{`1 ${to} = ${formatRate(rateBetween(to, from, rates), locale)} ${from}`}</span>
          </p>
        </div>

        <div className={styles.side}>
          <h3 className={styles.sideTitle}>
            {hasAmount
              ? t("equivalentMany", { amount: money(amount, from), code: from })
              : t("equivalentOne", { code: from })}
          </h3>
          <ul className={styles.list}>
            {CURRENCIES.filter((c) => c.code !== from).map((c) => (
              <li key={c.code} className={styles.listItem}>
                <span>
                  <span aria-hidden="true">{c.flag}</span>{" "}
                  {currencyName(c.code)}
                </span>
                <strong>
                  {money(
                    convert(hasAmount ? amount : 1, from, c.code, rates),
                    c.code,
                  )}{" "}
                  {c.code}
                </strong>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className={styles.disclaimer}>
        {t("disclaimer")}
        {(from === "ARS" || to === "ARS") && ` ${t("arsNote")}`}
      </p>

      <RatesStatus
        data={data}
        loading={loading}
        error={error}
        onRefresh={onRefresh}
      />
    </section>
  );
}
