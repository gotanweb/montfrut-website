/*
 * CAT-IMP-002A — Modelo de datos (sin validación funcional todavía).
 * status: 'available' (disponible y seleccionable), 'unavailable' (visible,
 * no seleccionable) o 'coming-soon' (adelanto visible, no seleccionable).
 * variants: grupos con id estable y único dentro del producto, label: { es, en },
 * required: boolean, selection: 'single' | 'multiple' y options: [].
 * Cada opción tiene id estable y único dentro del grupo, label: { es, en },
 * priceAdjustment: número finito >= 0 en USD (adicional al precio base)
 * y available: boolean. Los ids no cambian al traducir las etiquetas.
 * Un grupo obligatorio requiere al menos una opción; uno opcional permite cero.
 * 'single' admite como máximo una opción; 'multiple' admite varias.
 * Una opción con available: false no puede seleccionarse.
 * No hay selecciones predeterminadas. Estas reglas se implementarán más adelante.
 *
 * Ejemplo ficticio de producto: solo documentación, fuera del array real.
 * Las opciones y sus importes ilustrativos no describen productos actuales.
 * {
 *   id: 'example-only',
 *   status: 'available',
 *   variants: [
 *     {
 *       id: 'example-required',
 *       label: { es: 'Grupo obligatorio de ejemplo', en: 'Example required group' },
 *       required: true,
 *       selection: 'single',
 *       options: [
 *         {
 *           id: 'example-choice',
 *           label: { es: 'Opción de ejemplo', en: 'Example option' },
 *           priceAdjustment: 0,
 *           available: true
 *         }
 *       ]
 *     },
 *     {
 *       id: 'example-optional',
 *       label: { es: 'Grupo opcional de ejemplo', en: 'Example optional group' },
 *       required: false,
 *       selection: 'multiple',
 *       options: [
 *         {
 *           id: 'example-extra-a',
 *           label: { es: 'Adicional A de ejemplo', en: 'Example extra A' },
 *           priceAdjustment: 1.50,
 *           available: true
 *         },
 *         {
 *           id: 'example-extra-b',
 *           label: { es: 'Adicional B de ejemplo', en: 'Example extra B' },
 *           priceAdjustment: 0,
 *           available: false
 *         }
 *       ]
 *     }
 *   ]
 * }
 */
const products = [
  {
    id: 1,
    status: 'available',
    variants: [],
    name: 'Mendiant Trio',
    category: 'Chocolate Bonbons',
    flavor: 'Hazelnut',
    shortDescription: 'Smooth hazelnut praline enrobed in rich dark chocolate.',
    longDescription: 'A timeless classic reimagined. Our Hazelnut Praline Bonbons are crafted from slow-roasted Piedmont hazelnuts blended into a silky praline cream, then hand-dipped in 70% single-origin dark chocolate. Each piece is finished with a delicate hazelnut shard on top, offering a perfect balance of crunch, sweetness, and depth.',
    price: 25.00,
    image: 'assets/img/mendiant-trio-01.png',
    galleryImages: [
      'assets/img/mendiant-trio-02.png',
      'assets/img/mendiant-trio-03.png',
      'assets/img/mendiant-trio-04.png'
    ],
    allergyTags: ['Dairy', 'Nuts'],
    flavorNotes: ['Roasted Hazelnut', 'Dark Cacao', 'Caramelized Sugar'],
    ingredients: 'Dark chocolate (cocoa mass, sugar, cocoa butter, vanilla), hazelnut paste, cream, butter, sugar.',
    isBestSeller: true,
    isSpecialCollection: false
  },
  {
    id: 2,
    status: 'available',
    variants: [],
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
    status: 'available',
    variants: [],
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
    status: 'available',
    variants: [],
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
    status: 'available',
    variants: [],
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
    status: 'available',
    variants: [],
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
    status: 'available',
    variants: [],
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
    status: 'available',
    variants: [],
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
    status: 'available',
    variants: [],
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
    status: 'available',
    variants: [],
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
