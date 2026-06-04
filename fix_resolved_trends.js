import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// fix line 1 if it has "norm.includes..."
if (content.startsWith("norm.includes('hoan thanh') || val.includes('đã hoàn thành')")) {
  content = content.replace("norm.includes('hoan thanh') || val.includes('đã hoàn thành')", "");
}

const oldStr = "const norm = val.normalize('NFD').replace(/[\\u0300-\\u036f]/g, ''); return norm.includes('done') || norm.includes('close') || norm.includes('dong') || norm.includes('tot') || norm.includes('da x') || norm.includes('hoan thanh') || val.includes('đã xử lý') || val.includes('xu ly');";
const newStr = "const norm = val.normalize('NFD').replace(/[\\u0300-\\u036f]/g, ''); return norm.includes('hoan thanh') || val.includes('đã hoàn thành');";

content = content.split(oldStr).join(newStr);
fs.writeFileSync('src/App.tsx', content);
