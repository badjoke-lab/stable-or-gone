const foundRoot = document.querySelector('[data-organization-index]');

if (foundRoot instanceof HTMLElement) {
  const root = foundRoot;
  const search = root.querySelector<HTMLInputElement>('[data-organization-search]');
  const sort = root.querySelector<HTMLSelectElement>('[data-organization-sort]');
  const rows = Array.from(root.querySelectorAll<HTMLElement>('[data-organization-row]'));
  const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-organization-card]'));
  const rowBody = root.querySelector<HTMLElement>('[data-organization-body]');
  const cardBody = root.querySelector<HTMLElement>('[data-organization-card-body]');
  const filters = Array.from(root.querySelectorAll<HTMLInputElement>('[data-organization-filter-group]'));
  const resultCount = root.querySelector<HTMLElement>('[data-organization-result-count]');
  const visibleRange = root.querySelector<HTMLElement>('[data-organization-visible-range]');
  const activeSummary = root.querySelector<HTMLElement>('[data-organization-active-filters]');
  const noResults = root.querySelector<HTMLElement>('[data-organization-no-results]');
  const clearButtons = Array.from(root.querySelectorAll<HTMLElement>('[data-organization-clear-all]'));
  const pagination = root.querySelector<HTMLElement>('[data-organization-pagination]');
  const pagePrevious = root.querySelector<HTMLButtonElement>('[data-organization-page-prev]');
  const pageNext = root.querySelector<HTMLButtonElement>('[data-organization-page-next]');
  const pageStatus = root.querySelector<HTMLElement>('[data-organization-page-status]');
  const groups = ['category', 'regulatory', 'jurisdiction', 'role', 'relationship_status'] as const;
  const attributes = {
    category: 'data-category',
    regulatory: 'data-regulatory',
    jurisdiction: 'data-jurisdiction',
    role: 'data-role',
    relationship_status: 'data-relationship-status'
  } as const;
  const defaultSort = 'name_asc';
  const validSorts = new Set(['name_asc', 'name_desc', 'assets_most', 'relationships_most', 'evidence_most']);
  const pageSize = Math.max(1, Number.parseInt(root.dataset.pageSize ?? '20', 10) || 20);
  let currentPage = 1;

  const normalize = (value: unknown) => String(value ?? '').normalize('NFKC').toLocaleLowerCase().trim().replace(/\s+/g, ' ');
  const selectedFor = (group: string) => filters.filter((input) => input.dataset.organizationFilterGroup === group && input.checked).map((input) => input.value);
  const labelFor = (group: string, value: string) => filters.find((input) => input.dataset.organizationFilterGroup === group && input.value === value)?.dataset.label ?? value;
  const sortValue = () => sort && validSorts.has(sort.value) ? sort.value : defaultSort;

  function stateFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const selected = Object.fromEntries(groups.map((group) => {
      const allowed = new Set(filters.filter((input) => input.dataset.organizationFilterGroup === group).map((input) => input.value));
      return [group, [...new Set((params.get(group) ?? '').split(',').filter((value) => allowed.has(value)))]];
    })) as Record<(typeof groups)[number], string[]>;
    const requestedPage = Number.parseInt(params.get('page') ?? '1', 10);
    return {
      q: params.get('q') ?? '',
      filters: selected,
      sort: validSorts.has(params.get('sort') ?? '') ? String(params.get('sort')) : defaultSort,
      page: Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1
    };
  }

  function applyState(state: ReturnType<typeof stateFromUrl>) {
    if (search) search.value = state.q;
    if (sort) sort.value = state.sort;
    for (const input of filters) input.checked = state.filters[input.dataset.organizationFilterGroup as (typeof groups)[number]]?.includes(input.value) ?? false;
    currentPage = state.page;
  }

  function writeUrl(mode: 'push' | 'replace') {
    const params = new URLSearchParams();
    if (search?.value.trim()) params.set('q', search.value.trim());
    for (const group of groups) {
      const values = selectedFor(group);
      if (values.length) params.set(group, values.join(','));
    }
    if (sortValue() !== defaultSort) params.set('sort', sortValue());
    if (currentPage > 1) params.set('page', String(currentPage));
    const ordered = new URLSearchParams();
    for (const key of ['q', ...groups, 'sort', 'page']) if (params.has(key)) ordered.set(key, params.get(key) ?? '');
    const next = `${window.location.pathname}${ordered.size ? `?${ordered.toString()}` : ''}${window.location.hash}`;
    if (mode === 'push') window.history.pushState({}, '', next);
    else window.history.replaceState({}, '', next);
  }

  function matches(element: HTMLElement) {
    const query = normalize(search?.value);
    if (query && !normalize(element.dataset.search).includes(query)) return false;
    for (const group of groups) {
      const selected = selectedFor(group);
      if (!selected.length) continue;
      const current = (element.getAttribute(attributes[group]) ?? '').split(',').filter(Boolean);
      if (!selected.some((value) => current.includes(value))) return false;
    }
    return true;
  }

  function compare(left: HTMLElement, right: HTMLElement) {
    const name = String(left.dataset.name ?? '').localeCompare(String(right.dataset.name ?? ''));
    if (sortValue() === 'name_desc') return -name;
    if (sortValue() === 'assets_most') return Number(right.dataset.assetsCount ?? 0) - Number(left.dataset.assetsCount ?? 0) || name;
    if (sortValue() === 'relationships_most') return Number(right.dataset.relationshipsCount ?? 0) - Number(left.dataset.relationshipsCount ?? 0) || name;
    if (sortValue() === 'evidence_most') return Number(right.dataset.evidenceCount ?? 0) - Number(left.dataset.evidenceCount ?? 0) || name;
    return name;
  }

  function renderActiveFilters() {
    if (!activeSummary) return;
    activeSummary.replaceChildren();
    const entries: Array<{ key: string; value: string; label: string }> = [];
    if (search?.value.trim()) entries.push({ key: 'q', value: search.value.trim(), label: `Search: ${search.value.trim()}` });
    for (const group of groups) for (const value of selectedFor(group)) entries.push({ key: group, value, label: `${group.replace('_', ' ')}: ${labelFor(group, value)}` });
    if (!entries.length) {
      const empty = document.createElement('span');
      empty.className = 'active-filter-empty';
      empty.textContent = 'No active filters';
      activeSummary.append(empty);
    }
    for (const entry of entries) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'active-filter-chip';
      button.dataset.organizationClearKey = entry.key;
      button.dataset.organizationClearValue = entry.value;
      button.textContent = `${entry.label} ×`;
      button.setAttribute('aria-label', `Remove ${entry.label}`);
      activeSummary.append(button);
    }
    for (const group of groups) {
      const selectedCount = selectedFor(group).length;
      const count = root.querySelector<HTMLElement>(`[data-organization-filter-count="${group}"]`);
      const optionTotal = count?.dataset.optionTotal ?? '';
      if (count) {
        count.textContent = selectedCount > 0 ? String(selectedCount) : optionTotal;
        count.toggleAttribute('data-selected', selectedCount > 0);
      }
      count?.closest('summary')?.setAttribute('data-summary-label', selectedCount > 0 ? `${selectedCount} selected` : 'All');
    }
  }

  function render() {
    const sortedRows = [...rows].sort(compare);
    const sortedCards = [...cards].sort(compare);
    for (const row of sortedRows) rowBody?.append(row);
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

  function refresh(mode?: 'push' | 'replace') {
    render();
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
    const button = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-organization-clear-key]') : null;
    if (!button) return;
    if (button.dataset.organizationClearKey === 'q' && search) search.value = '';
    else for (const input of filters) if (input.dataset.organizationFilterGroup === button.dataset.organizationClearKey && input.value === button.dataset.organizationClearValue) input.checked = false;
    resetPageAndRefresh('push');
  });
  for (const button of clearButtons) button.addEventListener('click', () => {
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
    root.querySelector('.organization-index-summary')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  });
  pageNext?.addEventListener('click', () => {
    currentPage += 1;
    refresh('push');
    root.querySelector('.organization-index-summary')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  });
  window.addEventListener('popstate', () => {
    applyState(stateFromUrl());
    render();
  });

  applyState(stateFromUrl());
  refresh('replace');
}
