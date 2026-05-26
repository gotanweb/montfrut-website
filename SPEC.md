Especificación Técnica — Montfrut One-Page Site

0. Contexto y Filosofía de Diseño
Objetivo: Construir el sitio principal de Montfrut (one-page) que actúe como ancla de marca y conversión hacia el catálogo y los canales de contacto. El sitio existente de catálogo y la landing de links ya están construidos; este nuevo sitio debe sentirse como un tercer hermano dentro del mismo ecosistema visual: misma paleta, mismas tipografías, mismas curvas, misma textura de fondo, mismos headers/footers oscuros con borde dorado.
Principio rector: "Boutique chocolatier digital storefront", no "ecommerce". Cada sección debe respirar, los productos no se venden directamente desde esta one-page (eso es trabajo del catálogo), aquí se cuenta la historia, se construye confianza y se canaliza la conversación.
Idioma: 100% inglés. Todo el copy, alt-texts, aria-labels, meta tags, structured data, formularios y mensajes de UI.
Mobile-first obligatorio. Cada sección debe diseñarse primero en mobile (≤575px), luego escalar a tablet (576–991px) y desktop (≥992px).

1. Stack y Estructura de Archivos
/montfrut-site/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── scripts.js
└── assets/
    ├── img/
    │   ├── montfrut-logo.png            (ya existe, reutilizar)
    │   ├── bg-mobile.png, bg-tablet.png, bg-desktop.png  (reutilizar de /links/)
    │   ├── hero-chocolate.jpg           (nueva, hero principal)
    │   ├── bio-portrait.jpg             (nueva, sección bio)
    │   ├── portfolio/
    │   │   ├── corporate-01.jpg ... corporate-06.jpg
    │   │   ├── events-01.jpg ... events-06.jpg
    │   │   └── special-01.jpg ... special-06.jpg
    │   ├── collections/
    │   │   ├── signature.jpg, premium.jpg, seasonal.jpg, dubai.jpg, mini.jpg
    │   ├── payment/
    │   │   ├── cash.svg, zelle.svg
    │   ├── recognition/
    │   │   ├── rec-01-cover.jpg ... rec-04-cover.jpg
    │   │   └── rec-01-gallery-*.jpg (3-4 por reconocimiento)
    │   ├── community/
    │   │   ├── comm-01-cover.jpg ... comm-03-cover.jpg
    │   │   └── comm-01-gallery-*.jpg
    │   ├── reviews/
    │   │   └── avatar-placeholder.svg
    │   └── og-home.jpg                  (Open Graph 1200x630)
    └── icons/
        └── (SVG inline en HTML, no archivos sueltos)
Dependencias externas (CDN):

Bootstrap 5.3.3 (CSS + JS bundle).
Google Fonts: Playfair Display (500, 600, 700), Lora (400, 500, 600, italic 400), Montserrat (400, 500, 600, 700).
Font Awesome 6.5.2 para iconografía (mismo que index links.html, por consistencia).

No usar: jQuery, AOS, Swiper, GSAP, ni librerías adicionales. Todo el JS debe ser vanilla, similar al patrón de scripts_catalog.js.

2. Sistema de Diseño (Design Tokens)
2.1 CSS Variables — declarar en :root al inicio de styles.css
css:root {
  /* Paleta oficial */
  --almond-cream: #feeed5;
  --midnight-blue: #253245;
  --steel-teal: #586667;
  --coral-blush: #ffaa96;
  --fiery-coral: #f25850;
  --mint-aqua: #b5d9d7;
  --sea-glass: #68a19b;
  --desert-sand: #c1935b;
  --blood-crimson: #0d1e32;
  --vanilla-cream: #fceac6;

  /* Tokens semánticos (alineados con el catálogo) */
  --color-bg: #fff8ef;
  --color-surface: rgba(255, 253, 247, 0.92);
  --color-header-bg: var(--blood-crimson);
  --color-footer-bg: var(--blood-crimson);
  --color-text-primary: var(--midnight-blue);
  --color-text-muted: var(--steel-teal);
  --color-accent: var(--desert-sand);
  --color-accent-light: var(--vanilla-cream);

  /* Tipografía */
  --font-display: 'Playfair Display', Georgia, serif;
  --font-accent: 'Lora', Georgia, serif;
  --font-ui: 'Montserrat', system-ui, sans-serif;

  /* Espaciado */
  --section-py-mobile: 3.5rem;
  --section-py-desktop: 6rem;
  --container-max: 1280px;
  --card-radius: 12px;
  --card-shadow: 0 10px 30px rgba(13, 30, 50, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.78);
  --card-shadow-hover: 0 18px 42px rgba(13, 30, 50, 0.13), inset 0 1px 0 rgba(255, 255, 255, 0.9);

  /* Transiciones */
  --transition-fast: 180ms ease;
  --transition-med: 260ms ease;
  --transition-slow: 400ms cubic-bezier(0.4, 0, 0.2, 1);
}
2.2 Uso obligatorio de colores

Fondos de sección: alternar entre --color-bg (almond/cream con textura sutil) y rgba(255, 250, 242, 0.6) con backdrop-filter: blur(8px) para variar densidad.
Headers/Footer: --blood-crimson con borde inferior/superior de 2px en --desert-sand (idéntico al catálogo).
Acentos y micro-detalles: --desert-sand para uppercase labels, divisores ornamentales en --fiery-coral (corazón).
CTAs primarios: gradiente linear-gradient(180deg, var(--midnight-blue), var(--blood-crimson)) con texto --vanilla-cream.
CTAs secundarios / outline: fondo #f8f9fa o transparente, borde rgba(13, 30, 50, 0.15), hover borde --desert-sand.
WhatsApp: gradiente verde #25D366, mismo patrón del botón de WhatsApp en index_links.html.
Tags / chips: fondo rgba(252, 234, 198, 0.72), borde rgba(193, 147, 91, 0.2), texto --midnight-blue.

