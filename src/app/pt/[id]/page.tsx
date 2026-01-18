"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, MapPin, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { mockPTs } from "@/data/mockPTs";
import {
  PTProfile,
  PatientInput,
  COACHING_STYLE_LABELS,
  SESSION_STYLE_LABELS,
  VISIT_TYPE_LABELS,
  INSURANCE_LABELS,
} from "@/types";

export default function PTProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [pt, setPt] = useState<PTProfile | null>(null);
  const [patientInsurance, setPatientInsurance] = useState<string | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  useEffect(() => {
    const foundPT = mockPTs.find((p) => p.id === id);
    if (foundPT) {
      setPt(foundPT);
    } else {
      router.push("/results");
    }

    // Get patient insurance from session storage
    const stored = sessionStorage.getItem("patientInput");
    if (stored) {
      try {
        const input = JSON.parse(stored) as PatientInput;
        setPatientInsurance(input.insurance);
      } catch {
        // Ignore
      }
    }
  }, [id, router]);

  if (!pt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  const isCovered =
    patientInsurance && pt.insuranceAccepted.includes(patientInsurance as never);

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/results"
            className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Results
          </Link>
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-2xl shrink-0">
              {pt.photoPlaceholder}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900">{pt.name}</h1>
              <p className="text-lg text-slate-600">{pt.credentials}</p>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {pt.clinicName} • {pt.neighborhood}
                </span>
              </div>

              {/* Specialties */}
              <div className="flex flex-wrap gap-2 mt-4">
                {pt.specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-2">
              <Button onClick={() => setShowBooking(true)}>
                Simulate Booking
              </Button>
              <p className="text-sm text-slate-500 text-center">
                ${pt.sessionRate}/session
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Bio */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">{pt.bio}</p>
              </CardContent>
            </Card>

            {/* Approach */}
            <Card>
              <CardHeader>
                <CardTitle>My Approach</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {pt.approach.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <svg
                        className="w-5 h-5 text-primary mt-0.5 shrink-0"
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
                      <span className="text-slate-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Conditions Treated */}
            <Card>
              <CardHeader>
                <CardTitle>Conditions Treated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {pt.conditionsTreated.map((condition) => (
                    <Badge key={condition} variant="outline">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Photos Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center text-slate-400"
                    >
                      <span className="text-sm">Photo {i}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pt.reviews.map((review, i) => (
                    <div
                      key={i}
                      className={i !== pt.reviews.length - 1 ? "pb-4 border-b border-slate-200" : ""}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, j) => (
                            <Star
                              key={j}
                              className={`w-4 h-4 ${
                                j < review.rating
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-slate-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-slate-900">
                          {review.author}
                        </span>
                        <span className="text-sm text-slate-500">
                          {review.date}
                        </span>
                      </div>
                      <p className="text-slate-600">{review.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500">Coaching Style</p>
                  <p className="font-medium">
                    {COACHING_STYLE_LABELS[pt.coachingStyle]}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Session Style</p>
                  <p className="font-medium">
                    {SESSION_STYLE_LABELS[pt.sessionStyle]}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Visit Types</p>
                  <p className="font-medium">
                    {pt.visitTypes.map((v) => VISIT_TYPE_LABELS[v]).join(", ")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Insurance Accepted</p>
                  <p className="font-medium">
                    {pt.insuranceAccepted
                      .map((i) => INSURANCE_LABELS[i])
                      .join(", ")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Session Rate</p>
                  <p className="font-medium">${pt.sessionRate}</p>
                </div>
              </CardContent>
            </Card>

            {/* Next Available */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Next Available
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {pt.nextAvailableSlots.slice(0, 3).map((slot, i) => (
                    <li
                      key={i}
                      className="text-sm text-slate-600 flex items-center gap-2"
                    >
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      {slot}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full mt-4"
                  onClick={() => setShowBooking(true)}
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Booking Modal */}
        <Dialog open={showBooking} onOpenChange={setShowBooking}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Book with {pt.name}</DialogTitle>
              <DialogDescription>
                Select an available time slot to schedule your appointment.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Insurance Notice */}
              <div
                className={`p-3 rounded-md ${
                  isCovered
                    ? "bg-green-50 text-green-800"
                    : "bg-amber-50 text-amber-800"
                }`}
              >
                {isCovered ? (
                  <p className="text-sm">
                    Your {INSURANCE_LABELS[patientInsurance as keyof typeof INSURANCE_LABELS]} insurance is accepted.
                    Check with your plan for coverage details.
                  </p>
                ) : (
                  <p className="text-sm">
                    <strong>Self-Pay Rate:</strong> ${pt.sessionRate} per session
                    {patientInsurance && patientInsurance !== "self-pay" && (
                      <>
                        <br />
                        <span className="text-amber-700">
                          Note: {INSURANCE_LABELS[patientInsurance as keyof typeof INSURANCE_LABELS]} is not accepted by this PT.
                        </span>
                      </>
                    )}
                  </p>
                )}
              </div>

              {/* Available Slots */}
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">
                  Available Slots
                </p>
                <div className="space-y-2">
                  {pt.nextAvailableSlots.map((slot, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedSlot(slot)}
                      className={`w-full p-3 rounded-md border text-left transition-colors ${
                        selectedSlot === slot
                          ? "border-primary bg-primary/5"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-sm font-medium">{slot}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Book Button */}
              <Button
                className="w-full"
                disabled={!selectedSlot}
                onClick={() => {
                  alert(
                    `Booking simulated for ${selectedSlot} with ${pt.name}!`
                  );
                  setShowBooking(false);
                  setSelectedSlot(null);
                }}
              >
                {selectedSlot
                  ? `Book for ${selectedSlot}`
                  : "Select a time slot"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
