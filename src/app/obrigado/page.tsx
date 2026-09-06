import type { Metadata } from "next";
import { Obrigado } from "@/components/diagnostico/Obrigado";

export const metadata: Metadata = {
  title: "Recebemos o seu diagnóstico",
  description: "Seu diagnóstico foi registrado. Veja o que acontece agora.",
  robots: { index: false, follow: false },
};

export default function ObrigadoPage() {
  return <Obrigado />;
}
