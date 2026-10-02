import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" className="mx-auto text-cyan-500" />
        <p className="text-sm font-mono text-cyan-400/70 animate-pulse tracking-widest uppercase">
          Initializing secure connection...
        </p>
      </div>
    </div>
  );
}
