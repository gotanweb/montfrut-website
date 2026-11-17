/* ==========================================================================
   Montfrut — scripts.js
   Static front-end logic: data, filters, cart, modal, carousel, toast
   ========================================================================== */

'use strict';

console.log('Montfrut Catalog: scripts.js is loading...');

/* --------------------------------------------------------------------------
   1. PRODUCT DATA
   -------------------------------------------------------------------------- */




/* --------------------------------------------------------------------------
   2. STATE
   -------------------------------------------------------------------------- */

// In-memory only. Variants use stable IDs, independently of display labels.
const selectedItems = [];
const SELECTION_STORAGE_KEY = 'montfrut.catalog.selection.v1';
const SELECTION_SCHEMA_VERSION = 1;
let selectionStorage = null;
let selectionStorageSnapshot = null;
const selectionPersistence = {
  initialized: false,
  mode: 'uninitialized',
  reason: null,
  rejectedItems: [],
  warnings: [],
  recoveredIssues: [],
  noticeShown: false
};
let modalSelection = null;
let productModalReturnFocus = null;
let activeCategories = [];
let activeFlavors = [];
let searchQuery = '';
let sortOrder = 'featured';


/* --------------------------------------------------------------------------
   3. SELECTION
   -------------------------------------------------------------------------- */

function usdToCents(amount) {
  if (!Number.isFinite(amount) || amount < 0) return null;
  const decimal = String(amount);
  const [whole, fraction = ''] = decimal.split('.');
  if (!decimal.includes('e') && fraction.length <= 2) {
    // Preserve decimal cents even near the safe-integer limit.
    const exactCents = Number(whole + fraction.padEnd(2, '0'));
    return Number.isSafeInteger(exactCents) ? exactCents : null;
  }
  const cents = Math.round(amount * 100);
  if (!Number.isSafeInteger(cents)) return null;
  // Two relative machine epsilons absorb binary noise such as 0.1 + 0.2.
  // Cap at USD 1e-9 so tolerance never grows into a fraction-of-cent allowance.
  const tolerance = Math.min(2 * Number.EPSILON * Math.abs(amount), 1e-9);
  return Math.abs(amount - cents / 100) <= tolerance ? cents : null;
}

function formatUsdCents(cents) {
  if (cents === null) return 'Price unavailable';
  const remainder = cents % 100;
  return `$${(cents - remainder) / 100}.${String(remainder).padStart(2, '0')}`;
}

function isOptionAvailable(option) {
  return option.available === true && usdToCents(option.priceAdjustment) !== null;
}

function getAvailabilityMessage(product) {
  if (product.status === 'coming-soon') return 'Coming soon';
  if (product.status !== 'available') return 'Unavailable';
  if (usdToCents(product.price) === null) return 'Price unavailable';
  if (product.variants.some(group => group.required && !group.options.some(isOptionAvailable))) {
    return 'Required options unavailable';
  }
  return '';
}

function canonicalizeConfiguration(configuration) {
  return configuration.filter(group => group.optionIds.length > 0)
    .map(group => ({ groupId: group.groupId, optionIds: [...group.optionIds].sort() }))
    .sort((a, b) => a.groupId < b.groupId ? -1 : a.groupId > b.groupId ? 1 : 0);
}

function getConfigurationKey(productId, configuration) {
  return JSON.stringify([productId, canonicalizeConfiguration(configuration)]);
}

function calculateUnitPriceCents(product, configuration) {
  let cents = usdToCents(product.price);
  if (cents === null) return null;
  for (const selected of configuration) {
    const group = product.variants.find(group => group.id === selected.groupId);
    for (const optionId of selected.optionIds) {
      const option = group.options.find(option => option.id === optionId);
      const adjustment = usdToCents(option.priceAdjustment);
      if (adjustment === null || cents > Number.MAX_SAFE_INTEGER - adjustment) return null;
      cents += adjustment;
    }
  }
  return cents;
}

