import { describe, expect, it } from "vitest";
import { convert, rateBetween } from "./convert";

const rates = { USD: 1, EUR: 0.9, BRL: 5, PYG: 7500 };

describe("convert", () => {
  it("convierte desde y hacia USD", () => {
    expect(convert(10, "USD", "PYG", rates)).toBe(75000);
    expect(convert(7500, "PYG", "USD", rates)).toBe(1);
  });

  it("cruza dos monedas que no son USD", () => {
    expect(convert(1, "BRL", "PYG", rates)).toBe(1500);
    expect(convert(9, "EUR", "BRL", rates)).toBeCloseTo(50);
  });

  it("devuelve NaN si falta una tasa o el monto no es válido", () => {
    expect(convert(1, "USD", "ARS", rates)).toBeNaN();
    expect(convert(NaN, "USD", "EUR", rates)).toBeNaN();
  });

  it("rateBetween es la conversión de una unidad", () => {
    expect(rateBetween("USD", "BRL", rates)).toBe(5);
  });
});
