"use client";

import { useEffect, useState } from "react";

/**
 * useMediaQuery — decide comportamento (não só estilo) por viewport.
 * Começa em `false` para não divergir na hidratação: efeitos de scroll
 * pesados só ligam depois que o cliente confirma que há espaço para eles.
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return matches;
}
