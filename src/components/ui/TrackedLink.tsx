"use client";

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { track, type VersaEvent } from "@/lib/analytics";
import { getAttribution } from "@/lib/attribution";
import { withCampaignTag } from "@/lib/whatsapp";

/**
 * Link comum, contado.
 *
 * Serve para os pontos de contato que não são botão: número no rodapé,
 * link do FAQ, item de navegação. Mesma lógica do Button, sem estilo
 * embutido, para não brigar com o layout de cada lugar.
 */
export function TrackedLink({
  href,
  section,
  ctaLabel,
  event,
  children,
  onClick,
  ...rest
}: {
  href: string;
  section: string;
  ctaLabel?: string;
  event?: VersaEvent;
  children: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children">) {
  const isWhatsApp = href.includes("wa.me");
  const isMail = href.startsWith("mailto");

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    // Ver o comentário equivalente em Button.tsx.
    if (isWhatsApp) {
      const a = getAttribution();
      e.currentTarget.href = withCampaignTag(
        href,
        a.utm_campaign ?? a.last_utm_campaign,
        section,
      );
    }

    track(
      event ??
        (isWhatsApp ? "whatsapp_click" : isMail ? "email_click" : "nav_click"),
      { section, label: ctaLabel, destino: href },
    );
    onClick?.(e);
  }

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
