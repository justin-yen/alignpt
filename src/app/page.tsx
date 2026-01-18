import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-8 overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover blur-md scale-110"
        >
          <source
            src="/Physical_Therapy_Shoulder_Exercise_Video.mp4"
            type="video/mp4"
          />
        </video>
        {/* Soft gradient overlay for calm feel */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/85 to-teal-50/90" />
      </div>

      <div className="relative z-10 max-w-2xl text-center">
        <div className="mb-10">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            AlignPT
          </h1>
          <p className="mt-3 text-lg text-primary font-medium">
            Find Your Perfect Physical Therapist Match
          </p>
        </div>

        <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-xl mx-auto">
          If PT hasn&apos;t worked for you before, it&apos;s often because you had the wrong match. We connect you with physical therapists experienced in your specific injury and treatment style.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12 text-left">
          <div className="p-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-soft transition-all duration-250 hover:shadow-soft-lg hover:bg-white">
            <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-medium text-foreground mb-1.5">
              Personalized Matching
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Matched to your injury, goals, and treatment preferences
            </p>
          </div>

          <div className="p-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-soft transition-all duration-250 hover:shadow-soft-lg hover:bg-white">
            <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-medium text-foreground mb-1.5">
              Transparent Scores
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              See exactly why each PT is recommended with detailed breakdowns
            </p>
          </div>

          <div className="p-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-soft transition-all duration-250 hover:shadow-soft-lg hover:bg-white">
            <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-medium text-foreground mb-1.5">
              Real Availability
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Match your schedule with PTs who have openings when you need them
            </p>
          </div>
        </div>

        <Link href="/intake">
          <Button size="lg" className="text-base px-10 py-6 rounded-xl shadow-soft hover:shadow-soft-lg transition-all duration-250">
            Find my PT match
          </Button>
        </Link>

        <p className="mt-5 text-sm text-muted-foreground">
          Takes about 2 minutes to complete
        </p>
      </div>
    </main>
  );
}
