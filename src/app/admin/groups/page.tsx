import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, PageHeader, EmptyState } from "@/components/ui";
import CreateGroupModal from "./_components/CreateGroupModal";
import CreateMentorModal from "./_components/CreateMentorModal";
import { Users, UserPlus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminGroupsPage() {
  const [groups, mentors] = await Promise.all([
    db.group.findMany({
      include: { mentor: true, _count: { select: { students: true } } },
      orderBy: { name: "asc" }
    }),
    db.mentor.findMany({
      include: { groups: true },
      orderBy: { name: "asc" }
    })
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <PageHeader 
          title="Squads & Handlers (Groups)" 
          description="Organize operative cohorts and assign mentor leadership."
          badge={`${groups.length} Squads`}
        />
        <div className="flex flex-wrap gap-2">
          <CreateMentorModal />
          <CreateGroupModal mentors={mentors} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GROUPS */}
        <Card className="border-slate-800 bg-surface shadow-sm flex flex-col">
          <CardHeader className="pb-4 border-b border-slate-800/50">
            <CardTitle className="text-lg flex items-center gap-2 text-slate-100">
              <Users className="w-5 h-5 text-primary" /> Squadrons
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            {groups.length === 0 ? (
              <div className="p-12">
                <EmptyState icon={<Users className="w-5 h-5" />} title="No squads defined" description="Create a new squadron." />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-background border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Group Name</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Handler</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Operatives</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {groups.map(g => (
                      <tr key={g.id} className="hover:bg-slate-800/50 transition-colors duration-200">
                        <td className="px-6 py-4 font-medium text-slate-100 font-mono">{g.name}</td>
                        <td className="px-6 py-4 text-slate-300">
                          {g.mentor ? (
                            <span className="inline-flex items-center gap-1.5 bg-background border border-slate-700 px-2 py-0.5 rounded text-xs font-medium">
                              <span className="w-2 h-2 rounded-full bg-primary"></span>
                              {g.mentor.name}
                            </span>
                          ) : (
                            <span className="text-slate-500 italic text-sm">Unassigned</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded border border-slate-700 bg-background text-slate-300 text-xs font-mono">
                            {g._count.students}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* MENTORS */}
        <Card className="border-slate-800 bg-surface shadow-sm flex flex-col">
          <CardHeader className="pb-4 border-b border-slate-800/50">
            <CardTitle className="text-lg flex items-center gap-2 text-slate-100">
              <UserPlus className="w-5 h-5 text-accent" /> Handlers (Mentors)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            {mentors.length === 0 ? (
              <div className="p-12">
                <EmptyState icon={<UserPlus className="w-5 h-5" />} title="No handlers defined" description="Add mentors to lead squads." />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-background border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Assigned Squads</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {mentors.map(m => (
                      <tr key={m.id} className="hover:bg-slate-800/50 transition-colors duration-200">
                        <td className="px-6 py-4 font-medium text-slate-100">{m.name}</td>
                        <td className="px-6 py-4 text-slate-300 font-mono text-xs">{m.email || <span className="text-slate-500 italic">-</span>}</td>
                        <td className="px-6 py-4 text-right">
                          {m.groups.length > 0 ? (
                            <div className="flex flex-wrap justify-end gap-1">
                              {m.groups.map(g => (
                                <span key={g.id} className="inline-flex px-2 py-0.5 rounded border border-primary/30 bg-primary/10 text-primary text-xs font-mono">
                                  {g.name}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-500 italic text-sm">None</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
