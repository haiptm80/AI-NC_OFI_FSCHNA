import fs from 'fs';

const content = fs.readFileSync('src/App.tsx', 'utf8');

const startStr = "{/* Header FPT Education */}";
const endStr = "</header>";

const startIdx = content.indexOf(startStr);
const endIdx = content.indexOf(endStr);

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find markers');
  process.exit(1);
}

const before = content.slice(0, startIdx);
const after = content.slice(endIdx + endStr.length);

const newLayout = `{/* Header FPT Education */}
      <header className="bg-[#111827] border-b border-slate-800 sticky top-0 z-50 text-white shadow-md">
        <div className="w-full mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-sm bg-[#F37021] flex items-center justify-center text-white font-black text-xl leading-none">
                F
             </div>
             <div>
                <h1 className="text-lg font-black text-white leading-tight tracking-tight mt-[2px]">FPT Education</h1>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em] leading-tight">QA / FQA Training Analytics</p>
             </div>
          </div>
          
          <div className="flex items-center gap-4 hidden md:flex">
             {lastUpdated && (
               <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                 <RefreshCw className={\`w-3 h-3 \${isRefreshing ? 'animate-spin text-[#F37021]' : 'text-slate-500'}\`}/> 
                 {isRefreshing ? 'Đang tải...' : \`\${lastUpdated.toLocaleTimeString()}\`}
               </span>
             )}
             <div className="flex items-center text-[10px] font-bold bg-[#1f2937] text-slate-300 px-2 py-1 rounded-sm border border-slate-700 gap-2 uppercase tracking-widest shadow-inner">
                <span className="w-1.5 h-1.5 rounded-none bg-[#00A859] animate-pulse"></span>
                <span>Live Sync</span>
             </div>
             {rawData && (
                <div className="flex items-center gap-2 border-l border-slate-700 pl-4 ml-2">
                  <div className="flex bg-[#1f2937] p-1 rounded-sm border border-slate-700">
                    <button
                      onClick={() => setViewMode('dashboard')}
                      className={\`px-3 py-1.5 text-xs font-bold rounded-sm flex items-center gap-1.5 transition-all uppercase tracking-wider \${viewMode === 'dashboard' ? 'bg-[#F37021] text-white shadow' : 'text-slate-400 hover:text-white'}\`}
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      Dashboard
                    </button>
                    <button
                      onClick={() => setViewMode('focus')}
                      className={\`px-3 py-1.5 text-xs font-bold rounded-sm flex items-center gap-1.5 transition-all uppercase tracking-wider \${viewMode === 'focus' ? 'bg-[#0072BC] text-white shadow' : 'text-slate-400 hover:text-white'}\`}
                    >
                      <Presentation className="w-3.5 h-3.5" />
                      Focus
                    </button>
                  </div>
                  {viewMode === 'dashboard' && (
                     <button 
                       onClick={handleExportPDF}
                       disabled={isExporting}
                       className="bg-[#00A859] hover:bg-[#008f4c] text-white px-3 py-1.5 rounded-sm text-xs font-bold transition-all disabled:opacity-70 flex items-center gap-2 ml-2 uppercase tracking-wider shadow-sm"
                     >
                       {isExporting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                       Báo cáo
                     </button>
                  )}
                </div>
             )}
          </div>
        </div>
      </header>`;

fs.writeFileSync('src/App.tsx', before + newLayout + after);
console.log("Updated App.tsx");
