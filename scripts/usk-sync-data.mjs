import fs from 'node:fs';

const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));
const writeJson = (path, value) => fs.writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
const requireRow = (rows, id, path) => {
  const row = rows.find((item) => item.id === id);
  if (!row) throw new Error(`${path}: missing ${id}`);
  return row;
};
const ensureAbsent = (rows, id, path) => {
  if (rows.some((item) => item.id === id)) throw new Error(`${path}: duplicate ${id}`);
};

const launchEventId = 'sog_ev_usk_2022_09_launch';
const winddownEventId = 'sog_ev_usk_winddown_2025';
const statusEventId = 'sog_ev_usk_limited_status_batch_g';

const stablecoinPath = 'data/stablecoins-batch-g.json';
const stablecoins = readJson(stablecoinPath);
const usk = requireRow(stablecoins, 'sog_st_usk', stablecoinPath);
usk.status = 'limited';
usk.launch_date = '2022-09-12';
usk.discontinued_date = null;
usk.redemption_status = 'repayment_only_wind_down';
usk.who_can_redeem = 'Existing USK debt positions may be repaid to release collateral while Kujira debt products remain in repayment-only mode. Other holders depend on available market liquidity and supported transition routes.';
usk.retail_redemption = 'repayment_or_market_availability_dependent';
usk.institutional_redemption = 'repayment_or_market_availability_dependent';
usk.redemption_notes = 'Rujira announced an orderly USK wind-down. New USK debt is disabled, existing debt remains repayable, and the final terminal or successor-liability boundary is unresolved.';
usk.summary = 'Kujira overcollateralized USD stablecoin launched on September 12, 2022, now in an orderly repayment-only wind-down during the Rujira transition.';
usk.confidence = 'high';
usk.last_verified_at = '2026-06-25';
usk.notes = 'Canonical launch follows Team Kujira’s same-day September 12, 2022 launch statement. Rujira announced the USK wind-down on 2025-06-30 and stated that USK minting and other debt products were repayment-only. Status remains limited and discontinued_date remains null until a final end boundary is established.';
writeJson(stablecoinPath, stablecoins);

const eventsPath = 'data/events-batch-g.json';
const events = readJson(eventsPath);
ensureAbsent(events, launchEventId, eventsPath);
ensureAbsent(events, winddownEventId, eventsPath);
events.push(
  {
    id: launchEventId,
    stablecoin_id: 'sog_st_usk',
    issuer_id: 'sog_issuer_kujira',
    event_type: 'launch',
    event_date: '2022-09-12',
    title: 'Kujira launches USK and ORCA',
    description: 'Team Kujira announced that USK and the ORCA liquidation system launched publicly on September 12, 2022, enabling users to mint the overcollateralized stablecoin and participate in liquidation markets.',
    impact_level: 'high',
    confidence: 'high',
    source_count: 2,
    event_status_effect: 'active',
    recovered: null,
    recovery_date: null,
    failure_mechanism: 'product_launch',
    notes: 'A September 10 first-party article still described the launch as upcoming, supporting September 12 as the public boundary.'
  },
  {
    id: winddownEventId,
    stablecoin_id: 'sog_st_usk',
    issuer_id: 'sog_issuer_kujira',
    event_type: 'wind_down_announced',
    event_date: '2025-06-30',
    title: 'Rujira announces USK wind-down and repayment-only state',
    description: 'Rujira announced that USK would wind down, interest would increase gradually to encourage debt repayment, and Kujira debt products including USK minting had been set to repayment-only so users could not take on new debt.',
    impact_level: 'high',
    confidence: 'high',
    source_count: 1,
    event_status_effect: 'restricted',
    recovered: null,
    recovery_date: null,
    failure_mechanism: 'orderly_wind_down',
    notes: 'The announcement does not establish a final USK terminal date or a completed token or liability migration.'
  }
);
const statusEvent = requireRow(events, statusEventId, eventsPath);
statusEvent.event_date = '2026-06-25';
statusEvent.title = 'USK remains limited during repayment-only wind-down';
statusEvent.description = 'USK launched in 2022 but is now in an orderly wind-down. First-party Rujira documentation states that new USK debt is disabled while existing positions remain repayable during the Kujira-to-Rujira transition.';
statusEvent.confidence = 'high';
statusEvent.source_count = 4;
statusEvent.notes = 'This is a registry current-state review. USK is not marked discontinued because the final repayment, network, and successor-liability boundaries remain unresolved.';
writeJson(eventsPath, events);

