import fs from 'node:fs';
import path from 'node:path';

export function loadDeploymentVerification(root = process.cwd()) {
  const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
  const base = read('data/deployment-verification-pr229.json');
  const overlayFiles = fs.readdirSync(path.join(root, 'data'))
    .filter((name) => /^deployment-verification-growth-pr\d+\.json$/.test(name))
    .sort()
    .map((name) => `data/${name}`);
  const overlays = overlayFiles.map(read);
  const statuses = ['verified','identifier_recorded_unverified','source_linked_no_identifier','review_needed','unknown','not_recorded'];
  const statusIds = Object.fromEntries(statuses.map((status) => [status, [...(base.status_ids?.[status] ?? [])]]));
  const statusCounts = Object.fromEntries(statuses.map((status) => [status, Number(base.status_counts?.[status] ?? 0)]));
  const reviewedRecords = [...(base.reviewed_records ?? [])];
  const seenIds = new Set(Object.values(statusIds).flat());

  for (const overlay of overlays) {
    for (const status of statuses) {
      const ids = overlay.status_ids?.[status] ?? [];
      for (const id of ids) {
        if (seenIds.has(id)) throw new Error(`duplicate deployment verification id across base/overlays: ${id}`);
        seenIds.add(id);
        statusIds[status].push(id);
      }
      statusCounts[status] += Number(overlay.status_counts?.[status] ?? ids.length);
    }
    reviewedRecords.push(...(overlay.reviewed_records ?? []));
  }

  return {
    ...base,
    schema_version: overlays.length ? '1.5-composed' : base.schema_version,
    expected_total: Number(base.expected_total ?? 0) + overlays.reduce((sum, overlay) => sum + Number(overlay.expected_additions ?? 0), 0),
    status_counts: statusCounts,
    status_ids: statusIds,
    reviewed_records: reviewedRecords,
    overlay_files: overlayFiles,
  };
}
