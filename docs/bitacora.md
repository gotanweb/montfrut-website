# Bitácora — Montfrut Website

Repositorio: `gotanweb/montfrut-website`. Módulos: Website `/`, Links `/links/` y Catálogo `/catalog/`.
Referencia de esta entrega: `main`, commit base `7c97600dc5c6e5fee2a8c71274e055b473b5fcfa`. No se crearon commits ni se publicaron cambios.

## Índice de tareas

| ID | Descripción | Módulo | Prioridad | Estado |
| --- | --- | --- | --- | --- |
| LNK-001 | Bitácora e índice documental | Links | Media | Completada |
| LNK-002 | Rutas internas y navegación | Links | Alta | Completada; validación local OK |
| LNK-003 | Detección y persistencia de idioma | Links | Alta | Implementada; navegador pendiente |
| LNK-004 | Optimización de imágenes | Links | Alta | Implementada; validación local OK |
| LNK-005 | Enlaces externos | Links | Media | Implementada; 403 pendientes |
| LNK-006 | Open Graph, favicon y metadatos sociales | Links | Media | Implementada; previsualización publicada pendiente |
| LNK-007 | SEO bilingüe y datos estructurados | Links | Media | Implementada; validación publicada pendiente |
| LNK-008 | vCard y datos de contacto | Links | Media | Implementada; importación en dispositivos pendiente |
| LNK-009 | Accesibilidad y contraste | Links | Media | Implementada; teclado y visual pendientes |
| LNK-010 | Animaciones y dimensiones | Links | Baja | Implementada; navegador pendiente |
| LNK-011 | Dependencias externas | Links | Media | Completada; SRI verificado |
| LNK-012 | Integridad de recursos compartidos | Links | Alta | Verificada localmente; acoplamiento documentado |
| LNK-013 | Validaciones finales | Links | Alta | Validación local completada; producción pendiente |

## Registro cronológico

### 2026-11-09 — IMP-001 / LNK-001, LNK-002 y LNK-003

- Creado este índice y registro. Cambios limitados a `docs/bitacora.md`, `links/index.html`, `links/en/index.html` y el nuevo `links/assets/js/language.js`.
- Website y Catálogo enlazados a `https://montfrut.com/` y `https://montfrut.com/catalog/`. Canonical y `og:url` de Links ajustados a `https://montfrut.com/links/` y `https://montfrut.com/links/en/`; eliminadas las referencias al antiguo subdominio en Links.
- Incorporado el contrato `montfrut.language` (`es`/`en`) y la API `window.MontfrutLanguage`: `storageKey`, `readPreference()`, `savePreference(language)` y `detectBrowserLanguage()`.
- `/links/` es la entrada automática: preferencia válida guardada, luego primer idioma ES/EN de `navigator.languages` (o `navigator.language`), y finalmente EN. Las variantes regionales se normalizan.
- `?lang=es` o `?lang=en` solicita y guarda una elección explícita. `/links/en/`, `/links/en/index.html` y `/links/index.html` respetan su idioma explícito si no hay un parámetro válido. La URL explícita prevalece sobre la preferencia guardada y el navegador.
- El selector conserva navegación HTML nativa y guarda la elección; la vuelta a ES usa `/links/?lang=es` para evitar que la detección la revierta si el almacenamiento está bloqueado. Las redirecciones usan `replace`, conservan query/hash y solo ocurren si cambia el idioma de página.
- Al bloquear `localStorage`, las excepciones se controlan y siguen disponibles la detección y los accesos explícitos; no se garantiza persistencia sin almacenamiento.
- Website y Catálogo no fueron modificados ni integrados al idioma: solamente podrán adoptar después el mismo contrato bajo el mismo origen. Se conservaron imágenes, CSS, JS previo, vCard y enlaces externos.

## Pruebas y validaciones

