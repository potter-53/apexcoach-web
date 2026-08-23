import { createHash } from "node:crypto";

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { PayloadTooLargeError, readJsonBody } from "../../../src/lib/http-json";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const COACH_LEADS_API_SECRET = process.env.COACH_LEADS_API_SECRET || "";

function cleanText(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function cleanEmail(value) {
  return cleanText(value, 254).toLowerCase();
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function requestFingerprint(request) {
  const forwarded = request.headers.get("x-forwarded-for") || "";
  const ip = forwarded.split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown";
  const agent = request.headers.get("user-agent") || "unknown";
  return createHash("sha256").update(`${ip}|${agent}`).digest("hex");
}

export async function POST(request) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !COACH_LEADS_API_SECRET) {
    return NextResponse.json({ ok: false, error: "Contact service unavailable." }, { status: 503 });
  }

  let payload;
  try {
    payload = await readJsonBody(request, 8 * 1024);
  } catch (error) {
    if (error instanceof PayloadTooLargeError) {
      return NextResponse.json({ ok: false, error: "Pedido demasiado grande." }, { status: 413 });
    }
    throw error;
  }
  const founderNumber = cleanText(payload.founderNumber, 12);
  const name = cleanText(payload.name, 120);
  const email = cleanEmail(payload.email);
  const phone = cleanText(payload.phone, 40);
  const message = cleanText(payload.message, 2000);
  const website = cleanText(payload.website, 200);

  if (!founderNumber || name.length < 2 || !isValidEmail(email) || message.length < 10) {
    return NextResponse.json({ ok: false, error: "Confirma os dados do pedido." }, { status: 400 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase.rpc("submit_public_coach_lead", {
    p_api_secret: COACH_LEADS_API_SECRET,
    p_founder_number: founderNumber,
    p_contact_name: name,
    p_contact_email: email,
    p_contact_phone: phone,
    p_message: message,
    p_request_fingerprint: requestFingerprint(request),
    p_website: website,
  });

  if (error) {
    const isRateLimit = String(error.message || "").includes("Rate limit exceeded");
    return NextResponse.json(
      { ok: false, error: isRateLimit ? "Já recebemos vários pedidos. Tenta novamente mais tarde." : "Não foi possível enviar o pedido." },
      { status: isRateLimit ? 429 : 500 },
    );
  }

  return NextResponse.json({ ok: true, ticketId: data }, { status: 201 });
}
