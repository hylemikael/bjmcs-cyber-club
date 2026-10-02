import { siteConfig } from "@/config/site";
import { db } from "@/lib/db";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Shield, Swords, Key, Flag } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  let settings = null;
  try {
    settings = await db.registrationSettings.findUnique({
      where: { id: "default" },
    });
  } catch (error) {
    console.error("Failed to fetch registration settings:", error);
  }

  const isOpen = settings?.isOpen ?? false;
  const isPastDeadline = settings?.deadline ? new Date() > settings?.deadline : false;
  
  const isClosed = !isOpen || isPastDeadline;
  let statusText = "Registration is currently open.";
  if (!isOpen) {
    statusText = "Registration is currently closed.";
  } else if (isPastDeadline) {
    statusText = "Registration deadline has passed.";
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#07111F] text-slate-300 selection:bg-[#2563EB]/30">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section id="hero" className="relative flex flex-col items-center justify-center min-h-[90vh] text-center overflow-hidden">
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 z-0 opacity-20">
            <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#06B6D4" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-t from-[#07111F] via-transparent to-transparent" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-[#0F1B2D]/50 border border-[#06B6D4]/30 shadow-[0_0_30px_rgba(6,182,212,0.2)] backdrop-blur-sm">
              <Shield className="h-12 w-12 text-[#06B6D4]" />
            </div>

            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl mb-6 drop-shadow-lg">
              {siteConfig.name}
            </h1>

            <p className="mt-4 max-w-2xl text-xl text-slate-300 font-light">
              {siteConfig.description}
            </p>

            <div className="mt-10 flex flex-col items-center gap-6 sm:flex-row sm:gap-6">
              <div className="flex flex-col items-center">
                {isClosed ? (
                  <span className="rounded-md bg-[#0F1B2D] px-8 py-4 text-base font-semibold text-slate-400 cursor-not-allowed border border-slate-700">
                    Applications Closed
                  </span>
                ) : (
                  <Link
                    href="/register"
                    className="rounded-md bg-[#2563EB] px-8 py-4 text-base font-semibold text-white hover:bg-[#3B82F6] shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all duration-200"
                  >
                    Apply Now
                  </Link>
                )}
                <p className="mt-3 text-sm font-medium text-[#06B6D4] italic bg-[#0F1B2D]/80 px-3 py-1 rounded-full border border-[#06B6D4]/20">
                  {statusText}
                </p>
              </div>
              
              <Link
                href="/login"
                className="rounded-md border border-slate-600 bg-transparent px-8 py-4 text-base font-semibold text-white hover:bg-[#0F1B2D] hover:border-slate-400 transition-all duration-200"
              >
                Log In
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 bg-[#0F1B2D]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
                  Forging the Next Generation of Cyber Defenders
                </h2>
                <p className="text-lg text-slate-400 mb-6 leading-relaxed">
                  BJMCS Cyber Club is an elite organization dedicated to exploring the depths of cybersecurity. We provide a rigorous, hands-on environment where members can hone their skills in defensive architecture, offensive operations, and critical vulnerability research.
                </p>
                <p className="text-lg text-slate-400 leading-relaxed">
                  Through our comprehensive programs, state-of-the-art infrastructure, and community of passionate professionals, we bridge the gap between academic theory and real-world application.
                </p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#2563EB]/20 to-[#06B6D4]/20 rounded-2xl blur-xl"></div>
                <div className="relative bg-[#07111F] border border-slate-800 rounded-2xl p-8 font-mono text-sm text-[#06B6D4] shadow-2xl overflow-hidden">
                  <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-4">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <pre className="whitespace-pre-wrap opacity-80">
{`root@bjmcs:~# ./initialize_protocol.sh
[+] Establishing secure connection...
[+] Authenticating identity... OK
[+] Loading training modules...
  - Reverse Engineering
  - Network Defense
  - Cryptography
  - Exploit Development
[+] System ready. Awaiting input...`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Divisions */}
        <section id="programs" className="py-24 bg-[#07111F] relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Core Divisions
              </h2>
              <p className="mt-4 text-lg text-slate-400">
                Specialized pathways designed for comprehensive skill development.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Offensive Security",
                  desc: "Penetration testing, exploit development, and adversary simulation.",
                  icon: <Swords className="h-8 w-8 text-[#ef4444]" />
                },
                {
                  title: "Defensive Operations",
                  desc: "Incident response, threat hunting, and infrastructure hardening.",
                  icon: <Shield className="h-8 w-8 text-[#3b82f6]" />
                },
                {
                  title: "Applied Cryptography",
                  desc: "Secure communications, protocol analysis, and encryption implementation.",
                  icon: <Key className="h-8 w-8 text-[#8b5cf6]" />
                },
                {
                  title: "CTF Competition",
                  desc: "Competitive hacking, rapid problem solving, and reverse engineering.",
                  icon: <Flag className="h-8 w-8 text-[#10b981]" />
                }
              ].map((prog, idx) => (
                <div key={idx} className="bg-[#0F1B2D] rounded-xl p-8 shadow-lg border border-slate-800 hover:-translate-y-1 hover:border-[#2563EB]/50 hover:shadow-[0_10px_30px_rgba(37,99,235,0.15)] transition-all duration-300 group">
                  <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-lg bg-[#07111F] group-hover:scale-110 transition-transform duration-300 border border-slate-800 group-hover:border-[#2563EB]/50">
                    {prog.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{prog.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{prog.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Join Section */}
        <section id="why-join" className="py-24 bg-[#0F1B2D]">
           <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Why Join BJMCS?
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#07111F] border border-[#2563EB]/30">
                    <span className="text-2xl font-bold text-[#2563EB]">01</span>
                  </div>
                  <h4 className="text-xl font-semibold mb-3 text-white">Hands-on Experience</h4>
                  <p className="text-slate-400">Apply theoretical concepts in our custom-built virtual ranges and lab environments.</p>
                </div>
                <div className="text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#07111F] border border-[#2563EB]/30">
                    <span className="text-2xl font-bold text-[#2563EB]">02</span>
                  </div>
                  <h4 className="text-xl font-semibold mb-3 text-white">Industry Mentorship</h4>
                  <p className="text-slate-400">Learn directly from alumni and professionals currently operating in the cybersecurity sector.</p>
                </div>
                <div className="text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#07111F] border border-[#2563EB]/30">
                    <span className="text-2xl font-bold text-[#2563EB]">03</span>
                  </div>
                  <h4 className="text-xl font-semibold mb-3 text-white">Exclusive Network</h4>
                  <p className="text-slate-400">Join a tight-knit community of like-minded individuals dedicated to technical excellence.</p>
                </div>
              </div>
           </div>
        </section>

        {/* Final CTA */}
        <section className="relative py-24 bg-[#07111F] overflow-hidden border-t border-slate-800">
          <div className="absolute inset-0 opacity-10">
             <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid-cta" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2563EB" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-cta)" />
            </svg>
          </div>
          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl mb-6">
              Ready to Secure the Future?
            </h2>
            <p className="text-xl text-slate-300 mb-10">
              Take the first step towards mastering the art of cybersecurity.
            </p>
            {isClosed ? (
                <span className="inline-block rounded-md bg-[#0F1B2D] px-10 py-4 text-lg font-semibold text-slate-400 cursor-not-allowed opacity-70 border border-slate-700">
                  Applications Closed
                </span>
              ) : (
                <Link
                  href="/register"
                  className="inline-block rounded-md bg-[#2563EB] px-10 py-4 text-lg font-semibold text-white hover:bg-[#3B82F6] shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all duration-200"
                >
                  Apply for Membership
                </Link>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
