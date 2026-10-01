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

  console.log("Fetching RSC payload...");
  try {
    const result = execSync(`curl -H "RSC: 1" -s --cookie "session=${token}" "http://127.0.0.1:3000/student/tasks?_rsc=1q2w3"`).toString();
    console.log("Length:", result.length);
    console.log("First 200 chars:", result.slice(0, 200));
  } catch(e) {
    console.log("Error:", e.message);
  }
}
main();
