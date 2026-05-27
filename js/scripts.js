/* ============================================================
   MONTFRUT — scripts.js  v1.1
   Vanilla JS • Strict mode • No external dependencies
   All sections are module-functions, initialized on DOMContentLoaded
   ============================================================ */

'use strict';

/* ============================================================
   1. DATA — Static content arrays
   ============================================================ */

const recognitions = [
  {
    id: 'rec-01',
    title: 'A Conversation About Craft',
    source: '@estamosunidosok × @flavita.on',
    date: 'May 2026',
    cover: 'assets/img/recognition/rec-01-cover.png',
    gallery: [
      'assets/img/recognition/rec-01-gallery-1.png',
      'assets/img/recognition/rec-01-gallery-2.png',
      'assets/img/recognition/rec-01-gallery-3.png',
    ],
    excerpt: 'A deep dive into the Montfrut story, our process, and the meaning behind every bonbon.',
    description: `<p>In this interview with the talented team at <strong>@estamosunidosok</strong> and <strong>@flavita.on</strong>, we sat down to talk about what it truly means to craft chocolate with intention.</p>
      <p>From the sourcing of our Belgian couverture to the hand-painting of each mold, we covered the full journey of a Montfrut bonbon — and what drives us to keep the process slow and deliberate in a world that demands fast.</p>
      <p>We also discussed the vision behind our Dubai bars, the intersection of culture and confection, and what's next for Montfrut in 2026 and beyond.</p>`,
    externalLink: 'https://www.youtube.com/@estamosunidosok',
    externalLabel: 'Watch on YouTube',
    externalIcon: 'fa-youtube',
  },
  {
    id: 'rec-02',
    title: 'Featured in Local Press',
    source: 'NJ Food Magazine',
    date: 'March 2026',
    cover: 'assets/img/recognition/rec-02-cover.png',
    gallery: [
      'assets/img/recognition/rec-02-gallery-1.png',
      'assets/img/recognition/rec-02-gallery-2.png',
    ],
    excerpt: 'NJ Food Magazine highlights Montfrut as one of the region\'s most exciting artisan chocolate studios.',
    description: `<p>NJ Food Magazine's spring 2026 feature spotlighted emerging food artisans across the tristate area — and Montfrut was among those recognized for redefining what premium chocolate means in New Jersey.</p>
      <p>The article focused on our small-batch philosophy, our commitment to ethically sourced cacao, and the signature Dubai bar that has become our most talked-about creation.</p>
      <p>Read the full article on their website or pick up the March 2026 print edition.</p>`,
    externalLink: '#',
    externalLabel: 'Read Article',
    externalIcon: 'fa-newspaper',
  },
  {
    id: 'rec-03',
    title: 'Podcast: The Sweet Side of Business',
    source: 'Entrepreneur Spotlight Series',
    date: 'January 2026',
    cover: 'assets/img/recognition/rec-03-cover.png',
    gallery: [
      'assets/img/recognition/rec-03-gallery-1.png',
    ],
    excerpt: 'An in-depth conversation about building a luxury food brand from the ground up in the competitive NY/NJ market.',
    description: `<p>The <em>Entrepreneur Spotlight Series</em> podcast invited us for a candid conversation about what it takes to build a boutique chocolate brand in one of the world's most competitive food markets.</p>
      <p>We covered topics ranging from production challenges and ingredient sourcing to branding, social media strategy, and navigating corporate gift partnerships.</p>
      <p>Available now on Spotify, Apple Podcasts, and all major streaming platforms.</p>`,
    externalLink: '#',
    externalLabel: 'Listen on Spotify',
    externalIcon: 'fa-spotify',
  },
];

const communityItems = [
  {
    id: 'comm-01',
    title: 'Holiday Boxes for Local Shelters',
    source: 'Community Initiative',
    date: 'December 2025',
    cover: 'assets/img/community/comm-01-cover.png',
    gallery: [
      'assets/img/community/comm-01-gallery-1.png',
      'assets/img/community/comm-01-gallery-2.png',
    ],
    excerpt: 'We donated 200 custom holiday boxes to families served by Jersey City community shelters.',
    description: `<p>During the 2025 holiday season, Montfrut partnered with local community shelters in Jersey City to donate <strong>200 hand-packed holiday boxes</strong> to families in need.</p>
      <p>Each box included a curated selection of our artisan bonbons and a hand-written note from our team. We believe that the joy of fine chocolate should reach beyond those who can afford it.</p>
      <p>This initiative will return in 2026, expanded to include neighboring communities in Hudson County.</p>`,
    stats: [
      { value: '200+', label: 'Boxes Donated' },
      { value: '5+', label: 'Partnerships' },
      { value: 'Since 2024', label: 'Giving Back' },
    ],
  },
  {
    id: 'comm-02',
    title: 'Chocolate Workshop for Youth Center',
    source: 'Education & Craft',
    date: 'August 2025',
    cover: 'assets/img/community/comm-02-cover.png',
    gallery: [
      'assets/img/community/comm-02-gallery-1.png',
    ],
    excerpt: 'A hands-on chocolate-making workshop for 30 teens from a local youth program.',
    description: `<p>In August 2025, we hosted a full-day chocolate-making workshop for <strong>30 teenagers</strong> from a local youth development program in Jersey City.</p>
      <p>Participants learned the fundamentals of chocolate tempering, mold-filling, and flavor pairing — skills that blend creativity with science. Each teen left with a box of their own hand-crafted chocolates.</p>
      <p>We plan to expand this program into a recurring quarterly workshop, with scholarships for aspiring young food artisans.</p>`,
    stats: [
      { value: '30', label: 'Teens Reached' },
      { value: '1 Day', label: 'Workshop' },
      { value: '2025', label: 'Inaugural Year' },
    ],
  },
  {
    id: 'comm-03',
    title: 'Fundraiser Partnership',
    source: 'Community Fundraising',
    date: 'June 2025',
    cover: 'assets/img/community/comm-03-cover.png',
    gallery: [
      'assets/img/community/comm-03-gallery-1.png',
    ],
    excerpt: 'Partnered with a local cause to raise funds through curated chocolate boxes at a community event.',
    description: `<p>Montfrut joined forces with a local nonprofit organization for their June 2025 fundraising gala, contributing curated chocolate boxes as both centerpieces and auction items.</p>
      <p>A percentage of all proceeds from our boxes sold that evening were donated directly to the cause. Together, we demonstrated that artisan food can be a vehicle for genuine community impact.</p>
      <p>We are always open to partnership proposals from Jersey City and Hudson County nonprofits — reach out via our contact form.</p>`,
    stats: [
      { value: '$X', label: 'Raised' },
      { value: '1', label: 'Partnership' },
      { value: 'June 2025', label: 'Event Date' },
    ],
  },
];

