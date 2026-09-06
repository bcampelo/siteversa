"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ANALYTICS_MODE, PUBLIC_ENV } from "@/lib/env";
import { track } from "@/lib/analytics";

const KEY = "versa:consent";

/**
 * Aviso de cookies.
 *
 * Aparece só quando existe alguma tag configurada. Site sem medição não
 * grava cookie nenhum e pedir consentimento nesse caso seria teatro.
 *
 * Recusar é tão fácil quanto aceitar, os dois botões têm o mesmo peso visual
 * e o mesmo número de cliques. Isso não é só ética, é o que a LGPD exige:
 * consentimento tem que ser livre, e um "recusar" escondido não é livre.
 */
export function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const hasTags = ANALYTICS_MODE !== "off" || Boolean(PUBLIC_ENV.metaPixelId);

  useEffect(() => {
    if (!hasTags) return;
    try {
      const stored = window.localStorage.getItem(KEY);
      if (stored !== "granted" && stored !== "denied") {
        // Um respiro antes de aparecer: o banner não pode competir com o hero.
        const t = setTimeout(() => setVisible(true), 1400);
        return () => clearTimeout(t);
      }
    } catch {
      /* storage bloqueado: não insiste */
    }
  }, [hasTags]);

  function decide(value: "granted" | "denied") {
    try {
      window.localStorage.setItem(KEY, value);
    } catch {
      /* segue sem persistir */
    }
    try {
      window.gtag?.("consent", "update", {
        ad_storage: value,
        ad_user_data: value,
        ad_personalization: value,
        analytics_storage: value,
      });
      window.gtag?.("set", "ads_data_redaction", value !== "granted");
    } catch {
      /* idem */
    }
    window.dispatchEvent(new Event("versa:consent-change"));
    track("consent_update", { section: "consent", choice: value });
    setVisible(false);
  }

  if (!hasTags) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-label="Aviso de cookies"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-3xl rounded-2xl border border-chalk/12 bg-ink-2/95 p-5 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.95)] backdrop-blur-xl sm:inset-x-6 sm:bottom-6 sm:p-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <p className="text-[0.8125rem] leading-relaxed text-fog">
              Usamos cookies para medir de onde vêm as visitas e o que funciona
              no site. Sem isso, a gente também ficaria no escuro.{" "}
              <Link
                href="/privacidade"
                className="link-underline text-chalk"
              >
                Como tratamos seus dados
              </Link>
              .
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => decide("denied")}
                className="rounded-full border border-chalk/15 px-5 py-2.5 text-[0.8125rem] text-fog transition-colors duration-300 hover:border-chalk/35 hover:text-chalk"
              >
                Recusar
              </button>
              <button
                type="button"
                onClick={() => decide("granted")}
                className="rounded-full bg-chalk px-5 py-2.5 text-[0.8125rem] font-medium text-ink transition-opacity duration-300 hover:opacity-90"
              >
                Aceitar
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
