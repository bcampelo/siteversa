import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { HAS_SUPABASE, SERVER_ENV } from "@/lib/env";

/**
 * Cliente do Supabase com service role.
 *
 * Só existe no servidor. A chave nunca tem prefixo NEXT_PUBLIC_, então o
 * bundler não consegue vazá-la para o navegador nem por engano. RLS fica
 * ligada nas tabelas e não há policy pública: o único caminho de escrita é
 * a rota de API.
 *
 * Devolve null quando não está configurado, e quem chama precisa lidar com
 * isso. O site tem que continuar de pé com o .env em branco.
 */
let cached: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!HAS_SUPABASE) return null;
  if (cached) return cached;
  cached = createClient(SERVER_ENV.supabaseUrl, SERVER_ENV.supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
