import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  '<FileText className="w-4 h-4 text-slate-500" /> BẢNG CẢNH BÁO TRẠNG THÁI NC (XEM TRƯỚC)',
  '<AlertTriangle className="w-4 h-4 text-rose-500" /> BẢNG CẢNH BÁO TRẠNG THÁI NC'
);

fs.writeFileSync('src/App.tsx', content);
