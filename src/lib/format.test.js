import { describe, expect, it } from "vitest";
import {
  formatAmountInput,
  formatMoney,
  formatRate,
  formatUpdatedAt,
  parseAmount,
} from "./format";

describe("parseAmount", () => {
  it.each([
    ["", null],
    ["  ", null],
    ["1", 1],
    ["1500000", 1500000],
    ["1.500.000", 1500000],
    ["1.500", 1500],
    ["1.500.000,50", 1500000.5],
    ["10,5", 10.5],
    ["10.5", 10.5],
    ["10.50", 10.5],
    ["0,25", 0.25],
    [",5", 0.5],
  ])("%j → %j", (input, expected) => {
    expect(parseAmount(input)).toBe(expected);
  });

  it.each(["-5", "abc", "1,2,3", "12a", ".", ","])(
    "%j es inválido",
    (input) => {
      expect(parseAmount(input)).toBeNaN();
    },
  );
});

describe("formatMoney", () => {
  it("usa separadores de Paraguay", () => {
    expect(formatMoney(1234567.891, "USD")).toBe("1.234.567,89");
  });

  it("el guaraní no lleva decimales", () => {
    expect(formatMoney(7312.6, "PYG")).toBe("7.313");
  });

  it("no redondea a cero los valores chicos", () => {
    expect(formatMoney(0.000136789, "USD")).toBe("0,0001368");
  });

  it("muestra un guion si no hay valor", () => {
    expect(formatMoney(NaN, "USD")).toBe("—");
  });
});

describe("formatRate", () => {
  it("muestra hasta 4 decimales", () => {
    expect(formatRate(5.123456)).toBe("5,1235");
    expect(formatRate(0.18765)).toBe("0,1877");
  });
});

describe("formatAmountInput", () => {
  it("se puede volver a leer con parseAmount", () => {
    for (const [value, code] of [
      [1500, "PYG"],
      [1500000, "PYG"],
      [1500, "USD"],
      [10.5, "EUR"],
    ]) {
      expect(parseAmount(formatAmountInput(value, code))).toBe(value);
    }
  });
});

describe("formatUpdatedAt", () => {
  it("una fecha sin hora no se corre al día anterior", () => {
    expect(formatUpdatedAt("2026-10-09T00:00:00Z", "date")).toBe(
      "9 de octubre de 2026",
    );
  });

  it("tolera fechas inválidas", () => {
    expect(formatUpdatedAt("no-es-fecha")).toBeNull();
  });
});

describe("en inglés (en-US)", () => {
  it.each([
    ["1,500,000.50", 1500000.5],
    ["1,500", 1500],
    ["10.5", 10.5],
    ["10,5", 10.5],
    ["1.500", 1.5],
  ])("parseAmount(%j) → %j", (input, expected) => {
    expect(parseAmount(input, "en-US")).toBe(expected);
  });

  it("formatea con coma de miles y punto decimal", () => {
    expect(formatMoney(1234567.891, "USD", "en-US")).toBe("1,234,567.89");
    expect(formatRate(0.18765, "en-US")).toBe("0.1877");
  });

  it("fecha en inglés", () => {
    expect(formatUpdatedAt("2026-10-09T00:00:00Z", "date", "en-US")).toBe(
      "October 9, 2026",
    );
  });

  it("formatAmountInput se puede volver a leer", () => {
    expect(
      parseAmount(formatAmountInput(1500000.5, "USD", "en-US"), "en-US"),
    ).toBe(1500000.5);
  });
});
