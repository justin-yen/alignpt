import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            AlignPT
          </h1>
          <p className="mt-2 text-lg text-primary font-medium">
            Find Your Perfect Physical Therapist Match
          </p>
        </div>

        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
          We match you with physical therapists based on your specific injury,
          recovery goals, preferred treatment style, and practical needs like
          location and insurance. Our transparent matching system explains
          exactly why each PT is recommended for you.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left">
          <div className="p-4 bg-white rounded-lg border border-slate-200">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-3">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">
              Personalized Matching
            </h3>
            <p className="text-sm text-slate-600">
              Matched to your injury, goals, and treatment preferences
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-slate-200">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-3">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">
              Transparent Scores
            </h3>
            <p className="text-sm text-slate-600">
              See exactly why each PT is recommended with detailed breakdowns
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-slate-200">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-3">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">
              Real Availability
            </h3>
            <p className="text-sm text-slate-600">
              Match your schedule with PTs who have openings when you need them
            </p>
          </div>
        </div>

        <Link href="/intake">
          <Button size="lg" className="text-lg px-8 py-6">
            Find my PT match
          </Button>
        </Link>

        <p className="mt-4 text-sm text-slate-500">
          Takes about 2 minutes to complete
        </p>
      </div>
    </main>
  );
}
