const fs = require('fs');
let content = fs.readFileSync('src/app/admin/tasks/[taskId]/page.tsx', 'utf8');

const regex = /originalFileName: sub\.originalFileName,/g;
const replacement = `originalFileName: sub.originalFileName,
        fileUrl: sub.fileUrl,
        links: sub.links,`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/app/admin/tasks/[taskId]/page.tsx', content);
