import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { SERVICOS_PAGINAS, getServicoPagina } from "@/lib/servicos";
import { SITE } from "@/lib/site";
import { whatsappUrl } from "@/lib/whatsapp";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return SERVICOS_PAGINAS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = getServicoPagina(slug);
  if (!s) return {};
  return {
    title: s.seoTitle,
    description: s.seoDescription,
    alternates: { canonical: `/servicos/${s.slug}` },
    openGraph: { title: s.seoTitle, description: s.seoDescription },
  };
}

/**
 * Página de serviço para busca local.
 *
 * Estrutura fixa: promessa, problema dito pela consequência, o que entra,
 * como funciona, para quem é, dúvidas e um CTA só. O texto vem de
 * src/lib/servicos.ts, para editar sem mexer no layout.
 */
export default async function ServicoPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const s = getServicoPagina(slug);
  if (!s) notFound();

  const section = `pagina-${s.slug}`;
  const wa = whatsappUrl(s.origem);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: s.seoTitle,
      description: s.seoDescription,
      serviceType: s.nome,
      areaServed: [
        { "@type": "City", name: "Rio Branco" },
        { "@type": "State", name: "Acre" },
      ],
      provider: {
        "@type": "ProfessionalService",
        name: SITE.name,
        url: SITE.url,
        address: {
          "@type": "PostalAddress",
          addressLocality: SITE.city,
          addressRegion: SITE.state,
          addressCountry: SITE.country,
        },
      },
      url: `${SITE.url}/servicos/${s.slug}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: s.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: SITE.name, item: SITE.url },
        { "@type": "ListItem", position: 2, name: "Serviços", item: `${SITE.url}/servicos` },
        { "@type": "ListItem", position: 3, name: s.nome, item: `${SITE.url}/servicos/${s.slug}` },
      ],
    },
  ];

  const outros = SERVICOS_PAGINAS.filter((o) => o.slug !== s.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Promessa */}
      <section className="relative overflow-hidden pb-20 pt-32 sm:pt-40">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(70%_45%_at_50%_15%,black,transparent)]" />
          <div className="halo absolute left-1/2 top-0 size-[42rem] max-w-[150vw] -translate-x-1/2 blur-[90px]" />
        </div>
        <div className="shell relative">
          <nav aria-label="Você está em" className="text-eyebrow text-fog-dim">
            <Link href="/" className="transition-colors duration-300 hover:text-chalk">
              {SITE.name}
            </Link>
            <span className="mx-2">/</span>
            <Link href="/servicos" className="transition-colors duration-300 hover:text-chalk">
              Serviços
            </Link>
          </nav>
          <p className="text-eyebrow mt-8 text-brand-soft/80">{s.eyebrow}</p>
          <h1 className="text-display mt-5 max-w-[20ch] text-balance">
            {s.h1} <span className="text-gradient">{s.h1Destaque}</span>
          </h1>
          <p className="text-lede mt-6 max-w-[56ch] text-fog">{s.lede}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href={wa} size="lg" section={section} ctaLabel={s.cta}>
              {s.cta}
            </Button>
            <Button href="#como-funciona" size="lg" variant="ghost" section={section} ctaLabel="Como funciona">
              Como funciona
            </Button>
          </div>
        </div>
      </section>

      {/* Problema */}
      <section className="pb-20">
        <div className="shell grid gap-10 md:grid-cols-[1fr_1.4fr]">
          <h2 className="text-title max-w-[18ch]">{s.problema.titulo}</h2>
          <div className="flex flex-col gap-5">
            {s.problema.paragrafos.map((p) => (
              <p key={p.slice(0, 24)} className="max-w-[60ch] text-[1.0625rem] leading-relaxed text-fog">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Entregas */}
      <section className="pb-20">
        <div className="shell">
          <p className="text-eyebrow text-fog-dim">O que entra</p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {s.entregas.map((e) => (
              <li key={e.titulo} className="min-w-0 rounded-3xl border border-chalk/8 bg-ink-2 p-7">
                <h3 className="text-[1.125rem] font-medium tracking-tight text-chalk">{e.titulo}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-fog">{e.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="scroll-mt-28 pb-20">
        <div className="shell">
          <p className="text-eyebrow text-fog-dim">Como funciona</p>
          <ol className="mt-8 grid gap-4 md:grid-cols-4">
            {s.etapas.map((e, i) => (
              <li key={e.titulo} className="min-w-0 rounded-3xl border border-chalk/8 p-7">
                <span className="font-mono text-[0.8125rem] text-brand-soft/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-[1.125rem] font-medium tracking-tight text-chalk">{e.titulo}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-fog">{e.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Para quem */}
      <section className="pb-20">
        <div className="shell grid gap-10 md:grid-cols-[1fr_1.4fr]">
          <h2 className="text-title max-w-[18ch]">Para quem é</h2>
          <ul className="flex flex-col gap-4">
            {s.paraQuem.map((p) => (
              <li key={p} className="flex gap-4 text-[1.0625rem] leading-relaxed text-fog">
                <span aria-hidden className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-brand-soft" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Dúvidas */}
      <section className="pb-20">
        <div className="shell grid gap-10 md:grid-cols-[1fr_1.4fr]">
          <h2 className="text-title max-w-[18ch]">Dúvidas comuns</h2>
          <dl className="flex flex-col divide-y divide-chalk/8 border-y border-chalk/8">
            {s.faq.map((f) => (
              <div key={f.q} className="py-6">
                <dt className="text-[1.0625rem] font-medium text-chalk">{f.q}</dt>
                <dd className="mt-2 max-w-[60ch] text-[0.9375rem] leading-relaxed text-fog">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-28">
        <div className="shell">
          <div className="rounded-[2rem] border border-chalk/8 bg-ink-2 p-8 sm:p-12">
            <h2 className="text-title max-w-[24ch]">
              Conte como funciona hoje na sua empresa. Conversamos sobre o seu caso.
            </h2>
            <p className="mt-4 max-w-[52ch] text-fog">
              Você fala direto com quem faz o trabalho, pelo WhatsApp.
            </p>
            <div className="mt-8">
              <Button href={wa} size="lg" section={`${section}-final`} ctaLabel={s.cta}>
                {s.cta}
              </Button>
            </div>
          </div>

          <nav aria-label="Outros serviços" className="mt-14">
            <p className="text-eyebrow text-fog-dim">Outros serviços</p>
            <ul className="mt-5 flex flex-wrap gap-3">
              {outros.map((o) => (
                <li key={o.slug}>
                  <Link
                    href={`/servicos/${o.slug}`}
                    className="inline-flex rounded-full border border-chalk/12 px-5 py-2.5 text-[0.9375rem] text-fog transition-colors duration-300 hover:border-brand-soft/40 hover:text-chalk"
                  >
                    {o.nome}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
    </>
  );
}
