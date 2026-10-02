import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import ActivationForm from "./ActivationForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import Link from "next/link";

export const dynamic = "force-dynamic";

function ShieldAlertIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export default async function ActivatePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const token = (await searchParams).token;

  const PageWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Tech Pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="activate-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#22d3ee" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#activate-grid)" />
        </svg>
        <div className="absolute inset-0 bg-gradient-to-tr from-background to-transparent" />
      </div>
      
      <div className="w-full max-w-md relative z-10 space-y-8">
        <div className="flex justify-center">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-elevated border border-border-default group-hover:bg-primary/10 transition-all duration-300">
              <ShieldCheckIcon className="h-6 w-6 text-primary" />
            </div>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );

  if (!token) {
    return (
      <PageWrapper>
        <Card className="border-border-default bg-surface shadow-2xl">
          <CardContent className="pt-10 pb-8 text-center">
            <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-danger/10">
              <ShieldAlertIcon className="w-8 h-8 text-danger" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">Invalid Session</h1>
            <p className="text-text-secondary">No activation token was provided in the URL.</p>
          </CardContent>
        </Card>
      </PageWrapper>
    );
  }

  const student = await db.student.findUnique({
    where: { activationToken: token },
    include: { application: true }
  });

  if (!student) {
    return (
      <PageWrapper>
        <Card className="border-border-default bg-surface shadow-2xl">
          <CardContent className="pt-10 pb-8 text-center">
            <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-danger/10">
              <ShieldAlertIcon className="w-8 h-8 text-danger" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">Invalid Token</h1>
            <p className="text-text-secondary">This activation link is invalid or has already been used.</p>
            <div className="mt-8">
              <Link href="/login" className="text-sm font-semibold text-primary hover:text-accent transition-colors">
                Return to Login &rarr;
              </Link>
            </div>
          </CardContent>
        </Card>
      </PageWrapper>
    );
  }

  if (student.activationExpires && student.activationExpires < new Date()) {
    return (
      <PageWrapper>
        <Card className="border-border-default bg-surface shadow-2xl">
          <CardContent className="pt-10 pb-8 text-center">
            <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-warning/10">
              <svg className="w-8 h-8 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">Link Expired</h1>
            <p className="text-text-secondary">Your activation link has expired. Please contact the administrator.</p>
          </CardContent>
        </Card>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Card className="border-border-default bg-surface shadow-2xl overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-primary to-accent" />
        <CardContent className="p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-text-primary">Activate Account</h1>
            <p className="text-sm text-text-secondary mt-2">
              Welcome, <span className="text-text-primary font-medium">{student.application.fullName}</span>! Set your secure password to initialize your academy portal access.
            </p>
          </div>
          
          <ActivationForm token={token} />
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
