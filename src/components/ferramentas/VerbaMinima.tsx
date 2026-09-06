"use client";

import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { ArrowIcon, Button } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import { DIAGNOSTICO_HREF } from "@/lib/site";
import { brl, calcularVerba, type EntradaVerba } from "@/lib/verba";
import { cn } from "@/lib/utils";

/**
 * Calculadora de verba mínima viável.
 *
 * Três decisões de produto:
 *
 * 1. O resultado aparece enquanto a pessoa mexe, sem botão de calcular e sem
 *    pedir e-mail. Ferramenta que cobra cadastro para mostrar um número é
 *    formulário disfarçado, e o visitante percebe na hora.
 * 2. A conta fica visível. Mostrar a fórmula é o que separa uma ferramenta
 *    de um gerador de número mágico, e é o que faz alguém confiar no
 *    resultado a ponto de mandar para o sócio.
 * 3. O veredito pode ser desfavorável para nós. Quando a verba não fecha, a
 *    ferramenta diz para não investir ainda, em vez de empurrar contrato.
 */

const PADRAO: EntradaVerba = {
  valorCliente: 1500,
  taxaFechamento: 25,
  percentualAquisicao: 20,
  verbaMensalAtual: 600,
};

export function VerbaMinima({ compacto = false }: { compacto?: boolean }) {
  const [e, setE] = useState<EntradaVerba>(PADRAO);
  const r = useMemo(() => calcularVerba(e), [e]);
  const [tocou, setTocou] = useState(false);

  useEffect(() => {
    if (!tocou) return;
    track("tool_start", { section: "verba-minima", ferramenta: "verba-minima" });
  }, [tocou]);

  // Um resultado por sessão vale como evento. Sem isso, mexer no controle
  // deslizante geraria centenas de eventos e o relatório viraria ruído.
  const [reportou, setReportou] = useState(false);
  useEffect(() => {
    if (!tocou || reportou) return;
    const t = setTimeout(() => {
      track("tool_result", {
        section: "verba-minima",
        ferramenta: "verba-minima",
        suficiente: r.suficiente,
        regime: r.regimeAtual.id,
      });
      setReportou(true);
    }, 2500);
    return () => clearTimeout(t);
  }, [tocou, reportou, r.suficiente, r.regimeAtual.id]);

  function set<K extends keyof EntradaVerba>(k: K, v: number) {
    setTocou(true);
    setE((prev) => ({ ...prev, [k]: v }));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">
      {/* ---------- entradas ---------- */}
      <div className="rounded-3xl border border-chalk/8 bg-ink-2 p-6 sm:p-8">
        <p className="text-eyebrow text-fog-dim">Seus números</p>

        <div className="mt-7 flex flex-col gap-7">
          <Controle
            label="Quanto vale um cliente novo"
            valor={brl(e.valorCliente)}
            min={100}
            max={30000}
            step={100}
            value={e.valorCliente}
            onChange={(v) => set("valorCliente", v)}
            ajuda="Se for recorrente, some o que ele costuma pagar até deixar de ser cliente."
          />
          <Controle
            label="De cada 100 orçamentos, quantos fecham"
            valor={`${e.taxaFechamento}%`}
            min={1}
            max={100}
            step={1}
            value={e.taxaFechamento}
            onChange={(v) => set("taxaFechamento", v)}
            ajuda="Chute honesto vale mais que número redondo bonito."
          />
          <Controle
            label="Quanto do valor do cliente você aceita gastar para conquistá-lo"
            valor={`${e.percentualAquisicao}%`}
            min={1}
            max={60}
            step={1}
            value={e.percentualAquisicao}
            onChange={(v) => set("percentualAquisicao", v)}
            ajuda="Em serviço, entre 15% e 30% costuma ser sustentável."
          />
          <Controle
            label="Quanto você investe hoje por mês em anúncio"
            valor={brl(e.verbaMensalAtual)}
            min={0}
            max={30000}
            step={100}
            value={e.verbaMensalAtual}
            onChange={(v) => set("verbaMensalAtual", v)}
            ajuda="Só a verba de mídia, sem honorário de ninguém."
          />
        </div>
      </div>

      {/* ---------- resultado ---------- */}
      <div className="border-gradient overflow-hidden rounded-3xl">
        <div className="relative h-full bg-ink-2 p-6 sm:p-8">
          <div
            aria-hidden
            className="halo pointer-events-none absolute -right-28 -top-32 size-80 opacity-30 blur-3xl"
          />

          <p className="text-eyebrow relative text-brand-soft">
            Verba mínima viável
          </p>

          <div className="relative mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <motion.p
              key={Math.round(r.minimoDiario)}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="font-display text-[clamp(2.5rem,6vw,3.75rem)] font-bold leading-none tracking-[-0.04em] text-gradient"
            >
              {brl(r.minimoDiario)}
            </motion.p>
            <span className="text-[0.9375rem] text-fog">por dia</span>
          </div>
          <p className="relative mt-2 text-[0.875rem] text-fog-dim">
            Cerca de {brl(r.minimoMensal)} por mês para esse objetivo.
          </p>

          {/* comparação */}
          <div
            className={cn(
              "relative mt-7 rounded-2xl border p-5",
              r.suficiente
                ? "border-brand-soft/35 bg-brand/[0.08]"
                : "border-[#f59e0b]/30 bg-[#f59e0b]/[0.07]",
            )}
          >
            <p className="text-eyebrow text-fog-dim">
              Você investe hoje {brl(r.verbaDiariaAtual)} por dia
            </p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-chalk/10">
              <motion.div
                className={cn(
                  "h-full rounded-full",
                  r.suficiente
                    ? "bg-gradient-to-r from-brand to-brand-soft"
                    : "bg-[#f59e0b]",
                )}
                initial={false}
                animate={{
                  width: `${Math.min(100, Math.max(2, r.cobertura * 100))}%`,
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <p className="mt-4 text-[0.875rem] leading-relaxed text-chalk">
              {r.veredito}
            </p>
          </div>

          {/* a conta aberta */}
          <details className="relative mt-6 group/conta">
            <summary className="cursor-pointer list-none text-[0.8125rem] text-fog-dim transition-colors duration-300 hover:text-chalk">
              Ver a conta aberta
              <span className="ml-2 inline-block transition-transform duration-300 group-open/conta:rotate-90">
                ›
              </span>
            </summary>
            <div className="mt-4 flex flex-col gap-2 font-mono text-[0.75rem] leading-relaxed text-fog">
              <Linha rotulo="Custo máximo por cliente" valor={brl(r.cpaMaximo)} />
              <Linha
                rotulo="Orçamentos por cliente fechado"
                valor={r.leadsPorCliente.toFixed(1)}
              />
              <Linha rotulo="Custo máximo por lead" valor={brl(r.cplMaximo)} />
              <p className="mt-2 border-t border-chalk/8 pt-3 text-fog-dim">
                A Meta precisa de cerca de 50 eventos por conjunto a cada 7
                dias para sair do aprendizado.
              </p>
              <p className="text-chalk">
                ({brl(r.cplMaximo)} × 50) ÷ 7 = {brl(r.minimoDiario)} por dia
              </p>
            </div>
          </details>

          {/* regime */}
          {!compacto && (
            <div className="relative mt-7 border-t border-chalk/8 pt-6">
              <p className="text-eyebrow text-fog-dim">
                Você opera em {r.regimeAtual.nome.toLowerCase()} ·{" "}
                {r.regimeAtual.faixa}
              </p>
              <p className="mt-3 text-[0.875rem] leading-relaxed text-fog">
                {r.regimeAtual.descricao}
              </p>
              <ul className="mt-4 flex flex-col gap-2">
                {r.regimeAtual.regras.map((regra) => (
                  <li
                    key={regra}
                    className="flex items-start gap-3 text-[0.8125rem] text-chalk/90"
                  >
                    <span
                      aria-hidden
                      className="mt-1.5 size-1 shrink-0 rounded-full bg-brand-soft"
                    />
                    {regra}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="relative mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              href={DIAGNOSTICO_HREF}
              variant={compacto ? "ghost" : "primary"}
              section="verba-minima"
              ctaLabel="Diagnóstico completo"
            >
              {r.suficiente
                ? "Ver o que mais pode estar travando"
                : "Ver o que fazer com a verba que tenho"}
              <ArrowIcon />
            </Button>
            <p className="max-w-[26ch] text-[0.75rem] leading-relaxed text-fog-dim">
              Seis perguntas, sem cadastro para ver o resultado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <p className="flex items-baseline justify-between gap-4">
      <span className="text-fog-dim">{rotulo}</span>
      <span className="text-chalk">{valor}</span>
    </p>
  );
}

function Controle({
  label,
  ajuda,
  valor,
  value,
  onChange,
  min,
  max,
  step,
}: {
  label: string;
  ajuda?: string;
  valor: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label
          htmlFor={`c-${label}`}
          className="max-w-[28ch] text-[0.875rem] leading-snug text-chalk"
        >
          {label}
        </label>
        <span className="shrink-0 font-display text-lg font-semibold tracking-tight text-brand-soft">
          {valor}
        </span>
      </div>
      <input
        id={`c-${label}`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(ev) => onChange(Number(ev.target.value))}
        className="range-versa mt-3 w-full"
      />
      {ajuda && (
        <p className="mt-2 text-[0.75rem] leading-relaxed text-fog-dim">{ajuda}</p>
      )}
    </div>
  );
}
