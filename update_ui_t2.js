import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Colors
content = content.replace(/#1f497d/g, '#0072BC');
content = content.replace(/#143254/g, '#005A9C');

// Remove tab navigation block
const tabNavRegex = /\{\/\* Dashboard Tabs for Video Scenes \*\/\}[\s\S]*?(?=\{\/\* TAB 1: EXECUTIVE OVERVIEW \(Sức khỏe hệ thống\) \*\/})/g;
content = content.replace(tabNavRegex, '');

// Process all tab blocks to remove the "activeDashboardTab === X && " condition so they render sequentially
content = content.replace(/\{viewMode === 'dashboard' && activeDashboardTab === 1 && \(/g, "{viewMode === 'dashboard' && (");
content = content.replace(/\{viewMode === 'dashboard' && activeDashboardTab === 2 && \(/g, "\n               {/* TAB 2: DEPARTMENT HOTSPOTS */}\n               {viewMode === 'dashboard' && (");
content = content.replace(/\{viewMode === 'dashboard' && activeDashboardTab === 3 && \(/g, "\n               {/* TAB 3: PROBLEM DEEP-DIVE & CAUSE */}\n               {viewMode === 'dashboard' && (");
content = content.replace(/\{viewMode === 'dashboard' && activeDashboardTab === 4 && \(/g, "\n               {/* TAB 4: HIGHLIGHTS & CAPA */}\n               {viewMode === 'dashboard' && (");

// Enhance section 2 display. Let's find the TAB 2 code and replace it.
const tab2Regex = /\{\/\* TAB 2: DEPARTMENT HOTSPOTS \*\/\}[\s\S]*?(?=\{\/\* TAB 3: PROBLEM DEEP-DIVE & CAUSE \*\/})/;

const newTab2Content = `{/* TAB 2: DEPARTMENT HOTSPOTS */}
               {viewMode === 'dashboard' && (
                 <>
                   <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div className="bg-white p-5 rounded-sm border-l-4 border-l-[#c0504d] shadow-sm flex flex-col gap-2 transition-all">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-red-50 text-[#c0504d] rounded-sm shrink-0">
                             <AlertTriangle className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Top 3 Phòng Ban Rủi Ro</span>
                            <span className="text-sm font-bold text-slate-900 tracking-tight block">Phòng ban có nhiều nhóm lỗi nghiêm trọng nhất</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 relative z-10 w-full mt-2 text-xs">
                           {chartData.deptParetoData?.slice(0, 3).map((dept, idx) => {
                             // Find the top error category for this dept
                             const deptItem = chartData.deptCategoryData?.find(d => d.name === dept.name);
                             const errCats = Object.entries(deptItem || {}).filter(([k,v]) => k !== 'name' && k !== 'total').sort((a,b) => b[1] - a[1]);
                             const topErr = errCats[0]?.[0] || 'N/A';
                             return (
                               <div key={idx} className="flex justify-between items-center bg-slate-50 p-2 rounded-sm border border-slate-100">
                                 <div>
                                   <span className="font-bold text-[#0072BC] uppercase block">{idx + 1}. {dept.name}</span>
                                   <span className="text-[10px] text-slate-500 font-medium">Lỗi phổ biến: {topErr}</span>
                                 </div>
                                 <div className="text-right">
                                   <span className="text-sm font-black text-rose-600 block">{dept.value} <span className="text-[10px] font-normal text-slate-500">lỗi</span></span>
                                 </div>
                               </div>
                             );
                           })}
                        </div>
                      </div>
                      <div className="bg-white p-5 rounded-sm border-l-4 border-l-[#F37021] shadow-sm flex flex-col gap-2 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-50 text-[#F37021] rounded-sm shrink-0">
                             <Activity className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Tỷ lệ tập trung rủi ro (Quy tắc 80/20)</span>
                            <span className="text-xl font-black text-slate-900 tracking-tight block">Chiếm 80% Tổng Số Lỗi</span>
                          </div>
                        </div>
                        <div className="flex-1 mt-2 flex flex-col justify-center">
                           {(() => {
                             if (!chartData.deptParetoData) return null;
                             const idx80 = chartData.deptParetoData.findIndex((d) => d.cumulativePercent >= 80);
                             const the80Depts = idx80 >= 0 ? chartData.deptParetoData.slice(0, idx80 + 1) : chartData.deptParetoData;
                             return (
                               <>
                                 <span className="text-2xl font-black text-[#F37021] mb-2">{the80Depts.length} / {chartData.deptParetoData.length} <span className="text-sm font-medium text-slate-500">Phòng ban</span></span>
                                 <p className="text-xs text-slate-600 font-medium mb-2 leading-relaxed">
                                   Chỉ <strong>{the80Depts.length} phòng ban</strong> đã tạo ra <strong>~80%</strong> số lượng sự cố/OFI. Cần tập trung thanh tra và hành động cải tiến ngay tại các bộ phận này:
                                 </p>
                                 <div className="flex flex-wrap gap-1">
                                   {the80Depts.map((d, i) => (
                                     <span key={i} className="bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded-sm border border-orange-100 text-[10px] font-bold uppercase">{d.name} ({d.cumulativePercent}%)</span>
                                   ))}
                                 </div>
                               </>
                             );
                           })()}
                        </div>
                      </div>
                   </div>

                   <div className="lg:col-span-12 bg-white border border-slate-200 rounded-sm shadow-sm flex flex-col overflow-hidden mb-6 mt-4">
                     <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
                       <h3 className="text-sm font-bold text-[#0072BC] uppercase tracking-tight">NC/OFI PHÂN TÍCH CHI TIẾT THEO PHÒNG BAN (PARETO)</h3>
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
                           {chartData.allCategoriesInFiltered?.map((c, i) => (
                             <Bar key={c} yAxisId="left" dataKey={c} stackId="a" fill={COLORS[i % COLORS.length]} maxBarSize={40} />
                           ))}
                           {chartData.deptParetoData && (
                             <Line yAxisId="right" type="monotone" data={chartData.deptParetoData} dataKey="cumulativePercent" name="% Tích lũy" stroke="#c0504d" strokeWidth={3} dot={{r: 4, fill: '#c0504d'}} />
                           )}
                         </ComposedChart>
                       </ResponsiveContainer>
                     </div>
                   </div>
                 </>
               )}
`;

content = content.replace(tab2Regex, newTab2Content);

// Add top margin to subsequent blocks so they stack nicely
content = content.replace(/\{\/\* TAB 3: /g, '<div className="mt-8 border-t-2 border-slate-100 pt-6"></div>\n               {/* TAB 3: ');
content = content.replace(/\{\/\* TAB 4: /g, '<div className="mt-8 border-t-2 border-slate-100 pt-6"></div>\n               {/* TAB 4: ');

fs.writeFileSync('src/App.tsx', content);
