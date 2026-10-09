import { useState } from "react";
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
import AmountInput from "./AmountInput";
import CurrencySelect from "./CurrencySelect";
import SwapButton from "./SwapButton";
import RatesStatus from "./RatesStatus";
import styles from "./Converter.module.css";

const isCurrency = (code) => CURRENCY_CODES.includes(code);

export default function Converter({ data, loading, error, onRefresh }) {
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

  const { rates } = data;
  const amount = parseAmount(amountText);
  const invalid = Number.isNaN(amount);
  const result =
    amount === null || invalid ? NaN : convert(amount, from, to, rates);
  const fromInfo = CURRENCY_BY_CODE[from];
  const toInfo = CURRENCY_BY_CODE[to];

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  // Elegir la misma moneda en ambos lados equivale a invertirlas.
  const changeFrom = (code) => (code === to ? swap() : setFrom(code));
  const changeTo = (code) => (code === from ? swap() : setTo(code));

  const handleBlur = () => {
    setTouched(true);
    if (amount !== null && !invalid)
      setAmountText(formatAmountInput(amount, from));
  };

  let amountError = null;
  if (invalid)
    amountError = "Ingresá un monto válido, por ejemplo 1.500.000 o 10,50";
  else if (touched && amount === null) amountError = "Ingresá un monto";

  return (
    <section className={styles.card} aria-labelledby="converter-title">
      <h2 id="converter-title" className={styles.visuallyHidden}>
        Convertir {fromInfo.plural} a {toInfo.plural}
      </h2>

      <div className={styles.form}>
        <div className={styles.amount}>
          <AmountInput
            value={amountText}
            onChange={setAmountText}
            onBlur={handleBlur}
            error={amountError}
          />
        </div>
        <CurrencySelect label="De" value={from} onChange={changeFrom} />
        <div className={styles.swap}>
          <SwapButton onClick={swap} />
        </div>
        <CurrencySelect label="A" value={to} onChange={changeTo} />
      </div>

      <div className={styles.body}>
        <div className={styles.result} aria-live="polite">
          <p className={styles.resultFrom}>
            {amount === null || invalid
              ? `${fromInfo.flag} ${fromInfo.name} =`
              : `${formatMoney(amount, from)} ${from} =`}
          </p>
          <p className={styles.resultTo} data-testid="result">
            {formatMoney(result, to)}{" "}
            <span className={styles.resultCode}>{to}</span>
          </p>
          <p className={styles.rates}>
            <span>{`1 ${from} = ${formatRate(rateBetween(from, to, rates))} ${to}`}</span>
            <span>{`1 ${to} = ${formatRate(rateBetween(to, from, rates))} ${from}`}</span>
          </p>
        </div>

        <div className={styles.side}>
          <h3 className={styles.sideTitle}>
            {amount === null || invalid
              ? `1 ${from} equivale a`
              : `${formatMoney(amount, from)} ${from} equivalen a`}
          </h3>
          <ul className={styles.list}>
            {CURRENCIES.filter((c) => c.code !== from).map((c) => (
              <li key={c.code} className={styles.listItem}>
                <span>
                  <span aria-hidden="true">{c.flag}</span> {c.name}
                </span>
                <strong>
                  {formatMoney(
                    convert(
                      amount === null || invalid ? 1 : amount,
                      from,
                      c.code,
                      rates,
                    ),
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
        Usamos la cotización de referencia del mercado (tipo medio). Es sólo
        informativa: bancos y casas de cambio aplican su propia cotización de
        compra y venta.
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
