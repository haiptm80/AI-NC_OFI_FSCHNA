import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// The block to replace:
// <div className="bg-white p-3 rounded-sm border border-slate-200">
//   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Giải pháp / Trọng tâm nguyên nhân</p>
//   <div className="text-xs text-slate-700 font-medium whitespace-normal break-words leading-relaxed flex flex-col gap-1.5 mt-1">
//      {info.subCauses?.split(';').map((cause: string, i: number) => {
//        ...
//      })}
//   </div>
// </div>

const newBlock = `<div className="bg-white rounded-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
    <table className="w-full text-left border-collapse m-0">
      <thead>
        <tr className="bg-[#f0f4f8] border-b border-slate-200">
          <th className="p-2 text-[10px] text-[#1E40AF] font-bold uppercase tracking-wider w-1/2">Trọng tâm nguyên nhân</th>
          <th className="p-2 text-[10px] text-[#00A859] font-bold uppercase tracking-wider w-1/2 border-l border-slate-200">Giải pháp / Khắc phục</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {info.subCauses?.split(';').map((cause: string, i: number) => {
          if (!cause.trim()) return null;
          let parts = cause.trim().split('||');
          let causeText = parts[0] || cause.trim();
          let actionText = parts[1] || '---';
          return (
            <tr key={i} className="hover:bg-slate-50">
              <td className="p-2 text-xs text-slate-700 align-top">
                 <div className="flex items-start gap-1.5"><span className="text-[#F37021] mt-[2px]">•</span> <span>{causeText}</span></div>
              </td>
              <td className="p-2 text-xs text-slate-600 align-top border-l border-slate-200 font-medium whitespace-pre-line">
                 {actionText}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
</div>`;

// Use regex to locate and replace
const regex = /<div className="bg-white p-3 rounded-sm border border-slate-200">[\s\S]*?<\/div>[\s]*<\/div>[\s]*<div className="flex items-center gap-2"/;

const replacement = newBlock + `\n                                <div className="flex items-center gap-2 mt-auto pt-2"`;

content = content.replace(regex, replacement);

fs.writeFileSync('src/App.tsx', content);
