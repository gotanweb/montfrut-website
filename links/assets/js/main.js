/**
 * Montfrut — Links Landing Page
 * assets/js/main.js
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Staggered entry animations ----------------------------- */
  const logo     = document.querySelector('.brand-logo');
  const subtitle = document.querySelector('.brand-subtitle');
  const handle   = document.querySelector('.brand-handle');
  const topOrn   = document.querySelector('.brand-header .ornament');
  const buttons  = document.querySelectorAll('.link-btn');
  const botOrn   = document.querySelector('.ornament--bottom');
  const social   = document.querySelector('.social-row');
  const footer   = document.querySelector('.site-footer');

  const setDelay = (el, ms) => {
    if (!el) return;
    el.style.animationDelay = `${ms}ms`;
  };

  setDelay(logo,     60);
  setDelay(subtitle, 150);
  setDelay(handle,   210);
  setDelay(topOrn,   270);

  buttons.forEach((btn, i) => {
    setDelay(btn, 320 + i * 65);
  });

  const afterBtns = 320 + buttons.length * 65;
  setDelay(botOrn, afterBtns + 40);
  setDelay(social, afterBtns + 100);
  setDelay(footer, afterBtns + 160);

  /* ---- Press feedback on link buttons ------------------------- */
  buttons.forEach(btn => {
    btn.addEventListener('pointerdown', () => {
      btn.style.transform = 'translateY(-1px) scale(0.985)';
    });

    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => {
      btn.addEventListener(ev, () => {
        btn.style.transform = '';
      });
    });
  });

});
