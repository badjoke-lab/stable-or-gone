const root = document.querySelector('[data-stablecoin-index]');

if (root instanceof HTMLElement) {
  const search = root.querySelector('[data-index-search]');
  const sort = root.querySelector('[data-index-sort]');
  const tableBody = root.querySelector('[data-registry-body]');
  const cardBody = root.querySelector('[data-card-body]');
  const rows = Array.from(root.querySelectorAll<HTMLElement>('[data-registry-row]'));
  const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-registry-card]'));
  const filters = Array.from(root.querySelectorAll<HTMLInputElement>('[data-filter-group]'));
  const resultCount = root.querySelector('[data-result-count]');
  const activeSummary = root.querySelector('[data-active-filters]');
  const noResults = root.querySelector('[data-no-results]');
  const clearAll = Array.from(root.querySelectorAll<HTMLElement>('[data-clear-all]'));
  const compareInputs = Array.from(root.querySelectorAll<HTMLInputElement>('[data-compare-select]'));
  const comparePanel = root.querySelector<HTMLElement>('[data-comparison-panel]');
  const compareGrid = root.querySelector<HTMLElement>('[data-comparison-grid]');
  const compareStatus = root.querySelector<HTMLElement>('[data-comparison-status]');
  const compareAlert = root.querySelector<HTMLElement>('[data-comparison-alert]');
  const compareSources = new Map(Array.from(root.querySelectorAll<HTMLElement>('[data-comparison-source]')).map((source) => [source.dataset.recordSlug ?? '', source]));
  const groups = ['lifecycle', 'issuance', 'asset_class', 'reference', 'backing', 'stabilization'] as const;
  const parameterOrder = ['q', ...groups, 'sort', 'compare'];
  const defaultSort = 'name_asc';
  const validSorts = new Set(['name_asc', 'name_desc', 'lifecycle_then_name', 'launch_oldest', 'launch_newest', 'evidence_most']);
  let selectedComparisons = new Set<string>();

  const normalize = (value: unknown) => String(value ?? '').normalize('NFKC').toLocaleLowerCase().trim().replace(/\s+/g, ' ');
  const inputValue = () => search instanceof HTMLInputElement ? search.value : '';
  const sortValue = () => sort instanceof HTMLSelectElement && validSorts.has(sort.value) ? sort.value : defaultSort;
  const allowedFor = (group: string) => new Set(filters.filter((input) => input.dataset.filterGroup === group).map((input) => input.value));
  const selectedFor = (group: string) => filters.filter((input) => input.dataset.filterGroup === group && input.checked).map((input) => input.value);
  const labelFor = (group: string, value: string) => filters.find((input) => input.dataset.filterGroup === group && input.value === value)?.dataset.label ?? value;
  const knownSlugs = new Set(compareSources.keys());

  function stateFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const selected = Object.fromEntries(groups.map((group) => {
      const allowed = allowedFor(group);
      const values = (params.get(group) ?? '').split(',').filter((value) => allowed.has(value));
      return [group, [...new Set(values)]];
    })) as Record<(typeof groups)[number], string[]>;
    const compare = (params.get('compare') ?? '').split(',').filter((slug) => knownSlugs.has(slug)).slice(0, 4);
    return {
      q: params.get('q') ?? '',
      filters: selected,
      sort: validSorts.has(params.get('sort') ?? '') ? String(params.get('sort')) : defaultSort,
      compare: [...new Set(compare)]
    };
  }

  function applyState(state: ReturnType<typeof stateFromUrl>) {
    if (search instanceof HTMLInputElement) search.value = state.q;
    if (sort instanceof HTMLSelectElement) sort.value = state.sort;
    for (const input of filters) input.checked = state.filters[input.dataset.filterGroup as (typeof groups)[number]]?.includes(input.value) ?? false;
    selectedComparisons = new Set(state.compare);
    syncComparisonInputs();
  }

  function writeUrl(mode: 'push' | 'replace') {
    const params = new URLSearchParams();
    const query = inputValue().trim();
    if (query) params.set('q', query);
    for (const group of groups) {
      const values = selectedFor(group);
      if (values.length) params.set(group, values.join(','));
    }
    const order = sortValue();
    if (order !== defaultSort) params.set('sort', order);
    if (selectedComparisons.size) params.set('compare', [...selectedComparisons].join(','));
    const ordered = new URLSearchParams();
    for (const key of parameterOrder) if (params.has(key)) ordered.set(key, params.get(key) ?? '');
    const next = `${window.location.pathname}${ordered.size ? `?${ordered.toString()}` : ''}${window.location.hash}`;
    window.history[mode === 'push' ? 'pushState' : 'replaceState']({}, '', next);
  }

  function matches(element: HTMLElement) {
    const query = normalize(inputValue());
    if (query && !normalize(element.dataset.search).includes(query)) return false;
    for (const group of groups) {
      const selected = selectedFor(group);
      if (selected.length && !selected.includes(element.dataset[group.replace('_', '') as keyof DOMStringMap] ?? element.getAttribute(`data-${group.replace('_', '-')}`) ?? '')) return false;
    }
    return true;
  }

  function compareElements(left: HTMLElement, right: HTMLElement) {
    const mode = sortValue();
    const name = () => String(left.dataset.name ?? '').localeCompare(String(right.dataset.name ?? ''));
    if (mode === 'name_desc') return -name();
    if (mode === 'lifecycle_then_name') return String(left.dataset.lifecycle ?? '').localeCompare(String(right.dataset.lifecycle ?? '')) || name();
    if (mode === 'evidence_most') return Number(right.dataset.evidenceCount ?? 0) - Number(left.dataset.evidenceCount ?? 0) || name();
    if (mode === 'launch_oldest' || mode === 'launch_newest') {
      const leftDate = left.dataset.launchDate ?? '';
      const rightDate = right.dataset.launchDate ?? '';
      if (!leftDate && !rightDate) return name();
      if (!leftDate) return 1;
      if (!rightDate) return -1;
      const result = leftDate.localeCompare(rightDate);
      return (mode === 'launch_newest' ? -result : result) || name();
    }
    return name();
  }

  function renderActiveFilters() {
    if (!(activeSummary instanceof HTMLElement)) return;
    activeSummary.replaceChildren();
    const entries: Array<{ key: string; value: string; label: string }> = [];
    if (inputValue().trim()) entries.push({ key: 'q', value: inputValue().trim(), label: `Search: ${inputValue().trim()}` });
    for (const group of groups) for (const value of selectedFor(group)) entries.push({ key: group, value, label: `${group.replace('_', ' ')}: ${labelFor(group, value)}` });
    if (!entries.length) {
      const empty = document.createElement('span');
      empty.textContent = 'No active filters';
      empty.className = 'active-filter-empty';
      activeSummary.append(empty);
    } else {
      for (const entry of entries) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'active-filter-chip';
        button.dataset.clearKey = entry.key;
        button.dataset.clearValue = entry.value;
        button.textContent = `${entry.label} ×`;
        button.setAttribute('aria-label', `Remove ${entry.label}`);
        activeSummary.append(button);
      }
    }
    for (const group of groups) {
      const count = root.querySelector(`[data-filter-count="${group}"]`);
      if (count) count.textContent = String(selectedFor(group).length);
    }
  }

  function renderResults() {
    const sortedRows = [...rows].sort(compareElements);
    const sortedCards = [...cards].sort(compareElements);
    for (const row of sortedRows) tableBody?.append(row);
    for (const card of sortedCards) cardBody?.append(card);
    let visible = 0;
    for (const row of rows) {
      const show = matches(row);
      row.hidden = !show;
      if (show) visible += 1;
    }
    for (const card of cards) card.hidden = !matches(card);
    if (resultCount) resultCount.textContent = String(visible);
    if (noResults instanceof HTMLElement) noResults.hidden = visible !== 0;
    renderActiveFilters();
  }

  function syncComparisonInputs() {
    for (const input of compareInputs) input.checked = selectedComparisons.has(input.value);
  }

  function renderComparison() {
    syncComparisonInputs();
    if (!(comparePanel instanceof HTMLElement) || !(compareGrid instanceof HTMLElement)) return;
    compareGrid.replaceChildren();
    for (const slug of selectedComparisons) {
      const source = compareSources.get(slug);
      if (!source) continue;
      const clone = source.cloneNode(true);
      if (clone instanceof HTMLElement) {
        clone.hidden = false;
        clone.removeAttribute('data-comparison-source');
        clone.classList.remove('comparison-source');
        clone.classList.add('comparison-record');
      }
      compareGrid.append(clone);
    }
    comparePanel.hidden = selectedComparisons.size === 0;
    if (compareStatus) compareStatus.textContent = selectedComparisons.size < 2 ? `${selectedComparisons.size} selected. Select one more record to compare.` : `${selectedComparisons.size} records selected for comparison.`;
    comparePanel.dataset.ready = String(selectedComparisons.size >= 2);
  }

  function refresh(mode?: 'push' | 'replace') {
    renderResults();
    renderComparison();
    if (mode) writeUrl(mode);
  }

  search?.addEventListener('input', () => refresh('replace'));
  sort?.addEventListener('change', () => refresh('push'));
  for (const input of filters) input.addEventListener('change', () => refresh('push'));
  activeSummary?.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-clear-key]') : null;
    if (!button) return;
    const key = button.dataset.clearKey ?? '';
    if (key === 'q' && search instanceof HTMLInputElement) search.value = '';
    else for (const input of filters) if (input.dataset.filterGroup === key && input.value === button.dataset.clearValue) input.checked = false;
    refresh('push');
  });
  for (const button of clearAll) button.addEventListener('click', () => {
    if (search instanceof HTMLInputElement) search.value = '';
    for (const input of filters) input.checked = false;
    if (sort instanceof HTMLSelectElement) sort.value = defaultSort;
    refresh('push');
  });
  for (const input of compareInputs) input.addEventListener('change', () => {
    if (input.checked && !selectedComparisons.has(input.value) && selectedComparisons.size >= 4) {
      input.checked = false;
      if (compareAlert) compareAlert.textContent = 'A maximum of four stablecoin records can be compared. Selection was not changed.';
      return;
    }
    if (input.checked) selectedComparisons.add(input.value);
    else selectedComparisons.delete(input.value);
    if (compareAlert) compareAlert.textContent = '';
    renderComparison();
    writeUrl('push');
  });
  root.querySelector('[data-clear-comparison]')?.addEventListener('click', () => {
    selectedComparisons.clear();
    renderComparison();
    writeUrl('push');
  });
  window.addEventListener('popstate', () => { applyState(stateFromUrl()); refresh(); });

  applyState(stateFromUrl());
  refresh('replace');
}
