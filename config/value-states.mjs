export const publicValueStates = [
  {
    value: 'known',
    public_label: 'Known',
    short_definition: 'A reviewed value is present and may be shown directly.',
    sort_order: 10
  },
  {
    value: 'unknown_after_review',
    public_label: 'Unknown after review',
    short_definition: 'The field was reviewed, but a supported value could not be established.',
    sort_order: 20
  },
  {
    value: 'not_recorded',
    public_label: 'Not yet recorded',
    short_definition: 'No reviewed value has been recorded for this field.',
    sort_order: 30
  },
  {
    value: 'not_applicable',
    public_label: 'Not Applicable',
    short_definition: 'The field does not apply to this record or context.',
    sort_order: 40
  },
  {
    value: 'not_public',
    public_label: 'Not publicly disclosed',
    short_definition: 'The relevant information is not publicly disclosed or publicly available.',
    sort_order: 50
  },
  {
    value: 'unverified',
    public_label: 'Not yet verified',
    short_definition: 'A candidate value exists, but SOG has not verified it.',
    sort_order: 60
  },
  {
    value: 'disputed',
    public_label: 'Disputed',
    short_definition: 'Reliable sources or reviewed claims conflict materially.',
    sort_order: 70
  },
  {
    value: 'approximate',
    public_label: 'Approximate',
    short_definition: 'The displayed value is explicitly approximate rather than exact.',
    sort_order: 80
  }
];

export const publicValueStateValues = publicValueStates.map((entry) => entry.value);
export const publicValueStateSet = new Set(publicValueStateValues);

export const valueStatePolicies = {
  default: {
    null_state: 'not_recorded',
    blank_state: 'not_recorded',
    explicit_unknown_state: 'unknown_after_review',
    work_queue_state: 'not_recorded'
  },
  reviewed_unknown: {
    null_state: 'unknown_after_review',
    blank_state: 'unknown_after_review',
    explicit_unknown_state: 'unknown_after_review',
    work_queue_state: 'unknown_after_review'
  },
  verification: {
    null_state: 'unverified',
    blank_state: 'unverified',
    explicit_unknown_state: 'unverified',
    work_queue_state: 'unverified'
  },
  public_disclosure: {
    null_state: 'not_recorded',
    blank_state: 'not_recorded',
    explicit_unknown_state: 'unknown_after_review',
    work_queue_state: 'not_recorded'
  }
};

const exactSignals = new Map([
  ['unknown', 'explicit_unknown'],
  ['unknown_after_review', 'explicit_unknown'],
  ['unknown_or_unavailable', 'explicit_unknown'],
  ['not_recorded', 'not_recorded_marker'],
  ['not_yet_recorded', 'not_recorded_marker'],
  ['not_applicable', 'not_applicable_marker'],
  ['n/a', 'not_applicable_marker'],
  ['na', 'not_applicable_marker'],
  ['not_public', 'not_public_marker'],
  ['not_publicly_disclosed', 'not_public_marker'],
  ['not_publicly_available', 'not_public_marker'],
  ['not_disclosed', 'not_public_marker'],
  ['unverified', 'unverified_marker'],
  ['not_verified', 'unverified_marker'],
  ['disputed', 'disputed_marker'],
  ['contested', 'disputed_marker'],
  ['approximate', 'approximate_marker'],
  ['approximately', 'approximate_marker'],
  ['estimated', 'approximate_marker'],
  ['source_review_needed', 'work_queue_placeholder'],
  ['review_needed', 'work_queue_placeholder'],
  ['needs_review', 'work_queue_placeholder']
]);

