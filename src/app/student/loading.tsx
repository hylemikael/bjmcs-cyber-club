import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function StudentLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-[#07111F]">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
          <LoadingSpinner size="lg" className="mx-auto text-blue-500 relative z-10" />
        </div>
        <p className="text-sm font-medium text-cyan-400/80 animate-pulse tracking-widest uppercase">
          Establishing Secure Connection...
        </p>
      </div>
    </div>
  );
}
