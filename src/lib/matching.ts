import {
  PatientInput,
  PTProfile,
  PTMatch,
  ScoreBreakdown,
  MatchReason,
  MatchingWeights,
  DEFAULT_WEIGHTS,
  TimeWindow,
  StylePreferences,
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
  patientPrefs: StylePreferences,
  ptScores: StylePreferences,
  maxScore: number
): number {
  // Each preference dimension contributes equally to the total style score
  const dimensions: (keyof StylePreferences)[] = [
    "communicationStyle",
    "motivationLevel",
    "empathyLevel",
    "treatmentApproach",
  ];

  let totalScore = 0;
  const perDimensionMax = maxScore / dimensions.length;

  for (const dim of dimensions) {
    const patientValue = patientPrefs[dim];
    const ptValue = ptScores[dim];

    // If patient has no preference (value = 3), give full score for this dimension
    if (patientValue === 3) {
      totalScore += perDimensionMax;
      continue;
    }

    // Calculate how close the PT's value is to the patient's preference
    // Max difference is 4 (e.g., patient=1, PT=5)
    const difference = Math.abs(patientValue - ptValue);

    // Score decreases linearly with difference
    // difference 0 = 100%, difference 1 = 75%, difference 2 = 50%, difference 3 = 25%, difference 4 = 0%
    const matchRatio = 1 - (difference / 4);
    totalScore += perDimensionMax * matchRatio;
  }

  return totalScore;
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

// Helper to describe style preferences
const styleDescriptions: Record<keyof StylePreferences, { low: string; high: string; name: string }> = {
  communicationStyle: { low: "technical", high: "simple", name: "communication" },
  motivationLevel: { low: "calm", high: "high-energy", name: "energy level" },
  empathyLevel: { low: "direct", high: "empathetic", name: "interaction style" },
  treatmentApproach: { low: "hands-on", high: "exercise-based", name: "treatment approach" },
};

function getStyleMatchDescription(
  patientPrefs: StylePreferences,
  ptScores: StylePreferences
): { matches: string[]; mismatches: string[] } {
  const matches: string[] = [];
  const mismatches: string[] = [];

  for (const [key, desc] of Object.entries(styleDescriptions)) {
    const dim = key as keyof StylePreferences;
    const patientValue = patientPrefs[dim];
    const ptValue = ptScores[dim];

    // Skip if patient has no preference
    if (patientValue === 3) continue;

    const difference = Math.abs(patientValue - ptValue);
    const patientPrefLabel = patientValue < 3 ? desc.low : desc.high;
    const ptLabel = ptValue <= 2 ? desc.low : ptValue >= 4 ? desc.high : "balanced";

    if (difference <= 1) {
      matches.push(`${patientPrefLabel} ${desc.name}`);
    } else if (difference >= 3) {
      mismatches.push(`prefers ${ptLabel} ${desc.name} vs your ${patientPrefLabel} preference`);
    }
  }

  return { matches, mismatches };
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

  // Style match reasons
  const { matches: styleMatches, mismatches: styleMismatches } = getStyleMatchDescription(
    patient.stylePreferences,
    pt.styleScores
  );

  if (styleMatches.length > 0) {
    reasons.push({
      type: "positive",
      text: `Matches your ${styleMatches.slice(0, 2).join(" and ")} preferences`,
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

  if (styleMismatches.length > 0) {
    reasons.push({
      type: "tradeoff",
      text: `Style difference: ${styleMismatches[0]}`,
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
      patient.stylePreferences,
      pt.styleScores,
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
