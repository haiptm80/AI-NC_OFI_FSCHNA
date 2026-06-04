import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Update severityKey detection to also look for "Mã" or "Mã"
content = content.replace(
  /let severityKey = keys.find\(k => \/severity\|mức\|cấp độ\|nghiêm trọng\|risk\|rủi ro\|loại lỗi\/i\.test\(k\)\);/,
  "let severityKey = keys.find(k => /severity|mức|cấp độ|nghiêm trọng|risk|rủi ro|loại lỗi|mã|mã/i.test(k)) || keys.find(k => k.includes('Mã'));"
);

// Update status logic
content = content.replace(
  /return val\.includes\('done'\) \|\| val\.includes\('close'\) \|\| val\.includes\('đóng'\) \|\| val\.includes\('tốt'\) \|\| val\.includes\('đã xử lý'\);/g,
  "const norm = val.normalize('NFD').replace(/[\\u0300-\\u036f]/g, ''); return norm.includes('done') || norm.includes('close') || norm.includes('dong') || norm.includes('tot') || norm.includes('da x') || norm.includes('hoan thanh') || val.includes('đã xử lý') || val.includes('xu ly');"
);

// Now Top 5 Lỗi - Make it a table format and separate causes
// Current code has a flex block. We will rewrite the `.map(([category, info]: [string, any], idx: number) => (` down to the end of that block.
// Let's first match the whole block for Top 5 causes.
const top5TableOld = `{Object.entries(chartData.topCategoryDepts || {}).slice(0, 5).map(([category, info]: [string, any], idx: number) => (
                             <div key={idx} className="bg-[#f2f6f9] p-4 rounded-sm border-l-4 border-l-[#1E40AF] flex flex-col gap-3 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                  <h4 className="font-bold text-[#1E40AF] text-sm uppercase tracking-tight break-words leading-relaxed pr-2">
                                    <span className="text-[#c0504d] font-black mr-2">#{idx + 1}</span> {category}
                                  </h4>
                                  <span className="shrink-0 bg-white border border-slate-200 text-[#F37021] font-black text-sm px-2 py-1 rounded-sm">{info.count} <span className="text-[10px] font-normal text-slate-500">Sự cố</span></span>
                                </div>
                                <div className="bg-white p-3 rounded-sm border border-slate-200">
                                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Giải pháp / Trọng tâm nguyên nhân</p>
                                   
                                   <div className="text-xs text-slate-700 font-medium whitespace-normal break-words leading-relaxed flex flex-col gap-1.5 mt-1">
                                      {info.subCauses?.split(';').map((cause: string, i: number) => {
                                        if (!cause.trim()) return null;
                                        return (
                                          <div key={i} className="flex gap-2 items-start relative pl-3 before:content-[''] before:w-1.5 before:h-1.5 before:bg-[#F37021] before:absolute before:left-0 before:top-1 before:rounded-full pt-0.5">
                                            <span>{cause.trim()}</span>
                                          </div>
                                        );
                                      })}
                                   </div>
                                </div>
                                <div className="flex items-center gap-2">
                                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider shrink-0">Phòng ban chủ trì:</p>
                                   <span className="bg-[#3B82F6] text-white px-2 py-0.5 rounded-sm font-bold text-[10px] uppercase tracking-wider">{info.topDept}</span>
                                </div>
                             </div>
                           ))}`;

const top5TableNew = `{Object.entries(chartData.topCategoryDepts || {}).slice(0, 5).map(([category, info]: [string, any], idx: number) => (
                             <div key={idx} className="bg-[#f2f6f9] p-4 rounded-sm border-l-4 border-l-[#1E40AF] flex flex-col gap-3 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                  <h4 className="font-bold text-[#1E40AF] text-base uppercase tracking-tight break-words leading-relaxed pr-2">
                                    <span className="text-[#c0504d] font-black mr-2">#{idx + 1}</span> {category}
                                  </h4>
                                  <span className="shrink-0 bg-white border border-slate-200 text-[#F37021] font-black text-sm px-2 py-1 rounded-sm">{info.count} <span className="text-[10px] font-normal text-slate-500">Sự cố</span></span>
                                </div>
                                <div className="bg-white rounded-sm border border-slate-200 overflow-hidden">
                                  <table className="w-full text-left border-collapse">
                                    <thead>
                                      <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="p-2 text-[10px] text-[#1E40AF] font-bold uppercase tracking-wider w-1/2">Trọng tâm nguyên nhân</th>
                                        <th className="p-2 text-[10px] text-[#00A859] font-bold uppercase tracking-wider w-1/2 border-l border-slate-200">Giải pháp / Hành động khắc phục</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                      {info.subCauses?.split(';').map((cause: string, i: number) => {
                                        if (!cause.trim()) return null;
                                        // Try to separate cause and action if possible, else just put them together playfully or split by taking first half as cause
                                        // Typically, since they are mashed together in a single string, we use the same entry if action/solution isn't explicitly mapped. But let's look at the mapping logic in useEffect.
                                        // Wait, info.actions is mapped in subCauses in the UI block. Let's just create a row for each item.
                                        let parts = cause.trim().split('||'); // Attempt a custom split we will add
                                        let causeText = parts[0] || cause.trim();
                                        let actionText = parts[1] || '---';
                                        return (
                                          <tr key={i} className="hover:bg-orange-50/30">
                                            <td className="p-2 text-xs text-slate-700 align-top">
                                               <div className="flex items-start gap-1.5"><span className="text-[#F37021] mt-0.5 mt-[2px]">•</span> <span>{causeText}</span></div>
                                            </td>
                                            <td className="p-2 text-xs text-slate-600 align-top border-l border-slate-200 font-medium whitespace-pre-line">
                                               {actionText}
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                                <div className="flex items-center gap-2 mt-auto pt-2">
                                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider shrink-0">Phòng ban (nhiều lỗi nhất):</p>
                                   <span className="bg-[#1E40AF] text-white px-2 py-0.5 rounded-sm font-bold text-[10px] uppercase tracking-wider">{info.topDept}</span>
                                </div>
                             </div>
                           ))}`;
content = content.replace(top5TableOld, top5TableNew);

// We need to change the data mapping for info.subCauses to include info.actions
content = content.replace(
  /subCauses: \[...new Set\(groupData\.map\(\(r: any\) => String\(r\[dataKeys\.causeKey\] || ''\)\)\)\]\.filter\(Boolean\)\.join\('; '\),/,
  `subCauses: [...new Set(groupData.map((r: any) => {
          let c = String(r[dataKeys.causeKey] || '').trim();
          let a = String(r[dataKeys.actionKey] || '').trim();
          if(!c) return '';
          return c + '||' + a;
        }))].filter(Boolean).join('; '),`
);


// Export Report formatting fixes
// Instead of dom-to-image we fall back to simple window.print() and inject some CSS for print layouts.
// Wait, user is still complaining about export report. The previous attempt might have had dom-to-image inserted. 
// Let's remove dom-to-image and put window.print() + @media print styles in index.css

fs.writeFileSync('src/App.tsx', content);
