const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

// Remove the inline project fields from Application
schema = schema.replace(
  '  // 5. Projects\n  projectTitle String?\n  projectDesc  String?\n  projectLinks String[]\n  projectFiles String[]\n\n',
  ''
);

// Update Project model
schema = schema.replace(
  '  githubUrl     String?\n  portfolioUrl  String?\n  fileReference String?',
  '  githubUrl     String?\n  portfolioUrl  String?\n  fileReference String?\n  links         String[]\n  files         String[]'
);

fs.writeFileSync('prisma/schema.prisma', schema);
