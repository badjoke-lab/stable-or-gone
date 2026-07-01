import fs from 'node:fs';
import path from 'node:path';
import './validate-ui-v3-stablecoin-index.mjs';

const root = process.cwd();
const sourcePath = path.join(root, 'data/generated/ui-v3-stablecoin-index-validation.json');
const outputPath = path.join(root, 'data/generated/stablecoin-index-implementation-validation.json');
const result = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
