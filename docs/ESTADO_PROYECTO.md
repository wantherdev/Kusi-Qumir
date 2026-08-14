# Estado del proyecto Kusi Q’umir

Última actualización: 14 de agosto de 2026.

Este archivo es el punto de reanudación para una persona o una nueva sesión de
IA. Debe actualizarse después de cada avance importante.

## Estado general

El frontend institucional está implementado y técnicamente funcional para su
evaluación. La identidad empresarial está contrastada con una Ficha RUC vigente
del 14 de agosto de 2026 (estado ACTIVO), pero la web no está habilitada para
operar comercialmente porque faltan registro turístico, documentos legales
definitivos e integraciones reales.

El repositorio Git está inicializado sobre la rama `main` y tiene el remoto
`origin` configurado en GitHub.

## Implementado

- Proyecto Angular 22 standalone con TypeScript, pnpm, Tailwind CSS 4 y SCSS.
- Frontend Angular unificado en `frontend/` y backend NestJS en `backend/`,
  coordinados desde el workspace pnpm de la raíz.
- Node.js 24.19.0 fijado en `.nvmrc` y pnpm 11.20.0 fijado en `package.json`.
- SSR con Express, hidratación y prerender.
- TypeScript estricto y validación estricta de templates Angular.
- Landing responsive con navegación, hero, propuesta de valor, experiencias,
  servicios, información de confianza, contacto y footer.
- Ilustración editorial del hero completando todo su lienzo.
- Diez ilustraciones editoriales originales, una por tour, en WebP de
  1122 × 1402 px y con una dirección visual andina coherente.
- Footer compartido en todas las rutas, basado en la referencia aprobada: cuatro
  columnas, bloque legal, estado institucional, redes en preparación y franja
  inferior.
- Hover turquesa de marca en enlaces e iconos sociales.
- Iconos sociales de Remix Icon servidos como recursos locales.
- Recursos de marca, fuentes e imágenes servidos localmente.
- SEO básico: títulos por ruta, metadatos, Open Graph, favicon, manifest y
  `robots.txt`.
- Descripciones y metadatos sociales actualizados por ruta tanto en navegación
  cliente como en el HTML prerenderizado.
- Canales directos de WhatsApp, llamada y correo en portada, sin formulario ni
  captación de datos personales.
- Ficha `/informacion-institucional` con datos del prestador, estado del
  registro, controles previstos y acceso a los borradores documentales.
- Fuente centralizada para incorporar datos oficiales en
  `frontend/src/app/config/agency-profile.ts` sin duplicarlos entre vistas.
- Estado de evaluación visible, sin distintivo oficial, ventas, reservas ni
  captación real.
- Newsletter retirado mientras no exista consentimiento y canal operativo.
- Indexación desactivada mediante `noindex, nofollow`; `robots.txt` permite el
  rastreo para que esa directiva pueda ser observada.
- Libro de Reclamaciones demostrativo con validación local, sin registro real.
- Errores de formularios asociados a sus campos mediante texto, `aria-invalid`
  y `aria-describedby`.
- Foco dirigido al primer campo inválido después de intentar validar cualquiera
  de los formularios demostrativos.
- Navegación interna con skip links, retorno de foco del menú móvil y foco al
  contenido principal después de cambiar de ruta.
- Página 404 propia con estado HTTP 404 real para rutas desconocidas.
- Hero servido como imagen prioritaria detectable por el navegador; imágenes de
  experiencias con carga diferida y dimensiones reservadas.
- Servidor SSR sin exposición de `X-Powered-By`, con encabezados básicos de
  seguridad y caché diferenciada para HTML, bundles versionados y activos.
- Encabezado reutilizable que permanece visible durante el desplazamiento y con
  acceso directo al catálogo en todas las páginas internas.
- Páginas informativas de privacidad, términos y turismo responsable.
- Página `/turismo-responsable` con el texto legal estandarizado de MINCETUR
  contra la ESNNA (artículo 179-A del Código Penal) y los canales de denuncia
  oficiales (Línea 1818, Línea 100, emergencias 105 y
  `prevencionesnna@mincetur.gob.pe`); el afiche oficial gráfico se integrará
  cuando lo proporcione la autoridad competente.
- Servidor de desarrollo escuchando en `0.0.0.0` para pruebas dentro de la red
  local.
