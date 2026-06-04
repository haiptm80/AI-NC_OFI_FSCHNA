import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// replace html2canvas import with html-to-image
content = content.replace(
  /import html2canvas from "html2canvas";/,
  'import { toPng } from "html-to-image";\nimport html2canvas from "html2canvas"; // Kept for reference but using html-to-image for better SVG/oklch support'
);

const newHandleExportPDF = `  const handleExportPDF = async () => {
    if (!dashboardRef.current) return;
    setIsExporting(true);
    try {
      const element = dashboardRef.current;
      
      // Temporarily store styles
      const originalHeight = element.style.height;
      const originalOverflow = element.style.overflow;
      
      // Expand element to capture full scrollable area
      element.style.height = 'auto';
      element.style.overflow = 'visible';
      
      // Small delay to let React/browser render the expanded DOM
      await new Promise(resolve => setTimeout(resolve, 300));

      // Use html-to-image to bypass html2canvas 'oklch' color parsing crash & support SVG
      const dataUrl = await toPng(element, { 
        quality: 1.0, 
        backgroundColor: '#ffffff',
        pixelRatio: 2 // High detail for charts
      });
      
      // Restore styles
      element.style.height = originalHeight;
      element.style.overflow = originalOverflow;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate image dimensions to fit PDF width
      const imgProps = pdf.getImageProperties(dataUrl);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add remaining pages if image is taller than 1 page
      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("Bao_Cao_QA.pdf");
    } catch (err) {
      console.error("Lỗi xuất PDF", err);
    } finally {
      setIsExporting(false);
    }
  };`;

content = content.replace(
  /const handleExportPDF = \(\) => \{\s*setIsExporting\(true\);\s*setTimeout\(\(\) => \{\s*window\.print\(\);\s*setIsExporting\(false\);\s*\}, 500\);\s*\};/,
  newHandleExportPDF
);

fs.writeFileSync('src/App.tsx', content);
