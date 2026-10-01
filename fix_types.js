const fs = require('fs');

// 1. Fix API route
let route = fs.readFileSync('src/app/api/files/[filename]/route.ts', 'utf8');
route = route.replace(
  'export async function GET(request: NextRequest, { params }: { params: { filename: string } }) {',
  'export async function GET(request: NextRequest, { params }: { params: Promise<{ filename: string }> }) {'
);
route = route.replace(
  'const filename = params.filename;',
  'const { filename } = await params;'
);
fs.writeFileSync('src/app/api/files/[filename]/route.ts', route);

// 2. Fix ReviewList
let review = fs.readFileSync('src/app/admin/tasks/[taskId]/ReviewList.tsx', 'utf8');
review = review.replace(
  'selectedData.submission.links.map((link, i) => (',
  'selectedData.submission.links.map((link: string, i: number) => ('
);
fs.writeFileSync('src/app/admin/tasks/[taskId]/ReviewList.tsx', review);

// 3. Fix RegistrationForm
let form = fs.readFileSync('src/app/register/_components/RegistrationForm.tsx', 'utf8');
form = form.replace(/setFormData\(\(p\) =>/g, 'setFormData((p: any) =>');
form = form.replace(/setFormData\(p =>/g, 'setFormData((p: any) =>');
fs.writeFileSync('src/app/register/_components/RegistrationForm.tsx', form);
