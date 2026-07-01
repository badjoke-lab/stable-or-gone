import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const sources = [
  'src/components/StablecoinDetailView.astro',
  'src/components/StablecoinDossierHeader.astro',
  'src/components/StablecoinReserveSection.astro',
  'src/components/StablecoinContextSections.astro',
  'src/components/StablecoinHistorySection.astro',
  'src/components/StablecoinRelatedSection.astro'
].map(read);
const all = sources.join('\n');
const view = sources[0];
const failures = [];
const need = (text, marker) => { if (!text.includes(marker)) failures.push(marker); };

for (const marker of ['StablecoinDossierHeader', 'StablecoinReserveSection', 'StablecoinContextSections', 'StablecoinHistorySection', 'StablecoinRelatedSection', 'data-table-kind="stablecoin-overview"', 'data-mobile-representation-for="stablecoin-overview"', '#assessment', '#organizations-control', '#mechanism', '#evidence', '#known-unknowns', 'subjectOf:']) need(view, marker);
for (const marker of ['Stablecoin dossier', 'Primary organization', 'Latest material change', 'No dated material event is currently recorded.', 'No reserve components have been recorded.', 'No separate model-change event is currently recorded.', 'tableKind="stablecoin-sources"', '<RelatedGuides guides={relatedGuides} />']) need(all, marker);
for (const legacy of ['PageHero', 'MetricCard', 'TickerBadge']) if (all.includes(legacy)) failures.push(`legacy:${legacy}`);

const result = { schema_version: '1.0', generated_at: new Date().toISOString(), ok: failures.length === 0, page_family: 'editorial_ledger_research_dossier', canonical_record_changes: 0, route_changes: 0, failures };
const output = path.join(root, 'data/generated/ui-v3-stablecoin-detail-validation.json');
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`);
if (failures.length) { console.error(JSON.stringify(result, null, 2)); process.exit(1); }
console.log(JSON.stringify(result, null, 2));
