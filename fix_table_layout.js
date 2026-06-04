import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// The original layout for the Top 5 Lỗi has <table className="w-full text-left border-collapse m-0 h-full"> ... </table> inside a grid that can get up to 3 columns.
// Let's change the grid layout to only 2 columns max to give more breathing room.
content = content.replace(
  /<div className="p-4 bg-white grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">/,
  '<div className="p-4 bg-white grid grid-cols-1 xl:grid-cols-2 gap-6">'
);

// Truncate even more aggressively for "ngắn gọn súc tích"
content = content.replace(
  /causeText\.length > 200 \? causeText\.slice\(0, 200\) \+ '\.\.\.' : causeText;/,
  "causeText.length > 100 ? causeText.slice(0, 100) + '...' : causeText;"
);
content = content.replace(
  /actionText\.length > 200 \? actionText\.slice\(0, 200\) \+ '\.\.\.' : actionText;/,
  "actionText.length > 120 ? actionText.slice(0, 120) + '...' : actionText;"
);

// We should also change line-clamp-4 to line-clamp-3
content = content.replace(
  /className="leading-relaxed font-medium line-clamp-4"/g,
  'className="leading-relaxed font-medium line-clamp-3 text-[12px]"'
);
content = content.replace(
  /className="leading-relaxed line-clamp-4"/g,
  'className="leading-relaxed line-clamp-3 text-[12px]"'
);

fs.writeFileSync('src/App.tsx', content);