/* TODO: Replace these placeholder reviews with real Google reviews before deploy.
   Source: https://g.page/r/12415828909464005164/review */
const reviews = [
  {
    id: 'rev-01',
    quote: 'The chocolates were the highlight of our corporate gala. Elegant, delicious, and beautifully presented. Our clients are still talking about them.',
    author: 'Andrea M.',
    role: 'Corporate Event Planner',
    initial: 'A',
    source: 'Google Review',
  },
  {
    id: 'rev-02',
    quote: 'Ordered Dubai bars for my daughter\'s sweet sixteen. They were a hit. Pure quality and a personal touch you don\'t find anywhere else.',
    author: 'Carolina R.',
    role: 'Birthday Celebration',
    initial: 'C',
    source: 'Google Review',
  },
  {
    id: 'rev-03',
    quote: 'Montfrut delivered for our 200-guest wedding favor order with grace and precision. Every box was perfect.',
    author: 'James & Lila T.',
    role: 'Wedding',
    initial: 'J',
    source: 'Google Review',
  },
  {
    id: 'rev-04',
    quote: 'Best chocolate experience I\'ve had in New York. The Hazelnut Praline is unforgettable.',
    author: 'Michael S.',
    role: 'New York',
    initial: 'M',
    source: 'Google Review',
  },
  {
    id: 'rev-05',
    quote: 'As a marketing director, finding gifts that feel curated is hard. Montfrut nailed it for our holiday client appreciation.',
    author: 'Patricia O.',
    role: 'Corporate Gifts',
    initial: 'P',
    source: 'Google Review',
  },
  {
    id: 'rev-06',
    quote: 'From the first message to the delivery, the care and craftsmanship showed at every step. Will be back.',
    author: 'Sofia D.',
    role: 'Google Review',
    initial: 'S',
    source: 'Google Review',
  },
];

const collections = [
  {
    id: 'col-01',
    name: 'Signature Collection',
    count: '12 pieces',
    desc: 'Our most beloved flavors, curated into a single elegant box.',
    img: 'assets/img/collections/signature.png',
    imgAlt: 'Montfrut Signature Collection — 12 pieces of assorted artisan bonbons',
    link: '/catalog/',
  },
  {
    id: 'col-02',
    name: 'Premium Collection',
    count: '24 pieces',
    desc: 'An elevated selection featuring our rarest and most intricate creations.',
    img: 'assets/img/collections/premium.png',
    imgAlt: 'Montfrut Premium Collection — 24 pieces of premium artisan chocolates',
    link: '/catalog/',
  },
  {
    id: 'col-03',
    name: 'Seasonal Winter',
    count: '9 pieces',
    desc: 'Winter flavors — spiced ganache, peppermint bark, and warm cocoa bonbons.',
    img: 'assets/img/collections/seasonal.png',
    imgAlt: 'Montfrut Seasonal Winter Collection — 9 winter-inspired artisan chocolates',
    link: '/catalog/',
  },
  {
    id: 'col-04',
    name: 'Dubai Bar',
    count: '1 bar · 200g',
    desc: 'The viral sensation: pistachio cream and kataifi wrapped in smooth milk chocolate.',
    img: 'assets/img/collections/dubai.png',
    imgAlt: 'Montfrut Dubai Bar — pistachio and kataifi artisan chocolate bar',
    link: '/catalog/',
  },
  {
    id: 'col-05',
    name: 'Mini Moments',
    count: '6 pieces',
    desc: 'Perfect for gifting — a compact selection of our most popular bites.',
    img: 'assets/img/collections/mini.png',
    imgAlt: 'Montfrut Mini Moments Collection — 6-piece artisan chocolate gift set',
    link: '/catalog/',
  },
];

