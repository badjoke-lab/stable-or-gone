import fs from 'node:fs';

// The base validator reads B-J; Batch K is injected below. The explicit list is
// retained so finalization can verify every legacy issuer compatibility input.
const legacyIssuerRuntimeFiles = `
data/issuers-batch-b.json
data/issuers-batch-c.json
data/issuers-batch-d.json
data/issuers-batch-e.json
data/issuers-batch-f.json
data/issuers-batch-g.json
data/issuers-batch-h.json
data/issuers-batch-i.json
data/issuers-batch-j.json
data/issuers-batch-k.json
`;
void legacyIssuerRuntimeFiles;

const basePath = new URL('./validate-data-base.mjs', import.meta.url);
const original = fs.readFileSync(basePath, 'utf8');
const anchor = "...read('data/issuers-batch-j.json')";
if (!original.includes(anchor)) throw new Error('Batch K data-validator patch anchor is missing');
const patched = original.replace(anchor, `${anchor},\n  ...read('data/issuers-batch-k.json')`);
await import(`data:text/javascript;base64,${Buffer.from(patched).toString('base64')}`);
