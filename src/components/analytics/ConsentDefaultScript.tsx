import { ANALYTICS_MODE } from "@/lib/env";

/**
 * Consent Mode v2, declarado antes de tudo.
 *
 * Precisa ser um script embutido no <head>, síncrono, sem passar por
 * `next/script`: se ele rodar depois de qualquer tag do Google, a tag já
 * terá decidido gravar cookie antes de saber que o consentimento estava
 * negado, e aí o consentimento vira enfeite.
 *
 * O padrão é negado para tudo que identifica a pessoa. `functionality` e
 * `security` ficam concedidos porque não rastreiam ninguém. O
 * `wait_for_update` dá meio segundo para a escolha guardada ser aplicada
 * antes das tags dispararem.
 *
 * Renderiza null quando não há nenhuma tag configurada: um .env em branco
 * produz um site sem uma linha sequer de script de terceiro.
 */
export function ConsentDefaultScript() {
  if (ANALYTICS_MODE === "off") return null;

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;var s='denied';try{s=localStorage.getItem('versa:consent')==='granted'?'granted':'denied'}catch(e){}gtag('consent','default',{ad_storage:s,ad_user_data:s,ad_personalization:s,analytics_storage:s,functionality_storage:'granted',security_storage:'granted',wait_for_update:500});gtag('set','ads_data_redaction',s!=='granted');`,
      }}
    />
  );
}
