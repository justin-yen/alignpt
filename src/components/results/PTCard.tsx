"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  PTMatch,
  COACHING_STYLE_LABELS,
  SESSION_STYLE_LABELS,
  INSURANCE_LABELS,
} from "@/types";

interface PTCardProps {
  match: PTMatch;
  rank: number;
  isSaved: boolean;
  onSave: () => void;
}

export default function PTCard({ match, rank, isSaved, onSave }: PTCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const { pt, score, reasons } = match;

  const positiveReasons = reasons.filter((r) => r.type === "positive");
  const tradeoffReasons = reasons.filter((r) => r.type === "tradeoff");

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {/* Avatar placeholder */}
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg shrink-0">
              {pt.photoPlaceholder}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-primary">
                  #{rank}
                </span>
                <h3 className="text-lg font-semibold text-slate-900">
                  {pt.name}
                </h3>
              </div>
              <p className="text-sm text-slate-600">{pt.credentials}</p>
              <p className="text-sm text-slate-500">
                {pt.clinicName} • {pt.neighborhood}
              </p>
            </div>
          </div>

          {/* Match Score */}
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">{score.total}</div>
            <p className="text-xs text-slate-500">Match Score</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Specialties */}
        <div className="flex flex-wrap gap-2 mb-4">
          {pt.specialties.map((specialty) => (
            <Badge key={specialty} variant="secondary">
              {specialty}
            </Badge>
          ))}
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
          <div>
            <p className="text-slate-500">Coaching</p>
            <p className="font-medium">
              {COACHING_STYLE_LABELS[pt.coachingStyle]}
            </p>
          </div>
          <div>
            <p className="text-slate-500">Sessions</p>
            <p className="font-medium">
              {SESSION_STYLE_LABELS[pt.sessionStyle]}
            </p>
          </div>
          <div>
            <p className="text-slate-500">Insurance</p>
            <p className="font-medium">
              {pt.insuranceAccepted.map((i) => INSURANCE_LABELS[i]).join(", ")}
            </p>
          </div>
          <div>
            <p className="text-slate-500">Next Available</p>
            <p className="font-medium">{pt.nextAvailableSlots[0]}</p>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="bg-slate-50 rounded-lg p-4 mb-4">
          <p className="text-sm font-medium text-slate-700 mb-3">
            Score Breakdown
          </p>
          <div className="grid grid-cols-5 gap-2 text-center text-xs">
            <div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${(score.injuryFit / 30) * 100}%` }}
                />
              </div>
              <p className="mt-1 text-slate-600">Injury</p>
              <p className="font-medium">{score.injuryFit}/30</p>
            </div>
            <div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${(score.goalFit / 20) * 100}%` }}
                />
              </div>
              <p className="mt-1 text-slate-600">Goal</p>
              <p className="font-medium">{score.goalFit}/20</p>
            </div>
            <div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${(score.styleFit / 20) * 100}%` }}
                />
              </div>
              <p className="mt-1 text-slate-600">Style</p>
              <p className="font-medium">{score.styleFit}/20</p>
            </div>
            <div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${(score.logisticsFit / 20) * 100}%` }}
                />
              </div>
              <p className="mt-1 text-slate-600">Logistics</p>
              <p className="font-medium">{score.logisticsFit}/20</p>
            </div>
            <div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${(score.availabilityFit / 10) * 100}%` }}
                />
              </div>
              <p className="mt-1 text-slate-600">Availability</p>
              <p className="font-medium">{score.availabilityFit}/10</p>
            </div>
          </div>
        </div>

        {/* Why This Match - Expandable */}
        <div className="border-t border-slate-200 pt-4">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="text-sm font-medium text-slate-700">
              Why this match
            </span>
            {showDetails ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {showDetails && (
            <div className="mt-3 space-y-2">
              {positiveReasons.map((reason, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <svg
                    className="w-4 h-4 text-green-600 mt-0.5 shrink-0"
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
                  <span className="text-slate-600">{reason.text}</span>
                </div>
              ))}
              {tradeoffReasons.map((reason, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <svg
                    className="w-4 h-4 text-amber-500 mt-0.5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span className="text-slate-600">{reason.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-4 pt-4 border-t border-slate-200">
          <Link href={`/pt/${pt.id}`} className="flex-1">
            <Button className="w-full">View Profile</Button>
          </Link>
          <Button
            variant="outline"
            onClick={onSave}
            className={isSaved ? "text-primary border-primary" : ""}
          >
            {isSaved ? (
              <BookmarkCheck className="w-4 h-4" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
