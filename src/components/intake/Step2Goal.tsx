"use client";

import { useIntake } from "@/context/IntakeContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Goal, GOAL_LABELS } from "@/types";

const goals: Goal[] = [
  "return-to-sport",
  "reduce-pain",
  "strengthen",
  "posture-mobility",
  "post-op-rehab",
];

const goalDescriptions: Record<Goal, string> = {
  "return-to-sport": "Get back to your sport or athletic activity",
  "reduce-pain": "Focus on reducing and managing pain",
  strengthen: "Build strength and stability",
  "posture-mobility": "Improve posture and increase mobility",
  "post-op-rehab": "Recover after a surgical procedure",
};

export default function Step2Goal() {
  const { state, setGoal } = useIntake();

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">
        What is your primary goal?
      </h2>
      <p className="text-slate-600 mb-6">
        Understanding your main objective helps us find PTs with experience
        achieving similar outcomes for their patients.
      </p>

      <Select
        value={state.goal || undefined}
        onValueChange={(value) => setGoal(value as Goal)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select your goal" />
        </SelectTrigger>
        <SelectContent>
          {goals.map((goal) => (
            <SelectItem key={goal} value={goal}>
              {GOAL_LABELS[goal]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {state.goal && (
        <div className="mt-4 p-3 bg-slate-50 rounded-md">
          <p className="text-sm text-slate-600">
            <span className="font-medium">{GOAL_LABELS[state.goal]}:</span>{" "}
            {goalDescriptions[state.goal]}
          </p>
        </div>
      )}
    </div>
  );
}
