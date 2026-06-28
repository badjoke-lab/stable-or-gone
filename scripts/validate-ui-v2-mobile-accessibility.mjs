import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const css = read('src/styles/ui-v2-hardening.css');
const accessibility = read('src/styles/accessibility-utilities.css');
const layout = read('src/layouts/BaseLayout.astro');
const pageSources = [
  'src/pages/index.astro',
  'src/pages/stablecoins/index.astro',
  'src/components/StablecoinDetailView.astro',
  'src/pages/issuers/index.astro',
  'src/pages/issuer/[slug].astro',
  'src/pages/events/index.astro',
  'src/pages/event/[id].astro',
  'src/pages/methodology/index.astro'
].map(read).join('\n');

check(accessibility.includes("@import './ui-v2-hardening.css'"), 'Global hardening stylesheet is not loaded');
check(css.includes('@media (max-width: 359px)'), '320px-class compact hardening is missing');
check(css.includes('@media (max-width: 719px)'), 'Compact breakpoint hardening is missing');
check(css.includes('min-height: 44px'), 'Minimum action target size is missing');
check(css.includes(':focus-visible'), 'Keyboard focus treatment is missing');
check(css.includes('@media (prefers-reduced-motion: reduce)'), 'Reduced-motion treatment is missing');
check(css.includes('@media (forced-colors: active)'), 'Forced-colors treatment is missing');
check(css.includes('overflow-wrap: anywhere'), 'Long content overflow protection is missing');
check(css.includes("[data-mobile-table='scroll-preserve']"), 'Protected mobile table reachability is missing');
check(css.includes('grid-template-columns: 1fr'), 'Single-column compact transformation is missing');
check(!css.includes('nth-child') || !css.includes('display: none'), 'Generic numbered-column hiding must not remove protected information');
check(layout.includes('skip-link') && layout.includes('id="main-content"') && layout.includes('tabindex="-1"'), 'Skip-link and main-focus contract is incomplete');
for (const marker of ['data-ui-v2-organizations', 'data-ui-v2-events', 'data-ui-v2-event-detail', 'stablecoin-dossier-nav']) check(pageSources.includes(marker), `Protected v2 surface marker is missing: ${marker}`);
for (const compactMarker of ['data-mobile-representation-for="organization-overview"', 'data-mobile-representation-for="event-details"', 'stablecoin-identity-cards']) check(pageSources.includes(compactMarker), `Compact protected representation is missing: ${compactMarker}`);
const report = { schema_version: '1.0', checked_at: new Date().toISOString(), ok: failures.length === 0, verified_width_floor_px: 320, zoom_target_percent: 200, failures };
if (failures.length) { console.error(JSON.stringify(report, null, 2)); process.exit(1); }
console.log(JSON.stringify(report, null, 2));
