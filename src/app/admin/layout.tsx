"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutAction } from "@/app/login/actions";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileText, 
  CheckSquare, 
  ListTodo, 
  BookOpen, 
  Users, 
  UserPlus, 
  Megaphone,
  Menu,
  X,
  LogOut,
  ShieldAlert
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Applications", href: "/admin/applications", icon: FileText },
    { name: "Attendance", href: "/admin/attendance", icon: CheckSquare },
    { name: "Tasks & Submissions", href: "/admin/tasks", icon: ListTodo },
    { name: "Learning Materials", href: "/admin/materials", icon: BookOpen },
    { name: "Students & Cohort", href: "/admin/students", icon: Users },
    { name: "Groups & Mentors", href: "/admin/groups", icon: UserPlus },
    { name: "Announcements", href: "/admin/announcements", icon: Megaphone },
  ];

  return (
    <div className="min-h-screen bg-[#07111F] text-slate-200 flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0B1628] border-b border-[#16243A] text-white z-20 shadow-md">
        <div className="font-bold text-lg flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-cyan-500" />
          <span>Admin Portal</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 text-slate-300 hover:text-white transition-colors">
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-10 w-72 bg-[#0B1628] flex flex-col transition-transform duration-300 ease-in-out md:relative md:w-64 md:translate-x-0 border-r border-[#16243A] shadow-xl",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 hidden md:flex items-center gap-3 border-b border-[#16243A]">
          <div className="p-2 bg-blue-600/20 rounded-lg border border-blue-500/30">
            <ShieldAlert className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-white uppercase">Ops Center</h2>
            <p className="text-[10px] text-cyan-500 font-mono tracking-widest uppercase">BJMCS Cyber Club</p>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1.5 mt-16 md:mt-0">
          <div className="px-3 mb-2 text-xs font-mono text-slate-500 uppercase tracking-wider">Navigation</div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                prefetch={false}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 group relative",
                  isActive 
                    ? "bg-[#16243A] text-white" 
                    : "text-slate-400 hover:bg-[#16243A]/50 hover:text-slate-200"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-cyan-500 rounded-r-full" />
                )}
                <item.icon className={cn("h-4 w-4 transition-colors", isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-400")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#16243A] bg-[#0B1628]">
          <form action={logoutAction}>
            <Button 
              type="submit" 
              variant="ghost" 
              className="w-full text-slate-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 border border-transparent flex items-center gap-3 justify-start px-3 transition-colors"
            >
              <LogOut className="h-4 w-4 text-red-400" />
              Sign Out Session
            </Button>
          </form>
        </div>
      </aside>
      
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-[#07111F]/80 backdrop-blur-sm z-0 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Admin Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto relative z-0 h-[calc(100vh-60px)] md:h-screen scrollbar-thin scrollbar-thumb-[#16243A] scrollbar-track-transparent">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
