import organizationsBatchZData from '../../../data/organizations-batch-z.json';
import relationshipsBatchZData from '../../../data/relationships-batch-z.json';
import organizationsPr364Data from '../../../data/organizations-pr364-tier-a-batch-4.json';
import relationshipsPr364Data from '../../../data/relationships-pr364-tier-a-batch-4.json';

import stablecoinsBatchACData from '../../../data/stablecoins-batch-ac.json';
import stablecoinsBatchADData from '../../../data/stablecoins-batch-ad.json';
import stablecoinsBatchAEData from '../../../data/stablecoins-batch-ae.json';
import stablecoinsBatchAFData from '../../../data/stablecoins-batch-af.json';
import stablecoinClassificationBatchACData from '../../../data/stablecoin-classification-batch-ac.json';
import stablecoinClassificationBatchADData from '../../../data/stablecoin-classification-batch-ad.json';
import stablecoinClassificationBatchAEData from '../../../data/stablecoin-classification-batch-ae.json';
import stablecoinClassificationBatchAFData from '../../../data/stablecoin-classification-batch-af.json';
import organizationsBatchACData from '../../../data/organizations-batch-ac.json';
import organizationsBatchADData from '../../../data/organizations-batch-ad.json';
import organizationsBatchAEData from '../../../data/organizations-batch-ae.json';
import organizationsBatchAFData from '../../../data/organizations-batch-af.json';
import relationshipsBatchACData from '../../../data/relationships-batch-ac.json';
import relationshipsBatchADData from '../../../data/relationships-batch-ad.json';
import relationshipsBatchAEData from '../../../data/relationships-batch-ae.json';
import relationshipsBatchAFData from '../../../data/relationships-batch-af.json';
import eventsBatchACData from '../../../data/events-batch-ac.json';
import eventsBatchADData from '../../../data/events-batch-ad.json';
import eventsBatchAEData from '../../../data/events-batch-ae.json';
import eventsBatchAFData from '../../../data/events-batch-af.json';
import eventDetailsBatchACData from '../../../data/event-details-batch-ac.json';
import eventDetailsBatchADData from '../../../data/event-details-batch-ad.json';
import eventDetailsBatchAEData from '../../../data/event-details-batch-ae.json';
import eventDetailsBatchAFData from '../../../data/event-details-batch-af.json';
import evidenceBatchACData from '../../../data/evidence-batch-ac.json';
import evidenceBatchADData from '../../../data/evidence-batch-ad.json';
import evidenceBatchAEData from '../../../data/evidence-batch-ae.json';
import evidenceBatchAFData from '../../../data/evidence-batch-af.json';
import reserveContextBatchACData from '../../../data/batch-ac-context.json';
import reserveContextBatchADData from '../../../data/batch-ad-context.json';
import reserveContextBatchAEData from '../../../data/batch-ae-context.json';
import reserveContextBatchAFData from '../../../data/batch-af-context.json';
import reviewGapsBatchACData from '../../../data/batch-ac-review-gaps.json';
import reviewGapsBatchADData from '../../../data/batch-ad-review-gaps.json';
import reviewGapsBatchAEData from '../../../data/batch-ae-review-gaps.json';
import reviewGapsBatchAFData from '../../../data/batch-af-review-gaps.json';
import deploymentsBatchACData from '../../../data/batch-ac-deployments.json';
import deploymentsBatchADData from '../../../data/batch-ad-deployments.json';
import deploymentsBatchAEData from '../../../data/batch-ae-deployments.json';
import deploymentsBatchAFData from '../../../data/batch-af-deployments.json';

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

