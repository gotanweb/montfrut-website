# Montfrut Catalog - Especificación Funcional v1.0

**Proyecto:** Montfrut Website  
**Módulo:** `/catalog/`  
**Estado:** Requerimientos funcionales aprobados  
**Reglas:** CAT-F01 a CAT-F50

## 1. Selección inteligente (CAT-F01 a CAT-F08)

- **CAT-F01:** Un producto sin variantes obligatorias se agrega directamente con cantidad 1.
- **CAT-F02:** Si tiene variantes obligatorias, se abre Details y se exige completar la configuración antes de agregarlo.
- **CAT-F03:** Las variantes opcionales pueden configurarse desde Details, pero no impiden agregar el producto directamente sin extras.
- **CAT-F04:** Agregar dos veces el mismo producto con idéntica configuración incrementa su cantidad, sin duplicar filas.
- **CAT-F05:** Un mismo producto con configuraciones diferentes aparece en filas independientes.
- **CAT-F06:** Un producto no disponible conserva Details habilitado, pero no puede agregarse.
- **CAT-F07:** Después de agregar un producto, se muestra una confirmación discreta sin interrumpir la navegación.
- **CAT-F08:** El ícono del encabezado abre My Selection, donde se pueden editar cantidades, eliminar productos y consultar el subtotal estimado.

## 2. My Selection (CAT-F09 a CAT-F16)

- **CAT-F09:** El ícono del encabezado muestra el número total de unidades seleccionadas.
- **CAT-F10:** My Selection muestra productos, fotografías, variantes, cantidades y precios.
- **CAT-F11:** El cliente puede aumentar o reducir cantidades y eliminar productos.
- **CAT-F12:** Los importes incluyen los costos adicionales de las variantes configuradas.
- **CAT-F13:** El subtotal es estimado y no incluye impuestos, envío ni otros cargos por confirmar.
- **CAT-F14:** Si la selección está vacía, se muestra un mensaje informativo y una opción para continuar explorando.
- **CAT-F15:** Si un producto deja de estar disponible, permanece identificado en la selección, pero no se incluye en la consulta.
- **CAT-F16:** Si cambian los precios publicados, se actualiza el subtotal y se informa al cliente.

## 3. Formulario y WhatsApp (CAT-F17 a CAT-F24)

- **CAT-F17:** Nombre obligatorio. Empresa, fecha del evento y comentarios opcionales.
- **CAT-F18:** No se solicita teléfono ni correo electrónico.
- **CAT-F19:** WhatsApp se habilita cuando existen productos válidos seleccionados y se ingresó el nombre del cliente.
- **CAT-F20:** El mensaje incluye productos, variantes, cantidades, precios unitarios y subtotal estimado.
- **CAT-F21:** El mensaje se genera en el idioma activo del Catálogo.
- **CAT-F22:** Se abre WhatsApp con el mensaje precargado. El cliente debe enviarlo manualmente.
- **CAT-F23:** No se registra ningún pedido ni se procesa un pago automáticamente.
- **CAT-F24:** Los datos personales del formulario no se conservan en localStorage.

**Decisión adicional aprobada:** La selección permanece guardada al abrir WhatsApp. El cliente puede vaciarla manualmente.

## 4. Variantes y personalización (CAT-F25 a CAT-F31)

- **CAT-F25:** Los productos pueden tener grupos de variantes obligatorias u opcionales.
- **CAT-F26:** Cada grupo permite selección única (`single`) o múltiple (`multiple`).
- **CAT-F27:** Las variantes pueden tener costos adicionales, incluso $0.
- **CAT-F28:** El precio se actualiza automáticamente según las opciones seleccionadas.
- **CAT-F29:** Las variantes obligatorias deben completarse antes de agregar el producto.
- **CAT-F30:** La configuración elegida aparece en My Selection y WhatsApp.
- **CAT-F31:** Si una variante guardada deja de existir o estar disponible, se solicita revisar la configuración antes de consultar.

**Esquema aprobado:**

Grupos:
- `id`
- `label: { es, en }`
- `required`
- `selection`
- `options`

Opciones:
- `id`
- `label: { es, en }`
- `priceAdjustment`
- `available`

Los costos adicionales son numéricos, no negativos y expresados en USD.

