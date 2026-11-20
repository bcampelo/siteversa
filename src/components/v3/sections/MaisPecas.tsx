import { MAIS_PECAS } from "@/lib/content-v3";
import { Coverflow } from "./maispecas/Coverflow";
import { VideoLoop } from "./maispecas/VideoLoop";

const { lastro, joinClub } = MAIS_PECAS;

const CAPTION = "pt-3 text-[15px] leading-[1.55] text-fog";

/**
 * Artes da Lastro em coverflow e animações da Join Club em laço. Fica depois
 * dos três cases e fora do título deles. Sem métrica nem promessa de
 * resultado: só as peças e a legenda de cada uma.
 *
 * `overflow-x: clip` porque os itens de trás do coverflow passam da borda da
 * tela no celular.
 */
export function MaisPecas() {
  return (
    // Sem padding em cima: o Trabalhos já fecha com o dele
    <section
      id="pecas"
      aria-labelledby="pecas-titulo"
      className="overflow-x-clip pb-24 tab:pb-36"
    >
      <div className="wrap">
        <header className="mb-12 grid gap-4 tab:mb-16">
          <h2
            id="pecas-titulo"
            className="max-w-[16ch] font-display text-[40px] leading-none font-medium tracking-[-0.04em] text-balance tab:text-[64px]"
          >
            {MAIS_PECAS.title}
          </h2>
          <p className="max-w-[40ch] text-[17px] leading-[1.55] text-fog">
            {MAIS_PECAS.lede}
          </p>
        </header>

        <div>
          <h3 className="font-display text-[28px] leading-[1.55] font-medium tracking-[-0.02em]">
            {lastro.name}
          </h3>
          <p className="mb-6 text-[17px] leading-[1.55] text-fog">
            {lastro.line}
          </p>
          <Coverflow
            arts={lastro.arts}
            labels={{
              region: lastro.label,
              prev: lastro.prev,
              next: lastro.next,
              goTo: lastro.goTo,
              item: lastro.item,
              of: lastro.of,
            }}
          />
        </div>

        {/*
          As colunas seguem a razão 16:9 para 9:16 (256 para 81), então os dois
          quadros ficam com a mesma altura lado a lado. No celular empilham,
          e o de stories não passa de 280px para não virar uma tela inteira.
        */}
        <div className="mt-20 grid items-start gap-x-8 gap-y-12 tab:mt-28 tab:grid-cols-[minmax(0,256fr)_minmax(0,81fr)]">
          <figure className="min-w-0">
            <VideoLoop
              webm={joinClub.tv.webm}
              mp4={joinClub.tv.mp4}
              poster={joinClub.tv.poster}
              width={joinClub.tv.width}
              height={joinClub.tv.height}
              label={joinClub.tv.label}
            />
            <figcaption className={CAPTION}>{joinClub.tv.caption}</figcaption>
          </figure>
          <figure className="min-w-0 max-w-[280px] tab:max-w-none">
            <VideoLoop
              webm={joinClub.stories.webm}
              mp4={joinClub.stories.mp4}
              poster={joinClub.stories.poster}
              width={joinClub.stories.width}
              height={joinClub.stories.height}
              label={joinClub.stories.label}
            />
            <figcaption className={CAPTION}>
              {joinClub.stories.caption}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
