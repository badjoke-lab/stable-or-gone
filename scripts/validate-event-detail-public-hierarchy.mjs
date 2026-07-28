#!/usr/bin/env node
import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

const header = read('src/components/EventEditorialHeader.astro');
const body = read('src/components/EventEditorialBody.astro');
const record = read('src/components/EventEditorialRecordV3.astro');
const evidenceTable = read('src/components/EvidenceSourceTable.astro');
const evidenceRows = read('src/components/EvidenceRows.astro');
const mobileRuntime = read('src/components/MobileTableRuntime.astro');
const capture = read('scripts/capture-site-screenshots.mjs');
const ui = read('src/styles/public-ui.css');
const brand = read('src/components/BrandLockup.astro');

check(!header.includes('<code>{event.id}</code>'), 'Record ID must not appear in the event masthead');
check((header.match(/<div><dt>/g) ?? []).length === 3, 'Event masthead must expose exactly three primary fact cells');
for (const label of ['Date', 'Affected records', 'Evidence']) {
  check(header.includes(`<dt>${label}</dt>`), `Event masthead is missing ${label}`);
}
for (const label of ['Severity', 'Event type', 'Lifecycle effect', 'Recovery or reversal', 'Record confidence']) {
  check(body.includes(`<dt>${label}</dt>`), `Closed record details are missing ${label}`);
}
check(body.includes('<details class="event-record-details">'), 'Record metadata must use a closed details disclosure');
check(!body.includes('already shown above'), 'Internal duplicate-field explanation remains public');
check(!body.includes('id="overview"'), 'Duplicate event-summary section remains public');
check(record.includes('href="#record-details"'), 'Record-details navigation target is missing');
check(record.includes('>Affected records</a>'), 'Human-facing affected-record navigation is missing');
check(!record.includes('href="#structured-detail"'), 'Event-specific fields must not remain a primary navigation section');
check(body.indexOf('<details class="event-record-details">') < body.indexOf('<StructuredEventDetail event={event} />'), 'Event-specific fields must remain inside closed record details');

const eventHeaders = '<thead><tr><th>Source</th><th>Publisher and date</th><th>Relevance</th><th>Archive</th></tr></thead>';
check(evidenceTable.includes(eventHeaders), 'Event Evidence must expose the four-field public header');
check(evidenceTable.includes('eventCompact'), 'Event Evidence compact rendering is not enabled');
check(evidenceRows.includes('event-evidence-source-details'), 'Event source audit metadata disclosure is missing');
for (const label of ['Source category', 'Provenance', 'Primary or secondary', 'Reliability']) {
  check(evidenceRows.includes(`<dt>${label}</dt>`), `Event source details are missing ${label}`);
}
check(mobileRuntime.includes("kind === 'event-sources' ? publisher"), 'Mobile Event Evidence summary is not simplified');
check(mobileRuntime.includes("table.dataset.mobileTableBuilt = 'true'"), 'Mobile table enhancement completion marker is missing');
check(
  capture.includes('table[data-table-kind][data-mobile-table]')
    && capture.includes('hidden-mobile-table:')
    && capture.includes('duplicate-mobile-table:'),
  'All mobile table surfaces, including Event Evidence, must have hidden- and duplicate-content screenshot gates'
);

check(ui.includes('--ui-copy: #d6d3ca;'), 'Body-copy brightness token is not at the CYA dark reviewed value');
check(ui.includes('--ui-muted: #979d99;'), 'Supporting-copy brightness token is not at the CYA dark reviewed value');
check(ui.includes('.event-detail-evidence-r5'), 'Event Evidence flat width boundary is missing');
check(ui.includes('table[data-mobile-table] { display: none; }'), 'Desktop table suppression on compact screens is missing');
check(ui.includes('[data-mobile-representation-for] { display: grid;'), 'Mobile table representation is not enabled');
check(ui.includes('.mobile-evidence-record'), 'Event Evidence compact record styling is missing');
check(ui.includes('.event-structured-detail'), 'Event structured detail flat boundary is missing');

const publicUiImport = "import '../styles/public-ui.css'";
check(brand.includes(publicUiImport), 'Single public UI authority is not loaded');
check(!brand.includes('event-detail-public-fix.css'), 'Event detail repair must not reintroduce a second stylesheet');

const result = {
  schema_version: '2.0',
  ok: failures.length === 0,
  primary_event_facts: 3,
  event_evidence_public_fields: 4,
  record_metadata_default: 'closed',
  visual_family: 'cya_dark_flat_registry',
  public_copy_token: '#d6d3ca',
  public_muted_token: '#979d99',
  mobile_evidence_contract: 'desktop table hidden, compact evidence records visible',
  failures
};

console.log(JSON.stringify(result, null, 2));
if (failures.length > 0) process.exit(1);
