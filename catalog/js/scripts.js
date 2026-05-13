/* ==========================================================================
   Montfrut — scripts.js
   Static front-end logic: data, filters, cart, modal, carousel, toast
   ========================================================================== */

'use strict';

console.log('Montfrut Catalog: scripts.js is loading...');

/* --------------------------------------------------------------------------
   1. PRODUCT DATA
   -------------------------------------------------------------------------- */

const products = [
  {
    id: 1,
    name: 'Hazelnut Praline Bonbons',
    category: 'Chocolate Bonbons',
    flavor: 'Hazelnut',
    shortDescription: 'Smooth hazelnut praline enrobed in rich dark chocolate.',
    longDescription: 'A timeless classic reimagined. Our Hazelnut Praline Bonbons are crafted from slow-roasted Piedmont hazelnuts blended into a silky praline cream, then hand-dipped in 70% single-origin dark chocolate. Each piece is finished with a delicate hazelnut shard on top, offering a perfect balance of crunch, sweetness, and depth.',
    price: 24.00,
    image: 'assets/img/hazelnut_bonbons.png',
    galleryImages: [
      'assets/img/hazelnut_bonbons.png',
      'assets/img/dark_chocolate_bar.png',
      'assets/img/classic_truffles.png'
    ],
    allergyTags: ['Dairy', 'Nuts'],
    flavorNotes: ['Roasted Hazelnut', 'Dark Cacao', 'Caramelized Sugar'],
    ingredients: 'Dark chocolate (cocoa mass, sugar, cocoa butter, vanilla), hazelnut paste, cream, butter, sugar.',
    isBestSeller: true,
    isSpecialCollection: false
  },
  {
    id: 2,
    name: 'Signature Collection – 12pc',
    category: 'Gift Boxes',
    flavor: 'Dark Chocolate',
    shortDescription: 'An exquisite selection of our most loved flavors.',
    longDescription: 'Twelve of our finest bonbons, carefully curated into an elegant gift box. This collection includes four each of our Hazelnut Praline, Sea Salt Caramel, and Raspberry Ganache — showcasing the full range of Montfrut craftsmanship. Each bonbon is individually nestled in a hand-folded paper cup within a lacquered presentation box.',
    price: 36.00,
    image: 'assets/img/signature_box.png',
    galleryImages: [
      'assets/img/signature_box.png',
      'assets/img/hazelnut_bonbons.png',
      'assets/img/pistachio_bonbons.png'
    ],
    allergyTags: ['Dairy', 'Nuts'],
    flavorNotes: ['Mixed Selection', 'Dark Cacao', 'Hazelnut', 'Caramel'],
    ingredients: 'Dark chocolate, milk chocolate, cream, butter, hazelnut paste, sea salt, raspberry purée, sugar.',
    isBestSeller: false,
    isSpecialCollection: true
  },
  {
    id: 3,
    name: 'Classic Truffles',
    category: 'Truffles',
    flavor: 'Dark Chocolate',
    shortDescription: 'Silky truffles with a rich cocoa finish.',
    longDescription: 'Our Classic Truffles embody the purest expression of chocolate. A deeply rich ganache made from 65% Ecuadorian cacao is rolled by hand and dusted in a fine cocoa powder coat. Soft, yielding, and intensely chocolatey — these are for the true connoisseur who appreciates simplicity done with perfection.',
    price: 22.00,
    image: 'assets/img/classic_truffles.png',
    galleryImages: [
      'assets/img/classic_truffles.png',
      'assets/img/dark_chocolate_bar.png',
      'assets/img/hazelnut_bonbons.png'
    ],
    allergyTags: ['Dairy'],
    flavorNotes: ['Rich Cacao', 'Vanilla', 'Earthy Notes'],
    ingredients: 'Dark chocolate (65% cocoa), cream, butter, cocoa powder for dusting.',
    isBestSeller: false,
    isSpecialCollection: true
  },
  {
    id: 4,
    name: '70% Dark Chocolate Bar',
    category: 'Chocolate Bars',
    flavor: 'Dark Chocolate',
    shortDescription: 'Pure single-origin 70% cacao in a sleek artisan bar.',
    longDescription: 'Sourced from a single estate in Madagascar, this 70% dark chocolate bar is a study in restraint and quality. With notes of dried fruit, subtle earthiness, and a long, clean finish, it is meant to be savored slowly. Stone-ground for 48 hours, then tempered by hand for a perfect snap and glossy surface.',
    price: 14.00,
    image: 'assets/img/dark_chocolate_bar.png',
    galleryImages: [
      'assets/img/dark_chocolate_bar.png',
      'assets/img/classic_truffles.png',
      'assets/img/hazelnut_bonbons.png'
    ],
    allergyTags: ['Dairy-Free', 'Gluten-Free'],
    flavorNotes: ['Red Fruit', 'Earthiness', 'Long Finish'],
    ingredients: 'Dark chocolate (cocoa mass 70%, sugar, cocoa butter, vanilla extract). May contain traces of milk and nuts.',
    isBestSeller: false,
    isSpecialCollection: false
  },
  {
    id: 5,
    name: 'Pistachio Delight Bonbons',
    category: 'Chocolate Bonbons',
    flavor: 'White Chocolate',
    shortDescription: 'Pistachio ganache in white chocolate.',
    longDescription: 'Iranian pistachios, slow-roasted and ground into a vibrant green paste, form the heart of these elegant bonbons. The ganache is delicate and aromatic, encased in a hand-painted white chocolate shell. A touch of cardamom lifts the flavor, making each piece a small, sophisticated indulgence.',
    price: 24.00,
    image: 'assets/img/pistachio_bonbons.png',
    galleryImages: [
      'assets/img/pistachio_bonbons.png',
      'assets/img/hazelnut_bonbons.png',
      'assets/img/signature_box.png'
    ],
    allergyTags: ['Dairy', 'Nuts'],
    flavorNotes: ['Pistachio', 'Cardamom', 'White Cacao'],
    ingredients: 'White chocolate (cocoa butter, sugar, milk powder, vanilla), pistachio paste, cream, cardamom.',
    isBestSeller: false,
    isSpecialCollection: false
  },
  {
    id: 6,
    name: 'Premium Gift Box – 24pc',
    category: 'Gift Boxes',
    flavor: 'Milk Chocolate',
    shortDescription: 'A luxurious assortment for special moments.',
    longDescription: 'Twenty-four of our finest chocolates presented in a handcrafted lacquered box with a satin ribbon. An ideal gift for any occasion, featuring six different varieties across our full flavor range. Beautifully arranged and ready to gift, or to treasure for yourself — because you deserve it.',
    price: 68.00,
    image: 'assets/img/premium_box.png',
    galleryImages: [
      'assets/img/premium_box.png',
      'assets/img/signature_box.png',
      'assets/img/mini_moments.png'
    ],
    allergyTags: ['Dairy', 'Nuts', 'Soy'],
    flavorNotes: ['Full Spectrum', 'Milk Cacao', 'Caramel', 'Hazelnut'],
    ingredients: 'Assorted chocolates: dark, milk, white chocolate, various fillings. See individual product descriptions.',
    isBestSeller: false,
    isSpecialCollection: true
  },
  {
    id: 7,
    name: 'Sea Salt Caramels',
    category: 'Chocolate Bonbons',
    flavor: 'Caramel',
    shortDescription: 'Buttery caramel with a hint of sea salt.',
    longDescription: 'Slow-cooked caramel made from organic cane sugar and French butter, finished with hand-harvested Fleur de Sel sea salt and enrobed in rich milk chocolate. The balance of sweet, salty, and chocolatey is simply irresistible. A Montfrut favorite — and once tried, always requested.',
    price: 20.00,
    image: 'assets/img/sea_salt_caramels.png',
    galleryImages: [
      'assets/img/sea_salt_caramels.png',
      'assets/img/classic_truffles.png',
      'assets/img/dark_chocolate_bar.png'
    ],
    allergyTags: ['Dairy', 'Nuts'],
    flavorNotes: ['Salted Caramel', 'Milk Chocolate', 'Fleur de Sel'],
    ingredients: 'Milk chocolate (sugar, cocoa butter, whole milk powder, cocoa mass), caramel (sugar, cream, butter), sea salt.',
    isBestSeller: false,
    isSpecialCollection: false
  },
  {
    id: 8,
    name: 'Mini Moments – 9pc',
    category: 'Chocolate Bonbons',
    flavor: 'Milk Chocolate',
    shortDescription: 'Perfect bite-size indulgences for any craving.',
    longDescription: 'Nine miniature bonbons in a petite presentation box, ideal for an intimate gift or personal treat. Featuring our three most beloved flavors in a smaller format — Hazelnut Praline, Salted Caramel, and Classic Ganache. Small in size, enormous in pleasure.',
    price: 18.00,
    image: 'assets/img/mini_moments.png',
    galleryImages: [
      'assets/img/mini_moments.png',
      'assets/img/signature_box.png',
      'assets/img/premium_box.png'
    ],
    allergyTags: ['Dairy', 'Nuts', 'Berries'],
    flavorNotes: ['Hazelnut', 'Caramel', 'Dark Ganache'],
    ingredients: 'Milk chocolate, dark chocolate, cream, hazelnut paste, caramel, butter, sugar.',
    isBestSeller: false,
    isSpecialCollection: false
  },
  {
    id: 9,
    name: 'Coconut Dream Bonbons',
    category: 'Chocolate Bonbons',
    flavor: 'Dark Chocolate',
    shortDescription: 'Creamy coconut filling in dark chocolate.',
    longDescription: 'Inspired by tropical flavors, these bonbons combine a smooth coconut cream filling with toasted coconut flakes and a hint of rum, all wrapped in a deep 68% dark chocolate shell. The contrast of tropical sweetness against the intensity of dark cacao creates an unexpectedly refined pairing.',
    price: 24.00,
    image: 'assets/img/coconut_bonbons.png',
    galleryImages: [
      'assets/img/coconut_bonbons.png',
      'assets/img/pistachio_bonbons.png',
      'assets/img/hazelnut_bonbons.png'
    ],
    allergyTags: ['Dairy', 'Coconut'],
    flavorNotes: ['Toasted Coconut', 'Dark Cacao', 'Subtle Rum'],
    ingredients: 'Dark chocolate (68% cocoa mass), coconut cream, toasted coconut flakes, rum, sugar.',
    isBestSeller: false,
    isSpecialCollection: false
  },
  {
    id: 10,
    name: 'Seasonal Chocolate Box',
    category: 'Seasonal Collection',
    flavor: 'Dark Chocolate',
    shortDescription: 'A curated seasonal selection, available for a limited time.',
    longDescription: "Four times a year, our chocolatiers craft an exclusive seasonal box inspired by nature's finest offerings. This edition features winter spices: cinnamon ganache, clove-infused dark chocolate, and a warming cardamom truffle. Each box is numbered and includes a card describing the seasonal inspiration.",
    price: 42.00,
    image: 'assets/img/seasonal_box.png',
    galleryImages: [
      'assets/img/seasonal_box.png',
      'assets/img/premium_box.png',
      'assets/img/signature_box.png'
    ],
    allergyTags: ['Dairy', 'Nuts'],
    flavorNotes: ['Cinnamon', 'Clove', 'Cardamom', 'Dark Cacao'],
    ingredients: 'Dark chocolate, milk chocolate, cream, butter, cinnamon, clove extract, cardamom, sugar.',
    isBestSeller: false,
    isSpecialCollection: true
  }
];


