import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyJwt } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardContent, Badge } from "@/components/ui";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Bell, Megaphone, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudentAnnouncementsPage() {
  const token = (await cookies()).get("session")?.value;
  if (!token) redirect("/login");

  const payload = await verifyJwt(token);
  if (!payload || !payload.studentId) redirect("/login");

  const student = await db.student.findUnique({
    where: { id: payload.studentId },
    select: { groupId: true }
  });

  if (!student) redirect("/login");

  const announcements = await db.announcement.findMany({
    where: {
      status: "PUBLISHED",
      targets: {
        some: {
          OR: [
            { targetType: "ALL" },
            { targetType: "GROUP", groupId: student.groupId },
            { targetType: "INDIVIDUAL", studentId: payload.studentId }
          ]
        }
      }
    },
    orderBy: { publishedAt: "desc" }
  });

  const now = new Date();
  const validAnnouncements = announcements.filter(a => !a.expiresAt || new Date(a.expiresAt) > now);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Announcements"
        description="Official updates and notifications from the Cyber Club administration."
      />
      
      <div className="grid gap-6">
        {validAnnouncements.length === 0 ? (
          <EmptyState
            icon={<Bell className="w-5 h-5" />}
            title="No Active Announcements"
            description="You're all caught up! Check back later for new updates."
          />
        ) : validAnnouncements.map(a => (
          <Card key={a.id} className="bg-[#0F1B2D] border-[#1E2D4A] shadow-lg hover:border-blue-500/30 transition-all overflow-hidden group">
            <div className="h-1 w-full bg-gradient-to-r from-blue-600 to-cyan-400"></div>
            <CardHeader className="border-b border-[#1E2D4A] bg-[#16243A]/50 pb-4 flex flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-900/30 text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg text-slate-100">{a.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {a.publishedAt ? new Date(a.publishedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : new Date(a.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">Official</Badge>
            </CardHeader>
            <CardContent className="pt-6 pb-6 text-slate-300 leading-relaxed whitespace-pre-wrap">
              {a.content}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
