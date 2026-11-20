/* CAT-SEO-001. Page views only; no form, selection, click or inquiry payloads.
 * Release prerequisite: disable GA4 Enhanced Measurement in the shared stream,
 * including history, outbound links, search and form interactions (see docs).
 */
(() => {
  'use strict';
  if (window.MontfrutCatalogAnalyticsInitialized) return;
  window.MontfrutCatalogAnalyticsInitialized = true;
  const manager = window.MontfrutConsent;
  if (!manager) return;
  const id = 'G-05PV03EELD';
  const production = window.location.protocol === 'https:' &&
    ['montfrut.com', 'www.montfrut.com'].includes(window.location.hostname) &&
    ['/catalog/', '/catalog/index.html', '/catalog/en/', '/catalog/en/index.html'].includes(window.location.pathname);
  let allowed = false, loading = false, loaded = false, configured = false, lastPage = null;
  const denied = { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' };
  const command = (...args) => window.gtag(...args);
  const safePage = () => ({
    page_location: 'https://montfrut.com' + catalogPath(), page_referrer: '',
    page_title: catalogText('Montfrut - Artisan Chocolate Catalog'), page_language: catalogLanguage
  });
  const updateNotice = () => {
    const state = manager.getState();
    const notice = document.getElementById('analytics-consent');
    if (notice && notice.hidden && notice.contains(document.activeElement)) {
      document.getElementById('catalog-language').focus({ preventScroll: true });
    }
    const status = document.getElementById('catalog-analytics-status');
    if (!status) return;
    status.textContent = catalogText(state.choice === 'accepted' ? 'Statistics accepted.' :
      state.choice === 'rejected' ? 'Statistics rejected.' : 'No explicit choice: statistics disabled.');
    let saved = true;
    try { saved = window.localStorage.getItem(manager.storageKey) === state.choice; } catch { saved = false; }
    if (state.choice && !saved) status.textContent += ' ' + catalogText('Your choice could not be saved; it applies only on this page.');
  };
  const enable = () => {
    if (!production || !allowed) return;
    window['ga-disable-' + id] = false;
    if (!loaded) {
      if (loading) return;
      loading = true;
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
      command('consent', 'default', { ...denied });
      const script = document.createElement('script');
      script.async = true;
      script.referrerPolicy = 'no-referrer';
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
      script.onload = () => { loaded = true; loading = false; enable(); };
      script.onerror = () => { loading = false; script.remove(); };
      document.head.appendChild(script);
      return;
    }
    command('consent', 'update', { ...denied, analytics_storage: 'granted' });
    const page = safePage();
    command('set', page);
    if (!configured) {
      command('js', new Date());
      command('config', id, { ...page, send_page_view: false, ignore_referrer: true,
        allow_google_signals: false, allow_ad_personalization_signals: false });
      configured = true;
    }
    if (lastPage !== page.page_location) {
      command('event', 'page_view', { send_to: id, ...page });
      lastPage = page.page_location;
    }
  };
  manager.subscribe(state => {
    allowed = state.allowed;
    updateNotice();
    if (allowed) enable();
    else {
      window['ga-disable-' + id] = true;
      if (production && (loaded || loading)) command('consent', 'update', { ...denied });
    }
  });
  window.addEventListener('montfrut:catalog-language', () => { updateNotice(); enable(); });
})();
