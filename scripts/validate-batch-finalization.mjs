import fs from 'node:fs';

const basePath = new URL('./validate-batch-finalization-base.mjs', import.meta.url);
const original = fs.readFileSync(basePath, 'utf8');
const anchor = "'data/candidate-promotions-batch-j.json'";
if (!original.includes(anchor)) throw new Error('Batch L finalization patch anchor is missing');
const patched = original.replace(
  anchor,
  `${anchor}, 'data/candidate-promotions-batch-k.json', 'data/candidate-promotions-batch-l.json'`
);
await import(`data:text/javascript;base64,${Buffer.from(patched).toString('base64')}`);
