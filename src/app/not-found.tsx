import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Burst, DrawGroup, Engraving, Hand } from "@/components/v3/ink";
import { NOT_FOUND } from "@/lib/content-v3";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false, follow: true },
};

/**
 * 404.
 *
 * Quem chegou aqui errou o caminho, não a intenção. A página diz isso em
 * uma frase e devolve para o início, com o Atlas carregando a caixa que não
 * chegou. Mesma linguagem da home: gravura, raios e nota à mão.
 */
export default function NotFound() {
  return (
    <section className="relative flex min-h-svh items-center overflow-clip py-32">
      <DrawGroup className="wrap relative w-full">
        {/* Atlas à direita; no celular fica atrás do texto, mais apagado */}
        <div className="pointer-events-none absolute top-1/2 right-[-60px] h-[560px] w-[360px] -translate-y-1/2 opacity-40 tab:right-0 tab:opacity-100">
          <Burst
            viewBox="0 0 360 560"
            cx={180}
            cy={190}
            r={150}
            n={72}
            min={20}
            max={90}
            seed={17}
            opacity={0.45}
            delay={0.2}
            dur={1.8}
            className="inset-0 h-full w-full"
          />
          <Engraving
            src="/v3/atlas.webp"
            alt={NOT_FOUND.statueAlt}
            width={360}
            height={560}
            className="absolute inset-0 h-full w-full"
          />
          <Hand
            delay={1}
            className="absolute top-[-4px] right-[10px] z-[3] text-[22px] whitespace-nowrap max-tab:hidden"
          >
            {NOT_FOUND.note}
          </Hand>
        </div>

        <div className="relative max-w-[640px]">
          <h1 className="max-w-[12ch] font-display text-[46px] leading-none font-medium tracking-[-0.04em] text-balance [overflow-wrap:break-word] tab:text-[72px] tab:leading-[0.98]">
            {NOT_FOUND.title}
          </h1>
          <p className="mt-6 mb-10 max-w-[34ch] text-[20px] text-fog">
            {NOT_FOUND.text}
          </p>
          <Button
            href="/"
            variant="ghost"
            section="404"
            ctaLabel={NOT_FOUND.button}
          >
            {NOT_FOUND.button}
          </Button>
          {/* No celular a nota fica aqui, porque a do Atlas está escondida */}
          <Hand as="p" delay={1} className="mt-8 text-[22px] tab:hidden">
            {NOT_FOUND.note}
          </Hand>
        </div>
      </DrawGroup>
    </section>
  );
}
