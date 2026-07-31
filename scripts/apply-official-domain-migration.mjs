import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const OLD_ORIGIN = 'https://sog.badjoke-lab.com';
const NEW_ORIGIN = 'https://www.stableorgone.com';
const OLD_HOST = 'sog.badjoke-lab.com';
const NEW_HOST = 'www.stableorgone.com';
const OLD_ESCAPED_HOST = 'sog\\.badjoke-lab\\.com';
const NEW_ESCAPED_HOST = 'www\\.stableorgone\\.com';

function absolute(relativePath) {
  return path.join(root, relativePath);
}

function read(relativePath) {
  return fs.readFileSync(absolute(relativePath), 'utf8');
}

function write(relativePath, content) {
  fs.writeFileSync(absolute(relativePath), content);
}

function replaceRequired(content, search, replacement, label) {
  if (!content.includes(search)) throw new Error(`${label}: expected text not found`);
  return content.replace(search, replacement);
}

function addImport(content, anchor, importLine, label) {
  if (content.includes(importLine)) return content;
  return replaceRequired(content, anchor, `${anchor}${importLine}\n`, label);
}

function walk(relativePath) {
  const target = absolute(relativePath);
  if (!fs.existsSync(target)) return [];
  const stat = fs.statSync(target);
  if (stat.isFile()) return [relativePath];
  return fs.readdirSync(target, { withFileTypes: true }).flatMap((entry) => {
    const child = path.posix.join(relativePath, entry.name);
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') return [];
    return entry.isDirectory() ? walk(child) : [child];
  });
}

const activeFiles = [
  'astro.config.mjs',
  ...walk('src'),
  ...walk('public'),
  ...walk('scripts'),
  ...walk('.github/workflows'),
  'README.md',
  'docs/deployment-policy.md'
].filter((file, index, files) => files.indexOf(file) === index)
  .filter((file) => file !== 'scripts/apply-official-domain-migration.mjs')
  .filter((file) => file !== '.github/workflows/apply-official-domain-migration.yml');

for (const file of activeFiles) {
  const target = absolute(file);
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) continue;
  let content = read(file);
  const updated = content
    .split(OLD_ORIGIN).join(NEW_ORIGIN)
    .split(OLD_ESCAPED_HOST).join(NEW_ESCAPED_HOST)
    .split(OLD_HOST).join(NEW_HOST);
  if (updated !== content) write(file, updated);
}

let baseLayout = read('src/layouts/BaseLayout.astro');
baseLayout = addImport(
  baseLayout,
  "import BrandLockup from '../components/BrandLockup.astro';\n",
  "import { PUBLIC_ORIGIN } from '../../config/public-origin.mjs';",
  'BaseLayout origin import'
);
baseLayout = replaceRequired(
  baseLayout,
  `const siteUrl = '${NEW_ORIGIN}';`,
  'const siteUrl = PUBLIC_ORIGIN;',
  'BaseLayout origin value'
);
write('src/layouts/BaseLayout.astro', baseLayout);

let machineReadable = read('src/lib/machine-readable.ts');
machineReadable = addImport(
  machineReadable,
  "import buildProvenanceData from '../../data/generated/build-provenance.json';\n",
  "import { PUBLIC_ORIGIN } from '../../config/public-origin.mjs';",
  'machine-readable origin import'
);
machineReadable = replaceRequired(
  machineReadable,
  `canonicalOrigin: '${NEW_ORIGIN}',`,
  'canonicalOrigin: PUBLIC_ORIGIN,',
  'machine-readable canonical origin'
);
write('src/lib/machine-readable.ts', machineReadable);

let sitemap = read('src/pages/sitemap-index.xml.ts');
sitemap = addImport(
  sitemap,
  "import type { APIRoute } from 'astro';\n",
  "import { PUBLIC_ORIGIN } from '../../config/public-origin.mjs';",
  'sitemap origin import'
);
sitemap = replaceRequired(
  sitemap,
  `const SITE = '${NEW_ORIGIN}';`,
  'const SITE = PUBLIC_ORIGIN;',
  'sitemap origin value'
);
write('src/pages/sitemap-index.xml.ts', sitemap);

