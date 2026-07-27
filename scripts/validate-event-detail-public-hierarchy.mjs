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
const shell = read('src/styles/v3-cya-dark-shell.css');
const fix = read('src/styles/event-detail-public-fix.css');
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
check(capture.includes('table[data-table-kind="event-sources"][data-mobile-table="scroll-preserve"]'), 'Event Evidence hidden-content screenshot gate is missing');

check(shell.includes('--v3-text-muted: #cbc9c1;'), 'Body-copy brightness token is not at the reviewed value');
check(shell.includes('--v3-text-quiet: #aeb2b5;'), 'Supporting-copy brightness token is not at the reviewed value');
check(fix.includes('table[data-table-kind=event-sources]'), 'Event Evidence width and wrapping repair is missing');
check(fix.includes(':not([data-mobile-table-built=true])'), 'Event Evidence progressive fallback is missing');
check(fix.includes('[data-mobile-representation-for=event-sources]'), 'Event Evidence mobile representation visibility repair is missing');
check(fix.includes('.event-record-details-grid'), 'Closed record-details layout is missing');

const fixImport = "import '../styles/event-detail-public-fix.css'";
const typographyImport = "import '../styles/v3-public-typography-contract.css'";
check(brand.includes(fixImport), 'Event detail repair stylesheet is not loaded');
check(brand.indexOf(typographyImport) > brand.indexOf(fixImport), 'Public typography contract must remain last');

const result = {
  schema_version: '1.0',
  ok: failures.length === 0,
  primary_event_facts: 3,
  event_evidence_public_fields: 4,
  record_metadata_default: 'closed',
  failures
};

console.log(JSON.stringify(result, null, 2));
if (failures.length > 0) process.exit(1);
