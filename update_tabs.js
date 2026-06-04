import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace all #3B82F6 with #1E40AF (FPT Dark Blue) 
content = content.replace(/#3B82F6/g, '#1E40AF');
// Replace #2563EB with #1E3A8A (Even darker blue for contrast)
content = content.replace(/#2563EB/g, '#1E3A8A');

// Add section 1 header
content = content.replace(
  /\{viewMode === 'dashboard' && \(\n                 <>\n                   <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">/,
  `{viewMode === 'dashboard' && (
                 <>
                   <div className="lg:col-span-12 mt-4 mb-2 border-b-2 border-[#1E40AF] pb-2">
                     <h2 className="text-xl font-black text-[#1E40AF] uppercase tracking-tight flex items-center gap-2">
                        <span className="bg-[#1E40AF] text-white w-8 h-8 flex items-center justify-center rounded-sm text-base">1</span>
                        TỔNG QUAN SỨC KHỎE HỆ THỐNG
                     </h2>
                   </div>
                   <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">`
);

// Add section 2 header
content = content.replace(
  /\{viewMode === 'dashboard' && \(\n                 <>\n                   \{\/\* 80\/20 Concentration \*\/\}\n                   <div className="lg:col-span-12 bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden mt-6">/,
  `{viewMode === 'dashboard' && (
                 <>
                   <div className="lg:col-span-12 mt-8 mb-2 border-b-2 border-[#F37021] pb-2">
                     <h2 className="text-xl font-black text-[#F37021] uppercase tracking-tight flex items-center gap-2">
                        <span className="bg-[#F37021] text-white w-8 h-8 flex items-center justify-center rounded-sm text-base">2</span>
                        ĐIỂM NÓNG PHÒNG BAN & PHÂN TÍCH RỦI RO
                     </h2>
                   </div>
                   {/* 80/20 Concentration */}
                   <div className="lg:col-span-12 bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden mt-2">`
);

// Add section 3 header
content = content.replace(
  /\{viewMode === 'dashboard' && \(\n                 <>\n                   <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">/,
  `{viewMode === 'dashboard' && (
                 <>
                   <div className="lg:col-span-12 mt-8 mb-2 border-b-2 border-[#1E40AF] pb-2">
                     <h2 className="text-xl font-black text-[#1E40AF] uppercase tracking-tight flex items-center gap-2">
                        <span className="bg-[#1E40AF] text-white w-8 h-8 flex items-center justify-center rounded-sm text-base">3</span>
                        PHÂN TÍCH SÂU THUỘC TÍNH & NGUYÊN NHÂN LỖI
                     </h2>
                   </div>
                   <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">`
);

// Add section 4 header
content = content.replace(
  /\{viewMode === 'dashboard' && \(\n                 <>\n                   \{\/\* ACTION PLAN CARDS DESIGN -> LIGHT BLUE & FPT BRAND \*\/\}\n                   <div className="lg:col-span-12 flex flex-col gap-6">/,
  `{viewMode === 'dashboard' && (
                 <>
                   <div className="lg:col-span-12 mt-8 mb-2 border-b-2 border-[#F37021] pb-2">
                     <h2 className="text-xl font-black text-[#F37021] uppercase tracking-tight flex items-center gap-2">
                        <span className="bg-[#F37021] text-white w-8 h-8 flex items-center justify-center rounded-sm text-base">4</span>
                        ĐIỂM NỔI BẬT & KHUYẾN NGHỊ KHẮC PHỤC
                     </h2>
                   </div>
                   {/* ACTION PLAN CARDS DESIGN -> LIGHT BLUE & FPT BRAND */}
                   <div className="lg:col-span-12 flex flex-col gap-6">`
);

// Format top 5 causes
// The current code has `info.subCauses` which is a string joined by '; '.
content = content.replace(
  /<p className="text-xs text-slate-700 font-medium whitespace-normal break-words leading-relaxed">\{info\.subCauses\}<\/p>/g,
  `
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
`
);

// We need an Export Report button. Added to the top header controls.
// Look for "> Settings </span>" and add an Export button.
// And check if `import { ..., Download } from "lucide-react";` doesn't have Download, we should add it.
if (!content.includes('Download,')) {
    content = content.replace('import { ', 'import { Download, ');
}

content = content.replace(
  /<button onClick=\{toggleFocusMode\} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors flex items-center gap-2">/,
  `<button 
              onClick={() => window.print()} 
              title="Xuất báo cáo (PDF)"
              className="p-1.5 px-3 text-[#1E40AF] bg-white border-2 border-[#1E40AF] font-bold uppercase tracking-widest text-[10px] hover:bg-[#1E40AF] hover:text-white rounded-sm transition-colors flex items-center gap-2 mr-2"
            >
              <Download className="w-4 h-4" /> Xuất Báo cáo
            </button>
            <button onClick={toggleFocusMode} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors flex items-center gap-2">`
);

fs.writeFileSync('src/App.tsx', content);
