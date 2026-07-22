type FilterConfig = { id: string; label: string; query_param: string; group: string };
type ExplorerConfig = { initial_result_limit: number; result_limit_increment: number; filters: FilterConfig[]; url_contract: { search_param: string } };
type AxisValue = { value: string; asset_count: number };
type IndexFilter = { axis: string; values: AxisValue[] };
type PublicState = { readiness: { state: string; scored: boolean }; freshness: { state: string; anchor_date: string | null; age_days: number | null; date_semantics: string; inherited_review_anchor: boolean } };
type LegalClassification = { classification: string | null; jurisdiction: string | null; effective_from: string | null; effective_to: string | null; authority_or_basis: string | null; confidence: string | null };
type RegulatoryRecord = { id: string | null; note_type: string | null; note_date: string | null; jurisdiction: string | null; authority_or_source: string | null; summary: string | null };
type MarketAccessRecord = { id: string | null; jurisdiction: { country_code: string | null; subdivision_code: string | null }; platform: { name: string | null; service: string | null }; function: string | null; access_state: string | null; effective_from: string | null; effective_to: string | null; observed_at: string | null; network_scope: unknown; customer_scope: unknown; conditions: unknown[] };
type IndexRow = {
  asset_id: string; slug: string; name: string; symbol: string | null; lifecycle_status: string | null;
  legal: { profile_state: string; classifications: LegalClassification[]; holder_claim_type: string | null; reserve_ownership: string | null; reserve_segregation: string | null; bankruptcy_remoteness: string | null; licensed_or_regulated_as: string[] } & PublicState;
  regulatory: { record_state: string; record_count: number; records: RegulatoryRecord[] } & PublicState;
  market_access: { record_state: string; record_count: number; records: MarketAccessRecord[] } & PublicState;
  filter_tokens: Record<string, string[]>;
};
type AccessRegulationIndex = { asset_count: number; single_composite_score: boolean; risk_ranking: boolean; filters: IndexFilter[]; rows: IndexRow[] };

