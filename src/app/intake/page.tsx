"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useIntake } from "@/context/IntakeContext";
import Step1Injury from "@/components/intake/Step1Injury";
import Step2Goal from "@/components/intake/Step2Goal";
import Step3Preferences from "@/components/intake/Step3Preferences";
import Step4Logistics from "@/components/intake/Step4Logistics";
import PreferencesSidebar from "@/components/intake/PreferencesSidebar";
import { ChevronLeft, House } from "lucide-react";

const TOTAL_STEPS = 4;

const stepTitles = [
  "Pain/Injury Area",
  "Your Goal",
  "Preferences",
  "Logistics",
];

export default function IntakePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const { isStepValid, getPatientInput, saveToDatabase } = useIntake();
  const router = useRouter();

  const handleNext = async () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      const patientInput = getPatientInput();
      if (patientInput) {
        // Save to database (fire and forget - don't block navigation on failure)
        saveToDatabase().catch((err) => {
          console.error("Failed to save intake data:", err);
        });

        // Store in sessionStorage for the results page
        sessionStorage.setItem("patientInput", JSON.stringify(patientInput));
        router.push("/results");
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Injury />;
      case 2:
        return <Step2Goal />;
      case 3:
        return <Step3Preferences />;
      case 4:
        return <Step4Logistics />;
      default:
        return null;
    }
  };

  const progressValue = (currentStep / TOTAL_STEPS) * 100;
  const isPreferencesStep = currentStep === 3;

  return (
    <main className="min-h-screen py-8 px-4 relative">
      {/* Back to Home - positioned absolutely on the left */}
      <Link
        href="/"
        className="absolute left-4 top-8 inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
      >
        <House className="w-4 h-4 mr-1" />
        Home
      </Link>

      <div className={`mx-auto ${isPreferencesStep ? "max-w-4xl" : "max-w-2xl"}`}>
        {/* Header */}
        <div className="mb-4">
          <Image
              src="/align_pt_transparent.png"
              alt="AlignPT"
              width={300}
              height={100}
              className="h-10 w-auto"
            />
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>
              Step {currentStep} of {TOTAL_STEPS}
            </span>
            <span>{stepTitles[currentStep - 1]}</span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>

        {/* Step Content with optional sidebar */}
        <div className={`flex gap-6 ${isPreferencesStep ? "" : "justify-center"}`}>
          <div className={`${isPreferencesStep ? "flex-1" : "w-full max-w-2xl"}`}>
            {/* Step Content */}
            <div className="bg-white rounded-2xl border border-border/60 p-8 mb-6 shadow-soft">
              {renderStep()}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                Back
              </Button>
              <Button onClick={handleNext} disabled={!isStepValid(currentStep)}>
                {currentStep === TOTAL_STEPS ? "Find My Matches" : "Continue"}
              </Button>
            </div>
          </div>

          {/* Sidebar for preferences step */}
          {isPreferencesStep && <PreferencesSidebar />}
        </div>
      </div>
    </main>
  );
}
