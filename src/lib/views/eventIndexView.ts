import { eventPublicCopy } from '../../data/eventPublicCopy';
import { getPublicEventCategoryFilterOptions, getRecoveryFilterOptions, resolveEventTaxonomy } from '../../utils/eventTaxonomy';
import { formatPublicLabel } from '../../utils/displayLabels';
import { getEvidence, getEvents, getOrganizations, getStablecoins } from '../data/registry';
import { getCanonicalEvidenceRelations } from '../data/evidenceSources';

const unique = <T>(values: T[]) => [...new Set(values)];
const option = (value: string, publicLabel = formatPublicLabel(value)) => ({ value, publicLabel });

export function buildEventIndexView() {
  const events = getEvents();
  const stablecoins = getStablecoins();
  const organizations = getOrganizations();
  const evidence = getEvidence();
  const evidenceRelations = getCanonicalEvidenceRelations();
  const stablecoinById = new Map(stablecoins.map((coin) => [coin.id, coin] as const));
  const organizationById = new Map(organizations.map((organization) => [organization.id, organization] as const));
  const evidenceById = new Map(evidence.map((source) => [source.id, source] as const));

  const records = events.map((event) => {
    const taxonomy = resolveEventTaxonomy(event);
    const stablecoinIds = unique([...(event.subject_stablecoin_ids ?? []), ...(event.stablecoin_id ? [event.stablecoin_id] : [])]);
    const organizationIds = unique([...(event.subject_organization_ids ?? []), ...(event.issuer_id ? [event.issuer_id] : [])]);
    const stablecoinNames = stablecoinIds.map((id) => stablecoinById.get(id)?.name ?? id);
    const organizationNames = organizationIds.map((id) => organizationById.get(id)?.name ?? id);
    const subjectNames = [...stablecoinNames, ...organizationNames];
    const relationSourceIds = evidenceRelations.filter((relation) => relation.event_ids.includes(event.id)).map((relation) => relation.evidence_id);
    const directSourceIds = evidence.filter((source) => source.event_id === event.id || source.event_ids?.includes(event.id)).map((source) => source.id);
    const sourceIds = unique([...(event.evidence_ids ?? []), ...relationSourceIds, ...directSourceIds]);
    const publishers = unique(sourceIds.map((id) => evidenceById.get(id)?.publisher).filter(Boolean) as string[]);
    const title = eventPublicCopy[event.id]?.title ?? event.title;
    const description = eventPublicCopy[event.id]?.description ?? event.description ?? '';
    const eventDate = event.event_date ?? '';
    return {
      id: event.id,
      title,
      eventDate,
      year: eventDate ? eventDate.slice(0, 4) : 'not_recorded',
      category: taxonomy.public_category,
      categoryLabel: taxonomy.public_category_label,
      subtype: taxonomy.canonical_subtype,
      subtypeLabel: taxonomy.canonical_subtype_label,
      impactLabel: formatPublicLabel(event.impact_level),
      statusEffect: taxonomy.status_effect_category,
      statusEffectLabel: taxonomy.status_effect_label,
      recovery: taxonomy.recovery_category,
      recoveryLabel: taxonomy.recovery_label,
      subjectNames,
      stablecoinIds,
      organizationIds,
      sourceIdentityCount: sourceIds.length,
      confidenceLabel: formatPublicLabel(event.confidence),
      search: [title, description, event.id, ...subjectNames, ...publishers].filter(Boolean).join(' ').normalize('NFKC').toLocaleLowerCase().trim().replace(/\s+/g, ' ')
    };
  }).sort((left, right) => right.eventDate.localeCompare(left.eventDate) || left.title.localeCompare(right.title));

  const filters = [
    { id: 'category', label: 'Category', options: getPublicEventCategoryFilterOptions().map((item) => option(item.value, item.public_label)) },
    { id: 'subtype', label: 'Subtype', options: unique(records.map((record) => record.subtype)).sort().map((value) => option(value, records.find((record) => record.subtype === value)?.subtypeLabel)) },
    { id: 'status_effect', label: 'Status effect', options: unique(records.map((record) => record.statusEffect)).sort().map((value) => option(value, records.find((record) => record.statusEffect === value)?.statusEffectLabel)) },
    { id: 'recovery', label: 'Recovery', options: getRecoveryFilterOptions().map((item) => option(item.value, item.public_label)) },
    { id: 'year', label: 'Year', options: unique(records.map((record) => record.year)).sort().reverse().map((value) => option(value, value === 'not_recorded' ? 'Not recorded' : value)) }
  ];

  return {
    records,
    filters,
    stablecoinSubjectCount: new Set(records.flatMap((record) => record.stablecoinIds)).size,
    organizationSubjectCount: new Set(records.flatMap((record) => record.organizationIds)).size,
    sourceIdentityCount: new Set(evidenceRelations.filter((relation) => relation.event_ids.length > 0).map((relation) => relation.evidence_id)).size
  };
}
