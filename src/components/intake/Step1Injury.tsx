"use client";

import { useIntake } from "@/context/IntakeContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  InjuryArea,
  InjurySide,
  InjuryRegion,
  NeckRegion,
  ShoulderRegion,
  BackRegion,
  HipRegion,
  KneeRegion,
  AnkleFootRegion,
  WristHandRegion,
  INJURY_LABELS,
  INJURY_SIDE_LABELS,
  NECK_REGION_LABELS,
  SHOULDER_REGION_LABELS,
  BACK_REGION_LABELS,
  HIP_REGION_LABELS,
  KNEE_REGION_LABELS,
  ANKLE_FOOT_REGION_LABELS,
  WRIST_HAND_REGION_LABELS,
} from "@/types";

const injuries: InjuryArea[] = [
  "neck",
  "shoulder",
  "back",
  "hip",
  "knee",
  "ankle-foot",
  "wrist-hand",
];

const sides: InjurySide[] = ["left", "right", "both"];

// Get region options based on injury area
function getRegionOptions(area: InjuryArea): { value: string; label: string }[] {
  switch (area) {
    case "neck":
      return Object.entries(NECK_REGION_LABELS).map(([value, label]) => ({
        value,
        label,
      }));
    case "shoulder":
      return Object.entries(SHOULDER_REGION_LABELS).map(([value, label]) => ({
        value,
        label,
      }));
    case "back":
      return Object.entries(BACK_REGION_LABELS).map(([value, label]) => ({
        value,
        label,
      }));
    case "hip":
      return Object.entries(HIP_REGION_LABELS).map(([value, label]) => ({
        value,
        label,
      }));
    case "knee":
      return Object.entries(KNEE_REGION_LABELS).map(([value, label]) => ({
        value,
        label,
      }));
    case "ankle-foot":
      return Object.entries(ANKLE_FOOT_REGION_LABELS).map(([value, label]) => ({
        value,
        label,
      }));
    case "wrist-hand":
      return Object.entries(WRIST_HAND_REGION_LABELS).map(([value, label]) => ({
        value,
        label,
      }));
    default:
      return [];
  }
}

// Get region label based on area and region value
function getRegionLabel(area: InjuryArea, region: InjuryRegion): string {
  switch (area) {
    case "neck":
      return NECK_REGION_LABELS[region as NeckRegion] || region;
    case "shoulder":
      return SHOULDER_REGION_LABELS[region as ShoulderRegion] || region;
    case "back":
      return BACK_REGION_LABELS[region as BackRegion] || region;
    case "hip":
      return HIP_REGION_LABELS[region as HipRegion] || region;
    case "knee":
      return KNEE_REGION_LABELS[region as KneeRegion] || region;
    case "ankle-foot":
      return ANKLE_FOOT_REGION_LABELS[region as AnkleFootRegion] || region;
    case "wrist-hand":
      return WRIST_HAND_REGION_LABELS[region as WristHandRegion] || region;
    default:
      return region;
  }
}

// Get side question text based on injury area
function getSideQuestion(area: InjuryArea): string {
  switch (area) {
    case "neck":
      return "Which side of your neck?";
    case "shoulder":
      return "Which shoulder?";
    case "back":
      return "Which side of your back?";
    case "hip":
      return "Which hip?";
    case "knee":
      return "Which knee?";
    case "ankle-foot":
      return "Which ankle/foot?";
    case "wrist-hand":
      return "Which wrist/hand?";
    default:
      return "Which side?";
  }
}

export default function Step1Injury() {
  const {
    state,
    setInjuryArea,
    setInjurySide,
    setInjuryRegion,
    setInjuryContext,
  } = useIntake();

  const regionOptions = state.injuryArea
    ? getRegionOptions(state.injuryArea)
    : [];

  const showSummary =
    state.injuryArea && state.injurySide && state.injuryRegion;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Where is your pain or injury?
        </h2>
        <p className="text-slate-600 mb-6">
          Select the primary area you&apos;re experiencing issues with. This helps us
          match you with PTs who specialize in treating your specific condition.
        </p>
      </div>

      {/* Step 1: Injury Area */}
      <div>
        <Label className="block mb-2 font-medium">General Area</Label>
        <Select
          value={state.injuryArea || undefined}
          onValueChange={(value) => setInjuryArea(value as InjuryArea)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select injury area" />
          </SelectTrigger>
          <SelectContent>
            {injuries.map((injury) => (
              <SelectItem key={injury} value={injury}>
                {INJURY_LABELS[injury]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Step 2: Side - appears after area is selected */}
      {state.injuryArea && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <Label className="block mb-2 font-medium">
            {getSideQuestion(state.injuryArea)}
          </Label>
          <div className="grid grid-cols-3 gap-3">
            {sides.map((side) => (
              <button
                key={side}
                type="button"
                onClick={() => setInjurySide(side)}
                className={`p-3 rounded-md border text-center transition-colors ${
                  state.injurySide === side
                    ? "border-primary bg-primary/5 text-primary font-medium"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                {INJURY_SIDE_LABELS[side]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Region - appears after side is selected */}
      {state.injuryArea && state.injurySide && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <Label className="block mb-2 font-medium">
            Where specifically in your {INJURY_LABELS[state.injuryArea].toLowerCase()}?
          </Label>
          <Select
            value={state.injuryRegion || undefined}
            onValueChange={(value) => setInjuryRegion(value as InjuryRegion)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select specific location" />
            </SelectTrigger>
            <SelectContent>
              {regionOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Step 4: Summary + Context - appears after all selections */}
      {showSummary && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-4">
          {/* Summary */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h3 className="font-medium text-slate-900 mb-2">Your Selection</h3>
            <div className="text-sm text-slate-600 space-y-1">
              <p>
                <span className="font-medium">Area:</span>{" "}
                {INJURY_LABELS[state.injuryArea!]}
              </p>
              <p>
                <span className="font-medium">Side:</span>{" "}
                {INJURY_SIDE_LABELS[state.injurySide!]}
              </p>
              <p>
                <span className="font-medium">Location:</span>{" "}
                {getRegionLabel(state.injuryArea!, state.injuryRegion!)}
              </p>
            </div>
          </div>

          {/* Additional Context */}
          <div>
            <Label className="block mb-2 font-medium">
              Tell us more about your injury{" "}
              <span className="font-normal text-slate-500">(optional)</span>
            </Label>
            <p className="text-sm text-slate-500 mb-2">
              Include details like how long you&apos;ve had this issue, how the
              injury happened, what makes it better or worse, and any previous
              treatments you&apos;ve tried.
            </p>
            <textarea
              value={state.injuryContext}
              onChange={(e) => setInjuryContext(e.target.value)}
              placeholder="Example: I've had this pain for about 3 months. It started after I increased my running mileage. It's worse in the morning and after sitting for long periods. I tried stretching but it hasn't helped much..."
              className="w-full min-h-[120px] p-3 rounded-md border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-y"
            />
          </div>
        </div>
      )}
    </div>
  );
}