function validateConfiguration(product, configuration) {
  const groupErrors = new Map();
  const invalid = (error = 'Invalid product configuration.') => ({ valid: false, error, groupErrors });
  if (!Array.isArray(configuration) || !Array.isArray(product.variants)) return invalid();
  if (usdToCents(product.price) === null) {
    return invalid('Prices must be finite, nonnegative USD amounts with at most two decimal places.');
  }

  const groups = new Map();
  for (const group of product.variants) {
    if (!group || typeof group.id !== 'string' || !group.id || groups.has(group.id) ||
        !['single', 'multiple'].includes(group.selection) || typeof group.required !== 'boolean' ||
        !Array.isArray(group.options)) return invalid();
    const optionIds = new Set();
    for (const option of group.options) {
      if (!option || typeof option.id !== 'string' || !option.id || optionIds.has(option.id)) return invalid();
      optionIds.add(option.id);
    }
    groups.set(group.id, group);
  }

  const chosen = new Map();
  for (const selected of configuration) {
    if (!selected || !groups.has(selected.groupId) || chosen.has(selected.groupId) ||
        !Array.isArray(selected.optionIds) ||
        new Set(selected.optionIds).size !== selected.optionIds.length) return invalid();
    const group = groups.get(selected.groupId);
    if (group.selection === 'single' && selected.optionIds.length > 1) {
      groupErrors.set(group.id, 'Choose only one option.');
    }
    for (const optionId of selected.optionIds) {
      const option = group.options.find(option => option.id === optionId);
      if (!option || !isOptionAvailable(option)) {
        groupErrors.set(group.id, 'Choose an available option.');
      }
    }
    chosen.set(group.id, selected.optionIds);
  }
  for (const group of product.variants) {
    if (group.required && !group.options.some(isOptionAvailable)) {
      groupErrors.set(group.id, 'No options are currently available for this required group.');
    } else if (group.required && !(chosen.get(group.id) || []).length) {
      groupErrors.set(group.id, 'Please choose at least one option.');
    }
  }
  const normalized = canonicalizeConfiguration(configuration);
  // Required groups may still be incomplete while previewing a valid partial price.
  const hasInvalidOption = configuration.some(selected => selected.optionIds.some(optionId => {
    const option = groups.get(selected.groupId).options.find(option => option.id === optionId);
    return !option || !isOptionAvailable(option);
  }));
  if (hasInvalidOption) return invalid();
  const unitPriceCents = calculateUnitPriceCents(product, normalized);
  if (unitPriceCents === null) return invalid('The selected price exceeds the supported monetary range.');
  return {
    valid: groupErrors.size === 0,
    error: groupErrors.size ? 'Please check the options below.' : '',
    groupErrors,
    configuration: normalized,
    unitPriceCents
  };
}

function validateSelection(productId, configuration = [], quantity = 1) {
  const product = products.find(product => product.id === productId);
  if (!product || product.status !== 'available') {
    return { valid: false, error: 'This product is not available for selection.' };
  }
  if (!Number.isSafeInteger(quantity) || quantity < 1 ||
      !Number.isSafeInteger(getSelectedUnitCount() + quantity)) {
    return { valid: false, error: 'Quantity must be a positive whole number within the supported range.' };
  }
  return { ...validateConfiguration(product, configuration), product };
}

function getUnitPriceCents(productId, configuration = []) {
  const product = products.find(product => product.id === productId);
  if (!product) return null;
  const result = validateConfiguration(product, configuration);
  return result.valid ? result.unitPriceCents : null;
}

function getSelectedUnitCount() {
  return selectedItems.reduce((total, item) => total + item.quantity, 0);
}

function incrementSelectionQuantity(item, quantity) {
  if (!Number.isSafeInteger(quantity) || quantity < 1 ||
      !Number.isSafeInteger(item.quantity + quantity)) return false;
  item.quantity += quantity;
  return true;
}

function updateSelectionCount() {
  const total = getSelectedUnitCount();
  const badge = document.getElementById('cart-count');
  badge.textContent = total;
  badge.classList.toggle('d-none', total === 0);
  badge.setAttribute('aria-label', `${total} units selected`);
  document.getElementById('selection-indicator').setAttribute('aria-label', `Selection: ${total} units`);
}

function addToSelection(productId, configuration = [], quantity = 1) {
  initializeSelectionPersistence();
  const result = validateSelection(productId, configuration, quantity);
  if (!result.valid) return result;
  const key = getConfigurationKey(productId, result.configuration);
  const existing = selectedItems.find(item => getConfigurationKey(item.productId, item.variants) === key);
  if (existing) {
    if (!incrementSelectionQuantity(existing, quantity)) return { valid: false, error: 'Quantity is too large.' };
  } else {
    selectedItems.push({ productId, variants: canonicalizeConfiguration(result.configuration), quantity,
      referenceUnitPriceCents: result.unitPriceCents });
  }
  updateSelectionCount();
  saveSelection();
  showToast(result.product.name);
  return result;
}

function requestProductSelection(productId, trigger = null) {
  const product = products.find(product => product.id === productId);
  if (!product || getAvailabilityMessage(product)) return false;
  if (product.variants.some(group => group.required)) {
    openProductModal(productId, trigger);
    return false;
  }
  return addToSelection(productId).valid;
}

function showToast(productName) {
  const toastEl = document.getElementById('cart-toast');
  const toastBody = document.getElementById('toast-body-text');
  const notice = getSelectionPersistenceNotice();
  toastBody.textContent = `"${productName}" added to selection.${notice ? ` ${notice}` : ''}`;
  if (notice) selectionPersistence.noticeShown = true;
  const toast = bootstrap.Toast.getOrCreateInstance(toastEl);
  toast.show();
}

/* Persistence stores IDs, quantities and an advisory original-price reference only.
 * selectedItems is the sole quantity source; commercial review is derived afresh.
 * Reading never writes. Unsafe/unknown source data stays untouched on disk.
 */
