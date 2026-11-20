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
// CAT-REF-001: commercial texts live here in translations.en / translations.es.
// CAT-IMP-005C: stable filter values and bilingual labels, in display order.
// Add a definition here only when a product needs a new category or flavor.
const catalogTaxonomy = {
  categories: [
    { value: 'Chocolate Bonbons', label: { en: 'Chocolate Bonbons', es: 'Bombones de chocolate' } },
    { value: 'Truffles', label: { en: 'Truffles', es: 'Trufas' } },
    { value: 'Chocolate Bars', label: { en: 'Chocolate Bars', es: 'Tabletas de chocolate' } },
    { value: 'Gift Boxes', label: { en: 'Gift Boxes', es: 'Cajas de regalo' } },
    { value: 'Seasonal Collection', label: { en: 'Seasonal Collection', es: 'Colección de temporada' } }
  ],
  flavors: [
    { value: 'Dark Chocolate', label: { en: 'Dark Chocolate', es: 'Chocolate negro' } },
    { value: 'Milk Chocolate', label: { en: 'Milk Chocolate', es: 'Chocolate con leche' } },
    { value: 'White Chocolate', label: { en: 'White Chocolate', es: 'Chocolate blanco' } },
    { value: 'Hazelnut', label: { en: 'Hazelnut', es: 'Avellana' } },
    { value: 'Caramel', label: { en: 'Caramel', es: 'Caramelo' } }
  ]
};

