"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { WhatsAppIcon } from "@/components/ui/Button";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { track } from "@/lib/analytics";
import { whatsappUrl } from "@/lib/whatsapp";

/**
 * Barra fixa de ação no celular.
 *
 * O site tinha CTA no topo e no rodapé e nada no meio, o que significa que
 * durante a maior parte da rolagem não havia como agir. No celular, que é de
 * onde vem o tráfego social, esse é o padrão que mais converte.
 *
 * Aparece só depois do hero, para não competir com a primeira impressão, e
 * some nas páginas que já são, elas mesmas, uma conversão.
 */
const OCULTA_EM = ["/diagnostico", "/obrigado"];

export function StickyCta() {
  const pathname = usePathname();
  const [visivel, setVisivel] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => {
    setVisivel(v > 700);
  });

  if (OCULTA_EM.includes(pathname)) return null;

  return (
    <motion.div
      aria-hidden={!visivel}
      initial={false}
      animate={{ y: visivel ? 0 : 100, opacity: visivel ? 1 : 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-3 bottom-3 z-[60] flex gap-2 lg:hidden"
      style={{ pointerEvents: visivel ? "auto" : "none" }}
    >
      <Link
        href="/diagnostico"
        onClick={() =>
          track("cta_click", {
            section: "sticky-mobile",
            label: "Diagnóstico grátis",
          })
        }
        className="flex h-13 flex-1 items-center justify-center rounded-full bg-chalk px-5 text-[0.9375rem] font-medium text-ink shadow-[0_16px_40px_-16px_rgba(0,0,0,0.9)]"
      >
        Diagnóstico grátis
      </Link>
      <TrackedLink
        href={whatsappUrl("sticky-mobile")}
        section="sticky-mobile"
        ctaLabel="WhatsApp"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        className="grid h-13 w-13 shrink-0 place-items-center rounded-full border border-chalk/15 bg-ink-2/90 text-chalk backdrop-blur-xl"
      >
        <WhatsAppIcon className="size-5" />
      </TrackedLink>
    </motion.div>
  );
}
