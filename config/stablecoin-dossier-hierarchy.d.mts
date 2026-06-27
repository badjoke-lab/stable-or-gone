export type DossierSection = Readonly<{
  id: string;
  label: string;
  local_nav_label: string;
  order: number;
  required: boolean;
  purpose: string;
}>;

export type DossierSyntheticField = Readonly<{
  field_id: string;
  current_surface: string;
  source: string;
  destination_section: string;
  decision: string;
  required: boolean;
  public_label: string;
  value_state: boolean;
}>;

export const dossierSections: readonly DossierSection[];
export const dossierSurfaceFiles: readonly string[];
export const blockSectionAssignments: Readonly<Record<string, string>>;
export const fieldSectionOverrides: Readonly<Record<string, string>>;
export const fieldDecisionOverrides: Readonly<Record<string, string>>;
export const syntheticDossierFields: readonly DossierSyntheticField[];
export const dossierPolicies: Readonly<{
  implementation_deferred: boolean;
  implementation_starts_at_pr: number;
  route_changes_allowed: boolean;
  evidence_section_required: boolean;
  known_unknowns_section_required: boolean;
  corrections_section_required: boolean;
  all_relationships_required: boolean;
  current_and_historical_data_must_remain_distinct: boolean;
  hero_metrics_are_summaries_not_replacement_fields: boolean;
  deployment_axes_must_remain_separate: readonly string[];
  evidence_axes_must_remain_separate: readonly string[];
}>;
