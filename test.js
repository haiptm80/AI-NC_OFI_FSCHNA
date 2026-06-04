import https from 'https';

['Summary'].forEach(sheet => {
  https.get(`https://docs.google.com/spreadsheets/d/1kTNK1W1gCd2ZO8EQC-n_FR_zlJ2lLZ-U5E3sm34CtAQ/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheet)}`, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log(`\n\n--- ${sheet} ---`);
      console.log(data.slice(0, 1000));
    });
  });
});
