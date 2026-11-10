/**
 * Shared contract: montfrut.language stores only "es" or "en" on this origin.
 * Links uses /links/ as its automatic entry; ?lang=es is an explicit ES URL.
 * Explicit EN URLs and either index.html URL take precedence over detection.
 */
(() => {
  'use strict';

  const storageKey = 'montfrut.language';
  const isSupported = language => language === 'es' || language === 'en';

  const readPreference = () => {
    try {
      const language = window.localStorage.getItem(storageKey);
      return isSupported(language) ? language : null;
    } catch {
      return null;
    }
  };

  const savePreference = language => {
    if (!isSupported(language)) return false;
    try {
      window.localStorage.setItem(storageKey, language);
      return true;
    } catch {
      return false;
    }
  };

  const detectBrowserLanguage = () => {
    const languages = window.navigator.languages && window.navigator.languages.length
      ? window.navigator.languages
      : [window.navigator.language];

    for (const locale of languages) {
      const language = typeof locale === 'string' ? locale.toLowerCase().split('-')[0] : '';
      if (isSupported(language)) return language;
    }
    return 'en';
  };

  // Other modules may adopt this API later; loading it outside Links never redirects.
  window.MontfrutLanguage = Object.freeze({
    storageKey, readPreference, savePreference, detectBrowserLanguage
  });

  const url = new URL(window.location.href);
  const pageLanguage = {
    '/links/': 'es',
    '/links/index.html': 'es',
    '/links/en/': 'en',
    '/links/en/index.html': 'en'
  }[url.pathname];
  if (!pageLanguage) return;

  const requestedLanguage = url.searchParams.get('lang');
  const explicitLanguage = isSupported(requestedLanguage) ? requestedLanguage
    : pageLanguage === 'en' || url.pathname.endsWith('/index.html') ? pageLanguage : null;
  const language = explicitLanguage || readPreference() || detectBrowserLanguage();
  savePreference(language);

  if (language !== pageLanguage) {
    url.pathname = language === 'en' ? '/links/en/' : '/links/';
    window.location.replace(url.href);
    return;
  }

  // Keep native navigation, including opening the switch in another tab.
  document.addEventListener('click', event => {
    if (!event.target || typeof event.target.closest !== 'function') return;
    const link = event.target.closest('a[data-language]');
    if (link) savePreference(link.getAttribute('data-language'));
  });
})();
