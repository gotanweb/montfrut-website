/** Presentation only: floating notice clearance, keyboard focus and Bootstrap overlays. */
(() => {
  'use strict';
  const notice = document.getElementById('analytics-consent');
  const manager = window.MontfrutConsent;
  if (!notice || !manager) return;
  const overlays = new Set(document.querySelectorAll('.modal.show, .offcanvas.show, .offcanvas.showing'));
  const intersects = (a, b) => a.left < b.right && a.right > b.left
    && a.top < b.bottom && a.bottom > b.top;
  const revealFocus = () => {
    const target = document.activeElement;
    if (notice.hidden || notice.inert || !target || notice.contains(target) || !target.matches(':focus-visible')) return;
    const control = target.getBoundingClientRect();
    const card = notice.getBoundingClientRect();
    if (intersects(control, card)) {
      window.scrollBy({ top: control.bottom - card.top + 12, behavior: 'instant' });
    }
  };
  const update = () => {
    const covered = overlays.size > 0;
    notice.classList.toggle('catalog-analytics-notice--covered', covered);
    notice.inert = notice.hidden || covered;
    let space = 0;
    if (!notice.hidden) {
      const card = notice.getBoundingClientRect();
      space = Math.ceil(card.height + Math.max(0, window.innerHeight - card.bottom) + 12);
    }
    document.documentElement.style.setProperty('--catalog-analytics-space', space + 'px');
    revealFocus();
  };
  for (const component of ['modal', 'offcanvas']) {
    document.addEventListener('show.bs.' + component, event => {
      // Other handlers may cancel Bootstrap's opening event.
      queueMicrotask(() => {
        if (!event.defaultPrevented) overlays.add(event.target);
        update();
      });
    });
    document.addEventListener('hidden.bs.' + component, event => {
      overlays.delete(event.target);
      update();
    });
  }
  manager.subscribe(update);
  window.addEventListener('resize', update);
  window.addEventListener('montfrut:catalog-language', update);
  document.addEventListener('focusin', revealFocus);
  if (typeof ResizeObserver === 'function') new ResizeObserver(update).observe(notice);
})();