Regla monetaria aprobada en CAT-IMP-002B-R1: los precios base y ajustes admiten un máximo de dos decimales USD, sin fracciones de centavo. La validación y las sumas usan centavos enteros seguros; solo se tolera el ruido de representación binaria de importes válidos.

## 5. Disponibilidad (CAT-F32 a CAT-F35)

- **CAT-F32:** Los tres estados conservan la visibilidad del producto.
- **CAT-F33:** Solamente `available` permite agregar productos.
- **CAT-F34:** Los productos guardados se validan nuevamente al recuperar My Selection.
- **CAT-F35:** La disponibilidad es informativa. Ani confirma la disponibilidad definitiva.

**Estados aprobados:**
- `available`: disponible y seleccionable.
- `unavailable`: visible, pero no seleccionable.
- `coming-soon`: visible como adelanto, no seleccionable.

No existe control de inventario en tiempo real.

## 6. Avisos informativos (CAT-F36 a CAT-F40)

- **CAT-F36:** En la primera visita aparece un modal informativo en el idioma correspondiente.
- **CAT-F37:** Al aceptarlo, se recuerda localmente que el usuario ya lo vio.
- **CAT-F38:** Un aviso permanente y discreto indica que el Catálogo es informativo.
- **CAT-F39:** My Selection recuerda que los precios son estimados.
- **CAT-F40:** Antes de abrir WhatsApp o copiar el mensaje se requiere aceptar expresamente las condiciones comerciales, que aclaran que la consulta no constituye una compra ni reserva. La aceptación se solicita en cada operación y no se persiste.

## 7. Modelo de productos (CAT-F41 a CAT-F50)

- **CAT-F41:** Cada producto conserva un identificador estable, aunque cambie su nombre.
- **CAT-F42:** Los textos visibles se administran en español e inglés.
- **CAT-F43:** Los precios se expresan en USD y las variantes pueden modificar el importe base.
- **CAT-F44:** Cada producto puede tener una imagen principal y varias imágenes adicionales.
- **CAT-F45:** Los alérgenos se administran individualmente y deben estar verificados por Ani.
- **CAT-F46:** Las categorías y sabores se definen centralizadamente para evitar inconsistencias.
- **CAT-F47:** Los contadores de filtros se calculan utilizando los productos reales.
- **CAT-F48:** La disponibilidad controla si un producto puede seleccionarse, no si aparece publicado.
- **CAT-F49:** Los productos eliminados del catálogo se identifican como inválidos si permanecen en una selección guardada.
- **CAT-F50:** Los datos comerciales quedan separados de la lógica de interfaz, sin incorporar backend ni CMS.

## 8. Decisiones complementarias aprobadas

**Persistencia**
- Se utiliza almacenamiento local entre visitas.
- Se conservan productos, variantes y cantidades.
- Se validan precios y disponibilidad al recuperar la selección.
- No se almacenan datos personales del formulario.
- Las entradas recuperables que hayan quedado comercialmente inválidas se conservan identificadas para revisión; no se eliminan silenciosamente. Los precios guardados son únicamente referencias informativas y nunca sustituyen los precios vigentes.

**Cantidades**
- Sin límite máximo de unidades ni control de stock.
- Las configuraciones idénticas se agrupan.
- Las configuraciones diferentes se mantienen separadas.
- Las opciones de un grupo múltiple se comparan por identificadores, independientemente del orden de selección.

**Experiencia de usuario**
- “Add to Cart” se reemplaza por “Add to Selection”.
- Se conserva el diseño visual existente.
- Details sigue ofreciendo galerías, información comercial y configuración.
- La selección rápida no abre Details salvo que existan variantes obligatorias.
- Si WhatsApp no puede abrirse, debe ofrecerse una alternativa para copiar el mensaje.

**Arquitectura**
- JavaScript vanilla y Bootstrap existente.
- Productos definidos independientemente en `catalog/js/products.js`.
- Sin backend, base de datos, checkout ni pagos.
- Website, Links, Privacidad, `/form/` y `/saleconfirmation/` fuera de alcance.
- No modificar recursos compartidos sin analizar dependencias.

## 9. Alcance específico de CAT-IMP-002B

