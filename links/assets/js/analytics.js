/** Links only. Regional eligibility is provided by the shared consent manager.
 * Before publishing, disable Enhanced Measurement in this GA4 web stream.
 * Otherwise its automatic link_url events can expose the WhatsApp destination.
 */
(() => {
  'use strict';
  if (window.MontfrutLinksAnalyticsInitialized) return;
  window.MontfrutLinksAnalyticsInitialized = true;

  const measurementId = 'G-05PV03EELD';
  const language = document.documentElement.lang === 'es' ? 'es' : 'en';
  const url = new URL(window.location.href);
  const languageAPI = window.MontfrutLanguage;
  const requested = url.searchParams.get('lang');
  // Do not measure the outgoing document during language.js redirects.
  const explicit = ['es', 'en'].includes(requested) ? requested
    : url.pathname.includes('/en/') || url.pathname.endsWith('/index.html') ? language : null;
  if (languageAPI && (explicit || languageAPI.readPreference()
    || languageAPI.detectBrowserLanguage()) !== language) return;

  const production = url.protocol === 'https:'
    && ['montfrut.com', 'www.montfrut.com'].includes(url.hostname)
    && ['/links/', '/links/index.html', '/links/en/', '/links/en/index.html'].includes(url.pathname);
  const manager = window.MontfrutConsent;
  if (!manager) return;
  const buttons = Object.freeze({
    catalog: 'principal', instagram_main: 'principal', website: 'principal',
    whatsapp: 'principal', contact: 'principal', instagram_social: 'social',
    tiktok: 'social', facebook: 'social', linkedin: 'social'
  });
  let allowed = false;
  let loading = false;
  let loaded = false;
  let configured = false;
  let pageViewed = false;
  let pendingClicks = [];
  const denied = {
    analytics_storage: 'denied', ad_storage: 'denied',
    ad_user_data: 'denied', ad_personalization: 'denied'
  };
  const command = (...args) => window.gtag(...args);

  const sendClick = buttonId => command('event', 'montfrut_links_click', {
    send_to: measurementId,
    button_id: buttonId,
    button_group: buttons[buttonId],
    page_language: language
  });
  const enable = () => {
    if (!production || !allowed) return;
    window['ga-disable-' + measurementId] = false;
    if (!loaded) {
      if (loading) return;
      loading = true;
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
      command('consent', 'default', { ...denied });
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
      script.onload = () => { loaded = true; loading = false; enable(); };
      script.onerror = () => {
        loading = false;
        pendingClicks = [];
        script.remove();
      };
      document.head.appendChild(script);
      return;
    }
    command('consent', 'update', { ...denied, analytics_storage: 'granted' });
    if (!configured) {
      command('js', new Date());
      command('config', measurementId, {
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        page_location: 'https://montfrut.com/links/' + (language === 'en' ? 'en/' : ''),
        page_referrer: '',
        page_title: language === 'es' ? 'Montfrut | Links' : 'Montfrut | Links EN',
        ignore_referrer: true
      });
      configured = true;
    }
    if (!pageViewed) {
      command('event', 'page_view', { send_to: measurementId, page_language: language });
      pageViewed = true;
    }
    pendingClicks.forEach(sendClick);
    pendingClicks = [];
  };
  const disable = () => {
    // Google's opt-out flag stops hits even though an already loaded tag remains in memory.
    window['ga-disable-' + measurementId] = true;
    pendingClicks = [];
    if (production && (loaded || loading)) command('consent', 'update', { ...denied });
  };
  const trackClick = event => {
    if (!production || !allowed || event.defaultPrevented) return;
    if (event.type === 'auxclick' && event.button !== 1) return;
    const link = event.target && typeof event.target.closest === 'function'
      ? event.target.closest('a[data-analytics-id]') : null;
    const id = link && link.getAttribute('data-analytics-id');
    if (!Object.prototype.hasOwnProperty.call(buttons, id)) return;
    if (configured && loaded) sendClick(id);
    else if (loading) pendingClicks.push(id);
  };
  // Native click includes keyboard activation; auxclick covers middle-click once.
  document.addEventListener('click', trackClick);
  document.addEventListener('auxclick', trackClick);
  manager.subscribe(state => {
    allowed = state.allowed;
    if (allowed) enable();
    else disable();
  });
})();
