export type InjuryArea =
  | "neck"
  | "shoulder"
  | "back"
  | "hip"
  | "knee"
  | "ankle-foot"
  | "wrist-hand";

export type InjurySide = "left" | "right" | "both";

export type NeckRegion = "upper-neck" | "lower-neck" | "radiates-to-arm";
export type ShoulderRegion = "front" | "side-lateral" | "back" | "top-ac-joint";
export type BackRegion = "upper-back" | "mid-back" | "lower-back";
export type HipRegion = "front-groin" | "side" | "back-glute";
export type KneeRegion = "front-kneecap" | "inside-medial" | "outside-lateral" | "back";
export type AnkleFootRegion = "ankle" | "heel" | "arch" | "ball-of-foot" | "toes";
export type WristHandRegion = "wrist" | "palm" | "thumb" | "fingers";

export type InjuryRegion =
  | NeckRegion
  | ShoulderRegion
  | BackRegion
  | HipRegion
  | KneeRegion
  | AnkleFootRegion
  | WristHandRegion;

export type Goal =
  | "return-to-sport"
  | "reduce-pain"
  | "strengthen"
  | "posture-mobility"
  | "post-op-rehab";

export type CoachingStyle =
  | "technical-explanatory"
  | "motivational-coach"
  | "empathetic-listener";

export type SessionStyle = "hands-on-manual" | "exercise-focused" | "hybrid";

export type VisitType = "in-person" | "telehealth" | "at-home";

export type Insurance = "aetna" | "bcbs" | "united" | "self-pay";

export type DayOfWeek = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
export type TimeOfDay = "am" | "pm" | "eve";

export interface TimeWindow {
  day: DayOfWeek;
  time: TimeOfDay;
}

export interface PatientInput {
  injuryArea: InjuryArea;
  injurySide: InjurySide;
  injuryRegion: InjuryRegion;
  injuryContext: string;
  goal: Goal;
  coachingStyles: CoachingStyle[];
  sessionStyles: SessionStyle[];
  location: string;
  visitTypes: VisitType[];
  insurance: Insurance;
  availability: TimeWindow[];
}

export interface PTProfile {
  id: string;
  name: string;
  credentials: string;
  clinicName: string;
  neighborhood: string;
  city: string;
  zipCode: string;
  bio: string;
  approach: string[];
  specialties: string[];
  conditionsTreated: string[];
  injuryExpertise: InjuryArea[];
  goalExpertise: Goal[];
  coachingStyle: CoachingStyle;
  sessionStyle: SessionStyle;
  visitTypes: VisitType[];
  insuranceAccepted: Insurance[];
  availability: TimeWindow[];
  nextAvailableSlots: string[];
  sessionRate: number;
  reviews: PTReview[];
  photoPlaceholder: string;
}

