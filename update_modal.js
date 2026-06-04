import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  'onClick={(data) => setFilters(prev => ({ ...prev, category: (data as any)?.name || prev.category }))}',
  \`onClick={(data) => {
    const category = (data as any)?.name;
    if (!category) return;
    const filteredRows = chartData.filtered.filter((r: any) => String(r[dataKeys.categoryKey]) === category);
    setDrillDownModal({
      isOpen: true,
      title: 'Loại lỗi: ' + category,
      data: filteredRows
    });
  }}\`
);

content = content.replace(
  'onClick={() => setFilters(prev => ({ ...prev, dept: d }))}',
  \`onClick={() => {
    const filteredRows = chartData.filtered.filter((r: any) => String(r[dataKeys.deptKey]) === d);
    setDrillDownModal({
      isOpen: true,
      title: 'Phòng ban: ' + d,
      data: filteredRows
    });
  }}\`
);

content = content.replace(
  'setFilters(prev => ({ ...prev, severity: entry.name || prev.severity }));',
  \`const filteredRows = chartData.filtered.filter((r: any) => String(r[dataKeys.severityKey]).trim() === entry.name);
  setDrillDownModal({
    isOpen: true,
    title: 'Mức độ rủi ro: ' + entry.name,
    data: filteredRows
  });\`
);

const modalJsx = \`
      {drillDownModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-sm shadow-xl w-full max-w-5xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
               <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 tracking-tight uppercase">
                 <FileText className="w-5 h-5 text-[#0072BC]" /> 
                 Chi tiết dữ liệu cảnh báo - {drillDownModal.title}
               </h3>
               <button 
                 onClick={() => setDrillDownModal({ isOpen: false, title: '', data: [] })}
                 className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
               >
                 <X className="w-6 h-6" />
               </button>
            </div>
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center shrink-0">
               <span className="text-sm font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-sm shadow-sm">
                  Đã lọc: {drillDownModal.data.length} bản ghi
               </span>
            </div>
            <div className="overflow-auto custom-scrollbar flex-1 p-0 m-0">
               {drillDownModal.data.length > 0 ? (
                 <table className="w-full text-left text-xs whitespace-nowrap">
                   <thead className="bg-[#111827] text-white font-bold sticky top-0 z-10 shadow-sm">
                     <tr>
                       {Object.keys(drillDownModal.data[0] || {}).map(k => (
                          <th key={k} className="px-4 py-3 border-b border-slate-800">{k}</th>
                       ))}
                     </tr>
                   </thead>
                   <tbody>
                      {drillDownModal.data.map((row: any, i: number) => (
                        <tr key={i} className={"border-b border-slate-100 transition-colors " + getRowStatusStyle(row)}>
                           {Object.values(row).map((v: any, j) => (
                              <td key={j} className="px-4 py-2.5 text-slate-700">{v}</td>
                           ))}
                        </tr>
                      ))}
                   </tbody>
                 </table>
               ) : (
                 <div className="p-10 text-center text-slate-500">Không có dữ liệu phù hợp với phân loại này.</div>
               )}
            </div>
          </div>
        </div>
      )}
\`;

content = content.replace('{/* Header FPT Education */}', modalJsx + '\\n      {/* Header FPT Education */}');

fs.writeFileSync('src/App.tsx', content);