La implementación CAT-IMP-002B debe cubrir solamente:

- Selección en memoria.
- Selección inteligente.
- Acumulación de cantidades.
- Configuraciones independientes.
- Variantes obligatorias y opcionales.
- Precio dinámico.
- Validación de disponibilidad.
- Contador de unidades.
- Notificación de confirmación.
- Terminología “Add to Selection”.

**Importante:** Las reglas correspondientes a My Selection, persistencia, WhatsApp, internacionalización y avisos informativos pertenecen a implementaciones posteriores.

No deben considerarse defectos de CAT-IMP-002B simplemente porque todavía no estén implementadas.

## 10. Restricciones de desarrollo

Toda implementación requiere autorización previa.

- Conservar funcionalidades y diseño existentes salvo modificación expresamente autorizada.
- Actualizar `docs/bitacora.md` durante las implementaciones.
- No realizar commits, staging, push ni despliegues sin autorización.
- Informar riesgos, limitaciones y resultados de pruebas.
- No implementar funcionalidades de etapas posteriores sin autorización.

## 11. Plan de implementaciones y alcance de CAT-IMP-002C

| Etapa | Alcance | Estado local |
| --- | --- | --- |
| CAT-IMP-001 | Datos comerciales en `catalog/js/products.js` | Implementado |
| CAT-IMP-002A | Modelo de disponibilidad y variantes | Implementado |
| CAT-IMP-002B | Selección inteligente en memoria, cantidades, variantes y disponibilidad | Implementado |
| CAT-IMP-002B-R1 | Restauración del foco y precisión monetaria | Implementado |
| CAT-IMP-002C | Documentación funcional, persistencia, recuperación y reconciliación | Implementado; sin interfaz de resumen |
| CAT-IMP-003A / CAT-IMP-003B / CAT-IMP-003B-R1 | My Selection, cantidades/eliminación, subtotal, revisión, formulario, WhatsApp/copia y consentimiento comercial por operación | Implementado localmente; revisión manual pendiente |
| CAT-IMP-004 | Internacionalización completa ES/EN y selector visible | Implementado localmente; revisión manual pendiente |
| CAT-IMP-005A | Contadores reales, sincronización de filtros y correcciones funcionales autorizadas | Implementado; validado manualmente por el propietario |
| CAT-IMP-005B | Pausa y movimiento reducido del carrusel, contraste/foco y semántica de lista | Implementado; validado manualmente por el propietario |
| CAT-IMP-005C | Taxonomía bilingüe centralizada y generación automática de filtros | Implementado localmente; validación visual manual pendiente |
| Etapas posteriores por autorizar | Avisos informativos y su aceptación, y demás reglas aún no implementadas | Pendientes |

Los estados locales no equivalen a publicación ni aprobación integral en navegador. Las reglas CAT-F01 a CAT-F50 mantienen su alcance aprobado; las funciones reservadas para etapas posteriores no se consideran implementadas por documentarlas aquí.

### Contrato de persistencia de CAT-IMP-002C

- Clave exclusiva: `montfrut.catalog.selection.v1`. Esquema JSON: `{ schemaVersion: 1, items: [...] }`.
- Cada elemento contiene `productId`, `variants: [{ groupId, optionIds }]` canónicas y `quantity` entera positiva segura. Puede incluir `referenceUnitPriceCents`, entero no negativo seguro, solo para comparar el precio original con el vigente. No se guardan etiquetas, nombres ni datos personales.
- Configuraciones equivalentes se agrupan manteniendo el orden de su primera aparición; las distintas se conservan separadas. El límite de enteros seguros es técnico, no un máximo comercial.
- La lectura no escribe ni borra. Las adiciones válidas guardan la selección completa, incluidas las entradas recuperables comercialmente inválidas. Formatos desconocidos/corruptos, recuperación parcial o referencias contradictorias entre duplicados protegen el registro original contra sobrescrituras; las nuevas adiciones siguen funcionando en memoria durante esa visita.
- Se revalidan productos, disponibilidad, grupos, opciones, obligatoriedad y precios al derivar la revisión. Productos eliminados/no disponibles y configuraciones inválidas quedan identificados y excluidos de los elementos aptos para una futura consulta. El contador incluye las unidades de todas las entradas conservadas, también las que requieren revisión.
- Los cambios de precio conservan la referencia original y exponen el precio vigente en centavos. Son informativos cuando la configuración sigue siendo válida; My Selection deberá mostrarlos. Una referencia ausente o inválida no permite afirmar que el precio cambió. Ninguna referencia de localStorage autoriza un precio ni acredita su autenticidad.
- CAT-IMP-002C prepara funciones y datos para CAT-IMP-003; no muestra estados comerciales ni implementa subtotal, edición, eliminación, formulario o WhatsApp. Solo utiliza la notificación existente para avisar discretamente si la persistencia no es posible.
- Sin almacenamiento disponible se mantiene la selección en memoria. Los fallos de escritura pueden reintentarse con una nueva adición válida. Si el valor guardado cambió desde la lectura o escritura anterior, se conserva el registro ajeno y se continúa en memoria. No se implementan sincronización ni fusión entre pestañas; la comparación previa al guardado no constituye una transacción atómica entre procesos.

