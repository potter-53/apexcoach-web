import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.APEX_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  "";
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const APPLICATIONS_EMAIL =
  process.env.APEX_APPLICATIONS_EMAIL ||
  process.env.APEX_SUPPORT_EMAIL ||
  "hello@apexcoach.pt";
const FROM_EMAIL =
  process.env.APEX_FROM_EMAIL || "APEX COACH <hello@apexcoach.pt>";
const FOUNDER_SUBSCRIPTION_CATEGORY = "apex_coach_founder";
const FOUNDER_ACCESS_TIER = "founder";

function cleanText(value, maxLength = 500) {
  return String(value || "").trim().slice(0, maxLength);
}

function cleanEmail(value) {
  return String(value || "").trim().toLowerCase().slice(0, 254);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function candidateEmailHtml({ fullName, locale }) {
  const isPt = locale === "pt";
  const title = isPt
    ? "Recebemos a tua candidatura."
    : "We received your application.";
  const text = isPt
    ? "A tua identidade APEX COACH foi criada. Valida o email que acabaste de receber e depois entra na app com as tuas credenciais."
    : "Your APEX COACH identity has been created. Verify the email you just received and then sign into the app with your credentials.";
  const next = isPt ? "Proximo passo" : "Next step";
  const nextText = isPt
    ? "Confirma o email, instala a APK beta quando estiveres pronto e comeca a explorar a app final da APEX COACH. O teu pedido ficou associado as condicoes Founder."
    : "Confirm your email, install the beta APK when ready, and start exploring the final APEX COACH app experience. Your request is associated with Founder conditions.";

  return `<!doctype html>
<html>
  <body style="margin:0;background:#f3f5f4;color:#080a09;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f5f4;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;width:100%;background:#ffffff;border:1px solid #d8dfda;border-radius:28px;overflow:hidden;box-shadow:0 18px 48px rgba(14,17,16,0.08);">
            <tr>
              <td style="padding:28px 28px 10px 28px;">
                <div style="font-size:13px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:#127a58;">APEX COACH</div>
                <h1 style="margin:28px 0 0 0;font-size:34px;line-height:1.08;color:#080a09;">${title}</h1>
                <p style="margin:18px 0 0 0;font-size:17px;line-height:1.7;color:#5f6863;">${text}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 28px 28px 28px;">
                <div style="background:#f8faf8;border:1px solid #e6eae7;border-radius:20px;padding:18px;">
                  <div style="font-size:12px;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;color:#127a58;">${next}</div>
                  <p style="margin:8px 0 0 0;font-size:15px;line-height:1.7;color:#5f6863;">${nextText}</p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="background:#080a09;padding:22px 28px;">
                <p style="margin:0;font-size:13px;line-height:1.7;color:#d9e2dc;">Build your apex. Elevate theirs.</p>
                <p style="margin:8px 0 0 0;font-size:12px;line-height:1.6;color:#8fa099;">${escapeHtml(fullName || "Coach")}, obrigado por entrares nesta fase da APEX COACH.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function internalEmailHtml({ fullName, email, focus, locale, source, userId, subscriptionCategory, accessTier }) {
  return `<!doctype html>
<html>
  <body style="margin:0;background:#f3f5f4;color:#080a09;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;">
    <div style="max-width:680px;margin:0 auto;padding:28px 16px;">
      <div style="background:#ffffff;border:1px solid #d8dfda;border-radius:24px;padding:24px;">
        <p style="margin:0;font-size:12px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:#127a58;">New coach application</p>
        <h1 style="margin:14px 0 0 0;font-size:28px;line-height:1.2;">${escapeHtml(fullName)}</h1>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:20px;border-collapse:collapse;">
          ${[
            ["Email", email],
            ["Focus", focus || "-"],
            ["Locale", locale || "-"],
            ["Source", source || "-"],
            ["Access tier", accessTier || "-"],
            ["Subscription category", subscriptionCategory || "-"],
            ["Supabase user", userId || "-"],
          ]
            .map(
              ([label, value]) =>
                `<tr><td style="width:150px;padding:10px 0;border-top:1px solid #eef1ef;color:#66716b;font-size:13px;">${label}</td><td style="padding:10px 0;border-top:1px solid #eef1ef;font-size:14px;font-weight:700;color:#080a09;">${escapeHtml(value)}</td></tr>`,
            )
            .join("")}
        </table>
      </div>
    </div>
  </body>
</html>`;
}

async function sendEmail({ to, subject, html }) {
  if (!RESEND_API_KEY) {
    return { skipped: true, reason: "missing_resend_api_key" };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || "Unable to send email.");
  }
  return { skipped: false, id: data?.id || null };
}

async function storeApplication(application) {
  const supabaseKey = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;
  if (!SUPABASE_URL || !supabaseKey) {
    return { skipped: true, reason: "missing_supabase_credentials" };
  }

  const supabase = createClient(SUPABASE_URL, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const row = {
    full_name: application.fullName,
    email: application.email,
    coaching_focus: application.focus,
    locale: application.locale,
    source: application.source,
    auth_user_id: application.userId || null,
    access_tier: application.accessTier,
    subscription_category: application.subscriptionCategory,
    status: "new",
    metadata: application.metadata,
    updated_at: new Date().toISOString(),
  };

  const query = SUPABASE_SERVICE_ROLE_KEY
    ? supabase.from("coach_applications").upsert(row, { onConflict: "email" })
    : supabase.from("coach_applications").insert(row);

  const { error } = await query;

  if (error) throw error;
  return { skipped: false };
}

async function markFounderSubscription(application) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !application.userId) {
    return { skipped: true, reason: "missing_service_role_or_user" };
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await supabase
    .from("subscriptions")
    .update({ subscription_category: FOUNDER_SUBSCRIPTION_CATEGORY })
    .eq("coach_id", application.userId);

  if (error) throw error;
  return { skipped: false };
}

export async function POST(request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const application = {
      fullName: cleanText(payload.fullName, 120),
      email: cleanEmail(payload.email),
      focus: cleanText(payload.focus, 1000),
      locale: cleanText(payload.locale, 8) || "pt",
      source: cleanText(payload.source, 80) || "coach-application",
      userId: cleanText(payload.userId, 80),
      accessTier: FOUNDER_ACCESS_TIER,
      subscriptionCategory: FOUNDER_SUBSCRIPTION_CATEGORY,
      metadata: {
        access_tier: FOUNDER_ACCESS_TIER,
        subscription_category: FOUNDER_SUBSCRIPTION_CATEGORY,
        founder_access_requested: true,
        user_agent: request.headers.get("user-agent") || "",
        referer: request.headers.get("referer") || "",
        submitted_at: new Date().toISOString(),
      },
    };

    if (!application.fullName || !isValidEmail(application.email)) {
      return NextResponse.json(
        { ok: false, error: "Invalid application payload." },
        { status: 400 },
      );
    }

    let storeResult;
    try {
      storeResult = await storeApplication(application);
    } catch (storeError) {
      console.error("coach application storage failed", storeError);
      storeResult = { skipped: true, reason: "storage_failed" };
    }

    let founderSubscription;
    try {
      founderSubscription = await markFounderSubscription(application);
    } catch (subscriptionError) {
      console.error("founder subscription update failed", subscriptionError);
      founderSubscription = { skipped: true, reason: "subscription_update_failed" };
    }

    let candidateEmail;
    try {
      candidateEmail = await sendEmail({
        to: application.email,
        subject:
          application.locale === "pt"
            ? "Recebemos a tua candidatura APEX COACH"
            : "We received your APEX COACH application",
        html: candidateEmailHtml(application),
      });
    } catch (emailError) {
      console.error("candidate application email failed", emailError);
      candidateEmail = { skipped: true, reason: "candidate_email_failed" };
    }

    let internalEmail;
    try {
      internalEmail = await sendEmail({
        to: APPLICATIONS_EMAIL,
        subject: `New APEX COACH application: ${application.fullName}`,
        html: internalEmailHtml(application),
      });
    } catch (emailError) {
      console.error("internal application email failed", emailError);
      internalEmail = { skipped: true, reason: "internal_email_failed" };
    }

    return NextResponse.json({
      ok: true,
      stored: storeResult,
      founderSubscription,
      candidateEmail,
      internalEmail,
    });
  } catch (error) {
    console.error("coach application failed", error);
    return NextResponse.json(
      { ok: false, error: "Unable to process application." },
      { status: 500 },
    );
  }
}
