"use client";

import { useState, useEffect, useCallback } from "react";
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
  TimeOfDay,
  TimeWindow,
  VISIT_TYPE_LABELS,
  INSURANCE_LABELS,
  DAY_LABELS,
  TIME_LABELS,
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
const times: TimeOfDay[] = ["am", "pm", "eve"];

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

  const isAvailabilitySelected = (day: DayOfWeek, time: TimeOfDay) => {
    return state.availability.some((w) => w.day === day && w.time === time);
  };

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
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-sm font-medium text-slate-600"></th>
                {days.map((day) => (
                  <th
                    key={day}
                    className="p-2 text-sm font-medium text-slate-600 text-center"
                  >
                    {DAY_LABELS[day]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {times.map((time) => (
                <tr key={time}>
                  <td className="p-2 text-sm font-medium text-slate-600">
                    {TIME_LABELS[time]}
                  </td>
                  {days.map((day) => {
                    const isSelected = isAvailabilitySelected(day, time);
                    const window: TimeWindow = { day, time };
                    return (
                      <td key={`${day}-${time}`} className="p-1 text-center">
                        <button
                          type="button"
                          onClick={() => toggleAvailability(window)}
                          className={`w-8 h-8 rounded-md border transition-colors ${
                            isSelected
                              ? "bg-primary text-white border-primary"
                              : "border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {isSelected && (
                            <svg
                              className="w-4 h-4 mx-auto"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {state.availability.length > 0 && (
          <p className="mt-3 text-sm text-slate-500">
            {state.availability.length} time window
            {state.availability.length !== 1 ? "s" : ""} selected
          </p>
        )}
      </div>
    </div>
  );
}
