import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Update COLORS to be brighter blue & vibrant
const colorsRegex = /const COLORS = \[.*?\];/;
content = content.replace(colorsRegex, "const COLORS = ['#3B82F6', '#F43F5E', '#10B981', '#F97316', '#8B5CF6', '#ec4899', '#14b8a6', '#f59e0b', '#64748b'];");

// Change remaining old blues in the file
content = content.replace(/#0072BC/g, '#3B82F6');
content = content.replace(/#005A9C/g, '#2563EB');
content = content.replace(/#1f497d/g, '#1E40AF');

const tab2Regex = /\{\/\* TAB 2: DEPARTMENT HOTSPOTS \*\/\}[\s\S]*?(?=\{\/\* TAB 3: PROBLEM DEEP-DIVE & CAUSE \*\/})/;

const newTab2Content = `{/* TAB 2: DEPARTMENT HOTSPOTS */}
               {viewMode === 'dashboard' && (
                 <>
                   {/* 80/20 Concentration */}
                   <div className="lg:col-span-12 bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden mt-6">
                      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                         <h3 className="text-sm font-bold text-[#3B82F6] uppercase tracking-tight flex items-center gap-2">
                            <Activity className="w-5 h-5 text-[#F37021]" /> TỶ LỆ TẬP TRUNG RỦI RO (QUY TẮC 80/20)
                         </h3>
                      </div>
                      <div className="p-0 flex flex-col lg:flex-row">
                         <div className="lg:w-1/3 p-6 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col justify-center bg-orange-50/30">
                            {(() => {
                              if (!chartData.deptParetoData) return null;
                              const idx80 = chartData.deptParetoData.findIndex((d: any) => d.cumulativePercent >= 80);
                              const the80Depts = idx80 >= 0 ? chartData.deptParetoData.slice(0, idx80 + 1) : chartData.deptParetoData;
                              return (
                                <>
                                  <span className="text-4xl font-black text-[#F37021] tracking-tight mb-2">
                                     {the80Depts.length} / {chartData.deptParetoData.length}
                                     <span className="text-lg font-bold text-slate-500 ml-2">Phòng ban</span>
                                  </span>
                                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                     Chỉ <strong>{the80Depts.length} phòng ban</strong> đã tạo ra <strong>~80%</strong> số lượng sự cố/OFI toàn hệ thống. Đây là các Vùng Đỏ cần tập trung thanh tra và khắc phục triệt để.
                                  </p>
                                </>
                              );
                            })()}
                         </div>
                         <div className="lg:w-2/3 p-0">
                            <div className="overflow-x-auto custom-scrollbar">
                              <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-slate-100/50 text-slate-600 font-bold">
                                  <tr>
                                    <th className="px-5 py-3 border-b border-slate-200">#</th>
                                    <th className="px-5 py-3 border-b border-slate-200">Phòng Ban (Vùng Đỏ)</th>
                                    <th className="px-5 py-3 border-b border-slate-200 text-right">Số lượng lỗi</th>
                                    <th className="px-5 py-3 border-b border-slate-200 text-right">% Tỷ trọng</th>
                                    <th className="px-5 py-3 border-b border-slate-200 text-right">% Tích lũy</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(() => {
                                    if (!chartData.deptParetoData) return null;
                                    const idx80 = chartData.deptParetoData.findIndex((d: any) => d.cumulativePercent >= 80);
                                    const the80Depts = idx80 >= 0 ? chartData.deptParetoData.slice(0, idx80 + 1) : chartData.deptParetoData;
                                    return the80Depts.map((d: any, i: number) => {
                                      const total = chartData.totalRecords || 1;
                                      const pct = ((d.value / total) * 100).toFixed(1);
                                      return (
                                      <tr key={i} className="hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors">
                                        <td className="px-5 py-3 font-bold text-[#F37021]">{i + 1}</td>
                                        <td className="px-5 py-3 font-bold text-slate-800">{d.name}</td>
                                        <td className="px-5 py-3 text-right font-black text-rose-600">{d.value}</td>
                                        <td className="px-5 py-3 text-right font-medium text-slate-600">{pct}%</td>
                                        <td className="px-5 py-3 text-right font-black text-slate-800">{d.cumulativePercent}%</td>
                                      </tr>
                                    )});
                                  })()}
                                </tbody>
                              </table>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Chi tiết Top 3 Phòng ban */}
                   <div className="lg:col-span-12 mt-6">
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-500" /> PHÂN TÍCH NHÓM LỖI TRỌNG TÂM TẠI TOP 3 PHÒNG BAN RỦI RO
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                         {chartData.deptParetoData?.slice(0, 3).map((dept: any, idx: number) => {
                             const deptItem = chartData.deptCategoryData?.find((d: any) => d.name === dept.name);
                             const errCats = Object.entries(deptItem || {})
                                .filter(([k,v]) => k !== 'name' && k !== 'total')
                                .map(([k,v]) => ({ name: k, value: Number(v) }))
                                .sort((a,b) => b.value - a.value)
                                .slice(0, 3);
                             
                             return (
                               <div key={idx} className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-[300px] border-t-4 border-t-rose-500">
                                 <div className="mb-4">
                                   <div className="flex justify-between items-start">
                                      <span className="text-xl font-black text-slate-900 tracking-tight block uppercase leading-tight line-clamp-2" title={dept.name}>
                                        <span className="text-rose-500 mr-1">#{idx + 1}</span> {dept.name}
                                      </span>
                                   </div>
                                   <span className="text-xs font-medium text-slate-500 mt-1 block">Tổng: <strong className="text-rose-600">{dept.value} sự cố</strong></span>
                                 </div>
                                 <div className="flex-1 w-full relative">
                                   <ResponsiveContainer width="100%" height="100%">
                                      <BarChart data={errCats} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 10, fill: '#475569'}} axisLine={false} tickLine={false} />
                                        <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '2px', padding: '6px', fontSize: '11px', border: '1px solid #e2e8f0'}} />
                                        <Bar dataKey="value" fill="#3B82F6" barSize={16} radius={[0, 2, 2, 0]}>
                                          {errCats.map((entry: any, index: number) => (
                                            <Cell key={\`cell-\${index}\`} fill={index === 0 ? '#F43F5E' : '#3B82F6'} />
                                          ))}
                                          <LabelList dataKey="value" position="right" style={{ fontSize: '10px', fontWeight: 'bold', fill: '#475569' }} />
                                        </Bar>
                                      </BarChart>
                                   </ResponsiveContainer>
                                 </div>
                               </div>
                             );
                         })}
                      </div>
                   </div>

                   <div className="lg:col-span-12 bg-white border border-slate-200 rounded-sm shadow-sm flex flex-col overflow-hidden mb-6 mt-6">
                     <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
                       <h3 className="text-sm font-bold text-[#3B82F6] uppercase tracking-tight">NC/OFI PHÂN TÍCH CHI TIẾT CÁC PHÒNG BAN (PARETO)</h3>
                     </div>
                     <div className="flex-1 w-full p-4 h-[450px]">
                       <ResponsiveContainer width="100%" height="100%">
                         <ComposedChart data={chartData.deptCategoryData} margin={{ top: 10, right: 40, left: -20, bottom: 60 }}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                           <XAxis dataKey="name" tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} angle={-30} textAnchor="end" height={60} />
                           <YAxis yAxisId="left" tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                           <YAxis yAxisId="right" orientation="right" tick={{fontSize: 10, fill: '#64748b'}} domain={[0, 100]} axisLine={false} tickLine={false} />
                           <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '2px', padding: '8px', fontSize: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                           <Legend wrapperStyle={{fontSize: '10px'}} />
                           {chartData.allCategoriesInFiltered?.map((c: string, i: number) => (
                             <Bar key={c} yAxisId="left" dataKey={c} stackId="a" fill={COLORS[i % COLORS.length]} maxBarSize={40} />
                           ))}
                           {chartData.deptParetoData && (
                             <Line yAxisId="right" type="monotone" data={chartData.deptParetoData} dataKey="cumulativePercent" name="% Tích lũy" stroke="#F43F5E" strokeWidth={3} dot={{r: 4, fill: '#F43F5E'}} />
                           )}
                         </ComposedChart>
                       </ResponsiveContainer>
                     </div>
                   </div>
                 </>
               )}

               <div className="mt-8 border-t-2 border-slate-100 pt-6"></div>
               {/* TAB 3: PROBLEM DEEP-DIVE & CAUSE */}`;

content = content.replace(tab2Regex, newTab2Content);

// Fix LabelList and Cell missing imports from recharts
if (!content.includes('LabelList')) {
  content = content.replace('XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Line', 'XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Line, Cell, LabelList');
}

fs.writeFileSync('src/App.tsx', content);
