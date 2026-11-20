import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { cssVars, sec } from "./vars";

/** Texto à mão (Caveat, cor accent) que sobe com `rise` ao desenhar. */
export function Hand({
  as: Tag = "span",
  delay,
  rotate,
  className,
  children,
}: {
  as?: "span" | "p" | "div" | "small";
  delay?: number;
  /** Graus. Vai por variável porque a animação também escreve `transform`. */
  rotate?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={cn("hand note", className)}
      style={cssVars({
        "--d": sec(delay),
        "--r": rotate !== undefined ? `${rotate}deg` : undefined,
      })}
    >
      {children}
    </Tag>
  );
}
