import fs from 'node:fs';
const base = new URL('./validate-registry-v2-compat.mjs', import.meta.url);
const source = fs.readFileSync(base, 'utf8');
const anchor = "'data/issuers-batch-k.json'";
if (!source.includes(anchor)) throw new Error('Batch L compatibility patch anchor is missing');
const patched = source.replace(anchor, `${anchor},'data/issuers-batch-l.json'`);
await import(`data:text/javascript;base64,${Buffer.from(patched).toString('base64')}`);
