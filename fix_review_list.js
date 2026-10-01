const fs = require('fs');

let content = fs.readFileSync('src/app/admin/tasks/[taskId]/ReviewList.tsx', 'utf8');

const regex = /<div><span className="font-semibold">Type:<\/span>.*?\(Storage not implemented in MVP\)<\/div>\n                    \)}/s;
const replacement = `
                    {selectedData.submission.links && selectedData.submission.links.length > 0 && (
                      <div className="space-y-1">
                        <span className="font-semibold">Links:</span>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                          {selectedData.submission.links.map((link, i) => (
                            <li key={i}>
                              <a href={link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all">{link}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {selectedData.submission.fileUrl && selectedData.submission.originalFileName && (
                      <div>
                        <span className="font-semibold">File:</span> 
                        <a href={\`/api/files/\${selectedData.submission.fileUrl}\`} target="_blank" className="ml-2 text-blue-600 hover:underline font-medium bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded inline-flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                          Download {selectedData.submission.originalFileName}
                        </a>
                      </div>
                    )}`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/app/admin/tasks/[taskId]/ReviewList.tsx', content);
