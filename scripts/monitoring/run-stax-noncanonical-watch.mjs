import { runMonitoring } from './run.mjs';
import {
  STAX_NONCANONICAL_BASELINE_SET,
  STAX_NONCANONICAL_SOURCES
} from './sources/stax-noncanonical-watch.mjs';

const now = new Date().toISOString();
const compact = now.replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
const commit = process.env.GITHUB_SHA || process.env.SOG_MONITORING_COMMIT || 'unknown';
const runId = process.env.SOG_MONITORING_RUN_ID || `${compact}-stax-${String(commit).slice(0, 8)}`;

const result = await runMonitoring({
  startedAt: now,
  runId,
  mode: 'official-sources',
  sources: STAX_NONCANONICAL_SOURCES,
  baselineSet: STAX_NONCANONICAL_BASELINE_SET,
  includeReviewMaterial: true
});

console.log(JSON.stringify({
  run_id: result.manifest.run_id,
  status: result.manifest.status,
  observation_count: result.manifest.observation_count,
  candidate_count: result.manifest.candidate_count,
  source_errors: result.manifest.source_errors,
  canonical_guard: result.manifest.canonical_guard
}, null, 2));