- Sintaxis: `node --check` satisfactorio en `language.js` y `main.js`. `git diff --check` sin errores de espacios.
- Idiomas: 49 comprobaciones con Node/VM y APIs simuladas, todas satisfactorias: variantes ES/EN, idioma no soportado, prioridad guardada/manual/URL, accesos explícitos, selectores reales del HTML, valores inválidos y errores de acceso/lectura/escritura de `localStorage`.
- Redirecciones: 384 combinaciones de rutas, query, navegador, preferencia y almacenamiento finalizaron con cero o una redirección. Query/hash y origen preservados. API reutilizable comprobada sin redirecciones ni escrituras automáticas fuera de Links.
- Navegación: canonical, `og:url`, destinos de Website/Catálogo y selectores ES/EN comprobados mediante resolución de URL y análisis de ambos HTML. Los recursos locales cargados existen; los siete enlaces externos de cada página y la descarga VCF permanecen idénticos al commit base.
- Alcance: comparación exacta de HTML con los reemplazos autorizados y comprobación de Git satisfactorias. Website, Catálogo, CSS, imágenes, JS previo y vCard sin diferencias; solo dos HTML modificados y dos archivos nuevos autorizados. Sin paquetes instalados ni comprobación HTTP de producción en esta entrega.
- Navegador: el servicio de acceso informó `The browser access host is unavailable`; no se realizaron pruebas visuales ni navegación real.

## Pendientes y límites

- LNK-004 a LNK-013 continúan pendientes; esta entrega no los implementa.
- Se mantienen los hallazgos de AUD-001 sobre fondos, YouTube, imagen social ausente, SEO bilingüe, datos estructurados, vCard, accesibilidad, animaciones y dependencias.
- Los recursos alojados en Links siguen siendo utilizados por otros módulos y no se movieron ni eliminaron.
- Pendientes pruebas en navegador y validación del entorno Hostinger, incluida la conservación del origen `https://montfrut.com` sin redirecciones a otro host; sin cambios en `.htaccess`, ramas, commits o despliegues.

## 2026-11-09 — IMP-002 / LNK-004 a LNK-008

- Antes de los cambios, guardado IMP-001 en el commit local `e53bbc9` (`feat(links): implement language preference and navigation`), exclusivamente con sus cuatro archivos autorizados. Sin push. El registro anterior describe el estado de aquella entrega y se conserva intacto.
- LNK-004: creadas tres copias WebP con PHP/GD ya instalado, calidad 88; reducidas las dimensiones de tablet y escritorio sin cambiar la composición. `links/assets/css/styles.css` selecciona WebP mediante `image-set()` y conserva respaldo PNG. Originales compartidos intactos.

| Fondo | Original, bytes | WebP, bytes | Dimensiones WebP | Ahorro |
| --- | ---: | ---: | --- | ---: |
| `bg-mobile` | 1.564.223 | 74.970 | 941 × 1672 | 95,21 % |
| `bg-tablet` | 6.098.722 | 91.556 | 1280 × 1714 | 98,50 % |
| `bg-desktop2` | 6.334.649 | 91.874 | 1920 × 1072 | 98,55 % |
| Total de variantes | 13.997.594 | 258.400 | No se descargan todas por visita | 98,15 % |

