import { DrawGroup, Hand, Underline } from "@/components/v3/ink";
import { SERVICOS } from "@/lib/content-v3";
import { PalcoSites } from "./servicos/PalcoSites";
import { PalcoSocial } from "./servicos/PalcoSocial";
import { PalcoTrafego } from "./servicos/PalcoTrafego";

const { items } = SERVICOS;

/** Os três serviços na ordem da referência, cada um com o palco dele. */
const LINHAS = [
  { ...items.social, Palco: PalcoSocial },
  { ...items.trafego, Palco: PalcoTrafego },
  { ...items.sites, Palco: PalcoSites },
] as const;

export function Servicos() {
  return (
    <section id="servicos" className="py-24 tab:py-36">
      <div className="wrap">
        <DrawGroup className="mb-16 tab:mb-24 grid items-end gap-x-16 gap-y-6 tab:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div className="min-w-0">
            <Hand
              as="p"
              delay={0.2}
              className="mb-4 origin-left text-[34px]"
            >
              {SERVICOS.quote.latin}
              <small className="mt-1 block font-sans text-[14px] text-fog">
                {SERVICOS.quote.translation}
              </small>
            </Hand>
            <h2 className="max-w-[16ch] font-display text-[40px] leading-none font-medium tracking-[-0.04em] text-balance [overflow-wrap:break-word] tab:text-[64px]">
              {SERVICOS.title.before}
              <Underline d="M3 13 C 70 5, 160 16, 297 7">
                {SERVICOS.title.underlined}
              </Underline>
            </h2>
          </div>
          <p className="max-w-[40ch] text-fog">
            {SERVICOS.lede}
            {/* No toque não existe hover, então a dica some abaixo de 1101px */}
            <span className="max-desk:hidden"> {SERVICOS.hoverHint}</span>
          </p>
        </DrawGroup>

        <div>
          {LINHAS.map(({ num, title, text, Palco }) => (
            <article
              key={num}
              className="grid items-center gap-x-16 gap-y-10 border-t border-line-dark py-12 last:border-b tab:py-16 desk:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
            >
              <div className="min-w-0">
                <span className="mb-6 block text-[15px] text-fog">{num}</span>
                <h3 className="mb-4 font-display text-[32px] leading-none font-medium tracking-[-0.04em] text-balance [overflow-wrap:break-word] tab:text-[44px]">
                  {title}
                </h3>
                <p className="max-w-[34ch] text-fog">{text}</p>
              </div>
              <Palco />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
