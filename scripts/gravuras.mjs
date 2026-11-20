/**
 * Assa as gravuras da home v3 em WebP com transparência.
 *
 * Uso: node scripts/gravuras.mjs [nome ...]
 *
 * Por que existe: a referência fazia o efeito no navegador, com
 * filter: contrast(14), mix-blend-mode e máscara CSS sobre cada estátua. Isso
 * custa pintura a cada quadro e quebra o layout em telas pequenas. Aqui o
 * mesmo cálculo roda uma vez, por pixel, e o resultado vira uma imagem com
 * alfa que o site só coloca com <Image>.
 *
 * O cálculo, por pixel (valores de 0 a 1):
 *   1. recorta a fonte como object-fit: cover (ou zoom, no post) a 2x do
 *      tamanho de exibição;
 *   2. cinza, contraste 1.3 e brilho 1.05, como o filter da referência;
 *   3. listras: onda triangular inclinada 14 graus, período de 5px (10px a 2x);
 *   4. m = 0.5 v + 0.5 s;  t = clamp((m - 0.5) * K + 0.5, 0, 1), com K = 14
 *      (o contrast(14) da referência);
 *   5. variante escura: alfa = t, cor em degradê de 165 graus;
 *      clara: alfa = 1 - t, cor = brand;  branca: alfa = t, cor = chalk;
 *   6. alfa multiplicado pela máscara radial elíptica da tabela.
 *
 * As fontes ficam em ~/Downloads (fora do repositório). As imagens geradas
 * em public/v3/ são commitadas, então o build do site não depende delas.
 */

import { mkdir, readdir, writeFile } from "node:fs/promises";
import { homedir, tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "v3");
// O ImageResponse (Satori) não lê WebP, então o OG usa uma versão em JPEG fora de public/v3
const OG_HERMES = join(ROOT, "src", "components", "v3", "og", "hermes-og.jpg");
const INK = { r: 8, g: 7, b: 13 };
const DOWNLOADS = join(homedir(), "Downloads");
const FONTES = join(homedir(), "Projetos/Versa/03-Site/site-v3/fontes");
const ATLAS_DOOP = "https://doop.design/a/bk6CelDTDV.webp";

/** Tokens do site (globals.css), repetidos aqui porque o script não lê CSS. */
const COR = {
  chalk: [244, 241, 251],
  brandSoft: [201, 186, 255],
  accent: [168, 135, 245],
  brand: [119, 81, 187],
  ink: [8, 7, 13],
};

/** Luminância 0 a 1 (pesos do grayscale do CSS). */
const luma = ([r, g, b]) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
/**
 * As listras da referência vão de chalk a ink, não de branco a preto. Com 0 e 1
 * a gravura sai com o preto mais fechado e o claro mais gasto que no png
 * aprovado. Medido contra o png (erro médio sobre o recorte, com desfoque):
 * Hermes do hero 4.4 com 0 e 1, 2.3 com chalk e ink; post 13.7 e 10.8.
 */
const LISTRA_ESCURA = luma(COR.ink);
const LISTRA_CLARA = luma(COR.chalk);

/** Degradê de 165 graus. O hero passa por brand-soft; as outras gravuras não. */
const GRAD_HERO = [
  [0.1, COR.chalk],
  [0.45, COR.brandSoft],
  [0.85, COR.accent],
];
const GRAD_PADRAO = [
  [0.1, COR.chalk],
  [0.9, COR.accent],
];

/** Escala padrão do arquivo em relação ao tamanho de exibição. */
const ESCALA = 2;
const ANGULO_LISTRA = -14; // graus, como o repeating-linear-gradient(-14deg)
const ANGULO_COR = 165;

/**
 * w e h: tamanho de exibição em px. foco: object-position em 0 a 1.
 * mascara: [rx, ry, cx, cy, in] em %, como na tabela da spec.
 */
