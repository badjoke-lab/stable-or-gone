import { validateOfficialSourceBaselines } from './monitoring/baselines/baseline-store.mjs';
import { validateOfficialSources } from './monitoring/monitors/official-source-observer.mjs';
import {
  STAX_NONCANONICAL_BASELINE_SET,
  STAX_NONCANONICAL_SOURCES
} from './monitoring/sources/stax-noncanonical-watch.mjs';

const failures = [];
const canonicalIndex = {
  stablecoinIds: new Set(),
  organizationIds: new Set(),
  relationships: []
};

failures.push(...validateOfficialSources(STAX_NONCANONICAL_SOURCES, canonicalIndex));
failures.push(...validateOfficialSourceBaselines(STAX_NONCANONICAL_BASELINE_SET, STAX_NONCANONICAL_SOURCES));

if (STAX_NONCANONICAL_SOURCES.length !== 2) failures.push('StaX watch must contain exactly two first-party sources');
for (const source of STAX_NONCANONICAL_SOURCES) {
  if (source.affected_stablecoin_ids.length !== 0) failures.push(`${source.source_id}: candidate watch must not claim a canonical stablecoin ID`);
  if (source.affected_organization_ids.length !== 0) failures.push(`${source.source_id}: candidate watch must not claim a canonical organization ID`);
  if (source.monitoring_scope?.canonical_record !== false) failures.push(`${source.source_id}: canonical_record must remain false`);
  if (source.monitoring_scope?.subject_kind !== 'prelaunch_stablecoin') failures.push(`${source.source_id}: subject_kind must remain prelaunch_stablecoin`);
}

if (failures.length) {
  console.error('StaX noncanonical monitoring validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('StaX noncanonical monitoring configuration valid: 2 first-party sources, 0 canonical targets, review-only output.');
