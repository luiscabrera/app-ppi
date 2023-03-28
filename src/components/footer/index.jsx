import React from "react";
import { formatDateUTC } from "../../utils/utils";
import "./styles.css";

const Footer = ({ from, to, date, insideCard = false }) => {
  const dateFormatUTC = formatDateUTC(date);
  return (
    <div className={`${insideCard ? "footer-card" : "footer"}`}>
      <p>{`${from} to ${to} conversion — Last updated ${dateFormatUTC}`}</p>
    </div>
  );
};

export default Footer;
