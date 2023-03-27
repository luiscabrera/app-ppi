import React from "react";

const Select = ({ label, options, onChange, defaultValue, value }) => {
  const handleCurrencyChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="select">
      <p>{label}</p>
      <select
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
