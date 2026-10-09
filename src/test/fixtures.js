export const erApiResponse = {
  result: "success",
  time_last_update_unix: 1791504001,
  base_code: "USD",
  rates: { USD: 1, ARS: 1400, BRL: 5.4, CLP: 950, EUR: 0.86, PYG: 7100 },
};

export const currencyApiResponse = {
  date: "2026-10-09",
  usd: { ars: 1450, brl: 5.5, clp: 960, eur: 0.87, pyg: 7200, usd: 1 },
};

export function jsonResponse(body, status = 200) {
  return Promise.resolve(new Response(JSON.stringify(body), { status }));
}
