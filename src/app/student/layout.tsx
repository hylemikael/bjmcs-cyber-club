"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutAction } from "@/app/login/actions";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Menu, X, LogOut, Shield, LayoutDashboard, Calendar, Bell, BookOpen, Award, FileText, User, CheckSquare } from "lucide-react";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { title: "Dashboard", href: "/student", icon: LayoutDashboard },
    { title: "Profile", href: "/student/profile", icon: User },
    { title: "Announcements", href: "/student/announcements", icon: Bell },
    { title: "Tasks", href: "/student/tasks", icon: CheckSquare },
    { title: "Attendance", href: "/student/attendance", icon: Calendar },
    { title: "Results", href: "/student/results", icon: FileText },
    { title: "Materials", href: "/student/materials", icon: BookOpen },
    { title: "Certificate", href: "/student/certificate", icon: Award },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#07111F] text-slate-100 selection:bg-blue-500/30">
      <header className="bg-[#0F1B2D]/90 backdrop-blur-md border-b border-[#1E2D4A] shadow-sm sticky top-0 z-30 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/student" className="flex items-center gap-3 font-bold text-lg tracking-tight group">
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20 group-hover:border-blue-500/40 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.15)]">
              <Shield className="h-5 w-5 text-blue-500" />
            </div>
            <span className="text-white">
              BJMCS <span className="text-cyan-400">Cyber</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-1 overflow-x-auto">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/student" && pathname.startsWith(link.href));
              const Icon = link.icon;
              return (
                <Link 
                  key={link.title}
                  href={link.href}
                  prefetch={false}
                  className={cn(
                    "px-3 py-2 flex items-center gap-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap",
                    isActive 
                      ? "bg-blue-600/10 text-cyan-400 border border-blue-500/20" 
                      : "text-slate-400 hover:bg-[#16243A] hover:text-slate-200 border border-transparent"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.title}
                </Link>
              );
            })}
            <div className="pl-4 ml-2 border-l border-[#1E2D4A]">
              <form action={logoutAction}>
                <Button type="submit" variant="ghost" size="sm" className="text-slate-400 hover:text-red-400 hover:bg-red-500/10">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </form>
            </div>
          </nav>

          {/* Mobile Toggle */}
          <button
            className="flex p-2 lg:hidden text-slate-300 rounded-md hover:bg-[#16243A]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#1E2D4A] bg-[#0F1B2D] px-4 py-4 shadow-xl absolute w-full left-0 top-16">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/student" && pathname.startsWith(link.href));
                const Icon = link.icon;
                return (
                  <Link
                    key={link.title}
                    href={link.href}
                    prefetch={false}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors",
                      isActive
                        ? "bg-blue-600/10 text-cyan-400 border border-blue-500/20"
                        : "text-slate-400 hover:bg-[#16243A] hover:text-slate-200 border border-transparent"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {link.title}
                  </Link>
                );
              })}
              <div className="mt-4 pt-4 border-t border-[#1E2D4A]">
                <form action={logoutAction}>
                  <Button type="submit" variant="outline" className="w-full justify-center bg-transparent border-[#1E2D4A] text-slate-300 hover:bg-[#16243A]">
                    <LogOut className="h-5 w-5 mr-3" />
                    Sign Out
                  </Button>
                </form>
              </div>
            </nav>
          </div>
        )}
      </header>
      
      <main className="flex-1 max-w-7xl w-full mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
