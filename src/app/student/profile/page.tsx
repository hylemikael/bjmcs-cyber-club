import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyJwt } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardContent, Badge , StatusBadge} from "@/components/ui";
import { PageHeader } from "@/components/ui/page-header";
import ChangePasswordForm from "./ChangePasswordForm";
import { User, Mail, Phone, GraduationCap, Shield, Calendar, Terminal, Network } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudentProfilePage() {
  const token = (await cookies()).get("session")?.value;
  if (!token) redirect("/login");

  const payload = await verifyJwt(token);
  if (!payload || !payload.studentId) redirect("/login");

  const student = await db.student.findUnique({
    where: { id: payload.studentId },
    include: {
      application: true,
      group: { include: { mentor: true } },
      faydaIdentity: true,
      academicRecord: true,
      attendances: true,
      submissions: { include: { score: true } }
    }
  });

  if (!student) redirect("/login");

  // Progress Calculations
  const totalAttendances = student.attendances.length;
  const presentOrLate = student.attendances.filter(a => a.status === "PRESENT" || a.status === "LATE").length;
  const attendancePercentage = totalAttendances > 0 ? Math.round((presentOrLate / totalAttendances) * 100) : 0;

  const totalTasks = await db.task.count({ where: { status: "PUBLISHED" } });
  const submissionsCount = student.submissions.length;
  const gradedSubmissions = student.submissions.filter(s => s.status === "GRADED");
  const totalScore = gradedSubmissions.reduce((acc, curr) => acc + (curr.score?.points || 0), 0);
  const maxPossibleScoreSoFar = gradedSubmissions.length * 10;
  const gradePercentage = maxPossibleScoreSoFar > 0 ? Math.round((totalScore / maxPossibleScoreSoFar) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Operative Profile"
        description="View your personal records, group assignment, and manage your account security."
        badge={<StatusBadge status={`ID: ${student.application.reference}`} />}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-[#0F1B2D] border-[#1E2D4A] shadow-xl">
            <CardHeader className="border-b border-[#1E2D4A] bg-[#16243A]/50 pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <User className="w-5 h-5 text-blue-500" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <User className="w-3.5 h-3.5" /> Full Name
                </div>
                <div className="text-slate-200 font-medium">{student.application.fullName}</div>
              </div>
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" /> Email Address
                </div>
                <div className="text-slate-200 font-medium">{student.email}</div>
              </div>
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" /> Phone Number
                </div>
                <div className="text-slate-200 font-medium">{student.application.phone}</div>
              </div>
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5" /> Clearance Level
                </div>
                <div className="text-cyan-400 font-mono">STUDENT_OPERATIVE</div>
              </div>
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5" /> Academic Assignment
                </div>
                <div className="text-slate-200 font-medium">Grade {student.application.grade} Section {student.application.section}</div>
              </div>
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" /> Enlistment Date
                </div>
                <div className="text-slate-200 font-medium">{new Date(student.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="sm:col-span-2 pt-4 border-t border-[#1E2D4A] space-y-3">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5" /> Specializations & Interests
                </div>
                <div className="flex flex-wrap gap-2">
                  {student.application.cyberTopics?.length 
                    ? student.application.cyberTopics.map((topic, i) => (
                      <Badge key={i} variant="outline" className="bg-[#16243A] text-slate-300 border-[#2A3F5F]">{topic}</Badge>
                    )) 
                    : <Badge variant="outline" className="bg-[#16243A] text-slate-300 border-[#2A3F5F]">General Cybersecurity</Badge>
                  }
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0F1B2D] border-[#1E2D4A] shadow-xl">
            <CardHeader className="border-b border-[#1E2D4A] bg-[#16243A]/50 pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <Network className="w-5 h-5 text-purple-500" />
                Unit & Mentor
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 text-sm">
              {student.group ? (
                <div className="p-5 rounded-xl bg-[#16243A]/50 border border-[#2A3F5F] space-y-4">
                  <div className="flex justify-between items-center border-b border-[#2A3F5F] pb-3">
                    <span className="text-slate-400 font-medium uppercase tracking-widest text-xs">Unit Designation</span>
                    <span className="text-white font-bold">{student.group.name}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-[#2A3F5F] pb-3">
                    <span className="text-slate-400 font-medium uppercase tracking-widest text-xs">Commanding Mentor</span>
                    <span className="text-cyan-400 font-bold">{student.group.mentor?.name || "Unassigned"}</span>
                  </div>
                  {student.group.mentor && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-medium uppercase tracking-widest text-xs">Mentor Comms</span>
                      <a href={`mailto:${student.group.mentor.email}`} className="text-blue-400 hover:text-blue-300 transition-colors">
                        {student.group.mentor.email}
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 text-center text-slate-400 bg-[#16243A]/30 rounded-xl border border-dashed border-[#2A3F5F]">
                  You have not been assigned to a specific unit yet. Wait for administrative orders.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-[#0F1B2D] border-[#1E2D4A] shadow-xl overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-red-600 to-orange-500"></div>
            <CardHeader className="border-b border-[#1E2D4A] bg-[#16243A]/50 pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <Shield className="w-5 h-5 text-red-500" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-6">
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">Update your access credentials. Choose a strong, unique password to protect your operative account.</p>
                <ChangePasswordForm />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
