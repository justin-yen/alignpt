"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useIntake } from "@/context/IntakeContext";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  VisitType,
  Insurance,
  DayOfWeek,
  TimeWindow,
  VISIT_TYPE_LABELS,
  INSURANCE_LABELS,
  DAY_LABELS,
} from "@/types";

interface ZipResult {
  placeName: string;
  state: string;
  stateAbbr: string;
  zipCode: string;
}

const visitTypes: VisitType[] = ["in-person", "telehealth", "at-home"];
const insuranceOptions: Insurance[] = ["aetna", "bcbs", "united", "self-pay"];
const days: DayOfWeek[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const FULL_DAY_NAMES: Record<DayOfWeek, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};
// Timeline slots from 7:00 to 22:00 in 30-minute increments
const START_HOUR = 7;
const END_HOUR = 22;
const SLOT_MINUTES = 30;
const totalSlots = ((END_HOUR - START_HOUR) * 60) / SLOT_MINUTES;
const slots = Array.from({ length: totalSlots }, (_, i) => {
  const minutes = START_HOUR * 60 + i * SLOT_MINUTES;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
});

// Format time string (HH:MM) to 12-hour format (e.g., "10am", "1pm", "12pm")
const formatTime12h = (time: string): string => {
  const [h, m] = time.split(":").map(Number);
  const hour12 = h === 12 ? 12 : h > 12 ? h - 12 : h;
  const ampm = h >= 12 ? "pm" : "am";
  if (m === 0) {
    return `${hour12}${ampm}`;
  }
  return `${hour12}:${String(m).padStart(2, "0")}${ampm}`;
};

// Get the end time for a slot (add 30 minutes)
const getSlotEndTime = (time: string): string => {
  const [h, m] = time.split(":").map(Number);
  const totalMinutes = h * 60 + m + SLOT_MINUTES;
  const newH = Math.floor(totalMinutes / 60);
  const newM = totalMinutes % 60;
  return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
};

// Group availability by day and merge contiguous slots into ranges
const groupAvailabilityByDay = (
  availability: TimeWindow[]
): { day: DayOfWeek; ranges: string[] }[] => {
  // Group by day
  const byDay: Record<DayOfWeek, string[]> = {
    mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [],
  };

  availability.forEach((tw) => {
    byDay[tw.day].push(tw.time);
  });

  const result: { day: DayOfWeek; ranges: string[] }[] = [];

  days.forEach((day) => {
    const times = byDay[day];
    if (times.length === 0) return;

    // Sort times
    times.sort();

    // Merge contiguous slots into ranges
    const ranges: string[] = [];
    let rangeStart = times[0];
    let rangeEnd = times[0];

    for (let i = 1; i < times.length; i++) {
      const expectedNext = getSlotEndTime(rangeEnd);
      if (times[i] === expectedNext) {
        // Contiguous, extend range
        rangeEnd = times[i];
      } else {
        // Gap found, save current range and start new one
        ranges.push(`${formatTime12h(rangeStart)}-${formatTime12h(getSlotEndTime(rangeEnd))}`);
        rangeStart = times[i];
        rangeEnd = times[i];
      }
    }
    // Save last range
    ranges.push(`${formatTime12h(rangeStart)}-${formatTime12h(getSlotEndTime(rangeEnd))}`);

    result.push({ day, ranges });
  });

  return result;
};