2.3 Tipografía — escalas
TokenMobileDesktopFamiliaPesoH1 heroclamp(2.4rem, 9vw, 4.5rem)4.5remPlayfair Display700H2 secciónclamp(2rem, 6vw, 3rem)3remPlayfair Display600H3 subsección / card title1.25rem1.5remPlayfair Display600Eyebrow label0.6875rem0.75remMontserrat700, uppercase, letter-spacing 0.18em, color --desert-sandBody0.9375rem1remMontserrat400, line-height 1.65Body italic / quote0.95rem1.05remLora italic400Button0.8125rem0.875remMontserrat600, letter-spacing 0.04emSmall / footer0.75rem0.8remMontserrat400
2.4 Ornamento "heart divider" (firma visual)
Reutilizar el patrón ya presente en catálogo y links:
html<div class="ornament" aria-hidden="true">
  <span class="ornament-line"></span>
  <i class="fa-solid fa-heart ornament-heart"></i>
  <span class="ornament-line"></span>
</div>
Aparece debajo de cada H2 de sección. ornament-line es un gradient horizontal linear-gradient(90deg, transparent, var(--fiery-coral), transparent), max-width 90px en mobile y 130px en desktop.

3. Estructura HTML Global
3.1 <head> — SEO obligatorio

<title>: "Montfrut — Artisan Chocolate Made Experience | NJ & NY"
<meta name="description">: "Handcrafted artisan chocolates from Montfrut. Custom corporate gifts, event favors, and special occasion creations across New Jersey and New York. Chocolate made experience."
Keywords: artisan chocolate, handcrafted bonbons, corporate chocolate gifts, event favors NJ, NY chocolatier, custom chocolate, Dubai chocolate bar, gourmet truffles.
Open Graph completo (og:type=website, og:title, og:description, og:image=assets/img/og-home.jpg, og:url, og:locale=en_US, og:site_name).
Twitter Card summary_large_image.
Canonical: https://www.montfrut.com/
Favicon: assets/img/favicon.png.
Preconnect a Google Fonts.
Structured Data JSON-LD con tres bloques:

LocalBusiness (datos de contacto, areaServed: NJ y NY, telephone, email, sameAs con redes).
Organization (logo, founder opcional, descripción).
FAQPage (4 preguntas que coinciden 1:1 con la sección FAQ).



3.2 <body> — esqueleto semántico
<body>
  <a class="skip-link" href="#main-content">Skip to content</a>
  <header class="site-header" role="banner">…</header>
  <main id="main-content">
    <section id="hero">…</section>
    <section id="bio">…</section>
    <section id="portfolio">…</section>
    <section id="collections">…</section>
    <section id="faq">…</section>
    <section id="reviews">…</section>
    <section id="recognition">…</section>
    <section id="community">…</section>
    <section id="contact">…</section>
  </main>
  <footer class="site-footer" role="contentinfo">…</footer>
  <!-- modals al final del body -->
  <div id="recognitionModal" class="modal fade">…</div>
  <div id="communityModal" class="modal fade">…</div>
  <div id="contactSuccessModal" class="modal fade">…</div>
</body>
Cada <section> lleva aria-labelledby apuntando al H2 correspondiente.

4. HEADER
Sticky en scroll, idéntico patrón al catálogo: grid de 3 columnas (1fr auto 1fr), altura 64px mobile / 76px tablet / 92px desktop, fondo var(--blood-crimson) con textura sutil heredada del catálogo (linear-gradient(180deg, rgba(13,30,50,0.98), rgba(7,24,41,0.98)) sobre bg-desktop.png), borde inferior 2px var(--desert-sand).
Contenido:

Izquierda: hamburguesa (mobile-only, abre offcanvas con nav mobile) + nav inline desktop con enlaces ancla: Home, About, Portfolio, Collections, FAQ, Contact. Estilo nav-link-custom ya definido en catálogo (Montserrat 0.75rem, uppercase, letter-spacing 0.15em, color almond-cream, hover desert-sand).
Centro: logo Montfrut (210x86 ratio, altura efectiva ~42px mobile / 76px desktop).
Derecha: dos iconos SVG: Catalog (link a /catalog/) y Links (link a /links/). En desktop, además, un botón pequeño "Order Now" en estilo --desert-sand outline → scrollea a #contact. En mobile el botón Order Now no aparece, los iconos sí.

