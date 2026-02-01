import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseAdmin() {
  if (!supabaseUrl || !serviceRoleKey) return null;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, company, status, source, abandoned_at } = body || {};

    if (!email || !name) {
      return NextResponse.json({ error: "Missing name or email." }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase admin not configured." },
        { status: 500 }
      );
    }

    const { error } = await supabaseAdmin.from("leads").upsert(
      {
        email,
        name,
        company: company || null,
        status: status || "new",
        source: source || "website_form",
        abandoned_at: abandoned_at ?? null,
      },
      { onConflict: "email" }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to save lead." },
      { status: 500 }
    );
  }
}
