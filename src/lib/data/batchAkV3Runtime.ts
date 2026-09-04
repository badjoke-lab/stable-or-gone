import legalProfilesBatchAJ from '../../../data/aj-legal.json';
import legalProfilesBatchAK from '../../../data/ak-legal.json';
import reserveComponentsBatchAJ from '../../../data/batch-aj-components.json';
import reserveComponentsBatchAK from '../../../data/batch-ak-components.json';

type IdentifiedRow = { id: string; [key: string]: unknown };

const appendUniqueRows = (target: IdentifiedRow[], additions: IdentifiedRow[]) => {
  const ids = new Set(target.map((row) => row.id));
  for (const row of additions) {
    if (ids.has(row.id)) continue;
    target.push(row);
    ids.add(row.id);
  }
};

appendUniqueRows(legalProfilesBatchAJ as IdentifiedRow[], legalProfilesBatchAK as IdentifiedRow[]);
appendUniqueRows(reserveComponentsBatchAJ as IdentifiedRow[], reserveComponentsBatchAK as IdentifiedRow[]);
