import fs from 'node:fs';
const file = 'src/scripts/stablecoin-index.ts';
let source = fs.readFileSync(file, 'utf8');
const before = "    comparePanel.scrollIntoView({ block: 'start', behavior: 'auto' });\n    comparePanel.focus({ preventScroll: true });\n";
const after = "    const targetTop = comparePanel.getBoundingClientRect().top + window.scrollY;\n    document.documentElement.scrollTop = targetTop;\n    document.body.scrollTop = targetTop;\n    comparePanel.focus({ preventScroll: true });\n";
if (!source.includes(before)) throw new Error('Expected direct Compare jump block not found');
source = source.replace(before, after);
fs.writeFileSync(file, source);
