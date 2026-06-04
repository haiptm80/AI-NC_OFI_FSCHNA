import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const startMarker = `  // Compute charts when rawData or filters change`;
const endMarker = `    setChartData({`;

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.log('Markers not found');
  process.exit(1);
}

const newChartLogic = `  // Compute charts when rawData or filters change
  useEffect(() => {
    if (!rawData || !dataKeys) return;

    let filtered = rawData;
    
    // Apply global text search
    if (globalSearch && globalSearch.trim() !== '') {
      const searchLower = globalSearch.toLowerCase();
      filtered = filtered.filter(row => {
        return Object.values(row).some(val => 
          val !== null && val !== undefined && String(val).toLowerCase().includes(searchLower)
        );
      });
    }

    if (filters.time !== "All") filtered = filtered.filter(r => String(r[dataKeys.timeKey]) === filters.time);
    if (filters.dept !== "All" && dataKeys.deptKey) filtered = filtered.filter(r => String(r[dataKeys.deptKey]) === filters.dept);
    if (filters.category !== "All") filtered = filtered.filter(r => String(r[dataKeys.categoryKey]) === filters.category);

    const totalRecords = filtered.length;

    // Helper for Pareto
    const calculatePareto = (data: any[], key: string) => {
      const counts = data.reduce((acc: any, row: any) => {
        const val = String(row[key] || 'Unknown');
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {});
      
      const sorted = Object.entries(counts)
        .map(([name, value]) => ({ name, value: Number(value) }))
        .sort((a, b) => b.value - a.value);

      let cumulative = 0;
      const total = sorted.reduce((sum, item) => sum + item.value, 0);
      return sorted.map(item => {
        cumulative += item.value;
        return {
          ...item,
          cumulativePercent: total > 0 ? Number(((cumulative / total) * 100).toFixed(1)) : 0
        };
      });
    };

    // 1. Bar / Pareto (Category - Nhóm lỗi)
    const paretoData = calculatePareto(filtered, dataKeys.categoryKey).slice(0, 15);

    // 2. Bar / Pareto (Dept - Bộ phận)
    const deptParetoData = calculatePareto(filtered, dataKeys.deptKey);

    // 3. Line Data (Time - Năm học)
    const lineCounts = filtered.reduce((acc: any, row: any) => {
      const val = String(row[dataKeys.timeKey] || 'Unknown');
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});
    const lineData = Object.entries(lineCounts)
      .map(([name, value]) => ({ name, value: Number(value) }))
      .sort((a, b) => a.name.localeCompare(b.name));

    // 4. Cause Summary (Nguyên nhân)
    const causeCategories = ['Quy trình (tính tuân thủ)', 'Con người', 'Hệ thống / Quản lý', 'Nguồn lực / Cơ sở vật chất', 'Khác'];
    const getCauseGroup = (causeStr: string) => {
      const str = (causeStr || '').toLowerCase();
      if (str.includes('quy trình') || str.includes('tuân thủ') || str.includes('quy định') || str.includes('hướng dẫn')) return causeCategories[0];
      if (str.includes('con người') || str.includes('nhân sự') || str.includes('cá nhân') || str.includes('chủ quan') || str.includes('kỹ năng') || str.includes('nhận thức')) return causeCategories[1];
      if (str.includes('hệ thống') || str.includes('công cụ') || str.includes('tool') || str.includes('phần mềm') || str.includes('quản lý')) return causeCategories[2];
      if (str.includes('nguồn lực') || str.includes('cơ sở') || str.includes('vật chất') || str.includes('thiết bị') || str.includes('hạ tầng')) return causeCategories[3];
      return causeCategories[4];
    };

    // Build cross tab for Cause by Time
    const sortedTimes = [...new Set(filtered.map(r => String(r[dataKeys.timeKey] || 'Unknown')))].sort();
    const causeSummaryData = causeCategories.map(group => {
      const rowData: any = { name: group };
      sortedTimes.forEach(time => {
        const timeData = filtered.filter(r => String(r[dataKeys.timeKey] || 'Unknown') === time);
        const groupCount = timeData.filter(r => getCauseGroup(String(r[dataKeys.causeKey])) === group).length;
        rowData[time] = timeData.length > 0 ? (groupCount / timeData.length) * 100 : 0;
      });
      return rowData;
    });

    // Subcategory Analysis for top error groups
    const topCategoryDepts: any = {};
    const topErrorGroups = paretoData.slice(0, 5).map(p => p.name);
    topErrorGroups.forEach(group => {
      const groupData = filtered.filter(r => String(r[dataKeys.categoryKey]) === group);
      const subCauses = calculatePareto(groupData, dataKeys.subCategoryKey).slice(0, 3).map(s => s.name).join('; ');
      
      const deptCounts = groupData.reduce((acc: any, row: any) => {
        const d = String(row[dataKeys.deptKey] || 'Unknown');
        acc[d] = (acc[d] || 0) + 1;
        return acc;
      }, {});
      const topDept = Object.entries(deptCounts).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || 'N/A';
      
      topCategoryDepts[group] = {
        topDept,
        subCauses,
        count: groupData.length
      };
    });

    // Totals & Trends
    let criticalErrors = 0;
    let resolvedErrors = 0;

    if (dataKeys.severityKey) {
      criticalErrors = filtered.filter((r: any) => {
         const val = String(r[dataKeys.severityKey] || '').toLowerCase();
         return val.includes('critical') || val.includes('major') || val.includes('cao') || val.includes('nặng') || val.includes('rủi ro') || val.includes('nc') || val.includes('major');
      }).length;
    } else {
      // fallback to category logic if severity is missing
      criticalErrors = filtered.filter((r: any) => {
         const category = String(r[dataKeys.categoryKey] || '').toLowerCase();
         return category.includes('nc') || category.includes('critical') || category.includes('nghiêm trọng');
      }).length;
    }

    if (dataKeys.statusKey) {
      resolvedErrors = filtered.filter((r: any) => {
         const val = String(r[dataKeys.statusKey] || '').toLowerCase();
         return val.includes('done') || val.includes('close') || val.includes('đóng') || val.includes('tốt') || val.includes('đã xử lý');
      }).length;
    }

    let trends = { total: 0, critical: 0, resolved: 0, risk: 0 };
    if (lineData.length >= 2) {
       const currentPeriod = lineData[lineData.length - 1].name;
       const previousPeriod = lineData[lineData.length - 2].name;
       const currentData = filtered.filter(r => String(r[dataKeys.timeKey] || 'Unknown') === currentPeriod);
       const previousData = filtered.filter(r => String(r[dataKeys.timeKey] || 'Unknown') === previousPeriod);
       
       const currTotal = currentData.length;
       const prevTotal = previousData.length;
       if (prevTotal > 0) trends.total = ((currTotal - prevTotal) / prevTotal) * 100;
       
       // ... We can skip deeper trend calculation for critical/resolved to save time, or do it simply:
       const currCrit = currentData.filter(r => (dataKeys.severityKey ? String(r[dataKeys.severityKey]).toLowerCase().includes('nc') : false)).length;
       const prevCrit = previousData.filter(r => (dataKeys.severityKey ? String(r[dataKeys.severityKey]).toLowerCase().includes('nc') : false)).length;
       if (prevCrit > 0) trends.critical = ((currCrit - prevCrit) / prevCrit) * 100;

       const currRes = currentData.filter(r => (dataKeys.statusKey ? String(r[dataKeys.statusKey]).toLowerCase().includes('đóng') || String(r[dataKeys.statusKey]).toLowerCase().includes('close') : false)).length;
       const prevRes = previousData.filter(r => (dataKeys.statusKey ? String(r[dataKeys.statusKey]).toLowerCase().includes('đóng') || String(r[dataKeys.statusKey]).toLowerCase().includes('close') : false)).length;
       if (prevRes > 0) trends.resolved = ((currRes - prevRes) / prevRes) * 100;
    }

`;

content = content.substring(0, startIndex) + newChartLogic + content.substring(endIndex);

// Also need to update the chartData state payload to include the new fields
const oldSetChartData = `    setChartData({
      barData: paretoData,
      lineData,
      timeDeptData,
      deptDataRaw,
      deptCategoryData,
      topDepts,
      severityPieData,
      totalRecords,
      criticalErrors,
      resolvedErrors,
      categoryKey: dataKeys.categoryKey,
      timeKey: dataKeys.timeKey,
      deptKey: dataKeys.deptKey || 'Phòng ban',
      statusKey: dataKeys.statusKey,
      filtered: filtered,
      trends
    });`;

const newSetChartData = `    setChartData({
      barData: paretoData,
      deptParetoData,
      lineData,
      causeSummaryData,
      sortedTimes,
      topCategoryDepts,
      totalRecords,
      criticalErrors,
      resolvedErrors,
      categoryKey: dataKeys.categoryKey,
      timeKey: dataKeys.timeKey,
      deptKey: dataKeys.deptKey || 'Phòng ban',
      statusKey: dataKeys.statusKey,
      filtered: filtered,
      trends
    });`;

content = content.replace(oldSetChartData, newSetChartData);

fs.writeFileSync('src/App.tsx', content);