const portfolioItems = {
  corporate: [
    { tag: 'Branded Gift Set', title: 'Branded Logo Bonbons', desc: 'Custom-molded bonbons bearing your company logo in edible gold or white chocolate.', img: 'assets/img/portfolio/corporate-01.png', imgAlt: 'Branded logo bonbons for corporate gifting' },
    { tag: 'Gift Box', title: 'Executive Gift Boxes', desc: 'Curated luxury boxes for C-suite clients and VIP partners, with custom ribbon and letter.', img: 'assets/img/portfolio/corporate-02.png', imgAlt: 'Executive corporate chocolate gift boxes' },
    { tag: 'Seasonal', title: 'Holiday Corporate Hampers', desc: 'Festive hampers combining our best-sellers with seasonal flavors and branded packaging.', img: 'assets/img/portfolio/corporate-03.png', imgAlt: 'Holiday corporate chocolate hampers' },
    { tag: 'Event Welcome', title: 'Conference Welcome Sets', desc: 'Elegant table-top gift sets that set the tone for conferences, launches, and offsites.', img: 'assets/img/portfolio/corporate-04.png', imgAlt: 'Conference welcome chocolate sets' },
    { tag: 'Anniversary', title: 'Client Anniversary Editions', desc: 'Milestone gifts that mark company anniversaries with bespoke flavors and presentation.', img: 'assets/img/portfolio/corporate-05.png', imgAlt: 'Client anniversary edition chocolate boxes' },
    { tag: 'Packaging', title: 'Custom Packaging Design', desc: 'From box to ribbon to insert card — fully branded unboxing experiences.', img: 'assets/img/portfolio/corporate-06.png', imgAlt: 'Custom chocolate packaging design for corporate clients' },
  ],
  events: [
    { tag: 'Wedding', title: 'Wedding Favors', desc: 'Personalized bonbon boxes or wrapped bars as unforgettable favors for every guest.', img: 'assets/img/portfolio/events-01.png', imgAlt: 'Artisan chocolate wedding favors' },
    { tag: 'Celebration', title: 'Bar/Bat Mitzvah Collections', desc: 'Themed chocolate gifts celebrating this milestone with elegance and personal touch.', img: 'assets/img/portfolio/events-02.png', imgAlt: 'Bar and Bat Mitzvah chocolate collections' },
    { tag: 'Anniversary', title: 'Anniversary Towers', desc: 'Stacked presentation towers of bonbons — a dramatic centerpiece for any celebration.', img: 'assets/img/portfolio/events-03.png', imgAlt: 'Anniversary chocolate towers' },
    { tag: 'Live Experience', title: 'Live Chocolate Stations', desc: 'An interactive tempering and dipping station that becomes the event\'s talking point.', img: 'assets/img/portfolio/events-04.png', imgAlt: 'Live chocolate station at events' },
    { tag: 'Themed', title: 'Themed Event Boxes', desc: 'Color-coordinated, theme-matched boxes that tie into your event\'s visual identity.', img: 'assets/img/portfolio/events-05.png', imgAlt: 'Themed chocolate event boxes' },
    { tag: 'Exclusive', title: 'Private Tasting Experiences', desc: 'Guided chocolate tasting sessions — perfect for bridal showers, corporate retreats, and VIP events.', img: 'assets/img/portfolio/events-06.png', imgAlt: 'Private chocolate tasting experience' },
  ],
  special: [
    { tag: 'Birthday', title: 'Birthday Boxes', desc: 'Bespoke boxes for birthdays of all ages — from playful flavor pops to refined dark selections.', img: 'assets/img/portfolio/special-01.png', imgAlt: 'Birthday chocolate gift boxes' },
    { tag: 'Valentine\'s', title: 'Valentine\'s Editions', desc: 'Heart-shaped bonbons and rose-scented truffles for the most romantic gesture.', img: 'assets/img/portfolio/special-02.png', imgAlt: "Valentine's Day artisan chocolate editions" },
    { tag: 'Holiday', title: "Mother's & Father's Day", desc: 'Thoughtful seasonal collections for the ones who deserve something truly special.', img: 'assets/img/portfolio/special-03.png', imgAlt: "Mother's and Father's Day chocolate gifts" },
    { tag: 'Milestone', title: 'Graduation Gifts', desc: 'Mark academic achievements with a sweet reward — custom-boxed with congratulatory messaging.', img: 'assets/img/portfolio/special-04.png', imgAlt: 'Graduation chocolate gift boxes' },
    { tag: 'Get Well', title: 'Get Well Sets', desc: 'Comforting and kind — small selections to brighten someone\'s difficult moment.', img: 'assets/img/portfolio/special-05.png', imgAlt: 'Get well chocolate gift sets' },
    { tag: 'Just Because', title: 'Just Because Boxes', desc: 'No occasion needed. The finest excuse to say you care.', img: 'assets/img/portfolio/special-06.png', imgAlt: '"Just Because" artisan chocolate boxes' },
  ],
};


/* ============================================================
   2. HELPERS — Shared utility functions
   ============================================================ */

/**
 * Clamp a numeric value between min and max.
 * @param {number} val
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

/**
 * Cached reduced-motion preference — avoids a MediaQueryList call on every
 * animation frame. Updated reactively if the user changes their OS setting.
 */
const _rmMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
let _prefersReducedMotion = _rmMQ.matches;
_rmMQ.addEventListener('change', e => { _prefersReducedMotion = e.matches; });
function prefersReducedMotion() { return _prefersReducedMotion; }

/**
 * Scroll to a target element, compensating for sticky header height.
 * @param {string} selector — CSS selector of the target element
 */