let productionCheck = read('scripts/check-production.mjs');
productionCheck = addImport(
  productionCheck,
  '',
  "import { PUBLIC_ORIGIN } from '../config/public-origin.mjs';",
  'production check origin import'
);
productionCheck = replaceRequired(
  productionCheck,
  `const DEFAULT_BASE_URL = '${NEW_ORIGIN}';`,
  'const DEFAULT_BASE_URL = PUBLIC_ORIGIN;',
  'production check default origin'
);
productionCheck = replaceRequired(
  productionCheck,
  `assert(version.canonical_origin === '${NEW_ORIGIN}', 'version origin mismatch');`,
  "assert(version.canonical_origin === PUBLIC_ORIGIN, 'version origin mismatch');",
  'production check canonical origin assertion'
);
productionCheck = replaceRequired(
  productionCheck,
  `  const sitemapStablecoins = new Set([...sitemap.matchAll(/<loc>https:\\/\\/www\\.stableorgone\\.com\\/stablecoin\\/([^<]+)\\/<\\/loc>/g)].map((match) => match[1]));\n  const sitemapOrganizations = new Set([...sitemap.matchAll(/<loc>https:\\/\\/www\\.stableorgone\\.com\\/issuer\\/([^<]+)\\/<\\/loc>/g)].map((match) => match[1]));\n  const sitemapEvents = new Set([...sitemap.matchAll(/<loc>https:\\/\\/www\\.stableorgone\\.com\\/event\\/([^<]+)\\/<\\/loc>/g)].map((match) => match[1]));`,
  `  const escapedBaseUrl = baseUrl.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');\n  const sitemapStablecoins = new Set([...sitemap.matchAll(new RegExp(\`<loc>\${escapedBaseUrl}/stablecoin/([^<]+)/</loc>\`, 'g'))].map((match) => match[1]));\n  const sitemapOrganizations = new Set([...sitemap.matchAll(new RegExp(\`<loc>\${escapedBaseUrl}/issuer/([^<]+)/</loc>\`, 'g'))].map((match) => match[1]));\n  const sitemapEvents = new Set([...sitemap.matchAll(new RegExp(\`<loc>\${escapedBaseUrl}/event/([^<]+)/</loc>\`, 'g'))].map((match) => match[1]));`,
  'production check sitemap origin matching'
);
write('scripts/check-production.mjs', productionCheck);

let provenanceCheck = read('scripts/check-production-provenance.mjs');
provenanceCheck = addImport(
  provenanceCheck,
  "import { isDeepStrictEqual } from 'node:util';\n",
  "import { PUBLIC_ORIGIN } from '../config/public-origin.mjs';",
  'provenance check origin import'
);
provenanceCheck = replaceRequired(
  provenanceCheck,
  `const baseUrl = (process.env.SOG_BASE_URL || '${NEW_ORIGIN}').replace(/\\\/$/, '');`,
  "const baseUrl = (process.env.SOG_BASE_URL || PUBLIC_ORIGIN).replace(/\\\/$/, '');",
  'provenance check default origin'
);
write('scripts/check-production-provenance.mjs', provenanceCheck);

