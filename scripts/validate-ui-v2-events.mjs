import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const index = read('src/pages/events/index.astro');
const detail = read('src/pages/event/[id].astro');
const indexCss = read('src/styles/event-index.css');
const detailCss = read('src/styles/event-detail.css');

check(index.includes("PageHero"), 'Events index must use PageHero');
check(index.includes("MetricCard"), 'Events index must use MetricCard');
check(index.includes('data-ui-v2-events'), 'Events index v2 marker is missing');
for (const label of ['Events', 'Stablecoin subjects', 'Organization subjects', 'Source identities']) check(index.includes(`label=\"${label}\"`), `Events index metric missing: ${label}`);
for (const filter of ['category', 'subtype', 'status_effect', 'recovery', 'year']) check(index.includes(`id: '${filter}'`), `Events filter missing: ${filter}`);
for (const sort of ['date_desc', 'date_asc', 'title_asc', 'evidence_most']) check(index.includes(`value=\"${sort}\"`), `Events sort missing: ${sort}`);
for (const header of ['Date', 'Event', 'Category', 'Subtype', 'Impact', 'Status effect', 'Recovery', 'Sources']) check(index.includes(`<th>${header}</th>`), `Events index header missing: ${header}`);
check(index.includes('EventIndexCard') && index.includes("import '../../scripts/event-index'"), 'Events compact cards or controller are missing');

check(detail.includes('data-ui-v2-event-detail'), 'Event detail v2 marker is missing');
check(detail.includes('PageHero') && detail.includes('MetricCard'), 'Event detail shared v2 components are missing');
for (const label of ['Date', 'Category', 'Subtype', 'Status effect', 'Recovery', 'Source identities']) check(detail.includes(`label=\"${label}\"`), `Event detail metric missing: ${label}`);
for (const anchor of ['#overview', '#subjects', '#sources', '#corrections']) check(detail.includes(`href=\"${anchor}\"`), `Event detail navigation missing: ${anchor}`);
check(detail.includes('StructuredEventDetail'), 'Structured event detail must remain reachable');
check(detail.includes('EventValueStateRows'), 'Event value-state rows must remain reachable');
check(detail.includes('subjectStablecoins') && detail.includes('subjectOrganizations'), 'Event subjects must remain separate');
check(detail.includes('EvidenceSourceTable') && detail.includes('sourceIdentities') && detail.includes('eventRelations'), 'Event evidence axes are incomplete');
check(detail.includes('/contact/') && detail.includes('/methodology/') && detail.includes('/data/manifest.json'), 'Event correction and further-reading destinations are incomplete');
check(indexCss.includes('.event-index-metrics') && indexCss.includes(':focus-visible') && indexCss.includes('@media (max-width: 719px)'), 'Events index responsive styles are incomplete');
check(detailCss.includes('.event-detail-metrics') && detailCss.includes(':focus-visible') && detailCss.includes('@media (prefers-reduced-motion: reduce)') && detailCss.includes('@media (forced-colors: active)'), 'Event detail accessibility styles are incomplete');
check(!index.includes('fetch(') && !detail.includes('fetch('), 'Event pages must not fetch external runtime data');

const report = { schema_version: '1.0', checked_at: new Date().toISOString(), ok: failures.length === 0, failures };
if (failures.length) { console.error(JSON.stringify(report, null, 2)); process.exit(1); }
console.log(JSON.stringify(report, null, 2));
