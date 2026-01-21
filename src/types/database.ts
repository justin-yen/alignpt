// Database types matching the Supabase schema
// These types mirror the PostgreSQL enums and tables

// Database enum types (matching PostgreSQL enums)
export type DbInjuryArea =
  | "neck"
  | "shoulder"
  | "back"
  | "hip"
  | "knee"
  | "ankle-foot"
  | "wrist-hand";

export type DbInjurySide = "left" | "right" | "both";

export type DbGoal =
  | "return-to-sport"
  | "reduce-pain"
  | "strengthen"
  | "posture-mobility"
  | "post-op-rehab";

export type DbVisitType = "in-person" | "telehealth" | "at-home";

export type DbInsurance = "aetna" | "bcbs" | "united" | "self-pay";

export type DbCredentialType = "exam" | "credential" | "foreign_agency";

export type DbLicenseType = "PT" | "PTA";

export type DbSpecialty = "OCS" | "SCS" | "PCS" | "NCS" | "GCS";

// Availability structure stored as JSONB
export interface DbAvailability {
  day: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
  time: string;
}

// Table row types
export interface IntakeSubmissionRow {
  id: string;
  session_id: string;
  injury_area: DbInjuryArea;
  injury_side: DbInjurySide;
  injury_region: string;
  injury_context: string | null;
  goal: DbGoal;
  style_communication_pref: number;
  style_motivation_pref: number;
  style_empathy_pref: number;
  style_treatment_pref: number;
  location: string;
  visit_types: DbVisitType[];
  insurance: DbInsurance;
  availability: DbAvailability[];
  created_at: string;
  ip_address: string | null;
  user_agent: string | null;
}

export interface PtCredentialRow {
  id: string;
  pt_id: string;
  credential_type: DbCredentialType;
  license_type: DbLicenseType;
  specialty: DbSpecialty | null;
  credential_name: string;
  issuing_body: string | null;
  issued_date: string | null;
  expiration_date: string | null;
  is_verified: boolean;
  created_at: string;
}

// Insert types (omit auto-generated fields)
export interface IntakeSubmissionInsert {
  session_id: string;
  injury_area: DbInjuryArea;
  injury_side: DbInjurySide;
  injury_region: string;
  injury_context?: string | null;
  goal: DbGoal;
  style_communication_pref: number;
  style_motivation_pref: number;
  style_empathy_pref: number;
  style_treatment_pref: number;
  location: string;
  visit_types: DbVisitType[];
  insurance: DbInsurance;
  availability?: DbAvailability[];
  ip_address?: string | null;
  user_agent?: string | null;
}

// Supabase generated database types
export type Database = {
  public: {
    Tables: {
      intake_submissions: {
        Row: IntakeSubmissionRow;
        Insert: IntakeSubmissionInsert;
        Update: Partial<IntakeSubmissionInsert>;
        Relationships: [];
      };
      pt_credentials: {
        Row: PtCredentialRow;
        Insert: Omit<PtCredentialRow, "id" | "created_at">;
        Update: Partial<Omit<PtCredentialRow, "id" | "created_at">>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      injury_area: DbInjuryArea;
      injury_side: DbInjurySide;
      goal: DbGoal;
      visit_type: DbVisitType;
      insurance: DbInsurance;
      credential_type: DbCredentialType;
      license_type: DbLicenseType;
      specialty: DbSpecialty;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