function isStoredCentAmount(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

function normalizeStoredSelectionItem(value, index) {
  const invalid = reason => ({ error: { index, reason } });
  if (!value || typeof value !== 'object' || Array.isArray(value)) return invalid('invalid_item');
  const id = value.productId;
  if (!((typeof id === 'number' && Number.isSafeInteger(id) && id >= 0) ||
      (typeof id === 'string' && id.length > 0))) return invalid('invalid_product_id');
  if (!Number.isSafeInteger(value.quantity) || value.quantity < 1) return invalid('invalid_quantity');
  if (!Array.isArray(value.variants)) return invalid('invalid_variants');
  const groups = new Set();
  const configuration = [];
  for (const group of value.variants) {
    if (!group || typeof group.groupId !== 'string' || !group.groupId || groups.has(group.groupId) ||
        !Array.isArray(group.optionIds)) return invalid('invalid_variant_group');
    groups.add(group.groupId);
    const options = new Set();
    for (const id of group.optionIds) {
      if (typeof id !== 'string' || !id || options.has(id)) return invalid('invalid_variant_option');
      options.add(id);
    }
    configuration.push({ groupId: group.groupId, optionIds: [...options] });
  }
  const reference = value.referenceUnitPriceCents;
  const hasReference = Object.prototype.hasOwnProperty.call(value, 'referenceUnitPriceCents');
  const warning = hasReference && reference !== null && !isStoredCentAmount(reference)
    ? { index, code: 'invalid_price_reference' } : null;
  return { warning, item: { productId: id, variants: canonicalizeConfiguration(configuration), quantity: value.quantity,
    referenceUnitPriceCents: isStoredCentAmount(reference) ? reference : null } };
}

function protectStoredSelection(reason) {
  selectionPersistence.mode = 'protected';
  selectionPersistence.reason = reason;
}

function initializeSelectionPersistence() {
  if (selectionPersistence.initialized) return;
  selectionPersistence.initialized = true;
  let saved;
  try {
    const storage = window.localStorage;
    if (!storage) throw new Error('Storage unavailable');
    saved = storage.getItem(SELECTION_STORAGE_KEY);
    selectionStorage = storage;
    selectionStorageSnapshot = saved;
  } catch {
    selectionPersistence.mode = 'memory-only';
    selectionPersistence.reason = 'storage_unavailable';
    return;
  }
  selectionPersistence.mode = 'ready';
  if (saved === null) return;
  let payload;
  try {
    payload = JSON.parse(saved);
  } catch {
    protectStoredSelection('invalid_json');
    return;
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    protectStoredSelection('invalid_schema');
    return;
  }
  if (payload.schemaVersion !== SELECTION_SCHEMA_VERSION) {
    protectStoredSelection('unsupported_schema_version');
    return;
  }
  if (!Array.isArray(payload.items)) {
    protectStoredSelection('invalid_schema');
    return;
  }
  const byKey = new Map();
  let units = 0;
  payload.items.forEach((value, index) => {
    const normalized = normalizeStoredSelectionItem(value, index);
    if (normalized.error) {
      selectionPersistence.rejectedItems.push(normalized.error);
      return;
    }
    if (normalized.warning) selectionPersistence.warnings.push(normalized.warning);
    const item = normalized.item;
    if (!Number.isSafeInteger(units + item.quantity)) {
      selectionPersistence.rejectedItems.push({ index, reason: 'unsafe_total_quantity' });
      return;
    }
    const key = getConfigurationKey(item.productId, item.variants);
    const existing = byKey.get(key);
    if (existing) {
      const previousReference = existing.referenceUnitPriceCents;
      if (previousReference !== item.referenceUnitPriceCents) {
        selectionPersistence.warnings.push({ index, code: 'conflicting_price_references' });
        existing.referenceUnitPriceCents = null;
        // Preserve the original duplicate records rather than overwrite conflicting history.
        protectStoredSelection('conflicting_price_references');
      }
      existing.quantity += item.quantity;
    } else {
      byKey.set(key, item);
      selectedItems.push(item);
    }
    units += item.quantity;
  });
  if (selectionPersistence.rejectedItems.length) protectStoredSelection('partial_recovery');
  selectionPersistence.recoveredIssues = getSelectionReview().flatMap((item, itemIndex) =>
    item.issues.map(issue => ({ itemIndex, ...issue })));
}

function reconcileSelectionItem(item) {
  const issues = [];
  const issue = (code, extra = {}) => issues.push({ code, ...extra });
  const product = products.find(product => product.id === item.productId);
  let currentUnitPriceCents = null;
  if (!product) {
    issue('product_missing');
  } else {
    if (product.status === 'unavailable') issue('product_unavailable');
    else if (product.status === 'coming-soon') issue('product_coming_soon');
    else if (product.status !== 'available') issue('invalid_product_status');
    if (usdToCents(product.price) === null) issue('invalid_price');
    const groups = Array.isArray(product.variants) ? product.variants : [];
    for (const selected of item.variants) {
      const group = groups.find(group => group && group.id === selected.groupId);
      if (!group) {
        issue('variant_group_missing', { groupId: selected.groupId });
        continue;
      }
      const options = Array.isArray(group.options) ? group.options : [];
      for (const optionId of selected.optionIds) {
        const option = options.find(option => option && option.id === optionId);
        const ids = { groupId: group.id, optionId };
        if (!option) issue('variant_option_missing', ids);
        else {
          if (option.available !== true) issue('variant_option_unavailable', ids);
          if (usdToCents(option.priceAdjustment) === null) issue('invalid_price', ids);
        }
      }
      if (group.selection === 'single' && selected.optionIds.length > 1) {
        issue('single_configuration_invalid', { groupId: group.id });
      }
    }
    for (const group of groups) {
      if (!group || !group.required) continue;
      const selected = item.variants.find(selected => selected.groupId === group.id);
      const options = Array.isArray(group.options) ? group.options : [];
      if (!selected || !selected.optionIds.some(id => options.some(option =>
        option && option.id === id && isOptionAvailable(option)))) {
        issue('required_configuration_invalid', { groupId: group.id });
      }
    }
    // Reuse the same complete validator as new additions, without adding the saved quantity twice.
    const validation = validateConfiguration(product, item.variants);
    if (validation.valid) currentUnitPriceCents = validation.unitPriceCents;
    else if (issues.length === 0) issue('configuration_invalid');
  }
  const validForInquiry = issues.length === 0;
  const reference = isStoredCentAmount(item.referenceUnitPriceCents) ? item.referenceUnitPriceCents : null;
  const priceChanged = reference !== null && currentUnitPriceCents !== null && reference !== currentUnitPriceCents;
  if (priceChanged) issue('price_changed');
  return {
    productId: item.productId,
    variants: canonicalizeConfiguration(item.variants),
    quantity: item.quantity,
    referenceUnitPriceCents: reference,
    priceReferenceStatus: reference === null ? 'unavailable' : 'present',
    currentUnitPriceCents,
    validForInquiry,
    priceChanged,
    requiresReview: !validForInquiry || priceChanged,
    issues
  };
}

function getSelectionReview() {
  return selectedItems.map(reconcileSelectionItem);
}

function getValidSelectionItems() {
  return getSelectionReview().filter(item => item.validForInquiry);
}

function getSelectionPersistenceState() {
  return {
    initialized: selectionPersistence.initialized,
    mode: selectionPersistence.mode,
    reason: selectionPersistence.reason,
    rejectedItems: selectionPersistence.rejectedItems.map(item => ({ ...item })),
    warnings: selectionPersistence.warnings.map(warning => ({ ...warning })),
    recoveredIssues: selectionPersistence.recoveredIssues.map(issue => ({ ...issue }))
  };
}

function saveSelection() {
  if (!selectionStorage || selectionPersistence.mode === 'protected') return false;
  const items = [];
  let units = 0;
  for (const [index, value] of selectedItems.entries()) {
    const normalized = normalizeStoredSelectionItem(value, index);
    if (normalized.error || normalized.warning || !Number.isSafeInteger(units + value.quantity)) {
      protectStoredSelection('invalid_memory_state');
      return false;
    }
    const item = normalized.item;
    units += item.quantity;
    const record = { productId: item.productId, variants: item.variants, quantity: item.quantity };
    if (item.referenceUnitPriceCents !== null) record.referenceUnitPriceCents = item.referenceUnitPriceCents;
    items.push(record);
  }
  try {
    if (selectionStorage.getItem(SELECTION_STORAGE_KEY) !== selectionStorageSnapshot) {
      protectStoredSelection('storage_changed');
      return false;
    }
    const serialized = JSON.stringify({ schemaVersion: SELECTION_SCHEMA_VERSION, items });
    selectionStorage.setItem(SELECTION_STORAGE_KEY, serialized);
    selectionStorageSnapshot = serialized;
    selectionPersistence.mode = 'ready';
    selectionPersistence.reason = null;
    return true;
  } catch {
    selectionPersistence.mode = 'memory-only';
    selectionPersistence.reason = 'write_failed';
    return false;
  }
}

function getSelectionPersistenceNotice() {
  if (selectionPersistence.mode === 'protected') {
    return 'Saved selection data needs review and has been preserved. New selections are kept only for this visit.';
  }
  return selectionPersistence.mode === 'memory-only'
    ? 'Selection cannot be saved on this device. It is kept only for this visit.' : '';
}

function showSelectionPersistenceNotice() {
  const message = getSelectionPersistenceNotice();
  if (!message || selectionPersistence.noticeShown) return;
  selectionPersistence.noticeShown = true;
  document.getElementById('toast-body-text').textContent = message;
  bootstrap.Toast.getOrCreateInstance(document.getElementById('cart-toast')).show();
}


/* --------------------------------------------------------------------------
   4. FILTER & SEARCH LOGIC
   -------------------------------------------------------------------------- */

function getFilteredProducts() {
  let filtered = [...products];

  // Category filter
  if (activeCategories.length > 0) {
    filtered = filtered.filter(p => activeCategories.includes(p.category));
  }

  // Flavor filter
  if (activeFlavors.length > 0) {
    filtered = filtered.filter(p => activeFlavors.includes(p.flavor));
  }

  // Search
  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.flavor.toLowerCase().includes(q)
    );
  }

  // Sort
  switch (sortOrder) {
    case 'bestsellers':
      filtered.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
      break;
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    default:
      // featured: best sellers first
      filtered.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
  }

  return filtered;
}

