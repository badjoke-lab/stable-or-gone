import fs from 'node:fs';
import path from 'node:path';
import { evidenceMobileFields } from './evidence-mobile-fields.mjs';

const root = process.cwd();
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const css = read('src/styles/global.css');
const compactCss = css.replace(/\/\*[\s\S]*?\*\//g, ' ');

check(!/(?:th|td)\s*:\s*nth-child\s*\(/i.test(compactCss), 'Generic th/td nth-child selectors are prohibited');
check(!/(?:th|td)[^{]*\{[^}]*display\s*:\s*none/gi.test(compactCss), 'Table cells must not be hidden with display:none');
check(!/table[^{]*\{[^}]*display\s*:\s*none/gi.test(compactCss), 'Tables must not be hidden with display:none');
check(css.includes('table[data-mobile-table="scroll-preserve"]'), 'Information-preserving mobile table selector is missing');
check(css.includes('overflow-x: auto'), 'Temporary horizontal access for wide tables is missing');
check(css.includes('overscroll-behavior-inline: contain'), 'Mobile table overscroll containment is missing');

const sourceFiles = [
  'src/pages/stablecoins/index.astro',
  'src/pages/issuers/index.astro',
  'src/pages/events/index.astro',
  'src/components/StablecoinDetailView.astro',
  'src/components/IssuerControlEvents.astro',
  'src/components/StablecoinEventTimeline.astro',
  'src/components/StructuredEventDetail.astro',
  'src/components/EvidenceSourceTable.astro',
  'src/pages/issuer/[slug].astro',
  'src/pages/event/[id].astro'
];

const tableKinds = new Map();
let tableCount = 0;
for (const relativePath of sourceFiles) {
  const source = read(relativePath);
  const tables = [...source.matchAll(/<table\b[^>]*>/g)].map((match) => match[0]);
  check(tables.length > 0, `${relativePath}: no table elements found`);
  for (const table of tables) {
    tableCount += 1;
    const kind = table.match(/\bdata-table-kind=["']([^"']+)["']/)?.[1];
    const strategy = table.match(/\bdata-mobile-table=["']([^"']+)["']/)?.[1];
    check(Boolean(kind), `${relativePath}: table is missing data-table-kind`);
    check(strategy === 'scroll-preserve', `${relativePath}: ${kind ?? 'unidentified table'} must use scroll-preserve during Gate B`);
    if (!kind) continue;
    check(!tableKinds.has(kind), `Duplicate data-table-kind: ${kind}`);
    tableKinds.set(kind, relativePath);
  }
}

const requiredKinds = [
  'stablecoin-index',
  'organization-index',
  'event-index',
  'stablecoin-overview',
  'stablecoin-organizations',
  'stablecoin-reserve-profile',
  'stablecoin-redemption-profile',
  'stablecoin-record-coverage',
  'issuer-control-events',
  'stablecoin-event-timeline',
  'stablecoin-reserve-history',
  'stablecoin-regulatory-notices',
  'stablecoin-deployments',
  'stablecoin-sources',
  'stablecoin-open-questions',
  'organization-overview',
  'organization-relationships',
  'organization-events',
  'organization-sources',
  'event-details',
  'event-detail-overlay',
  'event-sources'
];

for (const kind of requiredKinds) {
  check(tableKinds.has(kind), `Required mobile table identity is missing: ${kind}`);
}
check(tableKinds.size === requiredKinds.length, `Expected ${requiredKinds.length} table identities, found ${tableKinds.size}`);
check(tableCount === requiredKinds.length, `Expected ${requiredKinds.length} core tables, found ${tableCount}`);

const protectedFields = {
  'stablecoin-index': ['Reference target', 'Backing model', 'Lifecycle', 'Issuance', 'Reviewed'],
  'organization-index': ['Organization category', 'Regulatory character', 'Jurisdiction', 'Functional roles', 'Relationship state', 'Record confidence'],
  'event-index': ['Category', 'Subtype', 'Impact', 'Recovery', 'Sources'],
  'stablecoin-overview': [
    'Reference target',
    'Reference kind',
    'Comparison category',
    'Reference methodology',
    'Public backing model',
    'Canonical backing types',
    'Reserve component categories',
    'Primary stabilization mechanism',
    'Recorded model description'
  ],
  'stablecoin-organizations': ['Relationship status'],
  'stablecoin-reserve-profile': ['Summary', 'Profile confidence'],
  'stablecoin-event-timeline': ['Category', 'Subtype', 'Status effect', 'Recovery'],
  'stablecoin-reserve-history': ['Record confidence'],
  'stablecoin-regulatory-notices': ['Summary'],
  'stablecoin-deployments': ['Freeze', 'Blacklist', 'Contract'],
  'stablecoin-sources': evidenceMobileFields,
  'organization-overview': [
    'Organization category',
    'Canonical organization type',
    'Legal form',
    'Legal-form state',
    'Regulatory character',
    'Jurisdiction',
    'Jurisdiction scope',
    'Functional roles',
    'Relationship states',
    'Record confidence'
  ],
  'organization-relationships': ['Functional role', 'Relationship state', 'Stablecoin lifecycle'],
  'organization-events': ['Category', 'Subtype', 'Status effect'],
  'organization-sources': evidenceMobileFields,
  'event-details': [
    'Public event category',
    'Canonical event subtype',
    'Structured detail kind',
    'Impact',
    'Effect on stablecoin lifecycle',
    'Recovery or reversal',
    'Structured detail coverage',
    'Record confidence'
  ],
  'event-sources': evidenceMobileFields
};

const sourceByTableKind = new Map([...tableKinds.entries()].map(([kind, relativePath]) => [kind, read(relativePath)]));
for (const [kind, labels] of Object.entries(protectedFields)) {
  check(tableKinds.has(kind), `Protected table is not identified: ${kind}`);
  const source = sourceByTableKind.get(kind) ?? '';
  for (const label of labels) {
    check(source.includes(`>${label}<`), `Protected material field label is missing: ${kind} / ${label}`);
  }
}

if (failures.length > 0) {
  console.error('Mobile information-preservation validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  core_source_files: sourceFiles.length,
  identified_tables: tableKinds.size,
  table_kinds: [...tableKinds.keys()].sort(),
  prohibited_generic_column_hiding: false,
  temporary_mobile_strategy: 'scroll-preserve'
}, null, 2));
