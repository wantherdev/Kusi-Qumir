# Registro de decisiones

Este documento conserva las decisiones duraderas del proyecto. No sustituye el
historial de Git ni la lista operativa de `ESTADO_PROYECTO.md`.

## 2026-08-08 — Base tecnológica

- Se utiliza Angular moderno con componentes standalone y carga diferida.
- Se utiliza pnpm como único administrador de paquetes.
- Node y pnpm quedan fijados mediante `.nvmrc`, `engines` y `packageManager`.
- Se mantiene SSR con Express, hidratación y prerender para rendimiento y SEO.

## 2026-08-08 — Sistema de estilos

- Tailwind CSS 4 se usa para utilidades directamente en las plantillas.
- SCSS se usa para tokens, estilos globales y composiciones editoriales de los
  componentes.
- No se usa `@apply` dentro de Sass.
- Las tipografías se alojan localmente para evitar dependencias externas en la
  carga inicial.

## 2026-08-08 — Marca y dirección visual

- La fuente de verdad visual es el manual y el paquete
  `Kusi_Qumir_Sistema_Marca_Digital_v2.1/` entregado por el diseñador.
- Se conserva una estética editorial andina contemporánea, cercana y natural.
- El hero debe cubrir su espacio visual sin márgenes vacíos accidentales.
- Las tarjetas de experiencias pueden usar ilustraciones generadas siempre que
  mantengan el estilo aprobado y no se presenten como fotografías documentales.
- Las tarjetas del catálogo real conservan la composición editorial original:
  imagen a sangre, degradado oscuro, numeración, texto blanco y acento turquesa.
- El footer conserva la estructura de cuatro columnas de la referencia aprobada.
- El turquesa de marca es el hover común de enlaces e iconos sociales.

## 2026-08-08 — Recursos e iconos

- Los recursos necesarios para la interfaz se sirven localmente desde
  `frontend/public/`.
- Las redes sociales utilizan Remix Icon; sus SVG se copian desde el paquete
  instalado durante el build y no dependen de un CDN.
- Mientras no existan URLs oficiales, los iconos sociales no deben funcionar
  como enlaces falsos.

## 2026-08-08 — Seguridad jurídica de la landing

- La web no debe inventar datos comerciales ni mostrar una licencia simulada.
- Los formularios permanecen en modo demostrativo hasta implementar tratamiento
  de datos, consentimiento y backend.
- El Libro de Reclamaciones no se presenta como operativo hasta generar y
  entregar la constancia exigida y conectar un canal de atención real.
- Los borradores legales informan su condición provisional.
- La ilustración del hero es decorativa y no prueba la prestación de una
  experiencia turística real.

## 2026-08-08 — Estrategia de entrega

- Primero se publica una landing institucional técnicamente preparada.
- Las capacidades comerciales se activarán únicamente después de completar los
  requisitos legales, operativos y de seguridad.
- El sitio completo se desarrollará progresivamente sin comprometer la versión
  estable de la landing.

## 2026-08-10 — Frontend para evaluación institucional

- El frontend identifica de forma visible que el canal digital se encuentra en
  evaluación y que las funciones comerciales están desactivadas.
- Se incorpora una ficha institucional para concentrar identidad, modalidad,
  clasificación, estado del registro y controles previstos.
- Los datos verificables del prestador se centralizan en
  `frontend/src/app/config/agency-profile.ts`; los campos sin sustento
  permanecen nulos y nunca se sustituyen por datos ficticios.
- La web no utiliza la denominación ni el distintivo reservado a una agencia
  inscrita mientras no exista constancia y autorización vigentes.
- Se retira el newsletter demostrativo para evitar una captación aparente de
  datos. Los formularios restantes declaran que no transmiten ni almacenan la
  información ingresada.
- La indexación pública permanece bloqueada durante la evaluación. Se habilitará
  únicamente al completar identidad, registro, documentos, dominio y revisión
  final.

## 2026-08-10 — Modalidad operativa confirmada

- Kusi Q’umir operará exclusivamente mediante canales digitales.
- La formalización y la ficha institucional se preparan conforme al Anexo II
  del Reglamento de Agencias de Viajes y Turismo.
- No se declarará una oficina de atención presencial ni una licencia municipal
  de funcionamiento mientras no formen parte real del modelo operativo.
- La atención al turista, las consultas y cualquier futura comercialización
  deberán realizarse mediante canales digitales reales, verificables y seguros.

## 2026-08-10 — Clasificación y modelo de servicio confirmados

