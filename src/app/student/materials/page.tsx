import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyJwt } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardContent, Badge , StatusBadge} from "@/components/ui";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { BookOpen, FileText, Video, Link as LinkIcon, Download, ExternalLink } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function StudentMaterialsPage() {
  const token = (await cookies()).get("session")?.value;
  if (!token) redirect("/login");

  const payload = await verifyJwt(token);
  if (!payload || !payload.studentId) redirect("/login");

  const student = await db.student.findUnique({
    where: { id: payload.studentId },
    select: { groupId: true }
  });

  if (!student) redirect("/login");

  const materials = await db.learningMaterial.findMany({
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
    orderBy: { createdAt: "desc" }
  });

  const getIcon = (type: string) => {
    switch(type) {
      case "VIDEO": return <Video className="w-5 h-5" />;
      case "DOCUMENT": return <FileText className="w-5 h-5" />;
      case "LINK": return <LinkIcon className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Learning Materials"
        description="Access your curated cybersecurity curriculum resources and training files."
        badge={<StatusBadge status={`${materials.length} Resources`} />}
      />
      
      {materials.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="w-5 h-5" />}
          title="No Materials Available"
          description="Learning materials will appear here once published by your instructors."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {materials.map(mat => (
            <Card key={mat.id} className="bg-[#0F1B2D] border-[#1E2D4A] shadow-lg hover:border-cyan-500/40 hover:shadow-cyan-500/10 transition-all flex flex-col group">
              <CardHeader className="border-b border-[#1E2D4A] bg-[#16243A]/40 pb-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="p-3 rounded-xl bg-cyan-900/20 text-cyan-400 border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-colors">
                    {getIcon(mat.resourceType)}
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Badge variant="outline" className="bg-[#16243A] text-slate-300 border-[#2A3F5F] text-[10px] uppercase tracking-wider">{mat.category}</Badge>
                    <Badge variant="outline" className="bg-blue-900/20 text-blue-400 border-blue-500/20 text-[10px] uppercase tracking-wider">{mat.resourceType}</Badge>
                  </div>
                </div>
                <CardTitle className="text-lg text-slate-100 mt-4 leading-tight group-hover:text-cyan-300 transition-colors">{mat.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-5 flex-1 flex flex-col">
                <p className="text-sm text-slate-400 line-clamp-3 mb-6 flex-1">
                  {mat.description || "No description provided."}
                </p>
                <Link 
                  href={mat.url || "#"} 
                  target={mat.url ? "_blank" : undefined}
                  className="inline-flex items-center justify-center w-full gap-2 px-4 py-2.5 bg-[#16243A] hover:bg-blue-600 border border-[#2A3F5F] hover:border-blue-500 text-slate-200 hover:text-white text-sm font-medium rounded-lg transition-all"
                >
                  {mat.resourceType === 'DOCUMENT' ? (
                    <><Download className="w-4 h-4" /> Download Resource</>
                  ) : (
                    <><ExternalLink className="w-4 h-4" /> Access Material</>
                  )}
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
