import { useState, useEffect } from "react";

/**
 * Carga /clientes/{slug}/config.json
 * @returns {{ config: object|null, error: string|null }}
 */
export function useConfig(slug = "sofia") {
  const [config, setConfig] = useState(null);
  const [error,  setError]  = useState(null);

  useEffect(() => {
    fetch(`/clientes/${slug}/config.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setConfig)
      .catch((err) => {
        console.error("[useConfig] No se pudo cargar config:", err);
        setError(err.message);
      });
  }, [slug]);

  return { config, error };
}
