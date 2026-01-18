"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { MatchingWeights, DEFAULT_WEIGHTS } from "@/types";

interface WeightsDrawerProps {
  weights: MatchingWeights;
  onWeightChange: (key: keyof MatchingWeights, value: number) => void;
  onClose: () => void;
}

const weightLabels: Record<keyof MatchingWeights, { label: string; max: number }> = {
  injury: { label: "Injury Fit", max: 30 },
  goal: { label: "Goal Fit", max: 20 },
  style: { label: "Style Fit", max: 20 },
  logistics: { label: "Logistics Fit", max: 20 },
  availability: { label: "Availability Fit", max: 10 },
};

export default function WeightsDrawer({
  weights,
  onWeightChange,
  onClose,
}: WeightsDrawerProps) {
  const handleReset = () => {
    Object.keys(DEFAULT_WEIGHTS).forEach((key) => {
      onWeightChange(
        key as keyof MatchingWeights,
        DEFAULT_WEIGHTS[key as keyof MatchingWeights]
      );
    });
  };

  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-900">Adjust Match Weights</h3>
          <p className="text-sm text-slate-500">
            Debug: Tweak how each factor contributes to the match score
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {(Object.keys(weightLabels) as Array<keyof MatchingWeights>).map(
          (key) => (
            <div key={key}>
              <div className="flex justify-between mb-2">
                <Label className="text-sm">{weightLabels[key].label}</Label>
                <span className="text-sm text-slate-600">
                  {weights[key]} / {weightLabels[key].max}
                </span>
              </div>
              <Slider
                value={[weights[key]]}
                onValueChange={([value]) => onWeightChange(key, value)}
                max={weightLabels[key].max}
                step={1}
                className="w-full"
              />
            </div>
          )
        )}
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
        <p className="text-sm text-slate-600">
          Total: <span className="font-medium">{totalWeight}</span> points
          {totalWeight !== 100 && (
            <span className="text-amber-600 ml-2">(default is 100)</span>
          )}
        </p>
        <Button variant="outline" size="sm" onClick={handleReset}>
          Reset to Default
        </Button>
      </div>
    </div>
  );
}