function smoothScrollTo(selector) {
  const target = document.querySelector(selector);
  if (!target) return;
  target.scrollIntoView({ behavior: prefersReducedMotion() ? 'instant' : 'smooth', block: 'start' });
}

/**
 * Set aria-selected and active class on tabs.
 * @param {Array} tabs
 * @param {Element} activeTab
 */
function activateTab(tabs, activeTab) {
  tabs.forEach(tab => {
    const isActive = tab === activeTab;
    tab.setAttribute('aria-selected', String(isActive));
    tab.classList.toggle('active', isActive);
  });
}

/**
 * Default responsive items-per-view for carousels.
 * Breakpoints match the site's tablet (576px) and desktop (992px) thresholds.
 * @returns {number}
 */
function defaultItemsPerView() {
  if (window.innerWidth >= 992) return 3;
  if (window.innerWidth >= 576) return 2;
  return 1;
}


/* ============================================================
   3. INIT — DOMContentLoaded entry point
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  buildNavCache();          // must run before initHeader so offsets are ready
  initHeader();
  initMobileNavAnimation();
  initIntersectionReveal();
  initSmoothScrollLinks();
  initPortfolioTabs();
  initCollectionsCarousel();
  initReviewsCarousel();
  initFaqIcons();
  initRecognitionGrid();
  initCommunityGrid();
  initContactForm();
  initNewsletterForm();
});


/* ============================================================
   4. HEADER — Scroll effect + active nav link
   ============================================================ */

/**
 * Cached section top offsets for nav highlighting.
 * Avoids forcing layout (offsetTop) on every scroll event.
 * Rebuilt on resize via debounce.
 */
let _navSections = [];
let _navLinks = null;

function buildNavCache() {
  const ids = ['hero', 'bio', 'portfolio', 'collections', 'faq', 'reviews', 'recognition', 'community', 'contact'];
  _navLinks = Array.from(document.querySelectorAll('.nav-link-custom'));
  _navSections = ids
    .map(id => {
      const el = document.getElementById(id);
      return el ? { id, top: el.getBoundingClientRect().top + window.scrollY } : null;
    })
    .filter(Boolean);
}

function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  /* Rebuild nav cache on resize (sections shift when viewport changes) */
  let resizeNavTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeNavTimer);
    resizeNavTimer = setTimeout(buildNavCache, 200);
  }, { passive: true });

  const handleScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
    highlightActiveNavLink();
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run once on init
}

/* ============================================================
   4b. MOBILE NAV — Hamburger ↔ X animation
   ============================================================ */

/**
 * Toggle .is-open on the hamburger button in sync with Bootstrap's
 * offcanvas show/hide events, driving the CSS hamburger → X animation.
 */
function initMobileNavAnimation() {
  const mobileNav = document.getElementById('mobileNav');
  const hamburger = document.querySelector('.hamburger-btn');
  if (!mobileNav || !hamburger) return;

  mobileNav.addEventListener('show.bs.offcanvas', () => {
    hamburger.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
  });

  mobileNav.addEventListener('hide.bs.offcanvas', () => {
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
}


/**
 * Highlight the nav link whose section is currently in view.
 * Uses pre-cached top offsets — zero reflows per scroll event.
 */
function highlightActiveNavLink() {
  if (!_navLinks?.length || !_navSections.length) return;

  const scrollPos = window.scrollY + window.innerHeight * 0.3;
  let currentId = _navSections[0].id;

  for (const { id, top } of _navSections) {
    if (top <= scrollPos) {
      currentId = id;
    } else {
      break; // sections are in DOM order — once we pass scroll position we're done
    }
  }

  for (const link of _navLinks) {
    link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
  }
}


/* ============================================================
   5. INTERSECTION OBSERVER — Reveal on scroll
   ============================================================ */

function initIntersectionReveal() {
  if (!('IntersectionObserver' in window)) {
    /* Fallback: show all reveal elements immediately */
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    return;
  }

  if (prefersReducedMotion()) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}


/* ============================================================
   6. SMOOTH SCROLL LINKS — Anchor navigation
   ============================================================ */

/**
 * Wire all anchor links (href starts with #) to smooth scroll.
 * Also handles the portfolio tab CTA links (data-interest).
 */
function initSmoothScrollLinks() {
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;

    e.preventDefault();

    /* If the link is a pane CTA, pre-select interest in the form */
    const interest = link.dataset.interest;
    if (interest) {
      const select = document.getElementById('cf-interest');
      if (select) select.value = interest;
    }

    smoothScrollTo(targetId);
  });
}


/* ============================================================
   7. PORTFOLIO TABS
   ============================================================ */

