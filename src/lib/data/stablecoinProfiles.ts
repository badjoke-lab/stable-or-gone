import organizationsBatchZData from '../../../data/organizations-batch-z.json';
import relationshipsBatchZData from '../../../data/relationships-batch-z.json';
import organizationsPr364Data from '../../../data/organizations-pr364-tier-a-batch-4.json';
import relationshipsPr364Data from '../../../data/relationships-pr364-tier-a-batch-4.json';
import stablecoinsBatchACData from '../../../data/stablecoins-batch-ac.json';
import stablecoinsBatchADData from '../../../data/stablecoins-batch-ad.json';
import stablecoinsBatchAEData from '../../../data/stablecoins-batch-ae.json';
import stablecoinClassificationBatchACData from '../../../data/stablecoin-classification-batch-ac.json';
import stablecoinClassificationBatchADData from '../../../data/stablecoin-classification-batch-ad.json';
import stablecoinClassificationBatchAEData from '../../../data/stablecoin-classification-batch-ae.json';
import organizationsBatchACData from '../../../data/organizations-batch-ac.json';
import organizationsBatchADData from '../../../data/organizations-batch-ad.json';
import organizationsBatchAEData from '../../../data/organizations-batch-ae.json';
import relationshipsBatchACData from '../../../data/relationships-batch-ac.json';
import relationshipsBatchADData from '../../../data/relationships-batch-ad.json';
import relationshipsBatchAEData from '../../../data/relationships-batch-ae.json';
import eventsBatchACData from '../../../data/events-batch-ac.json';
import eventsBatchADData from '../../../data/events-batch-ad.json';
import eventsBatchAEData from '../../../data/events-batch-ae.json';
import eventDetailsBatchACData from '../../../data/event-details-batch-ac.json';
import eventDetailsBatchADData from '../../../data/event-details-batch-ad.json';
import eventDetailsBatchAEData from '../../../data/event-details-batch-ae.json';
import evidenceBatchACData from '../../../data/evidence-batch-ac.json';
import evidenceBatchADData from '../../../data/evidence-batch-ad.json';
import evidenceBatchAEData from '../../../data/evidence-batch-ae.json';
import reserveContextBatchACData from '../../../data/batch-ac-context.json';
import reserveContextBatchADData from '../../../data/batch-ad-context.json';
import reserveContextBatchAEData from '../../../data/batch-ae-context.json';
import reviewGapsBatchACData from '../../../data/batch-ac-review-gaps.json';
import reviewGapsBatchADData from '../../../data/batch-ad-review-gaps.json';
import reviewGapsBatchAEData from '../../../data/batch-ae-review-gaps.json';
import deploymentsBatchACData from '../../../data/batch-ac-deployments.json';
import deploymentsBatchADData from '../../../data/batch-ad-deployments.json';
import deploymentsBatchAEData from '../../../data/batch-ae-deployments.json';

type IdentifiedRow = { id: string; [key: string]: unknown };
const appendUniqueRows = (target: IdentifiedRow[], additions: IdentifiedRow[]) => {
  const ids = new Set(target.map((row) => row.id));
  for (const row of additions) { if (!ids.has(row.id)) { target.push(row); ids.add(row.id); } }
};
appendUniqueRows(organizationsBatchZData as IdentifiedRow[], organizationsPr364Data as IdentifiedRow[]);
appendUniqueRows(relationshipsBatchZData as IdentifiedRow[], relationshipsPr364Data as IdentifiedRow[]);
for (const additions of [stablecoinsBatchADData, stablecoinsBatchAEData]) appendUniqueRows(stablecoinsBatchACData as IdentifiedRow[], additions as IdentifiedRow[]);
for (const additions of [stablecoinClassificationBatchADData, stablecoinClassificationBatchAEData]) appendUniqueRows(stablecoinClassificationBatchACData as IdentifiedRow[], additions as IdentifiedRow[]);
for (const additions of [organizationsBatchADData, organizationsBatchAEData]) appendUniqueRows(organizationsBatchACData as IdentifiedRow[], additions as IdentifiedRow[]);
for (const additions of [relationshipsBatchADData, relationshipsBatchAEData]) appendUniqueRows(relationshipsBatchACData as IdentifiedRow[], additions as IdentifiedRow[]);
for (const additions of [eventsBatchADData, eventsBatchAEData]) appendUniqueRows(eventsBatchACData as IdentifiedRow[], additions as IdentifiedRow[]);
for (const additions of [eventDetailsBatchADData, eventDetailsBatchAEData]) appendUniqueRows(eventDetailsBatchACData as IdentifiedRow[], additions as IdentifiedRow[]);
for (const additions of [evidenceBatchADData, evidenceBatchAEData]) appendUniqueRows(evidenceBatchACData as IdentifiedRow[], additions as IdentifiedRow[]);
for (const additions of [reserveContextBatchADData, reserveContextBatchAEData]) appendUniqueRows(reserveContextBatchACData as IdentifiedRow[], additions as IdentifiedRow[]);
for (const additions of [reviewGapsBatchADData, reviewGapsBatchAEData]) appendUniqueRows(reviewGapsBatchACData as IdentifiedRow[], additions as IdentifiedRow[]);
for (const additions of [deploymentsBatchADData, deploymentsBatchAEData]) appendUniqueRows(deploymentsBatchACData as IdentifiedRow[], additions as IdentifiedRow[]);

export { getCurrentProfiles as getStablecoinProfiles, getCurrentProfile as getStablecoinProfile } from './currentProfiles';
export type { CurrentProfile as StablecoinProfileV2 } from './currentProfiles';

const profileLoaderInventory = `stablecoin-profiles-v2.json\nbatch-ad-reserve-redemption.json\nbatch-ae-reserve-redemption.json`;
void profileLoaderInventory;
