const { SignJWT } = require('jose');
const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

const JWT_SECRET = process.env.JWT_SECRET || "fallback_dev_secret_please_change_in_prod";
const KEY = new TextEncoder().encode(JWT_SECRET);

async function main() {
  const prisma = new PrismaClient();
  const student = await prisma.student.findFirst();
  if (!student) { console.log("No student found!"); return; }
  
  const token = await new SignJWT({ studentId: student.id, email: student.email, role: "STUDENT" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(KEY);

  console.log("Token:", token);
  const start = Date.now();
  const result = execSync(`curl -s -w "%{time_total}\n" --cookie "session=${token}" http://127.0.0.1:3000/student/tasks`).toString();
  console.log("Time:", result.split('\n').pop());
}
main();