const detailsPath = 'data/event-details-batch-g.json';
const details = readJson(detailsPath);
ensureAbsent(details, launchEventId, detailsPath);
ensureAbsent(details, winddownEventId, detailsPath);
details.push(
  {
    id: launchEventId,
    title: 'Kujira launches USK and ORCA',
    subject_stablecoin_ids: ['sog_st_usk'],
    subject_organization_ids: ['sog_issuer_kujira'],
    evidence_ids: ['sog_src_usk_prelaunch_2022', 'sog_src_usk_launch_2022'],
    event_detail_kind: 'launch',
    launch_detail: {
      summary: 'Team Kujira stated that USK and ORCA launched on 2022-09-12.',
      status: 'limited_currently_winding_down',
      related_organization_ids: ['sog_issuer_kujira']
    }
  },
  {
    id: winddownEventId,
    title: 'Rujira announces USK wind-down and repayment-only state',
    subject_stablecoin_ids: ['sog_st_usk'],
    subject_organization_ids: ['sog_issuer_kujira'],
    evidence_ids: ['sog_src_usk_winddown_2025'],
    event_detail_kind: 'other'
  }
);
const statusDetail = requireRow(details, statusEventId, detailsPath);
statusDetail.title = 'USK remains limited during repayment-only wind-down';
statusDetail.evidence_ids = [
  'sog_src_usk_overview_batch_g',
  'sog_src_usk_technical_batch_g',
  'sog_src_usk_transparency_batch_g',
  'sog_src_usk_winddown_2025'
];
writeJson(detailsPath, details);

const evidencePath = 'data/evidence-batch-n.json';
const evidence = readJson(evidencePath);
const additions = [
  {
    id: 'sog_src_usk_design_2022', stablecoin_id: 'sog_st_usk', issuer_id: 'sog_issuer_kujira', event_id: null,
    source_type: 'official_blog', title: 'Kujira USK stablecoin launch: Kickstarting grown-up DeFi',
    url: 'https://medium.com/team-kujira/kujira-usk-stablecoin-launch-kickstarting-grown-up-defi-26b4372d7aef', publisher: 'Team Kujira', published_at: '2022-08-08',
    archived_url: 'https://web.archive.org/web/*/https://medium.com/team-kujira/kujira-usk-stablecoin-launch-kickstarting-grown-up-defi-26b4372d7aef', accessed_at: '2026-06-25', reliability: 'high',
    claim_scope: 'product_design_and_planned_launch', stablecoin_ids: ['sog_st_usk'], organization_ids: ['sog_issuer_kujira'], event_ids: [],
    claim_scopes: ['announcement', 'minting_design', 'collateral', 'liquidation_design'], notes: 'First-party design and planned-launch article. It predates the canonical public launch.'
  },
  {
    id: 'sog_src_usk_prelaunch_2022', stablecoin_id: 'sog_st_usk', issuer_id: 'sog_issuer_kujira', event_id: launchEventId,
    source_type: 'official_blog', title: 'What to Expect When USK Launches',
    url: 'https://medium.com/team-kujira/what-to-expect-when-usk-launches-42ae87929d2', publisher: 'Team Kujira', published_at: '2022-09-10',
    archived_url: 'https://web.archive.org/web/*/https://medium.com/team-kujira/what-to-expect-when-usk-launches-42ae87929d2', accessed_at: '2026-06-25', reliability: 'high',
    claim_scope: 'explicit_prelaunch_boundary', stablecoin_ids: ['sog_st_usk'], organization_ids: ['sog_issuer_kujira'], event_ids: [launchEventId],
    claim_scopes: ['prelaunch', 'planned_availability', 'initial_collateral'], notes: 'First-party article published two days before launch and explicitly describing launch as upcoming.'
  },
  {
    id: 'sog_src_usk_launch_2022', stablecoin_id: 'sog_st_usk', issuer_id: 'sog_issuer_kujira', event_id: launchEventId,
    source_type: 'official_blog', title: 'Weekly Roundup by Team Kujira — Episode 3',
    url: 'https://medium.com/team-kujira/weekly-roundup-by-team-kujira-ep-3-d9f63dafdf9', publisher: 'Team Kujira', published_at: '2022-09-12',
    archived_url: 'https://web.archive.org/web/*/https://medium.com/team-kujira/weekly-roundup-by-team-kujira-ep-3-d9f63dafdf9', accessed_at: '2026-06-25', reliability: 'high',
    claim_scope: 'same_day_public_launch', stablecoin_ids: ['sog_st_usk'], organization_ids: ['sog_issuer_kujira'], event_ids: [launchEventId],
    claim_scopes: ['launch_date', 'usk_launch', 'orca_launch', 'public_minting'], notes: 'First-party same-day statement that USK and ORCA launched on 2022-09-12.'
  },
  {
    id: 'sog_src_usk_winddown_2025', stablecoin_id: 'sog_st_usk', issuer_id: 'sog_issuer_kujira', event_id: winddownEventId,
    source_type: 'official_statement', title: 'Introduction to the Merge',
    url: 'https://medium.com/rujiranetwork/introduction-to-the-merge-f52a277a3c3c', publisher: 'Rujira', published_at: '2025-06-30',
    archived_url: 'https://web.archive.org/web/*/https://medium.com/rujiranetwork/introduction-to-the-merge-f52a277a3c3c', accessed_at: '2026-06-25', reliability: 'high',
    claim_scope: 'usk_wind_down_and_repayment_only_state', stablecoin_ids: ['sog_st_usk'], organization_ids: ['sog_issuer_kujira'], event_ids: [winddownEventId, statusEventId],
    claim_scopes: ['wind_down', 'interest_increase', 'repayment_only', 'new_debt_disabled', 'network_transition'], notes: 'First-party Rujira statement. It does not establish the final USK terminal date.'
  }
];
for (const row of additions) { ensureAbsent(evidence, row.id, evidencePath); evidence.push(row); }
writeJson(evidencePath, evidence);

