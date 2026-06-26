export type PublicValueState =
  | 'known'
  | 'unknown_after_review'
  | 'not_recorded'
  | 'not_applicable'
  | 'not_public'
  | 'unverified'
  | 'disputed'
  | 'approximate';

export type RawValueSignal =
  | 'null_value'
  | 'undefined_value'
  | 'blank_string'
  | 'explicit_unknown'
  | 'not_recorded_marker'
  | 'not_applicable_marker'
  | 'not_public_marker'
  | 'unverified_marker'
  | 'disputed_marker'
  | 'approximate_marker'
  | 'work_queue_placeholder'
  | 'mixed_placeholder';

export type ValueStatePolicyName = 'default' | 'reviewed_unknown' | 'verification' | 'public_disclosure';

export type PublicValueStateDefinition = {
  value: PublicValueState;
  public_label: string;
  short_definition: string;
  sort_order: number;
};

export type ValueStatePolicy = {
  null_state: PublicValueState;
  blank_state: PublicValueState;
  explicit_unknown_state: PublicValueState;
  work_queue_state: PublicValueState;
};

export type ValueStateResolveOptions = {
  policy?: ValueStatePolicyName;
  explicit_state?: PublicValueState | null;
  null_state?: PublicValueState;
  blank_state?: PublicValueState;
  explicit_unknown_state?: PublicValueState;
  work_queue_state?: PublicValueState;
  detect_markers?: boolean;
  display_value?: unknown;
};

export type ValueStatePresentation = {
  state: PublicValueState;
  label: string;
  text: string;
  has_value: boolean;
  raw_signal: RawValueSignal | null;
};

export const publicValueStates: PublicValueStateDefinition[];
export const publicValueStateValues: PublicValueState[];
export const publicValueStateSet: Set<PublicValueState>;
export const valueStatePolicies: Record<ValueStatePolicyName, ValueStatePolicy>;
export function normalizeSignalText(value: unknown): string;
export function detectRawValueSignal(value: unknown): RawValueSignal | null;
export function getPublicValueStateDefinition(value: string | null | undefined): PublicValueStateDefinition | null;
export function getPublicValueStateLabel(value: string | null | undefined): string;
export function resolvePublicValueState(value: unknown, options?: ValueStateResolveOptions): PublicValueState;
export function resolveValueStatePresentation(value: unknown, options?: ValueStateResolveOptions): ValueStatePresentation;
