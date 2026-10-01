const fs = require('fs');

let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

schema = schema.replace(
  '  previousExperience String[]',
  '  previousExperience String[]\n  operatingSystems   String[]'
);

schema = schema.replace(
  '  weeklyAvailability WeeklyAvailability',
  '  weeklyAvailability WeeklyAvailability\n\n  // 5. Projects\n  projectTitle       String?\n  projectDesc        String?\n  projectLinks       String[]\n  projectFiles       String[]\n\n  // 6. Agreements\n  ethicsAgreement    Boolean @default(false)\n  termsAgreement     Boolean @default(false)'
);

schema = schema.replace(
  '  link             String?',
  '  link             String?\n  links            String[]\n  fileUrl          String?'
);

fs.writeFileSync('prisma/schema.prisma', schema);
