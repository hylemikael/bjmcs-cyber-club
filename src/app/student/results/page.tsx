import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyJwt } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { PageHeader } from "@/components/ui/page-header";
import { Award, CheckCircle2, AlertCircle, FileText, Calendar, Shield, Activity, Target } from "lucide-react";
import { ProgressBar } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function StudentResultsPage() {
  const token = (await cookies()).get("session")?.value;
  if (!token) redirect("/student/login");

  const payload = await verifyJwt(token);
  if (!payload || !payload.studentId) redirect("/student/login");

  const student = await db.student.findUnique({
    where: { id: payload.studentId },
    include: {
      academicRecord: true,
      attendances: true,
      submissions: {
        include: { score: true }
      }
    }
  });

  if (!student) redirect("/student/login");

  // Calculate Attendance Score (20% max)
  const totalAtt = student.attendances.length;
  const presentAtt = student.attendances.filter(a => a.status === "PRESENT").length;
  const attendanceRatio = totalAtt > 0 ? presentAtt / totalAtt : 0;
  const attendancePoints = attendanceRatio * 20;

  // Mid Exam (30% max)
  const midExamPoints = student.academicRecord?.midExamScore != null ? (student.academicRecord.midExamScore / 100) * 30 : null;

  // Final Exam (50% max)
  const finalExamPoints = student.academicRecord?.finalExamScore != null ? (student.academicRecord.finalExamScore / 100) * 50 : null;

  // Continuous Assessment (Tasks)
  const scoredTasks = student.submissions.filter(s => s.score != null);
  const tasksAverage = scoredTasks.length > 0 
    ? scoredTasks.reduce((acc, curr) => acc + (curr.score?.points || 0), 0) / scoredTasks.length 
    : 0;

  const totalPoints = student.academicRecord?.isFinalized
    ? attendancePoints + (midExamPoints || 0) + (finalExamPoints || 0)
    : null;

  const gradePercentage = totalPoints !== null ? Math.round(totalPoints) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Scores & Results Engine"
        description="Final grade calculation and continuous assessment metrics."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Final Result Panel */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          <Card className={`flex-1 relative overflow-hidden bg-[#0F1B2D] border ${
            student.academicRecord?.isFinalized ? 'border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)]' : 'border-[#1E2D4A] shadow-xl'
          } group transition-all duration-500`}>
            {student.academicRecord?.isFinalized && (
              <>
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
              </>
            )}
            
            <CardHeader className="text-center pb-2 pt-12 relative z-10">
              <div className="mx-auto w-20 h-20 rounded-2xl bg-blue-900/20 flex items-center justify-center mb-6 shadow-inner border border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                <Award className={`w-10 h-10 ${student.academicRecord?.isFinalized ? 'text-cyan-400' : 'text-slate-500'}`} />
              </div>
              <CardTitle className={`text-xs uppercase tracking-[0.2em] font-bold ${student.academicRecord?.isFinalized ? 'text-cyan-400' : 'text-slate-500'}`}>
                {student.academicRecord?.isFinalized ? 'Official Final Grade' : 'Provisional Standing'}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center pb-12 relative z-10 flex flex-col items-center justify-center flex-1 space-y-8">
              <div className="relative">
                <div className={`text-7xl sm:text-8xl font-black font-mono tracking-tighter ${
                  student.academicRecord?.isFinalized ? 'text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400' : 'text-slate-600'
                }`}>
                  {totalPoints != null ? gradePercentage : "--"}
                  <span className="text-3xl text-slate-500 font-normal">%</span>
                </div>
              </div>

              {student.academicRecord?.isFinalized ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Results Finalized
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium">
                  <AlertCircle className="w-4 h-4" />
                  Pending Final Assessment
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-[#0F1B2D] border-[#1E2D4A] shadow-xl">
             <CardHeader className="border-b border-[#1E2D4A] bg-[#16243A]/50 pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <Target className="w-5 h-5 text-purple-500" />
                Tasks Average (Informational)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ProgressBar 
                value={tasksAverage} 
                max={100} 
                label={`${scoredTasks.length} Scored Tasks`} 
                showValue 
                className="mt-2"
              />
            </CardContent>
          </Card>
        </div>

        {/* Grade Breakdown */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          <Card className="bg-[#0F1B2D] border-[#1E2D4A] shadow-xl flex-1 flex flex-col">
            <CardHeader className="border-b border-[#1E2D4A] bg-[#16243A]/50 pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <Shield className="w-5 h-5 text-blue-500" />
                Calculation Matrix
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <div className="divide-y divide-[#1E2D4A]/50 h-full flex flex-col">
                
                {/* Attendance Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-transparent hover:bg-[#16243A]/50 transition-colors gap-4">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-blue-900/20 flex items-center justify-center shrink-0 border border-blue-500/20">
                      <Calendar className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-100 text-lg">Attendance Score</div>
                      <div className="text-sm text-slate-400 font-mono mt-1">{presentAtt} / {totalAtt} Days Present</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-1">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">20% Weight</div>
                    <div className="text-2xl font-black text-white font-mono">{attendancePoints.toFixed(1)}<span className="text-sm font-medium text-slate-500 ml-1">/ 20</span></div>
                  </div>
                </div>

                {/* Mid Exam Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-transparent hover:bg-[#16243A]/50 transition-colors gap-4">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-cyan-900/20 flex items-center justify-center shrink-0 border border-cyan-500/20">
                      <FileText className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-100 text-lg">Midterm Exam</div>
                      <div className="text-sm text-slate-400 font-mono mt-1">Raw Score: {student.academicRecord?.midExamScore ?? "-"} / 100</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-1">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">30% Weight</div>
                    <div className="text-2xl font-black text-white font-mono">{midExamPoints != null ? midExamPoints.toFixed(1) : "-"}<span className="text-sm font-medium text-slate-500 ml-1">/ 30</span></div>
                  </div>
                </div>

                {/* Final Exam Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-transparent hover:bg-[#16243A]/50 transition-colors gap-4 flex-1">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-purple-900/20 flex items-center justify-center shrink-0 border border-purple-500/20">
                      <Activity className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-100 text-lg">Final Exam</div>
                      <div className="text-sm text-slate-400 font-mono mt-1">Raw Score: {student.academicRecord?.finalExamScore ?? "-"} / 100</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-1">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">50% Weight</div>
                    <div className="text-2xl font-black text-white font-mono">{finalExamPoints != null ? finalExamPoints.toFixed(1) : "-"}<span className="text-sm font-medium text-slate-500 ml-1">/ 50</span></div>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
