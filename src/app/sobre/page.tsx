import type { Metadata } from "next";
import { InkTrail } from "@/components/v3/ink";
import { SobreBio } from "@/components/v3/sobre/SobreBio";
import { SobreFechamento } from "@/components/v3/sobre/SobreFechamento";
import { SobreHero } from "@/components/v3/sobre/SobreHero";
import "@/components/v3/sobre/sobre.css";
import { SOBRE } from "@/lib/content-v3";
import { SITE } from "@/lib/site";

const { title, description } = SOBRE.meta;

export const metadata: Metadata = {
  // `absolute` para não herdar o sufixo "· Versa" do layout: o título já diz a marca
  title: { absolute: title },
  description,
  alternates: { canonical: "/sobre" },
  // Repete type, locale, siteName e imagem: o openGraph da página substitui o do layout inteiro, não se mescla
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE.name,
    title,
    description,
    url: "/sobre",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: description }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/twitter-image"],
  },
};

/** Página Sobre: o Breno, o porquê de a Versa ser pequena e quem responde o WhatsApp. */
export default function SobrePage() {
  return (
    <>
      <SobreHero />
      <SobreBio />
      <SobreFechamento />
      <InkTrail />
    </>
  );
}
