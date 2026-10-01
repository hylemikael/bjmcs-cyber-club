const fs = require('fs');
let content = fs.readFileSync('src/app/admin/tasks/[taskId]/ReviewList.tsx', 'utf8');

const regex = /{selectedData\.submission\.links && selectedData\.submission\.links\.length > 0 && \(/;
const replacement = `{selectedData.submission.link && (
                      <div className="space-y-1">
                        <span className="font-semibold">Legacy Link:</span> 
                        <a href={selectedData.submission.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all ml-2">{selectedData.submission.link}</a>
                      </div>
                    )}
                    
                    {selectedData.submission.links && selectedData.submission.links.length > 0 && (`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/app/admin/tasks/[taskId]/ReviewList.tsx', content);
