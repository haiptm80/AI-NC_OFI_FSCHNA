import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// The line is: const norm = val.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); return norm.includes('done') || norm.includes('close') || norm.includes('dong') || norm.includes('tot') || norm.includes('da x') || norm.includes('hoan thanh') || val.includes('đã xử lý') || val.includes('xu ly');
const targetLine = "const norm = val.normalize('NFD').replace(/[\\u0300-\\u036f]/g, ''); return norm.includes('done') || norm.includes('close') || norm.includes('dong') || norm.includes('tot') || norm.includes('da x') || norm.includes('hoan thanh') || val.includes('đã xử lý') || val.includes('xu ly');";
const replaceLine = "const norm = val.normalize('NFD').replace(/[\\u0300-\\u036f]/g, ''); return norm.includes('hoan thanh') || val.includes('đã hoàn thành');";

content = content.replace(targetLine, replaceLine);
fs.writeFileSync('src/App.tsx', content);
