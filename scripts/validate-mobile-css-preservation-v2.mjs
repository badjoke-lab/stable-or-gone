import fs from 'node:fs';

const css = fs.readFileSync('src/styles/global.css', 'utf8');
const failures = [];
if (css.includes('th:nth-child(')) failures.push('Generic th:nth-child selectors are prohibited');
if (css.includes('td:nth-child(')) failures.push('Generic td:nth-child selectors are prohibited');
for (const match of css.matchAll(/([^{}]+)\{([^{}]+)\}/g)) {
  const selector = match[1];
  const body = match[2];
  if (/\b(table|th|td)\b/.test(selector) && /display\s*:\s*none/.test(body)) {
    failures.push(`Table information must not be hidden: ${selector.trim()}`);
  }
}
if (!css.includes('table[data-mobile-table="scroll-preserve"]')) failures.push('Mobile table selector is missing');
if (!css.includes('overflow-x: auto')) failures.push('Horizontal access for wide tables is missing');
if (!css.includes('overscroll-behavior-inline: contain')) failures.push('Mobile overscroll containment is missing');
if (failures.length) throw new Error(failures.join('\n'));
console.log(JSON.stringify({ ok: true, prohibited_generic_column_hiding: false, strategy: 'scroll-preserve' }, null, 2));
