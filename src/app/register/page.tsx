import { Metadata } from "next";
import { db } from "@/lib/db";
import { RegistrationForm } from "./_components/RegistrationForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Register",
  description: "Apply to join the BJMCS Cyber Club",
};

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  let settings = null;
  try {
    settings = await db.registrationSettings.findUnique({
      where: { id: "default" },
    });
  } catch (error) {
    console.error("Failed to fetch registration settings:", error);
  }

  const isOpen = settings?.isOpen ?? false;
  const isPastDeadline = settings?.deadline ? new Date() > settings?.deadline : false;

  const isClosed = !isOpen || isPastDeadline;

  return (
    <>
      <Header />
      <main className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-background">
        {/* Abstract cyber background pattern */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20 dark:opacity-[0.15]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hex-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M30 0l25.98 15v30L30 60 4.02 45V15z" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary/30" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hex-pattern)" />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-semibold uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Recruitment Open
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl lg:text-6xl mb-6">
            Apply to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{settings?.clubDisplayName || siteConfig.name}</span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto font-medium">
            We are looking for passionate students ready to explore the world of cybersecurity. Join our elite academy of future defenders.
          </p>
        </div>

        {isClosed ? (
          <div className="relative z-10 max-w-2xl mx-auto text-center border border-border-default shadow-2xl bg-surface-elevated/80 backdrop-blur-md rounded-2xl overflow-hidden p-8 sm:p-12">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-warning to-danger" />
            <div className="mx-auto w-20 h-20 mb-6 flex items-center justify-center rounded-2xl bg-background border border-border-default shadow-inner">
              {isPastDeadline ? (
                <svg className="w-10 h-10 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              ) : (
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mb-4">
              {isPastDeadline ? "Registration Deadline Passed" : "Registration Closed"}
            </h2>
            <p className="text-base text-text-secondary mb-8 leading-relaxed max-w-lg mx-auto">
              {isPastDeadline ? 
                "The application deadline for this registration period has passed. We are currently reviewing the submitted applications." : 
                "Registration is currently unavailable. We open applications during specific enrollment windows. Please check back later."}
            </p>
            <div className="inline-flex items-center justify-center px-6 py-2.5 border border-border-default rounded-lg bg-surface text-sm font-semibold text-text-primary uppercase tracking-wide">
              Thank you for your interest
            </div>
          </div>
        ) : (
          <div className="relative z-10 max-w-4xl mx-auto">
            <RegistrationForm />
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
