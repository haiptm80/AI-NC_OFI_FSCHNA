import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// The block to replace is from `{/* KPI Cards */}` down to `</>\n               )}`.
const startMarker = `{/* KPI Cards */}`;
const endMarker = `</>\n               )}`;

const replaceStart = content.indexOf(startMarker);
const replaceEnd = content.indexOf(endMarker) + endMarker.length;

if (replaceStart === -1 || replaceEnd === -1) {
  console.log("Could not find markers!");
  process.exit(1);
}

const newLayout = `
               {/* TAB 1: EXECUTIVE OVERVIEW (Sức khỏe hệ thống) */}
               {viewMode === 'dashboard' && activeDashboardTab === 1 && (
                 <>
                   <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm flex flex-col justify-between border-l-4 border-l-[#1f497d] transition-all hover:shadow-md">
                         <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Tổng sự cố/ghi nhận</span>
                         <div className="flex justify-between items-end">
                            <span className="text-4xl font-black text-slate-900 tracking-tight">{chartData.totalRecords}</span>
                            {chartData.trends && renderTrend(chartData.trends.total, true)}
                         </div>
                      </div>
                      <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm flex flex-col justify-between border-l-4 border-l-[#9bbb59] transition-all hover:shadow-md relative overflow-hidden">
                         <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Tỷ lệ đóng lỗi (Closure Rate)</span>
                         <div className="flex justify-between items-end">
                            <div className="flex items-end gap-2">
                               <span className="text-4xl font-black text-[#9bbb59] tracking-tight">{(chartData.totalRecords > 0 ? (chartData.resolvedErrors / chartData.totalRecords) * 100 : 0).toFixed(1)}%</span>
                            </div>
                            {chartData.trends && renderTrend(chartData.trends.resolved, false)}
                         </div>
                      </div>
                      <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm flex flex-col justify-between border-l-4 border-l-[#c0504d] transition-all hover:shadow-md relative overflow-hidden">
                         <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Tỷ lệ cảnh báo (NC/Critical)</span>
                         <div className="flex justify-between items-end">
                            <div className="flex items-end gap-2">
                               <span className="text-4xl font-black text-[#c0504d] tracking-tight">{(chartData.totalRecords > 0 ? (chartData.criticalErrors / chartData.totalRecords) * 100 : 0).toFixed(1)}%</span>
                            </div>
                            {chartData.trends && renderTrend(chartData.trends.critical, true)}
                         </div>
                      </div>
                   </div>

                   <div className="lg:col-span-12 bg-white border border-slate-200 rounded-sm shadow-sm flex flex-col overflow-hidden">
                     <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                       <h3 className="text-sm font-bold text-[#1f497d] uppercase tracking-tight flex items-center gap-2">
                         <TrendingUp className="w-4 h-4 text-[#F37021]" /> XU HƯỚNG PHÁT SINH THEO NĂM HỌC
                       </h3>
                     </div>
                     <div className="p-4 flex-1 h-[400px]">
                       <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={chartData.lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                           <XAxis dataKey="name" tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                           <YAxis tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                           <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '2px', padding: '8px', fontSize: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                           <Legend wrapperStyle={{fontSize: '10px', paddingTop: '10px'}} />
                           {chartData.allCategoriesInFiltered?.map((c: string, i: number) => (
                             <Bar key={c} dataKey={c} stackId="a" fill={COLORS[i % COLORS.length]} maxBarSize={50} />
                           ))}
                         </BarChart>
                       </ResponsiveContainer>
                     </div>
                   </div>
                 </>
               )}

               {/* TAB 2: DEPARTMENT HOTSPOTS */}
               {viewMode === 'dashboard' && activeDashboardTab === 2 && (
                 <>
                   <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-5 rounded-sm border border-[#c0504d] shadow-sm flex gap-4 items-center transition-all">
                        <div className="p-3 bg-red-50 text-[#c0504d] rounded-sm shrink-0">
                           <AlertTriangle className="w-8 h-8" />
                        </div>
                        <div>
                           <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Top 1 rủi ro phòng ban</span>
                           <span className="text-xl font-black text-slate-900 tracking-tight block">Khối Đào tạo / Tổ bộ môn</span>
                           <span className="text-xs text-slate-500 font-medium">Chiếm tỷ trọng lỗi cao nhất dựa trên hồ sơ thanh tra.</span>
                        </div>
                      </div>
                      <div className="bg-white p-5 rounded-sm border border-[#F37021] shadow-sm flex gap-4 items-center transition-all">
                        <div className="p-3 bg-orange-50 text-[#F37021] rounded-sm shrink-0">
                           <Activity className="w-8 h-8" />
                        </div>
                        <div>
                           <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Tỷ lệ tập trung rủi ro</span>
                           <span className="text-xl font-black text-slate-900 tracking-tight block">80% lỗi ở 4 phòng ban</span>
                           <span className="text-xs text-slate-500 font-medium">Đào tạo, CTHS, Văn phòng, Tuyển sinh.</span>
                        </div>
                      </div>
                   </div>

                   <div className="lg:col-span-12 bg-white border border-slate-200 rounded-sm shadow-sm flex flex-col overflow-hidden">
                     <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
                       <h3 className="text-sm font-bold text-[#1f497d] uppercase tracking-tight">NC/OFI PHÂN TÍCH THEO PHÒNG BAN (PARETO)</h3>
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
                             <Line yAxisId="right" type="monotone" data={chartData.deptParetoData} dataKey="cumulativePercent" name="% Tích lũy" stroke="#c0504d" strokeWidth={3} dot={{r: 4, fill: '#c0504d'}} />
                           )}
                         </ComposedChart>
                       </ResponsiveContainer>
                     </div>
                   </div>
                 </>
               )}

               {/* TAB 3: PROBLEM DEEP-DIVE & CAUSE */}
               {viewMode === 'dashboard' && activeDashboardTab === 3 && (
                 <>
                   <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { title: 'Hồ sơ chuyên môn', keyword: 'Chậm tiến độ giáo án, lệch khung PDP', color: 'border-l-[#1f497d]' },
                        { title: 'Quy trình hành chính', keyword: 'Lưu trữ hồ sơ, chậm phê duyệt văn bản', color: 'border-l-[#c0504d]' },
                        { title: 'An toàn học đường', keyword: 'Sót điểm danh, vệ sinh', color: 'border-l-[#F37021]' },
                      ].map((card, i) => (
                        <div key={i} className={\`bg-white p-5 rounded-sm border border-slate-200 shadow-sm flex flex-col justify-between border-l-4 \${card.color}\`}>
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Nhóm lỗi trọng tâm</span>
                          <span className="text-lg font-black text-slate-900 tracking-tight block mb-2">{card.title}</span>
                          <span className="text-xs text-slate-500 font-medium">Keyword: {card.keyword}</span>
                        </div>
                      ))}
                   </div>

                   <div className="lg:col-span-6 bg-white border border-slate-200 rounded-sm shadow-sm flex flex-col overflow-hidden h-[350px]">
                     <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                       <h3 className="text-sm font-bold text-[#1f497d] uppercase tracking-tight flex items-center gap-2">
                         <AlertTriangle className="w-4 h-4 text-rose-500" /> BIỂU ĐỒ PARETO THEO NHÓM LỖI
                       </h3>
                     </div>
                     <div className="p-4 flex-1">
                       <ResponsiveContainer width="100%" height="100%">
                         <ComposedChart data={chartData.barData} margin={{ top: 10, right: 30, left: -20, bottom: 40 }}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                           <XAxis dataKey="name" tick={{fontSize: 9, fill: '#1f497d'}} interval={0} angle={-45} textAnchor="end" axisLine={false} tickLine={false} />
                           <YAxis yAxisId="left" tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                           <YAxis yAxisId="right" orientation="right" tick={{fontSize: 10, fill: '#64748b'}} domain={[0, 100]} axisLine={false} tickLine={false} />
                           <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '2px', padding: '8px', fontSize: '12px', border: '1px solid #e2e8f0'}} />
                           <Bar yAxisId="left" dataKey="value" name="Số lượng" fill="#1f497d" radius={[2, 2, 0, 0]} />
                           <Line yAxisId="right" type="monotone" dataKey="cumulativePercent" name="% Tích lũy" stroke="#c0504d" strokeWidth={2} dot={{r: 3, fill: '#c0504d'}} />
                         </ComposedChart>
                       </ResponsiveContainer>
                     </div>
                   </div>

                   <div className="lg:col-span-6 bg-white border border-slate-200 rounded-sm shadow-sm flex flex-col overflow-hidden h-[350px]">
                     <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
                       <h3 className="text-sm font-bold text-[#1f497d] uppercase tracking-tight">NGUYÊN NHÂN GỐC RỄ (TỶ TRỌNG %)</h3>
                     </div>
                     <div className="overflow-auto custom-scrollbar p-0">
                       <table className="w-full text-left text-xs whitespace-nowrap">
                         <thead className="bg-[#1f497d] text-white font-bold sticky top-0">
                           <tr>
                             <th className="px-4 py-3 border-b border-slate-800">Nhóm nguyên nhân</th>
                             {chartData.sortedTimes.map((t: string) => (
                               <th key={t} className="px-4 py-3 border-b border-slate-800 text-center">{t}</th>
                             ))}
                             {chartData.sortedTimes.length >= 2 && <th className="px-4 py-3 border-b border-slate-800 text-center">Xu hướng</th>}
                           </tr>
                         </thead>
                         <tbody>
                           {chartData.causeSummaryData.map((row: any, i: number) => {
                             let trendColor = "text-slate-400"; let trendText = "→ Ổn định";
                             if (chartData.sortedTimes.length >= 2) {
                               const diff = (row[chartData.sortedTimes[chartData.sortedTimes.length - 1]] || 0) - (row[chartData.sortedTimes[chartData.sortedTimes.length - 2]] || 0);
                               if (diff > 5) { trendColor = "text-[#c0504d]"; trendText = "↑ Tăng mạnh"; }
                               else if (diff > 2) { trendColor = "text-[#c0504d]"; trendText = "↗ Tăng nhẹ"; }
                               else if (diff < -5) { trendColor = "text-[#9bbb59]"; trendText = "↓ Giảm mạnh"; }
                               else if (diff < -2) { trendColor = "text-[#9bbb59]";  trendText = "↘ Giảm nhẹ"; }
                             }
                             return (
                             <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                               <td className="px-4 py-3 font-bold text-slate-800">{row.name}</td>
                               {chartData.sortedTimes.map((t: string) => (
                                 <td key={t} className="px-4 py-3 text-slate-600 text-center font-medium">{(row[t] || 0).toFixed(1)}%</td>
                               ))}
                               {chartData.sortedTimes.length >= 2 && (
                                 <td className={\`px-4 py-3 font-bold text-center flex items-center justify-center gap-1 \${trendColor}\`}>{trendText}</td>
                               )}
                             </tr>
                             )
                           })}
                         </tbody>
                       </table>
                     </div>
                   </div>
                 </>
               )}

               {/* TAB 4: HIGHLIGHTS & CAPA */}
               {viewMode === 'dashboard' && activeDashboardTab === 4 && (
                 <>
                   {/* ACTION PLAN CARDS DESIGN -> LIGHT BLUE & FPT BRAND */}
                   <div className="lg:col-span-12 flex flex-col gap-6">
                      <div className="bg-white border-2 border-[#1f497d] rounded-sm shadow-sm overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-[#1f497d] bg-[#f0f4f8] text-[#1f497d] flex items-center justify-between shrink-0">
                           <h3 className="text-sm font-bold uppercase tracking-tight flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-[#9bbb59]" /> PHƯƠNG ÁN CẢI TIẾN TRỌNG TÂM (TOP 5 LỖI)
                           </h3>
                        </div>
                        <div className="p-4 bg-white grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                           {Object.entries(chartData.topCategoryDepts || {}).slice(0, 5).map(([category, info]: [string, any], idx: number) => (
                             <div key={idx} className="bg-[#f2f6f9] p-4 rounded-sm border-l-4 border-l-[#1f497d] flex flex-col gap-3 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                  <h4 className="font-bold text-[#1f497d] text-sm uppercase tracking-tight break-words leading-relaxed pr-2">
                                    <span className="text-[#c0504d] font-black mr-2">#{idx + 1}</span> {category}
                                  </h4>
                                  <span className="shrink-0 bg-white border border-slate-200 text-[#F37021] font-black text-sm px-2 py-1 rounded-sm">{info.count} <span className="text-[10px] font-normal text-slate-500">Sự cố</span></span>
                                </div>
                                <div className="bg-white p-3 rounded-sm border border-slate-200">
                                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Giải pháp / Trọng tâm nguyên nhân</p>
                                   <p className="text-xs text-slate-700 font-medium whitespace-normal break-words leading-relaxed">{info.subCauses}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider shrink-0">Phòng ban chủ trì:</p>
                                   <span className="bg-[#1f497d] text-white px-2 py-0.5 rounded-sm font-bold text-[10px] uppercase tracking-wider">{info.topDept}</span>
                                </div>
                             </div>
                           ))}
                        </div>
                      </div>

                      {/* AI INSIGHT ENGINE */}
                      <div className="bg-[#1f497d] rounded-sm shadow-md overflow-hidden flex flex-col border border-[#1f497d] relative min-h-[400px]">
                         <div className="absolute top-0 right-0 p-8 opacity-5">
                           <Cpu className="w-64 h-64 text-white" />
                         </div>
                         <div className="p-4 border-b border-[#143254] flex flex-col gap-3 relative z-10 bg-[#1f497d]">
                            <h3 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-sm bg-[#c0504d] animate-pulse"></span> AI INSIGHT ENGINE
                            </h3>
                            <div className="flex bg-[#143254] p-1.5 rounded-sm gap-2 flex-wrap">
                               {['Phân tích xu hướng', 'Gợi ý xử lý', 'Nhận diện rủi ro'].map((btn, i) => (
                                  <button
                                    key={btn}
                                    onClick={() => {
                                       let prefix = "Hãy phân tích toàn diện. ";
                                       if (i === 0) prefix = "Hãy tập trung phân tích xu hướng và so sánh các năm. ";
                                       if (i === 1) prefix = "Hãy tập trung đưa ra giải pháp xử lý và đề xuất kế hoạch hành động. ";
                                       if (i === 2) prefix = "Hãy nhận diện các rủi ro cốt lõi và cảnh báo trước các vùng có nguy cơ sai số cao. ";
                                       
                                       handleAnalyzeAI(prefix);
                                    }}
                                    disabled={isAnalyzing}
                                    className={\`flex-1 \${i===0 ? 'bg-[#c0504d] hover:bg-red-700' : 'bg-[#143254] hover:bg-slate-600 border border-[#1f497d]'} text-white py-1.5 px-3 rounded-sm text-[10px] font-bold transition-all disabled:opacity-50 text-center uppercase tracking-wider\`}
                                  >
                                    {isAnalyzing ? "..." : btn}
                                  </button>
                               ))}
                            </div>
                         </div>
                         <div className="flex-1 overflow-auto custom-scrollbar p-5 relative z-10 bg-[#f8fafc] text-slate-800">
                           {isAnalyzing ? (
                              <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
                                <RefreshCw className="w-8 h-8 animate-spin text-[#c0504d]" />
                                <span className="text-xs font-bold uppercase tracking-widest text-[#1f497d]">Đang khởi tạo Agent phân tích...</span>
                              </div>
                           ) : aiReport ? (
                              <div className="prose prose-sm max-w-none text-slate-800 prose-headings:text-[#1f497d] prose-a:text-[#F37021] font-sans">
                                <Markdown>{aiReport}</Markdown>
                              </div>
                           ) : (
                              <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3 text-center">
                                <Monitor className="w-12 h-12 opacity-30 text-[#1f497d]" />
                                <span className="text-[11px] uppercase tracking-widest font-bold text-slate-600">Click vào các nút phía trên để sử dụng Trợ lý AI.</span>
                                <span className="text-xs text-slate-500">Giọng đọc AI (Voiceover) sẽ tự động thuyết minh dựa trên các Insight tạo ra từ bản báo cáo.</span>
                              </div>
                           )}
                         </div>
                      </div>
                   </div>
                 </>
               )}
`;

content = content.substring(0, replaceStart) + newLayout + content.substring(replaceEnd);
fs.writeFileSync('src/App.tsx', content);
