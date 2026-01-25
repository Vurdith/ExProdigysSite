import { createClient } from "@supabase/supabase-js";

// Fallback to prevent crash if env vars are missing during development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "example-key";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.warn(
    "Supabase credentials missing! Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
