import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `{/* TAB 1: EXECUTIVE OVERVIEW (Sức khỏe hệ thống) */}`;
const replacement = `            {/* Main Content Sections */}
            <div className={\`grid gap-6 \${viewMode === 'focus' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12 auto-rows-min'}\`}>
               
               {/* TAB 1: EXECUTIVE OVERVIEW (Sức khỏe hệ thống) */}`;

content = content.replace(target, replacement);

fs.writeFileSync('src/App.tsx', content);
