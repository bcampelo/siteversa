import { Pen, PenCircle, PenRect } from "@/components/v3/ink";
import type { ReactNode } from "react";

/*
  Ícones das seis etapas, 72x56. Traço ink de 1.6 (o roadmap.css troca a cor
  do `Pen`, que nasce accent) e um detalhe em brand. Todos entram juntos,
  1s depois do atraso de .15s, quando a caneta acende a etapa.
*/
const T = { dur: 1, delay: 0.15 } as const;
const B = { ...T, tone: "brand" } as const;

/** 1. Balão de conversa */
function Conversa() {
  return (
    <>
      <PenRect x={6} y={4} w={58} h={34} rx={6} {...T} />
      <Pen d="M18 38 L18 49 L30 38" {...T} />
      <Pen d="M16 16 H46" {...B} />
      <Pen d="M16 26 H36" {...B} />
    </>
  );
}

/** 2. Lupa */
function Diagnostico() {
  return (
    <>
      <PenCircle cx={30} cy={24} r={16} {...T} />
      <Pen d="M42 36 L58 52" {...T} />
      <Pen d="M21 22 A9 9 0 0 1 31 14" {...B} />
    </>
  );
}

/** 3. Folha com assinatura */
function Proposta() {
  return (
    <>
      <PenRect x={18} y={4} w={36} h={46} rx={4} {...T} />
      <Pen d="M26 15 H46" {...T} />
      <Pen d="M26 23 H46" {...T} />
      <Pen d="M26 31 H38" {...T} />
      <Pen d="M26 42 C30 35, 33 46, 37 40 S43 38, 46 42" {...B} />
    </>
  );
}

/** 4. Moldura tracejada com lápis */
function Rascunho() {
  return (
    <>
      <PenRect x={6} y={6} w={44} h={38} rx={4} dashed="4 5" {...T} />
      <Pen d="M14 34 L24 24 L32 30 L42 16" {...T} />
      <Pen d="M42 50 L46 38 L60 22 L68 29 L54 45 Z" {...B} />
    </>
  );
}

/** 5. Tela com play */
function NoAr() {
  return (
    <>
      <PenRect x={6} y={4} w={60} h={36} rx={5} {...T} />
      <Pen d="M26 48 H46" {...T} />
      <Pen d="M30 14 L46 22 L30 30 Z" {...B} />
    </>
  );
}

/** 6. Gráfico subindo */
function Medicao() {
  return (
    <>
      <Pen d="M8 4 V50 H64" {...T} />
      <Pen d="M14 42 L28 28 L38 35 L56 14" {...B} />
      <PenCircle cx={56} cy={14} r={3} {...B} />
    </>
  );
}

const ICONS: ReactNode[] = [
  <Conversa key="1" />,
  <Diagnostico key="2" />,
  <Proposta key="3" />,
  <Rascunho key="4" />,
  <NoAr key="5" />,
  <Medicao key="6" />,
];

export function StepIcon({ index, align }: { index: number; align: "left" | "right" }) {
  return (
    <svg
      className={`rm-ic block h-[56px] w-[72px] overflow-visible ${align === "right" ? "ml-auto" : ""}`}
      viewBox="0 0 72 56"
      aria-hidden="true"
    >
      {ICONS[index]}
    </svg>
  );
}
