// localStorage puede no existir o lanzar excepciones (modo privado, cuota llena):
// la app tiene que seguir funcionando igual.
export function readJson(key) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Sin persistencia; no es crítico.
  }
}
