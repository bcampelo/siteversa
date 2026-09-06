import { VersaMark } from "@/components/brand/VersaMark";
import { VersaWordmark } from "@/components/brand/VersaWordmark";
import { SERVICES } from "@/lib/content";
import { SITE } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-chalk/8 bg-ink-2">
      <div className="shell py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.9fr_0.9fr_1fr]">
          {/* Marca */}
          <div>
            <div className="group/logo flex items-center gap-3">
              <span className="block w-9">
                <VersaMark variant="gradient" idKey="footer" />
              </span>
              <span className="block w-20 text-chalk">
                <VersaWordmark title="Versa" />
              </span>
            </div>
            <p className="mt-6 max-w-[34ch] text-[0.875rem] leading-relaxed text-fog">
              Empresa de tecnologia. Design, engenharia e mídia paga trabalhando
              juntos para fazer marcas crescerem.
            </p>
            <p className="mt-6 text-eyebrow text-fog-dim">
              {SITE.city} · {SITE.state} — atendimento remoto no Brasil
            </p>
          </div>

          {/* Serviços */}
          <nav aria-label="Serviços">
            <p className="text-eyebrow text-fog-dim">Serviços</p>
            <ul className="mt-5 flex flex-col gap-3">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <a
                    href="#servicos"
                    className="link-underline text-[0.875rem] text-fog transition-colors duration-300 hover:text-chalk"
                  >
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Navegação */}
          <nav aria-label="Seções do site">
            <p className="text-eyebrow text-fog-dim">Navegar</p>
            <ul className="mt-5 flex flex-col gap-3">
              {SITE.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="link-underline text-[0.875rem] text-fog transition-colors duration-300 hover:text-chalk"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contato */}
          <div>
            <p className="text-eyebrow text-fog-dim">Contato</p>
            <ul className="mt-5 flex flex-col gap-3 text-[0.875rem]">
              <li>
                <a
                  href={SITE.contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-chalk"
                >
                  {SITE.contact.whatsappDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.contact.email}`}
                  className="link-underline break-all text-fog transition-colors duration-300 hover:text-chalk"
                >
                  {SITE.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={SITE.contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-fog transition-colors duration-300 hover:text-chalk"
                >
                  Instagram {SITE.contact.instagramHandle}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-chalk/8 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.75rem] text-fog-dim">
            © {year} {SITE.name}. Todos os direitos reservados.
          </p>
          <p className="flex items-center gap-2 text-[0.75rem] text-fog-dim">
            Site desenhado e desenvolvido pela Versa
            <span aria-hidden className="size-1 rounded-full bg-brand/60" />
            <span className="font-mono">Next.js · TypeScript</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