## 12. Consentimiento comercial por operación — CAT-IMP-003B-R1

- Formulario y selección se validan antes de mostrar el consentimiento. Los errores se muestran en My Selection y reciben foco; no se abre el consentimiento cuando la consulta es inválida.
- Ambas acciones, WhatsApp y Copiar mensaje, exigen una nueva aceptación expresa. No acepto, Escape, cierre o backdrop cancelan sin abrir ni copiar. La aceptación no se guarda en localStorage, sessionStorage ni cookies y no autoriza operaciones futuras.
- Aceptar revalida los datos y ejecuta una sola vez la acción solicitada. La apertura se realiza directamente desde el clic de aceptación, antes de esperar transiciones. No se afirma que WhatsApp haya abierto ni que el cliente haya enviado el mensaje; la copia confirma únicamente el éxito real de la API del portapapeles.
- El párrafo final de condiciones se retira del mensaje generado para ambas acciones. Se mantienen saludo de consulta, cliente, opcionales, productos válidos, variantes, cantidades, precios y subtotal. No se borra la selección ni el formulario.
- Texto español del consentimiento: «Comprendo que esta consulta no constituye una compra ni reserva. Los valores reflejados no incluyen impuestos, envío ni otros cargos. Montfrut confirmará precios, disponibilidad, entrega y condiciones finales.»
- Texto inglés: «I understand that this inquiry does not constitute a purchase or reservation. The amounts shown do not include taxes, shipping, or other charges. Montfrut will confirm final prices, availability, delivery, and terms.»
- Botones: «No acepto.» / «Acepto.» y «I Don't Accept.» / «I Accept.». El Offcanvas se oculta antes del modal y se recupera al cerrar, con foco en la acción original o en el campo que requiera corrección.
- Este consentimiento es independiente del aviso de primera visita de CAT-F36/CAT-F37. Ese aviso no tiene contenido aprobado suficiente para esta entrega; continúa pendiente. No se crea un segundo modal de aceptación ni se persiste la aceptación comercial para satisfacerlo. Los avisos ya existentes se traducen.

## 13. Contrato de idioma — CAT-IMP-004

- Selector ES/EN accesible en el encabezado. Una selección expresa guarda únicamente `es` o `en` en `montfrut.language`. Desde CAT-SEO-001 actualiza también la URL mediante History API, sin recargar ni perder el formulario; no modifica la lógica de idioma de Links.
- Desde CAT-SEO-001, `/catalog/` y `/catalog/index.html` determinan español; `/catalog/en/` y `/catalog/en/index.html` determinan inglés. La preferencia guardada y el idioma del navegador no sustituyen la ruta ni producen redirecciones. La preferencia compartida se actualiza al elegir el idioma; un acceso fallido al almacenamiento no interrumpe el Catálogo y se informa. Atrás/Adelante vuelve a leer la ruta sin agregar entradas de historial ni persistir datos del formulario.
- Cambiar el idioma no recarga la página ni borra productos, cantidades, variantes, búsqueda, filtros, ordenamiento, formulario, configuración en edición o estado de persistencia. La búsqueda reconoce los textos comerciales ES/EN manteniendo las claves canónicas de categorías/sabores.
- `catalog/js/translations.js` centraliza las traducciones generales de interfaz y el comportamiento del idioma. Los textos comerciales ES/EN se administran dentro de cada producto en `catalog/js/products.js`; `localizedProduct()` deriva una vista compatible con la interfaz, sin duplicar la selección ni alterar precios, imágenes, ingredientes, alérgenos o indicadores comerciales.
- Documento, metadatos textuales, avisos, controles y atributos accesibles siguen el idioma activo. Canonical, URL públicas, tipo Open Graph y recursos conservan su significado; no se crean rutas ni hreflang de páginas inexistentes.
- Las traducciones reproducen afirmaciones ya existentes. Ingredientes, alérgenos, procedencia y demás afirmaciones comerciales continúan pendientes de verificación por Ani antes del lanzamiento. Esta implementación no certifica esas afirmaciones ni da por completadas las demás reglas de etapas posteriores.

