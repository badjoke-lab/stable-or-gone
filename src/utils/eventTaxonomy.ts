import {
  getCanonicalEventSubtypeLabel,
  getEventStatusEffectCategory,
  getEventStatusEffectLabel,
  getPublicEventCategory,
  getPublicEventCategoryLabel,
  getRecoveryCategory,
  getRecoveryCategoryLabel,
  publicEventCategories,
  recoveryCategories
} from '../../config/event-taxonomy.mjs';
import { formatTaxonomyLabel } from './publicTaxonomy';

export type EventTaxonomyRecord = {
  event_type?: string | null;
  event_detail_kind?: string | null;
  event_status_effect?: string | null;
  recovered?: boolean | null;
  depeg_detail?: {
    recovery_status?: string | null;
  } | null;
};

export function resolveEventTaxonomy(event: EventTaxonomyRecord) {
  const publicCategory = getPublicEventCategory(event.event_type);
  const statusEffectCategory = getEventStatusEffectCategory(event.event_status_effect);
  const recoveryCategory = getRecoveryCategory(event);

  return {
    public_category: publicCategory,
    public_category_label: getPublicEventCategoryLabel(publicCategory),
    canonical_subtype: event.event_type ?? 'unknown',
    canonical_subtype_label: getCanonicalEventSubtypeLabel(event.event_type),
    detail_kind: event.event_detail_kind ?? 'other',
    detail_kind_label: formatTaxonomyLabel('event_detail_kind', event.event_detail_kind, 'Other detail'),
    status_effect_category: statusEffectCategory,
    status_effect_label: getEventStatusEffectLabel(event.event_status_effect),
    canonical_status_effect: event.event_status_effect ?? 'unknown',
    recovery_category: recoveryCategory,
    recovery_label: getRecoveryCategoryLabel(recoveryCategory)
  };
}

export function getPublicEventCategoryFilterOptions() {
  return [...publicEventCategories].sort((a, b) => a.sort_order - b.sort_order);
}

export function getRecoveryFilterOptions() {
  return [...recoveryCategories].sort((a, b) => a.sort_order - b.sort_order);
}