- LNK-005: eliminado por decisión aprobada el botón de entrevista de YouTube en ES/EN. Quedan cinco botones principales en la misma columna flexible y con el mismo espaciado; la entrevista no se implementó en Website. Los otros diez enlaces de cada página, incluidos los mensajes de WhatsApp, permanecen idénticos.
- LNK-006: creados `links/assets/img/montfrut-og.jpg` (1200 × 630, 81.245 bytes) y `favicon.png` (192 × 192, 9.704 bytes) con los gráficos existentes. La composición social copia el logo a tamaño nativo; el icono lo reduce proporcionalmente sobre transparencia. Sin rediseñar ni sobrescribir el logo. Ambos HTML usan la misma imagen social mediante URL absoluta, tipo, dimensiones y textos alternativos localizados, y declaran el favicon.
- LNK-007: añadidos `hreflang` recíprocos ES/EN y `x-default`, coherentes con canonical y `og:url`. Sustituido `LocalBusiness` por una única `Organization` con el mismo `@id` en ambas páginas; retirado el microdato duplicado. Solo datos existentes, sin dirección inventada; el logo estructurado usa el icono cuadrado. Referencias: [Organization](https://developers.google.com/search/docs/appearance/structured-data/organization), [idiomas](https://developers.google.com/search/docs/specialty/international/localized-versions) e [image-set](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/image/image-set).
- LNK-008: correo aprobado `montfrut@gmail.com` en ambas entidades JSON-LD y vCard; añadido `N:Guerra;Aniuska;;;` y preservados CRLF y los restantes datos de contacto. El correo corporativo podrá incorporarse posteriormente.
- Archivos modificados: esta bitácora, ambos HTML, `links/assets/css/styles.css` y `links/contact.vcf`. Creados los cinco recursos gráficos anteriores. Ningún archivo eliminado; JS de IMP-001, Website, Catálogo y recursos originales sin cambios.

### Validaciones y pendientes de IMP-002

- OK: estructura HTML básica y atributos, JSON-LD válido, una entidad por idioma, identidad compartida, metadatos coherentes y alternates recíprocos. Rutas, imágenes, favicon, logo y recursos CSS locales existentes. Comprobación local, sin certificación de un validador SEO remoto.
- OK: comparación de todos los enlaces restantes y su contenido con IMP-001; ausencia del botón de entrevista; CSS solo incorpora tres selecciones WebP/PNG; comparación de vCard confirma que únicamente se añadió `N`. Campos obligatorios, componentes de `N`/`ADR`, longitudes y CRLF correctos.
- OK: los cinco gráficos nuevos se decodifican; tamaños, formatos y dimensiones verificados y revisión visual realizada. `node --check` de ambos JS y `git diff --check` satisfactorios; lógica de idiomas y módulos protegidos sin diferencias. Sin instalaciones de paquetes.
- HTTP HEAD: Website, Catálogo, Instagram, Facebook y ambas rutas de WhatsApp respondieron 200. LinkedIn y TikTok respondieron 403: no se consideran rotos, quedan pendientes de verificación manual. Un 200 no certifica titularidad ni interacción completa.
- Navegador: `The browser access host is unavailable`. Pendientes presentación de la página con cinco botones, selección/descarga efectiva de WebP y legibilidad del favicon pequeño. La revisión visual de archivos no sustituye estas pruebas.
- Pendientes previsualizaciones sociales, rastreo/validadores sobre URLs publicadas e importación de vCard en iOS, Android y Outlook. Recursos nuevos aún sin publicar; LNK-009 a LNK-013 continúan pendientes.
- Git: IMP-002 queda sin commit y sin cambios preparados; sin push, despliegues ni cambios de rama o `.htaccess`.

## 2026-11-09 — IMP-002A / Corrección de LNK-006

- Conservado el favicon proporcionado por el propietario: PNG de 20 × 20, sin ampliarlo ni modificarlo; `sizes="20x20"` en ES/EN.
- Copiado el recurso existente `montfrut-og-sin-logos.jpg` a `montfrut-og.jpg`, sin recompresión ni generación, para usar la imagen aprobada sin logotipos conservando la URL. JPEG de 1200 × 630; textos `og:image:alt` y `twitter:image:alt` actualizados en ambos idiomas.
- `Organization.logo` apunta al logo original existente `https://montfrut.com/links/assets/img/montfrut-logo.png` (250 × 90), sin alterar su diseño. Limitación: su altura no alcanza el mínimo de 112 px indicado por Google para logos estructurados; no se generó ni amplió un recurso para resolverlo.
- Archivos: ambos HTML, `links/assets/img/montfrut-og.jpg` y esta bitácora. Registros anteriores conservados. Dimensiones, existencia, coherencia bilingüe, JSON-LD y `git diff --check` verificados; favicon y otros archivos ajenos a estos ajustes intactos.
- Pendientes: previsualización social publicada y un recurso de logo con dimensiones adecuadas para Google. Sin dependencias, commits ni publicación.

## 2026-11-09 — IMP-003 / LNK-009 a LNK-012

- Guardados IMP-002 e IMP-002A en el commit local `f9fc10d` (`fix(links): optimize assets and update metadata`), con sus diez archivos verificados. Excluidos `revision-imp002.txt`, los favicon de Website/Catálogo y las imágenes alternativas no utilizadas; permanecen intactos y sin seguimiento. Sin push.
- LNK-009: iconos sociales azul oscuro sobre crema (14,19:1; hover blanco/coral 3,34:1); foco de dos colores en botones, selector y redes; selector opaco con contraste 14,19:1 normal y 10,93:1 hover. Selector de 44 px de alto en el flujo para evitar superposiciones; texto de 12,8 px. Títulos de botones y descripciones visibles de al menos 14 px a tamaño raíz de 16 px. Incorporado `h1` alrededor del logo, sin duplicar su nombre; marcado el idioma del selector y las banderas/iconos decorativos.
- LNK-010: atributos del logo corregidos a 250 × 90, sin cambiar el archivo ni su ancho visual CSS. Animación existente aplicada a cada botón, sin animar también su contenedor. Relleno `backwards` permite recuperar transformaciones normales al finalizar y evita contenido permanentemente oculto si no se anima. La entrada se cancela al enfocar/pulsar para no repetirse al interactuar. Movimiento reducido desactiva animaciones, transiciones, desplazamiento suave y transformaciones; JS omite los efectos en ese modo.
- LNK-011: retirado Bootstrap JS tras confirmar ausencia de componentes y llamadas en Links. Conservados Bootstrap CSS 5.3.3, Font Awesome 6.5.2 y Google Fonts. SRI SHA-384 y `crossorigin="anonymous"` en ambas hojas versionadas; hashes calculados leyendo cada CDN y contrastados con unpkg, con coincidencia de SHA-384 y longitud y CORS `*`. Google Fonts no recibe un hash fijo porque su CSS no está fijado a una versión y puede variar por cliente. Sin paquetes nuevos. Referencia: [SRI](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Subresource_Integrity).
- LNK-012: las referencias de Website/Catálogo a Links verificadas resuelven localmente a seis destinos existentes. Fondos PNG originales y logo idénticos por SHA-256 al commit inicial `7c97600`; favicon disponible. Ningún recurso eliminado, renombrado o modificado en IMP-003. Sigue pendiente el acoplamiento de esos módulos a recursos dentro de Links; no se reorganizó.
- Archivos modificados: `links/index.html`, `links/en/index.html`, `links/assets/css/styles.css`, `links/assets/js/main.js` y esta bitácora. Lógica de idiomas, vCard, imágenes y otros módulos intactos.
- Validaciones OK: sintaxis de ambos JS, estructura básica HTML/atributos, encabezados y dimensiones, enlaces y JSON-LD conservados, recursos locales, hashes SRI y contrastes calculados. 110 aserciones de animación/interacción con DOM simulado, incluidos foco, puntero y movimiento reducido. CSS comprobado por delimitadores/cadenas y reglas específicas, no mediante un validador completo. `git diff --check` sin errores.
- Pendientes: pruebas visuales, zoom, teclado, lector de pantalla y renderizado real de animaciones/SRI en navegador (servicio no disponible en esta sesión); producción/Hostinger y LNK-013. No se declara conformidad WCAG integral. La adecuación del logo estructurado al mínimo de Google continúa pendiente (archivo original 250 × 90, altura inferior a 112 px), sin imágenes nuevas ni cambios de marca.
- Git: IMP-003 sin commit y sin cambios preparados; sin push, despliegue, cambio de rama ni `.htaccess`. Historial anterior conservado.

## 2026-11-09 — IMP-004 / Cierre local de LNK-013

- El responsable del proyecto informó 14/14 comprobaciones manuales locales satisfactorias; se registran como evidencia aportada por él, sin atribuir su ejecución al agente.
- Verificados por el responsable: diseño responsive en móvil, tablet y escritorio; cinco botones, navegación, WhatsApp y descarga de vCard; selector de idioma, cambio ES/EN y persistencia; navegación con teclado y zoom al 200 %.
- Fondos WebP cargados correctamente en los tres tamaños, consola de Chrome sin errores en modo incógnito y prueba satisfactoria en un teléfono Samsung Galaxy real, según lo informado.
- LNK-013: **Validación local completada; producción pendiente**. De las comprobaciones de cierre quedan únicamente las que requieren publicación, incluidas previsualizaciones sociales y validaciones en producción/Hostinger. No se consideran ejecutadas ni completadas esas pruebas.
- Registros anteriores conservados; sin cambios funcionales, de estilos, dependencias, otros módulos ni `.htaccess` en IMP-004.
