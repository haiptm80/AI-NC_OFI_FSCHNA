import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetParetoChart = `<Bar yAxisId="left" dataKey="value" name="Số lượng" fill="#0072BC" radius={[2, 2, 0, 0]} barSize={32} />`;
const replaceParetoChart = `<Bar yAxisId="left" dataKey="value" name="Số lượng" fill="#0072BC" radius={[2, 2, 0, 0]} barSize={32} onClick={(data) => setFilters(prev => ({ ...prev, category: (data as any)?.name || prev.category }))} cursor="pointer" />`;
content = content.replace(targetParetoChart, replaceParetoChart);

const targetStackedBar = `return <Bar key={d} dataKey={d} stackId="a" fill={COLORS[i % COLORS.length]} radius={i === chartData.topDepts.length - 1 ? [2, 2, 0, 0] : [0, 0, 0, 0]} maxBarSize={48} />;`;
const replaceStackedBar = `return <Bar key={d} dataKey={d} stackId="a" fill={COLORS[i % COLORS.length]} radius={i === chartData.topDepts.length - 1 ? [2, 2, 0, 0] : [0, 0, 0, 0]} maxBarSize={48} onClick={() => setFilters(prev => ({ ...prev, dept: d }))} cursor="pointer" />;`;
content = content.replace(targetStackedBar, replaceStackedBar);

const targetDeptClass = `className={\`bg-white border border-slate-200 p-5 rounded-sm shadow-sm flex flex-col \${viewMode === 'focus' ? 'lg:col-span-12 h-[600px]' : 'lg:col-span-7 h-[420px]'}\`}`;
const replaceDeptClass = `className={\`bg-white border border-slate-200 p-5 rounded-sm shadow-sm flex flex-col \${viewMode === 'focus' ? 'lg:col-span-12 h-[600px]' : 'lg:col-span-5 h-[420px]'}\`}`;
content = content.replace(targetDeptClass, replaceDeptClass);

const targetAIClass = `className={\`bg-white border border-slate-200 rounded-sm shadow-sm flex flex-col \${viewMode === 'focus' ? 'lg:col-span-12' : 'lg:col-span-5 h-[420px]'}\`}`;
const replaceAIClass = `className={\`bg-white border border-slate-200 rounded-sm shadow-sm flex flex-col \${viewMode === 'focus' ? 'lg:col-span-12' : 'lg:col-span-4 h-[420px]'}\`}`;
content = content.replace(targetAIClass, replaceAIClass);

const pieChartInsert = `

               {/* Severity Pie Chart */}
               {(viewMode === 'dashboard') && chartData.severityPieData && chartData.severityPieData.length > 0 && (
                 <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm flex flex-col lg:col-span-3 h-[420px]">
                   <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2 shrink-0">
                     <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Nguy cơ rủi ro</h3>
                   </div>
                   <div className="flex-1 w-full mt-2">
                     <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                         <Pie
                           data={chartData.severityPieData}
                           cx="50%"
                           cy="45%"
                           innerRadius={50}
                           outerRadius={80}
                           paddingAngle={2}
                           dataKey="value"
                         >
                           {chartData.severityPieData.map((entry: any, index: number) => {
                              // Auto detect color based on severity string
                              let color = '#9ca3af'; // default gray
                              const name = String(entry.name).toLowerCase();
                              if (name.includes('critical') || name.includes('nc') || name.includes('nặng') || name.includes('đỏ') || name.includes('cao')) {
                                color = '#f43f5e'; // rose-500
                              } else if (name.includes('major') || name.includes('vàng') || name.includes('trung bình') || name.includes('medium')) {
                                color = '#f59e0b'; // amber-500
                              } else if (name.includes('minor') || name.includes('xanh') || name.includes('thấp') || name.includes('low') || name.includes('ob')) {
                                color = '#0ea5e9'; // sky-500
                              } else {
                                const COLORS = ['#8b5cf6', '#ec4899', '#0072BC', '#00A859'];
                                color = COLORS[index % COLORS.length];
                              }
                              return <Cell 
                                key={\`cell-\${index}\`} 
                                fill={color} 
                                onClick={() => {
                                  // Not filtering yet, but could add severityFilter later. Keep it clickable placeholder.
                                  console.log('Clicked', entry);
                                }}
                                cursor="pointer"
                                className="transition-all hover:opacity-80 outline-none"
                              />
                           })}
                         </Pie>
                         <Tooltip contentStyle={{ borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }} />
                         <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '11px' }} />
                       </PieChart>
                     </ResponsiveContainer>
                   </div>
                 </div>
               )}
`;

const stackBarEndMarker = `                 </div>\n               )}`;
const stackBarEndIdx = content.indexOf(stackBarEndMarker, content.indexOf(`{/* Stacked Bar Dept x Time */}`));

if (stackBarEndIdx !== -1) {
    const splitPoint = stackBarEndIdx + stackBarEndMarker.length;
    content = content.slice(0, splitPoint) + pieChartInsert + content.slice(splitPoint);
} else {
    console.error("Could not find stack bar end index");
}

fs.writeFileSync('src/App.tsx', content);
