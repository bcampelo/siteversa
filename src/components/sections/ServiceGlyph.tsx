import { cn } from "@/lib/utils";

/**
 * Glifos dos serviços — arte de linha própria, animada em CSS.
 * Ícone genérico de biblioteca entregaria "mais uma agência"; um glifo
 * desenhado para o serviço entrega intenção.
 */
export function ServiceGlyph({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  const common = "size-full text-brand-soft/80";

  if (id === "design") {
    return (
      <svg
        viewBox="0 0 120 120"
        className={cn(common, className)}
        fill="none"
        aria-hidden
      >
        <g stroke="currentColor" strokeWidth="1">
          <rect x="14" y="14" width="56" height="56" rx="4" opacity="0.5" />
          <rect
            x="34"
            y="34"
            width="56"
            height="56"
            rx="4"
            className="origin-center animate-[drift_14s_ease-in-out_infinite]"
          />
          <circle cx="86" cy="30" r="16" opacity="0.45" />
        </g>
        <path
          d="M34 90 L62 34 L90 90 Z"
          fill="currentColor"
          opacity="0.07"
        />
        <g fill="currentColor">
          <circle cx="14" cy="14" r="2.4" />
          <circle cx="90" cy="90" r="2.4" />
        </g>
      </svg>
    );
  }

  if (id === "trafego") {
    return (
      <svg
        viewBox="0 0 120 120"
        className={cn(common, className)}
        fill="none"
        aria-hidden
      >
        {/* funil */}
        <path
          d="M12 18h96l-33 40v34l-30 14V58Z"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.4"
        />
        {/* barras crescentes */}
        <g fill="currentColor">
          {[
            [18, 96, 8, 12],
            [34, 88, 8, 20],
            [50, 74, 8, 34],
            [66, 58, 8, 50],
          ].map(([x, y, w, h], i) => (
            <rect
              key={i}
              x={x}
              y={y}
              width={w}
              height={h}
              rx="1.5"
              opacity={0.18 + i * 0.16}
            />
          ))}
        </g>
        <path
          d="M14 82 L44 62 L70 70 L106 26"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeDasharray="140"
          className="animate-[dash_5s_ease-in-out_infinite]"
        />
        <circle cx="106" cy="26" r="3" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 120 120"
      className={cn(common, className)}
      fill="none"
      aria-hidden
    >
      {/* janela de navegador */}
      <rect
        x="12"
        y="20"
        width="96"
        height="72"
        rx="6"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.55"
      />
      <path d="M12 36h96" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <g fill="currentColor" opacity="0.5">
        <circle cx="22" cy="28" r="2" />
        <circle cx="30" cy="28" r="2" />
        <circle cx="38" cy="28" r="2" />
      </g>
      <g fill="currentColor">
        <rect x="24" y="48" width="34" height="4" rx="2" opacity="0.45" />
        <rect x="24" y="58" width="22" height="4" rx="2" opacity="0.25" />
        <rect
          x="24"
          y="72"
          width="26"
          height="9"
          rx="4.5"
          opacity="0.7"
          className="animate-[breathe_5s_ease-in-out_infinite]"
        />
        <rect x="70" y="48" width="26" height="33" rx="4" opacity="0.12" />
      </g>
      {/* cursor */}
      <path
        d="M84 66l10 4-4 1.6-1.6 4Z"
        fill="currentColor"
        className="animate-[drift_9s_ease-in-out_infinite]"
      />
    </svg>
  );
}