const token = (expression) => new RegExp(`(?:^|_)(?:${expression})(?:_|$)`, 'i');
const signalPatterns = [
  { signal: 'mixed_placeholder', pattern: /(?:not_applicable|unknown|unverified).*(?:review_needed|source_review_needed)|(?:review_needed|source_review_needed).*(?:not_applicable|unknown|unverified)/i },
  { signal: 'work_queue_placeholder', pattern: /(?:^|_)(?:(?:source_)?review_needed|needs_(?:source_)?review|pending_review|to_be_reviewed|requires_review)(?:_|$)/i },
  { signal: 'not_public_marker', pattern: token('not_public|not_publicly_available|not_publicly_disclosed|non_public|undisclosed|not_disclosed') },
  { signal: 'not_applicable_marker', pattern: token('not_applicable|n/?a') },
  { signal: 'unverified_marker', pattern: token('unverified|not_verified|verification_missing|verification_not_recorded|verification_unknown') },
  { signal: 'disputed_marker', pattern: token('disputed|contested|conflicting_sources') },
  { signal: 'approximate_marker', pattern: token('approximate|approximately|estimated|circa') },
  { signal: 'explicit_unknown', pattern: token('unknown|unresolved|unclear|not_known') },
  { signal: 'not_recorded_marker', pattern: token('not_recorded|not_yet_recorded|missing_record') }
];

export function normalizeSignalText(value) {
  return String(value).trim().toLowerCase().replace(/[\s-]+/g, '_');
}

export function detectRawValueSignal(value) {
  if (value === null) return 'null_value';
  if (value === undefined) return 'undefined_value';
  if (Array.isArray(value) && value.length === 0) return 'null_value';
  if (typeof value !== 'string') return null;

  const trimmed = value.trim();
  if (trimmed.length === 0) return 'blank_string';

  const normalized = normalizeSignalText(trimmed);
  const exact = exactSignals.get(normalized);
  if (exact) return exact;

  for (const entry of signalPatterns) {
    if (entry.pattern.test(normalized)) return entry.signal;
  }
  return null;
}

export function getPublicValueStateDefinition(value) {
  return publicValueStates.find((entry) => entry.value === value) ?? null;
}

export function getPublicValueStateLabel(value) {
  return getPublicValueStateDefinition(value)?.public_label ?? 'Value state not classified';
}

export function resolvePublicValueState(value, options = {}) {
  const explicitState = options.explicit_state;
  if (explicitState && publicValueStateSet.has(explicitState)) return explicitState;

  const policy = valueStatePolicies[options.policy] ?? valueStatePolicies.default;
  const signal = options.detect_markers === false ? null : detectRawValueSignal(value);

  if (signal === 'null_value' || signal === 'undefined_value') return options.null_state ?? policy.null_state;
  if (signal === 'blank_string') return options.blank_state ?? policy.blank_state;
  if (signal === 'explicit_unknown') return options.explicit_unknown_state ?? policy.explicit_unknown_state;
  if (signal === 'not_recorded_marker') return 'not_recorded';
  if (signal === 'not_applicable_marker') return 'not_applicable';
  if (signal === 'not_public_marker') return 'not_public';
  if (signal === 'unverified_marker') return 'unverified';
  if (signal === 'disputed_marker') return 'disputed';
  if (signal === 'approximate_marker') return 'approximate';
  if (signal === 'work_queue_placeholder' || signal === 'mixed_placeholder') return options.work_queue_state ?? policy.work_queue_state;
  return 'known';
}

export function resolveValueStatePresentation(value, options = {}) {
  const state = resolvePublicValueState(value, options);
  const label = getPublicValueStateLabel(state);
  const providedDisplay = options.display_value;
  const displayValue = providedDisplay !== null && providedDisplay !== undefined
    ? String(providedDisplay)
    : Array.isArray(value)
      ? value.map((item) => String(item)).join(', ')
      : value === null || value === undefined
        ? ''
        : String(value);
  const hasValue = state === 'known' || (state === 'approximate' && displayValue.length > 0);
  const text = state === 'known'
    ? displayValue
    : state === 'approximate' && displayValue.length > 0
      ? `${displayValue} (${label.toLowerCase()})`
      : label;

  return {
    state,
    label,
    text,
    has_value: hasValue,
    raw_signal: options.detect_markers === false ? null : detectRawValueSignal(value)
  };
}