/* --------------------------------------------------------------------------
   2. STATE
   -------------------------------------------------------------------------- */

let cartCount = 0;
let activeCategories = [];
let activeFlavors = [];
let searchQuery = '';
let sortOrder = 'featured';


/* --------------------------------------------------------------------------
   3. CART
   -------------------------------------------------------------------------- */

function addToCart(productName) {
  cartCount++;
  document.getElementById('cart-count').textContent = cartCount;
  document.getElementById('cart-count').classList.remove('d-none');
  showToast(productName);
}

function showToast(productName) {
  const toastEl = document.getElementById('cart-toast');
  const toastBody = document.getElementById('toast-body-text');
  toastBody.textContent = `"${productName}" added to cart.`;
  const toast = bootstrap.Toast.getOrCreateInstance(toastEl);
  toast.show();
}


/* --------------------------------------------------------------------------
   4. FILTER & SEARCH LOGIC
   -------------------------------------------------------------------------- */

function getFilteredProducts() {
  let filtered = [...products];

  // Category filter
  if (activeCategories.length > 0) {
    filtered = filtered.filter(p => activeCategories.includes(p.category));
  }

  // Flavor filter
  if (activeFlavors.length > 0) {
    filtered = filtered.filter(p => activeFlavors.includes(p.flavor));
  }

  // Search
  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.flavor.toLowerCase().includes(q)
    );
  }

  // Sort
  switch (sortOrder) {
    case 'bestsellers':
      filtered.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
      break;
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    default:
      // featured: best sellers first
      filtered.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
  }

  return filtered;
}