## 14. Mantenimiento bilingüe de productos — CAT-REF-001

**Para agregar o modificar un producto, todos sus datos comerciales y textos en ambos idiomas deben administrarse desde `catalog/js/products.js`.**

- Cada producto incluye `translations: { en: {...}, es: {...} }`. Ambos idiomas requieren `name`, `shortDescription`, `longDescription`, `ingredients` (textos completos) y `flavorNotes` (array de notas). No mantener copias comerciales en los antiguos campos de primer nivel ni en un diccionario externo por ID.
- Fuera de `translations` permanecen `id`, `status`, `variants`, `category`, `flavor`, `price`, `image`, `galleryImages`, `allergyTags`, `isBestSeller` e `isSpecialCollection`. Sus valores e identificadores son independientes del idioma; las variantes conservan `label: { en, es }` para grupos y opciones.
- Categorías, sabores y alérgenos conservan sus claves canónicas. Desde CAT-IMP-005C las etiquetas de categorías y sabores se obtienen de `catalogTaxonomy` en `products.js`; los alérgenos siguen usando el diccionario general de `translations.js`, sin arrays separados por idioma. La vista de `localizedProduct()` traduce estas etiquetas sin alterar el registro original.
- `localizedProduct(product, language)` usa el idioma activo cuando no se indica uno, lee los textos del producto y aplica fallback inglés por campo cuando una traducción está ausente o es nula. El fallback no sustituye la obligación de completar y revisar ambos idiomas. La vista no modifica el producto original ni sus IDs.
- Para incorporar un producto de temporada: asignar un ID nuevo y estable; completar todos los campos independientes y las cinco propiedades en ambos idiomas; reutilizar categorías, sabores y alérgenos existentes; verificar rutas de imágenes, importes USD, disponibilidad y variantes; comprobar tarjetas, búsqueda bilingüe, Details y mensajes de consulta en ES/EN. No hace falta añadir una entrada a otro diccionario comercial. Al retirar un producto, no reutilizar su ID: las selecciones guardadas se reconcilian mediante ese identificador.
- Desde CAT-IMP-005C, una categoría o sabor nuevo solo requiere su definición bilingüe en `catalogTaxonomy` y su referencia desde el producto, dentro del mismo `products.js`. Los filtros se generan automáticamente; no se editan HTML, CSS ni otros scripts para estas altas ordinarias.
- Carga clásica: `products.js`, `translations.js`, `scripts.js`, en ese orden. CAT-REF-001 coordina los tres recursos con versión de caché `2.0`. La persistencia conserva `montfrut.catalog.selection.v1`, esquema 1, IDs, configuraciones y cantidades; los textos traducidos siguen siendo vistas derivadas.

## 15. Taxonomía y filtros automáticos — CAT-IMP-005C

