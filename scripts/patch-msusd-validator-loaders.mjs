import fs from 'node:fs';

const file = 'scripts/validate-data.mjs';
let text = fs.readFileSync(file, 'utf8');

if (!text.includes("data/issuers-batch-n.json")) {
  text = text.replace(
    'data/issuers-batch-l.json\n`;',
    'data/issuers-batch-l.json\ndata/issuers-batch-m.json\ndata/issuers-batch-n.json\n`;'
  );
}

const oldPatch = "...read('data/issuers-batch-k.json'),\\n  ...read('data/issuers-batch-l.json'),\\n  ...read('data/issuers-batch-m.json')";
const newPatch = "...read('data/issuers-batch-k.json'),\\n  ...read('data/issuers-batch-l.json'),\\n  ...read('data/issuers-batch-m.json'),\\n  ...read('data/issuers-batch-n.json')";
if (!text.includes(newPatch)) {
  if (!text.includes(oldPatch)) throw new Error('validate-data Batch M patch anchor missing');
  text = text.replace(oldPatch, newPatch);
}

fs.writeFileSync(file, text);
console.log('Batch N validator loaders synchronized');
