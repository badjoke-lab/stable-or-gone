import { getStablecoins } from './data/registry';
import {
  getDeploymentsV3,
  getLegalProfiles,
  getReserveComponents,
  getStableAssetRelationships,
} from './data/registryV3';
import { getIncomeProfilesV3 } from './data/incomeProfilesV3';
import { DATA_SCHEMA_VERSION } from './machine-readable';

export function getRegistryV3Summary() {
  const stablecoinCount = getStablecoins().length;
  const legalProfiles = getLegalProfiles();
  const incomeProfiles = getIncomeProfilesV3();
  const reserveComponents = getReserveComponents();
  const deployments = getDeploymentsV3();

  return {
    schema_version: 'sog_registry_v3',
    mode: 'additive',
    base_schema_version: DATA_SCHEMA_VERSION,
    protected_stable_assets: stablecoinCount,
    record_counts: {
      legal_profiles: legalProfiles.length,
      stable_asset_relationships: getStableAssetRelationships().length,
      reserve_components: reserveComponents.length,
      income_profiles: incomeProfiles.length,
      deployments: deployments.length,
    },
    coverage: {
      legal_profiles: new Set(legalProfiles.map((row) => row.id)).size,
      income_profiles: new Set(incomeProfiles.map((row) => row.id)).size,
      reserve_component_assets: new Set(reserveComponents.map((row) => row.stablecoin_id)).size,
      deployment_view_assets: new Set(deployments.map((row) => row.stablecoin_id)).size,
    },
  };
}
