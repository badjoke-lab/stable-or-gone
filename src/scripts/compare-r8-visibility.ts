const visibilityRoot = document.querySelector('[data-compare-page]');

if (visibilityRoot instanceof HTMLElement) {
  const root = visibilityRoot;
  const facetSelect = root.querySelector<HTMLSelectElement>('[data-compare-mobile-facet]');

  const syncVisibility = () => {
    const mobile = window.innerWidth <= 719;
    const activeFacet = facetSelect?.value ?? '';
    const rows = Array.from(root.querySelectorAll<HTMLElement>('[data-dimension-id]'));

    for (const row of rows) {
      const visible = !mobile || !activeFacet || row.dataset.dimensionId === activeFacet;
      row.hidden = !visible;
      row.style.setProperty('display', visible ? '' : 'none', visible ? '' : 'important');
    }

    for (const group of root.querySelectorAll<HTMLElement>('[data-compare-group]')) {
      const groupHasVisibleFacet = Array.from(group.querySelectorAll<HTMLElement>('[data-dimension-id]'))
        .some((row) => !row.hidden);
      const visible = !mobile || groupHasVisibleFacet;
      group.style.setProperty('display', visible ? '' : 'none', visible ? '' : 'important');
    }
  };

  facetSelect?.addEventListener('change', syncVisibility);
  window.addEventListener('resize', syncVisibility, { passive: true });

  const groups = root.querySelector('[data-compare-groups]');
  if (groups) new MutationObserver(syncVisibility).observe(groups, { childList: true, subtree: true });

  queueMicrotask(syncVisibility);
}
