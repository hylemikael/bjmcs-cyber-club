const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

// 1. Add Announcement and AnnouncementTarget
const announcementModels = `
enum AnnouncementStatus {
  DRAFT
  PUBLISHED
}

model AnnouncementTarget {
  id             String               @id @default(cuid())
  announcementId String
  announcement   Announcement         @relation(fields: [announcementId], references: [id], onDelete: Cascade)
  targetType     AssignmentTargetType
  groupId        String?
  group          Group?               @relation(fields: [groupId], references: [id], onDelete: Cascade)
  studentId      String?
  student        Student?             @relation(fields: [studentId], references: [id], onDelete: Cascade)
}

model Announcement {
  id          String               @id @default(cuid())
  title       String
  content     String               @db.Text
  status      AnnouncementStatus   @default(DRAFT)
  publishedAt DateTime?
  expiresAt   DateTime?
  targets     AnnouncementTarget[]
  createdAt   DateTime             @default(now())
  updatedAt   DateTime             @updatedAt
}

model AuditLog {
  id        String   @id @default(cuid())
  actor     String
  action    String
  target    String?
  timestamp DateTime @default(now())
}
`;

schema = schema.replace('// Announcements / Messages', announcementModels + '\n\n// Announcements / Messages');

// 2. Update LearningMaterial with targeting
const materialTargetModels = `
model LearningMaterialTarget {
  id          String               @id @default(cuid())
  materialId  String
  material    LearningMaterial     @relation(fields: [materialId], references: [id], onDelete: Cascade)
  targetType  AssignmentTargetType
  groupId     String?
  group       Group?               @relation(fields: [groupId], references: [id], onDelete: Cascade)
  studentId   String?
  student     Student?             @relation(fields: [studentId], references: [id], onDelete: Cascade)
}
`;

schema = schema.replace('model LearningMaterial {', materialTargetModels + '\nmodel LearningMaterial {');
schema = schema.replace(/model LearningMaterial \{[\s\S]*?\}\n/, (match) => {
  return match.replace('createdAt   DateTime       @default(now())', 'resourceType String         @default("LINK")\n  targets     LearningMaterialTarget[]\n  createdAt   DateTime       @default(now())');
});

// Update Group and Student to add back relations for AnnouncementTarget and LearningMaterialTarget
schema = schema.replace('taskAssignments    TaskAssignment[]', 'taskAssignments    TaskAssignment[]\n  announcementTargets AnnouncementTarget[]\n  materialTargets     LearningMaterialTarget[]');
schema = schema.replace('taskAssignments   TaskAssignment[]', 'taskAssignments   TaskAssignment[]\n  announcementTargets AnnouncementTarget[]\n  materialTargets     LearningMaterialTarget[]');

fs.writeFileSync('prisma/schema.prisma', schema);
