import {
  getPublicValueStateLabel,
  resolvePublicValueState,
  resolveValueStatePresentation
} from '../../config/value-states.mjs';

export type PublicValueState =
  | 'known'
  | 'unknown_after_review'
  | 'not_recorded'
  | 'not_applicable'
  | 'not_public'
  | 'unverified'
  | 'disputed'
  | 'approximate';

export type ValueStateOptions = {
  policy?: 'default' | 'reviewed_unknown' | 'verification' | 'public_disclosure';
  explicit_state?: PublicValueState | null;
  null_state?: PublicValueState;
  blank_state?: PublicValueState;
  explicit_unknown_state?: PublicValueState;
  work_queue_state?: PublicValueState;
  detect_markers?: boolean;
  display_value?: unknown;
};

export function valueState(value: unknown, options: ValueStateOptions = {}): PublicValueState {
  return resolvePublicValueState(value, options);
}

export function valueStateLabel(state: PublicValueState): string {
  return getPublicValueStateLabel(state);
}

export function valueStatePresentation(value: unknown, options: ValueStateOptions = {}) {
  return resolveValueStatePresentation(value, options);
}

export function valueStateText(value: unknown, options: ValueStateOptions = {}): string {
  return resolveValueStatePresentation(value, options).text;
}
