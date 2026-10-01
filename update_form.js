const fs = require('fs');

let form = fs.readFileSync('src/app/register/_components/RegistrationForm.tsx', 'utf8');

form = form.replace(
  'programmingLangs: [],',
  'programmingLangs: [],\n      operatingSystems: [],'
);

// Add OS select
form = form.replace(
  '</select>\n                </div>\n                \n                <div className="p-4 rounded-lg border',
  `</select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Programming Languages (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="Python, JS, C++..."
                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                    value={formData.techBackground.programmingLangs.join(", ")}
                    onChange={(e) => setFormData((p) => ({...p, techBackground: {...p.techBackground, programmingLangs: e.target.value.split(",").map(s => s.trim()).filter(Boolean)}}))}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Operating Systems (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="Windows, Linux, macOS..."
                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                    value={formData.techBackground.operatingSystems.join(", ")}
                    onChange={(e) => setFormData((p) => ({...p, techBackground: {...p.techBackground, operatingSystems: e.target.value.split(",").map(s => s.trim()).filter(Boolean)}}))}
                  />
                </div>
                
                <div className="p-4 rounded-lg border`
);

// Add Cyber Topics
form = form.replace(
  'onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData((p: any) => ({...p, techBackground: {...p.techBackground, cyberStudyDesc: e.target.value}}))} \n                      />\n                    </div>\n                  )}',
  `onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData((p: any) => ({...p, techBackground: {...p.techBackground, cyberStudyDesc: e.target.value}}))} 
                      />
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mt-4">Areas of Cybersecurity Interest (Comma separated)</label>
                      <input
                        type="text"
                        placeholder="Ethical Hacking, Forensics..."
                        className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 mt-1"
                        value={formData.techBackground.cyberTopics.join(", ")}
                        onChange={(e) => setFormData((p) => ({...p, techBackground: {...p.techBackground, cyberTopics: e.target.value.split(",").map(s => s.trim()).filter(Boolean)}}))}
                      />
                    </div>
                  )}`
);

// AI Notice for Motivation
form = form.replace(
  '<h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Motivation</h3>',
  '<h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Motivation & Projects</h3>'
);

form = form.replace(
  '<p className="text-sm text-slate-500 dark:text-slate-400 mt-1">We want to know what drives your interest in cybersecurity.</p>',
  `<p className="text-sm text-slate-500 dark:text-slate-400 mt-1">We want to know what drives your interest in cybersecurity.</p>
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg">
                  <p className="text-sm font-medium text-red-800 dark:text-red-400">
                    AI-generated answers are not allowed. Applicants must provide their own original responses. Use of AI-generated or copied responses may result in disqualification.
                  </p>
                </div>`
);

// Add Project section in Step 3
form = form.replace(
  '                  </select>\n                </div>\n              </div>\n            </div>\n          )}',
  `                  </select>
                </div>

                <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">Previous Projects (Optional)</h4>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Project Title</label>
                      <input 
                        type="text"
                        className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                        value={formData.projects[0]?.projectName || ""}
                        onChange={(e) => {
                          const newProjects = [...(formData.projects.length ? formData.projects : [{}])];
                          newProjects[0].projectName = e.target.value;
                          setFormData(p => ({...p, projects: newProjects}));
                        }}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Project Links (Comma separated)</label>
                      <input 
                        type="text"
                        placeholder="https://github.com/..., https://..."
                        className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                        value={(formData.projects[0]?.links || []).join(", ")}
                        onChange={(e) => {
                          const newProjects = [...(formData.projects.length ? formData.projects : [{}])];
                          newProjects[0].links = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                          setFormData(p => ({...p, projects: newProjects}));
                        }}
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}`
);

// Update Agreements
form = form.replace(
  '{ key: \'agreedToAccuracy\', text: \'I declare that all information provided is accurate and truthful.\' },',
  `{ key: 'agreedToAccuracy', text: 'I declare that all information provided is accurate and truthful.' },
                  { key: 'ethicsAgreement', text: 'I have read and agree to the Cybersecurity Ethics and Authorized Use Agreement.' },
                  { key: 'termsAgreement', text: 'I have read and agree to the Terms and Lab Usage Policy.' },`
);

fs.writeFileSync('src/app/register/_components/RegistrationForm.tsx', form);
