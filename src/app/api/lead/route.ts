import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { SERVER_ENV } from "@/lib/env";
import { getSupabase } from "@/lib/supabase-server";
import { diagnosticar, QUESTIONS, type Answers } from "@/lib/diagnostico";
import { PUBLIC_ENV } from "@/lib/env";

export const runtime = "nodejs";

/* -------------------------------------------------------------------------
   Rota de captação de lead.

   Ordem das operações pensada para nunca perder um lead:

   1. Valida e calcula o score no servidor. O cliente manda resposta, não
      pontuação.
   2. Grava no banco. Se isso falhar, ainda tentamos notificar, porque um
      lead no e-mail vale mais do que um lead em lugar nenhum.
   3. Notifica e manda o evento para a Meta. As duas coisas são "melhor
      esforço": falha em qualquer uma delas não derruba a resposta.
   4. Devolve o diagnóstico. Mesmo com tudo mais falhando, o visitante
      recebe o que veio buscar.
   ------------------------------------------------------------------------- */

const optionValues = (id: string) =>
  QUESTIONS.find((q) => q.id === id)!.options.map((o) => o.value) as [
    string,
    ...string[],
  ];

const schema = z.object({
  nome: z.string().trim().min(2).max(120),
  whatsapp: z.string().trim().min(8).max(30),
  email: z.string().trim().email().max(160).optional().or(z.literal("")),
  observacao: z.string().trim().max(1200).optional().or(z.literal("")),

  problema: z.enum(optionValues("problema")).optional(),
  investimento: z.enum(optionValues("investimento")).optional(),
  valor_cliente: z.enum(optionValues("valor_cliente")).optional(),
  canal_contato: z.enum(optionValues("canal_contato")).optional(),
  prazo: z.enum(optionValues("prazo")).optional(),
  decisor: z.enum(optionValues("decisor")).optional(),

  origem: z.string().trim().max(80).optional(),
  atribuicao: z.record(z.string(), z.string()).optional(),

  /**
   * Campo isca. Humano nunca preenche, robô quase sempre preenche.
   *
   * O schema aceita qualquer texto de propósito. Se ele rejeitasse, a
   * resposta seria 400 e o robô saberia exatamente qual campo o denunciou.
   * Quem decide é a checagem logo abaixo, e ela devolve 200.
   */
  empresa_site: z.string().max(500).optional(),
});

/** Limite simples por IP. Some quando a instância recicla, e tudo bem. */
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 2000) hits.clear();
  return list.length > MAX_PER_WINDOW;
}

const sha256 = (v: string) =>
  createHash("sha256").update(v.trim().toLowerCase()).digest("hex");

/** Telefone para o formato que a Meta espera: só dígitos, com país. */
function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length <= 11) return `55${digits}`;
  return digits;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, erro: "Muitas tentativas. Espere um minuto." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, erro: "Corpo inválido." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, erro: "Confira os campos e tente de novo." },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // Isca preenchida: responde 200 para o robô não perceber, e não grava nada.
  if (data.empresa_site) {
    return NextResponse.json({ ok: true, ignorado: true });
  }

  const answers: Answers = {
    problema: data.problema,
    investimento: data.investimento,
    valor_cliente: data.valor_cliente,
    canal_contato: data.canal_contato,
    prazo: data.prazo,
    decisor: data.decisor,
  };
  const diag = diagnosticar(answers);
  const a = data.atribuicao ?? {};

  let leadId: string | null = null;
  const supabase = getSupabase();

  if (supabase) {
    const { data: inserted, error } = await supabase
      .from("leads")
      .insert({
        nome: data.nome,
        whatsapp: data.whatsapp,
        email: data.email || null,
        observacao: data.observacao || null,
        ...answers,
        score: diag.score,
        temperatura: diag.temperatura,
        servico_sugerido: diag.servico,
        origem: data.origem ?? "diagnostico",
        utm_source: a.utm_source ?? null,
        utm_medium: a.utm_medium ?? null,
        utm_campaign: a.utm_campaign ?? null,
        utm_content: a.utm_content ?? null,
        utm_term: a.utm_term ?? null,
        gclid: a.gclid ?? null,
        fbclid: a.fbclid ?? null,
        referrer: a.referrer ?? null,
        landing_page: a.landing_page ?? null,
      })
      .select("id")
      .single();

    if (error) console.error("[versa:lead] falha ao gravar:", error.message);
    else leadId = inserted?.id ?? null;
  } else {
    console.warn("[versa:lead] Supabase não configurado. Lead só no log:", {
      nome: data.nome,
      whatsapp: data.whatsapp,
      score: diag.score,
    });
  }

  await Promise.allSettled([
    notificar(data, diag),
    enviarParaMeta(data, diag, a, request),
  ]);

  return NextResponse.json({
    ok: true,
    id: leadId,
    diagnostico: diag,
  });
}

