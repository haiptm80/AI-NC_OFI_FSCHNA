async function run() {
    const res = await fetch('https://docs.google.com/spreadsheets/d/1kTNK1W1gCd2ZO8EQC-n_FR_zlJ2lLZ-U5E3sm34CtAQ/gviz/tq?tqx=out:json&sheet=Data');
    let text = await res.text();
    text = text.substring(47).slice(0, -2);
    const json = JSON.parse(text);
    
    const rows = json.table.rows;
    const cols = json.table.cols;
    console.log("Cols length:", cols.length);
    cols.forEach((c, i) => console.log(i, c ? c.label : null));
    
    // Check some sample column values (e.g. column index 9, 8, 10, 11)
    console.log("Unique col 9 values:");
    const c9 = new Set(rows.map(r => r.c[9] ? r.c[9].v : null));
    console.log([...c9]);
    
    console.log("Unique col 8 values:");
    const c8 = new Set(rows.map(r => r.c[8] ? r.c[8].v : null));
    console.log([...c8]);

    console.log("Unique col 10 values:");
    const c10 = new Set(rows.map(r => r.c[10] ? r.c[10].v : null));
    console.log([...c10]);
}
run();
