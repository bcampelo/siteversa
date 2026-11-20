import { DrawGroup, RevealTitle, Underline } from "@/components/v3/ink";
import { TRABALHOS } from "@/lib/content-v3";
import { Arasuper } from "./trabalhos/Arasuper";
import { Sampaio } from "./trabalhos/Sampaio";
import { Translima } from "./trabalhos/Translima";

/** Os três clientes, cada um com a estátua dele e as peças que a Versa fez. */
export function Trabalhos() {
  return (
    // Sem padding em cima: o Servicos já fecha com o dele (como na referência)
    <section id="trabalhos" className="pb-24 tab:pb-36">
      <div className="wrap">
        <DrawGroup className="mb-12 grid items-end gap-x-16 gap-y-4 tab:mb-24 tab:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <RevealTitle className="max-w-[16ch] min-w-0 font-display text-[40px] leading-none font-medium tracking-[-0.04em] text-balance [overflow-wrap:break-word] tab:text-[64px]">
            {TRABALHOS.title.before}
            <Underline d="M3 9 C 90 16, 190 4, 297 12">
              {TRABALHOS.title.underlined}
            </Underline>
          </RevealTitle>
          <p className="max-w-[40ch] text-[17px] leading-[1.55] text-fog">{TRABALHOS.lede}</p>
        </DrawGroup>

        <Sampaio />
        <Translima />
        <Arasuper />
      </div>
    </section>
  );
}
