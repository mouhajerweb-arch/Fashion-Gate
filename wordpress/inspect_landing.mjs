const res = await fetch('http://localhost:8080/landing');
const html = await res.text();

console.log('HTML length:', html.length);
console.log('Contains LOOKS YOU REMEMBER:', html.includes('LOOKS YOU REMEMBER'));
console.log('Contains THIS SEASON:', html.includes('THIS SEASON'));
console.log('Contains 01 / CLOTHES:', html.includes('01 / CLOTHES'));
console.log('Contains 02 / SKIN CARE:', html.includes('02 / SKIN CARE'));
console.log('Contains 03 / PERFUME:', html.includes('03 / PERFUME'));
console.log('Contains DIOR:', html.includes('DIOR'));
console.log('Contains Fashion is not only what you wear:', html.includes('Fashion is not only what you wear'));
console.log('Contains DISCOVER FASHION GATE YOUR WAY:', html.includes('DISCOVER FASHION GATE YOUR WAY'));
console.log('Contains Premier Luxury Fashion Destination:', html.includes('Premier Luxury Fashion Destination'));
