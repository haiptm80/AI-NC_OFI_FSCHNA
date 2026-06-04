const val = 'Đã hoàn thành';
const norm = val.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
console.log(norm);
console.log(norm.includes('hoan thanh'));
// Are there any invisible characters?
console.log(Array.from(norm).map(c => c.charCodeAt(0).toString(16)));
