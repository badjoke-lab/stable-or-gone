import type { OrganizationRole, RelationshipStatus } from '../src/lib/schema/registry-v2';

export type PrimaryDisplayRelationshipLike = {
  id: string;
  stablecoin_id: string;
  organization_id: string;
  role: OrganizationRole;
  status?: RelationshipStatus;
  start_date?: string | null;
  end_date?: string | null;
};

export type PrimaryDisplaySelectionMode =
  | 'explicit_override'
  | 'deterministic_policy'
  | 'ambiguous_requires_override'
  | 'none';

export type PrimaryDisplayRelationshipScore = {
  status: RelationshipStatus;
  status_rank: number;
  role: OrganizationRole;
  role_rank: number;
  current_boundary_rank: number;
  start_date_rank: string;
  end_date_rank: string;
};

export type PrimaryDisplayRelationshipResolution<T extends PrimaryDisplayRelationshipLike = PrimaryDisplayRelationshipLike> = {
  relationship: T | undefined;
  selection_mode: PrimaryDisplaySelectionMode;
  override_id: string | null;
  candidates: T[];
  tied_top_relationship_ids: string[];
  valid: boolean;
};

export const primaryDisplayStatusPriority: RelationshipStatus[];
export const primaryDisplayRolePriority: OrganizationRole[];
export const primaryDisplayRelationshipOverrides: Readonly<Record<string, string>>;
export function getPrimaryDisplayRelationshipScore(relationship: PrimaryDisplayRelationshipLike): PrimaryDisplayRelationshipScore;
export function comparePrimaryDisplayRelationships(a: PrimaryDisplayRelationshipLike, b: PrimaryDisplayRelationshipLike): number;
export function getPrimaryDisplaySemanticKey(relationship: PrimaryDisplayRelationshipLike): string;
export function resolvePrimaryDisplayRelationship<T extends PrimaryDisplayRelationshipLike>(stablecoinId: string, relationships: T[]): PrimaryDisplayRelationshipResolution<T>;
