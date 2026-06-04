import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
`      const isRes = () => {
         if (dataKeys.statusKey) {
            const val = String(row[dataKeys.statusKey] || '').toLowerCase();
            const norm = val.normalize('NFD').replace(/[\\u0300-\\u036f]/g, ''); 
            return norm.includes('hoan thanh') || val.includes('đã hoàn thành');
         }
         return false;
      };`,
`      const isRes = () => {
         if (dataKeys.statusKey) {
            const val = String(row[dataKeys.statusKey] || '').toLowerCase();
            const norm = val.normalize('NFD').replace(/[\\u0300-\\u036f]/g, ''); 
            return norm.includes('hoan thanh') || norm.includes('dong loi') || norm.includes('da dong') || norm.includes('closed') || norm.includes('da xu ly') || val.includes('đã hoàn thành') || val.includes('đã xử lý');
         }
         return false;
      };`
);

code = code.replace(
`      resolvedErrors = filtered.filter((r: any) => {
         const val = String(r[dataKeys.statusKey] || '').toLowerCase();
         const norm = val.normalize('NFD').replace(/[\\u0300-\\u036f]/g, ''); return norm.includes('hoan thanh') || val.includes('đã hoàn thành');
      }).length;`,
`      resolvedErrors = filtered.filter((r: any) => {
         const val = String(r[dataKeys.statusKey] || '').toLowerCase();
         const norm = val.normalize('NFD').replace(/[\\u0300-\\u036f]/g, ''); return norm.includes('hoan thanh') || norm.includes('dong loi') || norm.includes('da dong') || norm.includes('closed') || norm.includes('da xu ly') || val.includes('đã hoàn thành') || val.includes('đã xử lý');
      }).length;`
);

code = code.replace(
`       const isRes = (r: any) => {
         if (dataKeys.statusKey) {
            const val = String(r[dataKeys.statusKey] || '').toLowerCase();
            const norm = val.normalize('NFD').replace(/[\\u0300-\\u036f]/g, ''); return norm.includes('hoan thanh') || val.includes('đã hoàn thành');
         }
         return false;
       };`,
`       const isRes = (r: any) => {
         if (dataKeys.statusKey) {
            const val = String(r[dataKeys.statusKey] || '').toLowerCase();
            const norm = val.normalize('NFD').replace(/[\\u0300-\\u036f]/g, ''); return norm.includes('hoan thanh') || norm.includes('dong loi') || norm.includes('da dong') || norm.includes('closed') || norm.includes('da xu ly') || val.includes('đã hoàn thành') || val.includes('đã xử lý');
         }
         return false;
       };`
);

fs.writeFileSync('src/App.tsx', code);
console.log("updated");
