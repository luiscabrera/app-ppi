# Conversor de monedas

Conversor entre **dólares (USD), euros (EUR), reales (BRL), pesos argentinos (ARS) y guaraníes (PYG)** con la
cotización del día.

**Online:** https://luiscabrera.github.io/app-ppi/

Es una SPA en React, sin backend: el navegador consulta directamente una
API pública de cotizaciones.

## Funcionalidades

- Conversión entre cualquier par de las 5 monedas, cruzando por USD con una sola consulta.
- Equivalente del monto en las otras cuatro monedas, a la vista.
- Formato de Paraguay (`1.500.000,50`); el guaraní se muestra sin decimales.
- El campo de monto acepta `1.500.000`, `1500000`, `10,50` o `10.50`.
- Botón para invertir las monedas. Elegir la misma moneda en ambos lados también las invierte.
- Recuerda el monto y las monedas elegidas.
- Las cotizaciones se guardan una hora en el navegador. Sin conexión, se siguen mostrando
  las últimas guardadas, con un aviso.
- Fuente de respaldo automática si la principal falla, con reintento.
- Accesible (labels, `aria-*`, foco visible), responsive y con modo oscuro.

## Fuentes de datos

Las tasas del Banco Central Europeo (que usaba la versión original vía vatcomply) **no incluyen
el guaraní ni el peso argentino**, así que se usan estas fuentes, gratuitas y sin API key:

1. [ExchangeRate-API](https://www.exchangerate-api.com) (`open.er-api.com`): actualiza una vez
   por día.
2. [Currency API](https://github.com/fawazahmed0/exchange-api) (jsDelivr y su espejo en
   Cloudflare): se usa como respaldo.

Son cotizaciones de referencia (tipo medio del mercado): sirven como guía, pero no son el valor
de compra o venta de un banco o una casa de cambios. Para el peso argentino es el tipo de cambio
oficial: no refleja el dólar blue, MEP ni otras cotizaciones paralelas.

## Uso

Requisitos: Node.js 20 o superior.

```bash
npm install
npm run dev        # desarrollo en http://localhost:5173
npm test           # tests (Vitest + Testing Library)
npm run lint       # ESLint
npm run build      # build de producción en dist/
npm run preview    # sirve el build localmente
```

`dist/` usa rutas relativas, así que se puede publicar en cualquier hosting estático (GitHub
Pages, Netlify, Vercel, una subcarpeta de un servidor, etc.).

## Publicación (GitHub Pages)

Cada push a `master` dispara el workflow `.github/workflows/pages.yml`, que corre lint, tests y
build y, si todo pasa, publica `dist/` en GitHub Pages. También se puede lanzar a mano desde la
pestaña **Actions → Publicar en GitHub Pages → Run workflow**.

Configuración inicial (una sola vez): **Settings → Pages → Build and deployment → Source:
GitHub Actions**.

## Estructura

```
src/
├── config/currencies.js     monedas soportadas (código, nombre, bandera, decimales)
├── api/rates.js             fuentes de cotizaciones, validación y respaldo
├── hooks/
│   ├── useExchangeRates.js  carga, caché, errores y actualización
│   └── usePersistentState.js
├── lib/
│   ├── convert.js           conversión por cruce contra USD
│   ├── format.js            formateo y lectura de montos y fechas (es-PY)
│   └── storage.js           localStorage tolerante a fallos
├── components/              UI con CSS Modules
├── App.jsx
└── main.jsx
```

Para agregar una moneda alcanza con sumarla en `src/config/currencies.js`, siempre que la fuente
de datos la publique.

## Plan de mejoras

### Hecho

| #   | Mejora                                                                        | Motivo                                                                              |
| --- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| 1   | Cambio de fuente de datos y fuente de respaldo                                | El BCE no publica PYG; antes, si la API caía, la app quedaba cargando para siempre. |
| 2   | Monedas acotadas a USD, EUR, BRL, ARS y PYG, con nombres en español           | Alcance del proyecto.                                                               |
| 3   | Validación de la respuesta de la API                                          | Si faltaba una tasa, la app se rompía.                                              |
| 4   | Estados de carga, error con reintento y caché sin conexión                    | No había manejo de errores.                                                         |
| 5   | Fecha de actualización correcta                                               | La original decía "UTC" pero mostraba la hora local, y corría la fecha un día.      |
| 6   | Formato y lectura de montos de Paraguay con `Intl.NumberFormat`               | Se usaba `toFixed(6)`, sin separadores de miles.                                    |
| 7   | Migración de Create React App (deprecado) a Vite                              | Build más rápido y con mantenimiento activo.                                        |
| 8   | CSS Modules y variables de diseño, modo oscuro                                | Las clases globales (`.label`, `.container`) chocaban entre sí.                     |
| 9   | Lógica separada en hooks y funciones puras                                    | Antes los cálculos estaban mezclados con la vista y había prop drilling.            |
| 10  | Accesibilidad: `<label>`, `aria-label`, `aria-live`, `prefers-reduced-motion` | Antes los lectores de pantalla no podían usarla.                                    |
| 11  | Fuente Inter en WOFF2 (`@fontsource`)                                         | Antes se cargaban 9 archivos TTF y el texto normal salía en "Thin".                 |
| 12  | Tests (45), ESLint, Prettier y CI en GitHub Actions                           | No había tests.                                                                     |
| 13  | Limpieza de código y dependencias sin uso                                     |                                                                                     |
| 14  | Publicación automática en GitHub Pages                                        | Tener la app online con cada cambio.                                                |

### Ideas a futuro

- Cotización de compra y venta de casas de cambio locales (requiere una fuente o backend propio,
  porque no hay una API pública confiable).
- Gráfico histórico de cada par.
- PWA instalable con funcionamiento offline completo.

## Licencia

MIT
