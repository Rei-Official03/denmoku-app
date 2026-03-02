// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

// SSR では env が undefined になる可能性があるため安全に読む
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// SSR 中に env が無いとビルドが落ちるので、window が無いときだけ throw
if (!supabaseUrl || !supabaseKey) {
  if (typeof window === "undefined") {
    throw new Error("Supabase の環境変数が設定されていません");
  }
}

// CSR（ブラウザ）では createClient を普通に実行
export const supabase = createClient(supabaseUrl, supabaseKey);