- Kusi Q’umir ofrecerá directamente al turista tours propios y tours prestados
  por terceros.
- La clasificación prevista es minorista y operador de turismo; el artículo 6.2
  del D.S. N.° 005-2020-MINCETUR permite desarrollar actividades de una o más
  clasificaciones.
- Se entiende por tours propios aquellos que Kusi Q’umir diseña, organiza y
  opera. Si su ejecución fuese asumida íntegramente por otra empresa, deberá
  revisarse la clasificación de operador antes de presentar el Anexo II.
- No se declara la clasificación mayorista mientras no se confirme la oferta de
  servicios para su venta por otras agencias.
- Cada propuesta deberá identificar claramente si Kusi Q’umir actúa como
  operador o como intermediario de un prestador tercero.

## 2026-08-10 — Auditoría técnica integral

- TypeScript y los templates Angular se validan en modo estricto.
- Las rutas desconocidas dejan de redirigir a portada: muestran una página
  propia y el servidor devuelve HTTP 404.
- Los metadatos descriptivos y sociales se actualizan por ruta mediante una
  `TitleStrategy`, conservando `noindex, nofollow` durante la evaluación.
- `robots.txt` permite rastreo porque bloquearlo impediría que un buscador lea
  la directiva `noindex` del HTML.
- El hero se sirve como imagen prioritaria y las imágenes secundarias usan carga
  diferida con dimensiones reservadas.
- El servidor Express diferencia caché de HTML, bundles con hash y activos sin
  hash, elimina `X-Powered-By` y añade encabezados básicos de seguridad.
- La política CSP se definirá y probará con el hosting definitivo; no se incorpora
  una política especulativa que pueda romper hidratación o integraciones futuras.
- Los formularios demostrativos exponen errores cercanos y programáticos, y la
  navegación gestiona foco en menú móvil y cambios de ruta.

## 2026-08-10 — Backend propio mínimo

- La API propia se implementa con NestJS, Prisma y PostgreSQL como aplicación
  separada dentro del mismo workspace pnpm.
- La primera frontera de backend incluye únicamente salud, solicitudes de
  contacto y hojas de reclamación. Pagos, reservas, usuarios, uploads y
  analítica permanecen fuera hasta existir requisitos y operación reales.
- Cada recepción genera un código público no secuencial; la base conserva la
  versión de privacidad aceptada y el instante de aceptación.
- El frontend continúa en modo demostrativo hasta aprobar la política de
  privacidad, disponer de PostgreSQL persistente y definir notificaciones y
  responsables de atención.

## 2026-08-10 — Workspace separado por aplicaciones

- El frontend Angular vive íntegramente en `frontend/` y la API NestJS en
  `backend/`.
- La raíz conserva documentación, recursos de marca, configuración compartida y
  scripts de orquestación; no contiene código fuente de ninguna aplicación.

## 2026-08-10 — Activación controlada de formularios

- La integración Angular–NestJS utiliza una URL relativa bajo `/api/v1` para
  evitar acoplar el frontend a un proveedor de hosting.
- La recepción se controla mediante un token de configuración apagado por
  defecto. No se habilita hasta contar con privacidad aprobada, base persistente,
  correo y responsables operativos.

## 2026-08-10 — Identidad legal y estado tributario verificados

- La Ficha RUC emitida por SUNAT el 10 de agosto de 2026 sustenta razón social,
  RUC, representante, domicilio fiscal, partida registral y actividad económica.
- El mismo documento muestra el RUC en baja provisional por oficio desde el 31
  de julio de 2026. Este estado se informa de manera visible y bloquea toda
  operación comercial hasta su regularización y nueva verificación.
- El domicilio fiscal no se presenta como oficina ni como dirección pública de
  atención. El teléfono y correo personal de SUNAT tampoco se publican sin
  confirmación expresa.
- `kusiqumir@gmail.com` se utiliza como correo general confirmado por el titular;
  aún falta designar canales específicos para privacidad y reclamaciones.

## 2026-08-10 — Catálogo vigente migrado desde el proyecto anterior

- El titular confirmó como vigentes los 10 tours, itinerarios y precios de la
  seed ubicada en el proyecto anterior.
- El catálogo se migra a la API actual mediante un modelo Prisma acotado y un
  seed idempotente por `slug`; no se trasladan el administrador con contraseña
  conocida, los testimonios demostrativos ni el borrado masivo de tablas.
- El listado devuelve una proyección resumida y la ficha individual entrega el
  contenido completo para reducir transferencia innecesaria.
