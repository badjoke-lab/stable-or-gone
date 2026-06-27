import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { mockManifest } from '../config/visual-system-contract.mjs';
import { renderStablecoinIndexDesktop, renderOrganizationDetail, renderEventDetail } from './ui-mock-renderers-registry.mjs';
import { renderStablecoinDetailDesktop, renderHome } from './ui-mock-renderers-dossier.mjs';
import { renderStablecoinIndexMobile, renderStablecoinDetailMobile, renderOpenFilterState } from './ui-mock-renderers-mobile.mjs';
import { renderEvidenceExpandedState, renderKnownUnknownWarningState } from './ui-mock-renderers-states.mjs';

const root = process.cwd();
const outputDir = path.join(root, 'data/generated/ui-mocks');
const renderers = {
  'stablecoin-index-desktop': renderStablecoinIndexDesktop,
  'stablecoin-detail-desktop': renderStablecoinDetailDesktop,
  'stablecoin-index-mobile': renderStablecoinIndexMobile,
  'stablecoin-detail-mobile': renderStablecoinDetailMobile,
  'organization-detail': renderOrganizationDetail,
  'event-detail': renderEventDetail,
  home: renderHome,
  'open-filter-state': renderOpenFilterState,
  'evidence-expanded-state': renderEvidenceExpandedState,
  'known-unknown-warning-state': renderKnownUnknownWarningState
};

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });
const mocks = [];
for (const mock of mockManifest) {
  const renderer = renderers[mock.id];
  if (!renderer) throw new Error(`Missing mock renderer: ${mock.id}`);
  const [width, height] = mock.viewport;
  const content = renderer(width, height, mock.required_elements);
  const target = path.join(outputDir, mock.file);
  fs.writeFileSync(target, content);
  mocks.push({
    id: mock.id,
    file: mock.file,
    width,
    height,
    record: mock.record,
    required_elements: [...mock.required_elements],
    sha256: createHash('sha256').update(content).digest('hex')
  });
}

const index = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  mock_count: mocks.length,
  mocks
};
fs.writeFileSync(path.join(outputDir, 'mock-index.json'), `${JSON.stringify(index, null, 2)}\n`);
console.log(JSON.stringify({ mocks: mocks.length, output_dir: path.relative(root, outputDir) }, null, 2));