Smooth scroll: todos los enlaces ancla del header navegan con scrollIntoView({behavior:'smooth', block:'start'}) con offset igual a la altura del header sticky (compensar con scroll-margin-top en cada <section>).
Scroll effect: clase .scrolled cuando window.scrollY > 10, agrega box-shadow más pronunciada.
Offcanvas mobile (#mobileNav): fondo --color-sidebar-bg, items con iconos FA-solid, mismo estilo .offcanvas-nav-link ya definido en catálogo. Incluir al pie del offcanvas un mini bloque con redes sociales (4 iconos) y un botón WhatsApp.

5. SECTION 1 — HERO
Altura: min-height: 100vh en mobile, min-height: 88vh en desktop (compensar header sticky).
Layout mobile: single column centrado verticalmente. Logo arriba, subtitle, ornament heart, frase poética, CTA, scroll indicator.
Layout desktop: mismo single-column centrado, pero el ancho del bloque de texto se limita a max-width: 720px con padding generoso. No hay imagen split — el hero es atmosférico.
Fondo: imagen assets/img/hero-chocolate.jpg (composición artística de bombones, paleta cálida, baja saturación, mucho espacio negativo en la zona central) cubriendo full viewport con object-fit: cover. Encima, dos overlays apilados:

linear-gradient(180deg, rgba(13,30,50,0.55) 0%, rgba(13,30,50,0.30) 40%, rgba(255,248,238,0.50) 100%) para legibilidad.
Una capa muy sutil de "grain" opcional: radial-gradient(ellipse at center, transparent 0%, rgba(13,30,50,0.15) 100%).

Contenido:
[Eyebrow: "WELCOME TO MONTFRUT"]   ← Montserrat uppercase, desert-sand, 0.75rem
[Logo Montfrut grande: max-width 280px mobile, 360px desktop, drop-shadow]
[H1: "Chocolate Made Experience"]   ← Playfair Display, vanilla-cream
[Heart divider]
[Subtitle: "Handcrafted bonbons, Dubai bars, and bespoke creations for moments that matter."]   ← Lora italic, almond-cream, max-width 540px
[CTA primario: "Explore Our Work"]  ← scrollea a #portfolio
[CTA secundario, outline almond-cream: "Get in Touch"]  ← scrollea a #contact
[Scroll indicator: pequeña flecha animada bouncing hacia abajo + texto "scroll" en uppercase]
Animaciones:

Entry stagger via clase .anim-entry (igual patrón que links): fade + translateY(14px) → 0, delays escalonados: eyebrow 60ms, logo 150ms, h1 280ms, divider 380ms, subtitle 460ms, CTAs 580ms, scroll-indicator 800ms.
Scroll indicator: @keyframes bounce-soft infinite, 1.8s, translateY 0→6px→0.

Decisiones tomadas: El CTA primario lleva a #portfolio porque la propuesta de valor diferencial de la marca son sus creaciones para corporativo/eventos/ocasiones, no el catálogo plano de productos. El CTA secundario empuja a contacto, que es la conversión real.

6. SECTION 2 — BIO ("Our Story")
Layout: padding: var(--section-py-mobile) 1rem (mobile) / var(--section-py-desktop) 2rem (desktop). Container max 1180px.
Mobile: stack vertical — imagen arriba, texto abajo.
Desktop (≥992px): grid de 2 columnas 5fr 6fr con gap: 4rem, alignment center. Imagen a la izquierda, texto a la derecha.
Imagen:

assets/img/bio-portrait.jpg: foto editorial cálida (manos de chocolatera trabajando ganache, o composición de ingredientes crudos sobre mármol, paleta natural marrón/crema).
Aspect-ratio 4/5 desktop, 3/2 mobile.
Border-radius 12px.
Box-shadow: 0 20px 60px rgba(13, 30, 50, 0.18).
Detalle premium: un cuadrado decorativo offset detrás de la imagen, 60% del tamaño, color var(--vanilla-cream), posicionado bottom: -1.5rem; right: -1.5rem, z-index detrás. Solo desktop. Crea profundidad sin recargar.

Texto:

Eyebrow: OUR STORY
H2: Crafted with intention. (Playfair Display, 3rem desktop)
Heart divider (alineado izquierda, no centrado, en desktop)
Párrafo 1 (Lora italic, leading): "Montfrut was born from a simple belief — that chocolate is more than confection. It's memory, ritual, and craft, captured in a single bite."
Párrafo 2 (Montserrat regular): qué hacen — bombones artesanales en pequeños lotes, Dubai bars (signature), creaciones a medida para corporativo y eventos. Énfasis en ingredientes (Belgian couverture, Iranian pistachios, organic dairy), técnica (hand-painted molds, tempering by hand), y filosofía (slow craft, ethically sourced cocoa).
Párrafo 3 (Montserrat regular): propuesta de valor — basados en Jersey City, sirviendo NJ y NY, especializados en regalos corporativos premium y experiencias para eventos privados.
Tres "value pills" horizontales debajo del texto: 🍫 Small Batches, 🌱 Ethically Sourced, ✋ Handcrafted Daily. Estilo idéntico a las allergy-tag del catálogo pero más grandes, con icono SVG inline a la izquierda. Wrap en mobile.

Animación: la imagen y el bloque de texto entran con IntersectionObserver cuando 30% de la sección es visible, fade + translateY(20px), transition: 0.7s ease. Stagger 150ms entre imagen y texto.

7. SECTION 3 — PORTFOLIO (con tabs)
Esta es la sección clave del sitio. Implementar con Bootstrap 5 nav-tabs estilizado custom para que no parezca template.
Container: max 1280px, padding lateral 1rem mobile / 2rem desktop.
Header de sección:

Eyebrow: WHAT WE CRAFT
H2: Our Portfolio (centrado)
Heart divider (centrado)
Subtitle: "Three worlds, one craft. Discover how we bring chocolate to life — from boardrooms to weddings to your most personal moments."

Tabs:

3 tabs centrados: Corporate | Events | Special Occasions.
Estilo de tabs: no es el pill default de Bootstrap. Es texto Montserrat uppercase 0.8rem, letter-spacing 0.15em, color --steel-teal. El tab activo: color --midnight-blue y underline de 2px en --desert-sand con transition: 0.3s. Entre tabs, separador vertical sutil 1px solid rgba(193,147,91,0.2) con altura 14px.
En mobile, los tabs son scrollables horizontal si no caben (overflow-x: auto, -webkit-overflow-scrolling: touch), no se apilan.
Padding tabs: 0.75rem 1.5rem.

Contenido de cada tab-pane:
Cada tab tiene la misma estructura interna:

Bloque introductorio (max-width 720px, centrado): 2-3 líneas de texto en Lora italic explicando la categoría.
Grid de cards (no es galería, no es ecommerce): cards de "servicio/producto" representativos.
CTA al final de cada tab: "Request a Quote for [Category]" → scrollea a #contact con el form pre-rellenando un campo hidden "interest" con el nombre de la categoría.

Grid de cards:

Mobile: 1 columna.
Tablet: 2 columnas.
Desktop: 3 columnas.
Gap: 1.5rem.
6 cards por categoría.

Estructura de card:
html<article class="portfolio-card">
  <div class="portfolio-card__img-wrap">
    <img src="..." alt="..." loading="lazy">
    <span class="portfolio-card__overlay" aria-hidden="true"></span>
  </div>
  <div class="portfolio-card__body">
    <span class="portfolio-card__tag">[Tag: ej. "Branded Gift Set"]</span>
    <h3 class="portfolio-card__title">[Título corto]</h3>
    <p class="portfolio-card__desc">[1-2 líneas describiendo el servicio/creación]</p>
  </div>
</article>
Estilo de card:

Background: var(--color-surface), border 1px solid rgba(193, 147, 91, 0.18).
Radius: 10px.
Aspect-ratio imagen: 4/3.
Hover: transform: translateY(-4px), shadow upgrade, imagen interna scale(1.05) con transition 0.5s ease.
Overlay degradado sutil en el bottom de la imagen para legibilidad del tag superpuesto: linear-gradient(180deg, transparent 60%, rgba(13,30,50,0.5) 100%).

Contenido por categoría — copy específico:
Corporate:

Intro: "Memorable gifts for clients, partners, and teams. Custom-branded chocolate experiences that elevate every business gesture."
6 cards: Branded Logo Bonbons, Executive Gift Boxes, Holiday Corporate Hampers, Conference Welcome Sets, Client Anniversary Editions, Custom Packaging Design.

Events:

Intro: "From intimate gatherings to grand celebrations, our chocolates become the centerpiece of unforgettable moments."
6 cards: Wedding Favors, Bar/Bat Mitzvah Collections, Anniversary Towers, Live Chocolate Stations, Themed Event Boxes, Private Tasting Experiences.

Special Occasions:

Intro: "Birthdays, milestones, and the everyday luxuries worth marking. Chocolates that say what words can't."
6 cards: Birthday Boxes, Valentine's Editions, Mother's & Father's Day, Graduation Gifts, Get Well Sets, Just Because Boxes.

Tab logic JS: usar bootstrap.Tab instances. Persistir el tab activo en history.replaceState con hash #portfolio-corporate etc., para que sea linkeable. Default tab al cargar: Corporate.

8. SECTION 4 — COLLECTIONS (carrusel elegante)
Propósito: mostrar 5-6 "colecciones" estrella (Signature, Premium, Seasonal Winter, Dubai Bar, Mini Moments, Limited Edition) como teaser, con link al catálogo.
Header: mismo patrón eyebrow + H2 + heart divider + subtitle. H2: Featured Collections. Subtitle: "A curated glimpse into our signature creations."
Carrusel: custom, no Bootstrap default (queremos look boutique, no slider típico).
Layout:

Mobile: 1 card visible, swipe horizontal nativo (scroll-snap-type: x mandatory), pequeños dots indicadores debajo.
Tablet: 2 cards visibles.
Desktop: 3 cards visibles, con flechas circulares prev/next idénticas a las del catálogo (.carousel-arrow-btn).
Track con display: flex; gap: 1.5rem; transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1).
Autoplay: 5 segundos, pausable al hover, mismo patrón que startCarouselAutoPlay() del catálogo.