const foundRoot = document.querySelector('[data-ar-explorer]');
if (foundRoot instanceof HTMLElement) {
  const root = foundRoot;
  const configElement = document.querySelector<HTMLScriptElement>('#ar-explorer-config');
  const indexElement = document.querySelector<HTMLScriptElement>('#ar-index-data');
  const config: ExplorerConfig = configElement?.textContent
    ? JSON.parse(configElement.textContent) as ExplorerConfig
    : { initial_result_limit: 25, result_limit_increment: 25, filters: [], url_contract: { search_param: 'q' } };
  const searchInput = root.querySelector<HTMLInputElement>('[data-ar-search]');
  const clearButton = root.querySelector<HTMLButtonElement>('[data-ar-clear]');
  const emptyClearButton = root.querySelector<HTMLButtonElement>('[data-ar-empty-clear]');
  const copyButton = root.querySelector<HTMLButtonElement>('[data-ar-copy]');
  const retryButton = root.querySelector<HTMLButtonElement>('[data-ar-retry]');
  const copyStatus = root.querySelector<HTMLElement>('[data-ar-copy-status]');
  const activeFilters = root.querySelector<HTMLElement>('[data-ar-active-filters]');
  const alert = root.querySelector<HTMLElement>('[data-ar-alert]');
  const loading = root.querySelector<HTMLElement>('[data-ar-loading]');
  const empty = root.querySelector<HTMLElement>('[data-ar-empty]');
  const results = root.querySelector<HTMLElement>('[data-ar-results]');
  const resultCount = root.querySelector<HTMLElement>('[data-ar-result-count]');
  const resultRange = root.querySelector<HTMLElement>('[data-ar-result-range]');
  const showMoreRow = root.querySelector<HTMLElement>('[data-ar-show-more-row]');
  const showMoreButton = root.querySelector<HTMLButtonElement>('[data-ar-show-more]');
  const selectByFilter = new Map<string, HTMLSelectElement>();
  let index: AccessRegulationIndex | null = null;
  let visibleLimit = config.initial_result_limit;
  let searchTimer: number | null = null;

  const humanize = (value: string | null | undefined) => String(value ?? 'not_recorded').replaceAll('_', ' ').replace(/\b\w/g, (character) => character.toUpperCase());
  const appendText = (parent: HTMLElement, text: string, className?: string) => { const span = document.createElement('span'); if (className) span.className = className; span.textContent = text; parent.append(span); return span; };

  function filterCatalog(axis: string) { return index?.filters.find((filter) => filter.axis === axis)?.values ?? []; }
  function buildFilters() {
    selectByFilter.clear();
    root.querySelectorAll<HTMLElement>('[data-ar-filter-slot]').forEach((slot) => slot.replaceChildren());
    for (const filter of config.filters) {
      const slot = root.querySelector<HTMLElement>(`[data-ar-filter-slot="${filter.group}"]`);
      if (!slot) continue;
      const label = document.createElement('label'); label.className = 'ar-filter-control';
      const text = document.createElement('span'); text.textContent = filter.label;
      const select = document.createElement('select'); select.dataset.arFilterId = filter.id; select.setAttribute('aria-label', filter.label);
      const all = document.createElement('option'); all.value = ''; all.textContent = `All ${filter.label.toLowerCase()}`; select.append(all);
      for (const option of filterCatalog(filter.id)) { const element = document.createElement('option'); element.value = option.value; element.textContent = `${humanize(option.value)} (${option.asset_count})`; select.append(element); }
      if (select.options.length === 1) { select.disabled = true; all.textContent = `${filter.label}: no canonical values`; }
      label.append(text, select); slot.append(label); selectByFilter.set(filter.id, select);
      select.addEventListener('change', () => { visibleLimit = config.initial_result_limit; updateUrl('push'); render(); });
    }
  }

  function restoreStateFromUrl() {
    const params = new URLSearchParams(window.location.search);
    if (searchInput) searchInput.value = params.get(config.url_contract.search_param) ?? '';
    for (const filter of config.filters) {
      const select = selectByFilter.get(filter.id); if (!select) continue;
      const requested = params.get(filter.query_param) ?? '';
      select.value = [...select.options].some((option) => option.value === requested) ? requested : '';
    }
    visibleLimit = config.initial_result_limit;
  }
  function updateUrl(mode: 'push' | 'replace') {
    const params = new URLSearchParams();
    const query = searchInput?.value.trim() ?? ''; if (query) params.set(config.url_contract.search_param, query);
    for (const filter of config.filters) { const value = selectByFilter.get(filter.id)?.value; if (value) params.set(filter.query_param, value); }
    window.history[mode === 'push' ? 'pushState' : 'replaceState']({}, '', `${window.location.pathname}${params.size ? `?${params}` : ''}`);
  }
  function matchingRows() {
    if (!index) return [];
    const query = searchInput?.value.trim().toLocaleLowerCase() ?? '';
    return index.rows.filter((row) => {
      if (query && !`${row.name} ${row.symbol ?? ''} ${row.slug}`.toLocaleLowerCase().includes(query)) return false;
      for (const filter of config.filters) { const selected = selectByFilter.get(filter.id)?.value ?? ''; if (selected && !(row.filter_tokens[filter.id] ?? []).includes(selected)) return false; }
      return true;
    });
  }

  function summaryCell(label: string, value: string, state?: string) {
    const cell = document.createElement('div'); cell.className = 'r8-access-cell'; if (state) cell.dataset.state = state;
    const dt = document.createElement('span'); dt.className = 'r8-access-cell__label'; dt.textContent = label;
    const dd = document.createElement('strong'); dd.textContent = value;
    cell.append(dt, dd); return cell;
  }
  function listOrNone(values: string[]) { return values.length ? values.map(humanize).join(', ') : 'None recorded'; }
  function renderDetails(row: IndexRow) {
    const details = document.createElement('details'); details.className = 'r8-access-details';
    const summary = document.createElement('summary'); summary.textContent = 'View canonical legal, regulatory, and access fields';
    const body = document.createElement('div'); body.className = 'r8-access-details__body';
    const legal = document.createElement('section'); legal.innerHTML = `<h3>Legal profile</h3><dl><div><dt>Profile state</dt><dd>${humanize(row.legal.profile_state)}</dd></div><div><dt>Classifications</dt><dd>${listOrNone(row.legal.classifications.map((item) => [item.classification, item.jurisdiction].filter(Boolean).join(' / ')).filter(Boolean))}</dd></div><div><dt>Holder claim</dt><dd>${humanize(row.legal.holder_claim_type)}</dd></div><div><dt>Licensed or regulated as</dt><dd>${listOrNone(row.legal.licensed_or_regulated_as)}</dd></div></dl>`;
    const regulatory = document.createElement('section');
    const regulatoryTitle = document.createElement('h3'); regulatoryTitle.textContent = `Regulatory Notes (${row.regulatory.record_count})`; regulatory.append(regulatoryTitle);
    if (row.regulatory.records.length) { const ol = document.createElement('ol'); for (const record of row.regulatory.records) { const li = document.createElement('li'); li.textContent = `${humanize(record.note_type)} · ${record.note_date ?? 'date not recorded'} · ${record.jurisdiction ?? 'scope not recorded'}`; ol.append(li); } regulatory.append(ol); } else { const p = document.createElement('p'); p.textContent = 'No canonical Regulatory Note record.'; regulatory.append(p); }
    const access = document.createElement('section');
    const accessTitle = document.createElement('h3'); accessTitle.textContent = `Market Access (${row.market_access.record_count})`; access.append(accessTitle);
    if (row.market_access.records.length) { const ol = document.createElement('ol'); for (const record of row.market_access.records) { const li = document.createElement('li'); li.textContent = `${humanize(record.function)} · ${humanize(record.access_state)} · ${record.jurisdiction.country_code ?? 'scope not recorded'} · ${record.platform.name ?? 'platform not recorded'}`; ol.append(li); } access.append(ol); } else { const p = document.createElement('p'); p.textContent = 'No canonical Market Access record.'; access.append(p); }
    body.append(legal, regulatory, access); details.append(summary, body); return details;
  }
  function renderRow(row: IndexRow) {
    const article = document.createElement('article'); article.className = 'r8-access-row'; article.dataset.assetId = row.asset_id;
    const identity = document.createElement('header'); identity.className = 'r8-access-identity';
    const title = document.createElement('h3'); const link = document.createElement('a'); link.href = `/stablecoin/${row.slug}/`; link.textContent = row.name; title.append(link);
    const symbol = document.createElement('span'); symbol.textContent = row.symbol || 'No symbol'; identity.append(title, symbol);
    const cells = document.createElement('div'); cells.className = 'r8-access-cells';
    cells.append(
      summaryCell('Lifecycle', humanize(row.lifecycle_status), row.lifecycle_status ?? 'unknown'),
      summaryCell('Legal', humanize(row.legal.profile_state), row.legal.profile_state),
      summaryCell('Regulatory', `${row.regulatory.record_count} record${row.regulatory.record_count === 1 ? '' : 's'}`, row.regulatory.record_state),
      summaryCell('Market access', `${row.market_access.record_count} record${row.market_access.record_count === 1 ? '' : 's'}`, row.market_access.record_state)
    );
    article.append(identity, cells, renderDetails(row)); return article;
  }

  function renderActiveFilters(rows: IndexRow[]) {
    if (!activeFilters) return; activeFilters.replaceChildren();
    const query = searchInput?.value.trim() ?? ''; if (query) appendText(activeFilters, `Search: ${query}`, 'ar-active-filter');
    for (const filter of config.filters) { const select = selectByFilter.get(filter.id); if (select?.value) appendText(activeFilters, `${filter.label}: ${humanize(select.value)}`, 'ar-active-filter'); }
    appendText(activeFilters, `${rows.length} of ${index?.asset_count ?? 0} assets match`, 'ar-active-filter-summary');
  }
  function setError(show: boolean) {
    if (alert) alert.hidden = !show;
    if (show) { if (loading) loading.hidden = true; if (empty) empty.hidden = true; if (results) results.hidden = true; }
  }
  function render() {
    if (!index || !results || !empty || !loading) return;
    const matched = matchingRows(); const visible = matched.slice(0, visibleLimit);
    results.replaceChildren(...visible.map(renderRow)); loading.hidden = true; empty.hidden = matched.length !== 0; results.hidden = matched.length === 0;
    if (resultCount) resultCount.textContent = String(matched.length);
    if (resultRange) resultRange.textContent = matched.length ? `showing ${visible.length} of ${matched.length}` : 'showing 0 results';
    if (showMoreRow) showMoreRow.hidden = visible.length >= matched.length || matched.length === 0;
    renderActiveFilters(matched);
  }
  function clearAll() {
    if (searchInput) searchInput.value = ''; for (const select of selectByFilter.values()) select.value = '';
    visibleLimit = config.initial_result_limit; if (copyStatus) copyStatus.textContent = ''; updateUrl('push'); render();
  }
  function loadEmbeddedIndex() {
    try {
      const parsed = indexElement?.textContent ? JSON.parse(indexElement.textContent) as AccessRegulationIndex : null;
      if (!parsed || parsed.asset_count !== parsed.rows.length || parsed.single_composite_score !== false || parsed.risk_ranking !== false) throw new Error('invalid index');
      if (!Array.isArray(parsed.filters) || parsed.rows.some((row) => !row.asset_id || !row.slug || !row.filter_tokens)) throw new Error('incomplete index');
      index = parsed; setError(false); buildFilters(); restoreStateFromUrl(); updateUrl('replace'); render();
    } catch { index = null; setError(true); }
  }

  searchInput?.addEventListener('input', () => { if (searchTimer !== null) window.clearTimeout(searchTimer); searchTimer = window.setTimeout(() => { visibleLimit = config.initial_result_limit; updateUrl('replace'); render(); }, 120); });
  clearButton?.addEventListener('click', clearAll); emptyClearButton?.addEventListener('click', clearAll);
  copyButton?.addEventListener('click', async () => { try { await navigator.clipboard.writeText(window.location.href); if (copyStatus) copyStatus.textContent = 'Filtered view link copied.'; } catch { if (copyStatus) copyStatus.textContent = 'Copy the URL from the address bar.'; } });
  showMoreButton?.addEventListener('click', () => { visibleLimit += config.result_limit_increment; render(); });
  retryButton?.addEventListener('click', loadEmbeddedIndex);
  window.addEventListener('popstate', () => { restoreStateFromUrl(); render(); });
  loadEmbeddedIndex();
}
