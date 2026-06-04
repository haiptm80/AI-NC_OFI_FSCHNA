import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Insert trends calculation
const targetToInsertBefore = `    setChartData({`;

const trendsCode = `
    let trends = { total: 0, critical: 0, resolved: 0, risk: 0 };
    if (lineData.length >= 2) {
       const currentPeriod = lineData[lineData.length - 1].name;
       const previousPeriod = lineData[lineData.length - 2].name;
       
       const currentData = filtered.filter(r => String(r[dataKeys.timeKey] || 'Unknown') === currentPeriod);
       const previousData = filtered.filter(r => String(r[dataKeys.timeKey] || 'Unknown') === previousPeriod);

       // Total
       const currTotal = currentData.length;
       const prevTotal = previousData.length;
       if (prevTotal > 0) trends.total = ((currTotal - prevTotal) / prevTotal) * 100;

       // Critical
       let currCrit = 0, prevCrit = 0;
       if (dataKeys.severityKey) {
         currCrit = currentData.filter((r: any) => {
           const val = String(r[dataKeys.severityKey] || '').toLowerCase();
           return val.includes('critical') || val.includes('major') || val.includes('cao') || val.includes('nặng') || val.includes('rủi ro') || val.includes('nc');
         }).length;
         prevCrit = previousData.filter((r: any) => {
           const val = String(r[dataKeys.severityKey] || '').toLowerCase();
           return val.includes('critical') || val.includes('major') || val.includes('cao') || val.includes('nặng') || val.includes('rủi ro') || val.includes('nc');
         }).length;
       }
       if (prevCrit > 0) trends.critical = ((currCrit - prevCrit) / prevCrit) * 100;

       // Resolved
       let currRes = 0, prevRes = 0;
       if (dataKeys.statusKey) {
         currRes = currentData.filter((r: any) => {
           const val = String(r[dataKeys.statusKey] || '').toLowerCase();
           return val.includes('done') || val.includes('close') || val.includes('đóng') || val.includes('tốt') || val.includes('đã xử lý');
         }).length;
         prevRes = previousData.filter((r: any) => {
           const val = String(r[dataKeys.statusKey] || '').toLowerCase();
           return val.includes('done') || val.includes('close') || val.includes('đóng') || val.includes('tốt') || val.includes('đã xử lý');
         }).length;
       }
       if (prevRes > 0) trends.resolved = ((currRes - prevRes) / prevRes) * 100;

       // Risk Rate
       const currRisk = currTotal > 0 ? (currCrit / currTotal) : 0;
       const prevRisk = prevTotal > 0 ? (prevCrit / prevTotal) : 0;
       if (prevRisk > 0) trends.risk = ((currRisk - prevRisk) / prevRisk) * 100;
    }

`;

content = content.replace(targetToInsertBefore, trendsCode + targetToInsertBefore);

// Add trends to setChartData
content = content.replace(
  'filtered: filtered',
  'filtered: filtered,\n      trends'
);

fs.writeFileSync('src/App.tsx', content);
