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
                const cleanedData = data.map(row => {
                    const newRow = { ...row };
                    if (newRow['TT']) delete newRow['TT'];
                    if (newRow['tt']) delete newRow['tt'];
                    return newRow;
                });
                const keys = Object.keys(cleanedData[0] || []);
                console.log("keys[9] is:", keys[9]);
            }
        }
    });
}
run();
