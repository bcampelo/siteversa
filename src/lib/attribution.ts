/**
 * Atribuição.
 *
 * Guarda de onde a pessoa veio na PRIMEIRA visita e não deixa a origem se
 * perder no caminho. Sem isso, um lead que chegou por anúncio no domingo e
 * voltou pelo Google na quarta é contado como busca orgânica, e a campanha
 * paga fica parecendo ruim.
 *
 * Modelo: primeiro toque vence. O último toque também é guardado, separado,
 * porque as duas leituras respondem perguntas diferentes.
 */

const KEY = "versa:attrib";

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  referrer?: string;
  landing_page?: string;
  first_seen?: string;
  last_utm_source?: string;
  last_utm_campaign?: string;
  last_seen?: string;
};

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

function read(): Attribution {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}

function write(data: Attribution): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* navegação privada, cota cheia, storage bloqueado. Segue sem persistir. */
  }
}

/**
 * Roda uma vez por carregamento de página. Preenche o que ainda não existe
 * (primeiro toque) e atualiza sempre o último toque.
 */
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return {};

  const stored = read();
  const url = new URL(window.location.href);
  const now = new Date().toISOString();
  const next: Attribution = { ...stored };

  const incoming: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = url.searchParams.get(key);
    if (value) incoming[key] = value.slice(0, 120);
  }
  const gclid = url.searchParams.get("gclid");
  const fbclid = url.searchParams.get("fbclid");

  // Primeiro toque: só grava o que ainda está vazio.
  if (!stored.first_seen) {
    next.first_seen = now;
    next.landing_page = url.pathname.slice(0, 200);
    const ref = document.referrer;
    if (ref && !ref.includes(url.host)) next.referrer = ref.slice(0, 200);
    Object.assign(next, incoming);
    if (gclid) next.gclid = gclid.slice(0, 200);
    if (fbclid) next.fbclid = fbclid.slice(0, 200);
  }

  // Último toque: sobrescreve sempre que a visita trouxer origem nova.
  if (incoming.utm_source) next.last_utm_source = incoming.utm_source;
  if (incoming.utm_campaign) next.last_utm_campaign = incoming.utm_campaign;
  next.last_seen = now;

  write(next);
  return next;
}

export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  return read();
}

/** Verdadeiro quando a visita chegou por link marcado. Usado para cortar a intro. */
export function isPaidVisit(): boolean {
  if (typeof window === "undefined") return false;
  const p = new URLSearchParams(window.location.search);
  return Boolean(
    p.get("utm_source") || p.get("gclid") || p.get("fbclid") || p.get("utm_campaign"),
  );
}
