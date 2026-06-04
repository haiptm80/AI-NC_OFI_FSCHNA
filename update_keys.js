import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace detectKeys logic
const originalDetectKeys = `    let categoryKey = keys.find(k => /module|category|type|group|nhóm|loại|phân loại/i.test(k));
    if (!categoryKey) {
      categoryKey = keys.find(k => {
        const uniqueVals = new Set(jsonData.map((d: any) => d[k])).size;
        return typeof (jsonData[0] as any)[k] === 'string' && uniqueVals > 1 && uniqueVals <= 20;
      }) || keys[0];
    }

    let timeKey = keys.find(k => /date|month|year|sprint|ngày|tháng|năm|thời gian/i.test(k)) || categoryKey;
    let deptKey = keys.find(k => /bộ phận|phòng|dept|department|team|đơn vị/i.test(k));
    let severityKey = keys.find(k => /severity|mức|cấp độ|nghiêm trọng|risk|rủi ro|loại lỗi/i.test(k));
    let statusKey = keys.find(k => /status|trạng thái|tình trạng/i.test(k));

    const detectedKeys = { categoryKey, timeKey, deptKey, severityKey, statusKey };`;

const newDetectKeys = `    let categoryKey = keys.find(k => k === 'Nhóm lỗi' || k.includes('Nhóm lỗi')) || keys[10];
    let subCategoryKey = keys.find(k => k === 'Nhóm lỗi con') || keys[11];
    let timeKey = keys.find(k => k.includes('Năm học') || k.includes('năm')) || keys[5];
    let deptKey = keys.find(k => k.includes('Bộ phận') || k.includes('Đơn vị')) || keys[4];
    let severityKey = keys.find(k => /severity|mức|cấp độ|nghiêm trọng|risk|rủi ro|loại lỗi/i.test(k));
    let statusKey = keys.find(k => k.includes('Tình trạng') || k.includes('xử lý')) || keys[9];
    let causeKey = keys.find(k => k.includes('Nguyên nhân')) || keys[7];
    let actionKey = keys.find(k => k.includes('Đề xuất') || k.includes('Hành động')) || keys[8];

    const detectedKeys = { categoryKey, subCategoryKey, timeKey, deptKey, severityKey, statusKey, causeKey, actionKey };`;

content = content.replace(originalDetectKeys, newDetectKeys);

fs.writeFileSync('src/App.tsx', content);
