import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.APEX_SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.APEX_SUPABASE_SERVICE_ROLE_KEY || "";

export async function POST(request) {
  if (!STRIPE_SECRET_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ ok: false, error: "claim_not_configured" }, { status: 503 });
  }

  const payload = await request.json().catch(() => ({}));
  const sessionId = String(payload.sessionId || "");
  const userId = String(payload.userId || "");
  if (!sessionId.startsWith("cs_") || !userId) {
    return NextResponse.json({ ok: false, error: "invalid_claim" }, { status: 400 });
  }

  try {
    const stripe = new Stripe(STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.status !== "complete" || session.payment_status !== "paid") {
      return NextResponse.json({ ok: false, error: "payment_not_confirmed" }, { status: 409 });
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    let authResult = null;
    let authError = null;
    for (let attempt = 0; attempt < 4; attempt += 1) {
      const result = await admin.auth.admin.getUserById(userId);
      authResult = result.data;
      authError = result.error;
      if (authResult?.user?.email) break;
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
    if (authError || !authResult.user?.email) throw authError || new Error("User not found");

    const paidEmail = String(session.customer_details?.email || session.customer_email || "").toLowerCase();
    if (!paidEmail || authResult.user.email.toLowerCase() !== paidEmail) {
      return NextResponse.json({ ok: false, error: "email_mismatch" }, { status: 403 });
    }

    const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
    if (!subscriptionId) throw new Error("Checkout has no subscription");
    const identity = { coach_id: userId, nlock_user_id: userId };
    await stripe.checkout.sessions.update(session.id, { metadata: { ...session.metadata, ...identity } });
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    await stripe.subscriptions.update(subscriptionId, { metadata: { ...subscription.metadata, ...identity } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Stripe subscription claim failed", error);
    return NextResponse.json({ ok: false, error: "claim_failed" }, { status: 502 });
  }
}
