import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// The NGUYÊN NHÂN GỐC RỄ table
content = content.replace(
  /<div className="lg:col-span-6 bg-white border border-slate-200 rounded-sm shadow-sm flex flex-col overflow-hidden h-\[350px\]">([\s\S]*?)<h3 className="text-sm font-bold text-\[\#1E40AF\] uppercase tracking-tight">NGUYÊN NHÂN GỐC RỄ \(TỶ TRỌNG %\)<\/h3>/,
  '<div className="lg:col-span-6 bg-white border border-slate-200 rounded-sm shadow-sm flex flex-col overflow-hidden h-[350px] print:h-auto print:overflow-visible">$1<h3 className="text-sm font-bold text-[#1E40AF] uppercase tracking-tight">NGUYÊN NHÂN GỐC RỄ (TỶ TRỌNG %)</h3>'
);

fs.writeFileSync('src/App.tsx', content);

let css = fs.readFileSync('src/index.css', 'utf8');
if (!css.includes('.print\\:h-auto')) {
  css = css.replace(/@media print \{/, "@media print {\n  .print\\:h-auto { height: auto !important; min-height: 0 !important; }\n  .print\\:overflow-visible { overflow: visible !important; }\n");
  fs.writeFileSync('src/index.css', css);
}
