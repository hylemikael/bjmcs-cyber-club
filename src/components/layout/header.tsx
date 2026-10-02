"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { title: "Home", href: "/" },
    { title: "About", href: "/#about" },
    { title: "Programs", href: "/#programs" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#0F1B2D] bg-[#07111F]/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-3 font-bold text-white transition-opacity hover:opacity-90"
        >
          <CyberLogo className="h-9 w-9 text-[#2563EB]" />
          <span className="text-xl tracking-tight">{siteConfig.name}</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="text-sm font-medium text-slate-300 transition-colors hover:text-[#06B6D4]"
            >
              {link.title}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-4 md:flex">
          <Link 
            href="/login" 
            className="inline-flex items-center justify-center rounded-lg font-medium px-4 py-2 text-sm text-slate-300 hover:bg-[#0F1B2D] hover:text-white transition-all duration-200"
          >
            Login
          </Link>
          <Link 
            href="/register" 
            className="inline-flex items-center justify-center rounded-lg font-medium px-4 py-2 text-sm bg-[#2563EB] text-white shadow-sm hover:bg-[#3B82F6] transition-all duration-200"
          >
            Apply Now
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="flex p-2 md:hidden text-slate-300 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-[#0F1B2D] bg-[#07111F] px-4 py-6 shadow-lg">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="block text-base font-medium text-slate-300 hover:text-[#06B6D4]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.title}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-3 pt-4 border-t border-[#0F1B2D]">
              <Link 
                href="/login" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="w-full justify-center inline-flex items-center rounded-lg font-medium px-4 py-2 text-sm border border-[#0F1B2D] text-slate-300 hover:bg-[#0F1B2D] hover:text-white transition-all duration-200"
              >
                Login
              </Link>
              <Link 
                href="/register" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="w-full justify-center inline-flex items-center rounded-lg font-medium px-4 py-2 text-sm bg-[#2563EB] text-white shadow-sm hover:bg-[#3B82F6] transition-all duration-200"
              >
                Apply Now
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function CyberLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M20 2L4 9l2 20 14 9 14-9 2-20-16-7z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 9v22M11 16h18"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-white"
      />
      <circle cx="20" cy="20" r="4" fill="currentColor" />
    </svg>
  );
}
