import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyJwt } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Calendar, UserCheck, Clock, UserX, Activity } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudentAttendancePage() {
  const token = (await cookies()).get("session")?.value;
  if (!token) redirect("/student/login");

  const payload = await verifyJwt(token);
  if (!payload || !payload.studentId) redirect("/student/login");

  const attendances = await db.attendance.findMany({
    where: { studentId: payload.studentId },
    include: { session: true },
    orderBy: { session: { date: "desc" } }
  });

  const total = attendances.length;
  const present = attendances.filter(a => a.status === "PRESENT").length;
  const late = attendances.filter(a => a.status === "LATE").length;
  const absent = attendances.filter(a => a.status === "ABSENT").length;

  const percentage = total > 0 ? Math.round(((present + late) / total) * 100) : 0; 

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Attendance Record"
        description="Track your session presence and academy engagement metrics."
      />
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard 
          label="Total Sessions" 
          value={total.toString()} 
          icon={<Calendar className="w-5 h-5" />} 
          className="bg-[#0F1B2D] border-[#1E2D4A]"
        />
        <StatCard 
          label="Present" 
          value={present.toString()} 
          icon={<UserCheck className="w-5 h-5" />} 
          className="bg-[#0F1B2D] border-[#1E2D4A]"
        />
        <StatCard 
          label="Late" 
          value={late.toString()} 
          icon={<Clock className="w-5 h-5" />} 
          className="bg-[#0F1B2D] border-[#1E2D4A]"
        />
        <StatCard 
          label="Absent" 
          value={absent.toString()} 
          icon={<UserX className="w-5 h-5" />} 
          className="bg-[#0F1B2D] border-[#1E2D4A]"
        />
        <StatCard 
          label="Score %" 
          value={`${percentage}%`} 
          icon={<Activity className="w-5 h-5" />} 
          trend={`${percentage}% Engagement`}
          className="bg-[#0F1B2D] border-[#1E2D4A]"
        />
      </div>

      <Card className="bg-[#0F1B2D] border-[#1E2D4A] shadow-xl overflow-hidden">
        <div className="border-b border-[#1E2D4A] bg-[#16243A]/80 p-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-100">
            <Calendar className="w-5 h-5 text-blue-500" />
            Session Log
          </h2>
        </div>
        <CardContent className="p-0 overflow-x-auto">
          {attendances.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={<Calendar className="w-5 h-5" />}
                title="No records found"
                description="Attendance data will appear here once logged by instructors."
              />
            </div>
          ) : (
            <table className="w-full text-left text-sm min-w-[600px]">
              <thead className="bg-[#16243A] border-b border-[#1E2D4A]">
                <tr>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-slate-400">Date</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-slate-400">Session</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-slate-400">Status</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-slate-400">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2D4A]/50 bg-[#0F1B2D]">
                {attendances.map(record => (
                  <tr key={record.id} className="hover:bg-[#16243A]/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-300 font-medium">
                      {new Date(record.session.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-200">{record.session.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={record.status} />
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm max-w-[200px] truncate" title={record.notes || ""}>
                      {record.notes || <span className="opacity-30">-</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
