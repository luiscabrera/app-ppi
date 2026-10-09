import { describe, expect, it, vi } from "vitest";
import { fetchRates, PROVIDERS } from "./rates";
import {
  currencyApiResponse,
  erApiResponse,
  jsonResponse,
} from "../test/fixtures";

describe("fetchRates", () => {
  it("usa la fuente principal y se queda sólo con las 4 monedas", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(() => jsonResponse(erApiResponse));
    const data = await fetchRates();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(data.rates).toEqual({ USD: 1, EUR: 0.86, BRL: 5.4, PYG: 7100 });
    expect(data.updatedAt).toBe(new Date(1791504001 * 1000).toISOString());
    expect(data.precision).toBe("datetime");
    expect(data.source.name).toBe("ExchangeRate-API");
  });

  it("si la principal falla pasa a la de respaldo", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation((url) =>
      url === PROVIDERS[0].url
        ? jsonResponse({}, 500)
        : jsonResponse(currencyApiResponse),
    );
    const data = await fetchRates();
    expect(data.rates).toEqual({ USD: 1, EUR: 0.87, BRL: 5.5, PYG: 7200 });
    expect(data.updatedAt).toBe("2026-10-09T00:00:00Z");
    expect(data.precision).toBe("date");
  });

  it("descarta una respuesta a la que le falta el guaraní", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation((url) =>
      url === PROVIDERS[0].url
        ? jsonResponse({
            ...erApiResponse,
            rates: { USD: 1, EUR: 0.9, BRL: 5 },
          })
        : jsonResponse(currencyApiResponse),
    );
    const data = await fetchRates();
    expect(data.source.name).toBe("Currency API");
  });

  it("prueba el espejo de la fuente de respaldo", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation((url) =>
      url === PROVIDERS[1].mirror
        ? jsonResponse(currencyApiResponse)
        : Promise.reject(new TypeError("Failed to fetch")),
    );
    const data = await fetchRates();
    expect(data.rates.PYG).toBe(7200);
  });

  it("falla con un error claro si ninguna fuente responde", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(
      new TypeError("Failed to fetch"),
    );
    await expect(fetchRates()).rejects.toThrow(
      "No se pudieron obtener las cotizaciones",
    );
  });
});
