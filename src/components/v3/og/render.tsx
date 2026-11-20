import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { HERO } from "@/lib/content-v3";

/**
 * Imagem de compartilhamento (Open Graph e Twitter): fundo ink, título do
 * hero à esquerda e o Hermes gravado à direita. As duas rotas usam este
 * mesmo desenho; cada uma declara o próprio `size` e `contentType` porque o
 * Next só lê essas exportações escritas literalmente no arquivo da rota.
 *
 * Cores como no globals.css, repetidas aqui porque o Satori não lê CSS.
 */
const INK = "#08070d";
const CHALK = "#f4f1fb";
const ACCENT = "#a887f5";

export async function renderShareImage() {
  const [hermes, fonte] = await Promise.all([
    // JPEG gerado por scripts/gravuras.mjs: o Satori não lê WebP
    readFile(join(process.cwd(), "src/components/v3/og/hermes-og.jpg")),
    // Satori lê TTF, OTF e WOFF, mas não WOFF2. Por isso o Inter Tight 500
    // (o peso dos títulos da referência) em WOFF, ao lado dos arquivos do site em src/fonts.
    readFile(join(process.cwd(), "src/fonts/InterTight-Medium.woff")),
  ]);

  const { before, circled, after } = HERO.lastLine;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: INK,
          color: CHALK,
          fontFamily: "Inter Tight",
          position: "relative",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse não usa next/image */}
        <img
          src={`data:image/jpeg;base64,${hermes.toString("base64")}`}
          width={510}
          height={630}
          alt=""
          style={{ position: "absolute", right: 24, top: 0 }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingLeft: 80,
            maxWidth: 700,
            fontSize: 76,
            fontWeight: 500,
            lineHeight: 1,
            letterSpacing: -3,
          }}
        >
          <span>{HERO.lines[0]}</span>
          <span>{HERO.lines[1]}</span>
          {/* pre: o Satori descarta o espaço nas pontas de cada trecho */}
          <span style={{ display: "flex", whiteSpace: "pre" }}>
            <span>{before}</span>
            <span style={{ color: ACCENT }}>{circled}</span>
            <span>{after}</span>
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Inter Tight", data: fonte, weight: 500, style: "normal" }],
    },
  );
}
