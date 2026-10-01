const fs = require('fs');
let content = fs.readFileSync('src/app/admin/applications/[id]/page.tsx', 'utf8');

content = content.replace(
  '{/* Danger Zone */}',
  `{/* Projects Section */}
          {app.projects.length > 0 && (
            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Projects</h2>
                <div className="space-y-6">
                  {app.projects.map(proj => (
                    <div key={proj.id} className="border-b border-slate-100 dark:border-slate-800 pb-4 last:border-0 last:pb-0">
                      <h3 className="font-medium text-slate-900 dark:text-white">{proj.projectName}</h3>
                      {proj.description && <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{proj.description}</p>}
                      {proj.links && proj.links.length > 0 && (
                        <div className="mt-2 text-sm text-blue-600 dark:text-blue-400 space-y-1">
                          {proj.links.map((link, idx) => (
                            <a key={idx} href={link} target="_blank" className="block hover:underline">{link}</a>
                          ))}
                        </div>
                      )}
                      {proj.files && proj.files.length > 0 && (
                        <div className="mt-2 space-y-1 text-sm">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Files:</span>
                          {proj.files.map((file, idx) => (
                            <a key={idx} href={\`/api/files/\${file}\`} target="_blank" className="ml-2 text-blue-600 hover:underline">Download {file}</a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Danger Zone */}`
);

fs.writeFileSync('src/app/admin/applications/[id]/page.tsx', content);
