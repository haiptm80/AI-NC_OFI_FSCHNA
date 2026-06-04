import fs from 'fs';
let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(/  \.flex-1 \{\s*flex: 0 0 auto !important;\s*\}/, '');

fs.writeFileSync('src/index.css', css);
