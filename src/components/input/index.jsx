import React from "react";

const Input = ({ label, value, onChange }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="input">
      <p>{label}</p>
      <input type="text" value={value} onChange={handleChange} />
    </div>
  );
};

export default Input;
