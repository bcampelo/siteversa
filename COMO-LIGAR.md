# Como ligar o que foi construído

O site funciona agora, do jeito que está, com o `.env` em branco. Nesse estado
ele não faz nenhuma requisição a servidor de terceiro e não grava lead em
lugar nenhum: o diagnóstico roda, mostra o resultado e o lead só aparece no
log do servidor. Cada item abaixo liga um pedaço.

```bash
cp .env.example .env.local
npm install
npm run dev
```

## 1. Banco de leads (Supabase) — 10 minutos

1. Crie um projeto em supabase.com (plano gratuito serve).
2. SQL Editor, cole o conteúdo de `supabase/schema.sql`, execute.
3. Settings → API. Copie:
   - `Project URL` para `NEXT_PUBLIC_SUPABASE_URL`
   - `service_role` para `SUPABASE_SERVICE_ROLE_KEY`

A chave `service_role` **nunca** pode ganhar o prefixo `NEXT_PUBLIC_`. Ela dá
acesso total ao banco e só existe no servidor. As tabelas estão com RLS
ligada e sem policy pública, então o navegador do visitante não lê nem
escreve nada direto.

Para ver os leads: Table Editor → `leads`. Ordena por `score` e você tem a
fila de atendimento do dia pronta.

## 2. Medição — 20 minutos

Escolha **um** caminho, não os dois:

- **GTM** (recomendado se você quiser mexer sem tocar em código):
  preencha só `NEXT_PUBLIC_GTM_ID`. O GA4 entra dentro do GTM.
- **GA4 direto**: preencha só `NEXT_PUBLIC_GA4_ID`.

Depois:
- `NEXT_PUBLIC_META_PIXEL_ID`: o ID do pixel.
- `META_CAPI_TOKEN`: Eventos → Configurações → Gerar token de acesso.
  Isso liga a Conversions API, que manda o evento pelo servidor e recupera
  o que o pixel perde com bloqueador e com recusa de cookie.
- `NEXT_PUBLIC_GOOGLE_ADS_ID` e `NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL`:
  crie a conversão "Lead" no Google Ads e copie os dois.

### Eventos que o site dispara

| Evento | Quando | Parâmetro que importa |
|---|---|---|
| `cta_click` | qualquer CTA | `section`, `label` |
| `whatsapp_click` | qualquer link de WhatsApp | `section` |
| `form_start` | primeira resposta do diagnóstico | — |
| `form_step` | cada resposta | `pergunta`, `resposta` |
| `generate_lead` | envio concluído | `score`, `temperatura`, `servico` |
| `tool_result` | ferramenta usada | `ferramenta`, `suficiente` |
| `case_open` | abriu um case | `case` |
| `scroll_depth` | 25, 50, 75, 90% | `percent` |
| `web_vital` | LCP, INP, CLS reais | `metrica`, `valor` |

No GTM, crie um gatilho de evento personalizado para `generate_lead` e mande
para GA4, Meta e Google Ads. É a conversão principal do site.

## 3. Notificação de lead — 5 minutos

`RESEND_API_KEY` e `LEAD_NOTIFY_EMAIL`. Sem isso o lead ainda é gravado no
banco, só não chega no seu e-mail. Lead com score 70 ou mais chega com
`[QUENTE]` no assunto.

## 4. Domínio

`NEXT_PUBLIC_SITE_URL` com o domínio final, sem barra no fim. Ele alimenta
canonical, sitemap, robots, Open Graph e o `event_source_url` da Meta. É a
variável mais fácil de esquecer e a que mais estraga SEO quando fica errada.

## O que ainda depende de você, não de código

1. **Números nos outros três cases.** O campo `metrics` está implementado e
   preenchido só na TransLima, porque é o único case com número que eu podia
   confirmar. Nos outros ficou vazio de propósito: inventar número seria o
   oposto do que o site inteiro defende. Peça ao cliente ou use número de
   entrega ("site no ar em 22 dias", "nota 97 no Lighthouse").
2. **Depoimentos.** Três perguntas por WhatsApp, resposta em vídeo de 30
   segundos. É a maior alta de confiança por hora investida que existe.
3. **Rosto e nome de quem executa.** Não criei a seção porque não invento
   pessoas. Serviço local se compra de gente, e hoje o site diz "você fala
   com quem executa" sem mostrar quem executa.
4. **Conferir as faixas de investimento** em `src/lib/content.ts`. Coloquei
   valores de mercado coerentes com o porte da operação, mas o preço é seu.
