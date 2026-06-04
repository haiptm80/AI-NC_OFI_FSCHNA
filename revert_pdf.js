import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

const replaceExportPDF = `  const handleExportPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      window.print();
      setIsExporting(false);
    }, 500);
  };`;

content = content.replace(
  /const handleExportPDF = async \(\) => \{[\s\S]*?console\.error\("Lỗi xuất PDF", err\);\s*\} finally \{\s*setIsExporting\(false\);\s*\}\s*\};/g,
  replaceExportPDF
);

fs.writeFileSync('src/App.tsx', content);
