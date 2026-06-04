import Papa from 'papaparse';
const sheetId = '1kTNK1W1gCd2ZO8EQC-n_FR_zlJ2lLZ-U5E3sm34CtAQ';
const sheet = 'Data';
const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheet)}`;
fetch(url).then(r => r.text()).then(t => {
  Papa.parse(t, {
    header: true,
    complete: (results) => {
      const keys = Object.keys(results.data[0]);
      keys.forEach((k, i) => console.log(`${String.fromCharCode(65 + i)} (${i}): ${k}`));
    }
  });
});
