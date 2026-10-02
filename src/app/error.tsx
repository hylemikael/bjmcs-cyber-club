"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AlertTriangle } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen bg-[#07111F] text-slate-300 selection:bg-[#2563EB]/30">
      <Header />
      
      <main className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 z-0 opacity-10">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-error" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ef4444" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-error)" />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-[#0F1B2D]/80 border border-red-500/50 shadow-[0_0_40px_rgba(239,68,68,0.2)] backdrop-blur-sm">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl mb-4">
            System Fault Detected
          </h1>

          <p className="mt-4 text-lg text-slate-400 mb-10 max-w-lg mx-auto">
            An unexpected vulnerability caused this operation to fail. Our defensive systems have logged the incident.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={() => reset()}
              className="inline-block rounded-md bg-[#0F1B2D] border border-[#2563EB]/50 px-8 py-3 text-base font-semibold text-white hover:bg-[#2563EB]/20 transition-all duration-200 w-full sm:w-auto"
            >
              Reinitialize Sequence
            </button>
            <Link
              href="/"
              className="inline-block rounded-md bg-[#2563EB] px-8 py-3 text-base font-semibold text-white hover:bg-[#3B82F6] shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all duration-200 w-full sm:w-auto"
            >
              Return to Safe Zone
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
