export const eventTypeLabels: Record<string, string> = {
  major_depeg: 'Major depeg',
  collapse: 'Collapse',
  wind_down_announced: 'Wind-down announced',
  regulatory_action: 'Regulatory action',
  regulatory_settlement: 'Regulatory settlement',
  depeg_recovery_context: 'Depeg recovery',
  protocol_transition: 'Protocol transition',
  market_stress_liquidation_event: 'Market stress and liquidations',
  rebrand_or_lifecycle_transition: 'Rebrand and transition',
  reserve_intervention_context: 'Reserve intervention',
  chain_halt_context: 'Blockchain halt',
  exchange_phaseout: 'Exchange phase-out',
  launch_or_issuer_context: 'Product launch',
  exchange_adoption_context: 'Exchange adoption',
  launch: 'Launch',
  chain_expansion: 'Blockchain expansion',
  protocol_launch_or_lifecycle_context: 'Protocol launch or transition',
  protocol_lifecycle_context: 'Protocol history'
};

export function getEventTypeLabel(value?: string | null): string {
  const key = String(value ?? '').trim();
  if (!key) return '—';
  return eventTypeLabels[key] ?? key.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}
