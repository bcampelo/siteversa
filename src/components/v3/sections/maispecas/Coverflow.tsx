"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import "./coverflow.css";

/** Quanto tempo cada arte fica no centro quando o carrossel passa sozinho. */
const AUTOPLAY_MS = 3600;
/** Arrasto mínimo, em px, para contar como troca de arte e não como clique. */
const DRAG_THRESHOLD = 40;

type Art = { src: string; caption: string; alt: string };

type Labels = {
  region: string;
  prev: string;
  next: string;
  goTo: string;
  item: string;
  of: string;
};

/** Posição de cada item como variáveis CSS, a partir da distância ao centro. */
function slot(offset: number): CSSProperties {
  const a = Math.abs(offset);
  const side = offset === 0 ? 0 : offset > 0 ? 1 : -1;
  const scale = offset === 0 ? 1 : Math.max(0.78, 1 - a * 0.08);
  const opacity = a > 2 ? 0 : a === 2 ? 0.45 : a === 1 ? 0.9 : 1;
  const blur = a >= 2 ? 3 : a === 1 ? 1 : 0;
  return {
    // --step vem do CSS (230px no desktop, 150px no celular)
    "--x": `calc(${offset} * var(--step))`,
    "--z": `${-a * 110}px`,
    "--r": `${-side * (a ? 38 : 0)}deg`,
    "--s": scale,
    "--o": opacity,
    "--b": `${blur}px`,
    "--zi": 10 - a,
  } as CSSProperties;
}

/** Seta em SVG: o glifo de texto colado no rótulo é lido como seta decorativa. */
function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {dir === "left" ? (
        <path d="M15 9H3M8 4L3 9l5 5" />
      ) : (
        <path d="M3 9h12M10 4l5 5-5 5" />
      )}
    </svg>
  );
}

/** Quem pediu movimento mínimo, ou `?still` para print, não recebe autoplay. */
function wantsStill() {
  return (
    window.location.search.includes("still") ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Carrossel estilo coverflow. Cliente porque guarda a arte ativa, o arrasto
 * e o autoplay. As imagens são WebP já prontos (720x900), então saem sem
 * passar pelo otimizador, como as gravuras.
 *
 * Autoplay pausa em hover de mouse, foco por teclado e fora da tela. A
 * contagem recomeça a cada troca, inclusive as manuais.
 */
export function Coverflow({
  arts,
  labels,
}: {
  arts: readonly Art[];
  labels: Labels;
}) {
  const n = arts.length;
  const [cur, setCur] = useState(0);
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, startX: 0, moved: false });

  // Com o autoplay rodando, anunciar a legenda a cada 3,6s só atrapalha.
  // `visible` vem antes de wantsStill() porque ele só vira true no cliente,
  // e wantsStill() lê window (no servidor ficaria diferente do cliente)
  const playing = visible && !hover && !focused && !wantsStill();

  const step = useCallback(
    (delta: number) => setCur((c) => (c + delta + n) % n),
    [n],
  );

  // Fora da tela o carrossel não passa e não gasta timer
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(root);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (hover || focused || !visible || wantsStill()) return;
    const t = window.setTimeout(() => step(1), AUTOPLAY_MS);
    return () => window.clearTimeout(t);
    // `cur` na lista: toda troca, manual ou não, recomeça a contagem
  }, [cur, hover, focused, visible, step]);

  // O soltar do arrasto escuta a janela: o dedo ou o mouse podem sair do palco
  useEffect(() => {
    const end = (e: globalThis.PointerEvent) => {
      const d = drag.current;
      if (!d.down) return;
      d.down = false;
      delete stageRef.current?.dataset.dragging;
      const dx = e.clientX - d.startX;
      if (e.type === "pointerup" && Math.abs(dx) > DRAG_THRESHOLD) {
        // `moved` segura o clique que o navegador dispara logo depois do soltar
        d.moved = true;
        // Solta logo depois do clique, senão Enter no teclado seria ignorado
        window.setTimeout(() => (d.moved = false), 0);
        step(dx < 0 ? 1 : -1);
      }
    };
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    return () => {
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
    };
  }, [step]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = { down: true, startX: e.clientX, moved: false };
    stageRef.current!.dataset.dragging = "true";
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    // Alt+seta e Cmd+seta são "voltar" do navegador: não são do carrossel
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.key === "ArrowRight") step(1);
    else if (e.key === "ArrowLeft") step(-1);
    else return;
    e.preventDefault();
  };

  return (
    <>
      <div
        ref={rootRef}
        className="cf"
        role="region"
        aria-roledescription="carrossel"
        aria-label={labels.region}
        tabIndex={0}
        onKeyDown={onKeyDown}
        // Toque emula mouseenter e deixaria o carrossel parado para sempre
        onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setHover(false)}
        // Só foco de teclado pausa: o clique do mouse já é coberto pelo hover.
        // Recalcula a cada foco, senão o foco de teclado anterior ficaria
        // preso quando a pessoa clica num ponto com o mouse
        onFocus={(e) =>
          setFocused((e.target as Element).matches(":focus-visible"))
        }
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
        }}
      >
        <div ref={stageRef} className="cf-stage" onPointerDown={onPointerDown}>
          {arts.map((art, i) => {
            let offset = i - cur;
            // Laço infinito: o item mais distante passa para o outro lado
            if (offset > n / 2) offset -= n;
            if (offset < -n / 2) offset += n;
            const far = Math.abs(offset) > 2;
            return (
              <button
                key={art.src}
                type="button"
                className="cf-item"
                style={slot(offset)}
                data-far={far}
                tabIndex={offset === 0 ? 0 : -1}
                aria-hidden={far}
                aria-label={`${labels.item} ${i + 1} ${labels.of} ${n}: ${art.alt}`}
                onClick={() => {
                  if (drag.current.moved) return;
                  setCur(i);
                }}
              >
                <Image
                  src={art.src}
                  alt={art.alt}
                  width={720}
                  height={900}
                  unoptimized
                  draggable={false}
                />
              </button>
            );
          })}
        </div>

        <div className="cf-dock">
          <button
            type="button"
            className="cf-btn"
            aria-label={labels.prev}
            onClick={() => step(-1)}
          >
            <Arrow dir="left" />
          </button>
          <div className="cf-dots">
            {arts.map((art, i) => (
              <button
                key={art.src}
                type="button"
                className="cf-dot"
                aria-label={`${labels.goTo} ${i + 1}`}
                aria-current={i === cur}
                onClick={() => setCur(i)}
              />
            ))}
          </div>
          <button
            type="button"
            className="cf-btn"
            aria-label={labels.next}
            onClick={() => step(1)}
          >
            <Arrow dir="right" />
          </button>
        </div>
      </div>

      <p className="cf-caption" aria-live={playing ? "off" : "polite"}>
        {arts[cur].caption}
      </p>
    </>
  );
}
