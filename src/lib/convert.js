// `rates` siempre está expresado contra USD: { USD: 1, EUR: 0.92, PYG: 7300, ... }.
// Cualquier par se calcula cruzando por USD, así alcanza con una sola consulta.
export function convert(amount, from, to, rates) {
  const fromRate = rates[from];
  const toRate = rates[to];
  if (!Number.isFinite(amount) || !fromRate || !toRate) return NaN;
  return (amount / fromRate) * toRate;
}

export function rateBetween(from, to, rates) {
  return convert(1, from, to, rates);
}
