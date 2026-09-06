-- ---------------------------------------------------------------------------
-- Versa · esquema de captação
-- Rodar no SQL Editor do Supabase, uma vez.
--
-- Duas tabelas, propósitos diferentes:
--   leads       quem deixou contato. É o que o comercial olha.
--   tool_runs   cada execução de ferramenta, com ou sem contato.
--               É o que responde "a ferramenta funciona?" mesmo quando
--               ninguém converte.
-- ---------------------------------------------------------------------------

create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),

  -- contato
  nome              text not null,
  whatsapp          text not null,
  email             text,

  -- respostas do diagnóstico
  problema          text,
  investimento      text,
  valor_cliente     text,
  canal_contato     text,
  prazo             text,
  decisor           text,
  observacao        text,

  -- classificação
  score             integer not null default 0,
  temperatura       text not null default 'frio'
                    check (temperatura in ('quente','morno','frio')),
  servico_sugerido  text,

  -- atribuição
  utm_source        text,
  utm_medium        text,
  utm_campaign      text,
  utm_content       text,
  utm_term          text,
  gclid             text,
  fbclid            text,
  referrer          text,
  landing_page      text,

  -- operação
  origem            text,
  status            text not null default 'novo'
                    check (status in ('novo','contatado','reuniao','proposta','cliente','perdido')),
  notas             text
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_temperatura_idx on public.leads (temperatura);
create index if not exists leads_utm_campaign_idx on public.leads (utm_campaign);

create table if not exists public.tool_runs (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  ferramenta   text not null,
  entrada      jsonb not null default '{}'::jsonb,
  resultado    jsonb not null default '{}'::jsonb,
  lead_id      uuid references public.leads (id) on delete set null,
  utm_source   text,
  utm_campaign text
);

create index if not exists tool_runs_ferramenta_idx on public.tool_runs (ferramenta, created_at desc);

-- RLS ligado e sem policy de leitura pública. Toda escrita passa pela rota
-- de API com a service role key, que nunca sai do servidor. O navegador do
-- visitante não tem permissão para ler nem escrever nada aqui.
alter table public.leads enable row level security;
alter table public.tool_runs enable row level security;
