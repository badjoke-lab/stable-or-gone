const DEPLOYMENT_CHAIN_ALIASES = new Map([
  ['arbitrum', 'Arbitrum One'],
  ['arbitrum one', 'Arbitrum One'],
  ['bnb chain', 'BNB Chain'],
  ['bnb smart chain', 'BNB Chain'],
  ['gnosis', 'Gnosis Chain'],
  ['gnosis chain', 'Gnosis Chain'],
  ['hyperevm', 'HyperEVM'],
  ['near', 'NEAR'],
  ['tron', 'TRON'],
  ['xdc network', 'XDC Network'],
  ['xrp ledger', 'XRP Ledger']
]);

const NON_CHAIN_DEPLOYMENT_CONTEXTS = new Set([
  '',
  'multi chain',
  'multi chain or bridge context',
  'multi chain or protocol context',
  'not known',
  'not recorded',
  'source review needed',
  'unclear',
  'unknown'
]);

const cleanChainValue = (value) => String(value ?? '')
  .trim()
  .replace(/[_-]+/g, ' ')
  .replace(/\s+/g, ' ');

export function canonicalDeploymentChain(value) {
  const cleaned = cleanChainValue(value);
  const rawKey = cleaned.toLowerCase();
  if (NON_CHAIN_DEPLOYMENT_CONTEXTS.has(rawKey)) return null;
  const label = DEPLOYMENT_CHAIN_ALIASES.get(rawKey) ?? cleaned;
  return {
    key: label.toLowerCase(),
    label
  };
}

export function normalizeDeploymentChainStats(stats, deployments = []) {
  const chains = new Map();
  const unresolvedAssetIds = new Set();
  let unresolvedDeploymentCount = 0;

  for (const deployment of deployments) {
    const identity = canonicalDeploymentChain(deployment.chain);
    if (!identity) {
      unresolvedDeploymentCount += 1;
      if (deployment.stablecoin_id) unresolvedAssetIds.add(deployment.stablecoin_id);
      continue;
    }

    const row = chains.get(identity.key) ?? {
      label: identity.label,
      deployment_count: 0,
      asset_ids: new Set()
    };
    row.deployment_count += 1;
    if (deployment.stablecoin_id) row.asset_ids.add(deployment.stablecoin_id);
    chains.set(identity.key, row);
  }

  const byChain = Object.fromEntries(
    [...chains.values()]
      .sort((left, right) => left.label.localeCompare(right.label))
      .map((row) => [row.label, {
        asset_count: row.asset_ids.size,
        deployment_count: row.deployment_count
      }])
  );

  return {
    ...stats,
    deployments: {
      ...stats.deployments,
      by_chain: byChain,
      unresolved_chain_contexts: {
        asset_count: unresolvedAssetIds.size,
        deployment_count: unresolvedDeploymentCount
      }
    }
  };
}
