"use client";

import { useEffect, useRef, type ReactNode } from "react";
import "./roadmap.css";

/** Linha da rolagem em que a caneta começa a andar, como fração da altura da tela. */
const LEAD = 0.62;
/** Passo da amostragem que acha o comprimento da linha em cada ponto. */
const SAMPLE = 4;

type Variant = {
  el: HTMLElement;
  mobile: boolean;
  path: SVGPathElement | null;
  line: HTMLElement | null;
  tip: HTMLElement | null;
  end: HTMLElement | null;
  steps: HTMLElement[];
  dots: Element[];
  /** Desktop: comprimento da linha em cada ponto. Celular: y de cada ponto, em px. */
  marks: number[];
  measured: boolean;
  /** Comprimento total da linha (desktop). */
  length: number;
  /** Quantas etapas estão acesas. */
  lit: number;
  /** Último deslocamento aplicado, para não reescrever o mesmo valor. */
  last: number;
};

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

function collect(el: HTMLElement): Variant {
  return {
    el,
    mobile: el.dataset.rmVariant === "mob",
    path: el.querySelector<SVGPathElement>("[data-rm-path]"),
    line: el.querySelector<HTMLElement>("[data-rm-line]"),
    tip: el.querySelector<HTMLElement>("[data-rm-tip]"),
    end: el.querySelector<HTMLElement>("[data-rm-end]"),
    steps: Array.from(el.querySelectorAll<HTMLElement>("[data-rm-step]")),
    dots: Array.from(el.querySelectorAll("[data-rm-dot]")),
    marks: [],
    measured: false,
    length: 0,
    lit: -1,
    last: -1,
  };
}

/**
 * Mede o que só dá para medir com a variante visível. No desktop, anda pela
 * linha de 4 em 4 e guarda o comprimento em que ela chega ao y de cada ponto.
 * No celular os pontos são HTML, então vale a posição real deles.
 */
function measure(v: Variant, top: number) {
  if (v.mobile) {
    v.marks = v.dots.map((d) => {
      const r = d.getBoundingClientRect();
      return r.top + r.height / 2 - top;
    });
  } else if (v.path) {
    v.length = v.path.getTotalLength();
    const ys = v.dots.map((d) => Number(d.getAttribute("cy")));
    v.marks = [];
    let i = 0;
    for (let d = 0; d <= v.length && i < ys.length; d += SAMPLE) {
      while (i < ys.length && v.path.getPointAtLength(d).y >= ys[i]) {
        v.marks.push(d);
        i++;
      }
    }
    // Se a amostragem terminar antes do último ponto, ele fica no fim da linha
    while (v.marks.length < ys.length) v.marks.push(v.length);
  }
  v.measured = true;
}

/**
 * Faz a caneta andar pela linha conforme a rolagem e acende cada etapa
 * quando a ponta passa pelo ponto dela.
 *
 * Os filhos (linha, pontos, etapas, as duas variantes) vêm prontos do
 * servidor e são achados por `data-rm-*`. Um listener de rolagem passivo e um
 * requestAnimationFrame por quadro, para as duas variantes.
 *
 * Com reduced-motion ou `?still` a rolagem não importa: tudo aceso e a ponta
 * parada no fim da linha, que é o que a referência aprovada mostra.
 */
export function RoadmapTrail({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = root.current;
    if (!host) return;

    const still = window.location.search.includes("still");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fixed = still || reduced;

    const variants = Array.from(
      host.querySelectorAll<HTMLElement>("[data-rm-variant]"),
    ).map(collect);

    // Sem rolagem para acompanhar a linha fica inteira (é o estilo de base)
    if (!fixed) {
      for (const v of variants) {
        if (v.path) {
          v.length = v.path.getTotalLength();
          v.path.style.strokeDasharray = String(v.length);
          v.path.style.strokeDashoffset = String(v.length);
        }
        if (v.line) v.line.style.transform = "scaleY(0)";
      }
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      for (const v of variants) {
        const rect = v.el.getBoundingClientRect();
        // Variante escondida pelo breakpoint
        if (!rect.height) {
          v.measured = false;
          continue;
        }
        if (!v.measured) measure(v, rect.top);

        const p = fixed
          ? 1
          : clamp((window.innerHeight * LEAD - rect.top) / rect.height, 0, 1);

        // d é o comprimento no desktop e a altura em px no celular
        const d = v.mobile ? p * rect.height : v.length * p;

        if (d !== v.last) {
          v.last = d;
          if (v.mobile) {
            if (!fixed && v.line) v.line.style.transform = `scaleY(${p})`;
            if (v.tip) v.tip.style.transform = `translate(24px, ${d}px)`;
          } else if (v.path) {
            if (!fixed) v.path.style.strokeDashoffset = String(v.length - d);
            if (v.tip) {
              // A ponta mora dentro do palco, então usa as unidades do viewBox
              const pt = v.path.getPointAtLength(d);
              v.tip.style.transform = `translate(${pt.x}px, ${pt.y}px)`;
            }
          }
          v.tip?.setAttribute("data-live", "");
        }

        let lit = 0;
        while (lit < v.marks.length && v.marks[lit] <= d) lit++;
        if (lit !== v.lit) {
          v.lit = lit;
          v.steps.forEach((s, i) => s.toggleAttribute("data-on", i < lit));
          v.dots.forEach((s, i) => s.toggleAttribute("data-on", i < lit));
        }

        // A nota de volta só se escreve quando a caneta chega ao fim
        if (p >= 0.98) v.end?.setAttribute("data-drawn", "");
      }
    };

    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // Fonte ou largura nova mudam a posição dos pontos no celular
    const ro = new ResizeObserver(() => {
      // A linha do desktop não muda de geometria, só a do celular precisa remedir
      for (const v of variants) if (v.mobile) v.measured = false;
      request();
    });
    ro.observe(host);

    window.addEventListener("resize", request, { passive: true });
    if (!fixed) window.addEventListener("scroll", request, { passive: true });
    request();

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", request);
      window.removeEventListener("scroll", request);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={root}>{children}</div>;
}
