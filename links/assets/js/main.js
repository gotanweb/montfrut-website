/**
 * Montfrut — Links Landing Page
 * assets/js/main.js
 */

document.addEventListener('DOMContentLoaded', () => {

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* ---- Staggered entry animations ----------------------------- */
  const logo     = document.querySelector('.brand-logo');
  const subtitle = document.querySelector('.brand-subtitle');
  const topOrn   = document.querySelector('.brand-header .ornament');
  const buttons  = document.querySelectorAll('.link-btn');
  const botOrn   = document.querySelector('.ornament--bottom');
  const social   = document.querySelector('.social-row');

  const setDelay = (el, ms) => {
    if (!el) return;
    el.style.animationDelay = `${ms}ms`;
  };

  setDelay(logo,     60);
  setDelay(subtitle, 150);
  setDelay(topOrn,   270);

  buttons.forEach((btn, i) => {
    setDelay(btn, 320 + i * 65);
  });

  const afterBtns = 320 + buttons.length * 65;
  setDelay(botOrn, afterBtns + 40);
  setDelay(social, afterBtns + 100);

  /* ---- Press feedback on link buttons ------------------------- */
  buttons.forEach(btn => {
    // Do not replay the entry animation after keyboard or pointer interaction.
    btn.addEventListener('focus', () => {
      btn.classList.remove('anim-entry');
    });

    btn.addEventListener('pointerdown', () => {
      btn.classList.remove('anim-entry');
      btn.style.transform = 'translateY(-1px) scale(0.985)';
    });

    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => {
      btn.addEventListener(ev, () => {
        btn.style.transform = '';
      });
    });
  });

});
