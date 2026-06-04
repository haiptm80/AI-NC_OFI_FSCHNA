import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add jsPDF import
if (!content.includes('import { jsPDF }')) {
  content = content.replace(
    /import html2canvas from "html2canvas";/,
    'import html2canvas from "html2canvas";\nimport { jsPDF } from "jspdf";'
  );
}

const replaceExportPDF = `  const handleExportPDF = async () => {
    if (!dashboardRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(dashboardRef.current, { scale: 2, useCORS: true, logging: false });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = pdfHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      // Add remaining pages if it exceeds 1 page
      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }

      pdf.save("Bao_Cao_QA.pdf");
    } catch (err) {
      console.error("Lỗi xuất PDF", err);
    } finally {
      setIsExporting(false);
    }
  };`;

content = content.replace(
  /const handleExportPDF = \(\) => \{\s*window\.print\(\);\s*\};/,
  replaceExportPDF
);

content = content.replace(
  /<Download className="w-3\.5 h-3\.5" \/> Báo cáo/,
  '{isExporting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />} Báo cáo'
);

fs.writeFileSync('src/App.tsx', content);
