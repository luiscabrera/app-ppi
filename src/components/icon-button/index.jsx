import React, { useState } from "react";
import "./styles.css";

const IconButton = ({ onClick, icon }) => {
  const [animate, setAnimate] = useState(false);

  function handleClick() {
    setAnimate(true);
    onClick();
    setTimeout(() => {
      setAnimate(false);
    }, 400);
  }

  return (
    <button
      onClick={handleClick}
      className={`button ${animate ? "rotate-center" : ""}`}
    >
      {icon}
    </button>
  );
};

export default IconButton;
