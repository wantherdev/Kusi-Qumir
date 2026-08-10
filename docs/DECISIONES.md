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
- El footer conserva la estructura de cuatro columnas de la referencia aprobada.
- El turquesa de marca es el hover común de enlaces e iconos sociales.

## 2026-08-08 — Recursos e iconos

- Los recursos necesarios para la interfaz se sirven localmente desde `public/`.
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
  `src/app/config/agency-profile.ts`; los campos sin sustento permanecen nulos y
  nunca se sustituyen por datos ficticios.
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
