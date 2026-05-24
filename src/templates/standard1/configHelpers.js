// ─────────────────────────────────────────────────────────────────────────────
// configHelpers.js
// Helpers puros extraídos de standard1.jsx — FASE 6, Paso 1
// NO modificar comportamiento. Solo reubicación.
// ─────────────────────────────────────────────────────────────────────────────

export function generateCode() {
  return "XV-SOFIA-" + Math.random().toString(36).slice(2, 6).toUpperCase();
}

export async function getClientIP() {
  try {
    const r = await fetch("https://api.ipify.org?format=json");
    const d = await r.json();
    return d.ip;
  } catch {
    return "N/A";
  }
}

export const emptyGuest = () => ({
  name: "",
  surname: "",
  attending: "yes",
  diet: "Ninguno",
  song: "",
});