const products = [
  {
    id: 1,
    status: 'available',
    variants: [],
    translations: {
      "en": {
        "name": "Mendiant Trio",
        "shortDescription": "Smooth hazelnut praline enrobed in rich dark chocolate.",
        "longDescription": "A timeless classic reimagined. Our Hazelnut Praline Bonbons are crafted from slow-roasted Piedmont hazelnuts blended into a silky praline cream, then hand-dipped in 70% single-origin dark chocolate. Each piece is finished with a delicate hazelnut shard on top, offering a perfect balance of crunch, sweetness, and depth.",
        "ingredients": "Dark chocolate (cocoa mass, sugar, cocoa butter, vanilla), hazelnut paste, cream, butter, sugar.",
        "flavorNotes": [
          "Roasted Hazelnut",
          "Dark Cacao",
          "Caramelized Sugar"
        ]
      },
      "es": {
        "name": "Mendiant Trio",
        "shortDescription": "Suave praliné de avellana recubierto de intenso chocolate negro.",
        "longDescription": "Un clásico de siempre, reinterpretado. Nuestros bombones de praliné de avellana se elaboran con avellanas de Piamonte tostadas lentamente y mezcladas en una crema de praliné sedosa, que luego se bañan a mano en chocolate negro de origen único al 70%. Cada pieza se termina con un delicado trocito de avellana, que ofrece un equilibrio entre textura crujiente, dulzor y profundidad.",
        "ingredients": "Chocolate negro (pasta de cacao, azúcar, manteca de cacao, vainilla), pasta de avellana, crema, manteca, azúcar.",
        "flavorNotes": [
          "Avellana tostada",
          "Cacao negro",
          "Azúcar caramelizada"
        ]
      }
    },
    category: 'Chocolate Bonbons',
    flavor: 'Hazelnut',
    price: 25.00,
    image: 'assets/img/mendiant-trio-01.png',
    galleryImages: [
      'assets/img/mendiant-trio-02.png',
      'assets/img/mendiant-trio-03.png',
      'assets/img/mendiant-trio-04.png'
    ],
    allergyTags: ['Dairy', 'Nuts'],
    isBestSeller: true,
    isSpecialCollection: false
  },
  {
    id: 2,
    status: 'available',
    variants: [],
    translations: {
      "en": {
        "name": "Signature Collection – 12pc",
        "shortDescription": "An exquisite selection of our most loved flavors.",
        "longDescription": "Twelve of our finest bonbons, carefully curated into an elegant gift box. This collection includes four each of our Hazelnut Praline, Sea Salt Caramel, and Raspberry Ganache — showcasing the full range of Montfrut craftsmanship. Each bonbon is individually nestled in a hand-folded paper cup within a lacquered presentation box.",
        "ingredients": "Dark chocolate, milk chocolate, cream, butter, hazelnut paste, sea salt, raspberry purée, sugar.",
        "flavorNotes": [
          "Mixed Selection",
          "Dark Cacao",
          "Hazelnut",
          "Caramel"
        ]
      },
      "es": {
        "name": "Colección Signature – 12 unidades",
        "shortDescription": "Una exquisita selección de nuestros sabores más apreciados.",
        "longDescription": "Doce de nuestros mejores bombones, cuidadosamente seleccionados en una elegante caja de regalo. Esta colección incluye cuatro de praliné de avellana, cuatro de caramelo con sal marina y cuatro de ganache de frambuesa, que muestran toda la variedad de la elaboración artesanal de Montfrut. Cada bombón se coloca individualmente en una cápsula de papel plegada a mano dentro de una caja de presentación laqueada.",
        "ingredients": "Chocolate negro, chocolate con leche, crema, manteca, pasta de avellana, sal marina, puré de frambuesa, azúcar.",
        "flavorNotes": [
          "Selección variada",
          "Cacao negro",
          "Avellana",
          "Caramelo"
        ]
      }
    },
    category: 'Gift Boxes',
    flavor: 'Dark Chocolate',
    price: 36.00,
    image: 'assets/img/signature_box.png',
    galleryImages: [
      'assets/img/signature_box.png',
      'assets/img/hazelnut_bonbons.png',
      'assets/img/pistachio_bonbons.png'
    ],
    allergyTags: ['Dairy', 'Nuts'],
    isBestSeller: false,
    isSpecialCollection: true
  },
  {
    id: 3,
    status: 'available',
    variants: [],
    translations: {
      "en": {
        "name": "Classic Truffles",
        "shortDescription": "Silky truffles with a rich cocoa finish.",
        "longDescription": "Our Classic Truffles embody the purest expression of chocolate. A deeply rich ganache made from 65% Ecuadorian cacao is rolled by hand and dusted in a fine cocoa powder coat. Soft, yielding, and intensely chocolatey — these are for the true connoisseur who appreciates simplicity done with perfection.",
        "ingredients": "Dark chocolate (65% cocoa), cream, butter, cocoa powder for dusting.",
        "flavorNotes": [
          "Rich Cacao",
          "Vanilla",
          "Earthy Notes"
        ]
      },
      "es": {
        "name": "Trufas clásicas",
        "shortDescription": "Trufas sedosas con un intenso acabado de cacao.",
        "longDescription": "Nuestras trufas clásicas representan la expresión más pura del chocolate. Una ganache de gran intensidad, elaborada con cacao ecuatoriano al 65%, se moldea a mano y se recubre con una fina capa de cacao en polvo. Suaves, delicadas e intensamente achocolatadas, están pensadas para quienes aprecian la sencillez realizada a la perfección.",
        "ingredients": "Chocolate negro (65% de cacao), crema, manteca, cacao en polvo para recubrir.",
        "flavorNotes": [
          "Cacao intenso",
          "Vainilla",
          "Notas terrosas"
        ]
      }
    },
    category: 'Truffles',
    flavor: 'Dark Chocolate',
    price: 22.00,
    image: 'assets/img/classic_truffles.png',
    galleryImages: [
      'assets/img/classic_truffles.png',
      'assets/img/dark_chocolate_bar.png',
      'assets/img/hazelnut_bonbons.png'
    ],
    allergyTags: ['Dairy'],
    isBestSeller: false,
    isSpecialCollection: true
  },
  {
    id: 4,
    status: 'available',
    variants: [],
    translations: {
      "en": {
        "name": "70% Dark Chocolate Bar",
        "shortDescription": "Pure single-origin 70% cacao in a sleek artisan bar.",
        "longDescription": "Sourced from a single estate in Madagascar, this 70% dark chocolate bar is a study in restraint and quality. With notes of dried fruit, subtle earthiness, and a long, clean finish, it is meant to be savored slowly. Stone-ground for 48 hours, then tempered by hand for a perfect snap and glossy surface.",
        "ingredients": "Dark chocolate (cocoa mass 70%, sugar, cocoa butter, vanilla extract). May contain traces of milk and nuts.",
        "flavorNotes": [
          "Red Fruit",
          "Earthiness",
          "Long Finish"
        ]
      },
      "es": {
        "name": "Tableta de chocolate negro 70%",
        "shortDescription": "Cacao puro de origen único al 70% en una elegante tableta artesanal.",
        "longDescription": "Elaborada con cacao de una única finca de Madagascar, esta tableta de chocolate negro al 70% es una expresión de sobriedad y calidad. Con notas de frutas deshidratadas, un sutil carácter terroso y un final largo y limpio, invita a saborearla lentamente. Se muele en piedra durante 48 horas y luego se templa a mano para lograr un quiebre perfecto y una superficie brillante.",
        "ingredients": "Chocolate negro (pasta de cacao 70%, azúcar, manteca de cacao, extracto de vainilla). Puede contener trazas de leche y frutos secos.",
        "flavorNotes": [
          "Frutos rojos",
          "Notas terrosas",
          "Final prolongado"
        ]
      }
    },
    category: 'Chocolate Bars',
    flavor: 'Dark Chocolate',
    price: 14.00,
    image: 'assets/img/dark_chocolate_bar.png',
    galleryImages: [
      'assets/img/dark_chocolate_bar.png',
      'assets/img/classic_truffles.png',
      'assets/img/hazelnut_bonbons.png'
    ],
    allergyTags: ['Dairy-Free', 'Gluten-Free'],
    isBestSeller: false,
    isSpecialCollection: false
  },
  {
    id: 5,
    status: 'available',
    variants: [],
    translations: {
      "en": {
        "name": "Pistachio Delight Bonbons",
        "shortDescription": "Pistachio ganache in white chocolate.",
        "longDescription": "Iranian pistachios, slow-roasted and ground into a vibrant green paste, form the heart of these elegant bonbons. The ganache is delicate and aromatic, encased in a hand-painted white chocolate shell. A touch of cardamom lifts the flavor, making each piece a small, sophisticated indulgence.",
        "ingredients": "White chocolate (cocoa butter, sugar, milk powder, vanilla), pistachio paste, cream, cardamom.",
        "flavorNotes": [
          "Pistachio",
          "Cardamom",
          "White Cacao"
        ]
      },
      "es": {
        "name": "Bombones Delicia de Pistacho",
        "shortDescription": "Ganache de pistacho en chocolate blanco.",
        "longDescription": "Pistachos iraníes, tostados lentamente y molidos hasta obtener una pasta de intenso color verde, forman el corazón de estos elegantes bombones. La ganache es delicada y aromática, recubierta por una capa de chocolate blanco pintada a mano. Un toque de cardamomo realza el sabor y convierte cada pieza en un pequeño y sofisticado placer.",
        "ingredients": "Chocolate blanco (manteca de cacao, azúcar, leche en polvo, vainilla), pasta de pistacho, crema, cardamomo.",
        "flavorNotes": [
          "Pistacho",
          "Cardamomo",
          "Cacao blanco"
        ]
      }
    },
    category: 'Chocolate Bonbons',
    flavor: 'White Chocolate',
    price: 24.00,
    image: 'assets/img/pistachio_bonbons.png',
    galleryImages: [
      'assets/img/pistachio_bonbons.png',
      'assets/img/hazelnut_bonbons.png',
      'assets/img/signature_box.png'
    ],
    allergyTags: ['Dairy', 'Nuts'],
    isBestSeller: false,
    isSpecialCollection: false
  },
  {
    id: 6,
    status: 'available',
    variants: [],
    translations: {
      "en": {
        "name": "Premium Gift Box – 24pc",
        "shortDescription": "A luxurious assortment for special moments.",
        "longDescription": "Twenty-four of our finest chocolates presented in a handcrafted lacquered box with a satin ribbon. An ideal gift for any occasion, featuring six different varieties across our full flavor range. Beautifully arranged and ready to gift, or to treasure for yourself — because you deserve it.",
        "ingredients": "Assorted chocolates: dark, milk, white chocolate, various fillings. See individual product descriptions.",
        "flavorNotes": [
          "Full Spectrum",
          "Milk Cacao",
          "Caramel",
          "Hazelnut"
        ]
      },
      "es": {
        "name": "Caja de regalo prémium – 24 unidades",
        "shortDescription": "Un lujoso surtido para momentos especiales.",
        "longDescription": "Veinticuatro de nuestros mejores chocolates presentados en una caja laqueada artesanal con una cinta de satén. Un regalo ideal para cualquier ocasión, con seis variedades de toda nuestra gama de sabores. Bellamente dispuestos y listos para regalar, o para disfrutar vos mismo, porque te lo merecés.",
        "ingredients": "Chocolates surtidos: chocolate negro, con leche, blanco y distintos rellenos. Consultá las descripciones de cada producto.",
        "flavorNotes": [
          "Gama completa",
          "Cacao con leche",
          "Caramelo",
          "Avellana"
        ]
      }
    },
    category: 'Gift Boxes',
    flavor: 'Milk Chocolate',
    price: 68.00,
    image: 'assets/img/premium_box.png',
    galleryImages: [
      'assets/img/premium_box.png',
      'assets/img/signature_box.png',
      'assets/img/mini_moments.png'
    ],
    allergyTags: ['Dairy', 'Nuts', 'Soy'],
    isBestSeller: false,
    isSpecialCollection: true
  },
  {
    id: 7,
    status: 'available',
    variants: [],
    translations: {
      "en": {
        "name": "Sea Salt Caramels",
        "shortDescription": "Buttery caramel with a hint of sea salt.",
        "longDescription": "Slow-cooked caramel made from organic cane sugar and French butter, finished with hand-harvested Fleur de Sel sea salt and enrobed in rich milk chocolate. The balance of sweet, salty, and chocolatey is simply irresistible. A Montfrut favorite — and once tried, always requested.",
        "ingredients": "Milk chocolate (sugar, cocoa butter, whole milk powder, cocoa mass), caramel (sugar, cream, butter), sea salt.",
        "flavorNotes": [
          "Salted Caramel",
          "Milk Chocolate",
          "Fleur de Sel"
        ]
      },
      "es": {
        "name": "Caramelos con sal marina",
        "shortDescription": "Caramelo con manteca y un toque de sal marina.",
        "longDescription": "Caramelo cocido lentamente con azúcar de caña orgánica y manteca francesa, terminado con sal marina Fleur de Sel recolectada a mano y recubierto de intenso chocolate con leche. El equilibrio entre dulzor, sal y chocolate resulta irresistible. Un favorito de Montfrut que, una vez probado, siempre se vuelve a pedir.",
        "ingredients": "Chocolate con leche (azúcar, manteca de cacao, leche entera en polvo, pasta de cacao), caramelo (azúcar, crema, manteca), sal marina.",
        "flavorNotes": [
          "Caramelo salado",
          "Chocolate con leche",
          "Fleur de Sel"
        ]
      }
    },
    category: 'Chocolate Bonbons',
    flavor: 'Caramel',
    price: 20.00,
    image: 'assets/img/sea_salt_caramels.png',
    galleryImages: [
      'assets/img/sea_salt_caramels.png',
      'assets/img/classic_truffles.png',
      'assets/img/dark_chocolate_bar.png'
    ],
    allergyTags: ['Dairy', 'Nuts'],
    isBestSeller: false,
    isSpecialCollection: false
  },
  {
    id: 8,
    status: 'available',
    variants: [],
    translations: {
      "en": {
        "name": "Mini Moments – 9pc",
        "shortDescription": "Perfect bite-size indulgences for any craving.",
        "longDescription": "Nine miniature bonbons in a petite presentation box, ideal for an intimate gift or personal treat. Featuring our three most beloved flavors in a smaller format — Hazelnut Praline, Salted Caramel, and Classic Ganache. Small in size, enormous in pleasure.",
        "ingredients": "Milk chocolate, dark chocolate, cream, hazelnut paste, caramel, butter, sugar.",
        "flavorNotes": [
          "Hazelnut",
          "Caramel",
          "Dark Ganache"
        ]
      },
      "es": {
        "name": "Mini Moments – 9 unidades",
        "shortDescription": "Pequeños placeres del tamaño de un bocado para cualquier antojo.",
        "longDescription": "Nueve bombones en miniatura en una pequeña caja de presentación, ideales para un regalo íntimo o un gusto personal. Incluyen nuestros tres sabores más apreciados en un formato menor: praliné de avellana, caramelo salado y ganache clásica. Pequeños en tamaño, enormes en placer.",
        "ingredients": "Chocolate con leche, chocolate negro, crema, pasta de avellana, caramelo, manteca, azúcar.",
        "flavorNotes": [
          "Avellana",
          "Caramelo",
          "Ganache de chocolate negro"
        ]
      }
    },
    category: 'Chocolate Bonbons',
    flavor: 'Milk Chocolate',
    price: 18.00,
    image: 'assets/img/mini_moments.png',
    galleryImages: [
      'assets/img/mini_moments.png',
      'assets/img/signature_box.png',
      'assets/img/premium_box.png'
    ],
    allergyTags: ['Dairy', 'Nuts', 'Berries'],
    isBestSeller: false,
    isSpecialCollection: false
  },
  {
    id: 9,
    status: 'available',
    variants: [],
    translations: {
      "en": {
        "name": "Coconut Dream Bonbons",
        "shortDescription": "Creamy coconut filling in dark chocolate.",
        "longDescription": "Inspired by tropical flavors, these bonbons combine a smooth coconut cream filling with toasted coconut flakes and a hint of rum, all wrapped in a deep 68% dark chocolate shell. The contrast of tropical sweetness against the intensity of dark cacao creates an unexpectedly refined pairing.",
        "ingredients": "Dark chocolate (68% cocoa mass), coconut cream, toasted coconut flakes, rum, sugar.",
        "flavorNotes": [
          "Toasted Coconut",
          "Dark Cacao",
          "Subtle Rum"
        ]
      },
      "es": {
        "name": "Bombones Sueño de Coco",
        "shortDescription": "Relleno cremoso de coco en chocolate negro.",
        "longDescription": "Inspirados en sabores tropicales, estos bombones combinan un suave relleno de crema de coco con coco tostado en láminas y un toque de ron, todo recubierto por una capa de intenso chocolate negro al 68%. El contraste entre el dulzor tropical y la intensidad del cacao negro crea una combinación inesperadamente refinada.",
        "ingredients": "Chocolate negro (68% de pasta de cacao), crema de coco, coco tostado en láminas, ron, azúcar.",
        "flavorNotes": [
          "Coco tostado",
          "Cacao negro",
          "Sutil toque de ron"
        ]
      }
    },
    category: 'Chocolate Bonbons',
    flavor: 'Dark Chocolate',
    price: 24.00,
    image: 'assets/img/coconut_bonbons.png',
    galleryImages: [
      'assets/img/coconut_bonbons.png',
      'assets/img/pistachio_bonbons.png',
      'assets/img/hazelnut_bonbons.png'
    ],
    allergyTags: ['Dairy', 'Coconut'],
    isBestSeller: false,
    isSpecialCollection: false
  },
  {
    id: 10,
    status: 'available',
    variants: [],
    translations: {
      "en": {
        "name": "Seasonal Chocolate Box",
        "shortDescription": "A curated seasonal selection, available for a limited time.",
        "longDescription": "Four times a year, our chocolatiers craft an exclusive seasonal box inspired by nature's finest offerings. This edition features winter spices: cinnamon ganache, clove-infused dark chocolate, and a warming cardamom truffle. Each box is numbered and includes a card describing the seasonal inspiration.",
        "ingredients": "Dark chocolate, milk chocolate, cream, butter, cinnamon, clove extract, cardamom, sugar.",
        "flavorNotes": [
          "Cinnamon",
          "Clove",
          "Cardamom",
          "Dark Cacao"
        ]
      },
      "es": {
        "name": "Caja de chocolates de temporada",
        "shortDescription": "Una cuidada selección de temporada, disponible por tiempo limitado.",
        "longDescription": "Cuatro veces al año, nuestros chocolateros crean una caja de temporada exclusiva inspirada en lo mejor de la naturaleza. Esta edición presenta especias de invierno: ganache de canela, chocolate negro infusionado con clavo de olor y una cálida trufa de cardamomo. Cada caja está numerada e incluye una tarjeta que describe la inspiración de la temporada.",
        "ingredients": "Chocolate negro, chocolate con leche, crema, manteca, canela, extracto de clavo de olor, cardamomo, azúcar.",
        "flavorNotes": [
          "Canela",
          "Clavo de olor",
          "Cardamomo",
          "Cacao negro"
        ]
      }
    },
    category: 'Seasonal Collection',
    flavor: 'Dark Chocolate',
    price: 42.00,
    image: 'assets/img/seasonal_box.png',
    galleryImages: [
      'assets/img/seasonal_box.png',
      'assets/img/premium_box.png',
      'assets/img/signature_box.png'
    ],
    allergyTags: ['Dairy', 'Nuts'],
    isBestSeller: false,
    isSpecialCollection: true
  }
];
