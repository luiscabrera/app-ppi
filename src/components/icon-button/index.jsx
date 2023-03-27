import React from "react";
import "./styles.css";

const IconButton = ({ onClick, icon }) => {
  return (
    <button onClick={onClick} className="button">
      {icon}
    </button>
  );
};

export default IconButton;