function initPortfolioTabs() {
  /* Render all category grids from portfolioItems (preserves insertion order) */
  for (const [category, items] of Object.entries(portfolioItems)) {
    renderPortfolioGrid(category, items);
  }

  const tabs = document.querySelectorAll('.portfolio-tab');
  if (!tabs.length) return;

  /* Restore tab from URL hash on load — delegate to Bootstrap Tab API */
  const hash = window.location.hash;
  const tabFromHash = hash.replace('#portfolio-', '');
  const matchingTab = document.querySelector(`.portfolio-tab[data-tab="${tabFromHash}"]`);
  if (matchingTab && typeof bootstrap !== 'undefined') {
    bootstrap.Tab.getOrCreateInstance(matchingTab).show();
  }

  tabs.forEach(tab => {
    /* Persist active tab in URL and scroll it into view within the tab bar */
    tab.addEventListener('shown.bs.tab', () => {
      history.replaceState(null, '', `#portfolio-${tab.dataset.tab}`);
      /* Ensures the active tab is always visible in the scrollable bar on mobile */
      tab.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
    });

    /* Keyboard: arrow keys navigate between tabs, Bootstrap handles show/hide */
    tab.addEventListener('keydown', e => {
      const tabArray = Array.from(tabs);
      const idx = tabArray.indexOf(tab);
      let target = null;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        target = tabArray[(idx + 1) % tabArray.length];
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        target = tabArray[(idx - 1 + tabArray.length) % tabArray.length];
      }

      if (target && typeof bootstrap !== 'undefined') {
        bootstrap.Tab.getOrCreateInstance(target).show();
        target.focus();
      }
    });
  });
}

/**
 * Render portfolio cards into a grid container.
 * @param {string} category — 'corporate' | 'events' | 'special'
 * @param {Array} items
 */
function renderPortfolioGrid(category, items) {
  const grid = document.getElementById(`grid-${category}`);
  if (!grid) return;

  grid.innerHTML = items.map(item => `
    <article class="portfolio-card">
      <div class="portfolio-card__img-wrap">
        <img src="${item.img}" alt="${item.imgAlt}" loading="lazy" width="600" height="450"
             onerror="this.parentNode.style.background='linear-gradient(135deg,#feeed5,#fceac6)'">
        <span class="portfolio-card__overlay" aria-hidden="true"></span>
      </div>
      <div class="portfolio-card__body">
        <span class="portfolio-card__tag">${item.tag}</span>
        <h3 class="portfolio-card__title">${item.title}</h3>
        <p class="portfolio-card__desc">${item.desc}</p>
      </div>
    </article>
  `).join('');
}


/* ============================================================
   8. COLLECTIONS CAROUSEL
   ============================================================ */

function initCollectionsCarousel() {
  const track = document.getElementById('collections-track');
  const dotsContainer = document.getElementById('collections-dots');
  const prevBtn = document.getElementById('collections-prev');
  const nextBtn = document.getElementById('collections-next');
  if (!track || !dotsContainer) return;

  /* Render cards */
  track.innerHTML = collections.map(col => `
    <article class="collection-card">
      <div class="collection-card__img-wrap">
        <img src="${col.img}" alt="${col.imgAlt}" loading="lazy" width="600" height="720"
             onerror="this.parentNode.style.background='linear-gradient(135deg,#feeed5,#fceac6)'">
      </div>
      <div class="collection-card__body">
        <span class="collection-card__count">${col.count}</span>
        <h3 class="collection-card__name">${col.name}</h3>
        <p class="collection-card__desc">${col.desc}</p>
        <a href="${col.link}" class="collection-card__link" aria-label="Discover ${col.name} in our catalog">
          Discover →
        </a>
      </div>
    </article>
  `).join('');

  initCarousel({
    track,
    dotsContainer,
    prevBtn,
    nextBtn,
    getItemsPerView: defaultItemsPerView,
    autoplayMs: 5000,
    totalItems: collections.length,
  });
}


/* ============================================================
   9. FAQ ICON ROTATION
   ============================================================ */

function initFaqIcons() {
  const accordion = document.getElementById('faqAccordion');
  if (!accordion) return;

  accordion.addEventListener('show.bs.collapse', (e) => {
    const btn = accordion.querySelector(`[data-bs-target="#${e.target.id}"]`);
    if (btn) btn.querySelector('.faq-icon')?.classList.add('faq-icon--open');
  });

  accordion.addEventListener('hide.bs.collapse', (e) => {
    const btn = accordion.querySelector(`[data-bs-target="#${e.target.id}"]`);
    if (btn) btn.querySelector('.faq-icon')?.classList.remove('faq-icon--open');
  });
}


/* ============================================================
   10. REVIEWS CAROUSEL
   ============================================================ */

function initReviewsCarousel() {
  const track = document.getElementById('reviews-track');
  const dotsContainer = document.getElementById('reviews-dots');
  const prevBtn = document.getElementById('reviews-prev');
  const nextBtn = document.getElementById('reviews-next');
  if (!track || !dotsContainer) return;

  /* Render cards */
  track.innerHTML = reviews.map(rev => `
    <article class="review-card" aria-label="Review by ${rev.author}">
      <div class="review-card__stars" aria-label="5 out of 5 stars">
        ${'<i class="fa-solid fa-star" aria-hidden="true"></i>'.repeat(5)}
      </div>
      <blockquote class="review-card__quote">"${rev.quote}"</blockquote>
      <div class="review-card__author">
        <div class="review-card__avatar" aria-hidden="true">${rev.initial}</div>
        <div class="review-card__meta">
          <strong>${rev.author}</strong>
          <small>${rev.role}</small>
        </div>
      </div>
      <div class="review-card__source">
        <i class="fa-brands fa-google" aria-hidden="true"></i>
        ${rev.source}
      </div>
    </article>
  `).join('');

  initCarousel({
    track,
    dotsContainer,
    prevBtn,
    nextBtn,
    getItemsPerView: defaultItemsPerView,
    autoplayMs: 6000,
    totalItems: reviews.length,
    pageMode: true,
  });
}