function updateFilters() {
  // Checkboxes — categories
  document.querySelectorAll('.filter-category').forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) {
        if (!activeCategories.includes(cb.value)) activeCategories.push(cb.value);
      } else {
        activeCategories = activeCategories.filter(c => c !== cb.value);
      }
      renderProductGrid();
    });
  });

  // Checkboxes — flavors
  document.querySelectorAll('.filter-flavor').forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) {
        if (!activeFlavors.includes(cb.value)) activeFlavors.push(cb.value);
      } else {
        activeFlavors = activeFlavors.filter(f => f !== cb.value);
      }
      renderProductGrid();
    });
  });
}


/* --------------------------------------------------------------------------
   5. RENDER HELPERS
   -------------------------------------------------------------------------- */

function allergyTagsHTML(tags) {
  return tags.map(tag => `<span class="allergy-tag">${tag}</span>`).join('');
}

function availabilityHTML(product) {
  const message = getAvailabilityMessage(product);
  return message ? `<p class="selection-status">${message}</p>` : '';
}

function renderProductCard(product) {
  return `
    <div class="product-card" data-id="${product.id}">
      <div class="product-card__img-wrap">
        <img src="${product.image}" alt="${product.name}" class="product-card__img" loading="lazy">
        ${product.isBestSeller ? '<span class="product-card__badge badge-bestseller">Best Seller</span>' : ''}
      </div>
      <div class="product-card__body">
        <h3 class="product-card__name">${product.name}</h3>
        <p class="product-card__desc">${product.shortDescription}</p>
        <div class="product-card__tags">${allergyTagsHTML(product.allergyTags)}</div>
        ${availabilityHTML(product)}
        <div class="product-card__footer">
          <span class="product-card__price">${formatUsdCents(usdToCents(product.price))}</span>
          <div class="product-card__actions">
            <button class="btn-add-to-cart" data-id="${product.id}" aria-label="Add ${product.name} to selection"${getAvailabilityMessage(product) ? ' disabled' : ''}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              Add to Selection
            </button>
            <button class="btn-details" data-id="${product.id}" aria-label="View details for ${product.name}">Details</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderBestSellerCard(product) {
  return `
    <div class="bestseller-card">
      <div class="bestseller-card__badge">BEST SELLER</div>
      <div class="bestseller-card__img-wrap">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="bestseller-card__body">
        <h3 class="bestseller-card__name">${product.name}</h3>
        <p class="bestseller-card__desc">${product.shortDescription}</p>
        <div class="bestseller-card__tags">${allergyTagsHTML(product.allergyTags)}</div>
        ${availabilityHTML(product)}
        <div class="bestseller-card__price">${formatUsdCents(usdToCents(product.price))}</div>
        <button class="btn-add-to-cart btn-add-to-cart--light" data-id="${product.id}" aria-label="Add ${product.name} to selection"${getAvailabilityMessage(product) ? ' disabled' : ''}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          Add to Selection
        </button>
        <button class="btn-details btn-details--light mt-2" data-id="${product.id}" aria-label="View details for ${product.name}">Details</button>
      </div>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   6. RENDER PRODUCT GRID
   -------------------------------------------------------------------------- */

function renderProductGrid() {
  console.log('Montfrut Catalog: Rendering product grid...');
  const filtered = getFilteredProducts();
  const bestSeller = products.find(p => p.isBestSeller);
  const gridWrap = document.getElementById('catalog-grid-wrap');
  const noResults = document.getElementById('no-results');
  const bestSellerSlot = document.getElementById('bestseller-slot');

  // Remove old dynamic cards
  gridWrap.querySelectorAll('.product-card').forEach(el => el.remove());

  // Best seller card
  if (bestSellerSlot) {
    const shouldShow = filtered.some(p => p.isBestSeller) && bestSeller;
    bestSellerSlot.innerHTML = shouldShow ? renderBestSellerCard(bestSeller) : '';
    bestSellerSlot.style.display = shouldShow ? '' : 'none';
  }

  // Regular products (exclude best seller)
  const regularProducts = filtered.filter(p => !p.isBestSeller);

  if (regularProducts.length === 0 && !filtered.some(p => p.isBestSeller)) {
    noResults.classList.remove('d-none');
  } else {
    noResults.classList.add('d-none');
    regularProducts.forEach(product => {
      const div = document.createElement('div');
      div.innerHTML = renderProductCard(product).trim();
      const card = div.firstChild;
      gridWrap.appendChild(card);
    });
  }

  attachCardEvents();
}


/* --------------------------------------------------------------------------
   7. SPECIAL COLLECTION CAROUSEL
   -------------------------------------------------------------------------- */

let carouselIndex = 0;

function getVisibleSpecialItems() {
  if (window.matchMedia('(min-width: 992px)').matches) return 3;
  if (window.matchMedia('(min-width: 576px)').matches) return 2;
  return 1;
}

function renderSpecialCollection() {
  console.log('Montfrut Catalog: Rendering special collection...');
  const specialProducts = products.filter(p => p.isSpecialCollection);
  const track = document.getElementById('special-track');
  if (!track) return;

  track.innerHTML = specialProducts.map(p => `
    <div class="special-item">
      <div class="special-item__img-wrap">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
      </div>
      <div class="special-item__body">
        <h4 class="special-item__name">${p.name}</h4>
        <p class="special-item__desc">${p.shortDescription}</p>
        ${availabilityHTML(p)}
        <div class="special-item__footer">
          <span class="special-item__price">${formatUsdCents(usdToCents(p.price))}</span>
          <button class="btn-details btn-details--mini" data-id="${p.id}" aria-label="View details for ${p.name}">Details</button>
        </div>
      </div>
    </div>
  `).join('');

  carouselIndex = 0;
  if (track) track.style.transform = 'translateX(0)';
  updateCarouselButtons(specialProducts.length);
}

function updateCarouselButtons(total) {
  const btnPrev = document.getElementById('special-prev');
  const btnNext = document.getElementById('special-next');
  if (!btnPrev || !btnNext) return;

  const visibleItems = getVisibleSpecialItems();
  btnPrev.disabled = carouselIndex === 0;
  btnNext.disabled = carouselIndex >= Math.max(0, total - visibleItems);
}

function moveCarousel(direction) {
  const specialProducts = products.filter(p => p.isSpecialCollection);
  const itemWidth = document.querySelector('.special-item')?.offsetWidth || 0;
  const gap = parseFloat(getComputedStyle(document.getElementById('special-track')).columnGap) || 14;
  const visibleItems = getVisibleSpecialItems();

  const maxIndex = Math.max(0, specialProducts.length - visibleItems);
  
  if (direction === 1 && carouselIndex >= maxIndex) {
    carouselIndex = 0; // Loop back to start
  } else if (direction === -1 && carouselIndex <= 0) {
    carouselIndex = maxIndex; // Loop to end
  } else {
    carouselIndex = Math.max(0, Math.min(carouselIndex + direction, maxIndex));
  }

  const track = document.getElementById('special-track');
  if (track) {
    track.style.transform = `translateX(-${carouselIndex * (itemWidth + gap)}px)`;
  }

  updateCarouselButtons(specialProducts.length);
}

// Auto-play carousel
let carouselInterval;
function startCarouselAutoPlay() {
  stopCarouselAutoPlay();
  const specialProducts = products.filter(p => p.isSpecialCollection);
  const visibleItems = getVisibleSpecialItems();
  
  if (specialProducts.length <= visibleItems) return; // Don't play if everything is visible

  carouselInterval = setInterval(() => {
    moveCarousel(1);
  }, 4000); // 4 seconds
}

function stopCarouselAutoPlay() {
  if (carouselInterval) clearInterval(carouselInterval);
}


/* --------------------------------------------------------------------------
   8. MODAL
   -------------------------------------------------------------------------- */

function canReceiveFocus(element) {
  if (!element || !element.isConnected || typeof element.focus !== 'function' ||
      !element.matches('a[href], button, input, select, textarea, [tabindex]') ||
      element.matches(':disabled') || element.getAttribute('aria-disabled') === 'true' ||
      element.closest('[hidden], [inert], [aria-hidden="true"]') ||
      element.getClientRects().length === 0) return false;
  const style = getComputedStyle(element);
  if (style.visibility === 'hidden' || style.visibility === 'collapse') return false;
  for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) {
    if (getComputedStyle(ancestor).opacity === '0') return false;
  }
  return true;
}

