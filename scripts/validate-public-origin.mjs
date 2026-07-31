import fs from 'node:fs';
import path from 'node:path';
import { PUBLIC_HOSTNAME, PUBLIC_ORIGIN } from '../config/public-origin.mjs';

const root = process.cwd();
const expectedOrigin = 'https://www.stableorgone.com';
const expectedHostname = 'www.stableorgone.com';
const legacyHostname = ['sog', 'badjoke-lab', 'com'].join('.');
const legacyEscapedHostname = legacyHostname.replaceAll('.', '\\.');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const walk = (relativePath) => {
  const target = path.join(root, relativePath);
  if (!fs.existsSync(target)) return [];
  const stat = fs.statSync(target);
  if (stat.isFile()) return [relativePath];
  return fs.readdirSync(target, { withFileTypes: true }).flatMap((entry) => {
    const child = path.posix.join(relativePath, entry.name);
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') return [];
    return entry.isDirectory() ? walk(child) : [child];
  });
};
const countOccurrences = (content, value) => content.split(value).length - 1;

assert(PUBLIC_ORIGIN === expectedOrigin, `PUBLIC_ORIGIN must be ${expectedOrigin}`);
assert(PUBLIC_HOSTNAME === expectedHostname, `PUBLIC_HOSTNAME must be ${expectedHostname}`);

const requiredSnippets = {
  'astro.config.mjs': ["import { PUBLIC_ORIGIN } from './config/public-origin.mjs';", 'site: PUBLIC_ORIGIN'],
  'src/layouts/BaseLayout.astro': ["import { PUBLIC_ORIGIN } from '../../config/public-origin.mjs';", 'const siteUrl = PUBLIC_ORIGIN;'],
  'src/lib/machine-readable.ts': ["import { PUBLIC_ORIGIN } from '../../config/public-origin.mjs';", 'canonicalOrigin: PUBLIC_ORIGIN,'],
  'src/pages/sitemap-index.xml.ts': ["import { PUBLIC_ORIGIN } from '../../config/public-origin.mjs';", 'const SITE = PUBLIC_ORIGIN;'],
  'scripts/check-production.mjs': ["import { PUBLIC_ORIGIN } from '../config/public-origin.mjs';", 'const DEFAULT_BASE_URL = PUBLIC_ORIGIN;'],
  'scripts/check-production-provenance.mjs': ["import { PUBLIC_ORIGIN } from '../config/public-origin.mjs';", 'process.env.SOG_BASE_URL || PUBLIC_ORIGIN'],
  'scripts/check-production-output-parity.mjs': ["import { PUBLIC_ORIGIN } from '../config/public-origin.mjs';", 'process.env.SOG_BASE_URL || PUBLIC_ORIGIN'],
  'public/robots.txt': [`Sitemap: ${expectedOrigin}/sitemap-index.xml`],
  'README.md': [`Public site: ${expectedOrigin}/`],
  '.github/workflows/deploy-production.yml': [`SOG_BASE_URL: ${expectedOrigin}`]
};

for (const [file, snippets] of Object.entries(requiredSnippets)) {
  const content = read(file);
  for (const snippet of snippets) assert(content.includes(snippet), `${file}: missing ${snippet}`);
}

const legacyRedirectDocumentation = new Set([
  'README.md',
  'docs/deployment-policy.md'
]);

const activeFiles = [
  'astro.config.mjs',
  ...walk('src'),
  ...walk('public'),
  ...walk('scripts'),
  ...walk('.github/workflows'),
  'README.md',
  'docs/deployment-policy.md'
].filter((file, index, files) => files.indexOf(file) === index)
  .filter((file) => file !== 'scripts/validate-public-origin.mjs');

let approvedLegacyDocumentationFindings = 0;
for (const file of activeFiles) {
  const target = path.join(root, file);
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) continue;
  const content = read(file);
  const literalCount = countOccurrences(content, legacyHostname);
  const escapedCount = countOccurrences(content, legacyEscapedHostname);

  if (legacyRedirectDocumentation.has(file)) {
    assert(content.includes(expectedOrigin), `${file}: official origin missing from legacy redirect documentation`);
    assert(/legacy/i.test(content), `${file}: legacy redirect documentation must identify the old host as legacy`);
    assert(/301/.test(content), `${file}: legacy redirect documentation must state the permanent redirect boundary`);
    assert(!content.includes(`Public site: https://${legacyHostname}`), `${file}: legacy hostname used as public site`);
    assert(!content.includes(`Official public origin: https://${legacyHostname}`), `${file}: legacy hostname used as official origin`);
    assert(escapedCount === 0, `${file}: escaped legacy hostname remains`);
    approvedLegacyDocumentationFindings += literalCount;
    continue;
  }

  assert(literalCount === 0, `${file}: legacy hostname remains`);
  assert(escapedCount === 0, `${file}: escaped legacy hostname remains`);
}

if (failures.length) {
  console.error(JSON.stringify({ ok: false, failures }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  public_origin: PUBLIC_ORIGIN,
  public_hostname: PUBLIC_HOSTNAME,
  legacy_hostname_findings: 0,
  escaped_legacy_hostname_findings: 0,
  approved_legacy_redirect_documentation_findings: approvedLegacyDocumentationFindings,
  active_files_checked: activeFiles.length
}, null, 2));
