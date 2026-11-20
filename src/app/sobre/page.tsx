import type { Metadata } from "next";
import { InkTrail } from "@/components/v3/ink";
import { SobreBio } from "@/components/v3/sobre/SobreBio";
import { SobreFechamento } from "@/components/v3/sobre/SobreFechamento";
import { SobreHero } from "@/components/v3/sobre/SobreHero";
import "@/components/v3/sobre/sobre.css";
import { SOBRE } from "@/lib/content-v3";

const { title, description } = SOBRE.meta;

export const metadata: Metadata = {
  // `absolute` para não herdar o sufixo "· Versa" do layout: o título já diz a marca
  title: { absolute: title },
  description,
  alternates: { canonical: "/sobre" },
  openGraph: { title, description, url: "/sobre" },
  twitter: { title, description },
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
