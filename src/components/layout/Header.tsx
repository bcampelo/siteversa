"use client";

import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { VersaMark } from "@/components/brand/VersaMark";
import { VersaWordmark } from "@/components/brand/VersaWordmark";
import { Button, WhatsAppIcon } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { SITE, CTA, DIAGNOSTICO_HREF } from "@/lib/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function Header() {
  const [condensed, setCondensed] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => {
    setCondensed(v > 24);
  });

  // Trava o scroll do fundo enquanto o menu mobile está aberto
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[padding] duration-700 ease-versa",
          condensed ? "py-2.5" : "py-4",
        )}
      >
        <div className="shell">
          <div
            className={cn(
              "flex items-center justify-between gap-6 rounded-full px-3 py-2 transition-all duration-700 ease-versa sm:px-4",
              condensed
                ? "glass shadow-[0_18px_50px_-24px_rgba(0,0,0,0.9)]"
                : "border border-transparent bg-transparent",
            )}
          >
            {/* Logo */}
            <Link
              href="#top"
              className="group/logo flex items-center gap-2.5 rounded-full pl-1 pr-2"
              aria-label="Versa — início"
            >
              <span id="nav-mark" className="block w-[1.85rem] sm:w-[2.1rem]">
                <VersaMark variant="gradient" idKey="nav" />
              </span>
              <span className="w-[3.6rem] text-chalk sm:w-[4.1rem]">
                <VersaWordmark title="Versa" />
              </span>
            </Link>

            {/* Navegação desktop */}
            <nav
              aria-label="Navegação principal"
              className="hidden items-center gap-1 lg:flex"
            >
              {SITE.nav.map((item) => (
                <TrackedLink
                  key={item.href}
                  href={item.href}
                  section="header-nav"
                  ctaLabel={item.label}
                  className="relative rounded-full px-3.5 py-2 text-[0.875rem] text-fog transition-colors duration-300 hover:text-chalk"
                >
                  {item.label}
                </TrackedLink>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              {/* No mobile o CTA vira só o ícone: continua sempre acessível
                  sem competir por espaço com o menu. */}
              {/*
                No celular o CTA virava só o ícone do WhatsApp, ou seja, o
                único caminho visível era o mais caro. Agora o botão leva ao
                diagnóstico e o WhatsApp fica ao lado, para quem já decidiu.
              */}
              <TrackedLink
                href={whatsappUrl("header")}
                section="header"
                ctaLabel="WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={CTA.whatsapp}
                className="grid size-11 place-items-center rounded-full border border-chalk/12 bg-chalk/[0.03] text-chalk transition-colors duration-300 hover:border-brand-soft/45"
              >
                <WhatsAppIcon />
              </TrackedLink>

              <Button
                href={DIAGNOSTICO_HREF}
                size="md"
                variant="primary"
                section="header"
                ctaLabel={CTA.primaryShort}
                className="max-lg:hidden"
              >
                {CTA.primaryShort}
              </Button>

              {/* Botão do menu mobile */}
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="menu-mobile"
                aria-label={open ? "Fechar menu" : "Abrir menu"}
                className="relative grid size-11 place-items-center rounded-full border border-chalk/12 bg-chalk/[0.03] lg:hidden"
              >
                <span className="relative block h-3 w-4.5">
                  <span
                    className={cn(
                      "absolute left-0 block h-px w-full bg-chalk transition-all duration-500 ease-versa",
                      open ? "top-1.5 rotate-45" : "top-0",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute left-0 block h-px w-full bg-chalk transition-all duration-500 ease-versa",
                      open ? "top-1.5 -rotate-45" : "top-3",
                    )}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Menu mobile em tela cheia */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            className="fixed inset-0 z-40 flex flex-col justify-between bg-ink/95 px-6 pb-10 pt-28 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0, clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ opacity: 0, clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.62, ease: [0.76, 0, 0.24, 1] }}
          >
            <div
              className="halo pointer-events-none absolute -top-24 left-1/2 size-[34rem] -translate-x-1/2 opacity-40 blur-2xl"
              aria-hidden
            />
            <nav aria-label="Navegação mobile" className="relative">
              <ul className="flex flex-col">
                {SITE.nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.16 + i * 0.06,
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="border-b border-chalk/8"
                  >
                    <a
                      href={item.href}
                      onClick={() => {
                        track("nav_click", {
                          section: "menu-mobile",
                          label: item.label,
                        });
                        setOpen(false);
                      }}
                      className="flex items-baseline justify-between py-5 text-display"
                    >
                      {item.label}
                      <span className="text-eyebrow text-fog-dim">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className="relative flex flex-col gap-3">
              <Button
                href={DIAGNOSTICO_HREF}
                size="lg"
                section="menu-mobile"
                ctaLabel={CTA.primary}
                onClick={() => setOpen(false)}
              >
                {CTA.primary}
              </Button>
              <Button
                href={whatsappUrl("menu-mobile")}
                external
                variant="ghost"
                size="lg"
                section="menu-mobile"
                ctaLabel={CTA.whatsapp}
              >
                <WhatsAppIcon />
                {CTA.whatsapp}
              </Button>
              <TrackedLink
                href={`mailto:${SITE.contact.email}`}
                section="menu-mobile"
                ctaLabel="E-mail"
                className="text-center text-sm text-fog"
              >
                {SITE.contact.email}
              </TrackedLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
