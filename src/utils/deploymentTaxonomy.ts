import {
  getContractIdentityState,
  getContractIdentityStateLabel,
  getDeploymentCanonicalityLabel,
  getDeploymentCanonicalityRecordState,
  getDeploymentCanonicalityRecordStateLabel,
  getDeploymentChangeState,
  getDeploymentChangeStateLabel,
  getDeploymentOperationalState,
  getDeploymentOperationalStateLabel,
  getDeploymentVerificationState,
  getDeploymentVerificationStateLabel,
  getNetworkIdentityState,
  getNetworkIdentityStateLabel,
  getPublicDeploymentCategory,
  getPublicDeploymentCategoryLabel
} from '../../config/deployment-taxonomy.mjs';
import { getDeployments } from '../lib/data/registry';

export type DeploymentTaxonomyRecord = {
  id?: string | null;
  deployment_type?: string | null;
  status?: string | null;
  canonicality?: string | null;
  verification_status?: string | null;
  contract_address?: string | null;
  chain?: string | null;
  evidence_ids?: string[] | null;
};

const canonicalityRecordedByDeploymentId = new Map(
  getDeployments().map((deployment) => {
    const record = deployment as DeploymentTaxonomyRecord;
    return [
      record.id,
      record.canonicality !== null && record.canonicality !== undefined && record.canonicality !== ''
    ];
  })
);

export function resolveDeploymentTaxonomy(deployment: DeploymentTaxonomyRecord) {
  const publicCategory = getPublicDeploymentCategory(deployment.deployment_type);
  const operationalState = getDeploymentOperationalState(deployment.status);
  const changeState = getDeploymentChangeState(deployment.status);
  const canonicality = deployment.canonicality ?? 'unknown';
  const canonicalityWasRecorded = deployment.id ? canonicalityRecordedByDeploymentId.get(deployment.id) : undefined;
  const canonicalityRecordState = canonicalityWasRecorded === false
    ? 'not_recorded'
    : canonicalityWasRecorded === true
      ? 'recorded'
      : getDeploymentCanonicalityRecordState(deployment.canonicality);
  const contractIdentityState = getContractIdentityState(deployment.contract_address);
  const verificationState = getDeploymentVerificationState(deployment);
  const networkIdentityState = getNetworkIdentityState(deployment.chain);

  return {
    public_category: publicCategory,
    public_category_label: getPublicDeploymentCategoryLabel(publicCategory),
    canonical_deployment_type: deployment.deployment_type ?? 'not_recorded',
    operational_state: operationalState,
    operational_state_label: getDeploymentOperationalStateLabel(operationalState),
    canonical_status_raw: deployment.status ?? 'not_recorded',
    change_state: changeState,
    change_state_label: getDeploymentChangeStateLabel(changeState),
    canonicality,
    canonicality_label: getDeploymentCanonicalityLabel(canonicality),
    canonicality_record_state: canonicalityRecordState,
    canonicality_record_state_label: getDeploymentCanonicalityRecordStateLabel(canonicalityRecordState),
    verification_state: verificationState,
    verification_state_label: getDeploymentVerificationStateLabel(verificationState),
    contract_identity_state: contractIdentityState,
    contract_identity_state_label: getContractIdentityStateLabel(contractIdentityState),
    network_identity_state: networkIdentityState,
    network_identity_state_label: getNetworkIdentityStateLabel(networkIdentityState)
  };
}
