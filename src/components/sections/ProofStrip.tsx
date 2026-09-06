import { PROVA } from "@/lib/content";

/**
 * Faixa de prova imediata.
 *
 * Fica logo abaixo do hero, antes de qualquer argumento. Existe por um
 * motivo só: o visitante decide se continua rolando nos primeiros segundos,
 * e nesse momento ele ainda não tem nenhuma razão para acreditar em nada do
 * que o site diz. Nome de cliente real é a coisa mais barata e mais rápida
 * de acreditar que existe.
 */
export function ProofStrip() {
  return (
    <section aria-label="Clientes atendidos" className="relative">
      <div className="shell">
        <div className="flex flex-col gap-5 border-y border-chalk/8 py-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <p className="max-w-[34ch] shrink-0 text-[0.8125rem] leading-relaxed text-fog-dim">
            {PROVA.linha}
          </p>

          <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {PROVA.clientes.map((cliente) => (
              <li
                key={cliente}
                className="font-display text-[0.9375rem] font-medium tracking-tight text-fog transition-colors duration-500 hover:text-chalk sm:text-base"
              >
                {cliente}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
