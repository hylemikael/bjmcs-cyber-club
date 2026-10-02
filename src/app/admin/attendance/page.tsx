import { db } from "@/lib/db";
import { Card, CardContent, PageHeader, EmptyState, Button, StatusBadge, ProgressBar } from "@/components/ui";
import Link from "next/link";
import CreateSessionModal from "./_components/CreateSessionModal";
import { cn } from "@/lib/utils";
import { CalendarDays, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminAttendancePage() {
  const sessions = await db.attendanceSession.findMany({
    orderBy: { date: "desc" },
    include: {
      group: true,
      _count: {
        select: { records: true }
      }
    }
  });

  const activeStudentsCount = await db.student.count({ where: { isActive: true } });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <PageHeader 
          title="Attendance Logs" 
          description="Manage daily operative attendance and history."
          badge={`${sessions.length} Sessions`}
        />
        <CreateSessionModal />
      </div>

      <Card className="border-slate-800 bg-surface shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-background border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Group</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Progress</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {sessions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12">
                      <EmptyState 
                        icon={<CalendarDays className="w-5 h-5" />}
                        title="No attendance sessions"
                        description="Create a new session to track student presence."
                      />
                    </td>
                  </tr>
                ) : sessions.map(s => {
                  const percentage = activeStudentsCount > 0 
                    ? Math.round((s._count.records / activeStudentsCount) * 100) 
                    : 0;

                  return (
                    <tr key={s.id} className="hover:bg-slate-800/50 transition-colors duration-200">
                      <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                        {new Date(s.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-100">{s.title}</td>
                      <td className="px-6 py-4 text-slate-300">
                        {s.group ? (
                          <span className="inline-flex items-center px-2 py-1 rounded border border-slate-700 bg-background text-xs font-medium text-slate-300">
                            {s.group.name}
                          </span>
                        ) : (
                          <span className="text-slate-500 italic">All Operatives</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={s.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <ProgressBar value={percentage} className="w-24" />
                          <span className="text-xs font-medium text-slate-400 w-8 font-mono">{s._count.records}/{activeStudentsCount}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
                          <Link href={`/admin/attendance/${s.id}`}>
                            {s.status === 'OPEN' ? 'Take Attendance' : 'View Logs'} <ArrowRight className="ml-1 w-4 h-4" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
