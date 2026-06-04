import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// We are going to replace everything inside:
// {viewMode === 'dashboard' && ( ... )} blocks with our new Tabbed view!
// BUT we have multiple {viewMode === 'dashboard' && ( ... )} blocks throughout the JSX.

// Actually, let's just insert the Tabs navigation Right before the 'Main Content Sections' part.

const insertTabsBefore = `{/* Main Content Sections */}`;
const addTabsCode = `            {/* Dashboard Tabs for Video Scenes */}
            {viewMode === 'dashboard' && (
              <div className="flex px-1 mb-2 mt-4 space-x-1 bg-slate-100 p-1 rounded-sm overflow-x-auto custom-scrollbar">
                {[
                  { id: 1, name: "1. TOÀN CẢNH SỨC KHỎE HỆ THỐNG" },
                  { id: 2, name: "2. ĐIỂM NÓNG PHÒNG BAN" },
                  { id: 3, name: "3. PHÂN TÍCH SÂU NHÓM LỖI" },
                  { id: 4, name: "4. ĐIỂM NỔI BẬT & HÀNH ĐỘNG" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveDashboardTab(tab.id)}
                    className={\`flex-1 py-2.5 px-4 text-xs font-bold uppercase tracking-wider rounded-sm transition-all whitespace-nowrap \${
                      activeDashboardTab === tab.id
                        ? 'bg-[#1f497d] text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }\`}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>
            )}

            `;
content = content.replace(insertTabsBefore, addTabsCode + insertTabsBefore);

fs.writeFileSync('src/App.tsx', content);