function updateFilters() {
  // Checkboxes — categories
  document.querySelectorAll('.filter-category').forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) {
        if (!activeCategories.includes(cb.value)) activeCategories.push(cb.value);
      } else {
        activeCategories = activeCategories.filter(c => c !== cb.value);
      }
      renderProductGrid();
    });
  });

  // Checkboxes — flavors
  document.querySelectorAll('.filter-flavor').forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) {
        if (!activeFlavors.includes(cb.value)) activeFlavors.push(cb.value);
      } else {
        activeFlavors = activeFlavors.filter(f => f !== cb.value);
      }
      renderProductGrid();
    });
  });
}


/* --------------------------------------------------------------------------
   5. RENDER HELPERS
   -------------------------------------------------------------------------- */

function allergyTagsHTML(tags) {
  return tags.map(tag => `<span class="allergy-tag">${tag}</span>`).join('');
}

function renderProductCard(product) {
  return `
    <div class="product-card" data-id="${product.id}">
      <div class="product-card__img-wrap">
        <img src="${product.image}" alt="${product.name}" class="product-card__img" loading="lazy">
        ${product.isBestSeller ? '<span class="product-card__badge badge-bestseller">Best Seller</span>' : ''}
      </div>
      <div class="product-card__body">
        <h3 class="product-card__name">${product.name}</h3>
        <p class="product-card__desc">${product.shortDescription}</p>
        <div class="product-card__tags">${allergyTagsHTML(product.allergyTags)}</div>
        <div class="product-card__footer">
          <span class="product-card__price">$${product.price.toFixed(2)}</span>
          <div class="product-card__actions">
            <button class="btn-add-to-cart" data-id="${product.id}" aria-label="Add ${product.name} to cart">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              Add to Cart
            </button>
            <button class="btn-details" data-id="${product.id}" aria-label="View details for ${product.name}">Details</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderBestSellerCard(product) {
  return `
    <div class="bestseller-card">
      <div class="bestseller-card__badge">BEST SELLER</div>
      <div class="bestseller-card__img-wrap">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="bestseller-card__body">
        <h3 class="bestseller-card__name">${product.name}</h3>
        <p class="bestseller-card__desc">${product.shortDescription}</p>
        <div class="bestseller-card__tags">${allergyTagsHTML(product.allergyTags)}</div>
        <div class="bestseller-card__price">$${product.price.toFixed(2)}</div>
        <button class="btn-add-to-cart btn-add-to-cart--light" data-id="${product.id}" aria-label="Add ${product.name} to cart">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          Add to Cart
        </button>
        <button class="btn-details btn-details--light mt-2" data-id="${product.id}" aria-label="View details for ${product.name}">Details</button>
      </div>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   6. RENDER PRODUCT GRID
   -------------------------------------------------------------------------- */

function renderProductGrid() {
  console.log('Montfrut Catalog: Rendering product grid...');
  const filtered = getFilteredProducts();
  const bestSeller = products.find(p => p.isBestSeller);
  const gridWrap = document.getElementById('catalog-grid-wrap');
  const noResults = document.getElementById('no-results');
  const bestSellerSlot = document.getElementById('bestseller-slot');

  // Remove old dynamic cards
  gridWrap.querySelectorAll('.product-card').forEach(el => el.remove());

  // Best seller card
  if (bestSellerSlot) {
    const shouldShow = filtered.some(p => p.isBestSeller) && bestSeller;
    bestSellerSlot.innerHTML = shouldShow ? renderBestSellerCard(bestSeller) : '';
    bestSellerSlot.style.display = shouldShow ? '' : 'none';
  }

  // Regular products (exclude best seller)
  const regularProducts = filtered.filter(p => !p.isBestSeller);

  if (regularProducts.length === 0 && !filtered.some(p => p.isBestSeller)) {
    noResults.classList.remove('d-none');
  } else {
    noResults.classList.add('d-none');
    regularProducts.forEach(product => {
      const div = document.createElement('div');
      div.innerHTML = renderProductCard(product).trim();
      const card = div.firstChild;
      gridWrap.appendChild(card);
    });
  }

  attachCardEvents();
}


/* --------------------------------------------------------------------------
   7. SPECIAL COLLECTION CAROUSEL
   -------------------------------------------------------------------------- */

let carouselIndex = 0;

function getVisibleSpecialItems() {
  if (window.matchMedia('(min-width: 992px)').matches) return 3;
  if (window.matchMedia('(min-width: 576px)').matches) return 2;
  return 1;
}

function renderSpecialCollection() {
  console.log('Montfrut Catalog: Rendering special collection...');
  const specialProducts = products.filter(p => p.isSpecialCollection);
  const track = document.getElementById('special-track');
  if (!track) return;

  track.innerHTML = specialProducts.map(p => `
    <div class="special-item">
      <div class="special-item__img-wrap">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
      </div>
      <div class="special-item__body">
        <h4 class="special-item__name">${p.name}</h4>
        <p class="special-item__desc">${p.shortDescription}</p>
        <div class="special-item__footer">
          <span class="special-item__price">$${p.price.toFixed(2)}</span>
          <button class="btn-details btn-details--mini" data-id="${p.id}" aria-label="View details for ${p.name}">Details</button>
        </div>
      </div>
    </div>
  `).join('');

  carouselIndex = 0;
  if (track) track.style.transform = 'translateX(0)';
  updateCarouselButtons(specialProducts.length);
}

function updateCarouselButtons(total) {
  const btnPrev = document.getElementById('special-prev');
  const btnNext = document.getElementById('special-next');
  if (!btnPrev || !btnNext) return;

  const visibleItems = getVisibleSpecialItems();
  btnPrev.disabled = carouselIndex === 0;
  btnNext.disabled = carouselIndex >= Math.max(0, total - visibleItems);
}

function moveCarousel(direction) {
  const specialProducts = products.filter(p => p.isSpecialCollection);
  const itemWidth = document.querySelector('.special-item')?.offsetWidth || 0;
  const gap = parseFloat(getComputedStyle(document.getElementById('special-track')).columnGap) || 14;
  const visibleItems = getVisibleSpecialItems();

  carouselIndex = Math.max(0, Math.min(carouselIndex + direction, specialProducts.length - visibleItems));

  const track = document.getElementById('special-track');
  if (track) {
    track.style.transform = `translateX(-${carouselIndex * (itemWidth + gap)}px)`;
  }

  updateCarouselButtons(specialProducts.length);
}


/* --------------------------------------------------------------------------
   8. MODAL
   -------------------------------------------------------------------------- */

function openProductModal(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  // Populate modal fields
  document.getElementById('modal-title').textContent = product.name;
  document.getElementById('modal-price').textContent = `$${product.price.toFixed(2)}`;
  document.getElementById('modal-description').textContent = product.longDescription;
  document.getElementById('modal-tags').innerHTML = allergyTagsHTML(product.allergyTags) + 
    `<a href="#" class="modal-allergy-link" data-bs-toggle="modal" data-bs-target="#allergiesModal">Allergies information</a>`;
  document.getElementById('modal-flavor-notes').innerHTML = product.flavorNotes.map(n => `<span class="flavor-note">${n}</span>`).join('');
  document.getElementById('modal-ingredients').textContent = product.ingredients;

  // Set up carousel
  const carouselInner = document.getElementById('modal-carousel-inner');
  const carouselIndicators = document.getElementById('modal-carousel-indicators');
  const carouselThumbs = document.getElementById('modal-thumbnails');
  carouselInner.innerHTML = product.galleryImages.map((img, idx) => `
    <div class="carousel-item ${idx === 0 ? 'active' : ''}">
      <img src="${img}" class="d-block w-100 modal-carousel-img" alt="${product.name} — photo ${idx + 1}">
    </div>
  `).join('');
  carouselIndicators.innerHTML = product.galleryImages.map((_, idx) => `
    <button type="button" data-bs-target="#modalCarousel" data-bs-slide-to="${idx}" ${idx === 0 ? 'class="active" aria-current="true"' : ''} aria-label="Slide ${idx + 1}"></button>
  `).join('');
  if (carouselThumbs) {
    carouselThumbs.innerHTML = product.galleryImages.map((img, idx) => `
      <button class="modal-thumbnail ${idx === 0 ? 'active' : ''}" type="button" data-bs-target="#modalCarousel" data-bs-slide-to="${idx}" aria-label="Show ${product.name} photo ${idx + 1}">
        <img src="${img}" alt="" loading="lazy">
      </button>
    `).join('');
  }

  // Add to cart button in modal
  const modalCartBtn = document.getElementById('modal-add-to-cart');
  modalCartBtn.setAttribute('data-id', product.id);
  modalCartBtn.setAttribute('data-name', product.name);

  // Show modal
  const modalEl = document.getElementById('productModal');
  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
  const carouselEl = document.getElementById('modalCarousel');
  if (carouselEl && carouselThumbs && !carouselEl._thumbsBound) {
    carouselEl.addEventListener('slide.bs.carousel', event => {
      document.querySelectorAll('#modal-thumbnails .modal-thumbnail').forEach((thumb, idx) => {
        thumb.classList.toggle('active', idx === event.to);
      });
    });
    carouselEl._thumbsBound = true;
  }
  modal.show();
}


/* --------------------------------------------------------------------------
   9. EVENT DELEGATION
   -------------------------------------------------------------------------- */

function attachCardEvents() {
  const gridWrap = document.getElementById('catalog-grid-wrap');
  // Remove and re-add to avoid duplicate listeners (use a flag)
  if (!gridWrap._hasListener) {
    gridWrap.addEventListener('click', handleGridClick);
    gridWrap._hasListener = true;
  }
}

function handleGridClick(e) {
  const addBtn = e.target.closest('.btn-add-to-cart');
  const detailsBtn = e.target.closest('.btn-details');

  if (addBtn) {
    const id = parseInt(addBtn.getAttribute('data-id'));
    const product = products.find(p => p.id === id);
    if (product) addToCart(product.name);
  }

  if (detailsBtn) {
    const id = parseInt(detailsBtn.getAttribute('data-id'));
    openProductModal(id);
  }
}

// Modal Add to Cart
document.addEventListener('click', function(e) {
  if (e.target.id === 'modal-add-to-cart' || e.target.closest('#modal-add-to-cart')) {
    const btn = document.getElementById('modal-add-to-cart');
    const name = btn.getAttribute('data-name');
    addToCart(name || 'Product');
  }
});


/* --------------------------------------------------------------------------
   10. SEARCH & SORT
   -------------------------------------------------------------------------- */

function initSearchAndSort() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value;
      renderProductGrid();
    });
  }

  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      sortOrder = sortSelect.value;
      renderProductGrid();
    });
  }
}


