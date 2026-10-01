const fs = require('fs');
let content = fs.readFileSync('src/lib/actions/student-learning.ts', 'utf8');

const regex = /export async function submitTask\(.*?^}/ms;
const replacement = `export async function submitTask(taskId: string, formData: FormData) {
  const studentId = await getStudentSession();
  
  const task = await db.task.findUnique({ where: { id: taskId } });
  if (!task || task.status !== "PUBLISHED") {
    throw new Error("Task not available");
  }

  const isLate = new Date() > task.deadline;
  if (isLate && !task.allowLateSubmissions) {
    throw new Error("Submissions are locked. Late submissions are not allowed for this task.");
  }
  
  const contentText = formData.get("content")?.toString() || "";
  const studentNote = formData.get("studentNote")?.toString() || null;
  const linksRaw = formData.get("links")?.toString();
  const links = linksRaw ? JSON.parse(linksRaw) : [];
  
  const file = formData.get("file") as File | null;
  let fileUrl = null;
  let originalFileName = null;
  
  const existing = await db.submission.findUnique({ where: { studentId_taskId: { studentId, taskId } } });

  if (file && file.size > 0) {
    if (file.size > 10 * 1024 * 1024) throw new Error("File size must not exceed 10 MB.");
    
    // We import fs dynamically to avoid issues
    const { writeFile } = require("fs/promises");
    const { join } = require("path");
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFileName = \`\${Date.now()}-\${Math.round(Math.random() * 1e9)}-\${safeFileName}\`;
    const path = join(process.cwd(), "storage", "uploads", uniqueFileName);
    
    await writeFile(path, buffer);
    fileUrl = uniqueFileName;
    originalFileName = file.name;
  } else if (existing) {
    fileUrl = existing.fileUrl;
    originalFileName = existing.originalFileName;
  }

  await db.submission.upsert({
    where: { studentId_taskId: { studentId, taskId } },
    update: {
      content: contentText,
      studentNote,
      links,
      fileUrl,
      originalFileName,
      status: existing?.status === "GRADED" ? "GRADED" : (isLate ? "LATE" : "SUBMITTED"),
    },
    create: {
      studentId,
      taskId,
      content: contentText,
      studentNote,
      links,
      fileUrl,
      originalFileName,
      status: isLate ? "LATE" : "SUBMITTED",
      submissionType: "LINK"
    }
  });
}`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/lib/actions/student-learning.ts', content);