/* --------------------------- melhor esforço ----------------------------- */

async function notificar(
  data: z.infer<typeof schema>,
  diag: ReturnType<typeof diagnosticar>,
) {
  if (!SERVER_ENV.resendKey || !SERVER_ENV.leadNotifyEmail) return;

  const urgente = diag.temperatura === "quente";
  const linhas = [
    `Score ${diag.score} · ${diag.temperatura.toUpperCase()}`,
    `Serviço indicado: ${diag.servico}`,
    "",
    `Nome: ${data.nome}`,
    `WhatsApp: ${data.whatsapp}`,
    data.email ? `E-mail: ${data.email}` : "",
    "",
    `Problema: ${data.problema ?? "-"}`,
    `Investe hoje: ${data.investimento ?? "-"}`,
    `Vale um cliente: ${data.valor_cliente ?? "-"}`,
    `Canal de contato: ${data.canal_contato ?? "-"}`,
    `Prazo: ${data.prazo ?? "-"}`,
    `Decisor: ${data.decisor ?? "-"}`,
    data.observacao ? `\nObservação: ${data.observacao}` : "",
    "",
    `Hipótese: ${diag.titulo}`,
  ].filter(Boolean);

  const { Resend } = await import("resend");
  const resend = new Resend(SERVER_ENV.resendKey);
  await resend.emails.send({
    from: SERVER_ENV.leadNotifyFrom,
    to: SERVER_ENV.leadNotifyEmail,
    subject: `${urgente ? "[QUENTE] " : ""}Lead ${data.nome} · score ${diag.score}`,
    text: linhas.join("\n"),
  });
}

/**
 * Conversions API da Meta.
 *
 * Manda o evento pelo servidor além do pixel do navegador. Serve para o que
 * o pixel perde: bloqueador de anúncio, recusa de cookie e iOS. Os dois
 * eventos usam o mesmo `event_id`, então a Meta despublica a duplicata.
 */
async function enviarParaMeta(
  data: z.infer<typeof schema>,
  diag: ReturnType<typeof diagnosticar>,
  a: Record<string, string>,
  request: Request,
) {
  const pixelId = PUBLIC_ENV.metaPixelId;
  if (!pixelId || !SERVER_ENV.metaCapiToken) return;

  const user_data: Record<string, string[] | string> = {
    ph: [sha256(normalizePhone(data.whatsapp))],
  };
  if (data.email) user_data.em = [sha256(data.email)];
  if (a.fbclid) user_data.fbc = `fb.1.${Date.now()}.${a.fbclid}`;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (ip) user_data.client_ip_address = ip;
  const ua = request.headers.get("user-agent");
  if (ua) user_data.client_user_agent = ua;

  const payload = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        event_source_url: `${PUBLIC_ENV.siteUrl}/diagnostico`,
        user_data,
        custom_data: {
          lead_score: diag.score,
          temperatura: diag.temperatura,
          servico: diag.servico,
          campaign: a.utm_campaign ?? "",
        },
      },
    ],
    ...(SERVER_ENV.metaCapiTestCode
      ? { test_event_code: SERVER_ENV.metaCapiTestCode }
      : {}),
  };

  await fetch(
    `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${SERVER_ENV.metaCapiToken}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
}
