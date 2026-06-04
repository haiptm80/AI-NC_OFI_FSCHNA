import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Hide the Data Source Configuration block in print
content = content.replace(
  /<section className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm">/,
  '<section className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm print-hidden">'
);

// Search and Filters block
content = content.replace(
  /<div className="lg:col-span-12 bg-white p-5 rounded-sm border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-end relative z-20">/,
  '<div className="lg:col-span-12 bg-white p-5 rounded-sm border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-end relative z-20 print-hidden">'
);

// Update print CSS one more time to make sure print-hidden uses global important
let css = fs.readFileSync('src/index.css', 'utf8');
css = css.replace(/\.print-hidden,/, ".print-hidden, .print\\:hidden { display: none !important; }\n  .print-hidden,");
fs.writeFileSync('src/index.css', css);

fs.writeFileSync('src/App.tsx', content);