- `catalog/js/products.js` es la única fuente de categorías y sabores: `catalogTaxonomy = { categories: [...], flavors: [...] }`. Cada definición tiene `value` (identificador estable, no traducido) y `label: { en, es }` (etiquetas comerciales completas). El orden del array determina el de los filtros. Los diez valores existentes y sus traducciones se conservan exactamente; no se agregan IDs alternativos ni etiquetas duplicadas dentro de cada producto.
- Los productos siguen referenciando `category` y `flavor` por su `value` exacto, respetando mayúsculas y espacios. Cambiar una etiqueta no cambia el identificador. No renombrar identificadores existentes como parte de una traducción. Ingredientes, alérgenos, precios, variantes, fotografías y demás datos comerciales mantienen sus contratos anteriores.
- Escritorio y móvil generan las mismas opciones declaradas que tengan al menos un producto. Las definiciones sin productos no muestran filtros. Cada contador representa el catálogo completo, sin depender de búsqueda u otros filtros e incluyendo los estados `available`, `unavailable` y `coming-soon`. Un catálogo vacío inicializa sin opciones ni productos ficticios.
- `activeCategories` y `activeFlavors` mantienen la única fuente de selección. Los controles se actualizan en su sitio, con un listener delegado por grupo; idioma, búsqueda, ordenamiento y cambios de tamaño no borran selecciones válidas ni reconstruyen los inputs existentes. Al retirar el último producto o la definición de una opción activa, se retira ese valor del filtro activo para no dejar un filtro invisible. Si desaparece el control enfocado, el foco pasa a una opción restante de su grupo o a su encabezado.
- `localizedProduct()` y los filtros consultan las etiquetas de la taxonomía; `translations.js` conserva la traducción de interfaz y de alérgenos. Las opciones dinámicas quedan fuera de la captura de textos estáticos. La búsqueda reconoce las etiquetas ES/EN de categorías y sabores, además de los textos comerciales bilingües existentes.
- `validateCatalogTaxonomy()` devuelve `{ valid, errors }` y permite revisar datos desde la consola. Detecta estructura inválida, identificadores vacíos/duplicados, colisiones por mayúsculas o espacios, etiquetas ES/EN incompletas y referencias desconocidas de productos. Al renderizar se avisa en consola cuando cambia el conjunto de errores; no aparecen mensajes técnicos al cliente. No se autocorrigen identificadores ni se inventan traducciones. Un producto con una referencia desconocida permanece en la vista general y usa su valor literal como fallback; el propietario debe corregir el dato antes de publicar. Solo las definiciones conocidas y utilizadas generan filtros.

### Agregar un producto de temporada

1. Abrir `catalog/js/products.js` y crear el producto con un ID nuevo y estable, todos sus datos comerciales y las cinco propiedades obligatorias de `translations.en` y `translations.es`.
2. Referenciar una categoría y sabor existentes mediante sus valores exactos de `catalogTaxonomy`.
3. Si necesita un valor nuevo, agregar una definición a `categories` o `flavors` con `value` y `label.en` / `label.es`, en la posición deseada. Registrar tanto la definición como el producto en ese mismo archivo; no repetir etiquetas en los productos ni editar el diccionario de interfaz.
4. Guardar y, desde CAT-SEO-001, ejecutar `node catalog/generate.mjs` desde la raíz del repositorio para regenerar ambas páginas y sus datos estructurados. Recargar el Catálogo; ejecutar `validateCatalogTaxonomy()` en la consola y comprobar que `valid` sea `true`. Revisar filtros y contadores de escritorio/móvil, etiquetas ES/EN, búsqueda, Details, fotografías y selección. El propietario debe completar y verificar las traducciones comerciales.
5. Para retirar el producto, eliminar su registro sin reutilizar el ID. Al retirar el último registro de una categoría o sabor, el filtro desaparece automáticamente; su definición puede conservarse para otra temporada. Las selecciones guardadas siguen identificando productos retirados mediante el contrato de persistencia existente.

No se requiere modificar HTML, CSS, `scripts.js` ni `translations.js` para estas operaciones ordinarias. CAT-IMP-005C coordina los tres scripts clásicos en `v=2.3`; no cambia `montfrut.language`, `montfrut.catalog.selection.v1` ni su esquema, y conserva íntegramente los ajustes de accesibilidad de CAT-IMP-005B. Esta etapa no incluye SEO, metadatos, nuevas funciones comerciales ni otras correcciones previas a publicación.

## 16. Rutas públicas, generación y estadísticas — CAT-SEO-001

### Una aplicación, dos documentos iniciales

