import fs from 'node:fs';

const basePath = new URL('./validate-data-base.mjs', import.meta.url);
const original = fs.readFileSync(basePath, 'utf8');
const anchor = "...read('data/issuers-batch-j.json')";
if (!original.includes(anchor)) throw new Error('Batch K data-validator patch anchor is missing');
const patched = original.replace(anchor, `${anchor},\n  ...read('data/issuers-batch-k.json')`);
await import(`data:text/javascript;base64,${Buffer.from(patched).toString('base64')}`);
