export const safeLegacyLifecycleMappings = {
  active: 'active',
  failed: 'collapsed',
  impaired: 'restricted',
  limited: 'restricted',
  migrated: 'migrated',
  rebranded: 'rebranded'
};

export const recordSpecificLifecycleMappings = {
  sog_st_busd: {
    legacy_status: 'discontinued',
    lifecycle_status: 'winding_down',
    issuance_status: 'terminated',
    reason: 'New issuance ended while the documented wind-down and redemption transition remained material.'
  },
  sog_st_eurt: {
    legacy_status: 'discontinued',
    lifecycle_status: 'terminated',
    issuance_status: 'terminated',
    reason: 'The reviewed record identifies a completed terminal state rather than an ongoing wind-down.'
  },
  sog_st_fei: {
    legacy_status: 'discontinued',
    lifecycle_status: 'terminated',
    issuance_status: 'terminated',
    reason: 'The protocol-backed asset reached a reviewed terminal state.'
  },
  sog_st_gyen: {
    legacy_status: 'discontinued',
    lifecycle_status: 'winding_down',
    issuance_status: 'terminated',
    reason: 'Issuance ended while the final public terminal boundary remains unresolved.'
  },
  sog_st_husd: {
    legacy_status: 'discontinued',
    lifecycle_status: 'inactive',
    issuance_status: 'terminated',
    reason: 'The asset is no longer operating, but the record does not assert a stronger collapse or completed termination classification.'
  },
  sog_st_mountainusdm: {
    legacy_status: 'discontinued',
    lifecycle_status: 'winding_down',
    issuance_status: 'terminated',
    reason: 'The reviewed record remains in an orderly wind-down and redemption phase.'
  }
};

export const allowedIssuanceByLifecycle = {
  announced: ['unknown', 'restricted'],
  active: ['open', 'protocol_based', 'restricted'],
  restricted: ['restricted', 'unknown'],
  suspended: ['paused', 'restricted', 'unknown'],
  winding_down: ['terminated'],
  inactive: ['terminated'],
  terminated: ['terminated'],
  collapsed: ['terminated'],
  migrated: ['terminated'],
  rebranded: ['terminated'],
  unknown: ['unknown']
};
