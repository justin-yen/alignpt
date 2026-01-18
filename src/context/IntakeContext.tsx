"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  InjuryArea,
  InjurySide,
  InjuryRegion,
  Goal,
  StylePreferences,
  DEFAULT_STYLE_PREFERENCES,
  VisitType,
  Insurance,
  TimeWindow,
  PatientInput,
} from "@/types";

interface IntakeState {
  injuryArea: InjuryArea | null;
  injurySide: InjurySide | null;
  injuryRegion: InjuryRegion | null;
  injuryContext: string;
  goal: Goal | null;
  stylePreferences: StylePreferences;
  location: string;
  visitTypes: VisitType[];
  insurance: Insurance | null;
  availability: TimeWindow[];
}

interface IntakeContextType {
  state: IntakeState;
  setInjuryArea: (area: InjuryArea) => void;
  setInjurySide: (side: InjurySide) => void;
  setInjuryRegion: (region: InjuryRegion) => void;
  setInjuryContext: (context: string) => void;
  setGoal: (goal: Goal) => void;
  setStylePreference: (key: keyof StylePreferences, value: number) => void;
  setLocation: (location: string) => void;
  toggleVisitType: (type: VisitType) => void;
  setInsurance: (insurance: Insurance) => void;
  toggleAvailability: (window: TimeWindow) => void;
  getPatientInput: () => PatientInput | null;
  isStepValid: (step: number) => boolean;
  resetState: () => void;
}

const initialState: IntakeState = {
  injuryArea: null,
  injurySide: null,
  injuryRegion: null,
  injuryContext: "",
  goal: null,
  stylePreferences: { ...DEFAULT_STYLE_PREFERENCES },
  location: "",
  visitTypes: [],
  insurance: null,
  availability: [],
};

const IntakeContext = createContext<IntakeContextType | undefined>(undefined);

export function IntakeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<IntakeState>(initialState);

  const setInjuryArea = (area: InjuryArea) => {
    // Reset side and region when area changes
    setState((prev) => ({
      ...prev,
      injuryArea: area,
      injurySide: null,
      injuryRegion: null,
    }));
  };

  const setInjurySide = (side: InjurySide) => {
    setState((prev) => ({ ...prev, injurySide: side }));
  };

  const setInjuryRegion = (region: InjuryRegion) => {
    setState((prev) => ({ ...prev, injuryRegion: region }));
  };

  const setInjuryContext = (context: string) => {
    setState((prev) => ({ ...prev, injuryContext: context }));
  };

  const setGoal = (goal: Goal) => {
    setState((prev) => ({ ...prev, goal }));
  };

  const setStylePreference = (key: keyof StylePreferences, value: number) => {
    setState((prev) => ({
      ...prev,
      stylePreferences: {
        ...prev.stylePreferences,
        [key]: value,
      },
    }));
  };

  const setLocation = (location: string) => {
    setState((prev) => ({ ...prev, location }));
  };

  const toggleVisitType = (type: VisitType) => {
    setState((prev) => ({
      ...prev,
      visitTypes: prev.visitTypes.includes(type)
        ? prev.visitTypes.filter((t) => t !== type)
        : [...prev.visitTypes, type],
    }));
  };

  const setInsurance = (insurance: Insurance) => {
    setState((prev) => ({ ...prev, insurance }));
  };

  const toggleAvailability = (window: TimeWindow) => {
    setState((prev) => {
      const exists = prev.availability.some(
        (w) => w.day === window.day && w.time === window.time
      );
      if (exists) {
        return {
          ...prev,
          availability: prev.availability.filter(
            (w) => !(w.day === window.day && w.time === window.time)
          ),
        };
      }
      return {
        ...prev,
        availability: [...prev.availability, window],
      };
    });
  };

  const getPatientInput = (): PatientInput | null => {
    if (
      !state.injuryArea ||
      !state.injurySide ||
      !state.injuryRegion ||
      !state.goal ||
      !state.location ||
      state.visitTypes.length === 0 ||
      !state.insurance
    ) {
      return null;
    }

    return {
      injuryArea: state.injuryArea,
      injurySide: state.injurySide,
      injuryRegion: state.injuryRegion,
      injuryContext: state.injuryContext,
      goal: state.goal,
      stylePreferences: state.stylePreferences,
      location: state.location,
      visitTypes: state.visitTypes,
      insurance: state.insurance,
      availability: state.availability,
    };
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return (
          state.injuryArea !== null &&
          state.injurySide !== null &&
          state.injuryRegion !== null
        );
      case 2:
        return state.goal !== null;
      case 3:
        return true; // Preferences are optional
      case 4:
        return (
          state.location !== "" &&
          state.visitTypes.length > 0 &&
          state.insurance !== null
        );
      default:
        return false;
    }
  };

  const resetState = () => {
    setState(initialState);
  };

  return (
    <IntakeContext.Provider
      value={{
        state,
        setInjuryArea,
        setInjurySide,
        setInjuryRegion,
        setInjuryContext,
        setGoal,
        setStylePreference,
        setLocation,
        toggleVisitType,
        setInsurance,
        toggleAvailability,
        getPatientInput,
        isStepValid,
        resetState,
      }}
    >
      {children}
    </IntakeContext.Provider>
  );
}

export function useIntake() {
  const context = useContext(IntakeContext);
  if (context === undefined) {
    throw new Error("useIntake must be used within an IntakeProvider");
  }
  return context;
}
