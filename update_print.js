import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace handleExportPDF with window.print
const oldExport = /const handleExportPDF = async \(\) => \{[\s\S]*?setIsExporting\(false\);\n    \}\n  \};/g;

const newExport = `const handleExportPDF = async () => {
    // We use window.print() and CSS media print for perfect PDF output
    setIsExporting(true);
    setTimeout(() => {
        window.print();
        setIsExporting(false);
    }, 500); 
  };`;

if (content.match(oldExport)) {
  content = content.replace(oldExport, newExport);
}

// Remove the jsPDF import since it's no longer used
content = content.replace(/import jsPDF from "jspdf";\n/g, "");

fs.writeFileSync('src/App.tsx', content);

let cssContent = fs.readFileSync('src/index.css', 'utf8');

const printCSS = `
@media print {
  @page {
    size: A4 portrait;
    margin: 10mm;
  }
  
  body {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    font-size: 11px !important;            /* Shrink font to fit more */
  }

  /* Hide header and non-essential buttons during print */
  header, 
  button, 
  .print-hidden,
  input[type="text"],
  select {
    display: none !important;
  }

  /* Prevent page breaks inside cards/boxes */
  .bg-white, .lg\\:col-span-12, .grid, table {
    page-break-inside: avoid;
    break-inside: avoid;
  }
  
  /* Reset background shadows and borders slightly to look cleaner on PDF */
  .shadow-sm, .shadow-md {
    box-shadow: none !important;
    border: 1px solid #e2e8f0 !important;
  }

  /* Force display block / grids for A4 bounds */
  main {
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  
  .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
  .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
  .xl\\:grid-cols-3 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }

  /* Ensure text doesn't overflow */
  * {
    word-break: break-word !important;
    overflow-wrap: break-word !important;
  }

  /* For large text area, show raw content instead of scrolling */
  .overflow-auto, .custom-scrollbar {
    overflow: visible !important;
    max-height: none !important;
  }
  
  /* Make sure charts shrink and render, remove fixed positioning */
  .recharts-wrapper {
    max-width: 100% !important;
  }
}
`;

if (!cssContent.includes('@media print')) {
  cssContent += printCSS;
}

fs.writeFileSync('src/index.css', cssContent);

