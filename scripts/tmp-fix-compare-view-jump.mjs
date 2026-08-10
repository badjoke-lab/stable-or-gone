import fs from 'node:fs';
const file = 'src/scripts/stablecoin-index.ts';
let source = fs.readFileSync(file, 'utf8');
const before = "    comparePanel.scrollIntoView({ block: 'start', behavior: 'smooth' });\n    window.setTimeout(() => comparePanel.focus({ preventScroll: true }), 250);\n";
const after = "    comparePanel.scrollIntoView({ block: 'start', behavior: 'auto' });\n    comparePanel.focus({ preventScroll: true });\n";
if (!source.includes(before)) throw new Error('Expected View comparison block not found');
source = source.replace(before, after);
fs.writeFileSync(file, source);
