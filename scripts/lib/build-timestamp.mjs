export function resolveBuildTimestamp() {
  const explicit = process.env.SOG_BUILD_TIMESTAMP?.trim();
  if (explicit) {
    const parsed = new Date(explicit);
    if (Number.isNaN(parsed.valueOf())) throw new Error(`Invalid SOG_BUILD_TIMESTAMP: ${explicit}`);
    return parsed.toISOString();
  }

  const sourceDateEpoch = process.env.SOURCE_DATE_EPOCH?.trim();
  if (sourceDateEpoch) {
    if (!/^\d+$/.test(sourceDateEpoch)) throw new Error(`Invalid SOURCE_DATE_EPOCH: ${sourceDateEpoch}`);
    const parsed = new Date(Number(sourceDateEpoch) * 1000);
    if (Number.isNaN(parsed.valueOf())) throw new Error(`Invalid SOURCE_DATE_EPOCH: ${sourceDateEpoch}`);
    return parsed.toISOString();
  }

  return new Date().toISOString();
}