// The public registry runtime still enumerates batches through AC. Keep that stable
// loader surface while projecting reviewed post-AC growth rows into the final AC arrays.
appendUniqueRows(stablecoinsBatchACData as IdentifiedRow[], stablecoinsBatchADData as IdentifiedRow[]);
appendUniqueRows(stablecoinsBatchACData as IdentifiedRow[], stablecoinsBatchAEData as IdentifiedRow[]);
appendUniqueRows(stablecoinsBatchACData as IdentifiedRow[], stablecoinsBatchAFData as IdentifiedRow[]);
appendUniqueRows(stablecoinClassificationBatchACData as IdentifiedRow[], stablecoinClassificationBatchADData as IdentifiedRow[]);
appendUniqueRows(stablecoinClassificationBatchACData as IdentifiedRow[], stablecoinClassificationBatchAEData as IdentifiedRow[]);
appendUniqueRows(stablecoinClassificationBatchACData as IdentifiedRow[], stablecoinClassificationBatchAFData as IdentifiedRow[]);
appendUniqueRows(organizationsBatchACData as IdentifiedRow[], organizationsBatchADData as IdentifiedRow[]);
appendUniqueRows(organizationsBatchACData as IdentifiedRow[], organizationsBatchAEData as IdentifiedRow[]);
appendUniqueRows(organizationsBatchACData as IdentifiedRow[], organizationsBatchAFData as IdentifiedRow[]);
appendUniqueRows(relationshipsBatchACData as IdentifiedRow[], relationshipsBatchADData as IdentifiedRow[]);
appendUniqueRows(relationshipsBatchACData as IdentifiedRow[], relationshipsBatchAEData as IdentifiedRow[]);
appendUniqueRows(relationshipsBatchACData as IdentifiedRow[], relationshipsBatchAFData as IdentifiedRow[]);
appendUniqueRows(eventsBatchACData as IdentifiedRow[], eventsBatchADData as IdentifiedRow[]);
appendUniqueRows(eventsBatchACData as IdentifiedRow[], eventsBatchAEData as IdentifiedRow[]);
appendUniqueRows(eventsBatchACData as IdentifiedRow[], eventsBatchAFData as IdentifiedRow[]);
appendUniqueRows(eventDetailsBatchACData as IdentifiedRow[], eventDetailsBatchADData as IdentifiedRow[]);
appendUniqueRows(eventDetailsBatchACData as IdentifiedRow[], eventDetailsBatchAEData as IdentifiedRow[]);
appendUniqueRows(eventDetailsBatchACData as IdentifiedRow[], eventDetailsBatchAFData as IdentifiedRow[]);
appendUniqueRows(evidenceBatchACData as IdentifiedRow[], evidenceBatchADData as IdentifiedRow[]);
appendUniqueRows(evidenceBatchACData as IdentifiedRow[], evidenceBatchAEData as IdentifiedRow[]);
appendUniqueRows(evidenceBatchACData as IdentifiedRow[], evidenceBatchAFData as IdentifiedRow[]);
appendUniqueRows(reserveContextBatchACData as IdentifiedRow[], reserveContextBatchADData as IdentifiedRow[]);
appendUniqueRows(reserveContextBatchACData as IdentifiedRow[], reserveContextBatchAEData as IdentifiedRow[]);
appendUniqueRows(reserveContextBatchACData as IdentifiedRow[], reserveContextBatchAFData as IdentifiedRow[]);
appendUniqueRows(reviewGapsBatchACData as IdentifiedRow[], reviewGapsBatchADData as IdentifiedRow[]);
appendUniqueRows(reviewGapsBatchACData as IdentifiedRow[], reviewGapsBatchAEData as IdentifiedRow[]);
appendUniqueRows(reviewGapsBatchACData as IdentifiedRow[], reviewGapsBatchAFData as IdentifiedRow[]);
appendUniqueRows(deploymentsBatchACData as IdentifiedRow[], deploymentsBatchADData as IdentifiedRow[]);
appendUniqueRows(deploymentsBatchACData as IdentifiedRow[], deploymentsBatchAEData as IdentifiedRow[]);
appendUniqueRows(deploymentsBatchACData as IdentifiedRow[], deploymentsBatchAFData as IdentifiedRow[]);

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
batch-ad-reserve-redemption.json
batch-ae-reserve-redemption.json
batch-af-reserve-redemption.json
`;
void profileLoaderInventory;
