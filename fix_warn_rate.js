import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Update lineData calculation
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
            return norm.includes('hoan thanh') || val.includes('đã hoàn thành');
         }
         return false;
      };
      const isOverdue = () => {
         if (dataKeys.statusKey) {
            const val = String(row[dataKeys.statusKey] || '').toLowerCase();
            const norm = val.normalize('NFD').replace(/[\\u0300-\\u036f]/g, ''); 
            return norm.includes('dong muon') || (norm.includes('qua han') && !norm.includes('chua den han'));
         }
         return false;
      };`
);

code = code.replace(
`      if (!acc[time]) {
         acc[time] = { name: time, total: 0, resolved: 0 };`,
`      if (!acc[time]) {
         acc[time] = { name: time, total: 0, resolved: 0, overdue: 0 };`
);

code = code.replace(
`      if (isRes()) {
         acc[time].resolved += 1;
      }
      return acc;`,
`      if (isRes()) {
         acc[time].resolved += 1;
      }
      if (isOverdue()) {
         acc[time].overdue += 1;
      }
      return acc;`
);

code = code.replace(
`         warningRate: item.total > 0 ? Number((((item.total - item.resolved) / item.total) * 100).toFixed(1)) : 0`,
`         warningRate: item.total > 0 ? Number((100 - (item.overdue / item.total) * 100).toFixed(1)) : 0`
);


// Update main trend calculations
code = code.replace(
`    // Tỷ lệ cảnh báo (warningRate) được tính bằng: (Tổng số lỗi NC_OFI - Số lỗi đã hoàn thành)
    criticalErrors = filtered.length - resolvedErrors;`,
`    let overdueErrors = 0;
    if (dataKeys.statusKey) {
      overdueErrors = filtered.filter((r: any) => {
         const val = String(r[dataKeys.statusKey] || '').toLowerCase();
         const norm = val.normalize('NFD').replace(/[\\u0300-\\u036f]/g, ''); 
         return norm.includes('dong muon') || (norm.includes('qua han') && !norm.includes('chua den han'));
      }).length;
    }
    
    // Tỷ lệ cảnh báo (warningRate) = 100% - Tỷ lệ đóng lỗi quá hạn.
    // So criticalErrors (which serves as the numerator for the 100-based percentage)
    // will be total - overdueErrors, meaning (total - overdue) / total = 100% - overdue/total.
    criticalErrors = filtered.length - overdueErrors;`
);

code = code.replace(
`       const currCrit = currTotal - currRes;
       const prevCrit = prevTotal - prevRes;`,
`       const isOverdueItem = (r: any) => {
         if (dataKeys.statusKey) {
            const val = String(r[dataKeys.statusKey] || '').toLowerCase();
            const norm = val.normalize('NFD').replace(/[\\u0300-\\u036f]/g, ''); 
            return norm.includes('dong muon') || (norm.includes('qua han') && !norm.includes('chua den han'));
         }
         return false;
       };
       const currOverdue = currentData.filter(isOverdueItem).length;
       const prevOverdue = previousData.filter(isOverdueItem).length;
       const currCrit = currTotal - currOverdue;
       const prevCrit = prevTotal - prevOverdue;`
);

code = code.replace(
`                            <p className="text-slate-600 leading-relaxed">
                             Tỷ lệ cảnh báo được tính bằng: <strong>(Tổng số lỗi NC_OFI - Số lỗi đã hoàn thành) / Tổng số lỗi</strong>.
                             <br/><br/>
                             Ví dụ: Nếu tổng có 126 lỗi, phần lớn (124 lỗi) đang chưa được xử lý/đóng hoàn toàn, nên tỷ lệ đóng lỗi chỉ đạt 1.6%. Khoảng hở bù lại chính là tỷ lệ tồn đọng/cảnh báo lên đến <strong>98.4%</strong>. Điều này hiển thị rằng có rất nhiều việc đang trong tình trạng "Đang xử lý" hoặc "Chưa hoàn thành".
                          </p>`,
`                            <p className="text-slate-600 leading-relaxed">
                             Tỷ lệ cảnh báo được tính bằng: <strong>100% - Tỷ lệ đóng lỗi quá hạn</strong>. (Chỉ tính lỗi đóng muộn, không tính lỗi chưa đến hạn).
                             <br/><br/>
                             Ví dụ: Tỷ lệ cảnh báo giúp đánh giá mức độ tuân thủ hạn chót. Nếu tỷ lệ cảnh báo cao, có nghĩa là số lượng lỗi bị đóng muộn chiếm tỷ lệ rất thấp so với tổng số lỗi phát sinh, thể hiện hệ thống đang đáp ứng tốt thời gian xử lý.
                          </p>`
);

fs.writeFileSync('src/App.tsx', code);
console.log("Updated App.tsx successfully.");
