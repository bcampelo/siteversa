"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { ANALYTICS_MODE, PUBLIC_ENV } from "@/lib/env";
import { track } from "@/lib/analytics";
import { captureAttribution } from "@/lib/attribution";

/**
 * Carregamento das tags.
 *
 * Ordem das decisões:
 *
 * 1. Nada carrega se a variável correspondente estiver vazia. Um .env em
 *    branco produz um site sem nenhuma requisição de terceiro, que é o
 *    estado correto para desenvolvimento.
 * 2. GTM e GA4 sobem em Consent Mode, com tudo negado por padrão (o default
 *    é declarado no <head>, em `ConsentDefaultScript`). É o modelo que a
 *    LGPD pede e que o Google recomenda: a tag existe, mas não grava cookie
 *    de identificação até a pessoa aceitar.
 * 3. O pixel da Meta só sobe depois do aceite. Ele não tem consent mode
 *    equivalente, então a única forma correta é não carregar antes.
 * 4. Tudo entra como `afterInteractive`. Medição nunca disputa a primeira
 *    pintura com o conteúdo.
 */
export function Analytics() {
  const { gtmId, ga4Id, googleAdsId, metaPixelId } = PUBLIC_ENV;
  const [consent, setConsent] = useState<"pending" | "granted" | "denied">(
    "pending",
  );

  useEffect(() => {
    captureAttribution();
    const read = () => {
      try {
        const v = window.localStorage.getItem("versa:consent");
        setConsent(v === "granted" ? "granted" : v === "denied" ? "denied" : "pending");
      } catch {
        setConsent("pending");
      }
    };
    read();
    window.addEventListener("versa:consent-change", read);
    return () => window.removeEventListener("versa:consent-change", read);
  }, []);

  // Profundidade de rolagem: mede onde o site perde gente, sem plugin.
  useEffect(() => {
    const marks = [25, 50, 75, 90];
    const hit = new Set<number>();
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const pct = Math.round((window.scrollY / max) * 100);
      for (const m of marks) {
        if (pct >= m && !hit.has(m)) {
          hit.add(m);
          track("scroll_depth", { section: "pagina", percent: m });
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (ANALYTICS_MODE === "off" && !metaPixelId) return null;

  return (
    <>
      {/*
        O Consent Mode não mora aqui: ele precisa rodar antes de qualquer
        tag, inclusive antes da hidratação do React, então vive como script
        embutido no <head> do layout. Ver `ConsentDefaultScript`.
      */}
      {gtmId && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
        </Script>
      )}

      {!gtmId && (ga4Id || googleAdsId) && (
        <>
          <Script
            id="gtag-src"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id || googleAdsId}`}
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`gtag('js',new Date());
${ga4Id ? `gtag('config','${ga4Id}',{send_page_view:true});` : ""}
${googleAdsId ? `gtag('config','${googleAdsId}');` : ""}`}
          </Script>
        </>
      )}

      {metaPixelId && consent === "granted" && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${metaPixelId}');fbq('track','PageView');`}
        </Script>
      )}
    </>
  );
}
