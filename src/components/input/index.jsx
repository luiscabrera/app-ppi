import React from "react";
import "./styles.css";

const Input = ({ label, value, onChange }) => {
  const handleChange = (e) => {
    const amount = e.target.value;
    if (amount >= 0) {
      onChange(amount);
    }
  };

  return (
    <div className="input">
      <p className="label">{label}</p>
      <input type="number" value={value} onChange={handleChange} />
      {value < 0 && (
        <div className="validation">
          <p>Amount cannot be negative</p>
        </div>
      )}
    </div>
  );
};

export default Input;