- Backend NestJS mínimo incorporado al workspace con Prisma/PostgreSQL, health
  check y contratos validados para contacto y reclamaciones.
- Códigos públicos no secuenciales y registro de versión/fecha de aceptación de
  privacidad preparados para las futuras recepciones.
- Frontera HTTP tipada del frontend, proxy local `/api` y PostgreSQL de
  desarrollo preparados; los envíos permanecen desactivados explícitamente.
- Identidad legal, RUC, representante, partida, actividad y domicilio fiscal
  incorporados desde la Ficha RUC del 10 de agosto de 2026.
- Estado tributario activo visible en la ficha, el footer y los borradores
  legales, sin confundirlo con una habilitación comercial.
- Correo general `kusiqumir@gmail.com` y número 908 990 666 para llamadas y
  WhatsApp incorporados por confirmación del titular; los contactos personales
  de SUNAT no se publican como canales oficiales.
- Catálogo confirmado de 10 tours migrado a PostgreSQL mediante un seed
  idempotente que no crea administradores, testimonios ni elimina otros datos.
- Endpoints públicos `GET /api/v1/tours` y `GET /api/v1/tours/:slug`, con
  listado resumido y detalle completo.
- Rutas Angular `/tours` y `/tours/:slug` con loading, vacío, error, detalle,
  itinerarios, precios, inclusiones, requisitos y consulta por WhatsApp.
- Estados de error recuperables mediante reintento sin recargar la aplicación en
  portada, catálogo y ficha de tour.
- Consulta de WhatsApp contextualizada con el nombre y código del tour,
  categorías legibles, texto alternativo procedente del catálogo y metadatos
  sociales dinámicos.
- Portada reestructurada para mostrar cuatro tours destacados desde la API y
  mantener el acceso al catálogo completo de 10 experiencias.
- Tarjeta de tour reutilizable entre portada y catálogo; cada ficha apunta a su
  propio recurso editorial local, cuenta con texto alternativo descriptivo y
  conserva el estilo original de imagen completa con contenido superpuesto.
- Precios referenciales expresados en soles peruanos y presentados con el símbolo
  `S/` en tarjetas y fichas completas.
- Catálogo con búsqueda tolerante a tildes, filtros accesibles por categoría,
  contador de resultados y recuperación clara cuando no existen coincidencias.
- Esqueletos reutilizables en portada y catálogo para reservar el espacio de las
  tarjetas y comunicar la carga sin saltos visuales.
- Fichas de tour con ruta de navegación y bloque inicial de precio/consulta por
  WhatsApp; la acción permanece informativa y no inicia una reserva.
- Catálogo clasificado desde la base de datos como tour propio o de terceros:
  City Tour Cusco, Valle VIP, Montaña de 7 Colores y Laguna Humantay son
  experiencias propias; las otras seis rutas se mantienen visibles como tours
  de terceros, sin publicar aliados u operadores no confirmados.
- El tour `valle-sagrado` conserva su slug estable y se presenta públicamente
  como Valle VIP en el catálogo, ficha, footer y metadatos SEO.
- Contenido completo del seed y enums públicos del catálogo normalizados al
  español; los slugs, códigos y nombres propios comerciales permanecen estables.
- `pnpm start` inicia conjuntamente API y frontend para evitar un catálogo vacío
  por ejecutar solo Angular.
- Sistema visual reforzado con tokens semánticos de acción y contraste WCAG AA;
  las tarjetas mantienen su composición editorial original.
- Script productivo de NestJS alineado con la salida real de compilación
  `dist/main.js`.
- Overrides compatibles de `multer`, `body-parser` y `qs` eliminan las
  vulnerabilidades altas detectadas sin migrar versiones mayores del stack.
- Paginación opcional y validación de slug en los endpoints públicos de tours;
  filtro global de excepciones con logger y mapeo de errores Prisma.
- Build de backend limpio con `tsconfig.build.json` y salida `dist/main.js`;
  `@types/express` como dependencia de desarrollo para el filtro.
- Conteos de la portada (tours, propios, terceros) derivados del catálogo
  cargado; feedback del Libro de Reclamaciones anunciado solo con mensaje.

## Rutas actuales

