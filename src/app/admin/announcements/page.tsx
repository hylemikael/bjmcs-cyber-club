import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, PageHeader, EmptyState, StatusBadge } from "@/components/ui";
import CreateAnnouncementModal from "./_components/CreateAnnouncementModal";
import { cn } from "@/lib/utils";
import { Megaphone, Target, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminAnnouncementsPage() {
  const [announcements, groups, students] = await Promise.all([
    db.announcement.findMany({
      include: { targets: true },
      orderBy: { createdAt: "desc" }
    }),
    db.group.findMany({ orderBy: { name: "asc" } }),
    db.student.findMany({ where: { isActive: true }, include: { application: true }, orderBy: { application: { fullName: "asc" } } })
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <PageHeader 
          title="Comms Network (Announcements)" 
          description="Broadcast intelligence and updates to operatives."
          badge={`${announcements.length} Dispatches`}
        />
        <CreateAnnouncementModal groups={groups} students={students} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {announcements.length === 0 ? (
          <div className="p-12">
            <EmptyState 
              icon={<Megaphone className="w-5 h-5" />}
              title="No announcements active"
              description="Create a dispatch to send to students."
            />
          </div>
        ) : announcements.map(a => (
          <Card key={a.id} className="border-slate-800 bg-surface shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-4 border-b border-slate-800/50 bg-background/50">
              <div className="flex justify-between items-start gap-4">
                <CardTitle className="text-xl text-slate-100 flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-primary" />
                  {a.title}
                </CardTitle>
                <div className="shrink-0">
                  <StatusBadge status={a.status} />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-400 font-medium">
                <span className="inline-flex items-center gap-1.5 bg-background border border-slate-800 px-2 py-1 rounded font-mono">
                  <Target className="w-3.5 h-3.5 text-slate-500" />
                  Target: <span className="text-slate-300 font-semibold">{a.targets[0]?.targetType || "ALL"}</span>
                  {a.targets[0]?.targetType === 'GROUP' && <span className="text-slate-500 font-normal"> (Group ID: {a.targets[0].groupId})</span>}
                  {a.targets[0]?.targetType === 'INDIVIDUAL' && <span className="text-slate-500 font-normal"> (Student ID: {a.targets[0].studentId})</span>}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  Posted: {new Date(a.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose prose-sm prose-invert max-w-none text-slate-300 whitespace-pre-wrap leading-relaxed font-mono">
                {a.content}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
