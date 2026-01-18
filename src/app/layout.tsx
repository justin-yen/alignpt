import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AlignPT - Find Your Perfect Physical Therapist Match",
  description:
    "AlignPT matches you with the ideal physical therapist based on your injury, goals, preferences, and logistics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
          {children}
        </div>
      </body>
    </html>
  );
}