/* ============================================================
   10. GENERIC CAROUSEL ENGINE
   ============================================================ */

/**
 * Initialize a custom carousel with autoplay, dots, and arrow buttons.
 * @param {Object} opts
 * @param {HTMLElement} opts.track
 * @param {HTMLElement} opts.dotsContainer
 * @param {HTMLElement|null} opts.prevBtn
 * @param {HTMLElement|null} opts.nextBtn
 * @param {Function} opts.getItemsPerView — returns number of visible items
 * @param {number} opts.autoplayMs
 * @param {number} opts.totalItems
 */
function initCarousel({ track, dotsContainer, prevBtn, nextBtn, getItemsPerView, autoplayMs, totalItems, pageMode = false }) {
  let currentIndex = 0;
  let autoplayTimer = null;
  let itemsPerView = getItemsPerView();
  let prevPageCount = -1;

  /* Cache viewport reference — avoids repeated parentElement lookups */
  const viewport = track.parentElement;

  /* Helper: total navigable pages (pageMode) or positions (slide mode) */
  function getPageCount() {
    return pageMode
      ? Math.ceil(totalItems / itemsPerView)
      : maxIndex() + 1;
  }

  /* Helper: which page/position is currently active */
  function getActivePage() {
    return pageMode
      ? Math.min(Math.round(currentIndex / itemsPerView), getPageCount() - 1)
      : currentIndex;
  }

  /* --- Cached card dimensions (updated on resize, not on every navigation) --- */
  let _cardWidth = 0;
  let _gapPx = 0;

  /**
   * Measure card dimensions from the DOM and resize all cards.
   * Called only on init and resize — NOT on every navigation.
   */
  function sizeCards() {
    /* Read gap from computed CSS — single source of truth, works for all tracks */
    const computedGap = parseFloat(getComputedStyle(track).gap);
    _gapPx = Number.isFinite(computedGap) ? computedGap : 0;
    _cardWidth = (viewport.offsetWidth - _gapPx * (itemsPerView - 1)) / itemsPerView;

    for (const card of track.children) {
      card.style.width = `${_cardWidth}px`;
      card.style.minWidth = `${_cardWidth}px`;
      card.style.flexShrink = '0';
    }
  }

  /** Apply CSS transform offset and sync button/dot states. */
  function applyTransform() {
    if (prefersReducedMotion()) track.style.transition = 'none';

    const offset = currentIndex * (_cardWidth + _gapPx);
    track.style.transform = `translateX(-${offset}px)`;

    /* Carousel always loops — never disable the arrow buttons */
    if (prevBtn) prevBtn.disabled = false;
    if (nextBtn) nextBtn.disabled = false;

    const activePage = getActivePage();
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, i) => {
      const isActive = i === activePage;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-selected', String(isActive));
    });
  }

  /**
   * Full resize handler: recalculates items-per-view, sizes cards,
   * clamps current index, applies transform, and rebuilds dots only
   * when the page count actually changes.
   */
  function onResize() {
    itemsPerView = getItemsPerView();
    currentIndex = clamp(currentIndex, 0, maxIndex());
    sizeCards();
    applyTransform();

    const newPageCount = getPageCount();
    if (newPageCount !== prevPageCount) {
      prevPageCount = newPageCount;
      renderDots();
    }
  }

  function maxIndex() {
    return Math.max(0, totalItems - itemsPerView);
  }

  function goTo(index) {
    currentIndex = clamp(index, 0, maxIndex());
    applyTransform();
  }

  function next() {
    if (pageMode) {
      const pg = getActivePage();
      const total = getPageCount();
      const nextPg = (pg + 1) % total;
      goTo(Math.min(nextPg * itemsPerView, maxIndex()));
    } else {
      goTo(currentIndex >= maxIndex() ? 0 : currentIndex + 1);
    }
  }

  function prev() {
    if (pageMode) {
      const pg = getActivePage();
      const total = getPageCount();
      const prevPg = (pg - 1 + total) % total;
      goTo(Math.min(prevPg * itemsPerView, maxIndex()));
    } else {
      goTo(currentIndex <= 0 ? maxIndex() : currentIndex - 1);
    }
  }

  function renderDots() {
    const count = getPageCount();
    const activePage = getActivePage();
    dotsContainer.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.className = `carousel-dot${i === activePage ? ' active' : ''}`;
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.setAttribute('aria-selected', String(i === activePage));
      dot.addEventListener('click', () => {
        const targetIndex = pageMode ? Math.min(i * itemsPerView, maxIndex()) : i;
        goTo(targetIndex);
        resetAutoplay();
      });
      dotsContainer.appendChild(dot);
    }
    prevPageCount = count;
  }

  function startAutoplay() {
    if (prefersReducedMotion() || !autoplayMs) return;
    autoplayTimer = setInterval(next, autoplayMs);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  function pauseAutoplay() { clearInterval(autoplayTimer); }

  /* Shared debounced resize listener */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(onResize, 150);
  });

  /* Pause autoplay in background tabs — prevents silent interval drift */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      pauseAutoplay();
    } else if (autoplayMs) {
      startAutoplay();
    }
  });

  /* Wire arrow buttons */
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAutoplay(); });

  /* Pause on hover */
  viewport.addEventListener('mouseenter', pauseAutoplay);
  viewport.addEventListener('mouseleave', startAutoplay);

  /* Touch / swipe support */
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) {
      if (delta > 0) next();
      else prev();
      resetAutoplay();
    }
  });

  /* Keyboard: arrow keys when carousel viewport is focused */
  viewport.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { next(); resetAutoplay(); }
    if (e.key === 'ArrowLeft')  { prev(); resetAutoplay(); }
  });

  /* Initial render: size cards and build dots immediately, then apply transform
     after two animation frames so the browser has completed layout. */
  sizeCards();
  renderDots();
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      applyTransform();
      startAutoplay();
    });
  });
}


