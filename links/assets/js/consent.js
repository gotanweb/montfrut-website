/** Shared same-origin preference. Only US may default to analytics; all other
 * countries, failures and unknown regions require an explicit choice.
 * Country comes exclusively from our server. No client-side country overrides.
 */
(() => {
  'use strict';
  if (window.MontfrutConsent) return;
  const storageKey = 'montfrut.analyticsConsent';
  const language = document.documentElement.lang === 'es' ? 'es' : 'en';
  const normalize = value => ['accepted', 'rejected'].includes(value) ? value : null;
  const read = (fallback = null) => {
    try { return normalize(window.localStorage.getItem(storageKey)); }
    catch { return fallback; }
  };
  let choice = read();
  let country = null;
  let pending = true;
  let storageFailed = false;
  const listeners = new Set();
  const state = () => Object.freeze({
    choice, country, pending,
    allowed: choice === 'accepted' || (choice === null && !pending && country === 'US'
      && window.navigator.globalPrivacyControl !== true),
    requiresConsent: country !== 'US' || window.navigator.globalPrivacyControl === true
  });
  const notice = document.getElementById('analytics-consent');
  const status = document.getElementById('analytics-status');
  const render = () => {
    const current = state();
    if (notice) notice.hidden = choice !== null || pending || !current.requiresConsent;
    if (status) {
      const es = language === 'es';
      status.textContent = choice === 'accepted' ? (es ? 'Estadísticas aceptadas.' : 'Statistics accepted.')
        : choice === 'rejected' ? (es ? 'Estadísticas rechazadas.' : 'Statistics rejected.')
        : current.allowed ? (es ? 'Sin elección explícita: estadísticas habilitadas por la regla regional de Estados Unidos.'
          : 'No explicit choice: statistics enabled under the United States regional rule.')
        : (es ? 'Sin elección explícita: estadísticas desactivadas.' : 'No explicit choice: statistics disabled.');
      if (storageFailed) status.textContent += es
        ? ' No se pudo guardar la elección; se aplica solo en esta página.'
        : ' Your choice could not be saved; it applies only on this page.';
    }
  };
  const notify = () => { render(); listeners.forEach(listener => listener(state())); };
  const choose = value => {
    if (!normalize(value)) return;
    choice = value;
    storageFailed = false;
    try { window.localStorage.setItem(storageKey, value); }
    catch { storageFailed = true; }
    notify();
    // The floating notice disappears after a choice; keep keyboard focus visible.
    if (notice && notice.hidden && notice.contains(document.activeElement)) {
      const privacyLink = document.querySelector('[data-privacy-link]');
      if (privacyLink) privacyLink.focus();
    }
  };
  window.MontfrutConsent = Object.freeze({
    storageKey, getState: state, choose,
    subscribe(listener) { listeners.add(listener); listener(state()); return () => listeners.delete(listener); }
  });
  document.querySelectorAll('[data-consent-choice]').forEach(button => {
    button.addEventListener('click', () => choose(button.getAttribute('data-consent-choice')));
  });
  const refresh = () => { choice = read(choice); notify(); };
  window.addEventListener('storage', event => {
    if (event.key === storageKey || event.key === null) refresh();
  });
  window.addEventListener('pageshow', event => { if (event.persisted) refresh(); });
  render();

  if (typeof window.fetch !== 'function' || typeof AbortController !== 'function') {
    pending = false;
    notify();
    return;
  }

  let settled = false;
  const controller = new AbortController();
  const finish = value => {
    if (settled) return;
    settled = true;
    country = typeof value === 'string' && /^[A-Z]{2}$/.test(value) ? value : null;
    pending = false;
    notify();
  };
  const timeout = window.setTimeout(() => { finish(null); controller.abort(); }, 3000);
  window.fetch('/links/api/region.php', {
    cache: 'no-store', credentials: 'same-origin', signal: controller.signal
  }).then(response => {
    if (!response.ok) throw new Error('Region unavailable');
    return response.json();
  }).then(data => finish(data && data.country))
    .catch(() => finish(null))
    .finally(() => window.clearTimeout(timeout));
})();
