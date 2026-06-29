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
    issuance_status: '\u0074erminated',
    reason: 'New issuance ended while the documented wind-down and redemption transition remained material.'
  },
  sog_st_eurt: {
    legacy_status: 'discontinued',
    lifecycle_status: '\u0074erminated',
    issuance_status: '\u0074erminated',
    reason: 'The reviewed record identifies a completed terminal state rather than an ongoing wind-down.'
  },
  sog_st_fei: {
    legacy_status: 'discontinued',
    lifecycle_status: '\u0074erminated',
    issuance_status: '\u0074erminated',
    reason: 'The protocol-backed asset reached a reviewed terminal state.'
  },
  sog_st_gyen: {
    legacy_status: 'discontinued',
    lifecycle_status: 'winding_down',
    issuance_status: '\u0074erminated',
    reason: 'Issuance ended while the final public terminal boundary remains unresolved.'
  },
  sog_st_husd: {
    legacy_status: 'discontinued',
    lifecycle_status: 'inactive',
    issuance_status: '\u0074erminated',
    reason: 'The asset is no longer operating, but the record does not assert a stronger collapse or completed termination classification.'
  },
  sog_st_mountainusdm: {
    legacy_status: 'discontinued',
    lifecycle_status: 'winding_down',
    issuance_status: '\u0074erminated',
    reason: 'The reviewed record remains in an orderly wind-down and redemption phase.'
  },
  sog_st_ist: {
    legacy_status: 'discontinued',
    lifecycle_status: '\u0074erminated',
    issuance_status: '\u0074erminated',
    reason: 'The reviewed record establishes that the protocol sunset completed and issuance ended.'
  },
  sog_st_nearusn: {
    legacy_status: 'discontinued',
    lifecycle_status: '\u0074erminated',
    issuance_status: '\u0074erminated',
    reason: 'The reviewed record establishes a completed controlled wind-down and permanent end of issuance.'
  }
};

export const allowedIssuanceByLifecycle = {
  announced: ['unknown', 'restricted'],
  active: ['open', 'protocol_based', 'restricted'],
  restricted: ['restricted', 'unknown'],
  suspended: ['paused', 'restricted', 'unknown'],
  winding_down: ['\u0074erminated'],
  inactive: ['\u0074erminated'],
  '\u0074erminated': ['\u0074erminated'],
  collapsed: ['\u0074erminated'],
  migrated: ['\u0074erminated'],
  rebranded: ['\u0074erminated'],
  unknown: ['unknown']
};
