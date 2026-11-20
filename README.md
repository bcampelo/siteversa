# Site da Versa

Site institucional da Versa — construído do zero em Next.js 16 (App Router),
TypeScript, Tailwind CSS v4, Motion, GSAP e React Three Fiber.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de produção
npm start       # sobe o build
npm run lint
```

---

## 1. Antes de publicar — os 3 ajustes obrigatórios

### 1.1 Domínio

`src/lib/site.ts` → campo `url`. Ele alimenta SEO, canonical, sitemap,
robots.txt e as imagens de Open Graph.

```ts
url: "https://seudominio.com.br",
```

### 1.2 Contatos

Também em `src/lib/site.ts`. Já estão preenchidos com os dados atuais:

```ts
email:            "contatoversa.org@gmail.com"
whatsappNumber:   "5568992380529"        // internacional, só dígitos
instagramHandle:  "@helloversa"
```

O link do WhatsApp é montado automaticamente com mensagem pré-preenchida
(`WHATSAPP_MESSAGE`, no topo do arquivo) — o lead já chega dizendo que veio
pelo site.

### 1.3 Resultados dos cases

Em `src/lib/content.ts`, cada case tem um array `metrics` **vazio**. Ele está
vazio de propósito: número inventado é a forma mais rápida de perder a
confiança que o resto da página conquista. Quando você tiver os dados reais,
preencha assim:

```ts
metrics: [
  { value: "+312%", label: "Leads via WhatsApp" },
  { value: "R$ 4,80", label: "Custo por lead" },
  { value: "3,2x", label: "Retorno sobre investimento" },
],
```

A faixa de números aparece sozinha no modal do case. Se o array continuar
vazio, nada quebra — a seção simplesmente não é renderizada.

---

## 2. Onde mexer em cada coisa

| Quero mudar | Arquivo |
|---|---|
| Contatos, domínio, menu | `src/lib/site.ts` |
| Serviços, diferenciais, método, cases, stack, FAQ | `src/lib/content.ts` |
| Cores, tipografia, espaçamento, curvas de animação | `src/app/globals.css` (bloco `@theme`) |
| Ordem das seções | `src/app/page.tsx` |
| Logo (monograma / logotipo) | `src/components/brand/` |
| Cena 3D do hero | `src/components/sections/HeroCanvas.tsx` |
| Imagens e vídeos do portfólio | `public/work/`, `public/video/` |

Todo o conteúdo editorial está separado do layout: dá para reescrever a copy
inteira sem tocar em uma linha de componente.

---

## 3. Decisões de projeto

**Identidade.** O monograma e o logotipo foram extraídos dos vetores
originais (`LogosVersa2.ai`), não de PNG. Cada parte do símbolo — asas, coroa
e bases — é um grupo SVG independente, o que permite animar a marca peça por
peça. As cores `#7751BB` e `#44267B` vêm do arquivo oficial.

**Preloader.** A marca se monta no carregamento e, ao terminar, voa para a
posição real do logo no cabeçalho (a posição é medida em runtime, não
chumbada). Roda uma vez por sessão e não existe em `prefers-reduced-motion`.

**Tipografia.** Inter Tight no display (mesma grotesca tensa dos carrosséis
da marca), Geist no texto, Geist Mono nos rótulos e código, Instrument Serif
itálico como acento editorial — usado duas vezes em toda a página, de
propósito. Todas auto-hospedadas em `src/fonts` (~140 KB): zero requisição a
terceiros, zero CLS. Detalhes e licenças em `src/fonts/README.md`.

**Motion.** Uma única curva (`cubic-bezier(.22,1,.36,1)`) governa o site
inteiro, exposta como `--ease-versa`. Reveals e microinterações usam Motion;
o scroll horizontal do método e a pilha de serviços usam `useScroll`; Lenis
dá inércia ao scroll (desligado no toque e em reduced-motion).

**3D.** Malha de partículas animada inteiramente no vertex shader — a CPU
não toca em nenhum ponto por frame. O `<Canvas>` congela quando o hero sai
da tela, a densidade cai em telas pequenas e nada é montado em
`prefers-reduced-motion`. O carregamento é dinâmico: a cena nunca bloqueia
o conteúdo.

**Acessibilidade.** Skip link, foco visível em tudo, `aria-expanded` nos
acordeões, modal com `role="dialog"` e fechamento por `Esc`, contraste de
texto acima de AA e `prefers-reduced-motion` respeitado em CSS e em JS.

**Números.** No lugar de estatísticas infladas, a seção de compromissos
mostra padrões que a Versa consegue cumprir e que o cliente pode conferir.
Mais difícil de escrever, muito mais difícil de contestar.

---

## 3.1 Site v3: decisões da rodada 2

- Navegação: Serviços, Trabalhos, Como trabalhamos, Sobre e o botão. O rodapé repete as rotas e traz o Instagram.
- Rota `/sobre`: a foto do Breno é natural, recortada, sem gravura; o estilo da marca entra só nos traços em volta.
- "Como funciona" virou o roadmap "Como trabalhamos", com seis etapas desenhadas pela rolagem.
- Cada ideia aparece uma vez no site: "quem atende é quem faz" só no `/sobre`, "quem responde a mensagem é quem vai fazer o trabalho" só no fechamento da home.
- Animação em CSS disparada por IntersectionObserver; rolagem e ponteiro em `requestAnimationFrame`, com listener passivo e só `transform`, `translate`, `opacity`, `stroke-dashoffset` e `clip-path`. Nenhuma biblioteca de animação.
- Rastro de tinta e Hermes seguindo o mouse só montam com `(pointer: fine)`. Com `prefers-reduced-motion` e `?still`, tudo aparece no estado final.
- Link da assinatura do fechamento usa o evento `cta_click`, porque `about_open` não existe em `VersaEvent`.
- Seção "Mais peças" (rodada 3): carrossel da Lastro e vídeos mudos em laço da Join Club.

## 4. Deploy

Estático em tudo (`○ prerendered`), então qualquer host serve. Na Vercel:

```bash
npx vercel        # preview
npx vercel --prod
```

Após apontar o domínio, confira `src/lib/site.ts → url` e valide
`/(sitemap.xml|robots.txt|opengraph-image.png)`.

---

## 5. Estrutura

```
src/
├── app/                  layout, página, SEO, ícones, OG image
├── components/
│   ├── brand/            monograma e logotipo em SVG animável
│   ├── layout/           header, footer, preloader, progresso
│   ├── providers/        Lenis, estado da intro
│   ├── sections/         as 11 seções da página
│   └── ui/               botão, reveal, marquee, split text, spotlight
├── fonts/                woff2 auto-hospedados
└── lib/                  configuração, conteúdo, utilitários
```
