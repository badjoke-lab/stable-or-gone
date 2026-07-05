import fs from 'node:fs';

const from = new URL('./verify-public-layer.mjs', import.meta.url);
const to = new URL('./tmp-verify-public-layer-diagnostic.mjs', import.meta.url);
let source = fs.readFileSync(from, 'utf8');
const anchor = "assert(isDeepStrictEqual(version.data?.record_count_breakdown, expectedBreakdown), 'version breakdown does not match canonical data');";
if (!source.includes(anchor)) throw new Error('Public-layer breakdown assertion anchor missing');
const replacement = `if (!isDeepStrictEqual(version.data?.record_count_breakdown, expectedBreakdown)) {
  const actualBreakdown = version.data?.record_count_breakdown ?? {};
  const keys = [...new Set([...Object.keys(expectedBreakdown), ...Object.keys(actualBreakdown)])].sort();
  const differences = keys
    .filter((key) => !isDeepStrictEqual(expectedBreakdown[key], actualBreakdown[key]))
    .map((key) => ({ key, expected: expectedBreakdown[key], actual: actualBreakdown[key] }));
  const diagnostic = { breakdown_differences: differences };
  fs.mkdirSync('artifacts', { recursive: true });
  fs.writeFileSync('artifacts/public-layer-breakdown-diff.json', JSON.stringify(diagnostic, null, 2) + '\\n');
  console.error(JSON.stringify(diagnostic, null, 2));
  throw new Error('version breakdown does not match canonical data');
}`;
source = source.replace(anchor, replacement);
fs.writeFileSync(to, source);
try {
  await import(to.href);
} finally {
  fs.rmSync(to, { force: true });
}
