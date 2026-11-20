"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Quanto o elemento anda em relação à distância dele ao centro da tela. */
const FACTOR = -0.06;

type Item = {
  el: HTMLElement;
  visible: boolean;
  /** Deslocamento já aplicado, para tirar da medida do próprio getBoundingClientRect. */
  ty: number;
};

/*
 * Um único listener de rolagem e um único requestAnimationFrame por quadro,
 * para todas as instâncias da página. O listener entra com a primeira
 * instância e sai com a última.
 */
const items = new Set<Item>();
let frame = 0;

function update() {
  frame = 0;
  const mid = window.innerHeight / 2;
  for (const it of items) {
    // Só calcula o que está na tela
    if (!it.visible) continue;
    const r = it.el.getBoundingClientRect();
    const center = r.top - it.ty + r.height / 2;
    it.ty = Math.round((center - mid) * FACTOR * 10) / 10;
    // Propriedade individual: não briga com o transform da entrada (`egin`)
    it.el.style.translate = `0 ${it.ty}px`;
  }
}

function request() {
  if (!frame) frame = requestAnimationFrame(update);
}

function attach(it: Item) {
  if (!items.size) {
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request, { passive: true });
  }
  items.add(it);
  request();
}

function detach(it: Item) {
  items.delete(it);
  it.el.style.translate = "";
  if (!items.size) {
    window.removeEventListener("scroll", request);
    window.removeEventListener("resize", request);
    cancelAnimationFrame(frame);
    frame = 0;
  }
}

/**
 * Paralaxe suave em volta de uma <Engraving>. Não cria caixa: o <span> é
 * `display: contents` e o deslocamento vai direto no <img>, então o
 * posicionamento que a gravura já tem continua valendo.
 *
 * Com prefers-reduced-motion ou `?still` não faz nada.
 */
export function Parallax({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const target = host.querySelector("img") ?? host.firstElementChild;
    if (!(target instanceof HTMLElement)) return;

    const still = window.location.search.includes("still");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still || reduced || !("IntersectionObserver" in window)) return;

    const it: Item = { el: target, visible: false, ty: 0 };
    const io = new IntersectionObserver((entries) => {
      it.visible = entries[entries.length - 1].isIntersecting;
      if (it.visible) request();
    });
    io.observe(target);
    attach(it);

    return () => {
      io.disconnect();
      detach(it);
    };
  }, []);

  return (
    <span ref={ref} className="contents">
      {children}
    </span>
  );
}
