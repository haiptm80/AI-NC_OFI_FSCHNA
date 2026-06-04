import Papa from 'papaparse';
const sheetId = '1kTNK1W1gCd2ZO8EQC-n_FR_zlJ2lLZ-U5E3sm34CtAQ';
const sheet = 'Data';
const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheet)}`;
fetch(url).then(r => r.text()).then(t => {
  Papa.parse(t, {
    header: true,
    complete: (results) => {
      const statuses = [...new Set(results.data.map(r => r['Tình trạng đã xử lý']))];
      console.log('Statuses:', statuses.slice(0, 5));
      const errors = [...new Set(results.data.map(r => r['Hình thức đánh giá']))];
      console.log('Hinh thuc dap gia:', errors.slice(0, 5));
      const times = [...new Set(results.data.map(r => r['Năm học']))];
      console.log('Ky:', times.slice(0, 5));
    }
  });
});
