type ComparePreset = {
  id: string;
  label: string;
  description: string;
  asset_slugs: string[];
  visible_group_ids: string[];
};

type ComparePresetConfig = {
  presets: ComparePreset[];
};

type CompareDimensionGroup = {
  id: string;
  dimensions: Array<{ id: string }>;
};

type CompareDimensionConfig = {
  groups: CompareDimensionGroup[];
};

const presetRoot = document.querySelector('[data-compare-page]');

if (presetRoot instanceof HTMLElement) {
  const root = presetRoot;
  const slots = Array.from(root.querySelectorAll<HTMLSelectElement>('[data-compare-slot]'));
  const presetButtons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-compare-preset-id]'));
  const groupToggles = Array.from(root.querySelectorAll<HTMLInputElement>('[data-compare-group-toggle]'));
  const presetStatus = root.querySelector<HTMLElement>('[data-compare-preset-status]');
  const alert = root.querySelector<HTMLElement>('[data-compare-alert]');
  const groupsContainer = root.querySelector<HTMLElement>('[data-compare-groups]');
  const presetConfigElement = document.querySelector<HTMLScriptElement>('#compare-preset-config');
  const dimensionConfigElement = document.querySelector<HTMLScriptElement>('#compare-dimension-config');
  const presetConfig = presetConfigElement?.textContent
    ? JSON.parse(presetConfigElement.textContent) as ComparePresetConfig
    : { presets: [] };
  const dimensionConfig = dimensionConfigElement?.textContent
    ? JSON.parse(dimensionConfigElement.textContent) as CompareDimensionConfig
    : { groups: [] };

  const presetById = new Map(presetConfig.presets.map((preset) => [preset.id, preset]));
  const allGroupIds = dimensionConfig.groups.map((group) => group.id);
  const validGroupIds = new Set(allGroupIds);
  const dimensionCountByGroup = new Map(dimensionConfig.groups.map((group) => [group.id, group.dimensions.length]));
  let activePresetId: string | null = null;
  let suppressManualSelectionSync = false;

  const selectedAssetSlugs = () => slots.map((slot) => slot.value).filter(Boolean);
  const selectedGroupIds = () => groupToggles.filter((toggle) => toggle.checked).map((toggle) => toggle.value);

  function normalizedGroups(values: string[]) {
    const selected: string[] = [];
    for (const value of values) {
      if (!validGroupIds.has(value) || selected.includes(value)) continue;
      selected.push(value);
    }
    return selected.length ? selected : [...allGroupIds];
  }

  function groupIdsFromUrl(params: URLSearchParams, preset: ComparePreset | null) {
    const explicit = (params.get('groups') ?? '').split(',').map((value) => value.trim()).filter(Boolean);
    if (explicit.length) return normalizedGroups(explicit);
    if (preset) return normalizedGroups(preset.visible_group_ids);
    return [...allGroupIds];
  }

  function visibleFacetCount(groupIds: string[]) {
    return groupIds.reduce((sum, groupId) => sum + (dimensionCountByGroup.get(groupId) ?? 0), 0);
  }

  function setGroupSelection(groupIds: string[]) {
    const selected = new Set(normalizedGroups(groupIds));
    for (const toggle of groupToggles) toggle.checked = selected.has(toggle.value);
    syncRenderedGroupVisibility();
  }

  function syncRenderedGroupVisibility() {
    const selected = new Set(selectedGroupIds());
    for (const section of root.querySelectorAll<HTMLElement>('[data-compare-group]')) {
      section.hidden = !selected.has(section.dataset.compareGroup ?? '');
    }
  }

  function setPressedPreset(presetId: string | null) {
    for (const button of presetButtons) {
      const pressed = button.dataset.comparePresetId === presetId;
      button.setAttribute('aria-pressed', pressed ? 'true' : 'false');
    }
  }

  function updatePresetStatus(message: string) {
    if (presetStatus) presetStatus.textContent = message;
  }

  function selectionMatchesPreset(preset: ComparePreset, groupIds = selectedGroupIds()) {
    const assetsMatch = JSON.stringify(selectedAssetSlugs()) === JSON.stringify(preset.asset_slugs);
    const groupsMatch = JSON.stringify(groupIds) === JSON.stringify(normalizedGroups(preset.visible_group_ids));
    return assetsMatch && groupsMatch;
  }

  function replaceUrlPresetState(presetId: string | null, groupIds: string[]) {
    const params = new URLSearchParams(window.location.search);
    if (presetId) params.set('preset', presetId); else params.delete('preset');
    const normalized = normalizedGroups(groupIds);
    if (normalized.length === allGroupIds.length) params.delete('groups');
    else params.set('groups', normalized.join(','));
    const next = `${window.location.pathname}${params.size ? `?${params.toString()}` : ''}${window.location.hash}`;
    window.history.replaceState({}, '', next);
  }

  function pushGroupUrl(groupIds: string[]) {
    const params = new URLSearchParams(window.location.search);
    params.delete('preset');
    const normalized = normalizedGroups(groupIds);
    if (normalized.length === allGroupIds.length) params.delete('groups');
    else params.set('groups', normalized.join(','));
    const next = `${window.location.pathname}${params.size ? `?${params.toString()}` : ''}${window.location.hash}`;
    window.history.pushState({}, '', next);
  }

  function setSlotValues(assetSlugs: string[]) {
    slots.forEach((slot, index) => { slot.value = assetSlugs[index] ?? ''; });
  }

  function dispatchSelectionChange() {
    const changed = slots[Math.min(Math.max(selectedAssetSlugs().length - 1, 0), Math.max(slots.length - 1, 0))];
    if (!changed) return;
    suppressManualSelectionSync = true;
    changed.dispatchEvent(new Event('change', { bubbles: true }));
    suppressManualSelectionSync = false;
  }

  function applyPreset(preset: ComparePreset, historyMode: 'push' | 'replace' = 'push') {
    setSlotValues(preset.asset_slugs);
    setGroupSelection(preset.visible_group_ids);
    activePresetId = preset.id;
    setPressedPreset(activePresetId);

    if (historyMode === 'push') {
      dispatchSelectionChange();
      replaceUrlPresetState(activePresetId, selectedGroupIds());
    } else {
      const params = new URLSearchParams(window.location.search);
      params.set('assets', preset.asset_slugs.join(','));
      params.set('preset', preset.id);
      const groups = normalizedGroups(preset.visible_group_ids);
      if (groups.length === allGroupIds.length) params.delete('groups');
      else params.set('groups', groups.join(','));
      const next = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
      window.history.replaceState({}, '', next);
      syncRenderedGroupVisibility();
    }

    updatePresetStatus(`Preset applied: ${preset.label} · ${preset.asset_slugs.length} assets · ${visibleFacetCount(selectedGroupIds())} visible facets.`);
  }

  function applyUrlPresetState() {
    const params = new URLSearchParams(window.location.search);
    const requestedPreset = presetById.get(params.get('preset') ?? '') ?? null;
    const explicitAssets = (params.get('assets') ?? '').split(',').map((value) => value.trim()).filter(Boolean);

    if (requestedPreset && explicitAssets.length === 0) {
      applyPreset(requestedPreset, 'replace');
      return;
    }

    const groups = groupIdsFromUrl(params, requestedPreset);
    setGroupSelection(groups);

    if (requestedPreset && selectionMatchesPreset(requestedPreset, groups)) {
      activePresetId = requestedPreset.id;
      setPressedPreset(activePresetId);
      updatePresetStatus(`Preset active: ${requestedPreset.label} · ${requestedPreset.asset_slugs.length} assets · ${visibleFacetCount(groups)} visible facets.`);
    } else {
      activePresetId = null;
      setPressedPreset(null);
      if (params.has('preset')) replaceUrlPresetState(null, groups);
      updatePresetStatus(groups.length === allGroupIds.length ? '' : `Custom facet view · ${visibleFacetCount(groups)} visible facets.`);
    }
  }

  for (const button of presetButtons) {
    button.addEventListener('click', () => {
      const preset = presetById.get(button.dataset.comparePresetId ?? '');
      if (!preset) return;
      if (alert) alert.textContent = '';
      applyPreset(preset, 'push');
    });
  }

  for (const slot of slots) {
    slot.addEventListener('change', () => {
      if (suppressManualSelectionSync) return;
      const currentPreset = activePresetId ? presetById.get(activePresetId) ?? null : null;
      if (currentPreset && selectionMatchesPreset(currentPreset)) return;
      activePresetId = null;
      setPressedPreset(null);
      replaceUrlPresetState(null, selectedGroupIds());
      updatePresetStatus(selectedAssetSlugs().length ? `Custom selection · ${visibleFacetCount(selectedGroupIds())} visible facets.` : '');
    });
  }

  for (const toggle of groupToggles) {
    toggle.addEventListener('change', () => {
      if (selectedGroupIds().length === 0) {
        toggle.checked = true;
        if (alert) alert.textContent = 'At least one facet group must remain visible.';
        return;
      }
      if (alert) alert.textContent = '';
      activePresetId = null;
      setPressedPreset(null);
      pushGroupUrl(selectedGroupIds());
      syncRenderedGroupVisibility();
      updatePresetStatus(`Custom facet view · ${visibleFacetCount(selectedGroupIds())} visible facets.`);
    });
  }

  const observer = new MutationObserver(() => syncRenderedGroupVisibility());
  if (groupsContainer) observer.observe(groupsContainer, { childList: true, subtree: true });

  window.addEventListener('popstate', () => applyUrlPresetState());
  applyUrlPresetState();
}
