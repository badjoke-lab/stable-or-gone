import fs from 'node:fs';
import './validate-batch21-growth-d.mjs';
const text = fs.readFileSync('docs/roadmap.md', 'utf8');
if (!text.includes('Stable assets: 100')) process.exit(1);
if (!text.includes('Active: PR #252')) process.exit(1);
console.log('Workstream check passed.');
