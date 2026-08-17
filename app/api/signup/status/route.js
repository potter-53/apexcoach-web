import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.APEX_SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.APEX_SUPABASE_SERVICE_ROLE_KEY || "";

export const dynamic = "force-dynamic";

export async function GET(request) {
  if (!STRIPE_SECRET_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ ok: false, error: "status_not_configured" }, { status: 503 });
  }

  const sessionId = new URL(request.url).searchParams.get("session_id") || "";
  if (!sessionId.startsWith("cs_")) {
    return NextResponse.json({ ok: false, error: "invalid_session" }, { status: 400 });
  }

  try {
    const stripe = new Stripe(STRIPE_SECRET_KEY);
    const checkout = await stripe.checkout.sessions.retrieve(sessionId);
    if (checkout.status !== "complete" || checkout.payment_status !== "paid") {
      return NextResponse.json({ ok: false, error: "payment_not_confirmed" }, { status: 409 });
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
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

    const [{ data: authData, error: authError }, { data: activation, error: activationError }] =
      await Promise.all([
        admin.auth.admin.getUserById(userId),
        admin
          .from("coach_app_activations")
          .select("first_app_login_at")
          .eq("coach_id", userId)
          .maybeSingle(),
      ]);
    if (authError) throw authError;
    if (activationError) throw activationError;

    return NextResponse.json(
      {
        ok: true,
        emailValidated: Boolean(authData.user?.email_confirmed_at),
        appValidated: Boolean(activation?.first_app_login_at),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Signup status lookup failed", error);
    return NextResponse.json({ ok: false, error: "status_lookup_failed" }, { status: 502 });
  }
}