Card de colección:
html<article class="collection-card">
  <div class="collection-card__img-wrap">
    <img src="assets/img/collections/signature.jpg" alt="Signature Collection">
  </div>
  <div class="collection-card__body">
    <span class="collection-card__count">12 pieces</span>
    <h3 class="collection-card__name">Signature Collection</h3>
    <p class="collection-card__desc">Our most beloved flavors, curated into a single elegant box.</p>
    <a href="/catalog/" class="collection-card__link">Discover →</a>
  </div>
</article>
Estilo:

Card height fija desktop: 420px. Mobile: auto.
Imagen ocupa 60% superior, body 40% inferior.
Hover: imagen scale, → translateX(4px), shadow upgrade.
Background card: blanco puro #fff con border 1px solid rgba(193,147,91,0.15).
El link "Discover →" es el verdadero CTA, color --desert-sand, font-weight 600, uppercase 0.75rem.

CTA bajo el carrusel (centrado): botón outline "View Full Catalog" → link a /catalog/.

9. SECTION 5 — FAQ
Background: rgba(254, 238, 213, 0.4) (almond-cream translúcido) para diferenciar visualmente de las secciones blancas.
Layout:

Header sección (mismo patrón). H2: Frequently Asked. Subtitle: "Everything you need to know before placing your order."
Container max 880px.

Componente: Bootstrap 5 Accordion (accordion-flush), estilizado custom.
Estilo accordion:

Cada item: border-bottom 1px solid rgba(193,147,91,0.25), sin border-top excepto el primero.
.accordion-button: fondo transparente, Playfair Display 1.15rem, color --midnight-blue, padding 1.25rem 0, sin los iconos flecha default de Bootstrap → reemplazar con un SVG plus/minus animado (rotation 45deg al expandir).
.accordion-body: Montserrat 0.95rem, color --steel-teal, line-height 1.7, padding 0 0 1.5rem 0.

Contenido (4 items):
1. How to order

Body: "Ordering is simple. Browse our catalog, contact us via WhatsApp or our contact form with your selection and event date. We'll confirm availability, provide a quote, and schedule production. Custom corporate and event orders require a minimum lead time of 7-14 days depending on quantity and customization."
Incluye 3 mini-steps inline con iconos SVG: ① Choose → ② Confirm → ③ Receive.

2. Payment methods

Body: "We accept the following payment methods:"
Debajo, dos cards horizontales con logos:

Card 1: assets/img/payment/cash.svg + "Cash" + "Available for local pickup and delivery."
Card 2: assets/img/payment/zelle.svg + "Zelle" + "Quick and secure transfers to montfrut@gmail.com."


Cards: background blanco, border, radius 8px, padding 1rem, flex row con logo 48x48px y texto a la derecha.
Nota al pie: "Invoicing available for corporate clients on request."

3. Shipping & delivery

Body: "We currently serve New Jersey and New York with local hand-delivery for orders within a 30-mile radius of Jersey City. Pickup is available at our Jersey City workshop by appointment. For events and large corporate orders outside our delivery zone, white-glove courier service can be arranged. Delivery fees vary by location and are quoted at confirmation."
Mini lista con 3 iconos: 🚚 Local Delivery / 📦 Workshop Pickup / ✈️ Special Courier.

4. Allergies & dietary