export default function Step4Logistics() {
  const {
    state,
    setLocation,
    toggleVisitType,
    setInsurance,
    toggleAvailability,
  } = useIntake();
  const [locationSearch, setLocationSearch] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [zipResults, setZipResults] = useState<ZipResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced API call for zip code lookup
  const lookupZipCode = useCallback(async (zipCode: string) => {
    // Only search if it looks like a zip code (5 digits)
    if (!/^\d{5}$/.test(zipCode)) {
      setZipResults([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError("No results found for this zip code");
          setZipResults([]);
        } else {
          setError("Failed to look up zip code");
          setZipResults([]);
        }
        return;
      }

      const data = await response.json();

      if (data.places && data.places.length > 0) {
        const results: ZipResult[] = data.places.map((place: {
          "place name": string;
          state: string;
          "state abbreviation": string
        }) => ({
          placeName: place["place name"],
          state: place.state,
          stateAbbr: place["state abbreviation"],
          zipCode: data["post code"],
        }));
        setZipResults(results);
        setError(null);
      } else {
        setZipResults([]);
        setError("No results found");
      }
    } catch (err) {
      console.error("Zip code lookup error:", err);
      setError("Failed to look up zip code");
      setZipResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce the API call
  useEffect(() => {
    const trimmedSearch = locationSearch.trim();

    // Check if it's a 5-digit zip code
    if (/^\d{5}$/.test(trimmedSearch)) {
      const timeoutId = setTimeout(() => {
        lookupZipCode(trimmedSearch);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setZipResults([]);
      setError(null);
    }
  }, [locationSearch, lookupZipCode]);

  const handleLocationSelect = (result: ZipResult) => {
    const fullLocation = `${result.placeName}, ${result.stateAbbr} ${result.zipCode}`;
    setLocation(fullLocation);
    setLocationSearch(fullLocation);
    setShowLocationDropdown(false);
    setZipResults([]);
  };

  const isAvailabilitySelected = (day: DayOfWeek, time: string) => {
    return state.availability.some((w) => w.day === day && w.time === time);
  };

  // Drag state for per-day timeline selection
  const [preview, setPreview] = useState<{
    day: DayOfWeek;
    startSlot: number;
    endSlot: number;
  } | null>(null);
  const dragInfo = useRef<{
    isDragging: boolean;
    day: DayOfWeek | null;
    startSlot: number | null;
    mode: "select" | "deselect" | null;
  }>({ isDragging: false, day: null, startSlot: null, mode: null });

  const calcSlotFromEvent = (e: MouseEvent | React.MouseEvent, el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    const y = (e as MouseEvent).clientY - rect.top;
    const pct = Math.max(0, Math.min(1, y / rect.height));
    return Math.floor(pct * totalSlots);
  };

  const handleTimelineMouseDown = (day: DayOfWeek) => (e: React.MouseEvent) => {
    const el = e.currentTarget as HTMLElement;
    const slot = calcSlotFromEvent(e, el);
    const time = slots[slot];
    const selected = isAvailabilitySelected(day, time);
    dragInfo.current = { isDragging: true, day, startSlot: slot, mode: selected ? "deselect" : "select" };
    setPreview({ day, startSlot: slot, endSlot: slot });
    e.preventDefault();
  };

  const handleTimelineMouseMove = (day: DayOfWeek) => (e: React.MouseEvent) => {
    if (!dragInfo.current.isDragging || dragInfo.current.day !== day) return;
    const el = e.currentTarget as HTMLElement;
    const slot = calcSlotFromEvent(e, el);
    if (dragInfo.current.startSlot == null) return;
    setPreview({ day, startSlot: dragInfo.current.startSlot, endSlot: slot });
  };

  const finalizePreview = (day: DayOfWeek) => {
    if (!preview || preview.day !== day) return;
    const s = Math.min(preview.startSlot, preview.endSlot);
    const e = Math.max(preview.startSlot, preview.endSlot);
    const mode = dragInfo.current.mode;
    for (let i = s; i <= e; i++) {
      const time = slots[i];
      const selected = isAvailabilitySelected(day, time);
      if (mode === "select" && !selected) toggleAvailability({ day, time });
      if (mode === "deselect" && selected) toggleAvailability({ day, time });
    }
    dragInfo.current = { isDragging: false, day: null, startSlot: null, mode: null };
    setPreview(null);
  };

  useEffect(() => {
    const onMouseUp = () => {
      if (dragInfo.current.isDragging && dragInfo.current.day) {
        finalizePreview(dragInfo.current.day);
      }
    };
    window.addEventListener("mouseup", onMouseUp);
    return () => window.removeEventListener("mouseup", onMouseUp);
  }, [preview]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">
        Logistics & Availability
      </h2>
      <p className="text-slate-600 mb-6">
        Help us find PTs that match your practical needs.
      </p>

      {/* Location */}
      <div className="mb-6">
        <Label className="block mb-2 font-medium">Location</Label>
        <p className="text-sm text-slate-500 mb-2">
          Enter your 5-digit zip code
        </p>
        <div className="relative">
          <Input
            type="text"
            placeholder="e.g., 94102"
            value={locationSearch}
            onChange={(e) => {
              const value = e.target.value;
              setLocationSearch(value);
              setShowLocationDropdown(true);
              if (value !== state.location) {
                setLocation("");
              }
            }}
            onFocus={() => setShowLocationDropdown(true)}
            onBlur={() => {
              // Delay to allow click on dropdown
              setTimeout(() => setShowLocationDropdown(false), 200);
            }}
          />

          {/* Loading indicator */}
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg
                className="animate-spin h-4 w-4 text-slate-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          )}

          {/* Dropdown results */}
          {showLocationDropdown && zipResults.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-48 overflow-auto">
              {zipResults.map((result, index) => (
                <div
                  key={`${result.zipCode}-${index}`}
                  className="px-3 py-2 hover:bg-slate-100 cursor-pointer text-sm"
                  onClick={() => handleLocationSelect(result)}
                >
                  <span className="font-medium">{result.placeName}</span>
                  <span className="text-slate-500">
                    , {result.stateAbbr} {result.zipCode}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Error message */}
          {showLocationDropdown && error && !isLoading && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg">
              <div className="px-3 py-2 text-sm text-slate-500">
                {error}
              </div>
            </div>
          )}

          {/* Hint when typing */}
          {showLocationDropdown &&
           locationSearch.length > 0 &&
           locationSearch.length < 5 &&
           /^\d+$/.test(locationSearch) &&
           !state.location && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg">
              <div className="px-3 py-2 text-sm text-slate-400">
                Enter all 5 digits...
              </div>
            </div>
          )}
        </div>
        {state.location && (
          <p className="mt-2 text-sm text-primary">
            Selected: {state.location}
          </p>
        )}
      </div>

      {/* Visit Type */}
      <div className="mb-6">
        <Label className="block mb-2 font-medium">
          Visit Type <span className="text-red-500">*</span>
        </Label>
        <p className="text-sm text-slate-500 mb-2">
          Select all that work for you
        </p>
        <div className="grid grid-cols-3 gap-3">
          {visitTypes.map((type) => (
            <div
              key={type}
              className={`flex items-center justify-center p-3 rounded-md border cursor-pointer transition-colors ${
                state.visitTypes.includes(type)
                  ? "border-primary bg-primary/5"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
              onClick={() => toggleVisitType(type)}
            >
              <Checkbox
                id={`visit-${type}`}
                checked={state.visitTypes.includes(type)}
                onCheckedChange={() => toggleVisitType(type)}
                className="mr-2"
              />
              <Label
                htmlFor={`visit-${type}`}
                className="text-sm cursor-pointer"
              >
                {VISIT_TYPE_LABELS[type]}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Insurance */}
      <div className="mb-6">
        <Label className="block mb-2 font-medium">
          Insurance <span className="text-red-500">*</span>
        </Label>
        <Select
          value={state.insurance || undefined}
          onValueChange={(value) => setInsurance(value as Insurance)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select your insurance" />
          </SelectTrigger>
          <SelectContent>
            {insuranceOptions.map((ins) => (
              <SelectItem key={ins} value={ins}>
                {INSURANCE_LABELS[ins]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Availability */}
      <div>
        <Label className="block mb-2 font-medium">Availability</Label>
        <p className="text-sm text-slate-500 mb-3">
          Select 2-3 time windows when you&apos;re typically available (optional but
          helps with matching)
        </p>
        <div className="flex gap-6">
          {/* Grid container */}
          <div className="overflow-x-auto flex-1">
          <div className="flex gap-2">
            {/* Hour labels column */}
            <div className="flex-shrink-0 w-10">
              {/* Empty header space to align with day labels */}
              <div className="text-xs text-center text-slate-600 font-medium mb-2 invisible">
                &nbsp;
              </div>
              {/* Hour labels container */}
              <div className="relative h-72">
                {Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => {
                  const hour = START_HOUR + i;
                  const top = ((i * 60) / ((END_HOUR - START_HOUR) * 60)) * 100;
                  const hour12 = hour === 12 ? 12 : hour > 12 ? hour - 12 : hour;
                  const ampm = hour >= 12 ? "pm" : "am";
                  return (
                    <div
                      key={`hour-label-${hour}`}
                      className="absolute right-0 text-xs text-slate-500 -translate-y-1/2 pr-1"
                      style={{ top: `${top}%` }}
                    >
                      {hour12}{ampm}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Day columns */}
            <div className="grid grid-cols-7 gap-4 flex-1">
            {days.map((day) => (
              <div key={`day-${day}`}>
                <div className="text-xs text-center text-slate-600 font-medium mb-2">
                  {DAY_LABELS[day]}
                </div>

                <div
                  className="relative h-72 bg-white border border-slate-200 rounded-md select-none"
                  onMouseDown={handleTimelineMouseDown(day)}
                  onMouseMove={handleTimelineMouseMove(day)}
                >
                  {/* hour ticks (horizontal lines) */}
                  {Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => {
                    const hour = START_HOUR + i;
                    const top = ((i * 60) / ((END_HOUR - START_HOUR) * 60)) * 100;
                    return (
                      <div
                        key={`tick-${day}-${hour}`}
                        className="absolute left-0 right-0 h-px bg-slate-100"
                        style={{ top: `${top}%` }}
                      />
                    );
                  })}

                  {/* preview overlay */}
                  {preview && preview.day === day && (
                    (() => {
                      const s = Math.min(preview.startSlot, preview.endSlot);
                      const e = Math.max(preview.startSlot, preview.endSlot);
                      const top = (s / totalSlots) * 100;
                      const height = ((e - s + 1) / totalSlots) * 100;
                      return (
                        <div
                          className="absolute left-0 right-0 bg-primary/30 pointer-events-none rounded-md"
                          style={{ top: `${top}%`, height: `${height}%` }}
                        />
                      );
                    })()
                  )}

                  {/* existing selections overlay (merged contiguous slots into single rounded ranges) */}
                  {(() => {
                    const ranges: { start: number; end: number }[] = [];
                    let i = 0;
                    while (i < totalSlots) {
                      if (isAvailabilitySelected(day, slots[i])) {
                        let start = i;
                        let j = i;
                        while (j + 1 < totalSlots && isAvailabilitySelected(day, slots[j + 1])) {
                          j++;
                        }
                        ranges.push({ start, end: j });
                        i = j + 1;
                      } else {
                        i++;
                      }
                    }

                    return ranges.map((r, idx) => {
                      const top = (r.start / totalSlots) * 100;
                      const height = ((r.end - r.start + 1) / totalSlots) * 100;
                      return (
                        <div
                          key={`sel-range-${day}-${idx}`}
                          className="absolute left-1 right-1 bg-primary rounded-md pointer-events-none"
                          style={{ top: `${top}%`, height: `${height}%` }}
                        />
                      );
                    });
                  })()}
                </div>
              </div>
            ))}
            </div>
          </div>
          </div>

          {/* Sidebar - Selected availabilities summary */}
          <div className="flex-shrink-0 w-56">
            <div className="text-xs text-slate-600 font-medium mb-2">
              Your selections
            </div>
            <div className="border border-slate-200 rounded-md bg-slate-50 p-3 min-h-[288px]">
              {state.availability.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  Click and drag on the calendar to select your available times
                </p>
              ) : (
                <div className="space-y-3">
                  {groupAvailabilityByDay(state.availability).map(({ day, ranges }) => (
                    <div key={`summary-${day}`}>
                      <div className="text-sm font-medium text-slate-700">
                        {FULL_DAY_NAMES[day]}
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        {ranges.join(", ")}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