/* ============================================================
   11. RECOGNITION & COMMUNITY GRIDS
   ============================================================ */

/**
 * Build the shared Bootstrap carousel HTML for recognition/community modals.
 * @param {string} carouselId — unique id for the carousel element
 * @param {string[]} gallery — array of image src URLs
 * @param {string} title — descriptive title for alt text
 * @returns {string} HTML string
 */
function buildModalCarouselHtml(carouselId, gallery, title) {
  const items = gallery.map((src, i) => `
    <div class="carousel-item${i === 0 ? ' active' : ''}">
      <img src="${src}" alt="${title} — image ${i + 1}" loading="lazy"
           style="width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:8px;"
           onerror="this.parentNode.style.background='#feeed5'">
    </div>
  `).join('');

  const controls = gallery.length > 1 ? `
    <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev" aria-label="Previous image">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next" aria-label="Next image">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
    </button>
  ` : '';

  return `
    <div id="${carouselId}" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">${items}</div>
      ${controls}
    </div>
  `;
}

/**
 * Build a recognition/community card element as an HTML string.
 * @param {Object} item — data object (recognition or community item)
 * @param {string} dataAttr — data attribute name (e.g. 'recognition-id')
 * @param {string} modalTarget — modal element id (without #)
 * @returns {string} HTML string
 */
function buildMediaCard(item, dataAttr, modalTarget) {
  return `
    <article class="recognition-card"
             data-${dataAttr}="${item.id}"
             data-bs-toggle="modal"
             data-bs-target="#${modalTarget}"
             tabindex="0"
             role="button"
             aria-label="Read more: ${item.title}">
      <div class="recognition-card__img-wrap">
        <img src="${item.cover}" alt="${item.title}" loading="lazy" width="800" height="500"
             onerror="this.parentNode.style.background='linear-gradient(135deg,#feeed5,#fceac6)'">
        <span class="recognition-card__date">${item.date}</span>
      </div>
      <div class="recognition-card__body">
        <span class="recognition-card__source">${item.source}</span>
        <h3 class="recognition-card__title">${item.title}</h3>
        <p class="recognition-card__excerpt">${item.excerpt}</p>
        <span class="recognition-card__readmore">Read more →</span>
      </div>
    </article>
  `;
}

/* ---- Recognition ---- */

function initRecognitionGrid() {
  const grid = document.getElementById('recognition-grid');
  if (!grid) return;

  grid.innerHTML = recognitions
    .map(rec => buildMediaCard(rec, 'recognition-id', 'recognitionModal'))
    .join('');

  /* Keyboard: Enter / Space triggers click on focused card */
  grid.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('.recognition-card');
      if (card) { e.preventDefault(); card.click(); }
    }
  });

  const modal = document.getElementById('recognitionModal');
  if (!modal) return;

  modal.addEventListener('show.bs.modal', e => {
    const id = e.relatedTarget?.dataset?.recognitionId;
    const data = recognitions.find(r => r.id === id);
    if (data) populateRecognitionModal(data);
  });
}

/**
 * Inject recognition content into the modal body.
 * @param {Object} data — recognition item object
 */
function populateRecognitionModal(data) {
  const title = document.getElementById('recognitionModalTitle');
  const body = document.getElementById('recognitionModalBody');
  const extLink = document.getElementById('recognitionModalExtLink');

  if (title) title.textContent = data.title;

  if (extLink) {
    extLink.href = data.externalLink;
    extLink.innerHTML = `<i class="fa-brands ${data.externalIcon}" aria-hidden="true"></i> ${data.externalLabel}`;
  }

  if (body) {
    body.innerHTML = `
      <div class="row g-3">
        <div class="col-md-7">
          ${buildModalCarouselHtml('recognitionCarousel', data.gallery, data.title)}
        </div>
        <div class="col-md-5">
          <p style="font-family:var(--font-ui);font-size:0.7rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--desert-sand);margin-bottom:0.25rem;">${data.source}</p>
          <p style="font-family:var(--font-ui);font-size:0.8rem;color:var(--steel-teal);margin-bottom:1rem;">${data.date}</p>
          <div style="font-family:var(--font-ui);font-size:0.9rem;color:var(--steel-teal);line-height:1.7;">${data.description}</div>
        </div>
      </div>
    `;
  }
}

/* ---- Community ---- */

function initCommunityGrid() {
  const grid = document.getElementById('community-grid');
  if (!grid) return;

  grid.innerHTML = communityItems
    .map(item => buildMediaCard(item, 'community-id', 'communityModal'))
    .join('');

  grid.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('.recognition-card');
      if (card) { e.preventDefault(); card.click(); }
    }
  });

  const modal = document.getElementById('communityModal');
  if (!modal) return;

  modal.addEventListener('show.bs.modal', e => {
    const id = e.relatedTarget?.dataset?.communityId;
    const data = communityItems.find(c => c.id === id);
    if (data) populateCommunityModal(data);
  });
}

