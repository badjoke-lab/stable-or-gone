import { taxonomyLabel } from './public-taxonomy.mjs';

export const publicEventCategories = [
  { value: 'launch', public_label: 'Launch and introduction', sort_order: 10 },
  { value: 'depeg', public_label: 'Depeg and peg stress', sort_order: 20 },
  { value: 'recovery', public_label: 'Recovery', sort_order: 30 },
  { value: 'failure', public_label: 'Failure and collapse', sort_order: 40 },
  { value: 'reserve', public_label: 'Reserve change', sort_order: 50 },
  { value: 'redemption', public_label: 'Redemption change', sort_order: 60 },
  { value: 'regulatory', public_label: 'Regulatory action', sort_order: 70 },
  { value: 'issuer_control', public_label: 'Issuer control action', sort_order: 80 },
  { value: 'security', public_label: 'Security and chain incident', sort_order: 90 },
  { value: 'migration', public_label: 'Migration and rebrand', sort_order: 100 },
  { value: 'wind_down', public_label: 'Wind-down and termination', sort_order: 110 },
  { value: 'governance', public_label: 'Governance and protocol change', sort_order: 120 },
  { value: 'adoption', public_label: 'Adoption and expansion', sort_order: 130 },
  { value: 'ownership', public_label: 'Ownership change', sort_order: 140 },
  { value: 'lifecycle_review', public_label: 'Lifecycle review', sort_order: 150 },
  { value: 'market_support', public_label: 'Market and liquidity support', sort_order: 160 },
  { value: 'testing', public_label: 'Testing and pre-launch activity', sort_order: 170 },
  { value: 'other', public_label: 'Other material event', sort_order: 180 }
];

const eventTypesByCategory = {
  launch: [
    'announcement', 'launch', 'launched', 'launch_or_issuer_context', 'mainnet_availability_report',
    'protocol_launch_or_lifecycle_context', 'protocol_v2_public_launch', 'restricted_v2_launch_phase'
  ],
  depeg: [
    'depeg', 'major_depeg', 'market_stress_liquidation_event', 'peg_failure',
    'peg_failure_and_protocol_supersession'
  ],
  recovery: ['depeg_recovery_context', 'recovery'],
  failure: ['collapse'],
  reserve: ['reserve_intervention_context', 'reserve_verification_termination'],
  redemption: ['redemption_change'],
  regulatory: ['regulatory', 'regulatory_action', 'regulatory_settlement'],
  issuer_control: ['issuer_freeze'],
  security: [
    'chain_halt_context', 'erroneous_mint_incident', 'exploit', 'production_security_program_start',
    'protocol_exploit', 'security_incident'
  ],
  migration: [
    'issuer_transition', 'migration', 'predecessor_trial_lifecycle', 'protocol_transition',
    'rebrand', 'rebrand_and_classification_change', 'rebrand_or_lifecycle_transition', 'token_migration'
  ],
  wind_down: [
    'exchange_phaseout', 'shutdown_effective', 'wind_down', 'wind_down_and_final_redemption',
    'wind_down_announced'
  ],
  governance: [
    'governance_change_proposed', 'governance_transition', 'protocol_model_update',
    'protocol_upgrade', 'protocol_upgrade_announced'
  ],
  adoption: ['chain_expansion', 'exchange_adoption_context'],
  ownership: ['acquired'],
  lifecycle_review: ['status_review'],
  market_support: ['liquidity_incentive_start'],
  testing: ['testing'],
  other: []
};

export const eventTypeCategoryMap = Object.fromEntries(
  Object.entries(eventTypesByCategory).flatMap(([category, values]) => values.map((value) => [value, category]))
);

export const eventStatusEffectCategories = [
  { value: 'active', public_label: 'Remained active', sort_order: 10 },
  { value: 'restricted', public_label: 'Restricted or impaired', sort_order: 20 },
  { value: 'inactive', public_label: 'Became inactive', sort_order: 30 },
  { value: 'winding_down', public_label: 'Entered wind-down', sort_order: 40 },
  { value: 'terminated', public_label: 'Terminated', sort_order: 50 },
  { value: 'collapsed', public_label: 'Collapsed or failed', sort_order: 60 },
  { value: 'migrated', public_label: 'Migrated', sort_order: 70 },
  { value: 'rebranded', public_label: 'Rebranded', sort_order: 80 },
  { value: 'historical_context', public_label: 'Historical context only', sort_order: 90 },
  { value: 'no_lifecycle_change', public_label: 'No lifecycle change', sort_order: 100 },
  { value: 'unknown', public_label: 'Unknown or unresolved', sort_order: 110 }
];

const statusEffectsByCategory = {
  active: [
    'active', 'active_current_v5', 'active_historical', 'active_v1', 'active_v2',
    'active_version_transition', 'active_with_governance_transition',
    'active_with_security_incident_context'
  ],
  restricted: ['impaired', 'impaired_context', 'limited', 'restricted', 'restricted_v2'],
  inactive: ['inactive'],
  winding_down: ['discontinued'],
  terminated: ['terminated'],
  collapsed: ['collapsed', 'failed', 'failed_context'],
  migrated: ['migrated'],
  rebranded: ['rebranded'],
  historical_context: ['discontinued_context', 'predecessor_closed'],
  no_lifecycle_change: ['none', 'version_transition_context'],
  unknown: ['unknown']
};

export const eventStatusEffectCategoryMap = Object.fromEntries(
  Object.entries(statusEffectsByCategory).flatMap(([category, values]) => values.map((value) => [value, category]))
);

export const recoveryCategories = [
  { value: 'recovered', public_label: 'Recovered', sort_order: 10 },
  { value: 'partially_recovered', public_label: 'Partially recovered', sort_order: 20 },
  { value: 'not_recovered', public_label: 'Not recovered', sort_order: 30 },
  { value: 'collapsed', public_label: 'Collapsed', sort_order: 40 },
  { value: 'not_applicable', public_label: 'Not applicable', sort_order: 50 },
  { value: 'unknown', public_label: 'Unknown or unresolved', sort_order: 60 }
];

export function getPublicEventCategory(eventType) {
  return eventTypeCategoryMap[eventType] ?? 'other';
}

export function getPublicEventCategoryDefinition(value) {
  return publicEventCategories.find((entry) => entry.value === value) ?? publicEventCategories.at(-1);
}

export function getPublicEventCategoryLabel(value) {
  return getPublicEventCategoryDefinition(value)?.public_label ?? 'Other material event';
}

export function getCanonicalEventSubtypeLabel(eventType) {
  return taxonomyLabel('event_type', eventType, null)
    ?? String(eventType ?? 'unknown').replaceAll('_', ' ').replace(/\b\w/g, (character) => character.toUpperCase());
}

export function getEventStatusEffectCategory(value) {
  return eventStatusEffectCategoryMap[value] ?? 'unknown';
}

export function getEventStatusEffectLabel(value) {
  const category = getEventStatusEffectCategory(value);
  return eventStatusEffectCategories.find((entry) => entry.value === category)?.public_label ?? 'Unknown or unresolved';
}

export function getRecoveryCategory(event) {
  const explicit = event?.depeg_detail?.recovery_status;
  if (explicit) return explicit;
  if (event?.recovered === true) return 'recovered';
  if (event?.recovered === false) return 'not_recovered';
  return 'not_applicable';
}

export function getRecoveryCategoryLabel(value) {
  return recoveryCategories.find((entry) => entry.value === value)?.public_label ?? 'Unknown or unresolved';
}
