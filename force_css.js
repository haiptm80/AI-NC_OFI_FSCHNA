import fs from 'fs';
let css = fs.readFileSync('src/index.css', 'utf8');

const target = `  /* Flatten fixed heights that cause clipping */
  .h-\\[300px\\], .h-\\[350px\\], .h-\\[400px\\], .h-\\[450px\\], .min-h-\\[400px\\], .flex-1, .h-full {
    height: auto !important;
    min-height: auto !important;
  }`;

css = css.replace(target, `  /* Keep fixed heights so charts can render properly */
  .h-\\[300px\\] { height: 300px !important; }
  .h-\\[350px\\] { height: 350px !important; }
  .h-\\[400px\\] { height: 400px !important; }
  .h-\\[450px\\] { height: 450px !important; }
  .min-h-\\[400px\\] { min-height: 400px !important; }`);

fs.writeFileSync('src/index.css', css);
