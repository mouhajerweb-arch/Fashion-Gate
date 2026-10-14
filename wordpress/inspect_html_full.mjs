const res = await fetch('http://localhost:8080/landing');
const html = await res.text();

console.log('--- Page Head Title ---');
const matchTitle = html.match(/<title>(.*?)<\/title>/i);
console.log(matchTitle ? matchTitle[1] : 'No title tag');

console.log('--- Body Tag & Classes ---');
const matchBody = html.match(/<body[^>]*>/i);
console.log(matchBody ? matchBody[0] : 'No body tag');

console.log('--- Sample Headings in HTML ---');
const headings = html.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi);
console.log(headings ? headings.slice(0, 10) : 'No headings found');
