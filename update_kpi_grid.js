import fs from 'fs';

let css = fs.readFileSync('src/index.css', 'utf8');

// I'm going to add a utility class for grids that should stay grids in print
const keepGridCss = `
  /* Specific class to force grid layout in print */
  .print\\:grid-preserve {
    display: grid !important;
    gap: 1rem !important;
  }
  .print\\:grid-preserve > * {
    margin-bottom: 0 !important;
    width: auto !important;
  }
  .print\\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
  }
  .print\\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }
`;

css = css.replace(/@media print \{/, '@media print {\n' + keepGridCss);
fs.writeFileSync('src/index.css', css);

let appContent = fs.readFileSync('src/App.tsx', 'utf8');
// Find the KPI grid (the first one)
appContent = appContent.replace(
  /<div className="grid grid-cols-2 md:grid-cols-4 gap-4">/,
  '<div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:grid-preserve print:grid-cols-4">'
);
fs.writeFileSync('src/App.tsx', appContent);