const deploymentPath = 'data/deployments-batch-g.json';
const deployments = readJson(deploymentPath);
const uskDeployment = requireRow(deployments, 'sog_dep_usk_kujira_batch_g', deploymentPath);
uskDeployment.status = 'restricted';
uskDeployment.control_event_ids = [winddownEventId, statusEventId];
uskDeployment.notes = 'Native Kujira USK deployment launched on 2022-09-12. New debt and USK minting are disabled during the Rujira transition, while existing positions remain repayable. The final network and terminal boundary is unresolved.';
uskDeployment.evidence_ids = ['sog_src_usk_overview_batch_g', 'sog_src_usk_technical_batch_g', 'sog_src_usk_transparency_batch_g', 'sog_src_usk_launch_2022', 'sog_src_usk_winddown_2025'];
writeJson(deploymentPath, deployments);

const unknownPath = 'data/known-unknowns-batch-g.json';
const unknowns = readJson(unknownPath);
const currentState = requireRow(unknowns, 'sog_ku_usk_current_mint_state_batch_g', unknownPath);
currentState.topic = 'repayment_completion_and_final_terminal_boundary';
currentState.description = 'First-party Rujira documentation establishes that new USK debt is disabled and existing debt is repayment-only. The completion of repayment, final USK terminal date, and any residual liability treatment remain unresolved.';
currentState.severity = 'high';
currentState.last_checked_at = '2026-06-25';
currentState.notes = 'Do not mark USK discontinued while repayment and network access continue.';
const successorState = requireRow(unknowns, 'sog_ku_usk_successor_state_batch_g', unknownPath);
successorState.topic = 'successor_product_and_liability_migration';
successorState.description = 'Rujira lending is presented as the successor borrowing venue, but a completed migration of USK token identity, debt liabilities, or holder claims has not been established.';
successorState.severity = 'high';
successorState.last_checked_at = '2026-06-25';
successorState.notes = 'A successor lending product is not automatically a USK token migration.';
writeJson(unknownPath, unknowns);

const queuePath = 'data/quality/launch-date-unresolved.json';
const queue = readJson(queuePath);
queue.records = queue.records.filter((row) => row.stablecoin_id !== 'sog_st_usk');
queue.expected_total = 21;
queue.category_counts.C = 15;
queue.frozen_at = '2026-06-25';
writeJson(queuePath, queue);
