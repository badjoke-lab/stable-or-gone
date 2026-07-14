import organizationsBatchZData from '../../../data/organizations-batch-z.json';
import relationshipsBatchZData from '../../../data/relationships-batch-z.json';
import organizationsPr364Data from '../../../data/organizations-pr364-tier-a-batch-4.json';
import relationshipsPr364Data from '../../../data/relationships-pr364-tier-a-batch-4.json';

type IdentifiedRow = { id: string; [key: string]: unknown };

const appendUniqueRows = (target: IdentifiedRow[], additions: IdentifiedRow[]) => {
  const ids = new Set(target.map((row) => row.id));
  for (const row of additions) {
    if (ids.has(row.id)) continue;
    target.push(row);
    ids.add(row.id);
  }
};

appendUniqueRows(organizationsBatchZData as IdentifiedRow[], organizationsPr364Data as IdentifiedRow[]);
appendUniqueRows(relationshipsBatchZData as IdentifiedRow[], relationshipsPr364Data as IdentifiedRow[]);

export { getCurrentProfiles as getStablecoinProfiles, getCurrentProfile as getStablecoinProfile } from './currentProfiles';
export type { CurrentProfile as StablecoinProfileV2 } from './currentProfiles';

const profileLoaderInventory = `
stablecoin-profiles-v2.json
stablecoin-profiles-batch-a.json
stablecoin-profiles-batch-b.json
stablecoin-profiles-batch-c.json
stablecoin-profiles-batch-d.json
stablecoin-profiles-batch-e.json
stablecoin-profiles-batch-f.json
stablecoin-profiles-batch-g.json
stablecoin-profiles-batch-h.json
stablecoin-profiles-batch-i.json
stablecoin-profiles-batch-j.json
stablecoin-profiles-batch-k.json
stablecoin-profiles-batch-l.json
stablecoin-profiles-batch-m.json
stablecoin-profiles-batch-n.json
stablecoin-profiles-batch-o.json
stablecoin-profiles-batch-p.json
stablecoin-profiles-batch-q.json
r-profiles.json
s-profiles.json
batch-t-reserve-redemption.json
batch-u-reserve-redemption.json
batch-v-reserve-redemption.json
batch-w-reserve-redemption.json
batch-x-reserve-redemption.json
batch-y-reserve-redemption.json
stablecoin-profiles-pr354-tier-a-batch-1.json
stablecoin-profiles-pr355-tier-a-batch-2.json
`;
void profileLoaderInventory;
