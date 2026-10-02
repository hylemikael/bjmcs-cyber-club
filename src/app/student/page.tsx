import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyJwt } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import Link from "next/link";
import { Shield, BookOpen, CheckSquare, Calendar, Award, Bell, Activity, Target } from "lucide-react";
import { StatCard } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function StudentDashboardPage() {
  const token = (await cookies()).get("session")?.value;
  if (!token) redirect("/student/login");

  const payload = await verifyJwt(token);
  if (!payload || payload.role !== "STUDENT" || !payload.studentId) {
    redirect("/student/login");
  }

  const student = await db.student.findUnique({
    where: { id: payload.studentId },
    include: { 
      application: true,
      attendances: true,
      submissions: { include: { score: true } }
    }
  });

  if (!student) {
    redirect("/student/login");
  }

  // Calculate factual progress
  const publishedTasksCount = await db.task.count({ where: { status: "PUBLISHED" } });
  const publishedMaterialsCount = await db.learningMaterial.count({ where: { status: "PUBLISHED" } });
  
  const completedTasks = student.submissions.length;
  const attendanceCount = student.attendances.length;
  const presentCount = student.attendances.filter(a => a.status === "PRESENT").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0F1B2D] border border-[#1E2D4A] shadow-xl">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600"></div>
        
        <div className="relative z-10 p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">{student.application.fullName}</span>
            </h1>
            <p className="text-slate-400 text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />
              BJMCS Cyber Club Academy Portal
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-900/20 border border-blue-500/30 text-sm font-mono text-cyan-300 shadow-[0_0_15px_rgba(37,99,235,0.1)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              ID: {student.application.reference}
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#16243A] border border-[#1E2D4A] text-xs font-medium text-slate-300">
              <Award className="w-4 h-4 text-amber-400" />
              Grade: {student.application.grade}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Account Status" 
          value="Active" 
          icon={<Activity className="w-5 h-5" />}
          trend="System Operational"
          className="bg-[#0F1B2D] border-[#1E2D4A]"
        />
        <StatCard 
          label="Attendance" 
          value={`${presentCount} / ${attendanceCount}`} 
          icon={<Calendar className="w-5 h-5" />}
          trend={`${attendanceCount > 0 ? Math.round((presentCount/attendanceCount)*100) : 0}% Present`}
          className="bg-[#0F1B2D] border-[#1E2D4A]"
        />
        <StatCard 
          label="Completed Tasks" 
          value={`${completedTasks} / ${publishedTasksCount}`} 
          icon={<CheckSquare className="w-5 h-5" />}
          trend={`${publishedTasksCount > 0 ? Math.round((completedTasks/publishedTasksCount)*100) : 0}% Completed`}
          className="bg-[#0F1B2D] border-[#1E2D4A]"
        />
        <StatCard 
          label="Learning Materials" 
          value={publishedMaterialsCount.toString()} 
          icon={<BookOpen className="w-5 h-5" />}
          trend="Available Modules"
          className="bg-[#0F1B2D] border-[#1E2D4A]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#0F1B2D] border-[#1E2D4A] shadow-lg overflow-hidden group hover:border-blue-500/30 transition-colors">
          <CardHeader className="border-b border-[#1E2D4A] bg-[#16243A]/50 pb-4">
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <Target className="w-5 h-5 text-blue-500" />
              Recent Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8 pb-8">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-900/20 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h4 className="text-slate-200 font-medium text-lg">Scores & Progress</h4>
                <p className="text-sm text-slate-400 max-w-xs mx-auto mt-2">Check your scored submissions inside the tasks view or final results engine.</p>
              </div>
              <Link href="/student/results" className="inline-flex items-center justify-center px-6 py-2.5 mt-4 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]">
                View Final Grades
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0F1B2D] border-[#1E2D4A] shadow-lg overflow-hidden group hover:border-cyan-500/30 transition-colors">
          <CardHeader className="border-b border-[#1E2D4A] bg-[#16243A]/50 pb-4">
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <Bell className="w-5 h-5 text-cyan-500" />
              Latest Announcements
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8 pb-8">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-cyan-900/20 flex items-center justify-center border border-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                <Bell className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-slate-200 font-medium text-lg">Stay Updated</h4>
                <p className="text-sm text-slate-400 max-w-xs mx-auto mt-2">Read the latest news and updates from the Cyber Club administration.</p>
              </div>
              <Link href="/student/announcements" className="inline-flex items-center justify-center px-6 py-2.5 mt-4 bg-[#16243A] hover:bg-[#1E2D4A] border border-[#2A3F5F] text-white text-sm font-medium rounded-lg transition-all">
                Read Announcements
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
