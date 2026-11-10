# Bitácora — Montfrut Website

Repositorio: `gotanweb/montfrut-website`. Módulos: Website `/`, Links `/links/` y Catálogo `/catalog/`.
Referencia de esta entrega: `main`, commit base `7c97600dc5c6e5fee2a8c71274e055b473b5fcfa`. No se crearon commits ni se publicaron cambios.

## Índice de tareas

| ID | Descripción | Módulo | Prioridad | Estado |
| --- | --- | --- | --- | --- |
| LNK-001 | Bitácora e índice documental | Links | Media | Completada |
| LNK-002 | Rutas internas y navegación | Links | Alta | Completada; validación local OK |
| LNK-003 | Detección y persistencia de idioma | Links | Alta | Implementada; navegador pendiente |
| LNK-004 | Optimización de imágenes | Links | Alta | Pendiente |
| LNK-005 | Enlaces externos | Links | Media | Pendiente |
| LNK-006 | Open Graph, favicon y metadatos sociales | Links | Media | Pendiente |
| LNK-007 | SEO bilingüe y datos estructurados | Links | Media | Pendiente |
| LNK-008 | vCard y datos de contacto | Links | Media | Pendiente |
| LNK-009 | Accesibilidad y contraste | Links | Media | Pendiente |
| LNK-010 | Animaciones y dimensiones | Links | Baja | Pendiente |
| LNK-011 | Dependencias externas | Links | Media | Pendiente |
| LNK-012 | Integridad de recursos compartidos | Links | Alta | Pendiente |
| LNK-013 | Validaciones finales | Links | Alta | Pendiente |

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