function trackProductModalFocus(event) {
  const modal = document.getElementById('productModal');
  if (event.target !== modal) {
    if (productModalReturnFocus) productModalReturnFocus.nextModalEvent = event;
    return;
  }
  const trigger = event.relatedTarget || document.activeElement;
  productModalReturnFocus = {
    trigger: trigger && !modal.contains(trigger) ? trigger : null,
    native: Boolean(trigger && trigger.matches('[data-bs-toggle="modal"]')),
    nextModalEvent: null
  };
}

function restoreProductModalFocus() {
  const state = productModalReturnFocus;
  productModalReturnFocus = null;
  if (!state) return;
  // Let Bootstrap's hidden handlers finish, including its native focus restorer.
  requestAnimationFrame(() => {
    if ((state.nextModalEvent && !state.nextModalEvent.defaultPrevented) ||
        document.querySelector('.modal.show, .modal[aria-modal="true"]')) return;
    if (state.native && canReceiveFocus(state.trigger)) return;
    const target = [state.trigger, document.getElementById('selection-indicator'),
      document.querySelector('.site-header a[href]')].find(canReceiveFocus);
    if (target) target.focus({ preventScroll: true });
  });
}

function renderVariantControls(product) {
  const container = document.getElementById('modal-variants');
  container.replaceChildren();
  modalSelection = { productId: product.id, groups: [], attempted: false };
  product.variants.forEach((group, groupIndex) => {
    const fieldset = document.createElement('fieldset');
    fieldset.className = 'selection-variant-group';
    fieldset.disabled = product.status !== 'available';
    fieldset.tabIndex = -1;
    const legend = document.createElement('legend');
    legend.textContent = `${group.label.en} (${group.required ? 'Required' : 'Optional'})`;
    fieldset.appendChild(legend);
    const hint = document.createElement('p');
    hint.className = 'modal-text';
    hint.id = `variant-hint-${groupIndex}`;
    hint.textContent = group.selection === 'single' ? 'Choose one option.' : 'Choose one or more options.';
    if (!group.required) hint.textContent += ' You may leave this group unselected.';
    fieldset.appendChild(hint);
    const error = document.createElement('p');
    error.id = `variant-error-${groupIndex}`;
    error.className = 'selection-validation';
    error.setAttribute('aria-live', 'polite');
    error.hidden = true;
    const controls = { group, fieldset, error, inputs: [] };
    // Optional radio groups include an explicit way to return to no extras.
    const options = group.selection === 'single' && !group.required
      ? [{ id: '', label: { en: 'No extra' }, priceAdjustment: 0, available: true }, ...group.options]
      : group.options;
    options.forEach(option => {
      const label = document.createElement('label');
      label.className = 'selection-variant-option';
      const input = document.createElement('input');
      input.type = group.selection === 'single' ? 'radio' : 'checkbox';
      input.name = `variant-group-${groupIndex}`;
      input.value = option.id;
      input.disabled = !isOptionAvailable(option);
      input.setAttribute('aria-describedby', `${hint.id} ${error.id}`);
      input.addEventListener('change', () => updateModalConfiguration());
      const text = document.createElement('span');
      const price = isOptionAvailable(option) ? ` (+${formatUsdCents(usdToCents(option.priceAdjustment))})` : '';
      text.textContent = `${option.label.en}${price}${input.disabled ? ' — Unavailable' : ''}`;
      label.appendChild(input);
      label.appendChild(text);
      fieldset.appendChild(label);
      controls.inputs.push(input);
    });
    fieldset.appendChild(error);
    container.appendChild(fieldset);
    modalSelection.groups.push(controls);
  });
  container.hidden = product.variants.length === 0;
  updateModalConfiguration();
}

