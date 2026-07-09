import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildComparisonReadinessAudit } from './build-readiness-audit-pr337.mjs';

const stateCode = {
  ready: 'r',
  ready_with_unknowns: 'u',
  needs_normalization: 'n',
  integrity_blocked: 'b',
};

export function buildCompactComparisonReadinessAudit() {
  const audit = buildComparisonReadinessAudit();
  const dimensionOrder = audit.summary.dimension_states.map((row) => row.dimension_id);
  return {
    schema_version: audit.schema_version,
    audit_id: audit.audit_id,
    status: audit.status,
    checkpoint_id: audit.checkpoint_id,
    asset_count: audit.asset_count,
    dimension_count: audit.dimension_count,
    comparison_cell_count: audit.asset_count * audit.dimension_count,
    contract_id: audit.contract_id,
    input_digest_sha256: audit.input_digest_sha256,
    generated_from_canonical_only: audit.generated_from_canonical_only,
    single_composite_score: audit.single_composite_score,
    asset_state_precedence: audit.asset_state_precedence,
    dimension_order: dimensionOrder,
    state_code_legend: {
      r: 'ready',
      u: 'ready_with_unknowns',
      n: 'needs_normalization',
      b: 'integrity_blocked',
    },
    summary: audit.summary,
    assets: audit.assets.map((asset) => ({
      asset_id: asset.asset_id,
      slug: asset.slug,
      overall_state: asset.overall_state,
      dimension_state_codes: asset.dimensions.map((row) => stateCode[row.state]).join(''),
    })),
    normalization_queue: audit.normalization_queue,
  };
}

export function serializeCompactAudit(audit) {
  return `${JSON.stringify(audit, null, 2)}\n`;
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const audit = buildCompactComparisonReadinessAudit();
  const serialized = serializeCompactAudit(audit);
  const outputPath = process.argv[2];
  if (outputPath) {
    const fullPath = path.resolve(outputPath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, serialized);
    console.log(outputPath);
  } else {
    process.stdout.write(serialized);
  }
}