export interface PTReview {
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface ScoreBreakdown {
  injuryFit: number;
  goalFit: number;
  styleFit: number;
  logisticsFit: number;
  availabilityFit: number;
  total: number;
}

export interface MatchReason {
  type: "positive" | "tradeoff";
  text: string;
}

export interface PTMatch {
  pt: PTProfile;
  score: ScoreBreakdown;
  reasons: MatchReason[];
}

export interface MatchingWeights {
  injury: number;
  goal: number;
  style: number;
  logistics: number;
  availability: number;
}

export const DEFAULT_WEIGHTS: MatchingWeights = {
  injury: 30,
  goal: 20,
  style: 20,
  logistics: 20,
  availability: 10,
};

export const INJURY_LABELS: Record<InjuryArea, string> = {
  neck: "Neck",
  shoulder: "Shoulder",
  back: "Back",
  hip: "Hip",
  knee: "Knee",
  "ankle-foot": "Ankle/Foot",
  "wrist-hand": "Wrist/Hand",
};

export const INJURY_SIDE_LABELS: Record<InjurySide, string> = {
  left: "Left",
  right: "Right",
  both: "Both",
};

export const NECK_REGION_LABELS: Record<NeckRegion, string> = {
  "upper-neck": "Upper neck (base of skull)",
  "lower-neck": "Lower neck (near shoulders)",
  "radiates-to-arm": "Radiates to arm/shoulder",
};

export const SHOULDER_REGION_LABELS: Record<ShoulderRegion, string> = {
  front: "Front of shoulder",
  "side-lateral": "Side (lateral)",
  back: "Back of shoulder",
  "top-ac-joint": "Top (AC joint)",
};

export const BACK_REGION_LABELS: Record<BackRegion, string> = {
  "upper-back": "Upper back",
  "mid-back": "Mid back",
  "lower-back": "Lower back",
};

export const HIP_REGION_LABELS: Record<HipRegion, string> = {
  "front-groin": "Front of hip (groin)",
  side: "Side of hip",
  "back-glute": "Back (glute/piriformis)",
};

export const KNEE_REGION_LABELS: Record<KneeRegion, string> = {
  "front-kneecap": "Front (kneecap)",
  "inside-medial": "Inside (medial)",
  "outside-lateral": "Outside (lateral)",
  back: "Back of knee",
};

export const ANKLE_FOOT_REGION_LABELS: Record<AnkleFootRegion, string> = {
  ankle: "Ankle",
  heel: "Heel",
  arch: "Arch",
  "ball-of-foot": "Ball of foot",
  toes: "Toes",
};

export const WRIST_HAND_REGION_LABELS: Record<WristHandRegion, string> = {
  wrist: "Wrist",
  palm: "Palm",
  thumb: "Thumb",
  fingers: "Fingers",
};

export const GOAL_LABELS: Record<Goal, string> = {
  "return-to-sport": "Return to Sport",
  "reduce-pain": "Reduce Pain",
  strengthen: "Strengthen",
  "posture-mobility": "Posture/Mobility",
  "post-op-rehab": "Post-Op Rehab",
};

export const COACHING_STYLE_LABELS: Record<CoachingStyle, string> = {
  "technical-explanatory": "Technical/Explanatory",
  "motivational-coach": "Motivational/Coach",
  "empathetic-listener": "Empathetic/Listener",
};

export const SESSION_STYLE_LABELS: Record<SessionStyle, string> = {
  "hands-on-manual": "Hands-On/Manual",
  "exercise-focused": "Exercise-Focused",
  hybrid: "Hybrid",
};

export const VISIT_TYPE_LABELS: Record<VisitType, string> = {
  "in-person": "In-Person",
  telehealth: "Telehealth",
  "at-home": "At-Home",
};

export const INSURANCE_LABELS: Record<Insurance, string> = {
  aetna: "Aetna",
  bcbs: "BCBS",
  united: "United",
  "self-pay": "Self-Pay",
};

export const DAY_LABELS: Record<DayOfWeek, string> = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
  sun: "Sun",
};

export const TIME_LABELS: Record<TimeOfDay, string> = {
  am: "AM",
  pm: "PM",
  eve: "Eve",
};

export const CITIES = [
  { name: "San Francisco, CA", zipCode: "94102" },
  { name: "Oakland, CA", zipCode: "94612" },
  { name: "Berkeley, CA", zipCode: "94704" },
  { name: "Palo Alto, CA", zipCode: "94301" },
  { name: "San Jose, CA", zipCode: "95113" },
  { name: "New York, NY", zipCode: "10001" },
  { name: "Brooklyn, NY", zipCode: "11201" },
  { name: "Manhattan, NY", zipCode: "10019" },
  { name: "Los Angeles, CA", zipCode: "90001" },
  { name: "Santa Monica, CA", zipCode: "90401" },
  { name: "Chicago, IL", zipCode: "60601" },
  { name: "Austin, TX", zipCode: "78701" },
  { name: "Seattle, WA", zipCode: "98101" },
  { name: "Denver, CO", zipCode: "80202" },
  { name: "Boston, MA", zipCode: "02101" },
];
