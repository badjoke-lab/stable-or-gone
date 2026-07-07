import fs from 'node:fs';
import path from 'node:path';
import { generateStats } from '../../scripts/build-stats.mjs';

export function getPublicStats(root = process.cwd()) {
  return generateStats({ root });
}

export function getPublicStatsHistory(root = process.cwd()) {
  const historyPath = path.join(root, 'data/stats-history.json');
  return JSON.parse(fs.readFileSync(historyPath, 'utf8'));
}

export function getStatsReviewDate(stats, history) {
  const latestHistoryDate = (history.snapshots ?? [])
    .map((snapshot) => snapshot.recorded_at)
    .filter(Boolean)
    .sort()
    .at(-1);
  const generatedDate = String(stats.generated_at ?? '').slice(0, 10);
  return latestHistoryDate || generatedDate || 'Not recorded';
}
