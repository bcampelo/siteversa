import { VersaMark } from "@/components/brand/VersaMark";
import { VersaWordmark } from "@/components/brand/VersaWordmark";

/**
 * Preloader — a marca da Versa se monta peça por peça e recua para o lugar
 * dela no cabeçalho. O logo não é um enfeite no canto: é o primeiro gesto
 * da experiência.
 *
 * Renderizado no servidor e animado inteiramente em CSS: zero JavaScript,
 * zero espera por hidratação. Aparece já na primeira pintura e sai na hora
 * marcada, mesmo que o bundle ainda esteja no meio do caminho.
 *
 * Quem decide se ele aparece é o script inline do `layout.tsx`, que marca
 * `data-intro="1"` no <html> antes da primeira pintura — só em desktop, uma
 * vez por sessão e nunca em `prefers-reduced-motion`. Sem esse atributo, o
 * CSS mantém o bloco em `display: none` e ele nunca é pintado.
 */
export function Preloader() {
  return (
    <div
      className="preloader fixed inset-0 z-[90] items-center justify-center bg-ink"
      aria-hidden
    >
      <div
        className="halo pointer-events-none absolute left-1/2 top-1/2 size-[46rem] max-w-[130vw] -translate-x-1/2 -translate-y-1/2 opacity-50 blur-2xl"
        aria-hidden
      />

      <div className="relative flex flex-col items-center gap-7">
        <div className="preloader-mark w-[clamp(4.5rem,12vw,7.5rem)]">
          <VersaMark variant="gradient" intro sweep idKey="preloader" />
        </div>

        <div className="preloader-fade w-[clamp(6rem,15vw,9.5rem)] text-chalk">
          <VersaWordmark className="versa-wordmark--intro" />
        </div>

        <div className="preloader-fade relative h-px w-40 overflow-hidden bg-chalk/12">
          <span className="preloader-bar absolute inset-0 origin-left bg-gradient-to-r from-brand to-brand-soft" />
        </div>
      </div>
    </div>
  );
}
