const fs = require('fs');
const p = 'c:\\Users\\david\\Personal work\\2025\\ZettaCars\\zettaCars\\messages\\ro.json';
const s = fs.readFileSync(p, 'utf8');
let depth = 0;
let inStr = false;
let esc = false;
for (let i = 0; i < s.length; i++) {
  const c = s[i];
  if (inStr) {
    if (esc) esc = false;
    else if (c === '\\') esc = true;
    else if (c === '"') inStr = false;
    continue;
  }
  if (c === '"') { inStr = true; continue; }
  if (c === '{') depth++;
  else if (c === '}') {
    depth--;
    if (depth === 0) {
      console.log('root closed at', i);
      console.log('context:', s.slice(Math.max(0, i - 100), Math.min(s.length, i + 100)));
      process.exit(0);
    }
  }
}
console.log('did not reach depth 0');
process.exit(1);
