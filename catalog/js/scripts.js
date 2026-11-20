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
let selectionEditKey = null;
let pendingSelectionDetails = null;
let selectionDetailsReturn = null;
let selectionPanelFocus = null;
// Source phrases use localized getters; their ES equivalents live in translations.js.
const SELECTION_COPY = localizedCatalogCopy({
  add: 'Add to Selection', save: 'Save changes', remove: 'Remove', edit: 'Review options', details: 'Details',
  missing: 'Product no longer listed', unavailable: 'Unavailable', quantity: 'Quantity',
  unitPrice: 'Unit price', lineTotal: 'Line total', excluded: 'Not included in the valid subtotal.',
  unsafe: 'The amount exceeds the supported calculation range. Please reduce quantities.',
  invalidAction: 'This change is not available. Please review the item or remove it.',
  protected: 'Changes apply only to this visit. The protected saved selection has not been replaced.',
  memoryOnly: 'Changes apply only to this visit because saving is unavailable.',
  editNote: 'Review the options below. Save changes updates this selected item and keeps its quantity. Unavailable or removed choices are not preselected.',
  updated: 'Selection updated.', removed: 'Item removed.', cleared: 'Selection cleared.',
  validUnits: 'Valid units', subtotal: 'Estimated subtotal', priceUpdated: 'Price updated',
  decrease: 'Decrease quantity of', increase: 'Increase quantity of', removeOptions: 'and these options',
  issues: {
    product_missing: 'This product is no longer listed.', product_unavailable: 'This product is currently unavailable.',
    product_coming_soon: 'Coming soon. This item cannot currently be selected.',
    invalid_product_status: 'Availability needs review.', variant_group_missing: 'A saved option group is no longer listed.',
    variant_option_missing: 'A saved option is no longer listed.', variant_option_unavailable: 'A saved option is unavailable.',
    required_configuration_invalid: 'Required options need review.', single_configuration_invalid: 'Choose one option for a group that now allows only one.',
    invalid_price: 'The current price is unavailable.', configuration_invalid: 'This configuration needs review.'
  }
});
// Official contact reused from links/index.html and links/en/index.html (digits only).
const INQUIRY_WHATSAPP_NUMBER = '19174740694';
const INQUIRY_LIMITS = { name: 100, company: 120, comments: 1000, message: 6000, url: 12000 };
const INQUIRY_FIELDS = { name: 'inquiry-name', company: 'inquiry-company', eventDate: 'inquiry-event-date', comments: 'inquiry-comments' };
const INQUIRY_UI = localizedCatalogCopy({
  name: 'Please enter your full name.',
  text: 'Please use valid text without control characters.',
  length: limit => catalogText('Please use no more than {limit} characters.', { limit }),
  date: 'Please enter a valid calendar date.',
  empty: 'Select at least one available product with valid options before making an inquiry.',
  overflow: 'The estimated amount cannot be calculated safely. Please reduce quantities before making an inquiry.',
  excluded: count => catalogText('{count} invalid selection line(s) will not be included. You can review or remove them above.', { count }),
  tooLong: 'This inquiry is too long to open reliably. Please shorten comments or include fewer configurations.',
  hint: 'Complete the required name and correct any field errors to continue.',
  ready: 'Your inquiry will include only valid items at current estimated prices.',
  opening: 'WhatsApp opening requested. Review and send the message there manually. If it does not open, use Copy Inquiry Message. Nothing has been ordered or reserved.',
  openFailed: 'WhatsApp could not be opened. Use Copy Inquiry Message and paste it into WhatsApp manually.',
  copied: 'Inquiry message copied. Paste it into WhatsApp, review it and send it manually.',
  copyFailed: 'The message could not be copied. Clipboard access requires a secure connection and browser permission. You can still try opening WhatsApp.'
});
const INQUIRY_MESSAGES = {
  es: {
    greeting: 'Hola, me interesan los productos de Montfrut y quisiera realizar una consulta.',
    name: 'Nombre', company: 'Empresa', date: 'Fecha del evento', products: 'Productos de interés',
    quantity: 'Cantidad', unit: 'Precio unitario estimado', line: 'Importe estimado',
    subtotal: 'Subtotal estimado', comments: 'Comentarios adicionales'
  },
  en: {
    greeting: 'Hello, I am interested in Montfrut products and would like to make an inquiry.',
    name: 'Full name', company: 'Company', date: 'Event date', products: 'Products of interest',
    quantity: 'Quantity', unit: 'Estimated unit price', line: 'Estimated line total',
    subtotal: 'Estimated subtotal', comments: 'Additional comments'
  }
};
let inquiryCopyPending = false;
let inquiryConsent = null;
let inquiryConsentPanelReturn = null;
let lastToastProductId = null;
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
  if (cents === null) return catalogText('Price unavailable');
  const remainder = cents % 100;
  return `$${(cents - remainder) / 100}.${String(remainder).padStart(2, '0')}`;
}

function isOptionAvailable(option) {
  return option.available === true && usdToCents(option.priceAdjustment) !== null;
}

