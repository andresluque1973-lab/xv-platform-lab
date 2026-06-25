// ─────────────────────────────────────────────────────────────────────────────
// src/templates/shared/hooks.js
// Hooks compartidos entre familias de templates VELA.
// Extraído en FASE 14 — DEUDA-002.
// Condición de inclusión: lógica no trivial + uso verificado en ≥2 templates.
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";

export function useCountdown(targetDate) {
  const [t, setT] = useState({});
  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) return setT({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setT({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000)  / 60000),
        seconds: Math.floor((diff % 60000)    / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return t;
}
