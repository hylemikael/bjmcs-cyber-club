"use client";

import { useState, useTransition } from "react";
import { activateAccount } from "./actions";
import { Button, Input, Alert } from "@/components/ui";

export default function ActivationForm({ token }: { token: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirm = formData.get("confirmPassword") as string;

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    startTransition(async () => {
      const result = await activateAccount(token, password);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <Alert variant="error" title="Activation Error">
            {error}
          </Alert>
        </div>
      )}
      
      <div className="space-y-4">
        <Input
          label="New Secure Password"
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="••••••••"
        />
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          placeholder="••••••••"
        />
      </div>
      
      <div className="pt-2">
        <Button 
          type="submit" 
          variant="primary"
          className="w-full relative overflow-hidden group" 
          disabled={isPending}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isPending ? (
              <>
                <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Encrypting & Activating...
              </>
            ) : (
              <>
                Activate Account
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
        </Button>
      </div>
    </form>
  );
}
