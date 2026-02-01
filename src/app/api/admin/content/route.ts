import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseAdmin() {
  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Server configuration missing Supabase service role key." },
        { status: 500 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("site_content")
      .select("key, value");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Server configuration missing Supabase service role key." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { items } = body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Missing items." }, { status: 400 });
    }

    const payload = items.map((item: { key: string; value: string }) => ({
      key: item.key,
      value: item.value,
    }));

    const { data, error } = await supabaseAdmin
      .from("site_content")
      .upsert(payload, { onConflict: "key" })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
