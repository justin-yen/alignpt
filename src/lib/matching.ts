import {
  PatientInput,
  PTProfile,
  PTMatch,
  ScoreBreakdown,
  MatchReason,
  MatchingWeights,
  DEFAULT_WEIGHTS,
  TimeWindow,
} from "@/types";

function calculateInjuryScore(
  patientInjury: string,
  ptExpertise: string[],
  maxScore: number
): number {
  if (ptExpertise.includes(patientInjury)) {
    return maxScore;
  }

  // Partial matches for related injuries
  const relatedInjuries: Record<string, string[]> = {
    neck: ["back", "shoulder"],
    shoulder: ["neck", "wrist-hand"],
    back: ["hip", "neck"],
    hip: ["back", "knee"],
    knee: ["hip", "ankle-foot"],
    "ankle-foot": ["knee"],
    "wrist-hand": ["shoulder"],
  };

  const related = relatedInjuries[patientInjury] || [];
  const hasRelated = related.some((r) => ptExpertise.includes(r));

  if (hasRelated) {
    return maxScore * 0.5;
  }

  return maxScore * 0.2;
}

function calculateGoalScore(
  patientGoal: string,
  ptGoals: string[],
  maxScore: number
): number {
  if (ptGoals.includes(patientGoal)) {
    return maxScore;
  }

  // Partial matches for related goals
  const relatedGoals: Record<string, string[]> = {
    "return-to-sport": ["strengthen"],
    strengthen: ["return-to-sport", "posture-mobility"],
    "reduce-pain": ["posture-mobility"],
    "posture-mobility": ["reduce-pain", "strengthen"],
    "post-op-rehab": ["strengthen", "return-to-sport"],
  };

  const related = relatedGoals[patientGoal] || [];
  const hasRelated = related.some((r) => ptGoals.includes(r));

  if (hasRelated) {
    return maxScore * 0.5;
  }

  return maxScore * 0.2;
}

function calculateStyleScore(
  patientCoachingStyles: string[],
  patientSessionStyles: string[],
  ptCoachingStyle: string,
  ptSessionStyle: string,
  maxScore: number
): number {
  let score = 0;
  const coachingWeight = 0.5;
  const sessionWeight = 0.5;

  // Coaching style match
  if (patientCoachingStyles.includes(ptCoachingStyle)) {
    score += maxScore * coachingWeight;
  } else if (patientCoachingStyles.length === 0) {
    score += maxScore * coachingWeight * 0.5;
  }

  // Session style match
  if (patientSessionStyles.includes(ptSessionStyle)) {
    score += maxScore * sessionWeight;
  } else if (patientSessionStyles.length === 0) {
    score += maxScore * sessionWeight * 0.5;
  } else if (ptSessionStyle === "hybrid") {
    // Hybrid is a partial match for any preference
    score += maxScore * sessionWeight * 0.7;
  }

  return score;
}

function calculateLogisticsScore(
  patientVisitTypes: string[],
  patientInsurance: string,
  patientLocation: string,
  ptVisitTypes: string[],
  ptInsurance: string[],
  ptCity: string,
  maxScore: number
): { score: number; hasVisitTypeMatch: boolean } {
  let score = 0;
  const visitTypeWeight = 0.4;
  const insuranceWeight = 0.4;
  const locationWeight = 0.2;

  // Visit type match (HARD FILTER - but we still calculate for ranking)
  const hasVisitTypeMatch = patientVisitTypes.some((vt) =>
    ptVisitTypes.includes(vt)
  );
  if (hasVisitTypeMatch) {
    score += maxScore * visitTypeWeight;
  }

  // Insurance match
  if (ptInsurance.includes(patientInsurance)) {
    score += maxScore * insuranceWeight;
  } else if (ptInsurance.includes("self-pay") || patientInsurance === "self-pay") {
    score += maxScore * insuranceWeight * 0.3;
  }

  // Location match (simple city match for MVP)
  if (ptCity.toLowerCase().includes(patientLocation.toLowerCase()) ||
      patientLocation.toLowerCase().includes(ptCity.split(",")[0].toLowerCase())) {
    score += maxScore * locationWeight;
  } else {
    // Partial score for same state
    const ptState = ptCity.split(",")[1]?.trim();
    if (patientLocation.includes(ptState || "")) {
      score += maxScore * locationWeight * 0.5;
    }
  }

  return { score, hasVisitTypeMatch };
}

function calculateAvailabilityScore(
  patientAvailability: TimeWindow[],
  ptAvailability: TimeWindow[],
  maxScore: number
): number {
  if (patientAvailability.length === 0) {
    return maxScore * 0.5;
  }

  let matches = 0;
  for (const patientWindow of patientAvailability) {
    const hasMatch = ptAvailability.some(
      (ptWindow) =>
        ptWindow.day === patientWindow.day && ptWindow.time === patientWindow.time
    );
    if (hasMatch) {
      matches++;
    }
  }

  const matchRatio = matches / patientAvailability.length;
  return maxScore * matchRatio;
}