- Dominio canónico: `https://montfrut.com`, sin www. Español: `/catalog/`; inglés: `/catalog/en/`. Las variantes explícitas con `index.html` sirven el mismo idioma y declaran el canonical de su directorio. Las dos rutas existen como archivos reales, sin redirecciones por navegador o preferencias. Links mantiene su funcionamiento anterior y únicamente adapta sus enlaces al Catálogo a las rutas ES/EN correspondientes.
- `catalog/template.html` es la única estructura HTML editable, con textos de interfaz ingleses y marcadores de rutas. `node catalog/generate.mjs` usa solo módulos incluidos en Node, lee `products.js` y `translations.js`, y genera `catalog/index.html` y `catalog/en/index.html` de manera determinista. No editar esas salidas manualmente. Los dos HTML comparten los mismos JS, CSS e imágenes; no hay una segunda aplicación ni datos comerciales mantenidos por separado.
- Los textos de interfaz se localizan durante la generación y conservan la internacionalización existente en ejecución. Los nombres y descripciones del JSON-LD se obtienen directamente de cada producto. Agregar un producto o una definición de taxonomía sigue requiriendo editar únicamente `products.js`; luego se ejecuta el generador para actualizar las salidas SEO, sin copiar textos comerciales a otro archivo. La plantilla solo se edita cuando cambia la estructura de la interfaz.
- El HTML inicial contiene idioma, título, descripción, introducción, canonical, hreflang recíprocos `es`, `en` y `x-default` español, Open Graph/Twitter e imagen social. La imagen aprobada es `https://montfrut.com/links/assets/img/montfrut-og.jpg`; se verificó su archivo local y respuesta HTTP 200 el 2026-11-20. Los locales Open Graph son `es_US` / `en_US`; hreflang sigue siendo genérico `es` / `en`.
- JSON-LD utiliza `CollectionPage`, `ItemList` con posiciones correlativas y la organización Montfrut. No incorpora páginas individuales ficticias, reseñas, ofertas, puntuaciones, checkout ni afirmaciones adicionales. Funciona con cero, uno o muchos productos. Es una salida generada del modelo, no otra fuente editable de información comercial; no garantiza resultados enriquecidos.

### Estado, historial y recursos

- El selector usa `pushState`; `popstate` actualiza el idioma sin volver a agregar historial. Metadatos, canonical, URL social, JSON-LD, contenido y enlaces a Links/Privacidad se actualizan en el mismo documento. Se conservan selección, cantidades, variantes, filtros, búsqueda, orden, formulario y componentes abiertos según el comportamiento existente. No se usan almacenamiento ni URL para transferir datos personales. Si falla History API, se mantiene el idioma anterior y se informa sin forzar una recarga que pierda el formulario.
- No hay navegación automática por cambios de `montfrut.language` en otras pestañas. La clave compartida permanece intacta; la recuperación de selección conserva `montfrut.catalog.selection.v1`, esquema 1.
- Las referencias HTML compartidas son absolutas desde la raíz. `catalogAssetUrl()` resuelve las rutas comerciales desde `/catalog/` y deriva vistas de imágenes/galerías sin modificar `products.js`. También se utiliza para My Selection. CSS conserva sus referencias relativas a la ubicación real de la hoja compartida. No se utiliza `<base>`, por lo que los fragmentos y destinos Bootstrap siguen siendo locales al documento.
- Para desarrollo usar un servidor HTTP con raíz en el repositorio, por ejemplo `python -m http.server 8000 --bind 127.0.0.1`, y abrir `/catalog/` o `/catalog/en/`. Abrir archivos mediante `file://` no representa las rutas públicas ni History API. No se instalan dependencias.

### GA4 y consentimiento estadístico

