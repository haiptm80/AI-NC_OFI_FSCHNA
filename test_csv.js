import Papa from 'papaparse';

async function run() {
    const sheetId = '1kTNK1W1gCd2ZO8EQC-n_FR_zlJ2lLZ-U5E3sm34CtAQ';
    const sheet = 'Data';
    const url = "https://docs.google.com/spreadsheets/d/" + sheetId + "/gviz/tq?tqx=out:csv&sheet=" + encodeURIComponent(sheet);
    const response = await fetch(url);
    const csvText = await response.text();
    
    Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            const data = results.data;
            if (data.length > 0) {
                const keys = Object.keys(data[0]);
                console.log("Keys from Papa Parse:");
                console.log(keys.map((k, i) => i + ": " + k));
                
                // Let's do exactly what App.tsx does:
                const statusKeyFromAppOld = keys.find(k => k.includes('Tình trạng') || k.includes('xử lý')) || keys[9];
                const statusKeyFromAppNew = keys[9] || keys.find(k => k.includes('Tình trạng') || k.includes('xử lý'));
                console.log("Old statusKey:", statusKeyFromAppOld);
                console.log("New statusKey:", statusKeyFromAppNew);
                
                const getResolvedCount = (statusKey) => {
                    return data.filter((r) => {
                        const val = String(r[statusKey] || '').toLowerCase();
                        const norm = val.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); 
                        return (norm.includes('dong') || norm.includes('hoan thanh') || norm.includes('closed') || norm.includes('xu ly') || norm.includes('ok')) && !norm.includes('chua') && !norm.includes('dang ');
                    }).length;
                };
                
                console.log("Resolved count with Old:", getResolvedCount(statusKeyFromAppOld));
                console.log("Resolved count with New:", getResolvedCount(statusKeyFromAppNew));
                
                const c9 = [...new Set(data.map(r => r[keys[9]]))];
                console.log("Unique in keys[9]:", c9);
            }
        }
    });
}
run();
