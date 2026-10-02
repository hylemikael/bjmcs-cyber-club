import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { verifyJwt } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import Link from "next/link";
import { ArrowLeft, Clock, FileText, CheckCircle2 } from "lucide-react";
import SubmissionForm from "./SubmissionForm";

export const dynamic = "force-dynamic";

export default async function StudentTaskDetailPage({ params }: { params: Promise<{ taskId: string }> }) {
  const taskId = (await params).taskId;
  const token = (await cookies()).get("session")?.value;
  if (!token) redirect("/login");

  const payload = await verifyJwt(token);
  if (!payload || !payload.studentId) redirect("/login");

  const student = await db.student.findUnique({
    where: { id: payload.studentId },
    select: { groupId: true }
  });

  if (!student) redirect("/login");

  const task = await db.task.findFirst({
    where: { 
      id: taskId, 
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
    include: {
      submissions: {
        where: { studentId: payload.studentId },
        include: { score: true }
      }
    }
  });

  if (!task) notFound();

  const submission = task.submissions[0];
  const hasSubmitted = !!submission;
  const isGraded = !!submission?.score;
  
  let statusText = "PENDING";
  if (isGraded) statusText = "GRADED";
  else if (hasSubmitted) statusText = "SUBMITTED";

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <Link href="/student/tasks" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Operations
      </Link>

      <PageHeader
        title={task.title}
        description="Task briefing and submission interface."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-[#0F1B2D] border-[#1E2D4A] shadow-xl">
            <CardHeader className="border-b border-[#1E2D4A] bg-[#16243A]/50 pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <FileText className="w-5 h-5 text-blue-500" />
                Briefing Document
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose prose-invert prose-blue max-w-none text-slate-300">
                <p className="whitespace-pre-wrap leading-relaxed">{task.description}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0F1B2D] border-[#1E2D4A] shadow-xl">
            <CardHeader className="border-b border-[#1E2D4A] bg-[#16243A]/50 pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <CheckCircle2 className="w-5 h-5 text-cyan-500" />
                Submission Terminal
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {hasSubmitted ? (
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-blue-900/10 border border-blue-500/20">
                    <h3 className="text-sm font-medium text-slate-300 mb-2">Your Submitted Report:</h3>
                    <p className="text-slate-400 whitespace-pre-wrap">{submission.content}</p>
                  </div>
                  
                  {isGraded && (
                    <div className="p-5 rounded-xl bg-gradient-to-br from-[#16243A] to-[#0F1B2D] border border-cyan-500/30 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-2xl rounded-full"></div>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-4">Evaluation Results</h3>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-slate-300">Score</span>
                        <span className="text-3xl font-black text-white font-mono">{submission.score?.points}<span className="text-sm text-slate-500 font-medium ml-1">pts</span></span>
                      </div>
                      {submission.score?.feedback && (
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Instructor Feedback</span>
                          <p className="text-slate-300 text-sm italic border-l-2 border-cyan-500/50 pl-3">{submission.score.feedback}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <SubmissionForm taskId={task.id} existingSubmission={task.submissions[0]} deadline={task.deadline} allowLate={task.allowLateSubmissions} />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-[#0F1B2D] border-[#1E2D4A] shadow-xl">
            <CardContent className="p-6 space-y-6">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Status</span>
                <StatusBadge status={statusText} />
              </div>
              
              <div className="pt-4 border-t border-[#1E2D4A]">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Deadline</span>
                <div className="flex items-center gap-2 text-slate-200 font-mono bg-[#16243A] p-3 rounded-lg border border-[#2A3F5F]">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  {new Date(task.deadline).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                </div>
              </div>

              <div className="pt-4 border-t border-[#1E2D4A]">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Points Potential</span>
                <div className="text-3xl font-black text-white font-mono">
                  <span className="text-sm text-slate-500 ml-1 font-medium">pts</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
