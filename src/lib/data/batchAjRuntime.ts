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
import reserveReportsBatchACData from '../../../data/batch-ac-context.json';

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

import stablecoinsBatchALData from '../../../data/stablecoins-batch-al.json';
import stablecoinClassificationBatchALData from '../../../data/stablecoin-classification-batch-al.json';
import organizationsBatchALData from '../../../data/organizations-batch-al.json';
import relationshipsBatchALData from '../../../data/relationships-batch-al.json';
import eventsBatchALData from '../../../data/events-batch-al.json';
import eventDetailsBatchALData from '../../../data/event-details-batch-al.json';
import evidenceBatchALData from '../../../data/evidence-batch-al.json';
import knownUnknownsBatchALData from '../../../data/batch-al-review-gaps.json';
import deploymentsBatchALData from '../../../data/batch-al-deployments.json';
import reserveProfilesBatchALData from '../../../data/batch-al-reserve-redemption.json';

import stablecoinsBatchAMData from '../../../data/stablecoins-batch-am.json';
import stablecoinClassificationBatchAMData from '../../../data/stablecoin-classification-batch-am.json';
import organizationsBatchAMData from '../../../data/organizations-batch-am.json';
import relationshipsBatchAMData from '../../../data/relationships-batch-am.json';
import eventsBatchAMData from '../../../data/events-batch-am.json';
import eventDetailsBatchAMData from '../../../data/event-details-batch-am.json';
import evidenceBatchAMData from '../../../data/evidence-batch-am.json';
import knownUnknownsBatchAMData from '../../../data/batch-am-review-gaps.json';
import deploymentsBatchAMData from '../../../data/batch-am-deployments.json';
import reserveProfilesBatchAMData from '../../../data/batch-am-reserve-redemption.json';

import stablecoinsBatchANData from '../../../data/stablecoins-batch-an.json';
import stablecoinClassificationBatchANData from '../../../data/stablecoin-classification-batch-an.json';
import organizationsBatchANData from '../../../data/organizations-batch-an.json';
import relationshipsBatchANData from '../../../data/relationships-batch-an.json';
import eventsBatchANData from '../../../data/events-batch-an.json';
import eventDetailsBatchANData from '../../../data/event-details-batch-an.json';
import evidenceBatchANData from '../../../data/evidence-batch-an.json';
import knownUnknownsBatchANData from '../../../data/batch-an-review-gaps.json';
import deploymentsBatchANData from '../../../data/batch-an-deployments.json';
import reserveProfilesBatchANData from '../../../data/batch-an-reserve-redemption.json';
import reserveReportsBatchANData from '../../../data/reserve-reports-batch-an.json';

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

appendUniqueRows(stablecoinsBatchACData as IdentifiedRow[], stablecoinsBatchALData as IdentifiedRow[]);
appendUniqueRows(stablecoinClassificationBatchACData as IdentifiedRow[], stablecoinClassificationBatchALData as IdentifiedRow[]);
appendUniqueRows(organizationsBatchACData as IdentifiedRow[], organizationsBatchALData as IdentifiedRow[]);
appendUniqueRows(relationshipsBatchACData as IdentifiedRow[], relationshipsBatchALData as IdentifiedRow[]);
appendUniqueRows(eventsBatchACData as IdentifiedRow[], eventsBatchALData as IdentifiedRow[]);
appendUniqueRows(eventDetailsBatchACData as IdentifiedRow[], eventDetailsBatchALData as IdentifiedRow[]);
appendUniqueRows(evidenceBatchACData as IdentifiedRow[], evidenceBatchALData as IdentifiedRow[]);
appendUniqueRows(knownUnknownsBatchACData as IdentifiedRow[], knownUnknownsBatchALData as IdentifiedRow[]);
appendUniqueRows(deploymentsBatchACData as IdentifiedRow[], deploymentsBatchALData as IdentifiedRow[]);
appendUniqueRows(reserveProfilesBatchACData as IdentifiedRow[], reserveProfilesBatchALData as IdentifiedRow[]);

appendUniqueRows(stablecoinsBatchACData as IdentifiedRow[], stablecoinsBatchAMData as IdentifiedRow[]);
appendUniqueRows(stablecoinClassificationBatchACData as IdentifiedRow[], stablecoinClassificationBatchAMData as IdentifiedRow[]);
appendUniqueRows(organizationsBatchACData as IdentifiedRow[], organizationsBatchAMData as IdentifiedRow[]);
appendUniqueRows(relationshipsBatchACData as IdentifiedRow[], relationshipsBatchAMData as IdentifiedRow[]);
appendUniqueRows(eventsBatchACData as IdentifiedRow[], eventsBatchAMData as IdentifiedRow[]);
appendUniqueRows(eventDetailsBatchACData as IdentifiedRow[], eventDetailsBatchAMData as IdentifiedRow[]);
appendUniqueRows(evidenceBatchACData as IdentifiedRow[], evidenceBatchAMData as IdentifiedRow[]);
appendUniqueRows(knownUnknownsBatchACData as IdentifiedRow[], knownUnknownsBatchAMData as IdentifiedRow[]);
appendUniqueRows(deploymentsBatchACData as IdentifiedRow[], deploymentsBatchAMData as IdentifiedRow[]);
appendUniqueRows(reserveProfilesBatchACData as IdentifiedRow[], reserveProfilesBatchAMData as IdentifiedRow[]);

appendUniqueRows(stablecoinsBatchACData as IdentifiedRow[], stablecoinsBatchANData as IdentifiedRow[]);
appendUniqueRows(stablecoinClassificationBatchACData as IdentifiedRow[], stablecoinClassificationBatchANData as IdentifiedRow[]);
appendUniqueRows(organizationsBatchACData as IdentifiedRow[], organizationsBatchANData as IdentifiedRow[]);
appendUniqueRows(relationshipsBatchACData as IdentifiedRow[], relationshipsBatchANData as IdentifiedRow[]);
appendUniqueRows(eventsBatchACData as IdentifiedRow[], eventsBatchANData as IdentifiedRow[]);
appendUniqueRows(eventDetailsBatchACData as IdentifiedRow[], eventDetailsBatchANData as IdentifiedRow[]);
appendUniqueRows(evidenceBatchACData as IdentifiedRow[], evidenceBatchANData as IdentifiedRow[]);
appendUniqueRows(knownUnknownsBatchACData as IdentifiedRow[], knownUnknownsBatchANData as IdentifiedRow[]);
appendUniqueRows(deploymentsBatchACData as IdentifiedRow[], deploymentsBatchANData as IdentifiedRow[]);
appendUniqueRows(reserveProfilesBatchACData as IdentifiedRow[], reserveProfilesBatchANData as IdentifiedRow[]);
appendUniqueRows(reserveReportsBatchACData as IdentifiedRow[], reserveReportsBatchANData as IdentifiedRow[]);
