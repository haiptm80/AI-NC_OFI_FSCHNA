import fs from 'fs';
let css = fs.readFileSync('src/index.css', 'utf8');

// Instead of nullifying height, let's just make page-break-inside: avoid handles it without flattening heights.

// And I'll set specific rules so fixed heights are forced to valid values, because if they are auto charts vanish.
css = css.replace(/\.h-\\[300px\\], \.h-\\[350px\\], \.h-\\[400px\\], \.h-\\[450px\\], \.min-h-\\[400px\\], \.flex-1, \.h-full \{[\s\S]*?\}/, `
  .h-\\[300px\\] { height: 300px !important; }
  .h-\\[350px\\] { height: 350px !important; }
  .h-\\[400px\\] { height: 400px !important; }
  .h-\\[450px\\] { height: 450px !important; }
  .min-h-\\[400px\\] { min-height: 400px !important; }
`);

fs.writeFileSync('src/index.css', css);
