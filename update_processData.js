import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const processDataStart = `  const processRawData = (jsonData: any[]) => {`;
const processDataEnd = `    setRawData(jsonData);
  };`;

const processDataIdx = content.indexOf(processDataStart);
const processDataEndIdx = content.indexOf(processDataEnd);

if (processDataIdx === -1 || processDataEndIdx === -1) {
  console.log("Could not find processRawData");
  process.exit(1);
}

const newProcessData = `  const processRawData = (jsonData: any[]) => {
    // Delete 'TT' columns completely to prevent chart rendering issues
    const cleanedData = jsonData.map(row => {
       const newRow = { ...row };
       if (newRow['TT']) delete newRow['TT'];
       if (newRow['tt']) delete newRow['tt'];
       return newRow;
    });
    
    const keys = Object.keys(cleanedData[0] as object) || [];
    if (keys.length === 0) {
      setError("Không tìm thấy cột dữ liệu (Header).");
      return;
    }

    // Auto-detect keys (prioritize 'Bộ phận' over 'Đơn vị')
    let categoryKey = keys.find(k => k === 'Nhóm lỗi' || k.includes('Nhóm lỗi')) || keys[10];
    let subCategoryKey = keys.find(k => k === 'Nhóm lỗi con') || keys[11];
    let timeKey = keys.find(k => k.includes('Năm học') || k.includes('năm')) || keys[5];
    let deptKey = keys.find(k => k.toLowerCase().includes('bộ phận')) || keys.find(k => k.includes('Phòng ban')) || keys.find(k => k.includes('Đơn vị')) || keys[4];
    let severityKey = keys.find(k => /severity|mức|cấp độ|nghiêm trọng|risk|rủi ro|loại lỗi/i.test(k));
    let statusKey = keys.find(k => k.includes('Tình trạng') || k.includes('xử lý')) || keys[9];
    let causeKey = keys.find(k => k.includes('Nguyên nhân')) || keys[7];
    let actionKey = keys.find(k => k.includes('Đề xuất') || k.includes('Hành động')) || keys[8];

    const detectedKeys = { categoryKey, subCategoryKey, timeKey, deptKey, severityKey, statusKey, causeKey, actionKey };
    setDataKeys(detectedKeys);

    // Extract unique values for filters
    const times = Array.from(new Set(cleanedData.map((r: any) => String(r[timeKey])))).filter(Boolean).sort();
    const depts = deptKey ? Array.from(new Set(cleanedData.map((r: any) => String(r[deptKey])))).filter(Boolean).sort() : [];
    const categories = Array.from(new Set(cleanedData.map((r: any) => String(r[categoryKey])))).filter(Boolean).sort();
    
    setFilterOptions({ times, depts, categories });
    // Don't override existing filters if valid
    setFilters(prev => ({
       time: times.includes(prev.time) || prev.time === "All" ? prev.time : "All",
       dept: depts.includes(prev.dept) || prev.dept === "All" ? prev.dept : "All",
       category: categories.includes(prev.category) || prev.category === "All" ? prev.category : "All",
    }));

`;

content = content.substring(0, processDataIdx) + newProcessData + content.substring(processDataEndIdx);
fs.writeFileSync('src/App.tsx', content);
