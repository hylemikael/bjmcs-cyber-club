import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-[#07111F] text-slate-300 selection:bg-[#2563EB]/30">
      <Header />
      
      <main className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 z-0 opacity-10">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-404" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#06B6D4" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-404)" />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-[#0F1B2D]/80 border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.15)] backdrop-blur-sm">
            <ShieldAlert className="h-12 w-12 text-red-500" />
          </div>

          <h1 className="text-7xl font-extrabold tracking-tight text-white mb-4 drop-shadow-lg font-mono">
            404
          </h1>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl mb-6">
            Sector Not Found
          </h2>

          <p className="mt-2 text-lg text-slate-400 mb-10 max-w-lg mx-auto">
            The requested coordinate could not be located within our network infrastructure. Return to base to continue navigation.
          </p>

          <Link
            href="/"
            className="inline-block rounded-md bg-[#2563EB] px-8 py-3 text-base font-semibold text-white hover:bg-[#3B82F6] shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-200"
          >
            Return to Homepage
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
