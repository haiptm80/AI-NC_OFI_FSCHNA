import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldTrendLogic = `    // 3. Line Data (Time - Năm học)
    const lineCounts = filtered.reduce((acc: any, row: any) => {
      const val = String(row[dataKeys.timeKey] || 'Unknown');
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});
    const lineData = Object.entries(lineCounts)
      .map(([name, value]) => ({ name, value: Number(value) }))
      .sort((a, b) => a.name.localeCompare(b.name));`;

const newTrendLogic = `    // 3. Line Data (Time and Category Breakdown)
    const allCategoriesInFiltered = Array.from(new Set(filtered.map(r => String(r[dataKeys.categoryKey] || 'Unknown'))));
    const timeCategoryCounts = filtered.reduce((acc: any, row: any) => {
      const time = String(row[dataKeys.timeKey] || 'Unknown');
      const category = String(row[dataKeys.categoryKey] || 'Unknown');
      if (!acc[time]) {
         acc[time] = { name: time, total: 0 };
         allCategoriesInFiltered.forEach(c => acc[time][c] = 0);
      }
      acc[time][category] += 1;
      acc[time].total += 1;
      return acc;
    }, {});
    const lineData = Object.values(timeCategoryCounts).sort((a: any, b: any) => a.name.localeCompare(b.name));

    // Department x Category Breakdown (For Dept Stacked Chart)
    const deptCategoryCounts = filtered.reduce((acc: any, row: any) => {
      const dept = String(row[dataKeys.deptKey] || 'Unknown');
      const category = String(row[dataKeys.categoryKey] || 'Unknown');
      if (!acc[dept]) {
         acc[dept] = { name: dept, total: 0 };
         allCategoriesInFiltered.forEach(c => acc[dept][c] = 0);
      }
      acc[dept][category] += 1;
      acc[dept].total += 1;
      return acc;
    }, {});
    const deptCategoryData = Object.values(deptCategoryCounts).sort((a: any, b: any) => b.total - a.total);
`;

content = content.replace(oldTrendLogic, newTrendLogic);

const oldSetChartData = `      lineData,
      causeSummaryData,`;

const newSetChartData = `      lineData,
      allCategoriesInFiltered,
      deptCategoryData,
      causeSummaryData,`;

content = content.replace(oldSetChartData, newSetChartData);

fs.writeFileSync('src/App.tsx', content);
