import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReviewList from "./ReviewList";
import { cn } from "@/lib/utils";
import { ArrowLeft, Clock, Target } from "lucide-react";
import { StatusBadge } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function TaskReviewPage({ params }: { params: Promise<{ taskId: string }> }) {
  const taskId = (await params).taskId;

  const task = await db.task.findUnique({
    where: { id: taskId },
    include: {
      assignments: true
    }
  });

  if (!task) notFound();

  // Determine who was assigned
  const assignment = task.assignments[0];
  let studentIds: string[] = [];

  if (assignment) {
    if (assignment.targetType === 'ALL') {
      const all = await db.student.findMany({ where: { isActive: true }, select: { id: true } });
      studentIds = all.map(s => s.id);
    } else if (assignment.targetType === 'GROUP' && assignment.groupId) {
      const groupStudents = await db.student.findMany({ where: { groupId: assignment.groupId, isActive: true }, select: { id: true } });
      studentIds = groupStudents.map(s => s.id);
    } else if (assignment.targetType === 'INDIVIDUAL' && assignment.studentId) {
      studentIds = [assignment.studentId];
    }
  }

  // Get those students + their submissions
  const students = await db.student.findMany({
    where: { id: { in: studentIds } },
    include: {
      application: true,
      submissions: {
        where: { taskId: task.id },
        include: { score: true }
      }
    },
    orderBy: { application: { fullName: "asc" } }
  });

  const reviewData = students.map(s => {
    const sub = s.submissions[0];
    return {
      studentId: s.id,
      name: s.application.fullName,
      submission: sub ? {
        id: sub.id,
        status: sub.status,
        content: sub.content,
        link: sub.link,
        originalFileName: sub.originalFileName,
        fileUrl: sub.fileUrl,
        links: sub.links,
        studentNote: sub.studentNote,
        createdAt: sub.createdAt,
        submissionType: sub.submissionType,
        score: sub.score ? { points: sub.score.points, feedback: sub.score.feedback } : null
      } : null
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/tasks" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-primary transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Missions
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-100 flex items-center gap-3">
              Review Intel: <span className="text-primary">{task.title}</span>
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-slate-400 font-medium">
              <span className="bg-background border border-slate-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-accent" />
                Assigned to {studentIds.length} operatives
              </span>
              <span className="text-slate-600">&middot;</span>
              <span className={cn(
                "inline-flex items-center gap-1.5 bg-background border border-slate-800 px-2 py-0.5 rounded-md",
                new Date(task.deadline) < new Date() ? "text-rose-400 border-rose-500/30" : ""
              )}>
                <Clock className="w-3.5 h-3.5" />
                Deadline: {new Date(task.deadline).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
          <div className="text-left md:text-right shrink-0">
            <StatusBadge status={task.status} />
          </div>
        </div>
      </div>

      <div className="bg-surface border border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <ReviewList reviewData={reviewData} task={task} />
      </div>
    </div>
  );
}
