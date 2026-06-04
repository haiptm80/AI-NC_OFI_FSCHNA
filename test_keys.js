import fs from 'fs';
const data = JSON.parse(fs.readFileSync('public/data.json', 'utf8') || '[]');
if (data.length > 0) {
    const keys = Object.keys(data[0]);
    console.log("Keys:", keys.map((k, i) => `${i}: ${k}`).join(', '));
    const vals = data.slice(1).map(row => row[keys[9]]);
    const uniqueVals = [...new Set(vals)];
    console.log("Unique in Column J (index 9):", uniqueVals);
    
    // Find column containing "hoan thanh"
    const colsWithHoanThanh = keys.map((k, i) => {
        const hasHT = data.some(row => String(row[k] || '').toLowerCase().includes('hoàn thành'));
        if (hasHT) return `${i}: ${k}`;
        return null;
    }).filter(Boolean);
    console.log("Columns with 'hoan thanh':", colsWithHoanThanh);

    const colsWithDongLoi = keys.map((k, i) => {
        const hasDL = data.some(row => String(row[k] || '').toLowerCase().includes('đóng') || String(row[k] || '').toLowerCase().includes('closed'));
        if (hasDL) return `${i}: ${k}`;
        return null;
    }).filter(Boolean);
    console.log("Columns with 'đóng lỗi/closed':", colsWithDongLoi);
}
