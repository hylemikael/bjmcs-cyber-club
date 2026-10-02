import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import Link from "next/link";
import RegistrationControl from "./_components/RegistrationControl";
import { Users, Shield, Activity, Clock, ChevronRight, AlertCircle, FileText, ShieldCheck, TerminalSquare, Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [
    totalApps, pendingApps, selectedApps,
    activeStudents, groups, mentors,
    activeTasks, pendingSubmissions,
    recentAuditLogs, recentAnnouncements,
    registrationSettings
  ] = await Promise.all([
    db.application.count(),
    db.application.count({ where: { status: "PENDING" } }),
    db.application.count({ where: { status: "SELECTED" } }),
    
    db.student.count({ where: { isActive: true } }),
    db.group.count(),
    db.mentor.count(),
    
    db.task.count({ where: { status: "PUBLISHED" } }),
    db.submission.count({ where: { status: "SUBMITTED" } }), 
    
    db.auditLog.findMany({ orderBy: { timestamp: "desc" }, take: 10 }),
    db.announcement.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    
    db.registrationSettings.findUnique({ where: { id: "default" } })
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#16243A] pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <TerminalSquare className="w-8 h-8 text-cyan-500" />
            Operations Console
          </h1>
          <p className="text-slate-400 mt-1 font-mono text-sm">System status: <span className="text-emerald-400">ONLINE</span> • Monitoring active components</p>
        </div>
        <RegistrationControl isOpen={registrationSettings?.isOpen ?? false} />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Core Stats */}
        <Card className="relative overflow-hidden border-[#16243A] bg-[#0F1B2D] shadow-sm transition-all duration-200 hover:border-cyan-500/30 group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users className="w-16 h-16 text-blue-400" />
          </div>
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              Active Personnel
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold text-white font-mono">{activeStudents}</div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden border-[#16243A] bg-[#0F1B2D] shadow-sm transition-all duration-200 hover:border-purple-500/30 group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Shield className="w-16 h-16 text-purple-400" />
          </div>
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" />
              Squads & Cmdrs
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold text-white font-mono">
              {groups} <span className="text-xl text-slate-500 font-medium">/ {mentors}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-[#16243A] bg-[#0F1B2D] shadow-sm transition-all duration-200 hover:border-cyan-500/30 group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Activity className="w-16 h-16 text-cyan-400" />
          </div>
          <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Active Operations
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold text-white font-mono">{activeTasks}</div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-[#16243A] bg-[#0F1B2D] shadow-sm transition-all duration-200 hover:border-amber-500/30 group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Clock className="w-16 h-16 text-amber-400" />
          </div>
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Pending Intel
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold text-white font-mono">{pendingSubmissions}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Admissions Overview */}
        <Card className="border-[#16243A] bg-[#0F1B2D] shadow-sm flex flex-col">
          <CardHeader className="border-b border-[#16243A] pb-4 bg-[#111D30]">
            <CardTitle className="flex items-center gap-2 text-lg text-slate-200 font-mono">
              <FileText className="w-5 h-5 text-blue-400" />
              Recruitment Status
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex-1 flex flex-col">
            <div className="space-y-3 flex-1">
              <div className="flex justify-between items-center p-3 rounded bg-[#16243A]/50 border border-[#16243A]">
                <span className="text-slate-400 font-mono text-sm">Total Applications</span>
                <span className="font-bold text-xl text-white font-mono">{totalApps}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded bg-amber-500/10 border border-amber-500/20">
                <span className="text-amber-400/80 font-mono text-sm flex items-center gap-2">
                  <Search className="w-4 h-4" /> Under Review
                </span>
                <span className="font-bold text-xl text-amber-400 font-mono">{pendingApps}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-emerald-400/80 font-mono text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Cleared
                </span>
                <span className="font-bold text-xl text-emerald-400 font-mono">{selectedApps}</span>
              </div>
            </div>
            <div className="mt-6">
              <Link href="/admin/applications" className="inline-flex items-center text-sm font-mono text-cyan-400 hover:text-cyan-300 transition-colors">
                [ Manage Recruitment ] <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Announcements */}
        <Card className="border-[#16243A] bg-[#0F1B2D] shadow-sm flex flex-col">
          <CardHeader className="border-b border-[#16243A] pb-4 bg-[#111D30]">
            <CardTitle className="flex items-center gap-2 text-lg text-slate-200 font-mono">
              <AlertCircle className="w-5 h-5 text-cyan-400" />
              Comms Logs
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex-1 flex flex-col">
            <div className="space-y-3 flex-1">
              {recentAnnouncements.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-slate-500 text-sm font-mono border border-dashed border-[#16243A] rounded">
                  No transmissions found.
                </div>
              ) : recentAnnouncements.map(a => (
                <div key={a.id} className="group p-3 rounded border border-[#16243A] bg-[#111D30]/50 hover:bg-[#16243A] transition-colors relative pl-4">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500/50 rounded-l" />
                  <div className="font-medium text-slate-200">{a.title}</div>
                  <div className="flex items-center gap-2 mt-1 text-xs font-mono text-slate-500">
                    <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                    <span className="text-slate-700">|</span>
                    <span className="uppercase tracking-wider font-medium text-cyan-500/70">{a.status}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-[#16243A]">
              <Link href="/admin/announcements" className="inline-flex items-center text-sm font-mono text-cyan-400 hover:text-cyan-300 transition-colors">
                [ Broadcast System ] <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#16243A] bg-[#0F1B2D] shadow-sm overflow-hidden">
        <CardHeader className="border-b border-[#16243A] bg-[#111D30] py-3">
          <CardTitle className="text-sm font-mono text-slate-300 flex items-center gap-2 uppercase tracking-widest">
            <Activity className="w-4 h-4 text-slate-400" />
            Audit Logs
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#0B1628] text-slate-500 font-mono text-xs uppercase tracking-wider border-b border-[#16243A]">
                <tr>
                  <th className="px-6 py-3 font-medium">Timestamp</th>
                  <th className="px-6 py-3 font-medium">Operator</th>
                  <th className="px-6 py-3 font-medium">Action</th>
                  <th className="px-6 py-3 font-medium">Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#16243A]">
                {recentAuditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-[#16243A]/50 transition-colors">
                    <td className="px-6 py-3 whitespace-nowrap text-slate-400 font-mono text-xs">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap font-medium text-slate-300">
                      {log.actor}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-slate-400 truncate max-w-xs font-mono text-xs">
                      {log.target || "-"}
                    </td>
                  </tr>
                ))}
                {recentAuditLogs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500 font-mono text-sm">
                      No recent activity recorded in system logs.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
