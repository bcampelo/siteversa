import { SectionHeading } from "@/components/layout/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/Spotlight";
import { DIFFERENTIALS, type Differential } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Bento com encaixe perfeito: em `lg` a grade tem 4 colunas — as duas
 * primeiras células ocupam 2 colunas cada (primeira fileira cheia) e as
 * quatro restantes uma coluna cada (segunda fileira cheia). Nenhum buraco,
 * hierarquia preservada. Em `md` são 2 colunas iguais.
 */
const SPAN: Record<Differential["span"], string> = {
  wide: "lg:col-span-2",
  tall: "lg:col-span-2",
  normal: "",
};

export function Differentials() {
  return (
    <section id="diferenciais" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="shell">
        <SectionHeading
          index="03"
          eyebrow="Por que a Versa"
          title={
            <>
              O que muda quando o time é{" "}
              <span className="text-gradient">de tecnologia.</span>
            </>
          }
          lede="Design e mídia paga qualquer um oferece. A diferença está em como as decisões são tomadas — e em quem está do outro lado da mesa."
        />

        <RevealGroup
          className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          stagger={0.06}
        >
          {DIFFERENTIALS.map((item) => (
            <RevealItem key={item.title} className={cn("flex", SPAN[item.span])}>
              <SpotlightCard
                as="article"
                className="group/cell relative flex w-full min-h-60 flex-col justify-between overflow-hidden rounded-2xl border border-chalk/8 bg-ink-2 p-6 transition-colors duration-500 hover:border-brand-soft/25 sm:p-7"
              >
                <BentoVisual kind={item.visual} />
                <div className="relative">
                  <h3 className="text-subtitle text-balance">{item.title}</h3>
                  <p className="mt-3 max-w-[42ch] text-[0.875rem] leading-relaxed text-fog">
                    {item.body}
                  </p>
                </div>
              </SpotlightCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* =========================================================================
   Micro-visuais do bento — cada célula ganha um sinal visual próprio.
   ========================================================================= */

function BentoVisual({ kind }: { kind: Differential["visual"] }) {
  if (kind === "grid") {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
      >
        <div className="bg-grid absolute inset-0 [background-size:32px_32px] [mask-image:radial-gradient(80%_60%_at_80%_10%,black,transparent)]" />
        <svg
          viewBox="0 0 200 120"
          className="absolute right-4 top-4 w-40 text-brand-soft/70"
          fill="none"
        >
          <path
            d="M8 96 L58 58 L104 74 L192 14"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            className="[stroke-dasharray:260] group-hover/cell:animate-[dash_2.2s_ease-out_forwards]"
          />
          <circle cx="192" cy="14" r="3" fill="currentColor" />
        </svg>
      </div>
    );
  }

  if (kind === "code") {
    return (
      <div aria-hidden className="pointer-events-none relative mb-8">
        <div className="rounded-xl border border-chalk/8 bg-ink/70 p-4 font-mono text-[0.6875rem] leading-relaxed text-fog-dim">
          <div className="mb-3 flex gap-1.5">
            <span className="size-2 rounded-full bg-chalk/15" />
            <span className="size-2 rounded-full bg-chalk/15" />
            <span className="size-2 rounded-full bg-chalk/15" />
          </div>
          <p>
            <span className="text-brand-soft">const</span> growth ={" "}
            <span className="text-chalk">await</span> build({"{"}
          </p>
          <p className="pl-4">
            strategy<span className="text-brand-soft">:</span> true,
          </p>
          <p className="pl-4">
            design<span className="text-brand-soft">:</span> systemic,
          </p>
          <p className="pl-4">
            code<span className="text-brand-soft">:</span> owned,
          </p>
          <p>{"});"}</p>
        </div>
      </div>
    );
  }

  if (kind === "pulse") {
    return (
      <div aria-hidden className="pointer-events-none relative mb-8 h-10">
        <svg
          viewBox="0 0 200 40"
          className="h-full w-full text-brand-soft/70"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0 20h48l8-12 10 24 9-18 8 6h40l7-9 9 18 8-9h43"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  if (kind === "chart") {
    return (
      <div
        aria-hidden
        className="pointer-events-none mb-8 flex h-12 items-end gap-1.5"
      >
        {[38, 62, 45, 78, 92, 70, 100].map((h, i) => (
          <span
            key={i}
            className="w-full rounded-sm bg-gradient-to-t from-brand/25 to-brand-soft/70 transition-[height] duration-700 ease-versa"
            style={{ height: `${h}%`, transitionDelay: `${i * 45}ms` }}
          />
        ))}
      </div>
    );
  }

  if (kind === "stack") {
    return (
      <div aria-hidden className="pointer-events-none relative mb-8 h-14">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="absolute left-0 h-9 w-24 rounded-lg border border-chalk/10 bg-ink-3 transition-transform duration-700 ease-versa"
            style={{
              top: `${i * 6}px`,
              left: `${i * 10}px`,
              opacity: 1 - i * 0.28,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div aria-hidden className="pointer-events-none relative mb-8 h-14 w-14">
      <span className="absolute inset-0 rounded-full border border-chalk/10" />
      <span className="absolute inset-2 rounded-full border border-chalk/10" />
      <span className="absolute left-1/2 top-0 size-2 -translate-x-1/2 rounded-full bg-brand-soft [animation:spin_7s_linear_infinite] [transform-origin:center_1.75rem]" />
    </div>
  );
}
