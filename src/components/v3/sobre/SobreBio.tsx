import {
  DrawGroup,
  Hand,
  Pen,
  RevealTitle,
  Underline,
  cssVars,
} from "@/components/v3/ink";
import { SOBRE } from "@/lib/content-v3";

const { bio } = SOBRE;

/**
 * Bio e lista de credenciais. Título e texto à esquerda, quatro itens à
 * direita. Cada item entra da direita e, embaixo dele, uma linha de caneta
 * se desenha. O número à mão é o algarismo romano de cada item.
 */
export function SobreBio() {
  return (
    // Padding inferior 134px (não 144): fecha a distância até o título do fechamento como no print aprovado
    <section className="py-24 tab:pt-36 tab:pb-[134px]">
      <DrawGroup className="wrap grid items-start gap-x-24 gap-y-14 desk:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="min-w-0">
          <RevealTitle className="max-w-[14ch] font-display text-[40px] leading-none font-medium tracking-[-0.04em] text-balance [overflow-wrap:break-word] tab:text-[56px]">
            {bio.title.before}
            <Underline d="M3 13 C 70 5, 160 16, 297 7">
              {bio.title.underlined}
            </Underline>
            {bio.title.after}
          </RevealTitle>
          <p className="mt-8 max-w-[36ch] text-[17px] leading-[1.55] text-fog">
            {bio.text}
          </p>
        </div>

        <ul className="min-w-0">
          {bio.items.map((item, i) => {
            // Cada item entra .2s depois do anterior; a linha se desenha ao fim da entrada dele
            const delay = Math.round((0.3 + i * 0.2) * 10) / 10;
            return (
              <li
                key={item.num}
                className="sb-item relative grid grid-cols-[56px_minmax(0,1fr)] gap-x-4 py-[39px] tab:grid-cols-[96px_minmax(0,1fr)]"
                style={cssVars({ "--d": `${delay}s` })}
              >
                <Hand delay={delay + 0.1} className="text-[34px]">
                  {item.num}.
                </Hand>
                <div className="min-w-0">
                  <h3 className="font-display text-[26px] leading-[1.1] font-medium tracking-[-0.04em] text-balance [overflow-wrap:break-word] tab:text-[30px]">
                    {item.title}
                  </h3>
                  <p className="mt-[11px] max-w-[485px] text-[16px] leading-[1.55] text-fog">
                    {item.text}
                  </p>
                </div>
                <svg
                  className="pointer-events-none absolute right-0 bottom-0 left-0 h-[6px] w-full overflow-visible"
                  viewBox="0 0 588 6"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <Pen
                    d="M0 3 C 150 1, 330 5, 588 2"
                    thin
                    tone="fog"
                    delay={delay + 0.4}
                    dur={1}
                  />
                </svg>
              </li>
            );
          })}
        </ul>
      </DrawGroup>
    </section>
  );
}
