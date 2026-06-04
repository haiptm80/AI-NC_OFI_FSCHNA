import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Config title larger and green
content = content.replace(
  /<h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2 uppercase tracking-tight"><Database className="w-4 h-4 text-\[#1E40AF\]" \/> Cấu hình Nguồn dữ liệu Google Sheets<\/h2>/,
  '<h2 className="text-base md:text-lg font-black text-[#00A859] mb-4 flex items-center gap-2 uppercase tracking-widest"><Database className="w-5 h-5 text-[#00A859]" /> Cấu hình Nguồn dữ liệu Google Sheets</h2>'
);

// Form inputs in config 
content = content.replace(
  /className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-\[#F37021\] focus:border-\[#F37021\]"/,
  'className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-sm text-base font-bold focus:outline-none focus:ring-2 focus:ring-[#00A859] focus:border-[#00A859]"'
);

// Make the export button (Báo cáo) text larger
content = content.replace(
  /className="bg-\[#00A859\] hover:bg-\[#008f4c\] text-white px-3 py-1\.5 rounded-sm text-xs font-bold transition-all disabled:opacity-70 flex items-center gap-2 ml-2 uppercase tracking-wider shadow-sm"/,
  'className="bg-[#00A859] hover:bg-[#008f4c] text-white px-5 py-2.5 rounded-sm text-sm font-black transition-all disabled:opacity-70 flex items-center gap-2 ml-3 uppercase tracking-widest shadow-md hover:shadow-lg"'
);

// Tab active/inactive colors, make it bolder
content = content.replace(
  /\? 'border-\[#F37021\] text-\[#F37021\]'/,
  "? 'border-[#F37021] text-[#F37021] bg-orange-50 font-black'"
);
content = content.replace(
  /: 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'/,
  ": 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50'"
);

// "BỘ LỌC"
content = content.replace(
  /<div className="text-xs font-bold text-slate-500 uppercase tracking-widest mr-2 flex items-center gap-2">/,
  '<div className="text-sm font-black text-slate-700 uppercase tracking-widest mr-2 flex items-center gap-2">'
);

// Make actual select dropdowns slightly larger matching filters
content = content.replace(
  /className="text-sm font-medium bg-white border border-slate-200 px-3 py-1\.5 rounded-sm text-slate-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-400"/g,
  'className="text-sm font-bold bg-white border border-slate-300 px-4 py-2 rounded-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00A859] min-w-[150px]"'
);

// Xóa Bộ lọc button
content = content.replace(
  /className="text-xs font-medium text-rose-500 hover:text-rose-700 underline underline-offset-2 ml-auto"/,
  'className="text-sm font-black text-rose-500 hover:text-rose-700 underline underline-offset-2 ml-auto tracking-widest uppercase"'
);

// "Vùng Đỏ" stats text bigger
content = content.replace(
  /<p className="text-sm text-slate-600 font-medium leading-relaxed">/,
  '<p className="text-base text-slate-700 font-medium leading-relaxed">'
);

fs.writeFileSync('src/App.tsx', content);
