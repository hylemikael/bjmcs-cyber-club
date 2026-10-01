const fs = require('fs');

let content = fs.readFileSync('src/app/student/page.tsx', 'utf8');

const regex = /<Card className="bg-white dark:bg-\\[#0f172a\\] border-slate-200 dark:border-slate-800 shadow-sm">\s*<CardHeader className="border-b border-slate-100 dark:border-slate-800\/60 pb-4">\s*<CardTitle className="text-lg flex items-center gap-2">.*?<\/Link>\s*<\/div>\s*<\/CardContent>\s*<\/Card>/s;

const replacement = `<Card className="bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              Progress Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {(() => {
                const taskProgress = publishedTasksCount > 0 ? Math.round((completedTasks / publishedTasksCount) * 100) : 0;
                const attendanceRate = attendanceCount > 0 ? Math.round((presentCount / attendanceCount) * 100) : 0;
                const courseProgress = Math.round((taskProgress + attendanceRate) / 2);
                
                return (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-slate-700 dark:text-slate-300">Course Progress</span>
                        <span className="text-blue-600 dark:text-blue-400">{courseProgress}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-500" style={{ width: \`\${courseProgress}%\` }} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-slate-700 dark:text-slate-300">Lab & Task Progress</span>
                        <span className="text-cyan-600 dark:text-cyan-400">{taskProgress}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-600 dark:bg-cyan-500 transition-all duration-500" style={{ width: \`\${taskProgress}%\` }} />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{completedTasks} of {publishedTasksCount} completed</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-slate-700 dark:text-slate-300">Attendance</span>
                        <span className="text-emerald-600 dark:text-emerald-400">{attendanceRate}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-500" style={{ width: \`\${attendanceRate}%\` }} />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{presentCount} present out of {attendanceCount} sessions</p>
                    </div>
                  </>
                );
              })()}
            </div>
          </CardContent>
        </Card>`;

content = content.replace(regex, replacement);

fs.writeFileSync('src/app/student/page.tsx', content);
