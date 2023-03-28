import React, { useEffect, useState } from "react";
import { getBaseCurrencies, getCurrencies } from "../../api/api-calls";
import Container from "../container";
import CardExchange from "../card-exchange";
import Spinner from "../spinner";
import Footer from "../footer";
import "./styles.css";

const Exchange = () => {
  const [loading, setLoading] = useState(true);
  const [currencies, setCurrencies] = useState({});
  const [baseCurrencies, setBaseCurrencies] = useState({});
  const [lastUpdated, setLastUpdated] = useState("");
  const [value, setValue] = useState(1);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");

  useEffect(() => {
    setLoading(true);
    Promise.all([getCurrencies(), getBaseCurrencies()]).then((data) => {
      setCurrencies(data[0]);
      setBaseCurrencies(data[1]);
      setLastUpdated(data[1].date);
      setLoading(false);
    });
  }, []);

  const handleChangeFromTo = () => {
    const fromCopy = from;
    const toCopy = to;
    setFrom(toCopy);
    setTo(fromCopy);
  };

  return (
    <div className="background-container">
      {loading ? (
        <div className="container-spinner">
          <Spinner />
        </div>
      ) : (
        <Container>
          <div className="exchange-title">
            <p>{`${value} ${from} to ${to} - Convert ${currencies[from]?.name} to ${currencies[to]?.name}`}</p>
          </div>
          <CardExchange
            currencies={currencies}
            baseCurrencies={baseCurrencies}
            value={value}
            setValue={setValue}
            setFrom={setFrom}
            setTo={setTo}
            from={from}
            to={to}
            handleChangeFromTo={handleChangeFromTo}
            lastUpdated={lastUpdated}
          />
          <Footer from={from} to={to} date={lastUpdated} />
        </Container>
      )}
    </div>
  );
};

export default Exchange;
