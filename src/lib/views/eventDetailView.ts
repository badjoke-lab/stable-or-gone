import { cleanPublicText } from '../../utils/publicText';
import { eventPublicCopy } from '../../data/eventPublicCopy';
import { resolveEventTaxonomy } from '../../utils/eventTaxonomy';
import { getStablecoins, getOrganizations, getEvidence } from '../data/registry';
import { canonicalizeLinkedEvidenceIds, getCanonicalEvidenceRelations, getEvidenceSourceIdentities } from '../data/evidenceSources';
import { resolveEvidenceIdentityId } from '../../../config/evidence-source-identities.mjs';

const detailFamilies = ['depeg_detail', 'regulatory_detail', 'reserve_change_detail', 'redemption_change_detail', 'migration_detail', 'issuer_control_detail', 'security_incident_detail', 'oracle_failure_detail', 'collateral_impairment_detail', 'insolvency_detail', 'governance_change_detail', 'bridge_or_chain_incident_detail', 'termination_detail', 'launch_detail'];

export function buildEventDetailView(event: any) {
  const allStablecoins = getStablecoins();
  const allOrganizations = getOrganizations();
  const allEvidence = getEvidence();
  const subjectStablecoins = (event.subject_stablecoin_ids?.length ? event.subject_stablecoin_ids : event.stablecoin_id ? [event.stablecoin_id] : []).map((id: string) => allStablecoins.find((item) => item.id === id) ?? { id, name: id, slug: '' });
  const subjectOrganizations = (event.subject_organization_ids?.length ? event.subject_organization_ids : event.issuer_id ? [event.issuer_id] : []).map((id: string) => allOrganizations.find((item) => item.id === id) ?? { id, name: id, slug: '' });
  const relationSourceIds = getCanonicalEvidenceRelations().filter((relation) => relation.event_ids.includes(event.id)).map((relation) => relation.evidence_id);
  const directSourceIds = canonicalizeLinkedEvidenceIds([...(event.evidence_ids ?? []), ...allEvidence.filter((source) => source.event_ids?.includes(event.id) || source.event_id === event.id).map((source) => source.id)]);
  const sourceIds = new Set([...relationSourceIds, ...directSourceIds]);
  const evidence = allEvidence.filter((source) => sourceIds.has(resolveEvidenceIdentityId(source.id)));
  const sourceIdentities = getEvidenceSourceIdentities().filter((source) => sourceIds.has(source.id));
  const eventRelations = getCanonicalEvidenceRelations().filter((relation) => relation.event_ids.includes(event.id));
  const publicCopy = eventPublicCopy[event.id];
  const eventTitle = publicCopy?.title ?? event.title;
  const eventDescription = publicCopy?.description ?? event.description ?? 'A description has not yet been added for this event.';
  const taxonomy = resolveEventTaxonomy(event);
  const hasStructuredDetail = detailFamilies.some((field) => event[field] && typeof event[field] === 'object');
  const detailSummary = detailFamilies.map((field) => event[field]?.cause_summary ?? event[field]?.summary).find((value) => typeof value === 'string' && value.length > 0);
  const recoveryDate = event.depeg_detail?.recovery_date ?? event.recovery_date;
  const causeOrMechanism = detailSummary ?? event.failure_mechanism;

  return {
    taxonomy,
    subjectStablecoins,
    subjectOrganizations,
    evidence,
    sourceIdentities,
    eventRelations,
    eventTitle,
    eventDescription,
    hasStructuredDetail,
    detailSummary,
    recoveryDate,
    causeOrMechanism: causeOrMechanism ? cleanPublicText(String(causeOrMechanism)) : null,
    subjectCount: subjectStablecoins.length + subjectOrganizations.length
  };
}
