"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PatientInput, PTMatch, MatchingWeights, DEFAULT_WEIGHTS } from "@/types";
import { mockPTs } from "@/data/mockPTs";
import { matchPTs } from "@/lib/matching";
import PTCard from "@/components/results/PTCard";
import WeightsDrawer from "@/components/results/WeightsDrawer";

export default function ResultsPage() {
  const router = useRouter();
  const [patientInput, setPatientInput] = useState<PatientInput | null>(null);
  const [matches, setMatches] = useState<PTMatch[]>([]);
  const [weights, setWeights] = useState<MatchingWeights>(DEFAULT_WEIGHTS);
  const [showWeights, setShowWeights] = useState(false);
  const [savedPTs, setSavedPTs] = useState<Set<string>>(new Set());

  useEffect(() => {
    const stored = sessionStorage.getItem("patientInput");
    if (stored) {
      try {
        const input = JSON.parse(stored) as PatientInput;
        setPatientInput(input);
      } catch {
        router.push("/intake");
      }
    } else {
      router.push("/intake");
    }
  }, [router]);

  const runMatching = useCallback(() => {
    if (patientInput) {
      const results = matchPTs(patientInput, mockPTs, weights);
      setMatches(results);
    }
  }, [patientInput, weights]);

  useEffect(() => {
    runMatching();
  }, [runMatching]);

  const handleWeightChange = (key: keyof MatchingWeights, value: number) => {
    setWeights((prev) => ({ ...prev, [key]: value }));
  };

  const handleSavePT = (ptId: string) => {
    setSavedPTs((prev) => {
      const next = new Set(prev);
      if (next.has(ptId)) {
        next.delete(ptId);
      } else {
        next.add(ptId);
      }
      return next;
    });
  };

  if (!patientInput) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/intake"
            className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Adjust preferences
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Your Top PT Matches
              </h1>
              <p className="text-slate-600 mt-1">
                Based on your injury, goals, and preferences
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowWeights(!showWeights)}
              className="flex items-center gap-2"
            >
              <Settings2 className="w-4 h-4" />
              Adjust Weights
            </Button>
          </div>
        </div>

        {/* Weights Drawer */}
        {showWeights && (
          <WeightsDrawer
            weights={weights}
            onWeightChange={handleWeightChange}
            onClose={() => setShowWeights(false)}
          />
        )}

        {/* Results */}
        {matches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">
              No matches found with your current criteria.
            </p>
            <Link href="/intake">
              <Button>Adjust your preferences</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {matches.map((match, index) => (
              <PTCard
                key={match.pt.id}
                match={match}
                rank={index + 1}
                isSaved={savedPTs.has(match.pt.id)}
                onSave={() => handleSavePT(match.pt.id)}
              />
            ))}
          </div>
        )}

        {/* Start Over */}
        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="outline">Start Over</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
