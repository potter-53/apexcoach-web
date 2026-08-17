import { createHash, randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.APEX_SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.APEX_SUPABASE_SERVICE_ROLE_KEY || "";
const POLL_KEY = "founder_program_product_value_v1";
const COOKIE_NAME = "nlock_founder_poll_v1";
const OPTIONS = ["faster_sessions", "clearer_progress"];

function adminClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
}

function tokenHash(token) {
  return createHash("sha256").update(`${POLL_KEY}:${token}`).digest("hex");
}

async function results(admin) {
  const counts = await Promise.all(OPTIONS.map(async (option) => {
    const { count, error } = await admin.from("founder_program_poll_votes").select("id", { count: "exact", head: true }).eq("poll_key", POLL_KEY).eq("option_key", option);
    if (error) throw error;
    return count || 0;
  }));
  const total = counts[0] + counts[1];
  const first = total ? Math.round((counts[0] / total) * 100) : 0;
  return { counts: { [OPTIONS[0]]: counts[0], [OPTIONS[1]]: counts[1] }, percentages: { [OPTIONS[0]]: first, [OPTIONS[1]]: total ? 100 - first : 0 }, total };
}

async function selectedOption(admin, token) {
  if (!token) return null;
  const { data, error } = await admin.from("founder_program_poll_votes").select("option_key").eq("poll_key", POLL_KEY).eq("voter_token_hash", tokenHash(token)).maybeSingle();
  if (error) throw error;
  return data?.option_key || null;
}

export async function GET(request) {
  const admin = adminClient();
  if (!admin) return NextResponse.json({ ok: false, error: "poll_unavailable" }, { status: 503 });
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value || "";
    return NextResponse.json({ ok: true, selected: await selectedOption(admin, token), ...(await results(admin)) });
  } catch (error) {
    console.error("Founder poll lookup failed", error);
    return NextResponse.json({ ok: false, error: "poll_lookup_failed" }, { status: 500 });
  }
}

export async function POST(request) {
  const admin = adminClient();
  if (!admin) return NextResponse.json({ ok: false, error: "poll_unavailable" }, { status: 503 });
  try {
    const payload = await request.json().catch(() => ({}));
    const option = String(payload.option || "");
    if (!OPTIONS.includes(option)) return NextResponse.json({ ok: false, error: "invalid_option" }, { status: 400 });

    const existingToken = request.cookies.get(COOKIE_NAME)?.value || "";
    const token = existingToken || randomUUID();
    const existing = await selectedOption(admin, token);
    let selected = existing;
    if (!existing) {
      const { error } = await admin.from("founder_program_poll_votes").insert({ poll_key: POLL_KEY, option_key: option, voter_token_hash: tokenHash(token) });
      if (error && error.code !== "23505") throw error;
      selected = error?.code === "23505" ? await selectedOption(admin, token) : option;
    }

    const response = NextResponse.json({ ok: true, selected, ...(await results(admin)) });
    if (!existingToken) response.cookies.set(COOKIE_NAME, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365 });
    return response;
  } catch (error) {
    console.error("Founder poll vote failed", error);
    return NextResponse.json({ ok: false, error: "poll_vote_failed" }, { status: 500 });
  }
}
