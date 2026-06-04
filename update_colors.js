import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const colorsVar = `\nconst COLORS = ['#1f497d', '#c0504d', '#9bbb59', '#F37021', '#4b6a9b', '#d27976', '#aed175', '#f89a5e', '#64748b'];\n`;

// Insert after imports and top-level definitions
if (!content.includes('const COLORS =')) {
  // Let's just put it under `const SHEET_ID` or similar if it exists, otherwise just after `export default function App() {`
  const target = `export default function App() {`;
  content = content.replace(target, colorsVar + target);
  fs.writeFileSync('src/App.tsx', content);
}
