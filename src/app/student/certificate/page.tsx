import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyJwt } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { Award, Lock, FileCheck, CheckCircle2, Download } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";

export const dynamic = "force-dynamic";

export default async function StudentCertificatePage() {
  const token = (await cookies()).get("session")?.value;
  if (!token) redirect("/student/login");

  const payload = await verifyJwt(token);
  if (!payload || !payload.studentId) redirect("/student/login");

  const student = await db.student.findUnique({
    where: { id: payload.studentId },
    include: { academicRecord: true }
  });

  if (!student) redirect("/student/login");

  const status = student.academicRecord?.certificateState || "RESULTS_NOT_FINAL";

  const getStatusDisplay = () => {
    switch (status) {
      case "RESULTS_NOT_FINAL":
        return { 
          label: "Results Not Final", 
          color: "text-slate-400", 
          bg: "bg-[#16243A]",
          border: "border-[#1E2D4A]",
          icon: <Lock className="w-12 h-12 text-slate-500" />,
          desc: "Your final results must be calculated and officially finalized before certificate processing begins." 
        };
      case "PENDING_APPROVAL":
        return { 
          label: "Pending Approval", 
          color: "text-amber-400", 
          bg: "bg-amber-900/10",
          border: "border-amber-500/20",
          icon: <FileCheck className="w-12 h-12 text-amber-500" />,
          desc: "Your results are finalized and currently pending official approval from the Director General." 
        };
      case "APPROVED_READY":
        return { 
          label: "Approved & Preparing", 
          color: "text-blue-400", 
          bg: "bg-blue-900/10",
          border: "border-blue-500/20",
          icon: <CheckCircle2 className="w-12 h-12 text-blue-500" />,
          desc: "Your certificate is approved and is being prepared for physical or digital distribution." 
        };
      case "CERTIFICATE_AVAILABLE":
        return { 
          label: "Certificate Available", 
          color: "text-emerald-400", 
          bg: "bg-emerald-900/10",
          border: "border-emerald-500/30",
          icon: <Award className="w-16 h-16 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />,
          desc: "Your official cybersecurity academy certificate is now fully available." 
        };
      default:
        return { 
          label: "Unknown State", 
          color: "text-slate-400", 
          bg: "bg-[#16243A]",
          border: "border-[#1E2D4A]",
          icon: <Lock className="w-12 h-12 text-slate-500" />,
          desc: "Please contact administration regarding your certificate status." 
        };
    }
  };

  const display = getStatusDisplay();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Certification Status"
        description="Track the status of your official BJMCS Cyber Club academy certificate."
      />

      <div className="max-w-2xl mx-auto">
        <Card className={`relative overflow-hidden bg-[#0F1B2D] border ${display.border} shadow-2xl transition-all duration-500`}>
          {status === "CERTIFICATE_AVAILABLE" && (
            <>
              <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
            </>
          )}
          
          <CardContent className="p-12 text-center flex flex-col items-center justify-center relative z-10 space-y-6">
            <div className={`p-6 rounded-3xl ${display.bg} border ${display.border} shadow-inner`}>
              {display.icon}
            </div>
            
            <div className="space-y-3 max-w-md mx-auto">
              <h2 className={`text-2xl md:text-3xl font-bold tracking-tight ${display.color}`}>
                {display.label}
              </h2>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                {display.desc}
              </p>
            </div>

            {status === "CERTIFICATE_AVAILABLE" && (
              <button className="mt-8 px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-medium rounded-xl transition-all shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_30px_rgba(52,211,153,0.5)] flex items-center gap-3">
                <Download className="w-5 h-5" />
                Download Official Certificate
              </button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
