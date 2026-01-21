const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
  const buf = fs.readFileSync(filePath);
  const asUtf8 = buf.toString('utf8');
  if (asUtf8.indexOf('\uFFFD') === -1) {
    console.log(filePath, 'already valid UTF-8');
    return;
  }
  console.log('Fixing', filePath);
  // Interpret bytes as latin1 (one-to-one) and write as utf8
  const latin1 = buf.toString('latin1');
  fs.writeFileSync(filePath, Buffer.from(latin1, 'utf8'));
  const recheck = fs.readFileSync(filePath).toString('utf8');
  if (recheck.indexOf('\uFFFD') !== -1) {
    console.warn('Still contains replacement char after Latin1->UTF8 conversion:', filePath);
  } else {
    console.log('Fixed', filePath);
  }
}

const target = process.argv[2];
if (!target) {
  console.error('Usage: node scripts/fix-encoding.cjs <file>');
  process.exit(1);
}
fixFile(path.resolve(process.cwd(), target));
