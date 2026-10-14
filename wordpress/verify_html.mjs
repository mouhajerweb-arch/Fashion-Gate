const res = await fetch('http://localhost:8080/landing');
const html = await res.text();

const sections = [
  'fg-header-bar',
  'fg-hero',
  'this-season',
  'clothes',
  'skincare',
  'perfume',
  'brands',
  'quote',
  'register',
  'fg-light-footer'
];

console.log('--- Landing Page HTML Section Verification ---');
sections.forEach(s => {
  console.log(`${s}: ${html.includes(s) ? 'FOUND' : 'MISSING'}`);
});
console.log('--- End Verification ---');
