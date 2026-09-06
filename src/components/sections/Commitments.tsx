import { CountUp } from "@/components/ui/CountUp";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { COMMITMENTS } from "@/lib/content";

/**
 * Compromissos — no lugar de estatísticas infladas, padrões verificáveis
 * que a Versa se obriga a cumprir. Número inventado é a forma mais rápida
 * de perder a confiança que o resto do site conquistou.
 */
export function Commitments() {
  return (
    <section className="relative py-10 sm:py-16">
      <div className="shell">
        <RevealGroup className="grid gap-px overflow-hidden rounded-3xl border border-chalk/8 bg-chalk/8 sm:grid-cols-2 lg:grid-cols-4">
          {COMMITMENTS.map((c) => (
            <RevealItem key={c.label}>
              <div className="group/stat relative h-full overflow-hidden bg-ink-2 p-7 transition-colors duration-500 hover:bg-ink-3">
                <div
                  aria-hidden
                  className="halo pointer-events-none absolute -bottom-20 left-1/2 size-48 -translate-x-1/2 opacity-0 blur-2xl transition-opacity duration-700 group-hover/stat:opacity-50"
                />
                <p className="relative font-display text-[clamp(2.75rem,5vw,3.75rem)] font-bold leading-none tracking-[-0.04em]">
                  <span className="text-gradient">
                    {c.prefix}
                    {typeof c.countTo === "number" ? (
                      <CountUp to={c.countTo} />
                    ) : (
                      c.value
                    )}
                    {c.suffix}
                  </span>
                </p>
                <p className="relative mt-4 text-[0.9375rem] font-medium text-chalk">
                  {c.label}
                </p>
                <p className="relative mt-2 text-[0.8125rem] leading-relaxed text-fog-dim">
                  {c.note}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
