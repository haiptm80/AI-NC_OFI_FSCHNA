import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace standard handleExportPDF
const newHandleExportPDF = `  const handleExportPDF = async () => {
    if (!dashboardRef.current) return;
    setIsExporting(true);
    try {
      // Use dom-to-image-more which supports modern CSS (oklch) via SVG foreignObject
      const domtoimage = (await import('dom-to-image-more')).default;
      
      const node = dashboardRef.current;
      
      // Get the full scroll height to capture everything
      const scale = 2; // For better quality
      const style = {
        transform: 'scale(' + scale + ')',
        transformOrigin: 'top left',
        width: node.offsetWidth + 'px',
        height: node.offsetHeight + 'px'
      };
      
      const param = {
        height: node.offsetHeight * scale,
        width: node.offsetWidth * scale,
        quality: 1,
        style
      };
      
      const dataUrl = await domtoimage.toPng(node, param);
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (node.offsetHeight * scale * pdfWidth) / (node.offsetWidth * scale);
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('FPT_Education_QA_Report.pdf');
    } catch (err) {
      console.error("Error exporting PDF:", err);
      alert("Có lỗi xảy ra khi xuất PDF. Chi tiết: " + err);
    } finally {
      setIsExporting(false);
    }
  };`;

// We inject the new function
content = content.replace(
  /const handleExportPDF = async \(\) => \{[\s\S]*?setIsExporting\(false\);\n    \}\n  \};/,
  newHandleExportPDF
);

// We need to restore the correct buttons as per user request to change color of Export button.
// And make sure we don't have "Xuất Báo cáo" duplicate logic. 
// "Phiên bản này xuất trực tiếp ra file PDF"

fs.writeFileSync('src/App.tsx', content);
