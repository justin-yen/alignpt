"use client";

import { useIntake } from "@/context/IntakeContext";
import { StylePreferences } from "@/types";

interface PreferenceConfig {
  key: keyof StylePreferences;
  title: string;
  leftLabel: string;
  rightLabel: string;
}

const preferenceConfigs: PreferenceConfig[] = [
  {
    key: "communicationStyle",
    title: "Communication",
    leftLabel: "Technical",
    rightLabel: "Simple",
  },
  {
    key: "motivationLevel",
    title: "Energy",
    leftLabel: "Calm",
    rightLabel: "High-Energy",
  },
  {
    key: "empathyLevel",
    title: "Interaction",
    leftLabel: "Direct",
    rightLabel: "Empathetic",
  },
  {
    key: "treatmentApproach",
    title: "Treatment",
    leftLabel: "Hands-On",
    rightLabel: "Exercise-Based",
  },
];

function getPreferenceLabel(
  value: number,
  leftLabel: string,
  rightLabel: string
): string {
  if (value === 1) return `Strongly ${leftLabel.toLowerCase()}`;
  if (value === 2) return leftLabel;
  if (value === 3) return "No preference";
  if (value === 4) return rightLabel;
  if (value === 5) return `Strongly ${rightLabel.toLowerCase()}`;
  return "";
}

export default function PreferencesSidebar() {
  const { state } = useIntake();

  return (
    <div className="w-56 flex-shrink-0">
      <div className="sticky top-8 p-5 bg-white rounded-2xl border border-border/60 shadow-soft">
        <h3 className="font-medium text-foreground mb-4">Your Selections</h3>
        <div className="space-y-4">
          {preferenceConfigs.map((config) => {
            const value = state.stylePreferences[config.key];
            const label = getPreferenceLabel(
              value,
              config.leftLabel,
              config.rightLabel
            );
            const hasPreference = value !== 3;

            return (
              <div key={config.key} className="space-y-1">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">
                  {config.title}
                </div>
                <div
                  className={`text-sm font-medium transition-colors duration-200 ${
                    hasPreference ? "text-primary" : "text-muted-foreground/60"
                  }`}
                >
                  {label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
