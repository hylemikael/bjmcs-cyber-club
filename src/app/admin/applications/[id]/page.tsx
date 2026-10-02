import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import StatusSelector from "./StatusSelector";
import { Card, CardHeader, CardTitle, CardContent, SectionHeader } from "@/components/ui";
import { ArrowLeft, User, ShieldAlert, Heart, Code, FolderOpen, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ApplicationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const application = await db.application.findUnique({
    where: { id },
    include: { projects: true },
  });

  if (!application) return notFound();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="mb-4">
        <Link href="/admin/applications" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Applications
        </Link>
      </div>

      <div className="bg-surface rounded-xl shadow-sm border border-slate-800 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100 flex items-center gap-3">
            {application.fullName}
          </h1>
          <div className="flex items-center gap-3 mt-2 text-sm text-slate-400">
            <span className="font-mono bg-background px-2 py-0.5 rounded text-slate-300 border border-slate-800">
              Ref: {application.reference}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> 
              {new Date(application.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
        
        <div className="w-full md:w-auto">
          <StatusSelector 
            applicationId={application.id} 
            currentStatus={application.status} 
            emailStatus={application.selectionEmailStatus} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identity & School */}
        <Card className="border-slate-800 bg-surface shadow-sm">
          <CardHeader className="border-b border-slate-800/50 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg text-slate-100">
              <User className="w-5 h-5 text-primary" /> Personal Dossier
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background p-3 rounded-lg border border-slate-800/50">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Age</p>
                <p className="font-medium text-slate-100">{application.age}</p>
              </div>
              <div className="bg-background p-3 rounded-lg border border-slate-800/50">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Gender</p>
                <p className="font-medium text-slate-100">{application.gender}</p>
              </div>
              <div className="bg-background p-3 rounded-lg border border-slate-800/50 col-span-2 sm:col-span-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Phone</p>
                <p className="font-medium text-slate-100">{application.phone}</p>
              </div>
              <div className="bg-background p-3 rounded-lg border border-slate-800/50 col-span-2 sm:col-span-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Email</p>
                <p className="font-medium text-slate-100 truncate" title={application.email}>{application.email}</p>
              </div>
              <div className="bg-background p-3 rounded-lg border border-slate-800/50">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Grade</p>
                <p className="font-medium text-slate-100">{application.grade}</p>
              </div>
              <div className="bg-background p-3 rounded-lg border border-slate-800/50">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Section</p>
                <p className="font-medium text-slate-100">{application.section}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tech Background */}
        <Card className="border-slate-800 bg-surface shadow-sm">
          <CardHeader className="border-b border-slate-800/50 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg text-slate-100">
              <Code className="w-5 h-5 text-accent" /> Technical Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-5">
            <div>
              <p className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-purple-500" /> Studied Cybersecurity?
              </p>
              <div className="bg-background p-3 rounded-lg border border-slate-800/50">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${application.hasStudiedCyber ? 'bg-green-900/30 text-green-400' : 'bg-slate-800 text-slate-300'}`}>
                  {application.hasStudiedCyber ? "Yes" : "No"}
                </span>
                {application.hasStudiedCyber && application.cyberStudyDesc && (
                  <p className="mt-3 text-sm text-slate-400 border-l-2 border-purple-500 pl-3 italic">
                    "{application.cyberStudyDesc}"
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <p className="text-sm font-semibold text-slate-300 mb-2">Programming Experience</p>
              <p className="text-sm text-slate-100 bg-background p-3 rounded-lg border border-slate-800/50">
                {application.programmingExp}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Languages</p>
                <div className="flex flex-wrap gap-2">
                  {application.programmingLangs.length ? application.programmingLangs.map(l => (
                    <span key={l} className="px-2.5 py-1 bg-primary/20 text-primary border border-primary/50 rounded-md text-xs font-medium shadow-sm">{l}</span>
                  )) : <span className="text-slate-500 text-sm italic">None</span>}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Interests</p>
                <div className="flex flex-wrap gap-2">
                  {application.cyberTopics.length ? application.cyberTopics.map(t => (
                    <span key={t} className="px-2.5 py-1 bg-accent/20 text-accent border border-accent/50 rounded-md text-xs font-medium shadow-sm">{t}</span>
                  )) : <span className="text-slate-500 text-sm italic">None</span>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Motivation */}
        <Card className="md:col-span-2 border-slate-800 bg-surface shadow-sm">
          <CardHeader className="border-b border-slate-800/50 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg text-slate-100">
              <Heart className="w-5 h-5 text-red-500" /> Motivation & Availability
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-slate-300 mb-2">Why do you want to join?</p>
                <div className="p-4 bg-background rounded-xl border border-slate-800/80 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap shadow-inner h-full">
                  {application.motivationJoin}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-300 mb-2">What do you hope to learn?</p>
                <div className="p-4 bg-background rounded-xl border border-slate-800/80 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap shadow-inner h-full">
                  {application.motivationLearn}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-800/50">
              <div className="bg-background p-3 rounded-lg border border-slate-800/50">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Weekly Availability</p>
                <p className="font-medium text-slate-100 capitalize">{application.weeklyAvailability.replace(/_/g, " ").toLowerCase()}</p>
              </div>
              <div className="bg-background p-3 rounded-lg border border-slate-800/50">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Discovery Channel</p>
                <p className="font-medium text-slate-100">{application.howHeardAboutUs || "Not specified"}</p>
              </div>
              {application.additionalSkills && (
                <div className="bg-background p-3 rounded-lg border border-slate-800/50 sm:col-span-2 lg:col-span-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Additional Skills</p>
                  <p className="text-sm text-slate-300">{application.additionalSkills}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Projects */}
        <Card className="md:col-span-2 border-slate-800 bg-surface shadow-sm">
          <CardHeader className="border-b border-slate-800/50 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg text-slate-100">
              <FolderOpen className="w-5 h-5 text-amber-500" /> Portfolio Projects <span className="ml-2 bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full">{application.projects.length}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {application.projects.length === 0 ? (
              <div className="text-center py-8 bg-background rounded-xl border border-dashed border-slate-700">
                <FolderOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-400">No projects submitted with this application.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {application.projects.map((proj) => (
                  <div key={proj.id} className="p-5 bg-background border border-slate-800/80 rounded-xl shadow-sm hover:border-slate-700 transition-colors">
                    <h4 className="font-bold text-lg text-slate-100 mb-2">{proj.projectName}</h4>
                    {proj.description && <p className="text-sm text-slate-400 mb-4 line-clamp-3">{proj.description}</p>}
                    <div className="flex flex-wrap gap-3 pt-3 border-t border-slate-800/50 mt-auto">
                      {proj.githubUrl && (
                        <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 bg-primary/10 px-3 py-1.5 rounded-md transition-colors">
                          <Code className="w-4 h-4 mr-1.5" /> Source Code
                        </a>
                      )}
                      {proj.portfolioUrl && (
                        <a href={proj.portfolioUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-purple-400 hover:text-purple-300 bg-purple-900/20 px-3 py-1.5 rounded-md transition-colors">
                          Live Demo &rarr;
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
