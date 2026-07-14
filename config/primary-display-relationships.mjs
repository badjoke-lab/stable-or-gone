export const primaryDisplayStatusPriority = [
  'active',
  'planned',
  'unknown',
  'ended'
];

export const primaryDisplayRolePriority = [
  'legal_issuer',
  'protocol_operator',
  'brand_owner',
  'governance_body',
  'reserve_manager',
  'redemption_agent',
  'custodian',
  'technology_provider',
  'other'
];

// Overrides are allowed only when two or more relationships remain tied after
// status, role, and temporal-boundary comparison. Keys are stablecoin IDs and
// values are canonical relationship IDs.
export const primaryDisplayRelationshipOverrides = Object.freeze({
  sog_st_usdg: 'sog_rel_usdg_paxos_digital_singapore_pr364'
});

const normalizeStatus = (value) => primaryDisplayStatusPriority.includes(value) ? value : 'unknown';
const normalizeRole = (value) => primaryDisplayRolePriority.includes(value) ? value : 'other';
const dateValue = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : '';

export function getPrimaryDisplayRelationshipScore(relationship) {
  const status = normalizeStatus(relationship?.status);
  const role = normalizeRole(relationship?.role);
  const startDate = dateValue(relationship?.start_date);
  const endDate = dateValue(relationship?.end_date);

  return {
    status,
    status_rank: primaryDisplayStatusPriority.indexOf(status),
    role,
    role_rank: primaryDisplayRolePriority.indexOf(role),
    current_boundary_rank: status === 'ended' || endDate ? 1 : 0,
    start_date_rank: startDate || '0000-00-00',
    end_date_rank: endDate || '9999-12-31'
  };
}

export function comparePrimaryDisplayRelationships(a, b) {
  const left = getPrimaryDisplayRelationshipScore(a);
  const right = getPrimaryDisplayRelationshipScore(b);

  if (left.status_rank !== right.status_rank) return left.status_rank - right.status_rank;
  if (left.role_rank !== right.role_rank) return left.role_rank - right.role_rank;
  if (left.current_boundary_rank !== right.current_boundary_rank) return left.current_boundary_rank - right.current_boundary_rank;

  // Within the same semantic tier, prefer the most recently started current
  // relationship or the most recently ended historical relationship.
  if (left.start_date_rank !== right.start_date_rank) return right.start_date_rank.localeCompare(left.start_date_rank);
  if (left.end_date_rank !== right.end_date_rank) return right.end_date_rank.localeCompare(left.end_date_rank);

  return String(a?.id ?? '').localeCompare(String(b?.id ?? ''));
}

export function getPrimaryDisplaySemanticKey(relationship) {
  const score = getPrimaryDisplayRelationshipScore(relationship);
  return [
    score.status_rank,
    score.role_rank,
    score.current_boundary_rank,
    score.start_date_rank,
    score.end_date_rank
  ].join(':');
}

export function resolvePrimaryDisplayRelationship(stablecoinId, relationships) {
  const candidates = relationships
    .filter((relationship) => relationship.stablecoin_id === stablecoinId)
    .slice()
    .sort(comparePrimaryDisplayRelationships);

  const overrideId = primaryDisplayRelationshipOverrides[stablecoinId];
  if (overrideId) {
    const override = candidates.find((relationship) => relationship.id === overrideId);
    return {
      relationship: override,
      selection_mode: 'explicit_override',
      override_id: overrideId,
      candidates,
      tied_top_relationship_ids: override ? [] : candidates.map((relationship) => relationship.id),
      valid: Boolean(override)
    };
  }

  const first = candidates[0];
  if (!first) {
    return {
      relationship: undefined,
      selection_mode: 'none',
      override_id: null,
      candidates,
      tied_top_relationship_ids: [],
      valid: false
    };
  }

  const topKey = getPrimaryDisplaySemanticKey(first);
  const tiedTop = candidates.filter((relationship) => getPrimaryDisplaySemanticKey(relationship) === topKey);

  return {
    relationship: first,
    selection_mode: tiedTop.length === 1 ? 'deterministic_policy' : 'ambiguous_requires_override',
    override_id: null,
    candidates,
    tied_top_relationship_ids: tiedTop.map((relationship) => relationship.id),
    valid: tiedTop.length === 1
  };
}
