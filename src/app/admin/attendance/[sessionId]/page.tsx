import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import AttendanceList from "./AttendanceList";
import { cn } from "@/lib/utils";
import { ArrowLeft, Users } from "lucide-react";
import { StatusBadge } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AdminAttendanceSessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const sessionId = (await params).sessionId;

  const session = await db.attendanceSession.findUnique({
    where: { id: sessionId },
    include: { group: true }
  });

  if (!session) {
    notFound();
  }

  // Fetch all active students
  const whereClause = { isActive: true, ...(session.groupId ? { groupId: session.groupId } : {}) };
  const students = await db.student.findMany({
    where: whereClause,
    include: {
      application: true,
      attendances: {
        where: { sessionId: session.id }
      }
    },
    orderBy: {
      application: { fullName: "asc" }
    }
  });

  // Map to a usable format for the client component
  const attendanceData = students.map(student => {
    const record = student.attendances[0];
    return {
      studentId: student.id,
      name: student.application.fullName,
      status: record?.status || null,
      notes: record?.notes || ""
    };
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <Link href="/admin/attendance" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-primary transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Logs
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-100">{session.title}</h1>
            <div className="flex items-center gap-2 mt-2 text-sm text-slate-400 font-medium">
              <span className="bg-background px-2 py-0.5 rounded border border-slate-800 font-mono">
                {new Date(session.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span className="text-slate-600">&middot;</span>
              <span className="inline-flex items-center gap-1.5 bg-background px-2 py-0.5 rounded border border-slate-800">
                <Users className="w-3.5 h-3.5 text-accent" />
                {session.group?.name || "All Operatives"}
              </span>
            </div>
          </div>
          <div className="text-left md:text-right">
            <StatusBadge status={session.status} />
            <p className="text-xs text-slate-500 mt-2 font-mono">ID: {session.id.split('-')[0]}</p>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-slate-800 rounded-xl shadow-sm p-1">
        <AttendanceList sessionId={session.id} initialData={attendanceData} sessionStatus={session.status} />
      </div>
    </div>
  );
}
