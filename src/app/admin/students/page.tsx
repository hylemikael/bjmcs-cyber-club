import { db } from "@/lib/db";
import { Card, CardContent, PageHeader, EmptyState, Button } from "@/components/ui";
import Link from "next/link";
import { Users } from "lucide-react";
import AssignGroupSelect from "./_components/AssignGroupSelect";

export const dynamic = "force-dynamic";

export default async function AdminStudentsPage() {
  const [students, groups] = await Promise.all([
    db.student.findMany({
      where: { isActive: true },
      include: {
        application: true,
        group: true
      },
      orderBy: { application: { fullName: "asc" } }
    }),
    db.group.findMany({
      orderBy: { name: "asc" }
    })
  ]);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Active Students" 
        description="Manage enrolled student profiles and cohorts."
        badge={`${students.length} Total`}
      />

      <Card className="border-slate-800 bg-surface shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-background border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Student Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Cohort / Group</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {students.map(s => (
                  <tr key={s.id} className="hover:bg-slate-800/50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-100">{s.application.fullName}</div>
                      <div className="text-xs text-slate-400 mt-0.5 font-mono">ID: {s.id.slice(0,8)}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{s.email}</td>
                    <td className="px-6 py-4">
                      <div className="max-w-[200px]">
                        <AssignGroupSelect 
                          studentId={s.id} 
                          currentGroupId={s.groupId} 
                          groups={groups} 
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
                        <Link href={`/admin/students/${s.id}`}>
                          View Profile <span className="ml-1">&rarr;</span>
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12">
                      <EmptyState 
                        icon={<Users className="w-5 h-5" />}
                        title="No active students found"
                        description="Approve applications to enroll students."
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
