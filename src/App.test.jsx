import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import I18nProvider from "./i18n/I18nProvider";
import { CACHE_KEY } from "./hooks/useExchangeRates";
import { erApiResponse, jsonResponse } from "./test/fixtures";

const mockApi = () =>
  vi
    .spyOn(globalThis, "fetch")
    .mockImplementation(() => jsonResponse(erApiResponse));

const renderApp = () =>
  render(
    <I18nProvider>
      <App />
    </I18nProvider>,
  );

const result = () => screen.getByTestId("result");

describe("App", () => {
  it("muestra la conversión por defecto de USD a PYG", async () => {
    mockApi();
    renderApp();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Cargando cotizaciones",
    );
    expect(await screen.findByText("1 USD = 7.100 PYG")).toBeInTheDocument();
    expect(result()).toHaveTextContent("7.100 PYG");
  });

  it("convierte al escribir un monto con separadores", async () => {
    mockApi();
    const user = userEvent.setup();
    renderApp();
    const input = await screen.findByLabelText("Monto");
    await user.clear(input);
    await user.type(input, "1.000,50");
    expect(result()).toHaveTextContent("7.103.550 PYG");
  });

  it("valida montos inválidos", async () => {
    mockApi();
    const user = userEvent.setup();
    renderApp();
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
    renderApp();
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
    renderApp();
    await user.selectOptions(await screen.findByLabelText("De"), "PYG");
    expect(screen.getByLabelText("De")).toHaveValue("PYG");
    expect(screen.getByLabelText("A")).toHaveValue("USD");
  });

  it("muestra el equivalente en las otras monedas", async () => {
    mockApi();
    renderApp();
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
    renderApp();
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
    renderApp();
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
    renderApp();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No se pudo actualizar",
    );
    expect(screen.getByText("1 USD = 7.000 PYG")).toBeInTheDocument();
  });

  it("recuerda las monedas elegidas", async () => {
    mockApi();
    const user = userEvent.setup();
    const { unmount } = renderApp();
    await user.selectOptions(await screen.findByLabelText("A"), "BRL");
    unmount();
    renderApp();
    expect(await screen.findByLabelText("A")).toHaveValue("BRL");
  });

  it("convierte entre peso argentino y guaraní", async () => {
    mockApi();
    const user = userEvent.setup();
    renderApp();
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
    renderApp();
    expect(await screen.findByText("1 USD = 7.100 PYG")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalled();
  });

  it("por defecto usa español de Argentina (es-AR)", async () => {
    mockApi();
    renderApp();
    expect(await screen.findByText("1 USD = 7.100 PYG")).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("es-AR");
    expect(
      screen.getByText(/Cotización actualizada el \d+ de octubre de 2026/),
    ).toBeInTheDocument();
  });

  it("cambia a inglés con el botón de la bandera y adapta los números", async () => {
    mockApi();
    const user = userEvent.setup();
    renderApp();
    const input = await screen.findByLabelText("Monto");
    await user.clear(input);
    await user.type(input, "1.500,5");
    await user.click(screen.getByRole("button", { name: /Cambiar a English/ }));

    expect(screen.getByLabelText("Amount")).toHaveValue("1,500.5");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Dollars, euros",
    );
    expect(result()).toHaveTextContent("10,653,550 PYG");
    expect(screen.getByRole("list")).toHaveTextContent(
      "Argentine Peso2,100,700.00 ARS",
    );
    expect(document.documentElement.lang).toBe("en-US");
    expect(document.title).toBe("Currency converter");
    expect(JSON.parse(window.localStorage.getItem("app-ppi:lang"))).toBe("en");

    await user.click(screen.getByRole("button", { name: /Switch to Español/ }));
    expect(screen.getByLabelText("Monto")).toHaveValue("1.500,5");
  });

  it("en inglés interpreta los montos con coma de miles", async () => {
    window.localStorage.setItem("app-ppi:lang", JSON.stringify("en"));
    mockApi();
    const user = userEvent.setup();
    renderApp();
    const input = await screen.findByLabelText("Amount");
    await user.clear(input);
    await user.type(input, "2,000");
    expect(result()).toHaveTextContent("14,200,000 PYG");
  });

  it("el botón de tema alterna entre oscuro y claro y lo recuerda", async () => {
    mockApi();
    const user = userEvent.setup();
    renderApp();
    await user.click(
      await screen.findByRole("button", { name: "Activar modo oscuro" }),
    );
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(JSON.parse(window.localStorage.getItem("app-ppi:theme"))).toBe(
      "dark",
    );

    await user.click(
      screen.getByRole("button", { name: "Activar modo claro" }),
    );
    expect(document.documentElement.dataset.theme).toBe("light");
  });
});