let parityCheck = read('scripts/check-production-output-parity.mjs');
parityCheck = addImport(
  parityCheck,
  "import { isDeepStrictEqual } from 'node:util';\n",
  "import { PUBLIC_ORIGIN } from '../config/public-origin.mjs';",
  'parity check origin import'
);
parityCheck = replaceRequired(
  parityCheck,
  `const origin = (process.env.SOG_BASE_URL || '${NEW_ORIGIN}').replace(/\\\/$/, '');`,
  "const origin = (process.env.SOG_BASE_URL || PUBLIC_ORIGIN).replace(/\\\/$/, '');",
  'parity check default origin'
);
parityCheck = replaceRequired(
  parityCheck,
  `const sitemapSets = {\n  stablecoins: new Set([...sitemap.matchAll(/<loc>https:\\/\\/www\\.stableorgone\\.com(\\/stablecoin\\/[^<]+\\/)<\\/loc>/g)].map((match) => match[1])),\n  organizations: new Set([...sitemap.matchAll(/<loc>https:\\/\\/www\\.stableorgone\\.com(\\/issuer\\/[^<]+\\/)<\\/loc>/g)].map((match) => match[1])),\n  events: new Set([...sitemap.matchAll(/<loc>https:\\/\\/www\\.stableorgone\\.com(\\/event\\/[^<]+\\/)<\\/loc>/g)].map((match) => match[1]))\n};`,
  `const escapedOrigin = origin.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');\nconst sitemapSets = {\n  stablecoins: new Set([...sitemap.matchAll(new RegExp(\`<loc>\${escapedOrigin}(/stablecoin/[^<]+/)</loc>\`, 'g'))].map((match) => match[1])),\n  organizations: new Set([...sitemap.matchAll(new RegExp(\`<loc>\${escapedOrigin}(/issuer/[^<]+/)</loc>\`, 'g'))].map((match) => match[1])),\n  events: new Set([...sitemap.matchAll(new RegExp(\`<loc>\${escapedOrigin}(/event/[^<]+/)</loc>\`, 'g'))].map((match) => match[1]))\n};`,
  'parity check sitemap origin matching'
);
write('scripts/check-production-output-parity.mjs', parityCheck);

let publicLayer = read('scripts/verify-public-layer.mjs');
publicLayer = addImport(
  publicLayer,
  "import { isDeepStrictEqual } from 'node:util';\n",
  "import { PUBLIC_ORIGIN } from '../config/public-origin.mjs';",
  'public layer origin import'
);
publicLayer = replaceRequired(
  publicLayer,
  `assert(version.canonical_origin === '${NEW_ORIGIN}', 'version canonical origin mismatch');`,
  "assert(version.canonical_origin === PUBLIC_ORIGIN, 'version canonical origin mismatch');",
  'public layer canonical origin assertion'
);
write('scripts/verify-public-layer.mjs', publicLayer);

let deploymentWorkflow = read('.github/workflows/deploy-production.yml');
if (!deploymentWorkflow.includes('SOG_BASE_URL: https://www.stableorgone.com')) {
  deploymentWorkflow = replaceRequired(
    deploymentWorkflow,
    'concurrency:\n  group: sog-production-deployment\n  cancel-in-progress: true\n',
    'concurrency:\n  group: sog-production-deployment\n  cancel-in-progress: true\n\nenv:\n  SOG_BASE_URL: https://www.stableorgone.com\n',
    'deployment workflow public origin env'
  );
}
deploymentWorkflow = deploymentWorkflow
  .replaceAll('curl -fsS https://www.stableorgone.com/guides/', 'curl -fsS "$SOG_BASE_URL/guides/')
  .replaceAll('curl -fsS https://www.stableorgone.com/guides/uk-stablecoin-capital-rules-2026/', 'curl -fsS "$SOG_BASE_URL/guides/uk-stablecoin-capital-rules-2026/')
  .replace('echo "- Public origin: https://www.stableorgone.com/"', 'echo "- Public origin: $SOG_BASE_URL/"');
write('.github/workflows/deploy-production.yml', deploymentWorkflow);