function readModalConfiguration() {
  return modalSelection.groups.map(({ group, inputs }) => ({
    groupId: group.id,
    optionIds: inputs.filter(input => input.checked && input.value !== '').map(input => input.value)
  }));
}

function updateModalConfiguration(showErrors = false) {
  if (!modalSelection) return null;
  modalSelection.attempted = modalSelection.attempted || showErrors;
  const product = products.find(product => product.id === modalSelection.productId);
  const configuration = readModalConfiguration();
  const result = validateConfiguration(product, configuration);
  const availability = getAvailabilityMessage(product);
  for (const { group, fieldset, error, inputs } of modalSelection.groups) {
    const impossible = group.required && !group.options.some(isOptionAvailable);
    const message = (modalSelection.attempted || impossible) ? result.groupErrors.get(group.id) || '' : '';
    error.textContent = message;
    error.hidden = !message;
    fieldset.setAttribute('aria-invalid', message ? 'true' : 'false');
    inputs.forEach(input => input.setAttribute('aria-invalid', message ? 'true' : 'false'));
  }
  const price = document.getElementById('modal-price');
  price.textContent = formatUsdCents(result.unitPriceCents === undefined
    ? usdToCents(product.price) : result.unitPriceCents);
  const button = document.getElementById('modal-add-to-cart');
  button.disabled = Boolean(availability);
  const status = document.getElementById('modal-selection-message');
  status.textContent = availability || (modalSelection.attempted ? result.error : '');
  status.hidden = !status.textContent;
  return { ...result, configuration };
}

