import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyJwt } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";
import { Target, Calendar, Clock, ChevronRight, CheckSquare } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudentTasksPage() {
  const token = (await cookies()).get("session")?.value;
  if (!token) redirect("/login");

  const payload = await verifyJwt(token);
  if (!payload || !payload.studentId) redirect("/login");

  const student = await db.student.findUnique({
    where: { id: payload.studentId },
    select: { groupId: true }
  });

  if (!student) redirect("/login");

  const tasks = await db.task.findMany({
    where: { 
      status: "PUBLISHED",
      assignments: {
        some: {
          OR: [
            { targetType: "ALL" },
            { targetType: "GROUP", groupId: student.groupId },
            { targetType: "INDIVIDUAL", studentId: payload.studentId }
          ]
        }
      }
    },
    orderBy: { deadline: "asc" },
    include: {
      submissions: {
        where: { studentId: payload.studentId },
        include: { score: true }
      }
    }
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Active Operations"
        description="View your assigned tasks, submit reports, and track assessment progress."
        badge={<StatusBadge status={`${tasks.length} Assigned`} />}
      />

      <div className="grid gap-6">
        {tasks.length === 0 ? (
          <EmptyState
            icon={<Target className="w-5 h-5" />}
            title="No Active Operations"
            description="You have no pending tasks. Enjoy your downtime, operative."
          />
        ) : tasks.map(task => {
          const submission = task.submissions[0];
          const hasSubmitted = !!submission;
          const isGraded = !!submission?.score;
          
          let statusText = "PENDING";
          if (isGraded) statusText = "GRADED";
          else if (hasSubmitted) statusText = "SUBMITTED";

          return (
            <Link key={task.id} href={`/student/tasks/${task.id}`}>
              <Card className="bg-[#0F1B2D] border-[#1E2D4A] shadow-lg hover:border-blue-500/40 hover:shadow-[0_0_20px_rgba(37,99,235,0.1)] transition-all group overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="p-6 md:w-2/3 lg:w-3/4 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-900/20 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-600/20 transition-colors">
                        <CheckSquare className="w-5 h-5 text-blue-400" />
                      </div>
                      <CardTitle className="text-xl text-slate-100 group-hover:text-blue-400 transition-colors">
                        {task.title}
                      </CardTitle>
                    </div>
                    <p className="text-sm text-slate-400 line-clamp-2 ml-13">
                      {task.description}
                    </p>
                  </div>
                  
                  <div className="p-6 bg-[#16243A]/50 md:w-1/3 lg:w-1/4 border-t md:border-t-0 md:border-l border-[#1E2D4A] flex flex-col justify-center gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Status</span>
                      <StatusBadge status={statusText} />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Deadline</span>
                      <div className="flex items-center gap-1.5 text-sm text-slate-300 font-mono">
                        <Clock className="w-4 h-4 text-cyan-500" />
                        {new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center text-xs font-bold text-blue-500 uppercase tracking-widest group-hover:text-blue-400">
                      Open Briefing <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
