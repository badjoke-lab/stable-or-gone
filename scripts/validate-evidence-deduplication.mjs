import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const baseline = loadRegistryV2Baseline(root);
const auditPath = path.join(root, 'data/generated/evidence-deduplication-audit.json');
const failures = [];
const warnings = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

assert(fs.existsSync(auditPath), 'evidence deduplication audit is missing');
if (!fs.existsSync(auditPath)) {
  console.error(failures.join('\n'));
  process.exit(1);
}

const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
const totals = audit.totals ?? {};
const groups = audit.exact_url_groups ?? [];
const records = audit.records ?? [];

assert(audit.schema_version === '1.0', 'audit schema version must be 1.0');
assert(audit.baseline_id === baseline.baseline_id, 'audit baseline id mismatch');
assert(totals.evidence_records === 455, `expected 455 evidence records, found ${totals.evidence_records}`);
assert(totals.unique_evidence_ids === 455, `expected 455 unique evidence ids, found ${totals.unique_evidence_ids}`);
assert(totals.duplicate_evidence_ids === 0, `duplicate evidence ids found: ${totals.duplicate_evidence_ids}`);
assert(totals.exact_duplicate_url_groups === 32, `expected 32 exact duplicate URL groups, found ${totals.exact_duplicate_url_groups}`);
assert(totals.exact_duplicate_url_title_groups === 7, `expected 7 exact duplicate URL-title groups, found ${totals.exact_duplicate_url_title_groups}`);
assert(records.length === totals.evidence_records, 'record inventory length mismatch');
assert(groups.length === totals.exact_duplicate_url_groups, 'exact URL group inventory length mismatch');

const recordIds = new Set(records.map((record) => record.id));
assert(recordIds.size === records.length, 'record inventory contains duplicate ids');

const groupIds = new Set();
const groupedEvidenceIds = new Set();
for (const group of groups) {
  assert(typeof group.group_id === 'string' && group.group_id.length > 0, 'duplicate group id is missing');
  assert(!groupIds.has(group.group_id), `duplicate group id: ${group.group_id}`);
  groupIds.add(group.group_id);
  assert(group.count === group.evidence_ids.length, `${group.group_id}: count does not match evidence_ids length`);
  assert(group.count > 1, `${group.group_id}: duplicate group must contain at least two records`);
  assert(group.exact_url_count === 1, `${group.group_id}: exact URL group must contain one exact URL`);
  assert(typeof group.classification_candidate === 'string' && group.classification_candidate.length > 0, `${group.group_id}: classification candidate is missing`);
  for (const evidenceId of group.evidence_ids) {
    assert(recordIds.has(evidenceId), `${group.group_id}: missing evidence record ${evidenceId}`);
    groupedEvidenceIds.add(evidenceId);
  }
  const union = group.relation_union ?? {};
  assert(Array.isArray(union.stablecoin_ids), `${group.group_id}: stablecoin relation union is missing`);
  assert(Array.isArray(union.organization_ids), `${group.group_id}: organization relation union is missing`);
  assert(Array.isArray(union.event_ids), `${group.group_id}: event relation union is missing`);
  assert(Array.isArray(union.claim_scopes), `${group.group_id}: claim-scope relation union is missing`);
}

const classificationTotal = Object.values(audit.classification_counts ?? {}).reduce((sum, count) => sum + count, 0);
assert(classificationTotal === groups.length, 'classification counts do not sum to exact URL groups');
assert(totals.candidate_identity_groups === (audit.classification_counts?.exact_identity_duplicate_same_relations ?? 0) + (audit.classification_counts?.exact_identity_duplicate_relation_variants ?? 0), 'candidate identity total mismatch');

if (totals.candidate_identity_groups === 0) warnings.push('No candidate source-identity duplicates were detected.');
if (totals.metadata_review_groups > 0) warnings.push(`${totals.metadata_review_groups} same-URL groups require metadata review before any merge.`);
if (totals.normalized_only_duplicate_url_groups > 0) warnings.push(`${totals.normalized_only_duplicate_url_groups} normalized URL groups require review.`);

const validation = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  baseline_id: baseline.baseline_id,
  ok: failures.length === 0,
  totals: {
    evidence_records: totals.evidence_records,
    exact_duplicate_url_groups: totals.exact_duplicate_url_groups,
    exact_duplicate_url_title_groups: totals.exact_duplicate_url_title_groups,
    candidate_identity_groups: totals.candidate_identity_groups,
    grouped_evidence_records: groupedEvidenceIds.size
  },
  failures,
  warnings
};

const outputPath = path.join(root, 'data/generated/evidence-deduplication-validation.json');
fs.writeFileSync(outputPath, `${JSON.stringify(validation, null, 2)}\n`);

if (failures.length > 0) {
  console.error(JSON.stringify(validation, null, 2));
  process.exit(1);
}

console.log(JSON.stringify(validation, null, 2));