function submitModalSelection() {
  if (!modalSelection) return;
  const result = updateModalConfiguration(true);
  if (!result.valid) {
    const invalid = modalSelection.groups.find(({ group }) => result.groupErrors.has(group.id));
    if (invalid) (invalid.inputs.find(input => !input.disabled) || invalid.fieldset).focus();
    return;
  }
  const added = addToSelection(modalSelection.productId, result.configuration);
  if (!added.valid) {
    const message = document.getElementById('modal-selection-message');
    message.textContent = added.error;
    message.hidden = false;
  }
}

function openProductModal(productId, trigger = null) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const origin = trigger || document.activeElement;

  // Populate modal fields
  document.getElementById('modal-title').textContent = product.name;
  document.getElementById('modal-price').textContent = formatUsdCents(usdToCents(product.price));
  document.getElementById('modal-description').textContent = product.longDescription;
  document.getElementById('modal-tags').innerHTML = allergyTagsHTML(product.allergyTags) + 
    `<a href="#" class="modal-allergy-link" data-bs-toggle="modal" data-bs-target="#allergiesModal">Allergies information</a>`;
  document.getElementById('modal-flavor-notes').innerHTML = product.flavorNotes.map(n => `<span class="flavor-note">${n}</span>`).join('');
  document.getElementById('modal-ingredients').textContent = product.ingredients;

  // Set up carousel
  const carouselInner = document.getElementById('modal-carousel-inner');
  const carouselIndicators = document.getElementById('modal-carousel-indicators');
  const carouselThumbs = document.getElementById('modal-thumbnails');
  carouselInner.innerHTML = product.galleryImages.map((img, idx) => `
    <div class="carousel-item ${idx === 0 ? 'active' : ''}">
      <img src="${img}" class="d-block w-100 modal-carousel-img" alt="${product.name} — photo ${idx + 1}">
    </div>
  `).join('');
  carouselIndicators.innerHTML = product.galleryImages.map((_, idx) => `
    <button type="button" data-bs-target="#modalCarousel" data-bs-slide-to="${idx}" ${idx === 0 ? 'class="active" aria-current="true"' : ''} aria-label="Slide ${idx + 1}"></button>
  `).join('');
  if (carouselThumbs) {
    carouselThumbs.innerHTML = product.galleryImages.map((img, idx) => `
      <button class="modal-thumbnail ${idx === 0 ? 'active' : ''}" type="button" data-bs-target="#modalCarousel" data-bs-slide-to="${idx}" aria-label="Show ${product.name} photo ${idx + 1}">
        <img src="${img}" alt="" loading="lazy">
      </button>
    `).join('');
  }

  // Add to cart button in modal
  const modalCartBtn = document.getElementById('modal-add-to-cart');
  modalCartBtn.setAttribute('data-id', product.id);
  modalCartBtn.setAttribute('data-name', product.name);
  modalCartBtn.setAttribute('aria-label', `Add ${product.name} to selection`);
  renderVariantControls(product);

  // Show modal
  const modalEl = document.getElementById('productModal');
  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
  const carouselEl = document.getElementById('modalCarousel');
  if (carouselEl && carouselThumbs && !carouselEl._thumbsBound) {
    carouselEl.addEventListener('slide.bs.carousel', event => {
      document.querySelectorAll('#modal-thumbnails .modal-thumbnail').forEach((thumb, idx) => {
        thumb.classList.toggle('active', idx === event.to);
      });
    });
    carouselEl._thumbsBound = true;
  }
  modal.show(origin);
}


