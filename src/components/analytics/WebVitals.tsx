"use client";

import { useReportWebVitals } from "next/web-vitals";
import { track } from "@/lib/analytics";

/**
 * Core Web Vitals reais, de campo.
 *
 * O Lighthouse mede o site num laboratório com internet boa. Isso não é o
 * que o cliente do cliente vive num celular médio numa rede móvel do Acre.
 * Aqui a medida vem de quem realmente visitou.
 *
 * A Versa promete no site perseguir 90+ de performance em cada entrega.
 * Prometer isso sem medir o campo do próprio site seria a mesma coisa que
 * vender gestão de tráfego sem pixel instalado.
 *
 * Só INP, LCP e CLS são enviados. São os três que entram no ranqueamento e
 * os três que o visitante sente. Mandar todas as métricas encheria o
 * relatório de linha que ninguém lê.
 */
const IMPORTANTES = new Set(["LCP", "INP", "CLS"]);

export function WebVitals() {
  useReportWebVitals((metric) => {
    if (!IMPORTANTES.has(metric.name)) return;
    track("web_vital", {
      section: "web-vitals",
      metrica: metric.name,
      // CLS vem em unidade decimal, o resto em milissegundos.
      valor:
        metric.name === "CLS"
          ? Math.round(metric.value * 1000)
          : Math.round(metric.value),
      classificacao: metric.rating,
      caminho: window.location.pathname,
    });
  });

  return null;
}
