"use client";

import { useEffect } from "react";

/** Quanto tempo um ponto do rastro continua vivo. */
const LIFE_MS = 600;
/** Pausa que corta o traço: depois dela o ponteiro "pulou", não desenhou. */
const GAP_MS = 100;

type Pt = { x: number; y: number; t: number };

/**
 * Rastro de tinta que segue o mouse. Só existe com ponteiro fino, sem
 * reduced-motion e sem `?still`: nos outros casos o componente não cria nada.
 *
 * O canvas é criado à mão no efeito, e não renderizado, para que ele nem
 * entre no DOM quando o rastro está desligado. O loop só roda enquanto há
 * pontos vivos e para sozinho quando o rastro some.
 */
export function InkTrail() {
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const still = window.location.search.includes("still");
    if (!fine || reduced || still) return;

    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    Object.assign(canvas.style, {
      position: "fixed",
      inset: "0",
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: "50",
    });
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      canvas.remove();
      return;
    }
    const root = document.documentElement;
    const color = getComputedStyle(root).getPropertyValue("--color-accent").trim();
    // Sem o token não há cor para desenhar: não monta o rastro
    if (!color) {
      canvas.remove();
      return;
    }

    let dpr = 1;
    const fit = () => {
      dpr = window.devicePixelRatio || 1;
      // clientWidth/Height: o canvas é 100% da viewport sem a barra de rolagem
      canvas.width = Math.round(root.clientWidth * dpr);
      canvas.height = Math.round(root.clientHeight * dpr);
    };
    fit();

    let pts: Pt[] = [];
    let frame = 0;

    const draw = (now: number) => {
      frame = 0;
      pts = pts.filter((p) => now - p.t < LIFE_MS);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, root.clientWidth, root.clientHeight);
      // Sem pontos: limpa e não pede outro quadro
      if (!pts.length) return;

      ctx.strokeStyle = color;
      ctx.lineCap = "round";
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        if (b.t - a.t > GAP_MS) continue;
        // 1 no ponto novo, 0 no de 600ms
        const k = 1 - (now - b.t) / LIFE_MS;
        ctx.globalAlpha = 0.8 * k;
        ctx.lineWidth = 0.6 + 2.2 * k;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      pts.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (!frame) frame = requestAnimationFrame(draw);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", fit, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", fit);
      cancelAnimationFrame(frame);
      canvas.remove();
    };
  }, []);

  return null;
}
