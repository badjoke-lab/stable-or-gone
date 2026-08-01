import { generateCurrentHistorySnapshot } from './stats/build-history-snapshot.mjs';

console.log('PR500_CURRENT_HISTORY_SNAPSHOT_START');
console.log(JSON.stringify(generateCurrentHistorySnapshot(), null, 2));
console.log('PR500_CURRENT_HISTORY_SNAPSHOT_END');
throw new Error('Temporary PR #500 snapshot capture gate');