- `catalog/js/analytics.js` incorpora únicamente vistas `page_view` del GA4 existente `G-05PV03EELD`. Reutiliza sin cambios `links/assets/js/consent.js` y la clave `montfrut.analyticsConsent` (`accepted` / `rejected`). No importa analytics.js ni consent-ui.js de Links, que son específicos de ese módulo. El aviso del Catálogo permanece en el flujo del documento y no se superpone con modales ni Offcanvas; tiene controles accesibles y traducciones ES/EN. La elección anterior evita repetirlo.
- Sin aceptación explícita no se inserta el script de Google. Tampoco se carga en HTTP, localhost, otros dominios o rutas ajenas. En producción se admiten HTTPS montfrut.com y www.montfrut.com; los datos enviados utilizan siempre el dominio canónico sin www. La revocación compartida desde Privacidad, los eventos de almacenamiento y la recuperación de pestañas son gestionados por el consentimiento existente. La bandera de opt-out y los consentimientos denegados detienen futuras mediciones incluso si el tag ya cargó; no se borran datos enviados previamente ni se afirma que se eliminen cookies existentes.
- Solo se envían título, idioma y URL canónica estáticos, sin query ni fragmento y con referrer vacío. No se observan clics, campos, nombres, empresas, fechas, comentarios, selección, mensajes de WhatsApp ni texto de consultas. Las categorías publicitarias y Google Signals permanecen deshabilitados. El script utiliza referrerPolicy=no-referrer y el documento strict-origin. Una vista se emite al cargar y por cada cambio real de ruta de idioma; repetir el mismo idioma, aceptar otra vez o abrir componentes no agrega visitas. El consentimiento comercial por operación permanece separado e intacto.
- Antes de publicar es obligatorio comprobar en GA4 (Administrador → Flujos de datos → flujo web compartido) que Enhanced Measurement esté desactivado, incluidas las vistas automáticas por historial, enlaces salientes, búsquedas, formularios, descargas y video. El código usa `send_page_view: false` y vistas manuales, pero no sustituye esa configuración remota. Revisar también la detección automática de eventos y datos proporcionados por usuarios, Google Signals, funciones publicitarias y ausencia de etiquetas duplicadas. Confirmar que ninguna otra etiqueta inyectada por Hostinger o Google Tag Manager mida automáticamente el formulario o URLs de consulta.
- En DebugView/Network comprobar rechazo inicial (ningún tag/hit), aceptación previa y nueva, ES → EN → ES, Atrás/Adelante, aceptación repetida sin duplicados, revocación desde Privacidad y ausencia de datos personales. No ingresar datos reales para estas pruebas. La configuración remota y los hits reales no se verificaron en esta implementación. Referencias: [vistas manuales de GA4](https://developers.google.com/analytics/devguides/collection/ga4/views) y [Enhanced Measurement](https://support.google.com/analytics/answer/9216061).

### Preparación para Hostinger y Search Console

- `robots.txt` permite rastreo e indica `https://montfrut.com/sitemap.xml`. El sitemap contiene únicamente Catálogo, Links y Privacidad ES/EN, respaldados por archivos reales previstos para publicar. No incluye recursos internos, páginas individuales de productos ni fechas lastmod inventadas. Es preparación local; no publica ni garantiza indexación.
- Antes de cualquier publicación autorizada: ejecutar el generador, revisar sus diferencias, comprobar las dos rutas con recarga y todos los recursos. Subir los HTML generados, recursos compartidos de ejecución, páginas públicas, robots.txt y sitemap.xml. Excluir del contenido público `catalog/template.html`, `catalog/generate.mjs`, docs, .git y demás archivos de desarrollo. No hace falta instalar Node en Hostinger ni ejecutar el generador en producción.
- Configurar/verificar en Hostinger, con autorización posterior, HTTPS, dominio preferido sin www y redirección permanente del alias www, DirectorioIndex y ausencia de reglas que transformen `/catalog/en/` en la versión española. Las variantes `index.html` ya declaran canonical de directorio; verificar HTTP 200, MIME y caché al desplegar. No se modificó configuración remota ni se creó una regla de servidor basada en supuestos.
- En Search Console verificar propiedad, sitemap y ambas URLs, canonical declarado/elegido y renderizado. Revisar JSON-LD con Schema.org Validator y la herramienta de resultados enriquecidos, además de vistas previas sociales. Inspeccionar los límites del rastreo antes de habilitar producción; el Catálogo continúa sin autorización de publicación.
- Limitaciones actuales: HTTP local y generador comprobados sin navegador; DOM, Bootstrap, History API, Analytics y servicios externos simulados para pruebas funcionales. Quedan pendientes geometría responsive, teclado/lector de pantalla, interacción real, configuración del flujo GA4, tráfico real y comprobaciones de Hostinger/Search Console. Estas pruebas no equivalen a una certificación visual ni de indexación.
