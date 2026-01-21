const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const walk = (dir) => {
  const res = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      if (name === 'node_modules' || name === '.git') continue;
      res.push(...walk(p));
    } else {
      if (p.endsWith('.ts') || p.endsWith('.tsx') || p.endsWith('.js') || p.endsWith('.jsx') || p.endsWith('.json') || p.endsWith('.html')) {
        res.push(p);
      }
    }
  }
  return res;
};

const files = walk(path.join(root, 'src'));
let bad = [];
for (const f of files) {
  const buf = fs.readFileSync(f);
  const s = buf.toString('utf8');
  if (s.indexOf('\uFFFD') !== -1) {
    bad.push(f);
  }
}
if (bad.length) {
  console.log('Files with invalid UTF-8 sequences (contain U+FFFD):');
  bad.forEach((f) => console.log(' -', path.relative(root, f)));
  process.exitCode = 2;
} else {
  console.log('All files under src appear to be valid UTF-8.');
}
