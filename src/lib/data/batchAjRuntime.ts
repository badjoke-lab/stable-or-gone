import './batchAkV3Runtime';
import stablecoinsBatchACData from '../../../data/stablecoins-batch-ac.json';
import stablecoinClassificationBatchACData from '../../../data/stablecoin-classification-batch-ac.json';
import organizationsBatchACData from '../../../data/organizations-batch-ac.json';
import relationshipsBatchACData from '../../../data/relationships-batch-ac.json';
import eventsBatchACData from '../../../data/events-batch-ac.json';
import eventDetailsBatchACData from '../../../data/event-details-batch-ac.json';
import evidenceBatchACData from '../../../data/evidence-batch-ac.json';
import knownUnknownsBatchACData from '../../../data/batch-ac-review-gaps.json';
import deploymentsBatchACData from '../../../data/batch-ac-deployments.json';
import reserveProfilesBatchACData from '../../../data/batch-ac-reserve-redemption.json';

import stablecoinsBatchAJData from '../../../data/stablecoins-batch-aj.json';
import stablecoinClassificationBatchAJData from '../../../data/stablecoin-classification-batch-aj.json';
import organizationsBatchAJData from '../../../data/organizations-batch-aj.json';
import relationshipsBatchAJData from '../../../data/relationships-batch-aj.json';
import eventsBatchAJData from '../../../data/events-batch-aj.json';
import eventDetailsBatchAJData from '../../../data/event-details-batch-aj.json';
import evidenceBatchAJData from '../../../data/evidence-batch-aj.json';
import knownUnknownsBatchAJData from '../../../data/batch-aj-review-gaps.json';
import deploymentsBatchAJData from '../../../data/batch-aj-deployments.json';
import reserveProfilesBatchAJData from '../../../data/batch-aj-reserve-redemption.json';

import stablecoinsBatchAKData from '../../../data/stablecoins-batch-ak.json';
import stablecoinClassificationBatchAKData from '../../../data/stablecoin-classification-batch-ak.json';
import organizationsBatchAKData from '../../../data/organizations-batch-ak.json';
import relationshipsBatchAKData from '../../../data/relationships-batch-ak.json';
import eventsBatchAKData from '../../../data/events-batch-ak.json';
import eventDetailsBatchAKData from '../../../data/event-details-batch-ak.json';
import evidenceBatchAKData from '../../../data/evidence-batch-ak.json';
import knownUnknownsBatchAKData from '../../../data/batch-ak-review-gaps.json';
import deploymentsBatchAKData from '../../../data/batch-ak-deployments.json';
import reserveProfilesBatchAKData from '../../../data/batch-ak-reserve-redemption.json';

type IdentifiedRow = { id: string; [key: string]: unknown };

const appendUniqueRows = (target: IdentifiedRow[], additions: IdentifiedRow[]) => {
  const ids = new Set(target.map((row) => row.id));
  for (const row of additions) {
    if (ids.has(row.id)) continue;
    target.push(row);
    ids.add(row.id);
  }
};

appendUniqueRows(stablecoinsBatchACData as IdentifiedRow[], stablecoinsBatchAJData as IdentifiedRow[]);
appendUniqueRows(stablecoinClassificationBatchACData as IdentifiedRow[], stablecoinClassificationBatchAJData as IdentifiedRow[]);
appendUniqueRows(organizationsBatchACData as IdentifiedRow[], organizationsBatchAJData as IdentifiedRow[]);
appendUniqueRows(relationshipsBatchACData as IdentifiedRow[], relationshipsBatchAJData as IdentifiedRow[]);
appendUniqueRows(eventsBatchACData as IdentifiedRow[], eventsBatchAJData as IdentifiedRow[]);
appendUniqueRows(eventDetailsBatchACData as IdentifiedRow[], eventDetailsBatchAJData as IdentifiedRow[]);
appendUniqueRows(evidenceBatchACData as IdentifiedRow[], evidenceBatchAJData as IdentifiedRow[]);
appendUniqueRows(knownUnknownsBatchACData as IdentifiedRow[], knownUnknownsBatchAJData as IdentifiedRow[]);
appendUniqueRows(deploymentsBatchACData as IdentifiedRow[], deploymentsBatchAJData as IdentifiedRow[]);
appendUniqueRows(reserveProfilesBatchACData as IdentifiedRow[], reserveProfilesBatchAJData as IdentifiedRow[]);

appendUniqueRows(stablecoinsBatchACData as IdentifiedRow[], stablecoinsBatchAKData as IdentifiedRow[]);
appendUniqueRows(stablecoinClassificationBatchACData as IdentifiedRow[], stablecoinClassificationBatchAKData as IdentifiedRow[]);
appendUniqueRows(organizationsBatchACData as IdentifiedRow[], organizationsBatchAKData as IdentifiedRow[]);
appendUniqueRows(relationshipsBatchACData as IdentifiedRow[], relationshipsBatchAKData as IdentifiedRow[]);
appendUniqueRows(eventsBatchACData as IdentifiedRow[], eventsBatchAKData as IdentifiedRow[]);
appendUniqueRows(eventDetailsBatchACData as IdentifiedRow[], eventDetailsBatchAKData as IdentifiedRow[]);
appendUniqueRows(evidenceBatchACData as IdentifiedRow[], evidenceBatchAKData as IdentifiedRow[]);
appendUniqueRows(knownUnknownsBatchACData as IdentifiedRow[], knownUnknownsBatchAKData as IdentifiedRow[]);
appendUniqueRows(deploymentsBatchACData as IdentifiedRow[], deploymentsBatchAKData as IdentifiedRow[]);
appendUniqueRows(reserveProfilesBatchACData as IdentifiedRow[], reserveProfilesBatchAKData as IdentifiedRow[]);
