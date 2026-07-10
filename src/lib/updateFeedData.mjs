import { buildUpdateFeed } from '../../scripts/updates/build-update-feed-pr350.mjs';

export function getPublicUpdateFeed() {
  return buildUpdateFeed();
}
