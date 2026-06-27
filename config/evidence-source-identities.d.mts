export type EvidenceSourceIdentityGroup = {
  canonical_id: string;
  aliases: readonly string[];
  url: string;
};

export const evidenceSourceIdentityGroups: readonly EvidenceSourceIdentityGroup[];
export const evidenceAliasToCanonicalId: Readonly<Record<string, string>>;
export const evidenceCanonicalIds: ReadonlySet<string>;
export const evidenceAliasIds: ReadonlySet<string>;
export const evidenceSourceIdentityGroupCount: number;
export const evidenceSourceAliasCount: number;
export function resolveEvidenceIdentityId(id: string): string;
export function canonicalizeEvidenceIds(ids?: Array<string | null | undefined>): string[];
