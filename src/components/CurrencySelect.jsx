import { useId } from "react";
import { CURRENCIES } from "../config/currencies";
import styles from "./Field.module.css";

export default function CurrencySelect({ label, value, onChange }) {
  const id = useId();
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className={styles.control}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code}>
            {`${c.flag} ${c.code} — ${c.name}`}
          </option>
        ))}
      </select>
    </div>
  );
}
