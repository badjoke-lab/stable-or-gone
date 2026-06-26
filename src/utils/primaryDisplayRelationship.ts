import {
  comparePrimaryDisplayRelationships,
  getPrimaryDisplayRelationshipScore,
  getPrimaryDisplaySemanticKey,
  primaryDisplayRelationshipOverrides,
  resolvePrimaryDisplayRelationship
} from '../../config/primary-display-relationships.mjs';
import type { RelationshipRow } from '../lib/data/registryBase';

export type PrimaryDisplayRelationshipResolution = ReturnType<typeof resolvePrimaryDisplayRelationship<RelationshipRow>>;

export {
  comparePrimaryDisplayRelationships,
  getPrimaryDisplayRelationshipScore,
  getPrimaryDisplaySemanticKey,
  primaryDisplayRelationshipOverrides
};

export function resolvePrimaryRelationshipForStablecoin(
  stablecoinId: string,
  relationships: RelationshipRow[]
): PrimaryDisplayRelationshipResolution {
  return resolvePrimaryDisplayRelationship(stablecoinId, relationships);
}

export function isPrimaryDisplayRelationship(
  stablecoinId: string,
  relationshipId: string,
  relationships: RelationshipRow[]
): boolean {
  return resolvePrimaryRelationshipForStablecoin(stablecoinId, relationships).relationship?.id === relationshipId;
}

export function getPrimaryDisplayRelationshipLabel(isPrimary: boolean): string {
  return isPrimary ? 'Primary display' : 'Additional relationship';
}
