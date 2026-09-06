/**
 * Ponto único de leitura de variáveis de ambiente.
 *
 * Regra do arquivo: nada aqui pode lançar erro se a variável estiver vazia.
 * O site precisa subir e funcionar com o .env em branco, porque cada
 * integração se desliga sozinha quando não está configurada. Isso permite
 * rodar local, revisar em preview e publicar em produção sem três versões
 * diferentes do código.
 *
 * `process.env.NEXT_PUBLIC_*` precisa aparecer escrito por extenso para o
 * Next conseguir substituir o valor no bundle. Nada de acesso dinâmico.
 */

export const PUBLIC_ENV = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  gtmId: process.env.NEXT_PUBLIC_GTM_ID || "",
  ga4Id: process.env.NEXT_PUBLIC_GA4_ID || "",
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || "",
  googleAdsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "",
  googleAdsLeadLabel: process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL || "",
} as const;

/** Quem manda quando os dois existem: GTM. Evita contagem dobrada. */
export const ANALYTICS_MODE: "gtm" | "gtag" | "off" = PUBLIC_ENV.gtmId
  ? "gtm"
  : PUBLIC_ENV.ga4Id || PUBLIC_ENV.googleAdsId
    ? "gtag"
    : "off";

/** Só no servidor. Ler isso em componente de cliente devolve string vazia. */
export const SERVER_ENV = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  metaCapiToken: process.env.META_CAPI_TOKEN || "",
  metaCapiTestCode: process.env.META_CAPI_TEST_CODE || "",
  resendKey: process.env.RESEND_API_KEY || "",
  leadNotifyEmail: process.env.LEAD_NOTIFY_EMAIL || "",
  leadNotifyFrom: process.env.LEAD_NOTIFY_FROM || "Versa <onboarding@resend.dev>",
} as const;

export const HAS_SUPABASE = Boolean(
  SERVER_ENV.supabaseUrl && SERVER_ENV.supabaseServiceKey,
);
