import React from "react";
import IconButton from "../icon-button";
import CardInformation from "../card-information";
import Input from "../input";
import Select from "../select/select";
import { MdCurrencyExchange } from "react-icons/md";
import "./styles.css";

const CardExchange = ({
  currencies,
  baseCurrencies,
  handleChangeFromTo,
  value,
  setValue,
  setFrom,
  setTo,
  from,
  to,
}) => {
  const currenciesOptions = Object.keys(currencies).map((temp) => ({
    value: temp,
    label: currencies[temp].name,
  }));

  const usdValue = value / baseCurrencies.rates[from];
  const valuesBaseCurrencyTo = (baseCurrencies.rates[to] * usdValue).toFixed(6);

  const baseUsdValue = baseCurrencies.rates[from].toFixed(6);
  const baseCurrency = baseCurrencies.rates[to].toFixed(6);

  return (
    <div className="card-exchange">
      <div className="container-input-button">
        <Input label="Amount" value={value} onChange={setValue} />
        <Select
          label="From"
          options={currenciesOptions}
          onChange={setFrom}
          value={from}
        />
        <IconButton
          onClick={handleChangeFromTo}
          icon={<MdCurrencyExchange color="#034EEF" size={18} />}
        />
        <Select
          label="To"
          options={currenciesOptions}
          onChange={setTo}
          value={to}
        />
      </div>
      <div className="container-values-info">
        <div className="container-values">
          <p className="values">{`${value} ${from} = ${valuesBaseCurrencyTo} ${to}`}</p>
          <p className="base-values">{`${baseUsdValue} ${from} = ${baseCurrency} ${to}`}</p>
        </div>
        <div className="container-card">
          <CardInformation label="We use the mid-market rate for our Converter. This is for informational purposes only. You won't receive this rate when sending money." />
        </div>
      </div>
    </div>
  );
};

export default CardExchange;
