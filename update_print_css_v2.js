import fs from 'fs';

let css = fs.readFileSync('src/index.css', 'utf8');

// Replace the @media print section
const printCss = `
@media print {
  @page {
    size: A4 portrait;
    margin: 8mm; /* Slightly smaller margin to fit more */
  }
  
  body {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    font-size: 10px !important;
    background-color: transparent !important; /* Ensure no body bg overflow */
  }

  /* Hide header and non-essential buttons during print */
  header, 
  button,
  .print-hidden,
  input[type="text"],
  select {
    display: none !important;
  }

  main {
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
    display: block !important;
  }
  
  /* Layout Flow adjustments */
  .grid {
    display: block !important; /* Flatten grid in print for guaranteed sequential flow */
    grid-template-columns: 1fr !important;
  }
  
  /* Add margin between grid items when un-gridded */
  .grid > * {
    margin-bottom: 24px !important;
    width: 100% !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  /* Structural elements must attempt to avoid breaking inside */
  .bg-white, .lg\\:col-span-12, .lg\\:col-span-8, .lg\\:col-span-6, .lg\\:col-span-4, table, tr, th, td, .bg-\\[\\#1E40AF\\] {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  /* Flatten fixed heights that cause clipping */
  .h-\\[300px\\], .h-\\[350px\\], .h-\\[400px\\], .h-\\[450px\\], .min-h-\\[400px\\], .flex-1, .h-full {
    height: auto !important;
    min-height: auto !important;
  }
  
  .flex-1 {
    flex: 0 0 auto !important;
  }
  
  /* Reset scrollbar areas */
  .overflow-auto, .overflow-y-auto, .overflow-x-auto, .custom-scrollbar {
    overflow: visible !important;
    max-height: none !important;
  }

  /* Ensure text doesn't overflow */
  * {
    word-break: break-word !important;
    overflow-wrap: break-word !important;
  }
  
  /* Specific styling for Recharts to behave */
  .recharts-wrapper, .recharts-surface {
    max-width: 100% !important;
    page-break-inside: avoid !important;
  }
  
  /* Try giving charts a fixed print height so they render normally */
  .recharts-wrapper {
    height: 250px !important; 
  }
  
  /* Clean up borders and shadows for print */
  .shadow-sm, .shadow-md, .shadow-xl {
    box-shadow: none !important;
    border: 1px solid #e2e8f0 !important;
  }
  
  /* Remove rounded corners and thick borders if they look bad, though they might be fine */
  .bg-[#f2f6f9] {
    background-color: #f8fafc !important; /* Lighter background in print */
  }
}
`;

css = css.replace(/@media print \{[\s\S]*\}\n?/m, '');
if (!css.includes('@media print')) {
  css += printCss;
}

fs.writeFileSync('src/index.css', css);

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

// Also add print-hidden to AI insight buttons container to remove clutter on print
appContent = appContent.replace(/<div className="flex bg-\[\#1E3A8A\] p-1\.5 rounded-sm gap-2 flex-wrap">/, '<div className="flex bg-[#1E3A8A] p-1.5 rounded-sm gap-2 flex-wrap print-hidden">');

// Ensure Markdown renders optimally for printing (text size adjustment if necessary)
// prose already scales with font size in print, but prose-sm might not shrink enough. We can add a print-prose class
appContent = appContent.replace(/className="prose prose-sm max-w-none text-slate-800 prose-headings:text-\[\#1E40AF\] prose-a:text-\[\#F37021\] font-sans"/, 'className="prose prose-sm max-w-none text-slate-800 prose-headings:text-[#1E40AF] prose-a:text-[#F37021] font-sans print:prose-xs"');

fs.writeFileSync('src/App.tsx', appContent);
