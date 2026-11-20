import type { NextConfig } from "next";

/**
 * Cabeçalhos de segurança aplicados a todas as rotas.
 * Nada exótico — só o básico que todo site em produção deveria ter.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,

  // Fixa a raiz no diretório do projeto. Sem isso o Turbopack encontra o
  // package-lock.json solto em ~ e infere a home como raiz do workspace.
  turbopack: {
    root: __dirname,
  },

  images: {
    formats: ["image/avif", "image/webp"],
  },

  async redirects() {
    return [
      // O Sobre virou seção da home. 308 para que buscadores e links antigos passem a apontar para a âncora
      { source: "/sobre", destination: "/#sobre", permanent: true },
    ];
  },

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // Mídia do portfólio é imutável: cache agressivo.
        source: "/:folder(video|work)/:file*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
