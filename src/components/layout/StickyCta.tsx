"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CTA } from "@/lib/site";
import { whatsappUrl } from "@/lib/whatsapp";

/** Rotas que já são, elas mesmas, uma conversão. */
const OCULTA_EM = ["/diagnostico", "/obrigado"];

/** Fora da home não há hero: a barra entra depois desta rolagem. */
const SCROLL_FALLBACK = 700;

/**
 * Pílula fixa de WhatsApp no celular.
 *
 * Aparece depois que o hero (`#hero`) sai da tela e some quando o
 * fechamento (`#fechamento`) entra, porque ali já existe o mesmo botão.
 * Nas rotas sem hero usa a rolagem. Só até 760px: acima disso o cabeçalho
 * já traz o botão.
 */
export function StickyCta() {
  const pathname = usePathname();
  // O estado leva a rota a que pertence. A navegação entre rotas não desmonta
  // este componente, e sem isso o fechamento ou o hero da página anterior
  // ficariam valendo na nova (a pílula nunca apareceria em /servicos).
  const [seen, setSeen] = useState({ path: pathname, hero: true, end: false });
  const atual = seen.path === pathname ? seen : { path: pathname, hero: true, end: false };

  useEffect(() => {
    const hero = document.getElementById("hero");
    const end = document.getElementById("fechamento");
    const cleanups: Array<() => void> = [];
    const patch = (parte: { hero?: boolean; end?: boolean }) =>
      setSeen((prev) => ({
        ...(prev.path === pathname
          ? prev
          : { path: pathname, hero: true, end: false }),
        ...parte,
      }));

    if (hero || end) {
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (e.target === hero) patch({ hero: e.isIntersecting });
          else patch({ end: e.isIntersecting });
        }
      });
      if (hero) io.observe(hero);
      if (end) io.observe(end);
      cleanups.push(() => io.disconnect());
    }

    if (!hero) {
      const onScroll = () => patch({ hero: window.scrollY <= SCROLL_FALLBACK });
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanups.push(() => window.removeEventListener("scroll", onScroll));
    }

    return () => cleanups.forEach((fn) => fn());
  }, [pathname]);

  if (OCULTA_EM.includes(pathname)) return null;

  const visible = !atual.hero && !atual.end;

  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
      className={`fixed inset-x-6 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[60] mx-auto flex max-w-[420px] [transition-property:translate,opacity] [transition-duration:.45s] [transition-timing-function:cubic-bezier(.2,.8,.2,1)] tab:hidden ${
        visible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"
      }`}
    >
      <Button
        href={whatsappUrl("sticky-mobile")}
        external
        section="sticky-mobile"
        ctaLabel={CTA.falar}
        className="w-full shadow-[0_16px_40px_-16px_var(--color-ink)]"
      >
        {CTA.falar}
      </Button>
    </div>
  );
}