const GRAVURAS = [
  {
    nome: "hermes",
    fonte: () => achar(DOWNLOADS, /^Hermes_statue_shouting.*_a6f4974b_2K\.jpg$/),
    w: 600,
    h: 740,
    foco: [0.5, 0.35],
    variante: "escura",
    gradiente: GRAD_HERO,
    mascara: [64, 66, 56, 44, 62],
    // O hero da referência usa brightness 1.06; as outras, 1.05
    brilho: 1.06,
  },
  {
    // Variante de celular do Hermes: o hero é o LCP e, no celular, aparece com
    // no máximo 420px. 1.2x cobre isso a DPR 1.7 por uma fração do peso (a
    // conta é a mesma, só a escala muda). Servida por <picture> até 760px.
    nome: "hermes-m",
    fonte: () => achar(DOWNLOADS, /^Hermes_statue_shouting.*_a6f4974b_2K\.jpg$/),
    w: 600,
    h: 740,
    escala: 1.2,
    foco: [0.5, 0.35],
    variante: "escura",
    gradiente: GRAD_HERO,
    mascara: [64, 66, 56, 44, 62],
    brilho: 1.06,
  },
  {
    nome: "post-hermes",
    fonte: () => achar(DOWNLOADS, /^Hermes_statue_shouting.*_a6f4974b_2K\.jpg$/),
    w: 224,
    h: 164,
    // background-size 150% e position 62% 24%: a fonte entra com 1.5x a largura da caixa.
    // Calibrado contra o png aprovado: busca em grade (zoom 1.0 a 1.8, foco x e y)
    // do recorte 224x164 contra o post da referência. O mínimo é exatamente zoom 1.5,
    // foco 62% 24% (erro 13.7; zoom 1.4 e 1.6 passam de 35). O que parecia
    // "enquadramento mais fechado" era o piso das listras, corrigido acima.
    foco: [0.62, 0.24],
    zoom: 1.5,
    variante: "branca",
    mascara: null,
    // Na referência o post usa contrast(12) e listras de 4px
    contraste: 12,
    periodo: 4,
  },
  {
    nome: "justica",
    fonte: () => achar(DOWNLOADS, /^Statue_of_Lady_Justice_holding.*2dcbf387_2K\.jpg$/),
    w: 440,
    h: 600,
    foco: [0.5, 0.3],
    variante: "escura",
    gradiente: GRAD_PADRAO,
    mascara: [72, 70, 52, 40, 66],
  },
  {
    nome: "atlas",
    fonte: fonteAtlas,
    w: 360,
    h: 560,
    foco: [0.5, 0.5],
    variante: "escura",
    gradiente: GRAD_PADRAO,
    mascara: [62, 64, 50, 46, 58],
  },
  {
    nome: "higia",
    fonte: () => achar(DOWNLOADS, /^Statue_holding_pill_bottle_c6a331b6_2K\.jpg$/),
    w: 360,
    h: 560,
    foco: [0.5, 0.5],
    variante: "escura",
    gradiente: GRAD_PADRAO,
    mascara: [62, 64, 50, 46, 58],
  },
  {
    nome: "mao-caneta",
    fonte: async () => join(FONTES, "mao-caneta-fundo-claro.png"),
    w: 480,
    h: 580,
    foco: [0.5, 0.5],
    variante: "clara",
    mascara: [60, 60, 55, 58, 60],
  },
  {
    nome: "busto-cta",
    fonte: () => achar(DOWNLOADS, /^Marble_bust_listening_gesture_b922e259_2K\.jpg$/),
    w: 560,
    h: 600,
    foco: [0.5, 0.3],
    // A opacidade .4 é aplicada na exibição, não no arquivo
    variante: "escura",
    gradiente: GRAD_PADRAO,
    mascara: [50, 52, 50, 46, 45],
  },
];

/* ------------------------------------------------------------------ fontes */

async function achar(dir, regex) {
  const arquivo = (await readdir(dir)).find((f) => regex.test(f));
  if (!arquivo) throw new Error(`Fonte não encontrada em ${dir}: ${regex}`);
  return join(dir, arquivo);
}

/**
 * O Atlas só existe em 640px no Doop. Se o Breno salvar a versão 2K em
 * ~/Downloads (nome com "Atlas" e "2K"), ela passa a valer sozinha.
 */
async function fonteAtlas() {
  try {
    return await achar(DOWNLOADS, /atlas.*2K\.(jpg|png|webp)$/i);
  } catch {
    const res = await fetch(ATLAS_DOOP);
    if (!res.ok) throw new Error(`Atlas do Doop: HTTP ${res.status}`);
    const destino = join(tmpdir(), "versa-atlas-doop.webp");
    await writeFile(destino, Buffer.from(await res.arrayBuffer()));
    return destino;
  }
}

/* ------------------------------------------------------------------ cálculo */

const clamp01 = (n) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** Posição 0 a 1 de um pixel ao longo de um gradiente CSS de `graus`. */
function posicaoGradiente(x, y, W, H, graus) {
  const a = (graus * Math.PI) / 180;
  const dx = Math.sin(a);
  const dy = -Math.cos(a);
  const comprimento = Math.abs(W * dx) + Math.abs(H * dy);
  return ((x + 0.5 - W / 2) * dx + (y + 0.5 - H / 2) * dy) / comprimento + 0.5;
}

function corNoGradiente(stops, p) {
  if (p <= stops[0][0]) return stops[0][1];
  for (let i = 1; i < stops.length; i++) {
    const [p1, c1] = stops[i];
    if (p <= p1) {
      const [p0, c0] = stops[i - 1];
      const k = (p - p0) / (p1 - p0);
      return [0, 1, 2].map((j) => c0[j] + (c1[j] - c0[j]) * k);
    }
  }
  return stops[stops.length - 1][1];
}

