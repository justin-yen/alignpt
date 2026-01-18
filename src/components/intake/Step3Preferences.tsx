"use client";

import { useIntake } from "@/context/IntakeContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  CoachingStyle,
  SessionStyle,
  COACHING_STYLE_LABELS,
  SESSION_STYLE_LABELS,
} from "@/types";

const coachingStyles: CoachingStyle[] = [
  "technical-explanatory",
  "motivational-coach",
  "empathetic-listener",
];

const sessionStyles: SessionStyle[] = [
  "hands-on-manual",
  "exercise-focused",
  "hybrid",
];

const coachingDescriptions: Record<CoachingStyle, string> = {
  "technical-explanatory":
    "Detailed explanations of your condition and treatment rationale",
  "motivational-coach":
    "Energetic, goal-focused approach with encouragement and accountability",
  "empathetic-listener":
    "Patient-centered care that prioritizes understanding your experience",
};

const sessionDescriptions: Record<SessionStyle, string> = {
  "hands-on-manual":
    "Focus on manual therapy, massage, and hands-on techniques",
  "exercise-focused":
    "Primary emphasis on therapeutic exercises and movement training",
  hybrid: "Balanced mix of manual therapy and exercise-based treatment",
};

export default function Step3Preferences() {
  const { state, toggleCoachingStyle, toggleSessionStyle } = useIntake();

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">
        What are your preferences?
      </h2>
      <p className="text-slate-600 mb-6">
        These preferences help us find PTs whose style matches what you&apos;re
        looking for. Select all that apply, or skip if you have no preference.
      </p>

      {/* Coaching Style */}
      <div className="mb-8">
        <h3 className="font-medium text-slate-900 mb-3">Coaching Style</h3>
        <p className="text-sm text-slate-500 mb-4">
          How would you like your PT to communicate and guide your treatment?
        </p>
        <div className="space-y-3">
          {coachingStyles.map((style) => (
            <div
              key={style}
              className="flex items-start space-x-3 p-3 rounded-md border border-slate-200 hover:bg-slate-50 cursor-pointer"
              onClick={() => toggleCoachingStyle(style)}
            >
              <Checkbox
                id={`coaching-${style}`}
                checked={state.coachingStyles.includes(style)}
                onCheckedChange={() => toggleCoachingStyle(style)}
              />
              <div className="flex-1">
                <Label
                  htmlFor={`coaching-${style}`}
                  className="font-medium cursor-pointer"
                >
                  {COACHING_STYLE_LABELS[style]}
                </Label>
                <p className="text-sm text-slate-500 mt-1">
                  {coachingDescriptions[style]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Session Style */}
      <div>
        <h3 className="font-medium text-slate-900 mb-3">Session Style</h3>
        <p className="text-sm text-slate-500 mb-4">
          What type of treatment approach do you prefer?
        </p>
        <div className="space-y-3">
          {sessionStyles.map((style) => (
            <div
              key={style}
              className="flex items-start space-x-3 p-3 rounded-md border border-slate-200 hover:bg-slate-50 cursor-pointer"
              onClick={() => toggleSessionStyle(style)}
            >
              <Checkbox
                id={`session-${style}`}
                checked={state.sessionStyles.includes(style)}
                onCheckedChange={() => toggleSessionStyle(style)}
              />
              <div className="flex-1">
                <Label
                  htmlFor={`session-${style}`}
                  className="font-medium cursor-pointer"
                >
                  {SESSION_STYLE_LABELS[style]}
                </Label>
                <p className="text-sm text-slate-500 mt-1">
                  {sessionDescriptions[style]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {(state.coachingStyles.length > 0 || state.sessionStyles.length > 0) && (
        <div className="mt-6 p-3 bg-slate-50 rounded-md">
          <p className="text-sm text-slate-600">
            <span className="font-medium">Selected preferences:</span>{" "}
            {[
              ...state.coachingStyles.map((s) => COACHING_STYLE_LABELS[s]),
              ...state.sessionStyles.map((s) => SESSION_STYLE_LABELS[s]),
            ].join(", ") || "None"}
          </p>
        </div>
      )}
    </div>
  );
}
