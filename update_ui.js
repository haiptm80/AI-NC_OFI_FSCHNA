import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Header colors: #111827 to #00A859, border-slate-800 to border-[#008f4c], #1f2937 to #008f4c
// Note: Only targeting specific elements.
content = content.replace(
  /<header className="bg-\[#111827\] border-b border-slate-800 sticky top-0 z-50 text-white shadow-md">/,
  '<header className="bg-[#00A859] border-b border-[#008f4c] sticky top-0 z-50 text-white shadow-md">'
);

// Global search bar bg color from #1f2937 to #00A859 (or #008f4c)
content = content.replace(
  /className="w-full bg-\[#1f2937\] border border-slate-700 text-slate-200 text-sm rounded-sm pl-9 pr-4 py-1.5 focus:outline-none focus:border-\[#F37021\] focus:ring-1 focus:ring-\[#F37021\] transition-all placeholder:text-slate-500"/,
  'className="w-full bg-[#008f4c] border border-[#00703a] text-white text-sm rounded-sm pl-9 pr-4 py-1.5 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all placeholder:text-slate-200"'
);
content = content.replace(
  /<Search className="absolute left-3 top-1\/2 -translate-y-1\/2 w-4 h-4 text-slate-400" \/>/,
  '<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-200" />'
);

// Live sync text-slate-400 to text-slate-100
content = content.replace(
  /<span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 whitespace-nowrap">/,
  '<span className="text-xs font-bold text-slate-100 flex items-center gap-1.5 whitespace-nowrap">'
);
content = content.replace(
  /<span className="text-xs font-bold text-slate-400 whitespace-nowrap hidden sm:block">/,
  '<span className="text-xs font-bold text-slate-100 whitespace-nowrap hidden sm:block">'
);

// "Kết nối & Đồng bộ" button
content = content.replace(
  /className="bg-\[#111827\] hover:bg-\[#1f2937\] text-white px-6 py-2 rounded-sm text-sm font-bold transition-all whitespace-nowrap disabled:opacity-70 flex justify-center items-center gap-2 tracking-wider"/,
  'className="bg-[#00A859] hover:bg-[#008f4c] text-white px-8 py-3 rounded-sm text-base font-black transition-all whitespace-nowrap disabled:opacity-70 flex justify-center items-center gap-2 tracking-widest shadow-md hover:shadow-lg transform hover:-translate-y-0.5 uppercase border-2 border-[#008f4c]"'
);

// Tabs for sheets
content = content.replace(
  /px-4 py-2 text-sm font-bold whitespace-nowrap border-b-2 transition-colors/g,
  'px-6 py-3 text-base md:text-lg font-black whitespace-nowrap border-b-4 transition-colors uppercase'
);

// KPI Boxes Title
content = content.replace(
  /<span className="text-\[11px\] font-bold text-slate-500 uppercase tracking-widest mb-1">Tổng sự cố\/ghi nhận<\/span>/,
  '<span className="text-sm md:text-base font-black text-slate-700 uppercase tracking-widest mb-2">Tổng sự cố/ghi nhận</span>'
);
content = content.replace(
  /<span className="text-\[11px\] font-bold text-slate-500 uppercase tracking-widest mb-1">Tỷ lệ đóng lỗi \(Closure Rate\)<\/span>/,
  '<span className="text-sm md:text-base font-black text-slate-700 uppercase tracking-widest mb-2">Tỷ lệ đóng lỗi (Closure Rate)</span>'
);
content = content.replace(
  /<span className="text-\[11px\] font-bold text-slate-500 uppercase tracking-widest mb-1">Tỷ lệ cảnh báo \(NC\/Critical\)<\/span>/,
  '<span className="text-sm md:text-base font-black text-slate-700 uppercase tracking-widest mb-2">Tỷ lệ cảnh báo (NC/Critical)</span>'
);

// KPI Boxes Value - make bigger
content = content.replace(
  /<span className="text-4xl font-black text-slate-900 tracking-tight">\{chartData.totalRecords\}<\/span>/,
  '<span className="text-5xl md:text-6xl font-black text-[#1E40AF] tracking-tight">{chartData.totalRecords}</span>'
);
content = content.replace(
  /<span className="text-4xl font-black text-\[#9bbb59\] tracking-tight">/,
  '<span className="text-5xl md:text-6xl font-black text-[#00A859] tracking-tight">'
);
content = content.replace(
  /<span className="text-4xl font-black text-\[#c0504d\] tracking-tight">/,
  '<span className="text-5xl md:text-6xl font-black text-rose-600 tracking-tight">'
);

// Green color change for `bg-white p-5 rounded-sm border border-slate-200 shadow-sm flex flex-col justify-between border-l-4 border-l-[#9bbb59]` -> border-l-[#00A859]
content = content.replace(
  /border-l-\[#9bbb59\]/g,
  'border-l-[#00A859]'
);

// Replace remaining old green #9bbb59 with FPT Green
content = content.replace(/#9bbb59/g, '#00A859');


fs.writeFileSync('src/App.tsx', content);