- Las rutas de catálogo se renderizan en cliente durante la evaluación para que
  el build no dependa de una base de datos disponible. Antes de habilitar
  indexación deberá implementarse SSR o prerender con acceso seguro a la API.
- Los documentos legales del proyecto anterior no sustituyen los borradores
  actuales porque contienen correos, dirección, habilitaciones y condiciones no
  confirmadas o incompatibles con el estado vigente.
- El catálogo es informativo: la consulta por WhatsApp está disponible, pero las
  reservas y pagos siguen desactivados.
- El script de desarrollo del backend compila y ejecuta Node sin el modo watch
  del CLI de Nest, que falla al construir comandos cuando la ruta contiene la
  comilla de `Kusi-Q'umir`.

## 2026-08-10 — Portada conectada al catálogo real

- La portada deja de mantener tres experiencias demostrativas independientes y
  consume el mismo endpoint resumido que `/tours` para mostrar los 10 tours.
- La UI de tarjeta pertenece al feature de tours y se reutiliza en ambas páginas;
  el acceso HTTP permanece encapsulado en `data-access` y el estado remoto se
  modela como loading, loaded o error.
- El servidor y el navegador no consultan la API durante el prerender de la
  portada; el navegador carga el catálogo después de la hidratación. Esta
  decisión evita que el build dependa de PostgreSQL mientras la web permanece
  bloqueada para indexación.
- La portada retira el formulario demostrativo y ofrece únicamente enlaces a los
  canales confirmados. No se captan datos, se habilitan reservas ni se procesan
  pagos.
- El comando raíz `pnpm start` levanta API y frontend en conjunto con variables
  locales de desarrollo, evitando que Angular quede activo sin el catálogo.

## 2026-08-10 — Colección visual propia para los tours

- Cada uno de los 10 tours dispone de una ilustración original derivada de su
  descripción, destinos e itinerario, en lugar de reutilizar tres imágenes
  genéricas entre todas las fichas.
- La colección conserva el lenguaje editorial andino establecido: gouache con
  textura de impresión, luz natural, paleta mineral con acentos turquesa y
  personas a escala secundaria frente al destino.
- Los activos finales se sirven localmente como WebP de 1122 × 1402 px, sin
  texto, marcas ni dependencias de terceros, y se referencian desde el catálogo
  del seed para mantener la API como fuente de verdad.
- Las imágenes anteriores se conservan como recursos de respaldo; los nuevos
  archivos no las sobrescriben.

## 2026-08-11 — Portada destacada y precios en soles

- La portada muestra como máximo cuatro experiencias y prioriza los tours
  marcados como destacados; `/tours` conserva el catálogo completo de 10 rutas.
- A solicitud del titular, los precios del catálogo se expresan en soles
  peruanos (`PEN`) y la interfaz utiliza el símbolo `S/`.
- La conversión parte del tipo de cambio venta SBS de S/ 3.387 por USD publicado
  el 10 de agosto de 2026 y redondea cada importe al sol más cercano.
- Los importes continúan siendo informativos y deberán confirmarse comercialmente
  antes de habilitar reservas o pagos; no se implementa conversión dinámica.

## 2026-08-11 — Catálogo normalizado al español

- Títulos, descripciones, itinerarios, preguntas, recomendaciones, opciones de
  precio y metadatos del seed utilizan español de forma consistente.
- Los valores de dificultad, grupo y tipo de servicio también se traducen en
  Prisma y PostgreSQL mediante una migración que conserva los registros actuales.
- Los slugs, códigos, rutas de imágenes, claves de destino, `PEN` y nombres
  propios de servicios ferroviarios permanecen sin cambios porque son
  identificadores o denominaciones oficiales, no textos editoriales.

## 2026-08-11 — Revisión frontend integral

- El footer editorial se extrae como componente compartido y se muestra en todas
  las rutas para conservar contacto, estado comercial y navegación legal sin
  duplicar implementación.
- El encabezado de páginas internas mantiene el logotipo como regreso al inicio
  y sustituye el segundo enlace redundante al inicio por un acceso al catálogo.
- La composición de las tarjetas no se rediseña: se conservan imagen a sangre,
  degradado, numeración, contenido superpuesto y acento turquesa. Se añade
  respuesta equivalente al foco de teclado.
- El turquesa brillante permanece como color de marca sobre superficies oscuras;
  los botones con texto blanco usan un token de acción más profundo que alcanza
  contraste WCAG AA.
