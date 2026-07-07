import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_RESEARCH_PATH = 'data/editorial-research/eu-stablecoin-market-access.json';

function daysBetween(laterIso, earlierDate) {
  const later = Date.parse(laterIso);
  const earlier = Date.parse(`${earlierDate}T00:00:00.000Z`);
  if (!Number.isFinite(later) || !Number.isFinite(earlier)) return null;
  return Math.max(0, Math.floor((later - earlier) / 86_400_000));
}

export function freshnessBand(ageDays) {
  if (ageDays === null) return 'missing_date';
  if (ageDays <= 7) return 'current';
  if (ageDays <= 14) return 'review_due';
  if (ageDays <= 30) return 'stale';
  return 'severely_stale';
}

export function runArticleStaleStateReview(options = {}) {
  const root = options.root ?? process.cwd();
  const checkedAt = options.checkedAt ?? new Date().toISOString();
  const relativePath = options.researchPath ?? DEFAULT_RESEARCH_PATH;
  const research = options.research ?? JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));

  const findings = [];
  const overallAge = daysBetween(checkedAt, research.information_current_through);
  findings.push({
    finding_id: 'research-information-current-through',
    subject_type: 'research_snapshot',
    subject_id: research.research_id ?? null,
    date_field: 'information_current_through',
    date_value: research.information_current_through ?? null,
    age_days: overallAge,
    freshness_band: freshnessBand(overallAge),
    canonical_action: 'none'
  });

  for (const source of research.reviewed_sources ?? []) {
    const age = daysBetween(checkedAt, source.last_checked_at);
    findings.push({
      finding_id: `reviewed-source:${source.source_id}`,
      subject_type: 'reviewed_source',
      subject_id: source.source_id,
      review_state: source.review_state ?? null,
      date_field: 'last_checked_at',
      date_value: source.last_checked_at ?? null,
      age_days: age,
      freshness_band: freshnessBand(age),
      canonical_action: 'none'
    });
  }

  findings.sort((a, b) => a.finding_id.localeCompare(b.finding_id));
  const counts = {
    current: findings.filter((row) => row.freshness_band === 'current').length,
    review_due: findings.filter((row) => row.freshness_band === 'review_due').length,
    stale: findings.filter((row) => row.freshness_band === 'stale').length,
    severely_stale: findings.filter((row) => row.freshness_band === 'severely_stale').length,
    missing_date: findings.filter((row) => row.freshness_band === 'missing_date').length
  };

  return {
    schema_version: '1.0',
    monitor: 'article-stale-state-review',
    status: counts.missing_date > 0 ? 'review_required' : 'ok',
    checked_at: checkedAt,
    research_path: relativePath,
    research_id: research.research_id ?? null,
    information_current_through: research.information_current_through ?? null,
    finding_count: findings.length,
    counts,
    findings,
    policy: {
      read_only: true,
      human_review_required: true,
      automatic_guide_edit: false,
      canonical_action: 'none',
      public_output: false
    }
  };
}
