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
    public_label: 'Not applicable',
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

const exactSignals = new Map([
  ['unknown', 'explicit_unknown'],
  ['unknown_after_review', 'explicit_unknown'],
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
  ['estimated', 'approximate_marker'],
  ['source_review_needed', 'work_queue_placeholder'],
  ['review_needed', 'work_queue_placeholder'],
  ['needs_review', 'work_queue_placeholder']
]);

const signalPatterns = [
  { signal: 'mixed_placeholder', pattern: /(?:not_applicable|unknown|unverified).*(?:review_needed|source_review_needed)|(?:review_needed|source_review_needed).*(?:not_applicable|unknown|unverified)/i },
  { signal: 'work_queue_placeholder', pattern: /(?:source_)?review_needed|needs_(?:source_)?review|pending_review|to_be_reviewed|requires_review/i },
  { signal: 'not_public_marker', pattern: /not_(?:public|publicly_(?:available|disclosed))|non_public|undisclosed|not_disclosed/i },
  { signal: 'not_applicable_marker', pattern: /not_applicable|^n\/?a$/i },
  { signal: 'unverified_marker', pattern: /unverified|not_verified|verification_(?:missing|not_recorded)|verification_unknown/i },
  { signal: 'disputed_marker', pattern: /disputed|contested|conflicting_sources/i },
  { signal: 'approximate_marker', pattern: /approx(?:imate|imately)?|estimated|circa|about_/i },
  { signal: 'explicit_unknown', pattern: /(?:^|_)unknown(?:$|_)|unresolved|unclear|not_known/i },
  { signal: 'not_recorded_marker', pattern: /not_recorded|not_yet_recorded|missing_record/i }
];

export function normalizeSignalText(value) {
  return String(value).trim().toLowerCase().replace(/[\s-]+/g, '_');
}

export function detectRawValueSignal(value) {
  if (value === null) return 'null_value';
  if (value === undefined) return 'undefined_value';
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
