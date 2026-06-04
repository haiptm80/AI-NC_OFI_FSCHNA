import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  "useState<{ time: string; dept: string; category: string }>({ time: \"All\", dept: \"All\", category: \"All\" });",
  "useState<{ time: string; dept: string; category: string; severity: string }>({ time: \"All\", dept: \"All\", category: \"All\", severity: \"All\" });"
);

// We need to filter by severity
const originalFilterCode = 'if (filters.category !== "All") filtered = filtered.filter(r => String(r[dataKeys.categoryKey]) === filters.category);';
const newFilterCode = \`if (filters.category !== "All") filtered = filtered.filter(r => String(r[dataKeys.categoryKey]) === filters.category);
    if (filters.severity !== "All" && dataKeys.severityKey) filtered = filtered.filter(r => String(r[dataKeys.severityKey]).trim() === filters.severity);\`;
content = content.replace(originalFilterCode, newFilterCode);

// Update Pie Chart click handler
const originalPieClick = \`// Not filtering yet, but could add severityFilter later. Keep it clickable placeholder.
                                  console.log('Clicked', entry);\`;
const newPieClick = \`setFilters(prev => ({ ...prev, severity: entry.name || prev.severity }));\`;
content = content.replace(originalPieClick, newPieClick);

// Add clear filters button
const originalFilterDivEnd = \`{filterOptions.categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                )}\`;
const newFilterDivEnd = \`{filterOptions.categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                )}
                
                {(filters.time !== "All" || filters.dept !== "All" || filters.category !== "All" || filters.severity !== "All") && (
                   <button 
                     onClick={() => setFilters({ time: "All", dept: "All", category: "All", severity: "All" })}
                     className="text-xs font-bold text-rose-500 hover:bg-rose-50 px-2 py-1.5 rounded-sm transition-colors uppercase tracking-widest ml-auto"
                   >
                     Xóa bộ lọc
                   </button>
                )}\`;
content = content.replace(originalFilterDivEnd, newFilterDivEnd);

fs.writeFileSync('src/App.tsx', content);
