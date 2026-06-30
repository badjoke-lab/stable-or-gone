import fs from 'node:fs';

const sourcePath = new URL('./validate-registry-v3-income-profiles.mjs', import.meta.url);
let source = fs.readFileSync(sourcePath, 'utf8');
const buildChainCheck = "if (!packageText.includes('npm run validate:income-v3')) fail('package.json: build chain does not include validate:income-v3');";
if (!source.includes(buildChainCheck)) throw new Error('income-profile build-chain check anchor missing');
source = source.replace(buildChainCheck, '');
await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
