/** Shared same-origin preference. Statistics always require explicit acceptance. */
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
  let storageFailed = false;
  const listeners = new Set();
  const state = () => Object.freeze({
    choice,
    allowed: choice === 'accepted'
  });
  const notice = document.getElementById('analytics-consent');
  const status = document.getElementById('analytics-status');
  const render = () => {
    if (notice) notice.hidden = choice !== null;
    if (status) {
      const es = language === 'es';
      status.textContent = choice === 'accepted' ? (es ? 'Estadísticas aceptadas.' : 'Statistics accepted.')
        : choice === 'rejected' ? (es ? 'Estadísticas rechazadas.' : 'Statistics rejected.')
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
})();