| Ruta                         | Propósito               | Estado                                    |
| ---------------------------- | ----------------------- | ----------------------------------------- |
| `/`                          | Landing principal       | Implementada                              |
| `/tours`                     | Catálogo de 10 tours    | Implementada; consulta informativa        |
| `/tours/:slug`               | Ficha completa del tour | Implementada; reservas desactivadas       |
| `/informacion-institucional` | Ficha del canal digital | Implementada; falta constancia turística |
| `/privacidad`                | Borrador de privacidad  | Requiere datos y revisión legal           |
| `/terminos`                  | Borrador de términos    | Requiere políticas comerciales reales     |
| `/turismo-responsable`       | Compromiso ESNNA        | Texto oficial y canales publicados; falta afiche gráfico y suscripción |
| `/libro-de-reclamaciones`    | Formulario demostrativo | Requiere backend y flujo legal completo   |
| `/**`                        | Página no encontrada    | HTTP 404 mediante SSR                     |

Se prerenderizan seis rutas institucionales. El catálogo y sus fichas se cargan
en cliente durante la evaluación para no depender de PostgreSQL en el build; la
ruta comodín se resuelve mediante SSR para devolver HTTP 404.

## Verificación técnica más reciente

- `pnpm test:ci`: 39 pruebas superadas en 16 archivos.
- `pnpm build`: finalizado correctamente, sin errores ni advertencias.
- Backend: lint limpio, 8 pruebas superadas, schema Prisma válido y build NestJS
  correcto hacia `dist/main.js`.
- Las 10 rutas de imágenes de tours son únicas y responden HTTP 200 desde el
  servidor de desarrollo.
- Seis rutas prerenderizadas.
- Tamaño inicial estimado del navegador: 86.36 kB.
- Contraste de texto y acciones principales verificado mediante cálculo: las
  combinaciones revisadas superan WCAG AA (mínimo medido 4.97:1).
- Jade de marca aclarado por decisión del titular a `#00B8B7` (token único en
  `_tokens.scss`); el contraste sobre el footer oscuro sube a ~4.9:1.
- Botones primarios en jade con texto `--kq-ink` (contraste AA) y token nuevo
  `$teal-hover`; las superficies suaves usan un tinte jade pálido `#E0F5F4`
  que deja el jade pleno para botones, iconos y acentos.
- Iconos Remix servidos localmente en `public/assets/remixicon/` aplicados en
  pasos, compliance, tarjetas de servicios, FAQ, flechas de CTA y canales de
  contacto (WhatsApp, llamadas y correo con badges propios y focus visible);
  las tarjetas de contacto ganaron icono por canal y microacciones con flecha.
- Ficha RUC del 14 de agosto de 2026 contrastada: estado ACTIVO, domicilio
  Habido; se retiraron los textos de baja provisional manteniendo la operación
  comercial desactivada hasta la constancia turística.
- `/turismo-responsable` muestra el texto legal estandarizado de MINCETUR contra
  la ESNNA (artículo 179-A del Código Penal) y los canales de denuncia oficiales;
  la página declara que el afiche gráfico y la suscripción del Código de
  Conducta aún deben ser proporcionados por el titular ante GERCETUR.
- `scripts/dev.mjs` corregido: compila y ejecuta `dist/main.js` y usa el correo
  placeholder `contacto@example.com` como valor por defecto.
- DOM prerenderizado de las seis rutas verificado: un `h1` y un `main` por ruta,
  footer presente, sin IDs duplicados, imágenes sin `alt` ni enlaces sin nombre.
- Auditoría de dependencias de producción: las vulnerabilidades altas quedaron
  corregidas; permanecen 3 moderadas transitivas que requieren una migración
  dedicada de NestJS 10 a 11 y `file-type` 20 a una versión compatible.
- Prueba directa del servidor: rutas públicas con HTTP 200 y ruta desconocida
  con HTTP 404.
- Catálogo y ficha de tour revisados visualmente con Firefox en escritorio
  (1440 px) y móvil (500 px); imágenes, controles, jerarquía y CTA respondieron
  correctamente.
- La migración `20260812140000_tour_operation_type` y el seed se aplicaron en
  PostgreSQL local; la API respondió los 10 tours con su tipo correcto y Valle
  VIP con metadatos actualizados.

Estos resultados describen la última revisión realizada. Hay que volver a
ejecutar las verificaciones después de modificar código o dependencias.

## Datos y decisiones pendientes del propietario

