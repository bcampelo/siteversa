"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { VersaMark } from "@/components/brand/VersaMark";
import { VersaWordmark } from "@/components/brand/VersaWordmark";
import { Button } from "@/components/ui/Button";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { CTA, SITE } from "@/lib/site";
import { whatsappUrl } from "@/lib/whatsapp";

/** Rolagem a partir da qual o cabeçalho ganha fundo. */
const SCROLL_THRESHOLD = 80;

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}
const scrolledNow = () => window.scrollY > SCROLL_THRESHOLD;
const scrolledOnServer = () => false;

/**
 * Cabeçalho fixo e transparente no topo. As outras rotas já contam com ele
 * `fixed`, então a posição não muda; só o fundo entra depois de 80px.
 *
 * Sem menu hambúrguer: no mobile somem os links de âncora e ficam a marca e
 * o botão pequeno. As outras rotas continuam acessíveis pelo rodapé.
 */
export function Header() {
  const scrolled = useSyncExternalStore(subscribe, scrolledNow, scrolledOnServer);
  const pathname = usePathname();

  return (
    <header
      data-scrolled={scrolled}
      className="fixed inset-x-0 top-0 z-50 border-b border-transparent bg-transparent [transition-property:background-color,border-color] [transition-duration:.22s] data-[scrolled=true]:border-line-dark data-[scrolled=true]:bg-ink"
    >
      <div className="wrap flex h-[88px] items-center justify-between max-tab:h-16">
        <Link
          href="/"
          aria-label="Versa, início"
          className="inline-flex items-center gap-3 text-chalk"
        >
          {/* No desenho as asas levam a tinta da caneta e o resto fica em giz */}
          <span className="block w-[30px] [&_.versa-wing-l]:fill-accent [&_.versa-wing-r]:fill-accent">
            <VersaMark variant="mono" />
          </span>
          <span className="block w-[3.6rem]">
            <VersaWordmark title="Versa" />
          </span>
        </Link>

        <nav
          aria-label="Principal"
          className="flex items-center gap-10 max-tab:gap-0"
        >
          {SITE.nav.map((item) => (
            <TrackedLink
              key={item.href}
              href={item.href}
              // O link Sobre é medido como header, como pede a spec (4.8)
              section={item.href === "/sobre" ? "header" : "header-nav"}
              ctaLabel={item.label}
              // Só rotas inteiras podem estar ativas; as âncoras da home não
              aria-current={item.href === pathname ? "page" : undefined}
              className="text-[0.9375rem] text-fog [transition:color_.22s] hover:text-chalk aria-[current=page]:text-chalk max-tab:hidden"
            >
              {item.label}
            </TrackedLink>
          ))}
          <Button
            href={whatsappUrl("header")}
            external
            size="sm"
            section="header"
            ctaLabel={CTA.falar}
          >
            {CTA.falar}
          </Button>
        </nav>
      </div>
    </header>
  );
}
