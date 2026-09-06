/**
 * VersaMark — o monograma oficial da Versa.
 *
 * Os caminhos vêm dos vetores originais (LogosVersa2.ai), não de um PNG
 * rasterizado. Cada parte do símbolo é um grupo isolado, o que permite
 * animar as asas, a coroa e as bases de forma independente.
 *
 * Componente puro (sem JS de cliente) para poder ser usado em Server
 * Components; as animações são controladas por classes CSS.
 */

type Variant = "brand" | "gradient" | "mono";

const WING_LEFT =
  "M 292.5 262.050781 L 379.90625 262.050781 C 379.90625 262.050781 400.265625 265.316406 406.335938 279.328125 C 412.40625 293.335938 540 572.554688 540 572.554688 L 540 816.757812 C 540 816.757812 514.054688 822.5 506.910156 803.730469 L 272.699219 293.472656 C 272.699219 293.472656 265.652344 270.78125 292.5 262.050781";
const WING_RIGHT =
  "M 787.5 262.050781 L 700.09375 262.050781 C 700.09375 262.050781 679.734375 265.316406 673.664062 279.328125 C 667.59375 293.335938 540 572.554688 540 572.554688 L 540 816.757812 C 540 816.757812 565.945312 822.5 573.089844 803.730469 L 807.300781 293.472656 C 807.300781 293.472656 814.347656 270.78125 787.5 262.050781";
const CROWN_LEFT =
  "M 539.121094 424.328125 L 522.453125 459.355469 C 519.144531 466.308594 509.214844 466.203125 506.050781 459.183594 L 432.511719 295.9375 C 431.390625 293.449219 431.453125 290.589844 432.683594 288.152344 L 522.894531 109.523438 C 524.605469 106.132812 527.671875 104.582031 530.738281 104.546875 C 535.367188 104.488281 540 107.875 540 113.59375 L 540 420.445312 C 540 421.789062 539.699219 423.117188 539.121094 424.328125";
const CROWN_LEFT_TIP =
  "M 549.789062 104.542969 L 550.105469 113.851562 L 525.488281 113.253906 L 530.738281 104.546875";
const CROWN_RIGHT =
  "M 540.878906 424.328125 L 557.546875 459.355469 C 560.855469 466.308594 570.785156 466.203125 573.949219 459.183594 L 647.488281 295.9375 C 648.609375 293.449219 648.546875 290.589844 647.316406 288.152344 L 557.105469 109.523438 C 552.8125 101.027344 540 104.078125 540 113.59375 L 540 420.445312 C 540 421.789062 540.300781 423.117188 540.878906 424.328125";
const BASE_LEFT =
  "M 189.097656 781.769531 L 330.847656 493.996094 C 334.214844 487.160156 344.003906 487.273438 347.210938 494.191406 L 422.792969 657.265625 C 423.949219 659.761719 423.910156 662.648438 422.6875 665.109375 L 358.632812 794.210938 C 358.476562 794.53125 358.304688 794.832031 358.109375 795.132812 C 355.964844 798.429688 343.125 816.757812 322.476562 816.757812 L 212.671875 816.757812 C 211.457031 816.757812 210.261719 816.515625 209.140625 816.042969 C 203.164062 813.507812 184.804688 804 188.328125 784.050781 C 188.46875 783.257812 188.742188 782.492188 189.097656 781.769531";
const BASE_RIGHT =
  "M 890.902344 781.769531 L 749.152344 493.996094 C 745.785156 487.160156 735.996094 487.273438 732.789062 494.191406 L 657.210938 657.265625 C 656.050781 659.761719 656.089844 662.648438 657.3125 665.109375 L 721.367188 794.210938 C 721.523438 794.53125 721.695312 794.832031 721.890625 795.132812 C 724.035156 798.429688 736.875 816.757812 757.523438 816.757812 L 867.328125 816.757812 C 868.542969 816.757812 869.738281 816.515625 870.859375 816.042969 C 876.835938 813.507812 895.195312 804 891.671875 784.050781 C 891.53125 783.257812 891.257812 782.492188 890.902344 781.769531";

export function VersaMark({
  className,
  variant = "brand",
  intro = false,
  sweep = false,
  title,
  idKey = "a",
}: {
  className?: string;
  variant?: Variant;
  /** Dispara a animação de entrada (asas, coroa e bases em cascata). */
  intro?: boolean;
  /** Passagem de luz contínua sobre o símbolo. */
  sweep?: boolean;
  /** Se informado, o SVG é exposto como imagem acessível. */
  title?: string;
  /**
   * Sufixo dos ids internos (gradientes/máscara). Determinístico de
   * propósito: ids gerados em runtime causariam divergência de hidratação.
   * Use um valor único por instância que renderize gradiente ou sweep.
   */
  idKey?: string;
}) {
  const id = `vm-${idKey}`;
  const light =
    variant === "gradient"
      ? `url(#${id}-light)`
      : variant === "mono"
        ? "currentColor"
        : "var(--color-brand)";
  const dark =
    variant === "gradient"
      ? `url(#${id}-dark)`
      : variant === "mono"
        ? "currentColor"
        : "var(--color-brand-deep)";

  return (
    <svg
      viewBox="184 100 712 721"
      className={[
        "versa-mark",
        intro && "versa-mark--intro",
        sweep && "versa-mark--sweep",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {variant === "gradient" && (
        <defs>
          <linearGradient id={`${id}-light`} x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0%" stopColor="var(--color-brand-soft)" />
            <stop offset="100%" stopColor="var(--color-brand)" />
          </linearGradient>
          <linearGradient id={`${id}-dark`} x1="0.2" y1="0" x2="0.8" y2="1">
            <stop offset="0%" stopColor="var(--color-brand)" />
            <stop offset="100%" stopColor="var(--color-brand-deep)" />
          </linearGradient>
        </defs>
      )}

      {sweep && (
        <defs>
          <linearGradient id={`${id}-sweep`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="45%" stopColor="#fff" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#fff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id={`${id}-mask`}>
            <g fill="#fff">
              <path d={WING_LEFT} />
              <path d={WING_RIGHT} />
              <path d={CROWN_LEFT} />
              <path d={CROWN_LEFT_TIP} />
              <path d={CROWN_RIGHT} />
              <path d={BASE_LEFT} />
              <path d={BASE_RIGHT} />
            </g>
          </mask>
        </defs>
      )}

      <g className="versa-crown-l" fill={dark}>
        <path d={CROWN_LEFT} />
        <path d={CROWN_LEFT_TIP} />
      </g>
      <g className="versa-crown-r" fill={dark}>
        <path d={CROWN_RIGHT} />
      </g>
      <g className="versa-base-l" fill={dark}>
        <path d={BASE_LEFT} />
      </g>
      <g className="versa-base-r" fill={dark}>
        <path d={BASE_RIGHT} />
      </g>
      <g className="versa-wing-l" fill={light}>
        <path d={WING_LEFT} />
      </g>
      <g className="versa-wing-r" fill={light}>
        <path d={WING_RIGHT} />
      </g>

      {sweep && (
        <g mask={`url(#${id}-mask)`}>
          <rect
            className="versa-sweep-bar"
            x="184"
            y="100"
            width="360"
            height="721"
            fill={`url(#${id}-sweep)`}
          />
        </g>
      )}
    </svg>
  );
}