/* --------------------------------------------------------------------------
   9. EVENT DELEGATION
   -------------------------------------------------------------------------- */

function attachCardEvents() {
  const gridWrap = document.getElementById('catalog-grid-wrap');
  // Remove and re-add to avoid duplicate listeners (use a flag)
  if (!gridWrap._hasListener) {
    gridWrap.addEventListener('click', handleGridClick);
    gridWrap._hasListener = true;
  }
}

function handleGridClick(e) {
  const addBtn = e.target.closest('.btn-add-to-cart');
  const detailsBtn = e.target.closest('.btn-details');

  if (addBtn) {
    const id = parseInt(addBtn.getAttribute('data-id'));
    requestProductSelection(id, addBtn);
  }

  if (detailsBtn) {
    const id = parseInt(detailsBtn.getAttribute('data-id'));
    openProductModal(id, detailsBtn);
  }
}

// Modal selection uses the same validated add path as direct selection.
document.addEventListener('click', function(e) {
  if (e.target.id === 'modal-add-to-cart' || e.target.closest('#modal-add-to-cart')) {
    submitModalSelection();
  }
});


/* --------------------------------------------------------------------------
   10. SEARCH & SORT
   -------------------------------------------------------------------------- */

function initSearchAndSort() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value;
      renderProductGrid();
    });
  }

  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      sortOrder = sortSelect.value;
      renderProductGrid();
    });
  }
}


/* --------------------------------------------------------------------------
   11. MOBILE FILTERS SYNC (offcanvas mirrors main sidebar)
   -------------------------------------------------------------------------- */

function syncOffcanvasFilters() {
  document.querySelectorAll('.filter-category-oc').forEach(cb => {
    cb.addEventListener('change', () => {
      // Mirror to sidebar
      const sibling = document.querySelector(`.filter-category[value="${cb.value}"]`);
      if (sibling) sibling.checked = cb.checked;
      if (cb.checked) {
        if (!activeCategories.includes(cb.value)) activeCategories.push(cb.value);
      } else {
        activeCategories = activeCategories.filter(c => c !== cb.value);
      }
      renderProductGrid();
    });
  });

  document.querySelectorAll('.filter-flavor-oc').forEach(cb => {
    cb.addEventListener('change', () => {
      const sibling = document.querySelector(`.filter-flavor[value="${cb.value}"]`);
      if (sibling) sibling.checked = cb.checked;
      if (cb.checked) {
        if (!activeFlavors.includes(cb.value)) activeFlavors.push(cb.value);
      } else {
        activeFlavors = activeFlavors.filter(f => f !== cb.value);
      }
      renderProductGrid();
    });
  });
}


/* --------------------------------------------------------------------------
   12. INIT
   -------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  initializeSelectionPersistence();
  updateSelectionCount();
  showSelectionPersistenceNotice();
  document.addEventListener('show.bs.modal', trackProductModalFocus);
  document.getElementById('productModal').addEventListener('hidden.bs.modal', () => {
    modalSelection = null;
    document.getElementById('modal-variants').replaceChildren();
    document.getElementById('modal-add-to-cart').disabled = true;
    restoreProductModalFocus();
  });
  // Render
  renderSpecialCollection();
  renderProductGrid();

  // Special collection event delegation
  const specialTrack = document.getElementById('special-track');
  if (specialTrack) {
    specialTrack.addEventListener('click', (e) => {
      const detailsBtn = e.target.closest('.btn-details');
      if (detailsBtn) {
        const id = parseInt(detailsBtn.getAttribute('data-id'));
        openProductModal(id, detailsBtn);
      }
    });
  }

  // Events
  updateFilters();
  initSearchAndSort();
  syncOffcanvasFilters();

  // Special collection carousel buttons
  const btnPrev = document.getElementById('special-prev');
  const btnNext = document.getElementById('special-next');
  if (btnPrev) btnPrev.addEventListener('click', () => {
    moveCarousel(-1);
    startCarouselAutoPlay(); // Reset timer
  });
  if (btnNext) btnNext.addEventListener('click', () => {
    moveCarousel(1);
    startCarouselAutoPlay(); // Reset timer
  });
  
  startCarouselAutoPlay(); // Initial start

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      renderSpecialCollection();
      startCarouselAutoPlay();
    }, 150);
  }, { passive: true });

  // Smooth scroll for internal anchors
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Navbar scroll effect
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
});
