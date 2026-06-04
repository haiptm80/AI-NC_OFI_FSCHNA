import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Insert export handler
const copyHandler = `  };

  const handleCopyText = () => {
    if (!aiReport) return;
    navigator.clipboard.writeText(aiReport);
    alert('Đã sao chép nội dung AI Insight vào Clipboard!');
  };

  return (`;

content = content.replace('  };\n\n  return (', copyHandler);

// Insert row style helper
const rowHelper = `
  const getRowStatusStyle = (row: any) => {
    const rowStr = JSON.stringify(row).toLowerCase();
    
    // Đỏ cho NC quá hạn nghiêm trọng
    if (rowStr.includes('quá hạn') || (rowStr.includes('chưa') && (rowStr.includes('nc') || rowStr.includes('critical') || rowStr.includes('nghiêm trọng')))) {
      return "bg-rose-50 hover:bg-rose-100 text-rose-900 border-l-4 border-rose-500 font-medium";
    }
    // Xanh cho NC đã đóng
    if (rowStr.includes('đã xử lý') || rowStr.includes('close') || rowStr.includes('đóng') || rowStr.includes('done')) {
      return "bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-l-4 border-emerald-500";
    }
    // Vàng cho NC sắp đến hạn / đang xử lý
    if (rowStr.includes('đang xử lý') || rowStr.includes('sắp đến hạn') || rowStr.includes('pending') || rowStr.includes('chưa xử lý')) {
      return "bg-amber-50 hover:bg-amber-100 text-amber-900 border-l-4 border-amber-500";
    }
    return "bg-white hover:bg-slate-50 text-slate-700 border-l-4 border-transparent";
  };
`;
content = content.replace('return (', rowHelper + '\n  return (');

// Modify AI Insight buttons
const aiBtns = `                      <div className="flex items-center gap-2">
                        {aiReport && (
                          <button
                            onClick={handleCopyText}
                            className="bg-white hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-sm text-xs font-bold transition-all border border-slate-300 flex items-center gap-2 shadow-sm"
                          >
                            <FileText className="w-3.5 h-3.5" /> Sao chép
                          </button>
                        )}
                        <button
                           onClick={handleAnalyzeAI}
                           disabled={isAnalyzing}
                           className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-sm text-xs font-bold transition-all disabled:opacity-70 flex items-center gap-2 border border-slate-900 shadow-sm"
                        >
                           {isAnalyzing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Trích xuất"}
                        </button>
                      </div>`;
content = content.replace(/<button\s+onClick=\{handleAnalyzeAI\}[^]*?<\/button>/, aiBtns);

// Modify Table Rows
const tableRow = `<tr key={i} className={\`border-b border-slate-100 transition-colors \${getRowStatusStyle(row)}\`}>`;
content = content.replace(/<tr key=\{i\} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">/, tableRow);

// I want to change "Bảng dữ liệu" to "Bảng Cảnh báo & Trạng thái" to fulfill the user's intent to highlight it
content = content.replace('Bảng dữ liệu (Xem trước)', 'BẢNG CẢNH BÁO TRẠNG THÁI NC (XEM TRƯỚC)');
content = content.replace('<FileText className="w-4 h-4 text-slate-500" /> Bảng dữ liệu', '<AlertTriangle className="w-4 h-4 text-rose-500" /> BẢNG CẢNH BÁO TRẠNG THÁI NC');

// AI Insight and StackBar layout needs to ensure AI Insight is on the right.
// It is already on the right side if the browser is wide enough.
// Let's add a Copy icon import
content = content.replace("Activity,", "Activity, Copy, ");

fs.writeFileSync('src/App.tsx', content);