/** Recorte como object-fit: cover (ou com zoom), já na escala do arquivo. */
async function recortar(fonte, g) {
  const esc = g.escala ?? ESCALA;
  const W = Math.round(g.w * esc);
  const H = Math.round(g.h * esc);
  const meta = await sharp(fonte).metadata();
  const escala = g.zoom ? (W * g.zoom) / meta.width : Math.max(W / meta.width, H / meta.height);
  const sw = Math.round(meta.width * escala);
  const sh = Math.round(meta.height * escala);
  if (sw < W || sh < H) throw new Error(`${g.nome}: a fonte não cobre a caixa`);
  const left = Math.round((sw - W) * g.foco[0]);
  const top = Math.round((sh - H) * g.foco[1]);

  const { data, info } = await sharp(fonte)
    .removeAlpha()
    .toColourspace("srgb")
    .resize(sw, sh, { kernel: "lanczos3" })
    .extract({ left, top, width: W, height: H })
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, canais: info.channels, W, H };
}

function assar(g, { data, canais, W, H }) {
  const K = g.contraste ?? 14;
  const brilho = g.brilho ?? 1.05;
  const periodo = (g.periodo ?? 5) * (g.escala ?? ESCALA);
  const ang = (ANGULO_LISTRA * Math.PI) / 180;
  const ldx = Math.sin(ang);
  const ldy = -Math.cos(ang);
  const lcomp = Math.abs(W * ldx) + Math.abs(H * ldy);
  const [rx, ry, cx, cy, dentro] = g.mascara ?? [];

  const out = Buffer.alloc(W * H * 4);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * canais;
      // grayscale(1) do CSS: pesos de luminância no próprio sRGB
      const r = data[i] / 255;
      const gc = data[i + (canais > 1 ? 1 : 0)] / 255;
      const b = data[i + (canais > 2 ? 2 : 0)] / 255;
      let v = 0.2126 * r + 0.7152 * gc + 0.0722 * b;
      v = clamp01((v - 0.5) * 1.3 + 0.5);
      v = clamp01(v * brilho);

      // onda triangular: 1 na linha de giz, 0 no meio da linha de tinta
      const pos = (x + 0.5 - W / 2) * ldx + (y + 0.5 - H / 2) * ldy + lcomp / 2;
      const fase = (((pos % periodo) + periodo) % periodo) / periodo;
      const s = LISTRA_ESCURA + (LISTRA_CLARA - LISTRA_ESCURA) * Math.abs(1 - 2 * fase);

      const m = 0.5 * v + 0.5 * s;
      const t = clamp01((m - 0.5) * K + 0.5);

      let alfa = g.variante === "clara" ? 1 - t : t;

      if (g.mascara) {
        const d = Math.hypot(
          (x + 0.5 - (W * cx) / 100) / ((W * rx) / 100),
          (y + 0.5 - (H * cy) / 100) / ((H * ry) / 100),
        );
        const limite = dentro / 100;
        alfa *= d <= limite ? 1 : d >= 1 ? 0 : 1 - (d - limite) / (1 - limite);
      }

      let cor;
      if (g.variante === "clara") cor = COR.brand;
      else if (g.variante === "branca") cor = COR.chalk;
      else cor = corNoGradiente(g.gradiente, posicaoGradiente(x, y, W, H, ANGULO_COR));

      const o = (y * W + x) * 4;
      out[o] = Math.round(cor[0]);
      out[o + 1] = Math.round(cor[1]);
      out[o + 2] = Math.round(cor[2]);
      out[o + 3] = Math.round(alfa * 255);
    }
  }
  return out;
}

/* --------------------------------------------------------------------- main */

async function main() {
  const pedidas = process.argv.slice(2);
  const lista = pedidas.length
    ? GRAVURAS.filter((g) => pedidas.includes(g.nome))
    : GRAVURAS;
  if (!lista.length) throw new Error(`Nenhuma gravura com esse nome: ${pedidas.join(", ")}`);

  await mkdir(OUT, { recursive: true });

  for (const g of lista) {
    const fonte = await g.fonte();
    const recorte = await recortar(fonte, g);
    const rgba = assar(g, recorte);
    const destino = join(OUT, `${g.nome}.webp`);
    const info = await sharp(rgba, {
      raw: { width: recorte.W, height: recorte.H, channels: 4 },
    })
      .webp({ quality: 80, alphaQuality: 80, effort: 6 })
      .toFile(destino);
    console.log(
      `${g.nome}.webp  ${recorte.W}x${recorte.H}  ${(info.size / 1024).toFixed(0)} KB`,
    );

    if (g.nome === "hermes") {
      // 510x630 é o que a imagem de compartilhamento mostra (1200x630, Hermes à direita)
      const og = await sharp(rgba, {
        raw: { width: recorte.W, height: recorte.H, channels: 4 },
      })
        .resize(510, 630, { fit: "cover", position: "centre" })
        .flatten({ background: INK })
        .jpeg({ quality: 88 })
        .toFile(OG_HERMES);
      console.log(`hermes-og.jpg  510x630  ${(og.size / 1024).toFixed(0)} KB`);
    }
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