function getAvailabilityMessage(product) {
  if (product.status === 'coming-soon') return catalogText('Coming soon');
  if (product.status !== 'available') return catalogText('Unavailable');
  if (usdToCents(product.price) === null) return catalogText('Price unavailable');
  if (product.variants.some(group => group.required && !group.options.some(isOptionAvailable))) {
    return catalogText('Required options unavailable');
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
  badge.setAttribute('aria-label', catalogText('{count} units selected', { count: total }));
  document.getElementById('selection-indicator').setAttribute('aria-label', catalogText('Selection: {count} units', { count: total }));
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
  renderMySelection();
  showToast(result.product.id);
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

function showToast(productId) {
  lastToastProductId = productId;
  const toastEl = document.getElementById('cart-toast');
  const toastBody = document.getElementById('toast-body-text');
  const notice = getSelectionPersistenceNotice();
  const product = products.find(product => product.id === productId);
  const name = product ? localizedProduct(product).name : String(productId);
  toastBody.textContent = catalogText('"{name}" added to selection.', { name }) + (notice ? ` ${notice}` : '');
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
    return catalogText('Saved selection data needs review and has been preserved. New selections are kept only for this visit.');
  }
  return selectionPersistence.mode === 'memory-only'
    ? catalogText('Selection cannot be saved on this device. It is kept only for this visit.') : '';
}

function showSelectionPersistenceNotice() {
  const message = getSelectionPersistenceNotice();
  if (!message || selectionPersistence.noticeShown) return;
  selectionPersistence.noticeShown = true;
  lastToastProductId = null;
  document.getElementById('toast-body-text').textContent = message;
  bootstrap.Toast.getOrCreateInstance(document.getElementById('cart-toast')).show();
}

/* My Selection derives rows and totals from selectedItems; it owns no quantities. */
function getSelectionLineTotalCents(item) {
  const cents = item.currentUnitPriceCents;
  if (!isStoredCentAmount(cents) || !Number.isSafeInteger(item.quantity) || item.quantity < 1 ||
      (cents > 0 && item.quantity > Math.floor(Number.MAX_SAFE_INTEGER / cents))) return null;
  const total = cents * item.quantity;
  return Number.isSafeInteger(total) ? total : null;
}

function getSelectionSummary(review = getSelectionReview()) {
  let validUnits = 0;
  let subtotalCents = 0;
  for (const item of review) {
    if (!item.validForInquiry) continue;
    validUnits += item.quantity;
    const line = getSelectionLineTotalCents(item);
    if (line === null || subtotalCents === null || subtotalCents > Number.MAX_SAFE_INTEGER - line) subtotalCents = null;
    else subtotalCents += line;
  }
  return { validUnits, subtotalCents };
}

function findSelectionIndex(key) {
  return selectedItems.findIndex(item => getConfigurationKey(item.productId, item.variants) === key);
}

function announceSelection(message) {
  document.getElementById('selection-live').textContent = message;
}

function commitSelectionChange(message, focusKey = null, focusAction = null) {
  updateSelectionCount();
  saveSelection();
  renderMySelection(focusKey, focusAction);
  const summary = getSelectionSummary();
  announceSelection(`${message} ${SELECTION_COPY.validUnits}: ${summary.validUnits}. ${SELECTION_COPY.subtotal}: ${summary.subtotalCents === null ? SELECTION_COPY.unavailable : formatUsdCents(summary.subtotalCents)}.`);
}

function changeSelectionQuantity(key, delta) {
  const index = findSelectionIndex(key);
  if (index < 0 || ![-1, 1].includes(delta)) return false;
  const item = selectedItems[index];
  if (delta === 1 && !validateSelection(item.productId, item.variants).valid) return false;
  if (item.quantity === 1 && delta === -1) return removeSelectionItem(key);
  if (!Number.isSafeInteger(item.quantity + delta)) return false;
  item.quantity += delta;
  commitSelectionChange(`${SELECTION_COPY.updated} ${SELECTION_COPY.quantity}: ${item.quantity}.`, key, delta === 1 ? 'increase' : 'decrease');
  return true;
}

function removeSelectionItem(key) {
  const index = findSelectionIndex(key);
  if (index < 0) return false;
  selectedItems.splice(index, 1);
  const next = selectedItems[Math.min(index, selectedItems.length - 1)];
  commitSelectionChange(SELECTION_COPY.removed, next ? getConfigurationKey(next.productId, next.variants) : null, 'remove');
  return true;
}

function clearSelection(confirmed = false) {
  if (confirmed !== true) return false;
  selectedItems.length = 0;
  document.getElementById('selection-clear-confirm').hidden = true;
  commitSelectionChange(SELECTION_COPY.cleared);
  return true;
}

function replaceSelectionConfiguration(key, configuration) {
  const index = findSelectionIndex(key);
  if (index < 0) return { valid: false, error: SELECTION_COPY.invalidAction };
  const original = selectedItems[index];
  const product = products.find(product => product.id === original.productId);
  if (!product || product.status !== 'available') return { valid: false, error: SELECTION_COPY.invalidAction };
  const result = validateConfiguration(product, configuration);
  if (!result.valid) return result;
  const newKey = getConfigurationKey(product.id, result.configuration);
  const targetIndex = findSelectionIndex(newKey);
  let quantity = original.quantity;
  if (targetIndex >= 0 && targetIndex !== index) quantity += selectedItems[targetIndex].quantity;
  if (!Number.isSafeInteger(quantity) || quantity < 1) return { valid: false, error: SELECTION_COPY.invalidAction };
  const replacement = { productId: product.id, variants: canonicalizeConfiguration(result.configuration), quantity,
    referenceUnitPriceCents: result.unitPriceCents };
  const keep = targetIndex >= 0 ? Math.min(index, targetIndex) : index;
  selectedItems[keep] = replacement;
  if (targetIndex >= 0 && targetIndex !== index) selectedItems.splice(Math.max(index, targetIndex), 1);
  commitSelectionChange(SELECTION_COPY.updated);
  return { valid: true, key: newKey };
}

function selectionElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function selectionAction(action, key, text, label, disabled = false) {
  const button = selectionElement('button', 'selection-panel__action', text);
  button.type = 'button';
  button.setAttribute('data-selection-action', action);
  button.setAttribute('data-selection-key', key);
  button.setAttribute('aria-label', label);
  button.disabled = disabled;
  return button;
}

function focusSelectionControl(key, action) {
  const panel = document.getElementById('mySelection');
  const buttons = [...panel.querySelectorAll('[data-selection-action]')];
  const target = buttons.find(button => button.getAttribute('data-selection-key') === key &&
    button.getAttribute('data-selection-action') === action && canReceiveFocus(button));
  const fallback = buttons.find(button => button.getAttribute('data-selection-key') === key && canReceiveFocus(button));
  const destination = target || fallback || [document.getElementById('selection-empty-explore'),
    document.getElementById('selection-close')].find(canReceiveFocus);
  if (destination) destination.focus({ preventScroll: true });
}

function renderMySelection(focusKey = null, focusAction = null) {
  const panel = document.getElementById('mySelection');
  if (!panel) return;
  const list = document.getElementById('selection-items');
  list.replaceChildren();
  const review = getSelectionReview();
  for (const item of review) {
    const key = getConfigurationKey(item.productId, item.variants);
    const product = products.find(product => product.id === item.productId);
    const name = product ? localizedProduct(product).name : `${SELECTION_COPY.missing} (${item.productId})`;
    const row = selectionElement('article', 'selection-panel__line');
    const image = selectionElement(product ? 'img' : 'div', 'selection-panel__image', product ? undefined : '—');
    if (product) { image.src = catalogAssetUrl(product.image); image.alt = name; image.loading = 'lazy'; image.width = 72; image.height = 72; }
    row.appendChild(image);
    const content = selectionElement('div', 'selection-panel__content');
    content.appendChild(selectionElement('h3', '', name));
    for (const selected of item.variants) {
      const group = product && product.variants.find(group => group.id === selected.groupId);
      const labels = selected.optionIds.map(id => {
        const option = group && group.options.find(option => option.id === id);
        return option ? variantLabel(option.label) : `${SELECTION_COPY.unavailable}: ${id}`;
      });
      content.appendChild(selectionElement('p', 'selection-panel__variants', `${group ? variantLabel(group.label) : selected.groupId}: ${labels.join(', ')}`));
    }
    for (const issue of item.issues) {
      if (issue.code === 'price_changed') continue;
      content.appendChild(selectionElement('p', 'selection-panel__notice', SELECTION_COPY.issues[issue.code] || SELECTION_COPY.invalidAction));
    }
    if (item.priceChanged) content.appendChild(selectionElement('p', 'selection-panel__notice',
      `${SELECTION_COPY.priceUpdated}: ${formatUsdCents(item.referenceUnitPriceCents)} → ${formatUsdCents(item.currentUnitPriceCents)}.`));
    if (!item.validForInquiry) content.appendChild(selectionElement('p', 'selection-panel__notice', SELECTION_COPY.excluded));
    const lineTotal = getSelectionLineTotalCents(item);
    content.appendChild(selectionElement('p', 'selection-panel__price', `${SELECTION_COPY.unitPrice}: ${formatUsdCents(item.currentUnitPriceCents)}`));
    content.appendChild(selectionElement('p', 'selection-panel__price', `${SELECTION_COPY.lineTotal}: ${lineTotal === null ? (item.currentUnitPriceCents === null ? SELECTION_COPY.unavailable : SELECTION_COPY.unsafe) : formatUsdCents(lineTotal)}`));
    const controls = selectionElement('div', 'selection-panel__controls');
    const quantity = selectionElement('div', 'selection-panel__quantity');
    quantity.setAttribute('role', 'group'); quantity.setAttribute('aria-label', `${SELECTION_COPY.quantity}: ${name}`);
    quantity.appendChild(selectionAction('decrease', key, '−', `${SELECTION_COPY.decrease} ${name}`));
    quantity.appendChild(selectionElement('span', '', item.quantity));
    quantity.appendChild(selectionAction('increase', key, '+', `${SELECTION_COPY.increase} ${name}`,
      !item.validForInquiry || !Number.isSafeInteger(getSelectedUnitCount() + 1)));
    controls.appendChild(quantity);
    controls.appendChild(selectionAction('remove', key, SELECTION_COPY.remove, `${SELECTION_COPY.remove} ${name} ${SELECTION_COPY.removeOptions}`));
    if (product) {
      const editable = product.status === 'available' && (product.variants.length > 0 || item.variants.length > 0);
      controls.appendChild(selectionAction(editable ? 'edit' : 'details', key, editable ? SELECTION_COPY.edit : SELECTION_COPY.details,
        `${editable ? SELECTION_COPY.edit : SELECTION_COPY.details}: ${name}`));
    }
    content.appendChild(controls); row.appendChild(content); list.appendChild(row);
  }
  document.getElementById('selection-empty').hidden = review.length !== 0;
  document.getElementById('selection-clear').hidden = review.length === 0;
  if (!review.length) document.getElementById('selection-clear-confirm').hidden = true;
  const summary = getSelectionSummary(review);
  document.getElementById('selection-valid-units').textContent = summary.validUnits;
  document.getElementById('selection-subtotal').textContent = summary.subtotalCents === null ? SELECTION_COPY.unavailable : formatUsdCents(summary.subtotalCents);
  const subtotalMessage = document.getElementById('selection-subtotal-message');
  subtotalMessage.textContent = summary.subtotalCents === null ? SELECTION_COPY.unsafe : '';
  subtotalMessage.hidden = summary.subtotalCents !== null;
  const storageMessage = document.getElementById('selection-storage-message');
  storageMessage.textContent = selectionPersistence.mode === 'protected' ? SELECTION_COPY.protected : selectionPersistence.mode === 'memory-only' ? SELECTION_COPY.memoryOnly : '';
  storageMessage.hidden = !storageMessage.textContent;
  setInquiryActionStatus('');
  updateInquiryAvailability();
  if (panel.classList.contains('show') && (focusKey !== null || !review.length)) focusSelectionControl(focusKey, focusAction);
}

function openMySelection() {
  if (pendingSelectionDetails) return;
  initializeSelectionPersistence();
  renderMySelection();
  bootstrap.Offcanvas.getOrCreateInstance(document.getElementById('mySelection')).show(document.getElementById('selection-indicator'));
}

function openSelectionDetails(key, edit) {
  const index = findSelectionIndex(key);
  if (index < 0 || pendingSelectionDetails) return;
  if (!products.some(product => product.id === selectedItems[index].productId)) return;
  pendingSelectionDetails = { key, edit };
  selectionDetailsReturn = { key, action: edit ? 'edit' : 'details', ready: false, scheduled: false, waitForModal: null };
  bootstrap.Offcanvas.getOrCreateInstance(document.getElementById('mySelection')).hide();
}

function queueSelectionPanelReturn() {
  const context = selectionDetailsReturn;
  if (!context || !context.ready || context.scheduled || context.waitForModal) return;
  context.scheduled = true;
  requestAnimationFrame(() => {
    context.scheduled = false;
    if (selectionDetailsReturn !== context || document.querySelector('.modal.show, .modal[aria-modal="true"]')) return;
    selectionDetailsReturn = null;
    selectionPanelFocus = { key: context.key, action: context.action };
    openMySelection();
  });
}

function initializeMySelection() {
  const panel = document.getElementById('mySelection');
  if (panel._selectionBound) return;
  panel._selectionBound = true;
  document.getElementById('selection-indicator').addEventListener('click', openMySelection);
  panel.addEventListener('shown.bs.offcanvas', () => {
    document.getElementById('selection-indicator').setAttribute('aria-expanded', 'true');
    if (selectionPanelFocus) { focusSelectionControl(selectionPanelFocus.key, selectionPanelFocus.action); selectionPanelFocus = null; }
    restoreInquiryConsentFocus();
  });
  panel.addEventListener('hidden.bs.offcanvas', () => {
    document.getElementById('selection-indicator').setAttribute('aria-expanded', 'false');
    document.getElementById('selection-clear-confirm').hidden = true;
    const pending = pendingSelectionDetails; pendingSelectionDetails = null;
    if (inquiryConsent && inquiryConsent.phase === 'closing-panel') {
      requestAnimationFrame(showInquiryConsent);
      return;
    }
    requestAnimationFrame(() => {
      if (!pending) {
        if (!document.querySelector('.modal.show, .modal[aria-modal="true"]') && canReceiveFocus(document.getElementById('selection-indicator'))) document.getElementById('selection-indicator').focus({ preventScroll: true });
        return;
      }
      const index = findSelectionIndex(pending.key);
      if (index < 0) { selectionDetailsReturn.ready = true; queueSelectionPanelReturn(); return; }
      const item = selectedItems[index];
      openProductModal(item.productId, document.getElementById('selection-indicator'));
      if (!pending.edit) return;
      selectionEditKey = pending.key;
      for (const { group, inputs } of modalSelection.groups) {
        const selected = item.variants.find(selected => selected.groupId === group.id);
        const ids = selected ? selected.optionIds : [];
        if (group.selection === 'single' && ids.length > 1) continue;
        inputs.forEach(input => { input.checked = !input.disabled && ids.includes(input.value); });
      }
      document.getElementById('modal-selection-action-label').textContent = SELECTION_COPY.save;
      document.getElementById('modal-add-to-cart').setAttribute('aria-label', `${SELECTION_COPY.save}: ${localizedProduct(products.find(product => product.id === item.productId)).name}`);
      document.getElementById('selection-edit-note').textContent = SELECTION_COPY.editNote;
      document.getElementById('selection-edit-note').hidden = false;
      updateModalConfiguration(true);
    });
  });
  document.addEventListener('hidden.bs.modal', event => {
    if (!selectionDetailsReturn) return;
    if (selectionDetailsReturn.waitForModal === event.target) selectionDetailsReturn.waitForModal = null;
    queueSelectionPanelReturn();
  });
  panel.addEventListener('click', event => {
    const button = event.target.closest('[data-selection-action]');
    if (!button || button.disabled) return;
    const key = button.getAttribute('data-selection-key');
    const action = button.getAttribute('data-selection-action');
    if (action === 'edit' || action === 'details') openSelectionDetails(key, action === 'edit');
    else if (['remove', 'increase', 'decrease'].includes(action)) {
      const changed = action === 'remove' ? removeSelectionItem(key) : changeSelectionQuantity(key, action === 'increase' ? 1 : -1);
      if (!changed) announceSelection(SELECTION_COPY.invalidAction);
    }
  });
  document.getElementById('selection-clear').addEventListener('click', () => {
    document.getElementById('selection-clear-confirm').hidden = false;
    document.getElementById('selection-cancel-clear').focus({ preventScroll: true });
  });
  document.getElementById('selection-cancel-clear').addEventListener('click', () => {
    document.getElementById('selection-clear-confirm').hidden = true;
    document.getElementById('selection-clear').focus({ preventScroll: true });
  });
  document.getElementById('selection-confirm-clear').addEventListener('click', () => clearSelection(true));
  initializeInquiryForm();
  renderMySelection();
}

/* CAT-IMP-003B: transient customer data; no persistence or automatic sending. */
function resolveInquiryLanguage() {
  return catalogLanguage;
}

function isInquiryDateValid(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return year > 0 && month >= 1 && month <= 12 && day >= 1 && day <= days[month - 1];
}

function validateInquiryCustomer(raw) {
  const data = {}, errors = {};
  for (const field of Object.keys(INQUIRY_FIELDS)) {
    if (raw && raw[field] === undefined && field !== 'name') { data[field] = ''; continue; }
    if (!raw || typeof raw[field] !== 'string') { errors[field] = field === 'name' ? INQUIRY_UI.name : INQUIRY_UI.text; continue; }
    const value = raw[field].replace(/\r\n?/g, '\n');
    const controls = field === 'comments' ? /[\u0000-\u0008\u000b-\u001f\u007f-\u009f]/ : /[\u0000-\u001f\u007f-\u009f]/;
    const brokenUnicode = /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(^|[^\uD800-\uDBFF])[\uDC00-\uDFFF]/;
    if (controls.test(value) || brokenUnicode.test(value)) errors[field] = INQUIRY_UI.text;
    else if (INQUIRY_LIMITS[field] && value.length > INQUIRY_LIMITS[field]) errors[field] = INQUIRY_UI.length(INQUIRY_LIMITS[field]);
    data[field] = value.trim();
  }
  if (!errors.name && !data.name) errors.name = INQUIRY_UI.name;
  if (!errors.eventDate && (raw.eventDateBadInput || (data.eventDate && !isInquiryDateValid(data.eventDate)))) errors.eventDate = INQUIRY_UI.date;
  return { valid: Object.keys(errors).length === 0, data, errors };
}

function getInquirySelection() {
  const items = [];
  let excludedCount = 0, validUnits = 0, subtotalCents = 0;
  for (const item of getSelectionReview()) {
    if (!item.validForInquiry || !Number.isSafeInteger(item.quantity) || item.quantity < 1) { excludedCount++; continue; }
    const lineTotalCents = getSelectionLineTotalCents(item);
    if (lineTotalCents === null || subtotalCents > Number.MAX_SAFE_INTEGER - lineTotalCents ||
        validUnits > Number.MAX_SAFE_INTEGER - item.quantity) {
      return { valid: false, reason: INQUIRY_UI.overflow, items: [], excludedCount };
    }
    const product = products.find(product => product.id === item.productId);
    items.push({ ...item, product, lineTotalCents });
    validUnits += item.quantity;
    subtotalCents += lineTotalCents;
  }
  return { valid: items.length > 0, reason: items.length ? '' : INQUIRY_UI.empty, items, excludedCount, validUnits, subtotalCents };
}

function buildInquiryMessage(rawCustomer, language = resolveInquiryLanguage()) {
  const customer = validateInquiryCustomer(rawCustomer);
  const selection = getInquirySelection();
  if (!customer.valid || !selection.valid) return { valid: false, errors: customer.errors, error: selection.reason };
  language = language === 'es' ? 'es' : 'en';
  const text = INQUIRY_MESSAGES[language], data = customer.data;
  const lines = [text.greeting, '', `${text.name}: ${data.name}`];
  if (data.company) lines.push(`${text.company}: ${data.company}`);
  if (data.eventDate) {
    const [year, month, day] = data.eventDate.split('-');
    lines.push(`${text.date}: ${language === 'es' ? `${day}/${month}/${year}` : data.eventDate}`);
  }
  lines.push('', `${text.products}:`);
  for (const [index, item] of selection.items.entries()) {
    lines.push('', `${index + 1}. ${localizedProduct(item.product, language).name}`);
    for (const configured of item.variants) {
      const group = item.product.variants.find(group => group.id === configured.groupId);
      lines.push(`  ${group.label[language]}: ${configured.optionIds.map(id => group.options.find(option => option.id === id).label[language]).join(', ')}`);
    }
    lines.push(`  ${text.quantity}: ${item.quantity}`, `  ${text.unit}: ${formatUsdCents(item.currentUnitPriceCents)} USD`,
      `  ${text.line}: ${formatUsdCents(item.lineTotalCents)} USD`);
  }
  lines.push('', `${text.subtotal}: ${formatUsdCents(selection.subtotalCents)} USD`);
  if (data.comments) lines.push('', `${text.comments}:`, data.comments);
  const message = lines.join('\n');
  const url = `https://wa.me/${INQUIRY_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  if (message.length > INQUIRY_LIMITS.message || url.length > INQUIRY_LIMITS.url) return { valid: false, errors: {}, error: INQUIRY_UI.tooLong };
  return { valid: true, errors: {}, message, url, language };
}

function readInquiryCustomer() {
  const raw = {};
  for (const [field, id] of Object.entries(INQUIRY_FIELDS)) raw[field] = document.getElementById(id).value;
  raw.eventDateBadInput = Boolean(document.getElementById(INQUIRY_FIELDS.eventDate).validity?.badInput);
  return raw;
}

function showInquiryFieldErrors(errors, revealAll = false) {
  for (const [field, id] of Object.entries(INQUIRY_FIELDS)) {
    const input = document.getElementById(id), error = document.getElementById(`${id}-error`);
    if (revealAll) input._inquiryTouched = true;
    const message = input._inquiryTouched ? errors[field] || '' : '';
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    error.textContent = catalogText(message); error.hidden = !message;
  }
}

function updateInquiryAvailability() {
  if (!document.getElementById('selection-inquiry-form')) return;
  const customer = validateInquiryCustomer(readInquiryCustomer()), selection = getInquirySelection();
  showInquiryFieldErrors(customer.errors);
  document.getElementById('inquiry-whatsapp').disabled = !customer.valid || !selection.valid;
  document.getElementById('inquiry-copy').disabled = inquiryCopyPending || !customer.valid || !selection.valid;
  const message = document.getElementById('inquiry-selection-message');
  message.textContent = selection.reason || (selection.excludedCount ? INQUIRY_UI.excluded(selection.excludedCount) : '');
  message.hidden = !message.textContent;
  document.getElementById('inquiry-form-hint').textContent = customer.valid ? INQUIRY_UI.ready : INQUIRY_UI.hint;
}

function setInquiryActionStatus(message) {
  document.getElementById('inquiry-action-status').textContent = message;
}

function prepareInquiryAction() {
  const result = buildInquiryMessage(readInquiryCustomer());
  showInquiryFieldErrors(result.errors, true);
  if (!result.valid) {
    const message = document.getElementById('inquiry-selection-message');
    message.textContent = result.error || ''; message.hidden = !message.textContent;
    const field = Object.keys(INQUIRY_FIELDS).find(field => result.errors[field]);
    const target = field ? document.getElementById(INQUIRY_FIELDS[field]) : message;
    target.focus();
  }
  return result;
}

function openInquiryWhatsApp(event) {
  event.preventDefault();
  requestInquiryConsent('whatsapp');
}

function copyInquiryMessage() {
  requestInquiryConsent('copy');
}

function requestInquiryConsent(action) {
  if (inquiryConsent || inquiryConsentPanelReturn || inquiryCopyPending || !['whatsapp', 'copy'].includes(action)) return;
  setInquiryActionStatus('');
  const result = prepareInquiryAction();
  if (!result.valid) return;
  inquiryConsent = { action, triggerId: action === 'copy' ? 'inquiry-copy' : 'inquiry-whatsapp', phase: 'closing-panel', validation: null };
  const panel = document.getElementById('mySelection');
  if (panel.classList.contains('show')) bootstrap.Offcanvas.getOrCreateInstance(panel).hide();
  else showInquiryConsent();
}

function showInquiryConsent() {
  if (!inquiryConsent || inquiryConsent.phase !== 'closing-panel') return;
  inquiryConsent.phase = 'waiting';
  document.getElementById('inquiry-consent-accept').disabled = false;
  bootstrap.Modal.getOrCreateInstance(document.getElementById('inquiryConsentModal')).show();
}

function acceptInquiryConsent() {
  if (!inquiryConsent || inquiryConsent.phase !== 'waiting') return;
  // Consume this operation before executing anything; repeated clicks cannot repeat it.
  inquiryConsent.phase = 'accepted';
  document.getElementById('inquiry-consent-accept').disabled = true;
  const result = buildInquiryMessage(readInquiryCustomer());
  if (!result.valid) inquiryConsent.validation = result;
  else if (inquiryConsent.action === 'whatsapp') executeInquiryWhatsApp(result);
  else executeInquiryCopy(result);
  bootstrap.Modal.getOrCreateInstance(document.getElementById('inquiryConsentModal')).hide();
}

function executeInquiryWhatsApp(result) {
  try {
    // Called synchronously by the acceptance click, before any modal transition or await.
    window.open(result.url, '_blank', 'noopener,noreferrer');
    setInquiryActionStatus(INQUIRY_UI.opening);
  } catch { setInquiryActionStatus(INQUIRY_UI.openFailed); }
}

async function executeInquiryCopy(result) {
  inquiryCopyPending = true;
  updateInquiryAvailability();
  try {
    if (!window.navigator?.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await window.navigator.clipboard.writeText(result.message);
    setInquiryActionStatus(INQUIRY_UI.copied);
  } catch { setInquiryActionStatus(INQUIRY_UI.copyFailed); }
  finally { inquiryCopyPending = false; updateInquiryAvailability(); }
}

function restoreInquiryConsentFocus() {
  const context = inquiryConsentPanelReturn;
  if (!context) return;
  inquiryConsentPanelReturn = null;
  if (context.validation) {
    const current = buildInquiryMessage(readInquiryCustomer());
    showInquiryFieldErrors(current.errors, true);
    const message = document.getElementById('inquiry-selection-message');
    message.textContent = current.error || ''; message.hidden = !message.textContent;
    const field = Object.keys(INQUIRY_FIELDS).find(field => current.errors[field]);
    if (current.valid) {
      setInquiryActionStatus(catalogText('The inquiry changed. Please review it and try again.'));
      document.getElementById(context.triggerId).focus();
    } else (field ? document.getElementById(INQUIRY_FIELDS[field]) : message).focus();
    return;
  }
  const target = [document.getElementById(context.triggerId), document.getElementById('selection-close')].find(canReceiveFocus);
  if (target) target.focus({ preventScroll: true });
}

function initializeInquiryForm() {
  const form = document.getElementById('selection-inquiry-form');
  if (form._inquiryBound) return;
  form._inquiryBound = true;
  form.addEventListener('submit', openInquiryWhatsApp);
  document.getElementById('inquiry-copy').addEventListener('click', copyInquiryMessage);
  const modal = document.getElementById('inquiryConsentModal');
  modal.addEventListener('shown.bs.modal', () => document.getElementById('inquiry-consent-reject').focus());
  modal.addEventListener('hidden.bs.modal', () => {
    const context = inquiryConsent;
    inquiryConsent = null;
    if (!context) return;
    inquiryConsentPanelReturn = { triggerId: context.triggerId, validation: context.validation };
    requestAnimationFrame(() => {
      const status = document.getElementById('inquiry-action-status').textContent;
      openMySelection();
      setInquiryActionStatus(status);
    });
  });
  document.getElementById('inquiry-consent-accept').addEventListener('click', acceptInquiryConsent);
  for (const id of Object.values(INQUIRY_FIELDS)) {
    const input = document.getElementById(id);
    const refresh = () => { setInquiryActionStatus(''); updateInquiryAvailability(); };
    input.addEventListener('input', refresh);
    input.addEventListener('change', refresh);
    input.addEventListener('blur', () => { input._inquiryTouched = true; updateInquiryAvailability(); });
  }
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
    filtered = filtered.filter(p => {
      const english = localizedProduct(p, 'en');
      const spanish = localizedProduct(p, 'es');
      return [english.name, english.shortDescription, english.category, english.flavor,
        spanish.name, spanish.shortDescription, spanish.category, spanish.flavor]
        .some(text => text.toLowerCase().includes(q));
    });
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

function validateCatalogTaxonomy(taxonomy = catalogTaxonomy, catalogProducts = products) {
  const errors = [];
  if (!taxonomy || typeof taxonomy !== 'object' || Array.isArray(taxonomy)) errors.push('Taxonomy must be an object.');
  for (const [key, field] of [['categories', 'category'], ['flavors', 'flavor']]) {
    const entries = taxonomy && taxonomy[key];
    if (!Array.isArray(entries)) { errors.push(`${key} must be an array.`); continue; }
    const values = new Set(), normalized = new Map();
    Array.from(entries).forEach((entry, index) => {
      if (!entry || typeof entry !== 'object' || Array.isArray(entry) ||
          typeof entry.value !== 'string' || !entry.value.trim()) {
        errors.push(`${key}[${index}] requires a nonempty string value.`);
        return;
      }
      const value = entry.value;
      if (value !== value.trim()) errors.push(`${key}: surrounding whitespace in value ${JSON.stringify(value)}.`);
      if (values.has(value)) errors.push(`${key}: duplicate value ${JSON.stringify(value)}.`);
      const canonical = value.trim().toLowerCase();
      if (normalized.has(canonical) && normalized.get(canonical) !== value) {
        errors.push(`${key}: identifiers differ only by case or whitespace: ${JSON.stringify(value)}.`);
      }
      values.add(value);
      normalized.set(canonical, value);
      for (const language of ['en', 'es']) {
        if (!entry.label || typeof entry.label !== 'object' || Array.isArray(entry.label) || typeof entry.label[language] !== 'string' ||
            !entry.label[language].trim()) errors.push(`${key}: ${JSON.stringify(value)} requires label.${language}.`);
      }
    });
    if (Array.isArray(catalogProducts)) catalogProducts.forEach(product => {
      if (!product || !values.has(product[field])) {
        const value = product && product[field];
        const similar = typeof value === 'string' && normalized.get(value.trim().toLowerCase());
        errors.push(`Product ${product && product.id}: unknown ${field} ${JSON.stringify(value)}${similar ? `; expected ${JSON.stringify(similar)}` : ''}.`);
      }
    });
  }
  if (!Array.isArray(catalogProducts)) errors.push('Products must be an array.');
  return { valid: errors.length === 0, errors };
}

let catalogTaxonomyDiagnostic = '';

// Reconcile options in place: language/count changes retain the actual input and its focus.
// Counts include the entire catalog, independently of active filters and availability.
function syncFilterControls() {
  const validation = validateCatalogTaxonomy();
  const diagnostic = validation.errors.join('\n');
  if (diagnostic && diagnostic !== catalogTaxonomyDiagnostic) console.warn('Montfrut Catalog taxonomy:\n' + diagnostic);
  catalogTaxonomyDiagnostic = diagnostic;
  const active = document.activeElement;
  const focusedGroup = active && active.closest('.filter-group[data-filter-field]');
  for (const field of ['category', 'flavor']) {
    const counts = new Map();
    for (const product of products) counts.set(product[field], (counts.get(product[field]) || 0) + 1);
    const entries = getCatalogTaxonomyEntries(field).filter(entry => counts.has(entry.value));
    const values = new Set(entries.map(entry => entry.value));
    // Retired definitions/products must not leave an invisible active filter behind.
    if (field === 'category') activeCategories = activeCategories.filter(value => values.has(value));
    else activeFlavors = activeFlavors.filter(value => values.has(value));
    const selected = field === 'category' ? activeCategories : activeFlavors;
    document.querySelectorAll(`.filter-group[data-filter-field="${field}"]`).forEach(group => {
      const existing = new Map(Array.from(group.querySelectorAll('.filter-check')).map(label =>
        [label.querySelector('input').value, label]));
      entries.forEach((entry, index) => {
        let label = existing.get(entry.value);
        if (!label) {
          label = document.createElement('label');
          label.className = 'filter-check';
          label.setAttribute('data-catalog-filter-option', '');
          const input = document.createElement('input');
          input.setAttribute('type', 'checkbox');
          input.className = `filter-${field}${group.closest('#filtersOffcanvas') ? '-oc' : ''}`;
          input.value = entry.value;
          label.appendChild(input);
          for (const className of ['filter-check__label', 'filter-check__count']) {
            const span = document.createElement('span');
            span.className = className;
            label.appendChild(span);
          }
        }
        label.querySelector('input').checked = selected.includes(entry.value);
        const text = catalogTaxonomyLabel(field, entry.value);
        const textNode = label.querySelector('.filter-check__label');
        if (textNode.textContent !== text) textNode.textContent = text;
        label.querySelector('.filter-check__count').textContent = counts.get(entry.value);
        const position = group.querySelectorAll('.filter-check')[index];
        if (position !== label) group.insertBefore(label, position || null);
      });
      for (const [value, label] of existing) if (!values.has(value)) label.remove();
    });
  }
  if (focusedGroup && (!active.isConnected || document.activeElement !== active)) {
    const fallback = active.isConnected ? active :
      focusedGroup.querySelector('input') || focusedGroup.querySelector('.filter-group__heading');
    if (fallback) {
      if (fallback.tagName !== 'INPUT') fallback.setAttribute('tabindex', '-1');
      fallback.focus({ preventScroll: true });
    }
  }
}

function updateFilters() {
  document.querySelectorAll('.filter-group[data-filter-field]').forEach(group => {
    if (group._catalogFilterBound) return;
    group._catalogFilterBound = true;
    group.addEventListener('change', event => {
      const cb = event.target;
      if (!cb.matches('input[type="checkbox"]') || !group.contains(cb)) return;
      const field = group.getAttribute('data-filter-field');
      if (!getCatalogTaxonomyEntries(field).some(entry => entry.value === cb.value)) return;
      if (field === 'category') {
        activeCategories = activeCategories.filter(value => value !== cb.value);
        if (cb.checked) activeCategories.push(cb.value);
      } else {
        activeFlavors = activeFlavors.filter(value => value !== cb.value);
        if (cb.checked) activeFlavors.push(cb.value);
      }
      renderProductGrid();
    });
  });
}

function clearFilters() {
  activeCategories = [];
  activeFlavors = [];
  renderProductGrid();
}


/* --------------------------------------------------------------------------
   5. RENDER HELPERS
   -------------------------------------------------------------------------- */

function allergyTagsHTML(tags) {
  return tags.map(tag => `<span class="allergy-tag">${catalogText(tag)}</span>`).join('');
}

function availabilityHTML(product) {
  const message = getAvailabilityMessage(product);
  return message ? `<p class="selection-status">${message}</p>` : '';
}

function renderProductCard(product) {
  product = localizedProduct(product);
  return `
    <div class="product-card" data-id="${product.id}">
      <div class="product-card__img-wrap">
        <img src="${product.image}" alt="${product.name}" class="product-card__img" loading="lazy">
        ${product.isBestSeller ? `<span class="product-card__badge badge-bestseller">${catalogText('Best Seller')}</span>` : ''}
      </div>
      <div class="product-card__body">
        <h3 class="product-card__name">${product.name}</h3>
        <p class="product-card__desc">${product.shortDescription}</p>
        <div class="product-card__tags">${allergyTagsHTML(product.allergyTags)}</div>
        ${availabilityHTML(product)}
        <div class="product-card__footer">
          <span class="product-card__price">${formatUsdCents(usdToCents(product.price))}</span>
          <div class="product-card__actions">
            <button class="btn-add-to-cart" data-id="${product.id}" aria-label="${catalogText('Add {name} to selection', { name: product.name })}"${getAvailabilityMessage(product) ? ' disabled' : ''}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              ${catalogText('Add to Selection')}
            </button>
            <button class="btn-details" data-id="${product.id}" aria-label="${catalogText('View details for {name}', { name: product.name })}">${catalogText('Details')}</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderBestSellerCard(product) {
  product = localizedProduct(product);
  return `
    <div class="bestseller-card">
      <div class="bestseller-card__badge">${catalogText('BEST SELLER')}</div>
      <div class="bestseller-card__img-wrap">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="bestseller-card__body">
        <h3 class="bestseller-card__name">${product.name}</h3>
        <p class="bestseller-card__desc">${product.shortDescription}</p>
        <div class="bestseller-card__tags">${allergyTagsHTML(product.allergyTags)}</div>
        ${availabilityHTML(product)}
        <div class="bestseller-card__price">${formatUsdCents(usdToCents(product.price))}</div>
        <button class="btn-add-to-cart btn-add-to-cart--light" data-id="${product.id}" aria-label="${catalogText('Add {name} to selection', { name: product.name })}"${getAvailabilityMessage(product) ? ' disabled' : ''}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          ${catalogText('Add to Selection')}
        </button>
        <button class="btn-details btn-details--light mt-2" data-id="${product.id}" aria-label="${catalogText('View details for {name}', { name: product.name })}">${catalogText('Details')}</button>
      </div>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   6. RENDER PRODUCT GRID
   -------------------------------------------------------------------------- */

function renderProductGrid() {
  console.log('Montfrut Catalog: Rendering product grid...');
  syncFilterControls();
  const filtered = getFilteredProducts();
  const gridWrap = document.getElementById('catalog-grid-wrap');
  const noResults = document.getElementById('no-results');
  const bestSellerSlot = document.getElementById('bestseller-slot');
  const bestSeller = bestSellerSlot ? filtered.find(p => p.isBestSeller) : null;

  // Remove old dynamic cards
  gridWrap.querySelectorAll('.product-card').forEach(el => el.remove());

  // Best seller card
  if (bestSellerSlot) {
    const shouldShow = Boolean(bestSeller);
    bestSellerSlot.innerHTML = shouldShow ? renderBestSellerCard(bestSeller) : '';
    bestSellerSlot.style.display = shouldShow ? '' : 'none';
  }

  // Exclude only the featured product; additional best sellers remain visible.
  const regularProducts = filtered.filter(p => !bestSeller || p.id !== bestSeller.id);

  if (filtered.length === 0) {
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
let carouselInterval = null;
let carouselPaused = false;
let carouselHovered = false;
let carouselSuspended = false;
const carouselMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

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
  const active = document.activeElement;
  const focusedProductId = track.contains(active) ? active.getAttribute('data-id') : null;

  track.innerHTML = specialProducts.map(product => {
    const p = localizedProduct(product);
    return `
    <div class="special-item" role="listitem">
      <div class="special-item__img-wrap">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
      </div>
      <div class="special-item__body">
        <h4 class="special-item__name">${p.name}</h4>
        <p class="special-item__desc">${p.shortDescription}</p>
        ${availabilityHTML(p)}
        <div class="special-item__footer">
          <span class="special-item__price">${formatUsdCents(usdToCents(p.price))}</span>
          <button class="btn-details btn-details--mini" data-id="${p.id}" aria-label="${catalogText('View details for {name}', { name: p.name })}">${catalogText('Details')}</button>
        </div>
      </div>
    </div>
  `;
  }).join('');

  carouselIndex = Math.min(carouselIndex, Math.max(0, specialProducts.length - getVisibleSpecialItems()));
  moveCarousel(0);
  if (focusedProductId !== null) {
    const replacement = Array.from(track.querySelectorAll('.btn-details')).find(button =>
      button.getAttribute('data-id') === focusedProductId);
    (replacement || document.getElementById('special-heading')).focus({ preventScroll: true });
  }
}

function updateCarouselButtons(total) {
  const btnPrev = document.getElementById('special-prev');
  const btnNext = document.getElementById('special-next');
  if (!btnPrev || !btnNext) return;

  const visibleItems = getVisibleSpecialItems();
  btnPrev.disabled = carouselIndex === 0;
  btnNext.disabled = carouselIndex >= Math.max(0, total - visibleItems);
  startCarouselAutoPlay();
  const active = document.activeElement;
  if ((active === btnPrev && btnPrev.disabled) || (active === btnNext && btnNext.disabled)) {
    const fallback = [btnPrev, btnNext, document.getElementById('special-playback'),
      document.getElementById('special-heading')].find(canReceiveFocus);
    if (fallback) fallback.focus({ preventScroll: true });
  }
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

// One timer, with an explicit pause that survives focus, navigation, resize and language changes.
function startCarouselAutoPlay() {
  stopCarouselAutoPlay();
  const track = document.getElementById('special-track');
  const viewport = track && track.parentElement;
  const canScroll = products.filter(p => p.isSpecialCollection).length > getVisibleSpecialItems() &&
    (!viewport || !viewport.clientWidth || track.scrollWidth > viewport.clientWidth + 1);
  const button = document.getElementById('special-playback');
  if (button) {
    button.hidden = !canScroll || carouselMotionQuery.matches;
    button.textContent = catalogText(carouselPaused ? 'Resume' : 'Pause');
    button.setAttribute('aria-label', catalogText(carouselPaused ? 'Resume special collection' : 'Pause special collection'));
    if (button.hidden && document.activeElement === button) {
      document.getElementById('special-heading').focus({ preventScroll: true });
    }
  }
  if (!canScroll || carouselMotionQuery.matches || carouselPaused || carouselHovered ||
      carouselSuspended || document.hidden) return;
  carouselInterval = setInterval(() => moveCarousel(1), 4000);
}

function stopCarouselAutoPlay() {
  if (carouselInterval !== null) clearInterval(carouselInterval);
  carouselInterval = null;
}

function pauseCarousel() {
  carouselPaused = true;
  startCarouselAutoPlay();
}

function initializeSpecialCarousel() {
  const section = document.getElementById('special-collection');
  if (!section || section._catalogCarouselBound) return;
  section._catalogCarouselBound = true;
  carouselPaused = carouselMotionQuery.matches;
  section.addEventListener('focusin', () => {
    pauseCarousel();
    // Bring a keyboard-focused card into view without changing focus or native tab order.
    const track = document.getElementById('special-track');
    const items = Array.from(track.children);
    const index = items.findIndex(item => item.contains(document.activeElement));
    if (index >= 0) {
      const visible = getVisibleSpecialItems();
      if (index < carouselIndex) carouselIndex = index;
      else if (index >= carouselIndex + visible) carouselIndex = index - visible + 1;
      moveCarousel(0);
      track.parentElement.scrollLeft = 0;
    }
  });
  section.addEventListener('mouseenter', () => {
    carouselHovered = true;
    startCarouselAutoPlay();
  });
  section.addEventListener('mouseleave', () => {
    carouselHovered = false;
    startCarouselAutoPlay();
  });
  const playback = document.getElementById('special-playback');
  let pointerPauseAction = null;
  playback.addEventListener('pointerdown', () => {
    // Focus pauses before click; retain the action the pointer user actually pressed.
    pointerPauseAction = !carouselPaused;
  });
  playback.addEventListener('pointercancel', () => { pointerPauseAction = null; });
  playback.addEventListener('click', event => {
    carouselPaused = event.detail > 0 && pointerPauseAction !== null ? pointerPauseAction : !carouselPaused;
    pointerPauseAction = null;
    startCarouselAutoPlay();
  });
  const motionChanged = () => {
    // Returning to normal motion also requires an explicit resume.
    pauseCarousel();
  };
  if (carouselMotionQuery.addEventListener) carouselMotionQuery.addEventListener('change', motionChanged);
  else if (carouselMotionQuery.addListener) carouselMotionQuery.addListener(motionChanged);
  document.addEventListener('visibilitychange', startCarouselAutoPlay);
  window.addEventListener('pagehide', () => {
    carouselSuspended = true;
    pauseCarousel();
  });
  window.addEventListener('pageshow', () => {
    carouselSuspended = false;
    startCarouselAutoPlay();
  });
  startCarouselAutoPlay();
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
  if (selectionDetailsReturn) {
    selectionDetailsReturn.ready = true;
    if (state && state.nextModalEvent && !state.nextModalEvent.defaultPrevented) selectionDetailsReturn.waitForModal = state.nextModalEvent.target;
    queueSelectionPanelReturn();
    return;
  }
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
    legend.textContent = `${variantLabel(group.label)} (${catalogText(group.required ? 'Required' : 'Optional')})`;
    fieldset.appendChild(legend);
    const hint = document.createElement('p');
    hint.className = 'modal-text';
    hint.id = `variant-hint-${groupIndex}`;
    hint.textContent = catalogText(group.selection === 'single' ? 'Choose one option.' : 'Choose one or more options.');
    if (!group.required) hint.textContent += ` ${catalogText('You may leave this group unselected.')}`;
    fieldset.appendChild(hint);
    const error = document.createElement('p');
    error.id = `variant-error-${groupIndex}`;
    error.className = 'selection-validation';
    error.setAttribute('aria-live', 'polite');
    error.hidden = true;
    const controls = { group, fieldset, error, legend, hint, labels: [], inputs: [] };
    // Optional radio groups include an explicit way to return to no extras.
    const options = group.selection === 'single' && !group.required
      ? [{ id: '', label: { en: 'No extra', es: 'Sin adicional' }, priceAdjustment: 0, available: true }, ...group.options]
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
      text.textContent = `${variantLabel(option.label)}${price}${input.disabled ? ` — ${catalogText('Unavailable')}` : ''}`;
      label.appendChild(input);
      label.appendChild(text);
      fieldset.appendChild(label);
      controls.inputs.push(input);
      controls.labels.push({ option, text, input });
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
    error.textContent = catalogText(message);
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
  status.textContent = availability || (modalSelection.attempted ? catalogText(result.error) : '');
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
  const added = selectionEditKey ? replaceSelectionConfiguration(selectionEditKey, result.configuration)
    : addToSelection(modalSelection.productId, result.configuration);
  if (added.valid && selectionEditKey) {
    if (selectionDetailsReturn) selectionDetailsReturn.key = added.key;
    selectionEditKey = null;
    bootstrap.Modal.getOrCreateInstance(document.getElementById('productModal')).hide();
  }
  if (!added.valid) {
    const message = document.getElementById('modal-selection-message');
    message.textContent = catalogText(added.error);
    message.hidden = false;
  }
}

function openProductModal(productId, trigger = null) {
  const original = products.find(p => p.id === productId);
  if (!original) return;
  const product = localizedProduct(original);
  const origin = trigger || document.activeElement;
  selectionEditKey = null;
  document.getElementById('modal-selection-action-label').textContent = SELECTION_COPY.add;
  document.getElementById('selection-edit-note').hidden = true;

  // Populate modal fields
  document.getElementById('modal-title').textContent = product.name;
  document.getElementById('modal-price').textContent = formatUsdCents(usdToCents(product.price));
  document.getElementById('modal-description').textContent = product.longDescription;
  document.getElementById('modal-tags').innerHTML = allergyTagsHTML(product.allergyTags) + 
    `<a href="#" class="modal-allergy-link" data-bs-toggle="modal" data-bs-target="#allergiesModal">${catalogText('Allergies information')}</a>`;
  document.getElementById('modal-flavor-notes').innerHTML = product.flavorNotes.map(n => `<span class="flavor-note">${n}</span>`).join('');
  document.getElementById('modal-ingredients').textContent = product.ingredients;

  // Set up carousel
  const carouselInner = document.getElementById('modal-carousel-inner');
  const carouselIndicators = document.getElementById('modal-carousel-indicators');
  const carouselThumbs = document.getElementById('modal-thumbnails');
  carouselInner.innerHTML = product.galleryImages.map((img, idx) => `
    <div class="carousel-item ${idx === 0 ? 'active' : ''}">
      <img src="${img}" class="d-block w-100 modal-carousel-img" alt="${catalogText('{name} — photo {number}', { name: product.name, number: idx + 1 })}">
    </div>
  `).join('');
  carouselIndicators.innerHTML = product.galleryImages.map((_, idx) => `
    <button type="button" data-bs-target="#modalCarousel" data-bs-slide-to="${idx}" ${idx === 0 ? 'class="active" aria-current="true"' : ''} aria-label="${catalogText('Slide {number}', { number: idx + 1 })}"></button>
  `).join('');
  if (carouselThumbs) {
    carouselThumbs.innerHTML = product.galleryImages.map((img, idx) => `
      <button class="modal-thumbnail ${idx === 0 ? 'active' : ''}" type="button" data-bs-target="#modalCarousel" data-bs-slide-to="${idx}" aria-label="${catalogText('Show {name} photo {number}', { name: product.name, number: idx + 1 })}">
        <img src="${img}" alt="" loading="lazy">
      </button>
    `).join('');
  }

  // Add to cart button in modal
  const modalCartBtn = document.getElementById('modal-add-to-cart');
  modalCartBtn.setAttribute('data-id', product.id);
  modalCartBtn.setAttribute('data-name', product.name);
  modalCartBtn.setAttribute('aria-label', catalogText('Add {name} to selection', { name: product.name }));
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
   12. INIT
   -------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  initializeCatalogLanguage();
  initializeSelectionPersistence();
  updateSelectionCount();
  showSelectionPersistenceNotice();
  initializeMySelection();
  document.addEventListener('show.bs.modal', trackProductModalFocus);
  document.getElementById('productModal').addEventListener('hidden.bs.modal', () => {
    modalSelection = null;
    selectionEditKey = null;
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

  // Special collection carousel buttons
  const btnPrev = document.getElementById('special-prev');
  const btnNext = document.getElementById('special-next');
  if (btnPrev) btnPrev.addEventListener('click', () => {
    pauseCarousel();
    moveCarousel(-1);
  });
  if (btnNext) btnNext.addEventListener('click', () => {
    pauseCarousel();
    moveCarousel(1);
  });
  
  initializeSpecialCarousel();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      renderSpecialCollection();
    }, 150);
  }, { passive: true });

  // Smooth scroll for internal anchors
  document.querySelectorAll('a[href^="#"], a[href=""]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const fragment = link.getAttribute('href');
      if (!fragment || fragment === '#') return;
      let id;
      try { id = decodeURIComponent(fragment.slice(1)); } catch { return; }
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Navbar scroll effect
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
});
