import { db } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardContent, PageHeader, EmptyState, StatusBadge } from "@/components/ui";
import CreateMaterialModal from "./_components/CreateMaterialModal";
import { cn } from "@/lib/utils";
import { BookOpen, ExternalLink, Target } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminMaterialsPage() {
  const [materials, groups, students] = await Promise.all([
    db.learningMaterial.findMany({
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
          title="Knowledge Base (Materials)" 
          description="Manage learning resources, tools, and links."
          badge={`${materials.length} Resources`}
        />
        <CreateMaterialModal groups={groups} students={students} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {materials.length === 0 ? (
          <div className="col-span-full p-12">
            <EmptyState 
              icon={<BookOpen className="w-5 h-5" />}
              title="No materials found"
              description="Upload resources to help students learn."
            />
          </div>
        ) : materials.map(mat => (
          <Card key={mat.id} className="border-slate-800 bg-surface shadow-sm hover:border-accent/50 transition-colors duration-200 flex flex-col">
            <CardHeader className="pb-4 border-b border-slate-800/50">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-accent mb-2 font-mono">{mat.category}</div>
                  <CardTitle className="text-lg leading-tight text-slate-100">{mat.title}</CardTitle>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <StatusBadge status={mat.status} />
                  <span className="px-2 py-0.5 rounded border border-slate-700 text-[10px] font-bold bg-background text-slate-400 uppercase tracking-wide">
                    {mat.resourceType}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-sm text-slate-300 mb-6 line-clamp-3">{mat.description}</p>
                <div className="flex items-center gap-2 text-xs text-slate-400 bg-background px-3 py-2 rounded border border-slate-800">
                  <Target className="w-4 h-4 text-slate-500" />
                  <span className="font-medium">Target:</span> 
                  <span className="font-semibold text-slate-300 font-mono">
                    {mat.targets[0]?.targetType || "ALL"}
                    {mat.targets[0]?.targetType === 'GROUP' && ` (Group: ${mat.targets[0].groupId})`}
                    {mat.targets[0]?.targetType === 'INDIVIDUAL' && ` (Student: ${mat.targets[0].studentId})`}
                  </span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
                <a 
                  href={mat.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center text-sm font-medium text-accent hover:text-accent/80 hover:underline transition-colors group"
                >
                  Access Resource 
                  <ExternalLink className="w-4 h-4 ml-1.5" />
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
