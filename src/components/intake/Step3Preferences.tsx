"use client";

import { useIntake } from "@/context/IntakeContext";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { StylePreferences } from "@/types";

interface StyleSliderConfig {
  key: keyof StylePreferences;
  title: string;
  description: string;
  leftLabel: string;
  rightLabel: string;
  leftDescription: string;
  rightDescription: string;
}

const sliderConfigs: StyleSliderConfig[] = [
  {
    key: "communicationStyle",
    title: "Communication Style",
    description: "How would you like your PT to explain things?",
    leftLabel: "Technical",
    rightLabel: "Simple",
    leftDescription: "Detailed scientific explanations",
    rightDescription: "Easy-to-understand guidance",
  },
  {
    key: "motivationLevel",
    title: "Energy & Motivation",
    description: "What kind of energy do you want from your PT?",
    leftLabel: "Calm",
    rightLabel: "High-Energy",
    leftDescription: "Measured, relaxed pace",
    rightDescription: "Motivational, coach-like energy",
  },
  {
    key: "empathyLevel",
    title: "Interaction Style",
    description: "How should your PT approach your sessions?",
    leftLabel: "Direct",
    rightLabel: "Empathetic",
    leftDescription: "Efficient, goal-focused",
    rightDescription: "Patient, emotionally supportive",
  },
  {
    key: "treatmentApproach",
    title: "Treatment Approach",
    description: "What type of treatment do you prefer?",
    leftLabel: "Hands-On",
    rightLabel: "Exercise-Based",
    leftDescription: "Manual therapy, massage, mobilization",
    rightDescription: "Movement training, exercises",
  },
];

export default function Step3Preferences() {
  const { state, setStylePreference } = useIntake();

  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground mb-2">
        Your Preferences
      </h2>
      <p className="text-muted-foreground mb-8">
        Adjust the sliders to indicate your preferences. The middle position
        means no preference. These help us find PTs whose style matches what
        you&apos;re looking for.
      </p>

      <div className="space-y-10">
        {sliderConfigs.map((config) => {
          const value = state.stylePreferences[config.key];
          return (
            <div key={config.key} className="space-y-3">
              <div>
                <Label className="text-base font-medium text-foreground">{config.title}</Label>
                <p className="text-sm text-muted-foreground">{config.description}</p>
              </div>

              {/* Slider with labels */}
              <div className="px-1">
                {/* Top labels */}
                <div className="flex justify-between mb-3">
                  <span
                    className={`text-sm font-medium transition-colors duration-200 ${
                      value < 3 ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {config.leftLabel}
                  </span>
                  <span
                    className={`text-sm transition-colors duration-200 ${
                      value === 3 ? "text-primary font-medium" : "text-muted-foreground/50"
                    }`}
                  >
                    Neutral
                  </span>
                  <span
                    className={`text-sm font-medium transition-colors duration-200 ${
                      value > 3 ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {config.rightLabel}
                  </span>
                </div>

                {/* Slider */}
                <Slider
                  value={[value]}
                  onValueChange={([newValue]) =>
                    setStylePreference(config.key, newValue)
                  }
                  min={1}
                  max={5}
                  step={1}
                  className="w-full"
                />

                {/* Bottom descriptions */}
                <div className="flex justify-between mt-3">
                  <span className="text-xs text-muted-foreground/70 max-w-[140px]">
                    {config.leftDescription}
                  </span>
                  <span className="text-xs text-muted-foreground/70 max-w-[140px] text-right">
                    {config.rightDescription}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
