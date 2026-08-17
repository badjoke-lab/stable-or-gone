import fs from 'node:fs';
import path from 'node:path';

const htmlPath = path.resolve('dist/stablecoins/index.html');
if (!fs.existsSync(htmlPath)) throw new Error(`Missing built Stablecoin register: ${htmlPath}`);
const html = fs.readFileSync(htmlPath, 'utf8');

const sourceAttribute = 'data-comparison-source';
const requiredKeys = [
  'depeg_recovery_state',
  'recovery_dates',
  'failure_mechanisms',
  'regulatory_history',
  'redemption_change_history',
  'migration_termination_history'
];

function comparisonSourceTags() {
  const tags = [];
  const pattern = /<div\b[^>]*>/g;
  for (const match of html.matchAll(pattern)) {
    const tag = match[0];
    if (!tag.includes(sourceAttribute)) continue;
    tags.push({ start: match.index, tag });
  }
  return tags;
}

const sources = comparisonSourceTags();

function sourceBlock(slug) {
  const slugMarker = `data-record-slug="${slug}"`;
  const index = sources.findIndex(({ tag }) => tag.includes(slugMarker));
  if (index < 0) throw new Error(`${slug}: comparison source missing`);
  const start = sources[index].start;
  const end = sources[index + 1]?.start ?? html.length;
  return html.slice(start, end);
}

function valueFor(slug, key) {
  const block = sourceBlock(slug);
  const pattern = new RegExp(`data-compare-value="${key}"[^>]*>([^<]*)<`);
  const match = block.match(pattern);
  if (!match) throw new Error(`${slug}: ${key} comparison value missing`);
  return match[1].replaceAll('&amp;', '&').replaceAll('&#39;', "'").replaceAll('&quot;', '"').trim();
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(sources.length >= 119, `Expected at least 119 comparison sources, found ${sources.length}`);

for (const slug of ['usdc', 'ust', 'busd', 'usdt', 'dai']) {
  for (const key of requiredKeys) valueFor(slug, key);
}

assert(valueFor('usdc', 'depeg_recovery_state').includes('Recovered'), 'USDC recovered depeg state missing from Compare');
assert(valueFor('usdc', 'recovery_dates').includes('2023-03-13'), 'USDC recovery date missing from Compare');
assert(valueFor('ust', 'depeg_recovery_state').includes('Collapsed'), 'UST collapsed depeg state missing from Compare');
assert(valueFor('ust', 'failure_mechanisms') !== 'Not recorded', 'UST failure mechanism missing from Compare');
assert(valueFor('busd', 'migration_termination_history') !== 'Not recorded', 'BUSD migration/termination history missing from Compare');
assert(valueFor('usdt', 'regulatory_history') !== 'Not recorded', 'USDT regulatory history missing from Compare');
assert(valueFor('dai', 'migration_termination_history') !== 'Not recorded', 'DAI migration history missing from Compare');

console.log('Stablecoin Compare lifecycle projection validation passed.');
