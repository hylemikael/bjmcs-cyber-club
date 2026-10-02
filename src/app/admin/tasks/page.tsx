import { db } from "@/lib/db";
import { Card, CardContent, PageHeader, EmptyState, Button, StatusBadge } from "@/components/ui";
import CreateTaskModal from "./_components/CreateTaskModal";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Target, Clock, Users, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminTasksPage() {
  const tasks = await db.task.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { submissions: true } }, assignments: true }
  });

  const groups = await db.group.findMany({ orderBy: { name: "asc" } });
  const students = await db.student.findMany({ where: { isActive: true }, include: { application: true }, orderBy: { application: { fullName: "asc" } } });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <PageHeader 
          title="Mission Control (Tasks)" 
          description="Deploy assignments and monitor operative submissions."
          badge={`${tasks.length} Operations`}
        />
        <CreateTaskModal groups={groups} students={students} />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tasks.length === 0 ? (
          <div className="p-12">
            <EmptyState 
              icon={<Target className="w-5 h-5" />}
              title="No missions deployed"
              description="Create a new task to assign to students."
            />
          </div>
        ) : tasks.map(task => {
          const isOverdue = new Date(task.deadline) < new Date();
          
          return (
            <Card key={task.id} className="border-slate-800 bg-surface shadow-sm hover:border-primary/50 transition-colors duration-200">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                        {task.title}
                      </h3>
                      <div className="flex gap-2">
                        <StatusBadge status={task.status} />
                        {isOverdue && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            Closed
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 max-w-3xl line-clamp-2">{task.description}</p>
                    
                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-400">
                      <span className="inline-flex items-center gap-1.5 bg-background px-2 py-1 rounded border border-slate-800">
                        <Users className="w-3.5 h-3.5 text-slate-500" />
                        Target: {task.assignments[0]?.targetType || "UNASSIGNED"}
                      </span>
                      <span className={cn(
                        "inline-flex items-center gap-1.5 bg-background px-2 py-1 rounded border border-slate-800",
                        isOverdue ? "text-rose-400 border-rose-500/30 bg-rose-500/10" : "text-slate-400"
                      )}>
                        <Clock className="w-3.5 h-3.5" />
                        Deadline: {new Date(task.deadline).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="inline-flex items-center gap-1.5 bg-background px-2 py-1 rounded border border-slate-800">
                        Late Auth: {task.allowLateSubmissions ? <span className="text-emerald-400">Granted</span> : <span className="text-rose-400">Denied</span>}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 shrink-0">
                    <div className="bg-background px-4 py-2.5 rounded-xl border border-slate-800 text-center min-w-[120px] relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-8 h-8 bg-primary/10 rounded-bl-full"></div>
                      <div className="text-3xl font-bold tracking-tight text-primary leading-none mb-1 font-mono">{task._count.submissions}</div>
                      <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Submissions</div>
                    </div>
                    <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                      <Link href={`/admin/tasks/${task.id}`}>
                        Review Intel <ArrowRight className="ml-1.5 w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
