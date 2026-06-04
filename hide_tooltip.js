import fs from 'fs';
let css = fs.readFileSync('src/index.css', 'utf8');

if (!css.includes('.recharts-tooltip-wrapper')) {
  css = css.replace(/@media print \{/, "@media print {\n  .recharts-tooltip-wrapper { display: none !important; }\n");
  fs.writeFileSync('src/index.css', css);
}
