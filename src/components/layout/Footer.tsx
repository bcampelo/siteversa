import { VersaMark } from "@/components/brand/VersaMark";
import { VersaWordmark } from "@/components/brand/VersaWordmark";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { RODAPE } from "@/lib/content-v3";
import { SITE } from "@/lib/site";
import { whatsappUrl } from "@/lib/whatsapp";

const link = "[transition:color_.22s] hover:text-chalk";

/**
 * Rodapé da referência: marca, links e direitos numa linha só. Embaixo vai
 * uma segunda linha, mais discreta, com o que a referência não mostra mas o
 * site precisa: as rotas fora da home e o WhatsApp (origem `footer`).
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="text-[0.9375rem] text-fog">
      <div className="wrap flex items-center justify-between gap-6 border-t border-line-dark py-10 max-tab:flex-col max-tab:items-start">
        <TrackedLink
          href="/"
          section="footer-nav"
          ctaLabel="Início"
          aria-label="Versa, início"
          className="inline-flex items-center gap-3 text-chalk"
        >
          <span className="block w-[26px] [&_.versa-wing-l]:fill-accent [&_.versa-wing-r]:fill-accent">
            <VersaMark variant="mono" />
          </span>
          <span className="block w-[3.6rem]">
            <VersaWordmark title="Versa" />
          </span>
        </TrackedLink>

        <nav
          aria-label="Rodapé"
          className="flex flex-wrap gap-x-6 gap-y-2"
        >
          {RODAPE.links.map((item) => (
            <TrackedLink
              key={item.href}
              href={item.href}
              // O link Sobre é medido como footer, como pede a spec (4.8)
              section={item.href === "/sobre" ? "footer" : "footer-nav"}
              event="nav_click"
              ctaLabel={item.label}
              className={link}
            >
              {item.label}
            </TrackedLink>
          ))}
          <TrackedLink
            href={SITE.contact.instagram}
            section="footer-nav"
            ctaLabel="Instagram"
            target="_blank"
            rel="noopener noreferrer"
            className={link}
          >
            {RODAPE.instagram}
          </TrackedLink>
        </nav>

        <span>
          © {year} {RODAPE.copyright}
        </span>
      </div>

      <div className="wrap flex flex-wrap items-center gap-x-6 gap-y-2 pb-10 text-[0.875rem] text-fog-dim max-tab:-mt-4">
        <nav aria-label="Outras páginas" className="flex flex-wrap gap-x-6 gap-y-2">
          {RODAPE.more.map((item) => (
            <TrackedLink
              key={item.href}
              href={item.href}
              section="footer-nav"
              ctaLabel={item.label}
              className={link}
            >
              {item.label}
            </TrackedLink>
          ))}
        </nav>
        <TrackedLink
          href={whatsappUrl("footer")}
          section="footer"
          ctaLabel="WhatsApp"
          target="_blank"
          rel="noopener noreferrer"
          className={link}
        >
          {SITE.contact.whatsappDisplay}
        </TrackedLink>
      </div>
    </footer>
  );
}
