const foundRoot = document.querySelector('[data-event-index]');

if (foundRoot instanceof HTMLElement) {
  const root = foundRoot;
  const search = root.querySelector<HTMLInputElement>('[data-event-search]');
  const sort = root.querySelector<HTMLSelectElement>('[data-event-sort]');
  const rows = Array.from(root.querySelectorAll<HTMLElement>('[data-event-row]'));
  const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-event-card]'));
  const rowBody = root.querySelector<HTMLElement>('[data-event-body]');
  const cardBody = root.querySelector<HTMLElement>('[data-event-card-body]');
  const filters = Array.from(root.querySelectorAll<HTMLInputElement>('[data-event-filter-group]'));
  const resultCount = root.querySelector<HTMLElement>('[data-event-result-count]');
  const visibleRange = root.querySelector<HTMLElement>('[data-event-visible-range]');
  const activeSummary = root.querySelector<HTMLElement>('[data-event-active-filters]');
  const noResults = root.querySelector<HTMLElement>('[data-event-no-results]');
  const clearButtons = Array.from(root.querySelectorAll<HTMLElement>('[data-event-clear-all]'));
  const pagination = root.querySelector<HTMLElement>('[data-event-pagination]');
  const pagePrevious = root.querySelector<HTMLButtonElement>('[data-event-page-prev]');
  const pageNext = root.querySelector<HTMLButtonElement>('[data-event-page-next]');
  const pageStatus = root.querySelector<HTMLElement>('[data-event-page-status]');
  const groups = ['category', 'subtype', 'status_effect', 'recovery', 'year'] as const;
  const attributes = {
    category: 'data-category',
    subtype: 'data-subtype',
    status_effect: 'data-status-effect',
    recovery: 'data-recovery',
    year: 'data-year'
  } as const;
  const defaultSort = 'date_desc';
  const validSorts = new Set(['date_desc', 'date_asc', 'title_asc', 'evidence_most']);
  const pageSize = Math.max(1, Number.parseInt(root.dataset.pageSize ?? '20', 10) || 20);
  let currentPage = 1;

  const normalize = (value: unknown) => String(value ?? '').normalize('NFKC').toLocaleLowerCase().trim().replace(/\s+/g, ' ');
  const selectedFor = (group: string) => filters.filter((input) => input.dataset.eventFilterGroup === group && input.checked).map((input) => input.value);
  const labelFor = (group: string, value: string) => filters.find((input) => input.dataset.eventFilterGroup === group && input.value === value)?.dataset.label ?? value;
  const sortValue = () => sort && validSorts.has(sort.value) ? sort.value : defaultSort;

  function stateFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const selected = Object.fromEntries(groups.map((group) => {
      const allowed = new Set(filters.filter((input) => input.dataset.eventFilterGroup === group).map((input) => input.value));
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
    for (const input of filters) input.checked = state.filters[input.dataset.eventFilterGroup as (typeof groups)[number]]?.includes(input.value) ?? false;
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
    const title = String(left.dataset.title ?? '').localeCompare(String(right.dataset.title ?? ''));
    if (sortValue() === 'title_asc') return title;
    if (sortValue() === 'evidence_most') return Number(right.dataset.evidenceCount ?? 0) - Number(left.dataset.evidenceCount ?? 0) || title;
    const leftDate = left.dataset.eventDate ?? '';
    const rightDate = right.dataset.eventDate ?? '';
    if (!leftDate && !rightDate) return title;
    if (!leftDate) return 1;
    if (!rightDate) return -1;
    const dateResult = leftDate.localeCompare(rightDate);
    return (sortValue() === 'date_asc' ? dateResult : -dateResult) || title;
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
      button.dataset.eventClearKey = entry.key;
      button.dataset.eventClearValue = entry.value;
      button.textContent = `${entry.label} ×`;
      button.setAttribute('aria-label', `Remove ${entry.label}`);
      activeSummary.append(button);
    }
    for (const group of groups) {
      const selectedCount = selectedFor(group).length;
      const count = root.querySelector<HTMLElement>(`[data-event-filter-count="${group}"]`);
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
    const visibleIds = new Set(pageRows.map((row) => row.dataset.recordId ?? ''));

    for (const row of rows) row.hidden = !visibleIds.has(row.dataset.recordId ?? '');
    for (const card of cards) card.hidden = !visibleIds.has(card.dataset.recordId ?? '');
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
    const button = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-event-clear-key]') : null;
    if (!button) return;
    if (button.dataset.eventClearKey === 'q' && search) search.value = '';
    else for (const input of filters) if (input.dataset.eventFilterGroup === button.dataset.eventClearKey && input.value === button.dataset.eventClearValue) input.checked = false;
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
    root.querySelector('.event-index-summary')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  });
  pageNext?.addEventListener('click', () => {
    currentPage += 1;
    refresh('push');
    root.querySelector('.event-index-summary')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  });
  window.addEventListener('popstate', () => {
    applyState(stateFromUrl());
    render();
  });

  applyState(stateFromUrl());
  refresh('replace');
}
