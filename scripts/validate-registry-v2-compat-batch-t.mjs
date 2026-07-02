import fs from 'node:fs';

const sourceUrl = new URL('./validate-registry-v2-compat.mjs', import.meta.url);
const temporaryUrl = new URL('./tmp-validate-registry-v2-compat-batch-t.mjs', import.meta.url);
let source = fs.readFileSync(sourceUrl, 'utf8');
const anchor = "'data/issuers-batch-r.json'";
if (!source.includes(anchor)) throw new Error('Registry v2 compatibility issuer-list anchor is missing');
source = source.replace(anchor, `${anchor},'data/issuers-batch-t.json'`);
fs.writeFileSync(temporaryUrl, source);
try {
  await import(temporaryUrl.href);
} finally {
  fs.rmSync(temporaryUrl, { force: true });
}