/* --------------------------------------------------------------------------
   11. MOBILE FILTERS SYNC (offcanvas mirrors main sidebar)
   -------------------------------------------------------------------------- */

function syncOffcanvasFilters() {
  document.querySelectorAll('.filter-category-oc').forEach(cb => {
    cb.addEventListener('change', () => {
      // Mirror to sidebar
      const sibling = document.querySelector(`.filter-category[value="${cb.value}"]`);
      if (sibling) sibling.checked = cb.checked;
      if (cb.checked) {
        if (!activeCategories.includes(cb.value)) activeCategories.push(cb.value);
      } else {
        activeCategories = activeCategories.filter(c => c !== cb.value);
      }
      renderProductGrid();
    });
  });

  document.querySelectorAll('.filter-flavor-oc').forEach(cb => {
    cb.addEventListener('change', () => {
      const sibling = document.querySelector(`.filter-flavor[value="${cb.value}"]`);
      if (sibling) sibling.checked = cb.checked;
      if (cb.checked) {
        if (!activeFlavors.includes(cb.value)) activeFlavors.push(cb.value);
      } else {
        activeFlavors = activeFlavors.filter(f => f !== cb.value);
      }
      renderProductGrid();
    });
  });
}


/* --------------------------------------------------------------------------
   12. INIT
   -------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  // Render
  renderSpecialCollection();
  renderProductGrid();

  // Special collection event delegation
  const specialTrack = document.getElementById('special-track');
  if (specialTrack) {
    specialTrack.addEventListener('click', (e) => {
      const detailsBtn = e.target.closest('.btn-details');
      if (detailsBtn) {
        const id = parseInt(detailsBtn.getAttribute('data-id'));
        openProductModal(id);
      }
    });
  }

  // Events
  updateFilters();
  initSearchAndSort();
  syncOffcanvasFilters();

  // Special collection carousel buttons
  const btnPrev = document.getElementById('special-prev');
  const btnNext = document.getElementById('special-next');
  if (btnPrev) btnPrev.addEventListener('click', () => moveCarousel(-1));
  if (btnNext) btnNext.addEventListener('click', () => moveCarousel(1));
  window.addEventListener('resize', () => {
    const specialProducts = products.filter(p => p.isSpecialCollection);
    carouselIndex = Math.min(carouselIndex, Math.max(0, specialProducts.length - getVisibleSpecialItems()));
    moveCarousel(0);
  }, { passive: true });

  // Smooth scroll for internal anchors
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Navbar scroll effect
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
});
