import { db } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent, PageHeader, StatusBadge, EmptyState, Button, Input } from "@/components/ui";
import { ApplicationStatus } from "@prisma/client";
import { Search, Filter, X, ArrowRight, ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; grade?: string }>;
}) {
  const { q, status, grade } = await searchParams;

  const where: any = {};

  if (q) {
    where.OR = [
      { fullName: { contains: q, mode: "insensitive" } },
      { reference: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }

  if (status && status !== "ALL") {
    where.status = status as ApplicationStatus;
  }

  if (grade && grade !== "ALL") {
    where.grade = grade;
  }

  const applications = await db.application.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      reference: true,
      fullName: true,
      email: true,
      grade: true,
      section: true,
      status: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Applications Management" 
        description="Review and process student applications for the cyber club."
        badge={`${applications.length} Found`}
      />

      <Card className="bg-surface border-slate-800 shadow-sm">
        <CardContent className="p-4">
          <form className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full space-y-1.5">
              <label htmlFor="q" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="q"
                  name="q"
                  type="text"
                  defaultValue={q || ""}
                  placeholder="Name, ref, or email..."
                  className="pl-9 bg-background border-slate-800"
                />
              </div>
            </div>
            
            <div className="w-full md:w-48 space-y-1.5">
              <label htmlFor="status" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</label>
              <select
                id="status"
                name="status"
                defaultValue={status || "ALL"}
                className="w-full rounded-md border border-slate-800 px-3 py-2 text-sm bg-background text-slate-100 focus:ring-2 focus:ring-primary focus:border-primary transition-colors shadow-sm"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="SELECTED">Selected</option>
                <option value="NOT_SELECTED">Not Selected</option>
              </select>
            </div>
            
            <div className="w-full md:w-32 space-y-1.5">
              <label htmlFor="grade" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Grade</label>
              <select
                id="grade"
                name="grade"
                defaultValue={grade || "ALL"}
                className="w-full rounded-md border border-slate-800 px-3 py-2 text-sm bg-background text-slate-100 focus:ring-2 focus:ring-primary focus:border-primary transition-colors shadow-sm"
              >
                <option value="ALL">All Grades</option>
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
                <option value="11">Grade 11</option>
                <option value="12">Grade 12</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button type="submit" variant="primary" className="w-full md:w-auto gap-2">
                <Filter className="w-4 h-4" /> Filter
              </Button>
              <Button variant="outline" size="sm" className="shrink-0 border-slate-800 bg-surface">
                <Link href="/admin/applications" title="Clear Filters">
                  <X className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="bg-surface rounded-lg shadow-sm border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800/50">
            <thead className="bg-background">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Applicant</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Reference</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-100">{app.fullName}</div>
                    <div className="text-sm text-slate-500">{app.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-400">{app.reference}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-300">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700">
                      {app.grade}-{app.section}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
                      <Link href={`/admin/applications/${app.id}`}>
                        Review <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12">
                    <EmptyState 
                      icon={<ShieldAlert className="w-5 h-5" />}
                      title="No applications found"
                      description="Try adjusting your filters or search query."
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
