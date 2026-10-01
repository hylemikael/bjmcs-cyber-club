const fs = require('fs');
let content = fs.readFileSync('src/app/admin/applications/[id]/page.tsx', 'utf8');

// Insert OS and cyber topics in the tech section
content = content.replace(
  '{app.programmingLangs.length > 0 && (',
  `{app.operatingSystems.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase">Operating Systems</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {app.operatingSystems.map(os => <Badge key={os} variant="outline">{os}</Badge>)}
                  </div>
                </div>
              )}
              {app.cyberTopics.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase">Cyber Interests</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {app.cyberTopics.map(topic => <Badge key={topic} variant="outline">{topic}</Badge>)}
                  </div>
                </div>
              )}
              {app.programmingLangs.length > 0 && (`
);

// Insert Agreements in a new section or below Motivation
content = content.replace(
  '<h2 className="text-lg font-semibold text-slate-900 dark:text-white">Motivation</h2>',
  `<h2 className="text-lg font-semibold text-slate-900 dark:text-white">Motivation & Agreements</h2>`
);

content = content.replace(
  '</CardContent>\n          </Card>\n\n          {/* Danger Zone */}',
  `              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-semibold text-slate-500 uppercase">Agreements</h3>
                <ul className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <li>Ethics Agreement: {app.ethicsAgreement ? "Yes" : "No"}</li>
                  <li>Terms & Lab Usage: {app.termsAgreement ? "Yes" : "No"}</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}`
);

fs.writeFileSync('src/app/admin/applications/[id]/page.tsx', content);
