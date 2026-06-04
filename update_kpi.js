import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const renderTrendFn = `

  const renderTrend = (value: number | undefined, inverseIndicator: boolean = false) => {
     if (value === undefined || value === 0) return <span className="text-xs font-bold text-slate-500 flex items-center gap-1"><Minus className="w-3 h-3" /> 0%</span>;
     
     // inverseIndicator: true means higher is BAD (red), lower is GOOD (green) - e.g. Errors, Risks
     // inverseIndicator: false means higher is GOOD (green), lower is BAD (red) - e.g. Resolved
     const isPositive = value > 0;
     const isGoodPositive = !inverseIndicator;
     const isGoodActivity = (isPositive && isGoodPositive) || (!isPositive && !isGoodPositive);
     
     const colorClass = isGoodActivity ? 'text-green-600' : 'text-rose-600';
     const Icon = isPositive ? TrendingUp : TrendingDown;
     const sign = isPositive ? '+' : '';
     
     return (
       <div className={\`flex items-center gap-1 mt-1 \${colorClass}\`} title="So với chu kỳ trước">
         <Icon className="w-3 h-3" />
         <span className="text-[11px] font-bold tracking-tight">{sign}{value.toFixed(1)}%</span>
       </div>
     );
  };
`;

content = content.replace('  const handleExportCSV = () => {', renderTrendFn + '\n  const handleExportCSV = () => {');

// Now inject inside the cards.

const originalCards = \`                    <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm flex flex-col justify-center border-l-4 border-l-slate-800 transition-all hover:shadow-md">
                       <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Tổng sự cố/ghi nhận</span>
                       <span className="text-4xl font-black text-slate-900 tracking-tight">{chartData.totalRecords}</span>
                    </div>
                    <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm flex flex-col justify-center border-l-4 border-l-[#f43f5e] transition-all hover:shadow-md relative overflow-hidden">
                       <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Lỗi Nghiêm trọng (NC/Critical)</span>
                       <div className="flex items-end gap-2">
                          <span className="text-4xl font-black text-[#f43f5e] tracking-tight">{chartData.criticalErrors}</span>
                          {chartData.totalRecords > 0 && (
                             <span className="text-xs font-bold text-[#f43f5e] bg-red-50 px-1.5 py-0.5 mb-1 border border-red-100 rounded-sm">
                                {((chartData.criticalErrors / chartData.totalRecords) * 100).toFixed(0)}%
                             </span>
                          )}
                       </div>
                    </div>
                    <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm flex flex-col justify-center border-l-4 border-l-[#00A859] transition-all hover:shadow-md relative overflow-hidden">
                       <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Đã xử lý (Closed/Done)</span>
                       <div className="flex items-end gap-2">
                          <span className="text-4xl font-black text-[#00A859] tracking-tight">{chartData.resolvedErrors}</span>
                          {chartData.totalRecords > 0 && chartData.statusKey && (
                             <span className="text-xs font-bold text-[#00A859] bg-green-50 px-1.5 py-0.5 mb-1 border border-green-100 rounded-sm">
                                {((chartData.resolvedErrors / chartData.totalRecords) * 100).toFixed(0)}%
                             </span>
                          )}
                       </div>
                    </div>\`;

const newCards = \`                    <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-sm flex flex-col justify-between border-l-4 border-l-slate-800 transition-all hover:shadow-md">
                       <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Tổng sự cố/ghi nhận</span>
                       <div className="flex justify-between items-end">
                          <span className="text-4xl font-black text-slate-900 tracking-tight leading-none">{chartData.totalRecords}</span>
                          {chartData.trends && renderTrend(chartData.trends.total, true)}
                       </div>
                    </div>
                    <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-sm flex flex-col justify-between border-l-4 border-l-[#f43f5e] transition-all hover:shadow-md relative overflow-hidden">
                       <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Lỗi Nghiêm trọng (NC/Critical)</span>
                       <div className="flex justify-between items-end">
                          <div className="flex items-end gap-2">
                            <span className="text-4xl font-black text-[#f43f5e] tracking-tight leading-none">{chartData.criticalErrors}</span>
                            {chartData.totalRecords > 0 && (
                               <span className="text-xs font-bold text-[#f43f5e] bg-rose-50 px-1.5 py-0.5 border border-rose-100 rounded-sm">
                                  {((chartData.criticalErrors / chartData.totalRecords) * 100).toFixed(0)}%
                               </span>
                            )}
                          </div>
                          {chartData.trends && renderTrend(chartData.trends.critical, true)}
                       </div>
                    </div>
                    <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-sm flex flex-col justify-between border-l-4 border-l-[#00A859] transition-all hover:shadow-md relative overflow-hidden">
                       <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Đã xử lý (Closed/Done)</span>
                       <div className="flex justify-between items-end">
                          <div className="flex items-end gap-2">
                             <span className="text-4xl font-black text-[#00A859] tracking-tight leading-none">{chartData.resolvedErrors}</span>
                             {chartData.totalRecords > 0 && chartData.statusKey && (
                                <span className="text-xs font-bold text-[#00A859] bg-green-50 px-1.5 py-0.5 border border-green-100 rounded-sm">
                                   {((chartData.resolvedErrors / chartData.totalRecords) * 100).toFixed(0)}%
                                </span>
                             )}
                          </div>
                          {chartData.trends && renderTrend(chartData.trends.resolved, false)}
                       </div>
                    </div>\`;


content = content.replace(originalCards, newCards);

fs.writeFileSync('src/App.tsx', content);
