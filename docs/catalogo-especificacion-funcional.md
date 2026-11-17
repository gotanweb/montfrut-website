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
- **CAT-F40:** Antes de abrir WhatsApp se informa que la consulta no constituye una compra ni reserva de productos.

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
| CAT-IMP-003 | My Selection, cantidades/eliminación desde UI, subtotal estimado, revisión de estados y precios, formulario y WhatsApp | Pendiente de autorización |
| CAT-IMP-004 | Internacionalización completa ES/EN | Etapa posterior |
| Etapas posteriores por autorizar | Avisos informativos y su aceptación, y demás reglas aún no implementadas, incluidos contadores dinámicos y administración de categorías/sabores | Pendientes |

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