- Los estados remotos de portada, catálogo y detalle permiten reintentar sin una
  recarga completa. Las fichas utilizan el `alt` real del catálogo y preparan una
  consulta de WhatsApp contextual, sin activar reservas ni captación de datos.

## 2026-08-11 — Mitigación de dependencias y arranque productivo

- Se fijan overrides compatibles para `multer` 2.2.0, `body-parser` 1.20.6 y
  `qs` 6.15.3. Con ello se eliminan los avisos altos sin actualizar versiones
  mayores del stack obligatorio.
- Los tres avisos moderados restantes no se ocultan ni se fuerzan: requieren una
  migración probada de NestJS 10 a 11 y de su dependencia `file-type`.
- `start:prod` ejecuta `dist/src/main.js`, que es la ruta realmente generada por
  el build NestJS actual.

## 2026-08-12 — Titularidad de tours y transparencia de terceros

- El catálogo persiste el tipo de prestación de cada tour mediante
  `operationType`, que la API expone tanto en el listado como en la ficha.
- City Tour Cusco, Valle VIP, Montaña de 7 Colores y Laguna Humantay se
  clasifican como experiencias propias. Maras y Moray, Machu Picchu, Valle Sur,
  Waqrapukara, Puente Q’eswachaka y Palcoyo se clasifican como tours de terceros.
- Los tours de terceros siguen visibles en el catálogo informativo, pero no se
  publican operadores, logos ni licencias mientras no haya aliados directos
  confirmados. La web exige validar responsable, disponibilidad y condiciones
  antes de cualquier contratación.
- El producto antes titulado Valle Sagrado de los Incas se presenta como Valle
  VIP. Se mantiene el slug `valle-sagrado`, los contenidos geográficos sobre el
  Valle Sagrado y la imagen existente para evitar romper enlaces o alterar la
  descripción real de la ruta.

## 2026-08-12 — Revisión integral backend y frontend

- La API expone paginación opcional (`limit` máx. 100, `offset`) en
  `GET /api/v1/tours`; sin parámetros conserva el comportamiento actual y
  devuelve el catálogo completo. El slug de `GET /tours/:slug` se valida con
  longitud y formato (`[a-z0-9-]`).
- Se incorpora un filtro global de excepciones con logger: los errores Prisma
  conocidos (P2002, P2025) se mapean a respuestas HTTP estructuradas y los
  errores internos no exponen detalles técnicos.
- El build de backend usa `tsconfig.build.json` y elimina `dist/` antes de
  compilar; la salida productiva es `dist/main.js` (sin specs ni `.d.ts`).
- `CONTACT_RECIPIENT_EMAIL` es opcional en la validación de entorno hasta
  implementar el flujo real de notificaciones; el `.env.example` usa únicamente
  placeholders y no contiene datos reales del prestador.
- `@types/express` se incorpora como dependencia de desarrollo para tipar el
  filtro de excepciones; no cambia el stack productivo.
- La portada deriva los conteos de tours, propios y de terceros del catálogo
  cargado en lugar de textos fijos, con respaldo a los valores actuales mientras
  el estado está en carga o error.
- La portada y el catálogo eliminan el envoltorio sin estilos `.catalog-loading`;
  los estados de carga conservan `role="status"` y los esqueletos decorativos.
- El feedback del Libro de Reclamaciones solo se anuncia cuando contiene un
  mensaje, con `role` condicional (`alert` o `status`).
- El HTML base incorpora `og:image` con el recurso local preparado
  (`cusco-andes-og.jpg`); canonical, `og:url` e imagen absoluta siguen
  pendientes hasta definir dominio e indexación.

## 2026-08-12 — Jade de marca aclarado por decisión del titular

- El titular solicita aclarar el jade de marca: el token `$teal` pasa de
  `#00ABAA` (canónico del manual) a `#00B8B7`.
- El cambio se aplica únicamente al frontend (`_tokens.scss`); el paquete del
  diseñador `Kusi_Qumir_Sistema_Marca_Digital_v2.1/` permanece intacto como
  referencia histórica.
- El tono nuevo mejora el contraste del teal sobre las superficies oscuras
  (footer y overlay de tarjetas) y mantiene la dirección visual de marca.
- La superficie suave de marca (`$surface-soft`) adopta un tinte jade pálido
  `#E0F5F4` en lugar del gris verdoso `#EAF4F4`; el jade pleno `#00B8B7` queda
  para botones, iconos y acentos. El texto sobre esas superficies usa el token
  `$soft-ink` para conservar contraste WCAG AA.