Body: "All our chocolates are handcrafted in a facility that processes common allergens including dairy, nuts (hazelnuts, pistachios, almonds), soy, and trace gluten. While we offer dairy-free and gluten-free options, cross-contamination cannot be fully ruled out. Please notify us of any severe allergies when placing your order — we'll guide you to the safest options."
Lista de allergens con tags estilo .allergy-tag ya existentes en catálogo: Dairy, Nuts, Soy, Gluten, Coconut.

JS: permitir solo un item abierto a la vez (default Bootstrap behavior, mantener).

10. SECTION 6 — REVIEWS
Background: var(--color-bg) con la textura de fondo del proyecto (bg.png con overlay).
Header: eyebrow WHAT THEY SAY, H2 Words from Our Clients, heart divider, subtitle "Real moments, real reactions, real chocolate."
Layout: carrusel de 3 reseñas visibles simultáneamente en desktop, 2 en tablet, 1 en mobile.
Mecánica del carrusel:

Custom JS (no Bootstrap carousel), con transform: translateX sobre un flex track.
Autoplay: 6 segundos por slide. Pausa al hover.
Flechas prev/next sutiles a los lados (estilo .carousel-arrow-btn del catálogo).
Dots indicadores debajo: tantos dots como "páginas" (total_reviews / visible_per_view).
Loop infinito (cuando llega al final, vuelve al principio).

Card de reseña:
html<article class="review-card">
  <div class="review-card__stars" aria-label="5 out of 5 stars">
    <i class="fa-solid fa-star"></i> ×5  (color: --desert-sand)
  </div>
  <blockquote class="review-card__quote">
    "[Texto de la reseña]"
  </blockquote>
  <div class="review-card__author">
    <div class="review-card__avatar">
      <span>[Inicial]</span>
    </div>
    <div class="review-card__meta">
      <strong>[Nombre]</strong>
      <small>[Tipo de cliente o evento]</small>
    </div>
  </div>
  <div class="review-card__source">
    <i class="fa-brands fa-google"></i> Google Review
  </div>
</article>
Estilo card:

Background: blanco, border 1px solid rgba(193, 147, 91, 0.15), radius 10px.
Padding: 1.75rem 1.5rem.
Min-height: 280px desktop (todas las cards igual altura).
Avatar circular 44px, fondo var(--vanilla-cream), inicial en Playfair Display color --desert-sand.
Quote en Lora italic, 0.95rem, line-height 1.65, con un símbolo " decorativo grande arriba a la izquierda (Playfair, 3rem, color rgba(193,147,91,0.3), posición absoluta).
Source badge abajo: Montserrat 0.7rem uppercase letter-spacing 0.1em, color --steel-teal, icono Google color real.

Contenido — 6 reseñas (mezcla de Google + propias):

Decisión: No puedo acceder en vivo a las reseñas de Google de la URL provista. La especificación instruye a Sonnet 4.6 a usar 6 reseñas de placeholder verosímiles inspiradas en el rubro, con un comentario claro en el HTML indicando que deben ser reemplazadas por las reseñas reales del cliente antes del deploy.

Placeholders sugeridos (todos 5 estrellas, mezcla corporate/events/personal):

"The chocolates were the highlight of our corporate gala. Elegant, delicious, and beautifully presented. Our clients are still talking about them." — Andrea M., Corporate Event Planner
"Ordered Dubai bars for my daughter's sweet sixteen. They were a hit. Pure quality and a personal touch you don't find anywhere else." — Carolina R., Birthday Celebration
"Montfrut delivered for our 200-guest wedding favor order with grace and precision. Every box was perfect." — James & Lila T., Wedding
"Best chocolate experience I've had in New York. The Hazelnut Praline is unforgettable." — Michael S., Google Review
"As a marketing director, finding gifts that feel curated is hard. Montfrut nailed it for our holiday client appreciation." — Patricia O., Corporate Gifts
"From the first message to the delivery, the care and craftsmanship showed at every step. Will be back." — Sofia D., Google Review

CTA al final: link "Leave us a review on Google →" con icono Google, link a https://g.page/r/12415828909464005164/review target=_blank rel=noopener.

11. SECTION 7 — RECOGNITION
Layout: estilo "blog preview grid". 3-4 entradas.
Header: eyebrow IN THE PRESS, H2 Recognition, divider, subtitle "Featured in interviews, podcasts, and media that celebrate craft."
Grid:

Mobile: 1 columna.
Tablet: 2 columnas.
Desktop: 3 columnas (si hay 4 entradas, en desktop se acomodan 3+1 con la última centrada o se hace fila de 4 si caben — preferir 3 entradas para limpieza visual).

Card de recognition:
html<article class="recognition-card" data-recognition-id="rec-01" 
         data-bs-toggle="modal" data-bs-target="#recognitionModal">
  <div class="recognition-card__img-wrap">
    <img src="assets/img/recognition/rec-01-cover.jpg" alt="...">
    <span class="recognition-card__date">May 2026</span>
  </div>
  <div class="recognition-card__body">
    <span class="recognition-card__source">@estamosunidosok × @flavita.on</span>
    <h3 class="recognition-card__title">A Conversation About Craft</h3>
    <p class="recognition-card__excerpt">A deep dive into the Montfrut story, our process, and the meaning behind every bonbon.</p>
    <span class="recognition-card__readmore">Read more →</span>
  </div>
</article>
Estilo:

Background blanco, radius 10px, border sutil.
Imagen 16/10 ratio.
Date badge sobre la imagen (esquina superior derecha): fondo rgba(13,30,50,0.85), color almond-cream, padding 0.3rem 0.7rem, radius 50px, Montserrat 0.65rem uppercase.
Source label: Montserrat 0.7rem uppercase letter-spacing 0.12em, color --desert-sand.
Title: Playfair 1.2rem.
Excerpt: Lora regular 0.9rem, 2 líneas con -webkit-line-clamp.
Read more: Montserrat 0.75rem uppercase, color --midnight-blue, hover desert-sand.
Card entera clickeable (cursor pointer), abre modal.

