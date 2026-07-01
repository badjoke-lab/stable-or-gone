const foundRoot = document.querySelector('[data-stablecoin-index]');

if (foundRoot instanceof HTMLElement) {
  const root = foundRoot;
  const search = root.querySelector<HTMLInputElement>('[data-index-search]');
  const sort = root.querySelector<HTMLSelectElement>('[data-index-sort]');
  const tableBody = root.querySelector<HTMLElement>('[data-registry-body]');
  const cardBody = root.querySelector<HTMLElement>('[data-card-body]');
  const rows = Array.from(root.querySelectorAll<HTMLElement>('[data-registry-row]'));
  const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-registry-card]'));
  const filters = Array.from(root.querySelectorAll<HTMLInputElement>('[data-filter-group]'));
  const resultCount = root.querySelector<HTMLElement>('[data-result-count]');
  const visibleRange = root.querySelector<HTMLElement>('[data-visible-range]');
  const activeSummary = root.querySelector<HTMLElement>('[data-active-filters]');
  const noResults = root.querySelector<HTMLElement>('[data-no-results]');
  const clearAll = Array.from(root.querySelectorAll<HTMLElement>('[data-clear-all]'));
  const pagination = root.querySelector<HTMLElement>('[data-pagination]');
  const pagePrevious = root.querySelector<HTMLButtonElement>('[data-page-prev]');
  const pageNext = root.querySelector<HTMLButtonElement>('[data-page-next]');
  const pageStatus = root.querySelector<HTMLElement>('[data-page-status]');
  const compareInputs = Array.from(root.querySelectorAll<HTMLInputElement>('[data-compare-select]'));
  const comparePanel = root.querySelector<HTMLElement>('[data-comparison-panel]');
  const compareGrid = root.querySelector<HTMLElement>('[data-comparison-grid]');
  const compareStatus = root.querySelector<HTMLElement>('[data-comparison-status]');
  const compareAlert = root.querySelector<HTMLElement>('[data-comparison-alert]');
  const compareSources = new Map(Array.from(root.querySelectorAll<HTMLElement>('[data-comparison-source]')).map((source) => [source.dataset.recordSlug ?? '', source]));
  const groups = ['lifecycle', 'issuance', 'asset_class', 'reference', 'backing', 'stabilization'] as const;
  const dataAttribute = { lifecycle: 'data-lifecycle', issuance: 'data-issuance', asset_class: 'data-asset-class', reference: 'data-reference', backing: 'data-backing', stabilization: 'data-stabilization' } as const;
  const parameterOrder = ['q', ...groups, 'sort', 'page', 'compare'];
  const defaultSort = 'name_asc';
  const validSorts = new Set(['name_asc', 'name_desc', 'lifecycle_then_name', 'launch_oldest', 'launch_newest', 'evidence_most']);
  const pageSize = Math.max(1, Number.parseInt(root.dataset.pageSize ?? '20', 10) || 20);
  let currentPage = 1;
  let selectedComparisons = new Set<string>();

  const normalize = (value: unknown) => String(value ?? '').normalize('NFKC').toLocaleLowerCase().trim().replace(/\s+/g, ' ');
  const inputValue = () => search?.value ?? '';
  const sortValue = () => sort && validSorts.has(sort.value) ? sort.value : defaultSort;
  const selectedFor = (group: string) => filters.filter((input) => input.dataset.filterGroup === group && input.checked).map((input) => input.value);
  const labelFor = (group: string, value: string) => filters.find((input) => input.dataset.filterGroup === group && input.value === value)?.dataset.label ?? value;
  const knownSlugs = new Set(compareSources.keys());

  function stateFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const selected = Object.fromEntries(groups.map((group) => {
      const allowed = new Set(filters.filter((input) => input.dataset.filterGroup === group).map((input) => input.value));
      return [group, [...new Set((params.get(group) ?? '').split(',').filter((value) => allowed.has(value)))]];
    })) as Record<(typeof groups)[number], string[]>;
    const requestedPage = Number.parseInt(params.get('page') ?? '1', 10);
    return {
      q: params.get('q') ?? '',
      filters: selected,
      sort: validSorts.has(params.get('sort') ?? '') ? String(params.get('sort')) : defaultSort,
      page: Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1,
      compare: [...new Set((params.get('compare') ?? '').split(',').filter((slug) => knownSlugs.has(slug)).slice(0, 4))]
    };
  }

  function applyState(state: ReturnType<typeof stateFromUrl>) {
    if (search) search.value = state.q;
    if (sort) sort.value = state.sort;
    for (const input of filters) input.checked = state.filters[input.dataset.filterGroup as (typeof groups)[number]]?.includes(input.value) ?? false;
    currentPage = state.page;
    selectedComparisons = new Set(state.compare);
    syncComparisonInputs();
  }

  function writeUrl(mode: 'push' | 'replace') {
    const params = new URLSearchParams();
    if (inputValue().trim()) params.set('q', inputValue().trim());
    for (const group of groups) {
      const values = selectedFor(group);
      if (values.length) params.set(group, values.join(','));
    }
    if (sortValue() !== defaultSort) params.set('sort', sortValue());
    if (currentPage > 1) params.set('page', String(currentPage));
    if (selectedComparisons.size) params.set('compare', [...selectedComparisons].join(','));
    const ordered = new URLSearchParams();
    for (const key of parameterOrder) if (params.has(key)) ordered.set(key, params.get(key) ?? '');
    const next = `${window.location.pathname}${ordered.size ? `?${ordered.toString()}` : ''}${window.location.hash}`;
    if (mode === 'push') window.history.pushState({}, '', next);
    else window.history.replaceState({}, '', next);
  }

  function matches(element: HTMLElement) {
    if (normalize(inputValue()) && !normalize(element.dataset.search).includes(normalize(inputValue()))) return false;
    for (const group of groups) {
      const selected = selectedFor(group);
      const current = element.getAttribute(dataAttribute[group]) ?? '';
      if (selected.length && !selected.includes(current)) return false;
    }
    return true;
  }

  function compareElements(left: HTMLElement, right: HTMLElement) {
    const mode = sortValue();
    const nameResult = String(left.dataset.name ?? '').localeCompare(String(right.dataset.name ?? ''));
    if (mode === 'name_desc') return -nameResult;
    if (mode === 'lifecycle_then_name') return String(left.dataset.lifecycle ?? '').localeCompare(String(right.dataset.lifecycle ?? '')) || nameResult;
    if (mode === 'evidence_most') return Number(right.dataset.evidenceCount ?? 0) - Number(left.dataset.evidenceCount ?? 0) || nameResult;
    if (mode === 'launch_oldest' || mode === 'launch_newest') {
      const leftDate = left.dataset.launchDate ?? '';
      const rightDate = right.dataset.launchDate ?? '';
      if (!leftDate && !rightDate) return nameResult;
      if (!leftDate) return 1;
      if (!rightDate) return -1;
      const dateResult = leftDate.localeCompare(rightDate);
      return (mode === 'launch_newest' ? -dateResult : dateResult) || nameResult;
    }
    return nameResult;
  }

  function renderActiveFilters() {
    if (!activeSummary) return;
    activeSummary.replaceChildren();
    const entries: Array<{ key: string; value: string; label: string }> = [];
    if (inputValue().trim()) entries.push({ key: 'q', value: inputValue().trim(), label: `Search: ${inputValue().trim()}` });
    for (const group of groups) for (const value of selectedFor(group)) entries.push({ key: group, value, label: `${group.replace('_', ' ')}: ${labelFor(group, value)}` });
    if (!entries.length) {
      const empty = document.createElement('span');
      empty.textContent = 'No active filters';
      empty.className = 'active-filter-empty';
      activeSummary.append(empty);
    }
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
    for (const group of groups) {
      const count = root.querySelector<HTMLElement>(`[data-filter-count="${group}"]`);
      if (count) count.textContent = String(selectedFor(group).length);
      const summary = count?.closest('summary');
      if (summary) summary.setAttribute('data-summary-label', `${selectedFor(group).length} selected`);
    }
  }

  function renderResults() {
    const sortedRows = [...rows].sort(compareElements);
    const sortedCards = [...cards].sort(compareElements);
    for (const row of sortedRows) tableBody?.append(row);
    for (const card of sortedCards) cardBody?.append(card);

    const matchedRows = sortedRows.filter(matches);
    const matchCount = matchedRows.length;
    const pageCount = Math.max(1, Math.ceil(matchCount / pageSize));
    currentPage = Math.min(Math.max(1, currentPage), pageCount);
    const start = (currentPage - 1) * pageSize;
    const pageRows = matchedRows.slice(start, start + pageSize);
    const visibleSlugs = new Set(pageRows.map((row) => row.dataset.recordSlug ?? ''));

    for (const row of rows) row.hidden = !visibleSlugs.has(row.dataset.recordSlug ?? '');
    for (const card of cards) card.hidden = !visibleSlugs.has(card.dataset.recordSlug ?? '');

    if (resultCount) resultCount.textContent = String(matchCount);
    if (visibleRange) visibleRange.textContent = matchCount === 0 ? '0' : `${start + 1}–${Math.min(start + pageSize, matchCount)}`;
    if (noResults) noResults.hidden = matchCount !== 0;
    if (pagination) pagination.hidden = matchCount === 0 || pageCount <= 1;
    if (pagePrevious) pagePrevious.disabled = currentPage <= 1;
    if (pageNext) pageNext.disabled = currentPage >= pageCount;
    if (pageStatus) pageStatus.textContent = `Page ${currentPage} of ${pageCount}`;
    renderActiveFilters();
  }

  function syncComparisonInputs() {
    for (const input of compareInputs) input.checked = selectedComparisons.has(input.value);
  }

  function renderComparison() {
    syncComparisonInputs();
    if (!comparePanel || !compareGrid) return;
    compareGrid.replaceChildren();
    for (const slug of selectedComparisons) {
      const source = compareSources.get(slug);
      if (!source) continue;
      const clone = source.cloneNode(true);
      if (clone instanceof HTMLElement) { clone.hidden = false; clone.removeAttribute('data-comparison-source'); clone.classList.remove('comparison-source'); clone.classList.add('comparison-record'); }
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

  function resetPageAndRefresh(mode: 'push' | 'replace') {
    currentPage = 1;
    refresh(mode);
  }

  search?.addEventListener('input', () => resetPageAndRefresh('replace'));
  sort?.addEventListener('change', () => resetPageAndRefresh('push'));
  for (const input of filters) input.addEventListener('change', () => resetPageAndRefresh('push'));
  activeSummary?.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-clear-key]') : null;
    if (!button) return;
    if (button.dataset.clearKey === 'q' && search) search.value = '';
    else for (const input of filters) if (input.dataset.filterGroup === button.dataset.clearKey && input.value === button.dataset.clearValue) input.checked = false;
    resetPageAndRefresh('push');
  });
  for (const button of clearAll) button.addEventListener('click', () => {
    if (search) search.value = '';
    for (const input of filters) input.checked = false;
    if (sort) sort.value = defaultSort;
    currentPage = 1;
    refresh('push');
  });
  pagePrevious?.addEventListener('click', () => {
    if (currentPage <= 1) return;
    currentPage -= 1;
    refresh('push');
    root.querySelector('.stablecoin-index-summary')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  });
  pageNext?.addEventListener('click', () => {
    currentPage += 1;
    refresh('push');
    root.querySelector('.stablecoin-index-summary')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  });
  for (const input of compareInputs) input.addEventListener('change', () => {
    if (input.checked && !selectedComparisons.has(input.value) && selectedComparisons.size >= 4) {
      input.checked = false;
      if (compareAlert) compareAlert.textContent = 'A maximum of four stablecoin records can be compared. Selection was not changed.';
      return;
    }
    if (input.checked) selectedComparisons.add(input.value); else selectedComparisons.delete(input.value);
    if (compareAlert) compareAlert.textContent = '';
    renderComparison();
    writeUrl('push');
  });
  root.querySelector('[data-clear-comparison]')?.addEventListener('click', () => { selectedComparisons.clear(); renderComparison(); writeUrl('push'); });
  window.addEventListener('popstate', () => { applyState(stateFromUrl()); refresh(); });

  applyState(stateFromUrl());
  refresh('replace');
}
