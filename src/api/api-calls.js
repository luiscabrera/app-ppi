export const getCurrencies = async () => {
  const url = "https://api.vatcomply.com/currencies";
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

export const getBaseCurrencies = async () => {
  const url = "https://api.vatcomply.com/rates?base=USD";
  const res = await fetch(url);
  const data = await res.json();
  return data;
};
