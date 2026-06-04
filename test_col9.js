async function run() {
    const res = await fetch('https://docs.google.com/spreadsheets/d/1kTNK1W1gCd2ZO8EQC-n_FR_zlJ2lLZ-U5E3sm34CtAQ/gviz/tq?tqx=out:json&sheet=Data');
    let text = await res.text();
    text = text.substring(47).slice(0, -2);
    const json = JSON.parse(text);
    
    const rows = json.table.rows;
    const vals = rows.map(r => r.c[9] ? r.c[9].v : null);
    
    const count = {};
    for (const v of vals) {
       count[v] = (count[v] || 0) + 1;
    }
    console.log("Column 9 distribution:", count);
}
run();
