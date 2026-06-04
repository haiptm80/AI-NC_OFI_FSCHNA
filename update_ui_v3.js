import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Insert divider before TAB 2
content = content.replace(
  /\{\/\* TAB 2: DEPARTMENT HOTSPOTS \*\/\}/g, 
  '<div className="mt-8 border-t-2 border-slate-100 pt-6"></div>\n               {/* TAB 2: DEPARTMENT HOTSPOTS */}'
);

fs.writeFileSync('src/App.tsx', content);
