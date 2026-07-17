import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const containmentPath = path.join(root, 'src/styles/secondary-longform-pr419-containment.css');
const mobilePath = path.join(root, 'src/styles/mobile-accessibility-v3.css');
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

check(fs.existsSync(containmentPath), 'long-form containment stylesheet missing');
check(fs.existsSync(mobilePath), 'mobile accessibility stylesheet missing');
if (failures.length === 0) {
  const containment = fs.readFileSync(containmentPath, 'utf8');
  const mobile = fs.readFileSync(mobilePath, 'utf8');
  check(mobile.includes('@import "./secondary-longform-pr419-containment.css";'), 'long-form containment stylesheet is not globally loaded');
  for (const marker of [
    '.site-main[data-page-kind="guide-article"] .guide-article-content > section',
    '.site-main[data-page-kind="longform"] .longform-content > section',
    'overflow-x: auto',
    'overscroll-behavior-inline: contain',
    'width: max(100%, 680px)',
    '@media (max-width: 719px)'
  ]) check(containment.includes(marker), `containment marker missing: ${marker}`);
  check(!containment.includes('linear-gradient(') && !containment.includes('radial-gradient('), 'containment stylesheet introduces decorative gradients');
}

if (failures.length) {
  console.error(JSON.stringify({ ok:false, implementation_pr:419, failures }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ ok:true, implementation_pr:419, longform_overflow_containment:true }, null, 2));