const validator = `import fs from 'node:fs';
import path from 'node:path';
import { PUBLIC_HOSTNAME, PUBLIC_ORIGIN } from '../config/public-origin.mjs';

const root = process.cwd();
const expectedOrigin = 'https://www.stableorgone.com';
const expectedHostname = 'www.stableorgone.com';
const legacyHostname = ['sog', 'badjoke-lab', 'com'].join('.');
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

assert(PUBLIC_ORIGIN === expectedOrigin, \`PUBLIC_ORIGIN must be \${expectedOrigin}\`);
assert(PUBLIC_HOSTNAME === expectedHostname, \`PUBLIC_HOSTNAME must be \${expectedHostname}\`);

const requiredSnippets = {
  'astro.config.mjs': ["import { PUBLIC_ORIGIN } from './config/public-origin.mjs';", 'site: PUBLIC_ORIGIN'],
  'src/layouts/BaseLayout.astro': ["import { PUBLIC_ORIGIN } from '../../config/public-origin.mjs';", 'const siteUrl = PUBLIC_ORIGIN;'],
  'src/lib/machine-readable.ts': ["import { PUBLIC_ORIGIN } from '../../config/public-origin.mjs';", 'canonicalOrigin: PUBLIC_ORIGIN,'],
  'src/pages/sitemap-index.xml.ts': ["import { PUBLIC_ORIGIN } from '../../config/public-origin.mjs';", 'const SITE = PUBLIC_ORIGIN;'],
  'scripts/check-production.mjs': ["import { PUBLIC_ORIGIN } from '../config/public-origin.mjs';", 'const DEFAULT_BASE_URL = PUBLIC_ORIGIN;'],
  'scripts/check-production-provenance.mjs': ["import { PUBLIC_ORIGIN } from '../config/public-origin.mjs';", 'process.env.SOG_BASE_URL || PUBLIC_ORIGIN'],
  'scripts/check-production-output-parity.mjs': ["import { PUBLIC_ORIGIN } from '../config/public-origin.mjs';", 'process.env.SOG_BASE_URL || PUBLIC_ORIGIN'],
  'public/robots.txt': [\`Sitemap: \${expectedOrigin}/sitemap-index.xml\`],
  'README.md': [\`Public site: \${expectedOrigin}/\`],
  '.github/workflows/deploy-production.yml': [\`SOG_BASE_URL: \${expectedOrigin}\`]
};

for (const [file, snippets] of Object.entries(requiredSnippets)) {
  const content = read(file);
  for (const snippet of snippets) assert(content.includes(snippet), \`\${file}: missing \${snippet}\`);
}

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

for (const file of activeFiles) {
  const target = path.join(root, file);
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) continue;
  const content = read(file);
  assert(!content.includes(legacyHostname), \`\${file}: legacy hostname remains\`);
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
  active_files_checked: activeFiles.length
}, null, 2));
`;
write('scripts/validate-public-origin.mjs', validator);

let packageJson = read('package.json');
if (!packageJson.includes('"validate:public-origin"')) {
  packageJson = replaceRequired(
    packageJson,
    '    "validate:guides": "node scripts/validate-guides.mjs",\n',
    '    "validate:guides": "node scripts/validate-guides.mjs",\n    "validate:public-origin": "node scripts/validate-public-origin.mjs",\n',
    'package public origin script'
  );
}
write('package.json', packageJson);

let ciWorkflow = read('.github/workflows/ci.yml');
if (!ciWorkflow.includes('Validate official public origin')) {
  ciWorkflow = replaceRequired(
    ciWorkflow,
    '      - name: Validate guides\n        run: npm run validate:guides\n',
    '      - name: Validate guides\n        run: npm run validate:guides\n      - name: Validate official public origin\n        run: npm run validate:public-origin\n',
    'CI public origin validation'
  );
}
write('.github/workflows/ci.yml', ciWorkflow);

fs.rmSync(absolute('scripts/apply-official-domain-migration.mjs'));
fs.rmSync(absolute('.github/workflows/apply-official-domain-migration.yml'));

console.log(JSON.stringify({
  ok: true,
  migrated_origin: NEW_ORIGIN,
  active_files_scanned: activeFiles.length,
  temporary_files_removed: true
}, null, 2));
