/** Presentation only: keep keyboard focus clear without a fixed empty spacer. */
(() => {
  'use strict';
  const notice = document.getElementById('analytics-consent');
  const content = document.querySelector('.main-card');
  if (!notice || !content || !window.MontfrutConsent) return;
  const intersects = (a, b) => a.left < b.right && a.right > b.left
    && a.top < b.bottom && a.bottom > b.top;
  const revealFocus = () => {
    const target = document.activeElement;
    if (notice.hidden || !target || !target.matches(':focus-visible') || notice.contains(target)) return;
    const control = target.getBoundingClientRect();
    const card = notice.getBoundingClientRect();
    if (intersects(control, card)) {
      window.scrollBy({ top: control.bottom - card.top + 12, behavior: 'instant' });
    }
  };
  const update = () => {
    let space = 0;
    if (!notice.hidden) {
      const card = notice.getBoundingClientRect();
      const column = content.getBoundingClientRect();
      if (card.left < column.right && card.right > column.left) {
        space = Math.ceil(card.height + Math.max(0, window.innerHeight - card.bottom) + 12);
      }
    }
    document.documentElement.style.setProperty('--analytics-notice-space', space + 'px');
    revealFocus();
  };
  window.MontfrutConsent.subscribe(update);
  window.addEventListener('resize', update);
  document.addEventListener('focusin', revealFocus);
  if (typeof ResizeObserver === 'function') new ResizeObserver(update).observe(notice);
})();