Modal de Recognition (#recognitionModal):

Bootstrap 5 modal, modal-lg, modal-dialog-centered, modal-dialog-scrollable.
Header: mismo estilo modal del catálogo (var(--midnight-blue) con borde dorado), título dinámico.
Body: dos columnas en desktop:

Izquierda (col-md-7): carrusel Bootstrap con 3-4 imágenes de galería, con indicators, prev/next, thumbnails debajo (idéntico patrón al modal-thumbnails del catálogo).
Derecha (col-md-5): metadatos (fecha, fuente, links externos a YouTube/Spotify/artículo), descripción larga (3-4 párrafos).


Footer: botones "Watch on YouTube" (link externo) + "Close".
Los datos se cargan dinámicamente vía JS: array recognitions con {id, title, source, date, cover, gallery: [], description, externalLink, externalLabel}.

Contenido — 3 entradas (placeholder):

A Conversation About Craft — Interview with @estamosunidosok & @flavita.on — May 2026 — YouTube link real al canal de la marca.
Featured in Local Press — NJ Food Magazine — March 2026 — placeholder article link.
Podcast: The Sweet Side of Business — Entrepreneur Spotlight Series — January 2026 — Spotify link placeholder.

JS: event listener delegado en el grid. Al click, busca el data-recognition-id, encuentra el objeto en recognitions[], popula el modal, lo muestra.

12. SECTION 8 — COMMUNITY (Aportes a la comunidad)
Estructura idéntica a Recognition, pero con su propio array de datos y modal separado.
Header: eyebrow GIVING BACK, H2 Community Contributions, divider, subtitle "Chocolate that gives more than flavor — it gives back."
Grid: 3 cards mismo formato.
Contenido placeholder:

Holiday Boxes for Local Shelters — December 2025 — "We donated 200 custom holiday boxes to families served by Jersey City community shelters."
Chocolate Workshop for Youth Center — August 2025 — "A hands-on chocolate-making workshop for 30 teens from a local youth program."
Fundraiser Partnership — June 2025 — "Partnered with [local cause] to raise $X through curated chocolate boxes."

Modal #communityModal: mismo patrón que Recognition. Diferencia: incluir un pequeño "stats banner" en el body (3 columnas):

200+ boxes donated
5+ partnerships
Since 2024

Esto añade peso institucional.

13. SECTION 9 — CONTACT
La sección más larga visualmente, dividida en 2 columnas en desktop:

Izquierda (col-lg-7): formulario.
Derecha (col-lg-5): bloque de info + WhatsApp + mapa.

Mobile: stack vertical, info arriba, formulario debajo.
Background: var(--midnight-blue) con la textura de fondo (bg-desktop.png con overlay oscuro), creando un cierre visual fuerte antes del footer. Texto en --almond-cream/--vanilla-cream.
Header de sección (centrado):

Eyebrow: LET'S TALK
H2: Let's Create Something Sweet (color --vanilla-cream)
Divider heart (líneas en --desert-sand)
Subtitle: "Whether it's a corporate gift, an event, or a personal moment — we'd love to hear from you."

13.1 Formulario
html<form id="contact-form" class="contact-form" novalidate>
  <div class="row g-3">
    <div class="col-md-6">
      <label for="cf-name">Full Name <span class="req">*</span></label>
      <input type="text" id="cf-name" name="name" required minlength="2">
    </div>
    <div class="col-md-6">
      <label for="cf-email">Email <span class="req">*</span></label>
      <input type="email" id="cf-email" name="email" required>
    </div>
    <div class="col-md-6">
      <label for="cf-phone">Phone</label>
      <input type="tel" id="cf-phone" name="phone" pattern="[\d\s\-\+\(\)]+">
    </div>
    <div class="col-md-6">
      <label for="cf-interest">I'm interested in <span class="req">*</span></label>
      <select id="cf-interest" name="interest" required>
        <option value="" disabled selected>Select an option</option>
        <option value="Corporate">Corporate Gifts</option>
        <option value="Events">Event Favors</option>
        <option value="Special">Special Occasion</option>
        <option value="Other">Just Saying Hi</option>
      </select>
    </div>
    <div class="col-12">
      <label for="cf-eventdate">Event Date (if applicable)</label>
      <input type="date" id="cf-eventdate" name="eventdate">
    </div>
    <div class="col-12">
      <label for="cf-message">Tell us more <span class="req">*</span></label>
      <textarea id="cf-message" name="message" required minlength="10" rows="5"></textarea>
    </div>
    <div class="col-12">
      <button type="submit" class="btn-submit">
        <span class="btn-label">Send Message</span>
        <i class="fa-solid fa-paper-plane"></i>
      </button>
    </div>
  </div>
</form>
Estilo inputs:

Background: rgba(255, 253, 247, 0.08), border 1px solid rgba(193,147,91,0.3), color --almond-cream.
Focus: border --desert-sand, box-shadow 0 0 0 3px rgba(193,147,91,0.18).
Labels: Montserrat 0.75rem uppercase letter-spacing 0.1em, color --vanilla-cream, margin-bottom 0.4rem.
.req: color --fiery-coral.
Placeholder: rgba(254,238,213,0.4).
Radius: 8px.
Padding: 0.7rem 1rem.

Botón submit:

Background gradient linear-gradient(180deg, var(--desert-sand), #a8804a).
Color: --blood-crimson.
Font: Montserrat 0.85rem, weight 700, uppercase, letter-spacing 0.12em.
Padding: 0.85rem 2rem.
Hover: translateY(-2px), shadow.
Icon paper-plane a la derecha.

Validación JS (cliente):

Validar required, type="email", minlength.
Mostrar errores inline debajo de cada campo: <span class="field-error">Please enter a valid email</span> (color --fiery-coral, font 0.75rem).
Submit handler: prevenir default, validar, si pasa → mostrar modal de éxito (#contactSuccessModal) con mensaje "Thank you! We'll reply within 24 hours." e icono check.
Decisión backend: Como el proyecto es frontend-only y el destinatario es montfrut@gmail.com, el form en submit construye un mailto: con los campos serializados como fallback (sin backend), o se documenta en código un comentario claro // TODO: integrate with Formspree/EmailJS/Netlify Forms. Implementación recomendada: usar mailto: con subject [Montfrut Contact] {interest} — {name} y body multilínea con los campos. Agregar comentario sugiriendo Formspree para producción real.

13.2 Bloque info (columna derecha)
Tarjetas verticales sobre fondo translúcido rgba(255,253,247,0.06), border-radius 12px, padding 1.5rem:
Card 1 — Direct Contact:

Icono SVG location.
Title: Visit our workshop
Texto: Jersey City, New Jersey + By appointment only

Card 2 — Phone & Email:

Title: Reach out
Líneas con iconos:

📞 +1 (917) 474-0694 (link tel:)
✉ info@montfrut.com (link mailto:)



Card 3 — Hours:

Title: Workshop hours
Texto: Monday – Friday, 10am – 6pm EST
Custom orders accommodated outside hours by request.

Botón WhatsApp grande (destacado):

Reutilizar el estilo .link-btn--whatsapp del archivo index_links.html.
Texto: "Chat on WhatsApp" + small "Personalized attention for your order".
Link: https://wa.me/19174740694?text=Hello%20Montfrut%2C%20I%27d%20love%20to%20learn%20more%20about%20your%20creations
target=_blank rel=noopener.

Mapa (decisión: estática, no embed de Google Maps API):

Imagen estática de un mapa stylizado de Jersey City + marker, color tones que coincidan con la paleta (usar Mapbox static API o imagen pre-generada en assets como assets/img/map-jc.jpg).
Aspect-ratio 16/9, radius 10px, opacity 0.9.
Caption: "Jersey City, NJ — Serving NY & NJ" debajo.

13.3 Trust strip al final del bloque contact
Antes de cerrar la sección, una pequeña fila horizontal con 3-4 "trust badges":

✓ Locally crafted in NJ
✓ Custom orders welcome
✓ Corporate invoicing available
✓ Reply within 24h

Estilo: chips con borde sutil dorado, texto vanilla-cream 0.75rem, separados por dot.

14. FOOTER
Patrón: idéntico al footer del catálogo (index_catalog.html), pero con un par de mejoras:
Estructura en 3 filas:
Fila 1 — Features (4 columnas mobile-stack):

Reutilizar las 4 features del catálogo: Finest Ingredients, Handcrafted, Sustainable Cocoa, Secure Packaging. Mismos iconos SVG.

Fila 2 — Newsletter + Brand bridge:

Grid 2 columnas desktop, stack mobile.
Izquierda: logo Montfrut pequeño (height 50px) + tagline "Chocolate Made Experience" + frase corta de cierre.
Derecha: mini-newsletter signup (decorativo, sin backend):

Label: "Sweet news in your inbox"
Input email + botón "Subscribe"
Disclaimer: "We respect your inbox. No spam, just chocolate."
Decisión: En submit, mostrar toast (reutilizar bootstrap.Toast patrón) con "Thank you for subscribing!". Marcar en JS como TODO para integrar Mailchimp/ConvertKit.



Fila 3 — Bottom bar:

Izquierda: redes sociales (4 iconos circulares, mismo estilo .social-row de links): Instagram, TikTok, Facebook, LinkedIn.
Centro: nav-links pequeños horizontales: Catalog · Links · Privacy · Terms · Contact.
Derecha: copyright + credit: © 2026 Montfrut · Developed by Gotan Web.

Estilo:

Background var(--blood-crimson) con misma textura que el header.
Borde superior 2px --desert-sand.
Texto --vanilla-cream con opacidad reducida para jerarquías.
Padding generoso vertical (4rem desktop, 2.5rem mobile).


15. MODALES (resumen consolidado)
3 modales globales al final del body:

#recognitionModal — modal-lg, contenido dinámico (carrusel + texto).
#communityModal — modal-lg, contenido dinámico (carrusel + texto + stats).
#contactSuccessModal — modal-md, contenido estático: icono check grande, "Thank you!", mensaje, botón "Close".

Estilo modal compartido: clonar el patrón .modal-product del catálogo (header oscuro, body cream, footer almond-cream con borde dorado). Crear una clase wrapper .modal-montfrut que aplique estos estilos a los 3.

16. JAVASCRIPT — Arquitectura
js/scripts.js organizado en módulos comentados (sin ES modules, todo en un solo archivo IIFE-style o top-level con strict mode, igual patrón que scripts_catalog.js):
js'use strict';

/* ============================================================
   1. DATA — arrays estáticos de contenido dinámico
   ============================================================ */
const recognitions = [ {...}, {...}, {...} ];
const communityItems = [ {...}, {...}, {...} ];
const reviews = [ {...}, ... ];
const collections = [ {...}, ... ];
const portfolioItems = {
  corporate: [...],
  events: [...],
  special: [...]
};

/* ============================================================
   2. INIT — DOMContentLoaded entry
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initHeader();             // scroll effect + smooth scroll
  initHeroAnimations();     // entry stagger
  initIntersectionReveal(); // fade-in on scroll for sections
  initPortfolioTabs();      // tab switching + URL hash
  initCollectionsCarousel();
  initReviewsCarousel();
  initRecognitionGrid();    // click → modal
  initCommunityGrid();      // click → modal
  initContactForm();        // validation + mailto
  initNewsletterForm();     // toast feedback
  initMobileNav();          // offcanvas
});

/* ============================================================
   3. HEADER
   ============================================================ */
function initHeader() { ... }

/* ============================================================
   4. HERO ENTRY
   ============================================================ */
function initHeroAnimations() { ... }

/* ============================================================
   5. INTERSECTION OBSERVER (reveal on scroll)
   ============================================================ */
function initIntersectionReveal() {
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
   6-12. cada init específico
   ============================================================ */
Reveal animation CSS:
css.reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
.reveal.is-visible { opacity: 1; transform: translateY(0); }
.reveal-delay-1 { transition-delay: 100ms; }
.reveal-delay-2 { transition-delay: 200ms; }
.reveal-delay-3 { transition-delay: 300ms; }
Aplicar .reveal a títulos de sección, cards, bloques de texto. Respetar prefers-reduced-motion.
Sin frameworks de animación. Todo con CSS transitions + IntersectionObserver.

17. RESPONSIVE — Breakpoints (consistente con el catálogo)
BreakpointRangoComportamientoMobile≤575.98px1 columna todo, hamburguesa, carruseles 1 ítem, tabs scroll-x, formulario full-widthTablet576–991.98px2 columnas en portfolio/grids, hamburguesa aún visible, carruseles 2 ítems, hero igualDesktop≥992px3 columnas portfolio/collections/recognition, nav inline, sidebar de contacto split, carruseles 3 ítemsLarge≥1280pxContainer max 1280px, padding lateral 2.5rem
Mobile-first en todo el CSS: declarar base styles sin media query, luego @media (min-width: 576px) y @media (min-width: 992px) para upgrades.
html, body { overflow-x: hidden; } obligatorio.

18. ACCESIBILIDAD — Checklist

skip-link visible en focus al inicio del body.
Todo <img> con alt descriptivo en inglés (no genérico tipo "image"). Imágenes decorativas con alt="" y aria-hidden="true".
Botones icónicos con aria-label explícito.
Sections con aria-labelledby apuntando al H2.
Modales con aria-labelledby, aria-modal="true", role="dialog", focus trap nativo de Bootstrap.
Form con <label for> para cada input, mensajes de error vinculados con aria-describedby, aria-invalid en error.
Contraste WCAG AA: vanilla-cream sobre blood-crimson cumple, midnight-blue sobre almond-cream cumple, steel-teal sobre blanco está al límite (usar steel-teal solo para texto secundario ≥0.9rem).
Focus visible global: :focus-visible { outline: 2px solid var(--desert-sand); outline-offset: 2px; }.
prefers-reduced-motion: desactivar animaciones de entrada y carruseles auto.
Carruseles con botones prev/next accesibles por teclado, aria-live="polite" en el contenedor del slide actual.
Tabs con role="tablist", role="tab", role="tabpanel", aria-selected, aria-controls.
Acordeón FAQ: nativo Bootstrap, ya accesible.
Heading hierarchy estricta: 1 H1 (hero), H2 por sección, H3 dentro.


19. SEO — Checklist adicional

HTML semántico: <header>, <main>, <footer>, <section>, <article>, <nav>, <aside> donde corresponda.
Lazy-loading en todas las imágenes excepto el hero (loading="lazy", hero usa loading="eager" y fetchpriority="high").
Width y height en imágenes para evitar CLS.
Preload del hero image: <link rel="preload" as="image" href="assets/img/hero-chocolate.jpg">.
Structured Data validable en schema.org (LocalBusiness + Organization + FAQPage).
URL anchors limpios: #about, #portfolio, #collections, #faq, #reviews, #recognition, #community, #contact.
Sitemap.xml y robots.txt mencionados como TODO para deploy.


20. PERFORMANCE — Guías

Imágenes WebP cuando sea posible, JPEG fallback. Tamaños recomendados:

Hero: 1920x1080 WebP <250KB
Bio: 800x1000 WebP <120KB
Portfolio cards: 600x450 WebP <60KB c/u
Collection cards: 600x720 WebP <80KB c/u
Recognition/Community covers: 800x500 WebP <80KB c/u


CSS minificable (no minificar en el entregable, dejar legible y comentado).
JS sin dependencias pesadas, total <30KB sin minify.
Bootstrap solo desde CDN (no auto-host).
Fonts con display=swap ya incluido en la URL de Google Fonts.


21. COMENTARIOS Y MANTENIBILIDAD

Cada sección del CSS abierta con banner de comentario /* === N. SECTION NAME === */.
Cada función JS con docstring breve explicando propósito y parámetros.
Constantes y arrays de datos al inicio de scripts.js, claramente etiquetadas.
TODOs explícitos para integraciones futuras: backend del form, newsletter, mapa interactivo, reseñas reales de Google.
Versionado en query string de los assets CSS/JS (?v=1.0) para cache-busting, igual patrón que catálogo.


22. ENTREGABLES FINALES
Cuando se ejecute la generación de código con Sonnet 4.6, debe producir:

index.html — un solo archivo, ~900-1100 líneas, semántico, comentado por secciones.
css/styles.css — un solo archivo, ~1800-2400 líneas, mobile-first, organizado por secciones idénticas a la spec.
js/scripts.js — un solo archivo, ~600-900 líneas, vanilla JS, vanilla, modular por funciones.
Lista de assets faltantes — un archivo assets-needed.md o sección al final del HTML como comentario, listando cada imagen requerida con ruta, tamaño recomendado y descripción del contenido, para que el cliente la provea.


23. DECISIONES TOMADAS (resumen ejecutivo)
Las que respondí sin consultar para no detener el flujo:
DecisiónResoluciónCTA del heroA #portfolio (no al catálogo): la propuesta diferencial son las creaciones a medidaCarrusel de CollectionsCustom JS, no Bootstrap carousel default (queremos look boutique)Tabs de PortfolioBootstrap Tab API + estilo custom underline (no pills)Backend del formmailto: como fallback frontend-only, con TODO documentado para FormspreeBackend newsletterSolo toast UI, TODO para MailchimpMapaImagen estática (no Google Maps embed) para evitar JS pesado y API keysReseñas6 placeholders verosímiles + comentario claro de reemplazoImágenes faltantesListadas en assets-needed.md para que las provea el cliente; mientras tanto, placeholders descriptivos en el HTMLModalidad de modalesReutilizar patrón del catálogo (modal-product) generalizado en .modal-montfrut