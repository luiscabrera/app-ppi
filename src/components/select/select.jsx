import React from "react";
import "./styles.css";

const Select = ({ label, options, onChange, defaultValue, value }) => {
  const handleCurrencyChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="select">
      <p className="label">{label}</p>
      <select
        className="custom-select"
        value={value}
        onChange={handleCurrencyChange}
        defaultValue={defaultValue}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
