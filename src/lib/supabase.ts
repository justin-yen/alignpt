import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { IntakeSubmissionInsert } from "@/types/database";

let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Skip initialization if env vars are not configured (e.g., during build)
  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    supabaseUrl === "your-project-url" ||
    supabaseAnonKey === "your-anon-key"
  ) {
    console.log(supabaseUrl);
    console.log(supabaseAnonKey);
    return null;
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseClient;
}

// Typed helper for inserting intake submissions
export async function insertIntakeSubmission(
  submission: IntakeSubmissionInsert
): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();

  if (!client) {
    // Database not configured - skip silently in development
    console.warn("Supabase not configured. Skipping database save.");
    return { success: true }; // Return success to not block the flow
  }

  const { error } = await client.from("intake_submissions").insert(submission);

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

// Helper to get or create a session ID for anonymous tracking
export function getSessionId(): string {
  if (typeof window === "undefined") {
    return crypto.randomUUID();
  }

  const storageKey = "alignpt_session_id";
  let sessionId = sessionStorage.getItem(storageKey);

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(storageKey, sessionId);
  }

  return sessionId;
}
