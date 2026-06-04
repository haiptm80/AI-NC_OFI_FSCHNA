import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove Tabs completely
content = content.replace(
  /\{Object\.keys\(sheetsData\)\.length > 0 && !error && \([\s\S]*?className="mt-4 flex gap-2 border-b border-slate-200 pb-\[1px\] overflow-x-auto custom-scrollbar"[\s\S]*?<\/div>\s*\)\}/,
  '{/* Removed per user request */}'
);

// 2. Fix resolved/closed numbers logic
// Original: norm.includes('done') || norm.includes('close') || norm.includes('dong') || norm.includes('tot') || norm.includes('da x') || norm.includes('hoan thanh') || val.includes('đã xử lý') || val.includes('xu ly')
content = content.replace(
  /norm\.includes\('done'\) || norm\.includes\('close'\) || norm\.includes\('dong'\) || norm\.includes\('tot'\) || norm\.includes\('da x'\) || norm\.includes\('hoan thanh'\) || val\.includes\('đã xử lý'\) || val\.includes\('xu ly'\)/,
  "norm.includes('hoan thanh') || val.includes('đã hoàn thành')"
);

content = content.replace(
  /if \(rowStr.includes\('đã xử lý'\) \|\| rowStr.includes\('close'\) \|\| rowStr.includes\('đóng'\) \|\| rowStr.includes\('done'\)\) \{/,
  "if (rowStr.includes('đã hoàn thành')) {"
);

content = content.replace(
  /if \(rowStr.includes\('đang xử lý'\) \|\| rowStr.includes\('sắp đến hạn'\) \|\| rowStr.includes\('pending'\) \|\| rowStr.includes\('chưa xử lý'\)\) \{/,
  "if (rowStr.includes('chưa đến hạn') || rowStr.includes('chưa xử lý') || rowStr.includes('đóng muộn')) {"
);

// 3. Fix Top 5 Lỗi formatting (add line-clamp and limit string length if it exceeds)
content = content.replace(
  /<span className="leading-relaxed font-medium">\{causeText\}<\/span>/,
  '<span className="leading-relaxed font-medium line-clamp-4" title={causeText}>{causeText}</span>'
);
content = content.replace(
  /<span className="leading-relaxed">\{actionText\}<\/span>/,
  '<span className="leading-relaxed line-clamp-4" title={actionText}>{actionText}</span>'
);

// 4. Fix Print Export
content = content.replace(
  /const handleExportPDF = async \(\) => \{[\s\S]*?setIsExporting\(true\);[\s\S]*?setTimeout\(\(\) => \{[\s\S]*?window\.print\(\);[\s\S]*?setIsExporting\(false\);[\s\S]*?\}, 500\);[\s\S]*?\};/,
  `const handleExportPDF = () => {
    window.print();
  };`
);

// Fix button state to not rely on isExporting, because window.print is sync in most places
content = content.replace(
  /\{isExporting \? <RefreshCw className=\"w-3\.5 h-3\.5 animate-spin\" \/> : <Download className=\"w-3\.5 h-3\.5\" \/>\}[\s\S]*?Báo cáo/,
  '<Download className="w-3.5 h-3.5" /> Báo cáo'
);

// Let's also enforce string length clipping in case line-clamp fails in print
content = content.replace(
  /let causeText = parts\[0\] \|\| cause\.trim\(\);/,
  "let causeText = parts[0] || cause.trim(); causeText = causeText.length > 200 ? causeText.slice(0, 200) + '...' : causeText;"
);
content = content.replace(
  /let actionText = parts\[1\] \|\| '---';/,
  "let actionText = parts[1] || '---'; actionText = actionText.length > 200 ? actionText.slice(0, 200) + '...' : actionText;"
);

// Fix the critical warning box also (red box 3 from last image shows NC/CRITICAL at 25.4%),
// the user says: "các NC-OFI đã được đóng là ghi nhận đã hoàn thành... chưa đóng là chưa đến hạn... "
// I will also make sure the numbers match what the user is expecting. Let's make sure strings are correct.

fs.writeFileSync('src/App.tsx', content);