- Dirección pública de atención (distinta del domicilio fiscal, si corresponde).
- Días y horas exactos del horario de oficina.
- Enlaces reales de Facebook, Instagram, YouTube y TikTok.
- Constancia de inscripción vigente ante GERCETUR/MINCETUR.
- Autorización para mostrar el distintivo oficial, si corresponde.
- Suscripción del Código de Conducta ESNNA ante GERCETUR y afiche oficial en
  versión gráfica (la web ya muestra el texto legal y los canales de denuncia).
- Políticas reales de reservas, pagos, cambios, cancelaciones y reembolsos.
- Responsable de privacidad y canal para ejercer derechos sobre datos.
- Fotografías reales y permisos de uso de imagen.
- Proveedor de hosting, dominio final y correo transaccional.

La modalidad operativa ya fue confirmada por el titular: será exclusivamente
digital y corresponde preparar la declaración jurada del Anexo II.

Esta modalidad ya se muestra en la portada, la ficha institucional, los
borradores legales y el Libro de Reclamaciones demostrativo. La dirección se
presenta como dirección de contacto para asistencia y no como oficina física.

La clasificación también fue confirmada: minorista y operador de turismo. La
web distingue los tours propios de los prestados por terceros. No existen aún
aliados directos confirmados para las seis rutas de terceros, por lo que no se
publican nombres, logos ni licencias; el operador real se valida e identifica en
cualquier propuesta antes de contratar.

## Bloqueos para producción comercial

- Falta la constancia de inscripción ante GERCETUR/MINCETUR y la autorización
  para el distintivo; el RUC ya figura activo en la Ficha RUC del 14 de agosto
  de 2026.
- Los formularios de contacto permanecen retirados; el backend de recepción está
  preparado pero desconectado hasta aprobar privacidad, correo y operación.
- El Libro de Reclamaciones no genera número de hoja, constancia, copia ni
  entrega el caso a un responsable.
- No existe todavía un flujo real de reservas o pagos.
- Los borradores legales ya contienen la identidad verificada, pero faltan
  decisiones operativas y aprobación profesional.
- No se ha configurado analítica con consentimiento ni una política de cookies.
- El correo general, teléfono y WhatsApp están confirmados; falta precisar el
  horario y confirmar los perfiles sociales.
- No debe mostrarse un número o distintivo de licencia ficticio.
- Canonical, `og:url`, imagen social absoluta y sitemap permanecen pendientes
  hasta definir el dominio y habilitar indexación.
- Falta desplegar sobre el dominio definitivo, definir la política CSP del
  hosting y validar accesibilidad, rendimiento y comportamiento en dispositivos
  y navegadores reales.
- Antes de una salida comercial debe planificarse y probarse la migración de
  NestJS 10 a 11 para cerrar los tres avisos moderados restantes sin forzar
  dependencias mayores incompatibles.

Consulta el detalle regulatorio en `docs/requisitos-publicacion.md`.

## Próximos pasos recomendados

1. Obtener la constancia de inscripción turística ante GERCETUR/MINCETUR y
   suscribir el Código de Conducta ESNNA para recibir el afiche oficial gráfico
   (el RUC ya figura activo y la web ya muestra el texto legal y los canales).
2. Completar y revisar profesionalmente los documentos legales.
3. Confirmar canales de atención y definir hosting, dominio y correo transaccional.
4. Activar de forma controlada el backend, Libro de Reclamaciones,
   consentimiento y tratamiento de datos.
5. Confirmar los paquetes del proyecto anterior e incorporar sus fichas cuando
   corresponda; mantener reservas desactivadas hasta levantar los bloqueos.
6. Migrar NestJS 10 a 11 en una tarea dedicada y volver a ejecutar la auditoría
   de dependencias.
7. Ejecutar una revisión final de accesibilidad, rendimiento, seguridad, SEO y
   requisitos regulatorios en dispositivos y navegadores reales antes de
   publicar funciones comerciales.

## Cómo reanudar el trabajo

Después de clonar el repositorio:

```bash
nvm install
nvm use
pnpm install --frozen-lockfile
pnpm test:ci
pnpm start
```

Prompt sugerido para una nueva sesión:

> Lee `AGENTS.md`, `README.md`, `docs/ESTADO_PROYECTO.md`,
> `docs/DECISIONES.md` y `docs/requisitos-publicacion.md`. Revisa `git status` y
> los últimos commits. Resume el estado y continúa desde “Próximos pasos” sin
> inventar datos comerciales o legales.
