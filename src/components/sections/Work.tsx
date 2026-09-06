"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ArrowIcon, Button, WhatsAppIcon } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { CASES, CASE_FILTERS, type CaseStudy } from "@/lib/content";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Work() {
  const [filter, setFilter] = useState<string>("Todos");
  const [openId, setOpenId] = useState<string | null>(null);

  const visible =
    filter === "Todos" ? CASES : CASES.filter((c) => c.category === filter);
  const active = CASES.find((c) => c.id === openId) ?? null;

  return (
    <section id="trabalhos" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="shell">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="05"
            eyebrow="Trabalhos"
            title={
              <>
                Trabalho real,{" "}
                <span className="text-gradient">com nome e sobrenome.</span>
              </>
            }
            lede="Sem mockup genérico de banco de imagem. Estes são projetos que estão no ar, com clientes que autorizaram aparecer aqui."
            className="max-w-2xl"
          />

          {/* Filtros */}
          <Reveal delay={0.1} className="lg:shrink-0">
            <div
              role="tablist"
              aria-label="Filtrar trabalhos por categoria"
              className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] lg:overflow-visible [&::-webkit-scrollbar]:hidden"
            >
              {CASE_FILTERS.map((f) => {
                const isActive = filter === f;
                return (
                  <button
                    key={f}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "relative shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[0.8125rem] transition-colors duration-400",
                      isActive ? "text-ink" : "text-fog hover:text-chalk",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="work-filter-pill"
                        className="absolute inset-0 rounded-full bg-chalk"
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      />
                    )}
                    <span className="relative z-10">{f}</span>
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>

        {/* Grade */}
        <motion.div layout className="mt-14 grid gap-4 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {visible.map((c) => (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className={cn(c.featured && "md:col-span-2")}
              >
                <CaseCard study={c} onOpen={() => setOpenId(c.id)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <Reveal delay={0.08}>
          <div className="mt-12 flex flex-col items-start gap-4 rounded-3xl border border-chalk/8 bg-ink-2 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
            <div>
              <p className="text-subtitle">
                Seu projeto pode ser o próximo desta lista.
              </p>
              <p className="mt-2 max-w-[48ch] text-[0.875rem] text-fog">
                Conte o que a sua empresa precisa. Se não for o nosso escopo,
                dizemos na hora — e indicamos quem resolve.
              </p>
            </div>
            <Button href={SITE.contact.whatsapp} external size="lg">
              <WhatsAppIcon />
              Começar uma conversa
            </Button>
          </div>
        </Reveal>
      </div>

      <CaseModal study={active} onClose={() => setOpenId(null)} />
    </section>
  );
}

/* =========================================================================
   Card
   ========================================================================= */

function CaseCard({
  study,
  onOpen,
}: {
  study: CaseStudy;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      // Sem aria-label: o nome acessível vem do conteúdo visível do cartão
      // (categoria, setor, cliente e headline), evitando divergência entre
      // o que se lê e o que o leitor de tela anuncia.
      className="group/case relative block w-full overflow-hidden rounded-3xl border border-chalk/8 bg-ink-2 text-left transition-colors duration-500 hover:border-brand-soft/30"
    >
      <div
        className="relative w-full overflow-hidden bg-ink-3"
        style={{ aspectRatio: study.featured ? "16 / 9" : "4 / 3" }}
      >
        {study.media.kind === "video" ? (
          <InViewVideo
            src={study.media.src}
            srcWebm={study.media.srcWebm}
            poster={study.media.poster}
          />
        ) : (
          <>
            <Image
              src={study.media.images[0]}
              alt={`Peça do projeto ${study.client}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-top transition-[transform,opacity] duration-[900ms] ease-versa group-hover/case:scale-[1.03] group-hover/case:opacity-0"
            />
            <Image
              src={study.media.images[1] ?? study.media.images[0]}
              alt=""
              aria-hidden
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="scale-105 object-cover object-top opacity-0 transition-[transform,opacity] duration-[900ms] ease-versa group-hover/case:scale-100 group-hover/case:opacity-100"
            />
          </>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent opacity-90" />

        {/* selo de categoria */}
        <span className="absolute left-4 top-4 rounded-full border border-chalk/15 bg-ink/60 px-3 py-1 text-eyebrow text-chalk/80 backdrop-blur-md">
          {study.category}
        </span>
      </div>

      <div className="relative flex items-end justify-between gap-6 p-6 sm:p-7">
        <div>
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="size-2 rounded-full"
              style={{ backgroundColor: study.accent }}
            />
            <p className="text-eyebrow text-fog-dim">
              {study.sector} · {study.year}
            </p>
          </div>
          <h3 className="text-title mt-3">{study.client}</h3>
          <p className="mt-2 max-w-[44ch] text-[0.875rem] leading-relaxed text-fog">
            {study.headline}
          </p>
        </div>

        <span className="grid size-11 shrink-0 place-items-center rounded-full border border-chalk/12 text-chalk transition-all duration-500 ease-versa group-hover/case:border-transparent group-hover/case:bg-chalk group-hover/case:text-ink">
          <svg
            viewBox="0 0 16 16"
            className="size-4 transition-transform duration-500 ease-versa group-hover/case:translate-x-0.5 group-hover/case:-translate-y-0.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" />
          </svg>
        </span>
      </div>
    </button>
  );
}

/* =========================================================================
   Vídeo que só toca quando está na tela
   ========================================================================= */

function InViewVideo({
  src,
  srcWebm,
  poster,
  controls = false,
}: {
  src: string;
  srcWebm?: string;
  poster: string;
  controls?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <video
      ref={ref}
      className="size-full object-cover"
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      controls={controls}
      tabIndex={controls ? 0 : -1}
    >
      {srcWebm && <source src={srcWebm} type="video/webm" />}
      <source src={src} type="video/mp4" />
    </video>
  );
}

/* =========================================================================
   Modal do case
   ========================================================================= */

function CaseModal({
  study,
  onClose,
}: {
  study: CaseStudy | null;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!study) return;
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    // foco entra no painel para leitores de tela e navegação por teclado
    const t = setTimeout(() => panelRef.current?.focus(), 60);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [study, onKey]);

  return (
    <AnimatePresence>
      {study && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto overscroll-contain p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            type="button"
            aria-label="Fechar"
            onClick={onClose}
            className="fixed inset-0 cursor-default bg-ink/85 backdrop-blur-md"
          />

          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`case-${study.id}-title`}
            initial={{ opacity: 0, y: 40, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.99 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative my-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-chalk/10 bg-ink-2 outline-none"
          >
            {/* topo */}
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-chalk/8 bg-ink-2/90 px-6 py-4 backdrop-blur-xl sm:px-8">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="size-2 rounded-full"
                  style={{ backgroundColor: study.accent }}
                />
                <p className="text-eyebrow text-fog">
                  {study.client} · {study.sector}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="grid size-9 place-items-center rounded-full border border-chalk/12 text-fog transition-colors duration-300 hover:border-chalk/30 hover:text-chalk"
                aria-label="Fechar case"
              >
                <svg
                  viewBox="0 0 14 14"
                  className="size-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  aria-hidden
                >
                  <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" />
                </svg>
              </button>
            </div>

            {/* mídia */}
            <div className="bg-ink-3">
              {study.media.kind === "video" ? (
                <div style={{ aspectRatio: study.media.aspect }}>
                  <InViewVideo
                    src={study.media.src}
                    srcWebm={study.media.srcWebm}
                    poster={study.media.poster}
                    controls
                  />
                </div>
              ) : (
                <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto p-4 sm:p-6">
                  {study.media.images.map((src, i) => (
                    <div
                      key={src}
                      className="relative shrink-0 snap-center overflow-hidden rounded-xl border border-chalk/8"
                      style={{
                        aspectRatio: study.media.aspect,
                        width: "clamp(15rem, 48vw, 22rem)",
                      }}
                    >
                      <Image
                        src={src}
                        alt={`${study.client} — peça ${i + 1}`}
                        fill
                        sizes="(max-width: 640px) 70vw, 22rem"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* conteúdo */}
            <div className="grid gap-10 p-6 sm:p-8 lg:grid-cols-[1.3fr_0.7fr] lg:p-10">
              <div>
                <h3
                  id={`case-${study.id}-title`}
                  className="text-title text-balance"
                >
                  {study.headline}
                </h3>
                <p className="mt-5 max-w-[58ch] text-[0.9375rem] leading-relaxed text-fog">
                  {study.summary}
                </p>

                {study.metrics.length > 0 && (
                  <dl className="mt-8 grid gap-4 sm:grid-cols-3">
                    {study.metrics.map((m) => (
                      <div
                        key={m.label}
                        className="rounded-2xl border border-chalk/8 bg-ink-3 p-4"
                      >
                        <dt className="text-eyebrow text-fog-dim">{m.label}</dt>
                        <dd className="mt-2 font-display text-3xl font-bold tracking-tight text-gradient">
                          {m.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}

                <ul className="mt-8 flex flex-col gap-3">
                  {study.outcomes.map((o) => (
                    <li
                      key={o}
                      className="flex items-start gap-3 text-[0.875rem] leading-relaxed text-chalk/90"
                    >
                      <svg
                        viewBox="0 0 14 14"
                        className="mt-1 size-3.5 shrink-0 text-brand-soft"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <path d="M2.5 7.4 5.5 10.5 11.5 3.8" />
                      </svg>
                      {o}
                    </li>
                  ))}
                </ul>
              </div>

              <aside className="flex flex-col gap-7">
                <div>
                  <p className="text-eyebrow text-fog-dim">Escopo entregue</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {study.scope.map((s) => (
                      <li
                        key={s}
                        className="rounded-full border border-chalk/10 bg-chalk/[0.03] px-3 py-1.5 text-[0.75rem] text-fog"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-chalk/8 bg-ink-3 p-5">
                  <p className="text-[0.875rem] leading-relaxed text-fog">
                    Quer um projeto com esse nível de cuidado?
                  </p>
                  <Button
                    href={SITE.contact.whatsapp}
                    external
                    variant="ghost"
                    className="mt-4 w-full"
                  >
                    Falar com a Versa
                    <ArrowIcon />
                  </Button>
                </div>
              </aside>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
