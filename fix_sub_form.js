const fs = require('fs');
let content = fs.readFileSync('src/app/student/tasks/[taskId]/SubmissionForm.tsx', 'utf8');

const replacement = `const formData = new FormData(e.currentTarget);
    const finalLinks = [...links];
    if (linkInput && linkInput.trim() !== "") {
      try {
        new URL(linkInput);
        finalLinks.push(linkInput.trim());
      } catch(e) {}
    }
    formData.append("links", JSON.stringify(finalLinks));`;

content = content.replace(
  'const formData = new FormData(e.currentTarget);\n    formData.append("links", JSON.stringify(links));',
  replacement
);

fs.writeFileSync('src/app/student/tasks/[taskId]/SubmissionForm.tsx', content);
