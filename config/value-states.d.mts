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

export type PublicValueStateDefinition = {
  value: PublicValueState;
  public_label: string;
  short_definition: string;
  sort_order: number;
};

export const publicValueStates: PublicValueStateDefinition[];
export const publicValueStateValues: PublicValueState[];
export const publicValueStateSet: Set<PublicValueState>;
export function normalizeSignalText(value: unknown): string;
export function detectRawValueSignal(value: unknown): RawValueSignal | null;
export function getPublicValueStateDefinition(value: string | null | undefined): PublicValueStateDefinition | null;
export function getPublicValueStateLabel(value: string | null | undefined): string;
