import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, ProgressBar, StatusBadge } from "@/components/ui";
import Link from "next/link";
import { ArrowLeft, User, Award, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminStudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const studentId = (await params).id;

  const student = await db.student.findUnique({
    where: { id: studentId },
    include: {
      application: true,
      group: { include: { mentor: true } },
      academicRecord: true,
      attendances: { include: { session: true } },
      submissions: { include: { task: true, score: true } }
    }
  });

  if (!student) notFound();

  // Progress calculations
  const totalAttendances = student.attendances.length;
  const presentOrLate = student.attendances.filter(a => a.status === "PRESENT" || a.status === "LATE").length;
  const attendancePercentage = totalAttendances > 0 ? Math.round((presentOrLate / totalAttendances) * 100) : 0;

  const totalTasks = await db.task.count({ where: { status: "PUBLISHED" } });
  const submissionsCount = student.submissions.length;
  const gradedSubmissions = student.submissions.filter(s => s.status === "GRADED");
  const totalScore = gradedSubmissions.reduce((acc, curr) => acc + (curr.score?.points || 0), 0);
  const maxPossibleScoreSoFar = gradedSubmissions.length * 10; // assuming 10 pts per task
  const gradePercentage = maxPossibleScoreSoFar > 0 ? Math.round((totalScore / maxPossibleScoreSoFar) * 100) : 0;

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/students" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-primary transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Students
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-100 flex items-center gap-3">
              {student.application.fullName}
              {student.isActive && <ShieldCheck className="w-6 h-6 text-primary" />}
            </h1>
            <p className="text-sm text-slate-400 mt-1">{student.email}</p>
          </div>
          <div className="text-left md:text-right">
            <span className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase inline-block",
              student.isActive 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                : "bg-slate-800 text-slate-400 border border-slate-700"
            )}>
              {student.isActive ? "ACTIVE OPERATIVE" : "INACTIVE"}
            </span>
            <p className="text-xs text-slate-500 mt-2 font-mono bg-background px-2 py-1 rounded border border-slate-800 inline-block">App Ref: {student.application.reference}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-slate-800 bg-surface shadow-sm">
          <CardHeader className="pb-4 border-b border-slate-800/50">
            <CardTitle className="text-lg flex items-center gap-2"><User className="w-5 h-5 text-primary" /> Profile Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-sm pt-6">
            <div>
              <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-semibold mb-1">Squad / Group</span>
              <span className="font-medium text-slate-100">{student.group?.name || "Unassigned"}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-semibold mb-1">Mentor</span>
              <span className="font-medium text-slate-100">{student.group?.mentor?.name || "None"}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-semibold mb-1">Clearance Level (Certificate)</span>
              <span className="inline-flex px-2 py-0.5 rounded border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-medium">
                {student.academicRecord?.certificateState || "RESULTS_NOT_FINAL"}
              </span>
            </div>
            <div className="border-t border-slate-800 pt-6">
              <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-semibold mb-2">Attendance Sync</span>
              <div className="flex items-center gap-3">
                <ProgressBar value={attendancePercentage} className="flex-1" />
                <span className="text-xs font-semibold text-slate-300 w-9 text-right">{attendancePercentage}%</span>
              </div>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-semibold mb-2">Mission Progress (Tasks)</span>
              <div className="flex items-center gap-3">
                <ProgressBar value={totalTasks > 0 ? (submissionsCount/totalTasks)*100 : 0} className="flex-1" />
                <span className="text-xs font-semibold text-slate-300 w-16 text-right">{submissionsCount}/{totalTasks}</span>
              </div>
            </div>
            <div className="bg-background rounded-lg p-4 mt-4 border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-20"><Award className="w-12 h-12 text-primary" /></div>
              <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-semibold mb-1 relative z-10">Performance Rating</span>
              <div className="flex items-baseline gap-2 relative z-10">
                <span className={cn(
                  "font-bold text-3xl tracking-tight",
                  gradePercentage >= 80 ? "text-emerald-400" :
                  gradePercentage >= 60 ? "text-amber-400" : "text-rose-400"
                )}>{gradePercentage}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 flex flex-col gap-6">
          <Card className="border-slate-800 bg-surface shadow-sm">
            <CardHeader className="pb-4 border-b border-slate-800/50">
              <CardTitle className="text-lg">Dossier Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-sm pt-6">
              <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                <div className="bg-background p-3 rounded border border-slate-800/50"><span className="text-slate-500 block text-xs mb-1 uppercase tracking-wider font-semibold">Gender</span><span className="font-medium text-slate-100">{student.application.gender}</span></div>
                <div className="bg-background p-3 rounded border border-slate-800/50"><span className="text-slate-500 block text-xs mb-1 uppercase tracking-wider font-semibold">Age</span><span className="font-medium text-slate-100">{student.application.age}</span></div>
                <div className="bg-background p-3 rounded border border-slate-800/50"><span className="text-slate-500 block text-xs mb-1 uppercase tracking-wider font-semibold">Phone</span><span className="font-medium text-slate-100 font-mono">{student.application.phone}</span></div>
                <div className="bg-background p-3 rounded border border-slate-800/50"><span className="text-slate-500 block text-xs mb-1 uppercase tracking-wider font-semibold">School</span><span className="font-medium text-slate-100">Grade {student.application.grade} Section {student.application.section}</span></div>
              </div>
              <div className="border-t border-slate-800 pt-6">
                <h4 className="font-semibold text-slate-100 mb-3 text-sm flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent"></span> Technical Background</h4>
                <div className="space-y-3 bg-background p-4 rounded border border-slate-800/50">
                  <div><span className="text-slate-500 block text-xs mb-1 uppercase tracking-wider font-semibold">Programming Experience</span><span className="font-medium text-slate-100">{student.application.programmingExp}</span></div>
                  <div className="pt-2"><span className="text-slate-500 block text-xs mb-1 uppercase tracking-wider font-semibold">Languages</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {student.application.programmingLangs.map(l => <span key={l} className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-xs font-mono">{l}</span>) || "None"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-slate-800 pt-6">
                <h4 className="font-semibold text-slate-100 mb-3 text-sm flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Motivation</h4>
                <div className="bg-background p-4 rounded text-slate-300 whitespace-pre-wrap text-sm leading-relaxed border border-slate-800/50 font-mono text-xs">
                  {student.application.motivationJoin}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-surface shadow-sm overflow-hidden flex-1">
            <CardHeader className="pb-4 border-b border-slate-800/50">
              <CardTitle className="text-lg">Mission Logs (Submissions)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                {student.submissions.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-sm text-slate-500">No submissions found in the databanks.</p>
                  </div>
                ) : (
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-background border-b border-slate-800">
                      <tr>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Task / Mission</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Score</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {student.submissions.map(sub => (
                        <tr key={sub.id} className="hover:bg-slate-800/30 transition-colors duration-200">
                          <td className="px-6 py-4 font-medium text-slate-100">{sub.task.title}</td>
                          <td className="px-6 py-4">
                            <StatusBadge status={sub.status} />
                          </td>
                          <td className="px-6 py-4">
                            {sub.score?.points != null ? (
                              <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">{sub.score.points} <span className="text-emerald-500/50 font-normal text-xs">pts</span></span>
                            ) : (
                              <span className="text-slate-500">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right text-slate-500 text-xs font-mono">
                            {new Date(sub.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
