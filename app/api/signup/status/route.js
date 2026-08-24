import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { createHmac, timingSafeEqual } from "node:crypto";
import { Buffer } from "node:buffer";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.APEX_SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.APEX_SUPABASE_SERVICE_ROLE_KEY || "";

export const dynamic = "force-dynamic";

function createStatusToken(userId) {
  const signature = createHmac("sha256", SUPABASE_SERVICE_ROLE_KEY)
    .update(`nlock-signup-status:${userId}`)
    .digest("base64url");
  return `${userId}.${signature}`;
}

function verifyStatusToken(token) {
  const [userId, signature, ...rest] = String(token || "").split(".");
  if (rest.length || !/^[0-9a-f-]{36}$/i.test(userId || "") || !signature) return "";
  const expected = createStatusToken(userId).slice(userId.length + 1);
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (providedBuffer.length !== expectedBuffer.length) return "";
  return timingSafeEqual(providedBuffer, expectedBuffer) ? userId : "";
}

async function getCoachStatus(admin, userId, emailConfirmedAt = null) {
  const { data: activation, error: activationError } = await admin
    .from("coach_app_activations")
    .select("first_app_login_at")
    .eq("coach_id", userId)
    .maybeSingle();
  if (activationError) throw activationError;

  return {
    ok: true,
    emailValidated: Boolean(emailConfirmedAt),
    appValidated: Boolean(activation?.first_app_login_at),
  };
}

export async function GET(request) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ ok: false, error: "status_not_configured" }, { status: 503 });
  }

  const sessionId = new URL(request.url).searchParams.get("session_id") || "";

  try {
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const trackedUserId = verifyStatusToken(request.headers.get("x-signup-status-token"));
    if (trackedUserId) {
      const { data, error } = await admin.auth.admin.getUserById(trackedUserId);
      if (error || !data.user) {
        return NextResponse.json({ ok: false, error: "tracked_user_not_found" }, { status: 404 });
      }
      const status = await getCoachStatus(admin, data.user.id, data.user.email_confirmed_at);
      return NextResponse.json(status, { headers: { "Cache-Control": "no-store" } });
    }

    const authorization = request.headers.get("authorization") || "";
    if (authorization.startsWith("Bearer ")) {
      const accessToken = authorization.slice(7).trim();
      const { data, error } = await admin.auth.getUser(accessToken);
      if (error || !data.user) {
        return NextResponse.json({ ok: false, error: "invalid_access_token" }, { status: 401 });
      }

      const status = await getCoachStatus(admin, data.user.id, data.user.email_confirmed_at);
      return NextResponse.json(status, { headers: { "Cache-Control": "no-store" } });
    }

    if (!STRIPE_SECRET_KEY) {
      return NextResponse.json({ ok: false, error: "status_not_configured" }, { status: 503 });
    }
    if (!sessionId.startsWith("cs_")) {
      return NextResponse.json({ ok: false, error: "invalid_session" }, { status: 400 });
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY);
    const checkout = await stripe.checkout.sessions.retrieve(sessionId);
    if (checkout.status !== "complete" || checkout.payment_status !== "paid") {
      return NextResponse.json({ ok: false, error: "payment_not_confirmed" }, { status: 409 });
    }

    let userId = checkout.metadata?.nlock_user_id || checkout.metadata?.coach_id || "";

    if (!userId) {
      const { data, error } = await admin
        .from("subscriptions")
        .select("coach_id")
        .eq("stripe_checkout_session_id", sessionId)
        .maybeSingle();
      if (error) throw error;
      userId = data?.coach_id || "";
    }

    if (!userId) {
      return NextResponse.json({ ok: true, emailValidated: false, appValidated: false });
    }

    const { data: authData, error: authError } = await admin.auth.admin.getUserById(userId);
    if (authError) throw authError;
    const status = await getCoachStatus(admin, userId, authData.user?.email_confirmed_at);
    return NextResponse.json(status, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Signup status lookup failed", error);
    return NextResponse.json({ ok: false, error: "status_lookup_failed" }, { status: 502 });
  }
}

export async function POST(request) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ ok: false, error: "status_not_configured" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const userId = String(body?.userId || "");
    const email = String(body?.email || "").trim().toLowerCase();
    if (!/^[0-9a-f-]{36}$/i.test(userId) || !email) {
      return NextResponse.json({ ok: false, error: "invalid_tracking_request" }, { status: 400 });
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await admin.auth.admin.getUserById(userId);
    if (error || !data.user || String(data.user.email || "").toLowerCase() !== email) {
      return NextResponse.json({ ok: false, error: "tracked_user_not_found" }, { status: 404 });
    }

    return NextResponse.json(
      { ok: true, statusToken: createStatusToken(userId) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_tracking_request" }, { status: 400 });
  }
}
