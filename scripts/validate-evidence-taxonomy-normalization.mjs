import fs from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import {
  evidenceArchiveStates,
  evidencePrimaryStates,
  evidenceProvenances,
  evidenceReliabilities,
  evidenceSourceTypeCategoryMap,
  evidenceSourceTypeProvenanceMap,
  getEvidenceArchiveState,
  getEvidencePrimaryState,
  getEvidenceProvenance,
  getEvidenceReliability,
  getPublicEvidenceCategory,
  pollutedReliabilityValues,
  publicEvidenceCategories
} from '../config/evidence-taxonomy.mjs';
import { evidenceTaxonomyBaseline } from './evidence-taxonomy-baseline.mjs';

const inputPath = 'data/generated/evidence-taxonomy-migration.json';
const outputPath = 'data/generated/evidence-taxonomy-validation.json';
const report = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

function count(values) {
  const result = {};
  for (const raw of values) {
    const value = raw || 'unknown';
    result[value] = (result[value] || 0) + 1;
  }
  return Object.fromEntries(Object.entries(result).sort(([a], [b]) => a.localeCompare(b)));
}

const records = report.records;
const sourceTypes = [...new Set(records.map((record) => record.source_type))].sort();
const ids = records.map((record) => record.id);
const publicCategories = records.map((record) => getPublicEvidenceCategory(record.source_type));
const provenances = records.map((record) => getEvidenceProvenance(record.source_type, record.source_provenance));
const primaryStates = records.map((record) => getEvidencePrimaryState(record.source_type, record.is_primary, record.primary_state));
const reliabilities = records.map((record) => getEvidenceReliability(record.reliability));
const archiveStates = records.map((record) => getEvidenceArchiveState(record.archived_url));
const polluted = records.filter((record) => pollutedReliabilityValues.has(record.reliability));

check(records.length === evidenceTaxonomyBaseline.evidence_records, `expected ${evidenceTaxonomyBaseline.evidence_records} evidence records, found ${records.length}`);
check(sourceTypes.length === evidenceTaxonomyBaseline.canonical_source_types, `expected ${evidenceTaxonomyBaseline.canonical_source_types} source types, found ${sourceTypes.length}`);
check(new Set(ids).size === ids.length, 'evidence ids must remain unique');
check(records.every((record) => record.subject_count > 0), 'every evidence record must preserve at least one subject relation');
check(records.every((record) => record.claim_scope_count > 0), 'every evidence record must preserve at least one claim scope');

const categoryValues = new Set(publicEvidenceCategories.map((entry) => entry.value));
const provenanceValues = new Set(evidenceProvenances.map((entry) => entry.value));
const primaryValues = new Set(evidencePrimaryStates.map((entry) => entry.value));
const reliabilityValues = new Set(evidenceReliabilities.map((entry) => entry.value));
const archiveValues = new Set(evidenceArchiveStates.map((entry) => entry.value));

for (const sourceType of sourceTypes) {
  check(Boolean(evidenceSourceTypeCategoryMap[sourceType]), `unmapped evidence category: ${sourceType}`);
  check(Boolean(evidenceSourceTypeProvenanceMap[sourceType]), `unmapped evidence provenance: ${sourceType}`);
}
check(publicCategories.every((value) => categoryValues.has(value) && value !== 'other_or_unknown'), 'public evidence category contains unresolved current records');
check(provenances.every((value) => provenanceValues.has(value) && value !== 'unknown'), 'evidence provenance contains unresolved current records');
check(primaryStates.every((value) => primaryValues.has(value) && value !== 'unknown'), 'evidence primary state contains unresolved current records');
check(reliabilities.every((value) => reliabilityValues.has(value)), 'public evidence reliability contains an invalid value');
check(archiveStates.every((value) => archiveValues.has(value)), 'evidence archive state contains an invalid value');

const actual = {
  public_categories: count(publicCategories),
  provenance: count(provenances),
  primary_state: count(primaryStates),
  reliability: count(reliabilities),
  archive_state: count(archiveStates),
  relation_kind: count(records.map((record) => record.relation_kind))
};
check(isDeepStrictEqual(actual.public_categories, evidenceTaxonomyBaseline.public_categories), `public evidence category counts changed: ${JSON.stringify(actual.public_categories)}`);
check(isDeepStrictEqual(actual.provenance, evidenceTaxonomyBaseline.provenance), `evidence provenance counts changed: ${JSON.stringify(actual.provenance)}`);
check(isDeepStrictEqual(actual.primary_state, evidenceTaxonomyBaseline.primary_state), `evidence primary-state counts changed: ${JSON.stringify(actual.primary_state)}`);
check(isDeepStrictEqual(actual.reliability, evidenceTaxonomyBaseline.reliability), `evidence reliability counts changed: ${JSON.stringify(actual.reliability)}`);
check(isDeepStrictEqual(actual.archive_state, evidenceTaxonomyBaseline.archive_state), `evidence archive-state counts changed: ${JSON.stringify(actual.archive_state)}`);
check(isDeepStrictEqual(actual.relation_kind, evidenceTaxonomyBaseline.relation_kind), `evidence relation-kind counts changed: ${JSON.stringify(actual.relation_kind)}`);
check(report.totals.multi_subject_records === evidenceTaxonomyBaseline.multi_subject_records, 'multi-subject evidence count changed');
check(report.totals.multi_claim_records === evidenceTaxonomyBaseline.multi_claim_records, 'multi-claim evidence count changed');
check(report.totals.duplicate_urls === evidenceTaxonomyBaseline.duplicate_urls, 'duplicate URL inventory changed without review');
check(report.totals.duplicate_url_title_pairs === evidenceTaxonomyBaseline.duplicate_url_title_pairs, 'duplicate URL-title inventory changed without review');
check(polluted.length === evidenceTaxonomyBaseline.polluted_reliability_records, 'polluted reliability inventory changed without review');
check(polluted.every((record) => getEvidenceReliability(record.reliability) === 'unknown'), 'polluted reliability values must normalize to unknown rather than inferred quality');

const uiSource = fs.readFileSync('src/components/EvidenceSourceTable.astro', 'utf8');
const rowSource = fs.readFileSync('src/components/EvidenceRows.astro', 'utf8');
for (const token of ['stablecoin-sources', 'organization-sources', 'event-sources']) check(uiSource.includes(token), `evidence table variant missing: ${token}`);
for (const token of ['public_category_label', 'canonical_source_type', 'provenance_label', 'primary_state_label', 'archive_state_label', 'reliability_label']) check(rowSource.includes(token), `evidence row taxonomy output missing: ${token}`);

const validation = {
  schema_version: '1.0',
  validated_at: new Date().toISOString(),
  evidence_records: records.length,
  canonical_source_types: sourceTypes.length,
  public_categories: publicEvidenceCategories.length,
  provenances: evidenceProvenances.length,
  primary_states: evidencePrimaryStates.length,
  reliability_values: evidenceReliabilities.length,
  archive_states: evidenceArchiveStates.length,
  counts: actual,
  duplicate_urls_preserved_for_pr15: report.totals.duplicate_urls,
  duplicate_url_title_pairs_preserved_for_pr15: report.totals.duplicate_url_title_pairs,
  polluted_reliability_normalized_to_unknown: polluted.length,
  failures
};
fs.writeFileSync(outputPath, `${JSON.stringify(validation, null, 2)}\n`);
if (failures.length) throw new Error(failures.join('\n'));
console.log(JSON.stringify({ ...validation, failures: undefined }, null, 2));
