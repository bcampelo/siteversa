"use client";

import { ANALYTICS_MODE, PUBLIC_ENV } from "@/lib/env";
import { getAttribution } from "@/lib/attribution";

/* -------------------------------------------------------------------------
   Camada de eventos.

   Um site que vende gestão de tráfego não pode ter clique não contado. Este
   arquivo é a única porta de saída de evento do projeto. Regras:

   1. Nunca lança erro. Analytics quebrado não pode derrubar interface.
   2. Nunca duplica. Se o GTM está configurado, tudo sai por `dataLayer` e o
      `gtag` fica calado, porque o próprio GTM carrega o GA4.
   3. Toda origem viaja junto. Evento sem `section` não serve para decidir
      nada, então `section` é obrigatório na assinatura.
   ------------------------------------------------------------------------- */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { loaded?: boolean };
  }
}

export type EventParams = Record<
  string,
  string | number | boolean | null | undefined
>;

/** Eventos do site. Lista fechada de propósito: nome livre vira bagunça. */
export type VersaEvent =
  | "cta_click"
  | "whatsapp_click"
  | "email_click"
  | "nav_click"
  | "case_open"
  | "faq_open"
  | "tool_start"
  | "tool_step"
  | "tool_result"
  | "form_start"
  | "form_step"
  | "form_abandon"
  | "generate_lead"
  | "scroll_depth"
  | "consent_update"
  | "web_vital";

/** Correspondência com os eventos padrão da Meta. O que não está aqui vira custom. */
const META_STANDARD: Partial<Record<VersaEvent, string>> = {
  generate_lead: "Lead",
  whatsapp_click: "Contact",
  email_click: "Contact",
  tool_result: "ViewContent",
  form_start: "InitiateCheckout",
};

function clean(params: EventParams): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    out[k] = v;
  }
  return out;
}

export function track(
  event: VersaEvent,
  params: EventParams & { section: string },
): void {
  if (typeof window === "undefined") return;

  try {
    const payload = clean({ ...getAttribution(), ...params });

    if (ANALYTICS_MODE === "gtm") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event, ...payload });
    } else if (ANALYTICS_MODE === "gtag" && typeof window.gtag === "function") {
      window.gtag("event", event, payload);
    }

    if (typeof window.fbq === "function") {
      const standard = META_STANDARD[event];
      if (standard) window.fbq("track", standard, payload);
      else window.fbq("trackCustom", event, payload);
    }

    if (process.env.NODE_ENV === "development") {
      // Sem isso não dá para conferir instrumentação enquanto se desenvolve.
      console.debug("[versa:track]", event, payload);
    }
  } catch {
    // Silêncio proposital. Ver comentário no topo do arquivo.
  }
}

/** Conversão do Google Ads. Só dispara se o rótulo estiver configurado. */
export function trackAdsConversion(value?: number): void {
  if (typeof window === "undefined") return;
  const { googleAdsId, googleAdsLeadLabel } = PUBLIC_ENV;
  if (!googleAdsId || !googleAdsLeadLabel) return;
  try {
    window.gtag?.("event", "conversion", {
      send_to: `${googleAdsId}/${googleAdsLeadLabel}`,
      value: value ?? 1,
      currency: "BRL",
    });
  } catch {
    /* idem */
  }
}
