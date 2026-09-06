"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { ArrowIcon } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import { getAttribution } from "@/lib/attribution";
import {
  diagnosticar,
  QUESTIONS,
  type Answers,
  type Diagnostico,
} from "@/lib/diagnostico";
import { cn } from "@/lib/utils";

/**
 * Fluxo do diagnóstico.
 *
 * Duas decisões definem tudo aqui:
 *
 * 1. Uma pergunta por tela. Formulário longo em página única tem taxa de
 *    conclusão baixa, e cada campo visível a mais é um motivo a mais para
 *    desistir. Uma pergunta por vez também deixa medir onde a pessoa parou.
 *
 * 2. O resultado aparece ANTES do campo de contato. É o contrário do padrão
 *    de mercado, e é de propósito: quem já viu o valor preenche o contato
 *    numa taxa muito maior do que quem preenche antes de ver qualquer coisa.
 *    Pedir dado antes de entregar nada transforma a ferramenta num
 *    formulário disfarçado, e o visitante percebe.
 *
 * O diagnóstico mostrado aqui é calculado no navegador só para a prévia. O
 * que vale é o que o servidor recalcula na hora de gravar.
 */

type Step = number | "resultado";

export function DiagnosticoFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [started, setStarted] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [contato, setContato] = useState({
    nome: "",
    whatsapp: "",
    email: "",
    observacao: "",
    empresa_site: "",
  });

  const total = QUESTIONS.length;
  const indice = step === "resultado" ? total : step;
  const progresso = Math.round((indice / total) * 100);

  const previa: Diagnostico = useMemo(() => diagnosticar(answers), [answers]);

  const responder = useCallback(
    (id: keyof Answers, value: string) => {
      if (!started) {
        setStarted(true);
        track("form_start", { section: "diagnostico" });
      }
      const next = { ...answers, [id]: value };
      setAnswers(next);
      track("form_step", {
        section: "diagnostico",
        pergunta: id,
        resposta: value,
        passo: (typeof step === "number" ? step : total) + 1,
      });
      // Respiro curto para a pessoa ver a opção marcada antes de avançar.
      setTimeout(() => {
        setStep((s) => (typeof s === "number" && s + 1 < total ? s + 1 : "resultado"));
      }, 260);
    },
    [answers, started, step, total],
  );

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (contato.nome.trim().length < 2) return setErro("Escreva o seu nome.");
    if (contato.whatsapp.replace(/\D/g, "").length < 10)
      return setErro("Confira o número do WhatsApp, com DDD.");

    setEnviando(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...contato,
          ...answers,
          origem: "diagnostico",
          atribuicao: getAttribution(),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErro(json.erro ?? "Não conseguimos enviar agora. Tente de novo.");
        setEnviando(false);
        return;
      }

      const diag: Diagnostico = json.diagnostico ?? previa;
      track("generate_lead", {
        section: "diagnostico",
        score: diag.score,
        temperatura: diag.temperatura,
        servico: diag.servico,
      });
      try {
        sessionStorage.setItem(
          "versa:diagnostico",
          JSON.stringify({ diag, nome: contato.nome }),
        );
      } catch {
        /* segue sem persistir, a página de obrigado tem texto padrão */
      }
      router.push(`/obrigado?t=${diag.temperatura}`);
    } catch {
      setErro("Falha de conexão. Tente de novo em instantes.");
      setEnviando(false);
    }
  }

  const pergunta = typeof step === "number" ? QUESTIONS[step] : null;

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* progresso */}
      <div className="mb-10">
        <div className="flex items-baseline justify-between">
          <p className="text-eyebrow text-fog-dim">
            {step === "resultado"
              ? "Resultado"
              : `Pergunta ${indice + 1} de ${total}`}
          </p>
          <p className="font-mono text-[0.75rem] text-fog-dim">{progresso}%</p>
        </div>
        <div className="mt-3 h-px w-full overflow-hidden bg-chalk/10">
          <motion.div
            className="h-full bg-gradient-to-r from-brand to-brand-soft"
            initial={false}
            animate={{ width: `${Math.max(progresso, 4)}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {pergunta && (
          <motion.div
            key={pergunta.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-subtitle text-balance">{pergunta.pergunta}</h2>
            {pergunta.ajuda && (
              <p className="mt-3 max-w-[52ch] text-[0.875rem] leading-relaxed text-fog-dim">
                {pergunta.ajuda}
              </p>
            )}

            <div className="mt-8 flex flex-col gap-2.5">
              {pergunta.options.map((opt) => {
                const ativo = answers[pergunta.id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => responder(pergunta.id, opt.value)}
                    className={cn(
                      "group/opt flex items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-left transition-all duration-300",
                      ativo
                        ? "border-brand-soft/60 bg-brand/[0.12]"
                        : "border-chalk/10 bg-chalk/[0.02] hover:border-brand-soft/35 hover:bg-chalk/[0.05]",
                    )}
                  >
                    <span className="text-[0.9375rem] text-chalk">{opt.label}</span>
                    <span
                      aria-hidden
                      className={cn(
                        "grid size-5 shrink-0 place-items-center rounded-full border transition-colors duration-300",
                        ativo
                          ? "border-brand-soft bg-brand-soft"
                          : "border-chalk/20 group-hover/opt:border-brand-soft/60",
                      )}
                    >
                      {ativo && (
                        <svg
                          viewBox="0 0 14 14"
                          className="size-3 text-ink"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        >
                          <path d="M2.5 7.4 5.5 10.5 11.5 3.8" />
                        </svg>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {typeof step === "number" && step > 0 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="mt-8 text-[0.8125rem] text-fog-dim transition-colors duration-300 hover:text-chalk"
              >
                ← Voltar
              </button>
            )}
          </motion.div>
        )}

        {step === "resultado" && (
          <motion.div
            key="resultado"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Prévia entregue antes de pedir qualquer dado */}
            <div className="border-gradient overflow-hidden rounded-3xl">
              <div className="relative bg-ink-2 p-7 sm:p-9">
                <div
                  aria-hidden
                  className="halo pointer-events-none absolute -right-24 -top-28 size-80 opacity-30 blur-3xl"
                />
                <p className="text-eyebrow relative text-brand-soft">
                  Leitura preliminar
                </p>
                <h2 className="text-title relative mt-5 max-w-[26ch] text-balance">
                  {previa.titulo}
                </h2>
                <p className="relative mt-5 max-w-[58ch] text-[0.9375rem] leading-relaxed text-fog">
                  {previa.hipotese}
                </p>

                <ul className="relative mt-7 flex flex-col gap-2.5">
                  {previa.proximos.map((p) => (
                    <li
                      key={p}
                      className="flex items-start gap-3 text-[0.875rem] text-chalk"
                    >
                      <span
                        aria-hidden
                        className="mt-2 size-1 shrink-0 rounded-full bg-brand-soft"
                      />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Só agora o contato */}
            <form onSubmit={enviar} className="mt-10">
              <h3 className="text-subtitle">
                Quer o diagnóstico completo, com o plano de ação?
              </h3>
              <p className="mt-3 max-w-[54ch] text-[0.875rem] leading-relaxed text-fog-dim">
                A gente monta em cima das suas respostas e manda no WhatsApp.
                Sem robô e sem ligação de vendas.
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <Campo
                  label="Seu nome"
                  value={contato.nome}
                  onChange={(v) => setContato((c) => ({ ...c, nome: v }))}
                  autoComplete="name"
                  required
                />
                <Campo
                  label="WhatsApp com DDD"
                  value={contato.whatsapp}
                  onChange={(v) => setContato((c) => ({ ...c, whatsapp: v }))}
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="(68) 99999-0000"
                  required
                />
                <div className="sm:col-span-2">
                  <Campo
                    label="E-mail (opcional)"
                    value={contato.email}
                    onChange={(v) => setContato((c) => ({ ...c, email: v }))}
                    type="email"
                    autoComplete="email"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Campo
                    label="Quer contar mais alguma coisa? (opcional)"
                    value={contato.observacao}
                    onChange={(v) => setContato((c) => ({ ...c, observacao: v }))}
                    textarea
                  />
                </div>
              </div>

              {/* Isca para robô. Escondida de gente e de leitor de tela. */}
              <div className="absolute left-[-9999px]" aria-hidden>
                <label>
                  Não preencha
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    value={contato.empresa_site}
                    onChange={(e) =>
                      setContato((c) => ({ ...c, empresa_site: e.target.value }))
                    }
                  />
                </label>
              </div>

              {erro && (
                <p role="alert" className="mt-5 text-[0.875rem] text-[#ff8f8f]">
                  {erro}
                </p>
              )}

              <button
                type="submit"
                disabled={enviando}
                className="group/btn mt-8 inline-flex h-[3.35rem] items-center justify-center gap-2.5 rounded-full bg-chalk px-7 text-base font-medium text-ink transition-opacity duration-300 disabled:opacity-60"
              >
                {enviando ? "Enviando..." : "Receber o diagnóstico completo"}
                {!enviando && <ArrowIcon />}
              </button>

              <p className="mt-5 max-w-[52ch] text-[0.75rem] leading-relaxed text-fog-dim">
                Seus dados servem para responder você e nada além disso. Não
                vendemos, não repassamos e você pode pedir a exclusão quando
                quiser.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Campo({
  label,
  value,
  onChange,
  textarea,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "className"
>) {
  const shared =
    "mt-2 w-full rounded-xl border border-chalk/12 bg-chalk/[0.03] px-4 py-3 text-[0.9375rem] text-chalk outline-none transition-colors duration-300 placeholder:text-fog-dim/60 focus:border-brand-soft/60";
  return (
    <label className="block">
      <span className="text-eyebrow text-fog-dim">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className={shared}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={shared}
          {...rest}
        />
      )}
    </label>
  );
}
