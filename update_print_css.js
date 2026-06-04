import fs from 'fs';

let css = fs.readFileSync('src/index.css', 'utf8');

// Replace the @media print section
const printCss = `
@media print {
  @page {
    size: A4 portrait;
    margin: 10mm;
  }
  
  body {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    font-size: 10px !important;            /* Shrink font to fit more */
    background-color: white !important;
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
  .bg-white, .lg\\:col-span-12, table, tr, th, td, .bg-\\[\\#1E40AF\\] {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }
  
  /* Reset background shadows and borders slightly to look cleaner on PDF */
  .shadow-sm, .shadow-md, .shadow-xl {
    box-shadow: none !important;
  }

  /* Force display block / grids for A4 bounds */
  main {
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  
  /* Allow natural heights */
  .h-\\[300px\\], .h-\\[350px\\], .h-\\[400px\\], .h-\\[450px\\], .min-h-\\[400px\\] {
    height: auto !important;
    min-height: 250px !important; /* Ensure charts have some height */
  }

  .grid {
    display: block !important;
  }
  .grid > * {
    margin-bottom: 20px !important;
    width: 100% !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  /* Keep top-level multi-column grids if they fit well */
  .md\\:grid-cols-2 { grid-template-columns: 1fr !important; }
  .md\\:grid-cols-3 { grid-template-columns: 1fr !important; }
  .xl\\:grid-cols-3 { grid-template-columns: 1fr !important; }

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
  .recharts-surface {
    overflow: visible !important;
  }
}
`;

css = css.replace(/@media print \{[\s\S]*\}\n/m, '');
if (!css.includes('@media print')) {
  css += printCss;
}

fs.writeFileSync('src/index.css', css);
