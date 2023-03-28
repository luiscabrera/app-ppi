import React from "react";
import { formatDateUTC } from "../../utils/utils";
import "./styles.css";

const Footer = ({ from, to, date, insideCard = false }) => {
  const dateFormatUTC = formatDateUTC(date);
  return (
    <div className={`${insideCard ? "footer-card" : "footer"}`}>
      <p>
        <span className="underlined">{`${from}`}</span>
        {` to `}
        <span className="underlined">{`${to}`}</span>
        {` conversion — Last updated ${dateFormatUTC}`}
      </p>
    </div>
  );
};

export default Footer;
