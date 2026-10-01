const fs = require('fs');
let content = fs.readFileSync('src/components/layout/header.tsx', 'utf8');

content = content.replace(
  /<Button variant="ghost" className="hidden lg:flex" asChild>\s*<Link href="\/login">Log In<\/Link>\s*<\/Button>/g,
  '<Link href="/login" className="hidden lg:flex inline-flex items-center justify-center rounded-lg font-medium px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-all duration-200">Log In</Link>'
);

content = content.replace(
  /<Button className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700" asChild>\s*<Link href="\/apply">Apply Now<\/Link>\s*<\/Button>/g,
  '<Link href="/register" className="inline-flex items-center justify-center rounded-lg font-medium px-4 py-2 text-sm bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition-all duration-200">Apply Now</Link>'
);

content = content.replace(
  /<Button variant="outline" className="w-full justify-center" asChild>\s*<Link href="\/login" onClick=\{([^}]+)\}>Log In<\/Link>\s*<\/Button>/g,
  '<Link href="/login" onClick={$1} className="w-full justify-center inline-flex items-center rounded-lg font-medium px-4 py-2 text-sm border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 transition-all duration-200">Log In</Link>'
);

content = content.replace(
  /<Button className="w-full justify-center bg-blue-600 text-white hover:bg-blue-700" asChild>\s*<Link href="\/apply" onClick=\{([^}]+)\}>Apply Now<\/Link>\s*<\/Button>/g,
  '<Link href="/register" onClick={$1} className="w-full justify-center inline-flex items-center rounded-lg font-medium px-4 py-2 text-sm bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition-all duration-200">Apply Now</Link>'
);

fs.writeFileSync('src/components/layout/header.tsx', content);
