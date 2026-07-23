import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.APEX_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  "";

const FOUNDER_SUBSCRIPTION_CATEGORY = "apex_coach_founder";
const ACTIVE_SUBSCRIPTION_STATUSES = ["active", "trialing"];
const PIN_POSITIONS = [
  { x: "48%", y: "25%" },
  { x: "55%", y: "36%" },
  { x: "46%", y: "48%" },
  { x: "54%", y: "58%" },
  { x: "47%", y: "70%" },
  { x: "57%", y: "78%" },
  { x: "41%", y: "38%" },
  { x: "61%", y: "50%" },
];

function text(value, fallback = "") {
  return String(value || fallback).trim();
}

function isPublicConsent(metadata) {
  return (
    metadata?.founding_public_profile_consent === true ||
    metadata?.foundingPublicProfileConsent === true ||
    metadata?.founding_public_profile_consent === "true" ||
    metadata?.foundingPublicProfileConsent === "true"
  );
}

function founderNumber(metadata, index) {
  const raw = text(metadata?.founder_number || metadata?.founding_number || metadata?.founderNumber);
  if (raw) return raw.startsWith("#") ? raw : `#${raw}`;
  return `#${String(index + 1).padStart(2, "0")}`;
}

function publicProfileFromApplication(application, index, clientsCount) {
  const metadata = application.metadata || {};
  const position = PIN_POSITIONS[index % PIN_POSITIONS.length];

  return {
    number: founderNumber(metadata, index),
    name: text(metadata.public_name || metadata.display_name || application.full_name, "Founder Coach"),
    city: text(metadata.public_location || metadata.location || metadata.city, "Portugal"),
    activeSince: application.created_at
      ? new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" }).format(new Date(application.created_at))
      : "Active",
    clients: Number.isFinite(clientsCount) ? String(clientsCount) : text(metadata.active_clients, "-"),
    quote: text(
      metadata.public_testimonial || metadata.testimonial,
      "Building the first chapter of APEX COACH.",
    ),
    photoUrl: text(metadata.public_photo_url || metadata.photo_url),
    x: text(metadata.map_x, position.x),
    y: text(metadata.map_y, position.y),
  };
}

async function countActiveClients(supabase, coachId) {
  if (!coachId) return null;

  const activeCount = await supabase
    .from("students")
    .select("id", { count: "exact", head: true })
    .eq("coach_id", coachId)
    .eq("is_active", true);

  if (!activeCount.error) return activeCount.count ?? 0;

  const fallbackCount = await supabase
    .from("students")
    .select("id", { count: "exact", head: true })
    .eq("coach_id", coachId);

  if (!fallbackCount.error) return fallbackCount.count ?? 0;
  return null;
}

export async function GET() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ coaches: [] });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: applications, error: applicationError } = await supabase
      .from("coach_applications")
      .select("auth_user_id, full_name, status, subscription_category, access_tier, metadata, created_at")
      .eq("subscription_category", FOUNDER_SUBSCRIPTION_CATEGORY)
      .eq("access_tier", "founder")
      .order("created_at", { ascending: true })
      .limit(50);

    if (applicationError) throw applicationError;

    const consentedApplications = (applications || []).filter((application) =>
      isPublicConsent(application.metadata),
    );
    const coachIds = consentedApplications
      .map((application) => application.auth_user_id)
      .filter(Boolean);

    if (!coachIds.length) {
      return NextResponse.json({ coaches: [] });
    }

    const { data: subscriptions, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("coach_id, status, subscription_category")
      .in("coach_id", coachIds)
      .eq("subscription_category", FOUNDER_SUBSCRIPTION_CATEGORY)
      .in("status", ACTIVE_SUBSCRIPTION_STATUSES);

    if (subscriptionError) throw subscriptionError;

    const activeCoachIds = new Set((subscriptions || []).map((subscription) => subscription.coach_id));
    const activeApplications = consentedApplications.filter((application) =>
      activeCoachIds.has(application.auth_user_id),
    );

    const coaches = [];
    for (const application of activeApplications.slice(0, 12)) {
      const clientsCount = await countActiveClients(supabase, application.auth_user_id);
      coaches.push(publicProfileFromApplication(application, coaches.length, clientsCount));
    }

    return NextResponse.json({ coaches });
  } catch (error) {
    console.error("founding coaches lookup failed", error);
    return NextResponse.json({ coaches: [] });
  }
}