function generateReasons(
  patient: PatientInput,
  pt: PTProfile,
  scores: ScoreBreakdown
): MatchReason[] {
  const reasons: MatchReason[] = [];

  // Positive reasons
  if (pt.injuryExpertise.includes(patient.injuryArea)) {
    reasons.push({
      type: "positive",
      text: `Specializes in ${patient.injuryArea.replace("-", "/")} injuries`,
    });
  }

  if (pt.goalExpertise.includes(patient.goal)) {
    const goalText = patient.goal
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    reasons.push({
      type: "positive",
      text: `Experienced with ${goalText.toLowerCase()} goals`,
    });
  }

  if (patient.coachingStyles.includes(pt.coachingStyle)) {
    reasons.push({
      type: "positive",
      text: `Matches your preferred ${pt.coachingStyle.replace("-", "/")} coaching style`,
    });
  }

  if (patient.sessionStyles.includes(pt.sessionStyle)) {
    reasons.push({
      type: "positive",
      text: `Offers ${pt.sessionStyle.replace("-", "/")} sessions as requested`,
    });
  }

  if (pt.insuranceAccepted.includes(patient.insurance)) {
    reasons.push({
      type: "positive",
      text: `Accepts your ${patient.insurance.toUpperCase()} insurance`,
    });
  }

  // Tradeoffs
  if (!pt.insuranceAccepted.includes(patient.insurance) && patient.insurance !== "self-pay") {
    reasons.push({
      type: "tradeoff",
      text: `Does not accept ${patient.insurance.toUpperCase()} - would require self-pay at $${pt.sessionRate}/session`,
    });
  }

  if (!patient.coachingStyles.includes(pt.coachingStyle) && patient.coachingStyles.length > 0) {
    reasons.push({
      type: "tradeoff",
      text: `Coaching style (${pt.coachingStyle.replace("-", "/")}) differs from your preference`,
    });
  }

  const availabilityMatches = patient.availability.filter((pa) =>
    pt.availability.some((pta) => pta.day === pa.day && pta.time === pa.time)
  ).length;

  if (availabilityMatches < patient.availability.length && patient.availability.length > 0) {
    reasons.push({
      type: "tradeoff",
      text: `Limited availability overlap (${availabilityMatches}/${patient.availability.length} time windows match)`,
    });
  }

  // Sort to get top 3 positive and top 1 tradeoff
  const positiveReasons = reasons.filter((r) => r.type === "positive").slice(0, 3);
  const tradeoffReasons = reasons.filter((r) => r.type === "tradeoff").slice(0, 1);

  return [...positiveReasons, ...tradeoffReasons];
}

export function matchPTs(
  patient: PatientInput,
  pts: PTProfile[],
  weights: MatchingWeights = DEFAULT_WEIGHTS
): PTMatch[] {
  const matches: PTMatch[] = [];

  for (const pt of pts) {
    // Calculate individual scores
    const injuryFit = calculateInjuryScore(
      patient.injuryArea,
      pt.injuryExpertise,
      weights.injury
    );

    const goalFit = calculateGoalScore(patient.goal, pt.goalExpertise, weights.goal);

    const styleFit = calculateStyleScore(
      patient.coachingStyles,
      patient.sessionStyles,
      pt.coachingStyle,
      pt.sessionStyle,
      weights.style
    );

    const { score: logisticsFit, hasVisitTypeMatch } = calculateLogisticsScore(
      patient.visitTypes,
      patient.insurance,
      patient.location,
      pt.visitTypes,
      pt.insuranceAccepted,
      pt.city,
      weights.logistics
    );

    const availabilityFit = calculateAvailabilityScore(
      patient.availability,
      pt.availability,
      weights.availability
    );

    // Hard filter: skip PTs without visit type match
    if (!hasVisitTypeMatch) {
      continue;
    }

    const total = Math.round(
      injuryFit + goalFit + styleFit + logisticsFit + availabilityFit
    );

    const scores: ScoreBreakdown = {
      injuryFit: Math.round(injuryFit),
      goalFit: Math.round(goalFit),
      styleFit: Math.round(styleFit),
      logisticsFit: Math.round(logisticsFit),
      availabilityFit: Math.round(availabilityFit),
      total,
    };

    const reasons = generateReasons(patient, pt, scores);

    matches.push({
      pt,
      score: scores,
      reasons,
    });
  }

  // Sort by total score (descending), with deterministic tie-breaking by name
  matches.sort((a, b) => {
    if (b.score.total !== a.score.total) {
      return b.score.total - a.score.total;
    }
    return a.pt.name.localeCompare(b.pt.name);
  });

  return matches.slice(0, 5);
}