/**
 * Inject community content into the modal body.
 * @param {Object} data — community item object
 */
function populateCommunityModal(data) {
  const title = document.getElementById('communityModalTitle');
  const body = document.getElementById('communityModalBody');

  if (title) title.textContent = data.title;

  if (body) {
    const statsHtml = data.stats ? `
      <div class="community-stats">
        ${data.stats.map(s => `
          <div class="community-stat">
            <span class="community-stat__value">${s.value}</span>
            <span class="community-stat__label">${s.label}</span>
          </div>
        `).join('')}
      </div>
    ` : '';

    body.innerHTML = `
      <div class="row g-3">
        <div class="col-md-7">
          ${buildModalCarouselHtml('communityCarousel', data.gallery, data.title)}
        </div>
        <div class="col-md-5">
          <p style="font-family:var(--font-ui);font-size:0.7rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--desert-sand);margin-bottom:0.25rem;">${data.source}</p>
          <p style="font-family:var(--font-ui);font-size:0.8rem;color:var(--steel-teal);margin-bottom:1rem;">${data.date}</p>
          ${statsHtml}
          <div style="font-family:var(--font-ui);font-size:0.9rem;color:var(--steel-teal);line-height:1.7;">${data.description}</div>
        </div>
      </div>
    `;
  }
}


/* ============================================================
   12. CONTACT FORM — Validation + mailto fallback
   ============================================================ */

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateContactForm(form)) return;

    /* TODO: Integrate with Formspree/EmailJS/Netlify Forms for production.
       Recommended: https://formspree.io — add action="https://formspree.io/f/YOUR_ID" */

    /* Fallback: build a mailto: link */
    const name     = form.querySelector('#cf-name').value.trim();
    const email    = form.querySelector('#cf-email').value.trim();
    const phone    = form.querySelector('#cf-phone').value.trim();
    const interest = form.querySelector('#cf-interest').value;
    const eventdate = form.querySelector('#cf-eventdate').value;
    const message  = form.querySelector('#cf-message').value.trim();

    const subject = encodeURIComponent(`[Montfrut Contact] ${interest} — ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\nInterest: ${interest}\nEvent Date: ${eventdate || 'Not specified'}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:info@montfrut.com?subject=${subject}&body=${body}`;

    /* Show success modal */
    const successModal = document.getElementById('contactSuccessModal');
    if (successModal && window.bootstrap) {
      bootstrap.Modal.getOrCreateInstance(successModal).show();
    }

    form.reset();
  });

  /* Cache required fields once — avoids a second querySelectorAll on submit */
  const requiredFields = form.querySelectorAll('[required]');
  const phoneField = form.querySelector('#cf-phone');

  /* Attach blur + input validation to a single field */
  function wireField(field) {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') validateField(field);
    });
  }

  requiredFields.forEach(wireField);

  /* Wire phone separately — it has a pattern but is not required */
  if (phoneField) wireField(phoneField);
}

/**
 * Validate the entire contact form.
 * @param {HTMLFormElement} form
 * @returns {boolean}
 */
function validateContactForm(form) {
  let isValid = true;
  form.querySelectorAll('[required]').forEach(field => {
    if (!validateField(field)) isValid = false;
  });
  /* Also validate optional phone pattern */
  const phoneField = form.querySelector('#cf-phone');
  if (phoneField && !validateField(phoneField)) isValid = false;

  if (!isValid) {
    const firstError = form.querySelector('[aria-invalid="true"]');
    if (firstError) firstError.focus();
  }
  return isValid;
}

/**
 * Validate a single form field and show/clear its inline error message.
 * @param {HTMLElement} field
 * @returns {boolean}
 */
function validateField(field) {
  const errorEl = document.getElementById(field.getAttribute('aria-describedby'));
  let message = '';

  if (field.required && !field.value.trim()) {
    message = 'This field is required.';
  } else if (field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
    message = 'Please enter a valid email address.';
  } else if (field.minLength > 0 && field.value.length < field.minLength) {
    message = `Please enter at least ${field.minLength} characters.`;
  } else if (field.pattern && field.value && !new RegExp(field.pattern).test(field.value)) {
    message = 'Please enter a valid phone number.';
  }

  const hasError = Boolean(message);
  field.setAttribute('aria-invalid', String(hasError));
  if (errorEl) errorEl.textContent = message;

  return !hasError;
}


/* ============================================================
   13. NEWSLETTER FORM — Toast feedback
   ============================================================ */

function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;
  const input = form.querySelector('#nl-email');

  form.addEventListener('submit', e => {
    e.preventDefault();

    const isValidEmail = input?.value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
    if (!isValidEmail) {
      /* Show visual error state via aria-invalid (CSS rule targets this) */
      if (input) {
        input.setAttribute('aria-invalid', 'true');
        input.focus();
      }
      return;
    }

    /* Clear error state */
    if (input) input.setAttribute('aria-invalid', 'false');

    /* TODO: Integrate with Mailchimp/ConvertKit for production. */

    /* Show Bootstrap toast */
    const toastEl = document.getElementById('newsletterToast');
    if (toastEl && window.bootstrap) {
      bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 4000 }).show();
    }

    form.reset();
  });

  /* Clear error state as soon as the user starts correcting input */
  if (input) {
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') {
        input.setAttribute('aria-invalid', 'false');
      }
    });
  }
}
