const { SignJWT } = require('jose');
const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

const JWT_SECRET = process.env.JWT_SECRET || "fallback_dev_secret_please_change_in_prod";
const KEY = new TextEncoder().encode(JWT_SECRET);

async function main() {
  const prisma = new PrismaClient();
  const student = await prisma.student.findFirst();
  const token = await new SignJWT({ studentId: student.id, email: student.email, role: "STUDENT" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(KEY);

  const start = Date.now();
  console.log("Fetching RSC...");
  try {
    const result = execSync(`curl -H "RSC: 1" -s -w "\\n%{http_code}\\n" --cookie "session=${token}" http://127.0.0.1:3000/student/tasks`).toString();
    console.log("Result length:", result.length);
    console.log("Last 20 chars:", result.slice(-20));
  } catch(e) {
    console.log("Error:", e.message);
  }
  console.log("Took", Date.now() - start, "ms");
}
main();
