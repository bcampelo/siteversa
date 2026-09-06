import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * Cada rota pública entra aqui. Página que não está no sitemap depende de
 * link interno para ser descoberta, e descoberta lenta é ranqueamento tardio.
 * `/obrigado` fica de fora de propósito: é página de conversão, não de busca.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE.url}/diagnostico`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/ferramentas`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE.url}/ferramentas/verba-minima`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE.url}/privacidade`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
