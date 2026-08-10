import fs from 'node:fs';
const file = 'src/styles/public-ui.css';
let css = fs.readFileSync(file, 'utf8');
const before = '\n\n/* Stablecoin comparison discovery navigation remediation */\n.comparison-dock';
const after = '\n/* Stablecoin comparison discovery navigation remediation */.comparison-dock';
if (!css.includes(before)) throw new Error('Expected Compare dock CSS block boundary not found');
css = css.replace(before, after);
fs.writeFileSync(file, css);
