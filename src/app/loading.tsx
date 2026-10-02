import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-[#07111F] text-slate-300">
      <Header />
      
      <main className="flex-1 flex flex-col">
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col gap-16">
          {/* Hero Skeleton */}
          <div className="flex flex-col items-center justify-center space-y-8 h-[60vh]">
            <div className="h-24 w-24 bg-[#0F1B2D] animate-pulse rounded-2xl border border-slate-800" />
            <div className="h-12 w-3/4 max-w-2xl bg-[#0F1B2D] animate-pulse rounded-lg" />
            <div className="h-6 w-1/2 max-w-md bg-[#0F1B2D] animate-pulse rounded-lg" />
            <div className="flex gap-4 mt-4">
              <div className="h-12 w-32 bg-[#0F1B2D] animate-pulse rounded-md" />
              <div className="h-12 w-32 bg-[#0F1B2D] animate-pulse rounded-md" />
            </div>
          </div>
          
          {/* Content Skeletons */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-[#0F1B2D] animate-pulse rounded-lg" />
              <div className="h-4 w-full bg-[#0F1B2D] animate-pulse rounded" />
              <div className="h-4 w-full bg-[#0F1B2D] animate-pulse rounded" />
              <div className="h-4 w-5/6 bg-[#0F1B2D] animate-pulse rounded" />
            </div>
            <div className="h-64 bg-[#0F1B2D] animate-pulse rounded-2xl border border-slate-800" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
