import { useState } from "react";
import styles from "./SwapButton.module.css";

export default function SwapButton({ onClick }) {
  const [spinning, setSpinning] = useState(false);
  return (
    <button
      type="button"
      className={`${styles.button} ${spinning ? styles.spin : ""}`}
      onClick={() => {
        setSpinning(true);
        onClick();
      }}
      onAnimationEnd={() => setSpinning(false)}
      aria-label="Invertir monedas"
      title="Invertir monedas"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path
          d="M7 7h12l-4-4M17 17H5l4 4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
