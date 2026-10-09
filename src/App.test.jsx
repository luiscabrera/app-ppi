import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { CACHE_KEY } from "./hooks/useExchangeRates";
import { erApiResponse, jsonResponse } from "./test/fixtures";

const mockApi = () =>
  vi
    .spyOn(globalThis, "fetch")
    .mockImplementation(() => jsonResponse(erApiResponse));

const result = () => screen.getByTestId("result");

describe("App", () => {
  it("muestra la conversión por defecto de USD a PYG", async () => {
    mockApi();
    render(<App />);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Cargando cotizaciones",
    );
    expect(await screen.findByText("1 USD = 7.100 PYG")).toBeInTheDocument();
    expect(result()).toHaveTextContent("7.100 PYG");
  });

  it("convierte al escribir un monto con separadores", async () => {
    mockApi();
    const user = userEvent.setup();
    render(<App />);
    const input = await screen.findByLabelText("Monto");
    await user.clear(input);
    await user.type(input, "1.000,50");
    expect(result()).toHaveTextContent("7.103.550 PYG");
  });

  it("valida montos inválidos", async () => {
    mockApi();
    const user = userEvent.setup();
    render(<App />);
    const input = await screen.findByLabelText("Monto");
    await user.clear(input);
    await user.type(input, "abc");
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Ingresá un monto válido",
    );
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("invierte las monedas con el botón", async () => {
    mockApi();
    const user = userEvent.setup();
    render(<App />);
    await user.click(
      await screen.findByRole("button", { name: "Invertir monedas" }),
    );
    expect(screen.getByLabelText("De")).toHaveValue("PYG");
    expect(screen.getByLabelText("A")).toHaveValue("USD");
    expect(screen.getByText("1 PYG = 0,0001408 USD")).toBeInTheDocument();
  });

  it("elegir la misma moneda en ambos lados las invierte", async () => {
    mockApi();
    const user = userEvent.setup();
    render(<App />);
    await user.selectOptions(await screen.findByLabelText("De"), "PYG");
    expect(screen.getByLabelText("De")).toHaveValue("PYG");
    expect(screen.getByLabelText("A")).toHaveValue("USD");
  });

  it("muestra el equivalente en las otras monedas", async () => {
    mockApi();
    render(<App />);
    const list = await screen.findByRole("list");
    expect(list).toHaveTextContent("Euro0,86 EUR");
    expect(list).toHaveTextContent("Real brasileño5,40 BRL");
    expect(list).toHaveTextContent("Peso argentino1.400,00 ARS");
    expect(list).toHaveTextContent("Guaraní paraguayo7.100 PYG");
  });

  it("si no hay red ni caché muestra el error y permite reintentar", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockRejectedValue(new TypeError("offline"));
    const user = userEvent.setup();
    render(<App />);
    expect(
      await screen.findByText("No pudimos obtener las cotizaciones"),
    ).toBeInTheDocument();

    fetchMock.mockImplementation(() => jsonResponse(erApiResponse));
    await user.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(await screen.findByText("1 USD = 7.100 PYG")).toBeInTheDocument();
  });

  it("usa la caché si es reciente y no llama a la API", async () => {
    const fetchMock = mockApi();
    window.localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        fetchedAt: Date.now(),
        data: {
          rates: { USD: 1, EUR: 0.9, BRL: 5, ARS: 1350, PYG: 7000 },
          updatedAt: "2026-10-09T00:00:00Z",
          precision: "date",
          source: { name: "Cache", homepage: "https://example.com" },
        },
      }),
    );
    render(<App />);
    expect(screen.getByText("1 USD = 7.000 PYG")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("con caché vieja y sin red, sigue funcionando y avisa", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("offline"));
    window.localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        fetchedAt: Date.now() - 24 * 60 * 60 * 1000,
        data: {
          rates: { USD: 1, EUR: 0.9, BRL: 5, ARS: 1350, PYG: 7000 },
          updatedAt: "2026-10-08T00:00:00Z",
          precision: "date",
          source: { name: "Cache", homepage: "https://example.com" },
        },
      }),
    );
    render(<App />);
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No se pudo actualizar",
    );
    expect(screen.getByText("1 USD = 7.000 PYG")).toBeInTheDocument();
  });

  it("recuerda las monedas elegidas", async () => {
    mockApi();
    const user = userEvent.setup();
    const { unmount } = render(<App />);
    await user.selectOptions(await screen.findByLabelText("A"), "BRL");
    unmount();
    render(<App />);
    expect(await screen.findByLabelText("A")).toHaveValue("BRL");
  });

  it("convierte entre peso argentino y guaraní", async () => {
    mockApi();
    const user = userEvent.setup();
    render(<App />);
    await user.selectOptions(await screen.findByLabelText("De"), "ARS");
    const input = screen.getByLabelText("Monto");
    await user.clear(input);
    await user.type(input, "100.000");
    // 100.000 ARS / 1.400 * 7.100 = 507.142,86 PYG
    expect(result()).toHaveTextContent("507.143 PYG");
    expect(screen.getByText(/tipo de cambio oficial/)).toBeInTheDocument();
  });

  it("descarta una caché vieja que no tiene el peso argentino", async () => {
    const fetchMock = mockApi();
    window.localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        fetchedAt: Date.now(),
        data: {
          rates: { USD: 1, EUR: 0.9, BRL: 5, PYG: 7000 },
          updatedAt: "2026-10-09T00:00:00Z",
          precision: "date",
          source: { name: "Cache", homepage: "https://example.com" },
        },
      }),
    );
    render(<App />);
    expect(await screen.findByText("1 USD = 7.100 PYG")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalled();
  });
});
