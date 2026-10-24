# Estado del proyecto Kusi Q’umir

Última actualización: 24 de octubre de 2026.

Este archivo es el punto de reanudación para una persona o una nueva sesión de
IA. Debe actualizarse después de cada avance importante.

## Verificación y preparación de Pages — 24 de octubre de 2026

- Checkout revisado: `27fb7a1`. Frontend: 53 pruebas aprobadas en 17 archivos después de añadir cobertura del catálogo estático.
- Backend sin cambios: lint, 8 pruebas y build correctos.
- Build SSR y build estático de Pages correctos; siete páginas institucionales prerenderizadas.
- Entorno local: Node 24.22.1 (difiere del 24.19.0 fijado) y pnpm 11.20.0. Sin prueba de integración contra PostgreSQL real.
- El catálogo estático se genera desde `backend/prisma/catalog/tours.json`; diez fichas tienen entrada para navegación directa.
- Subida bloqueada: la integración GitHub rechazó crear el árbol con HTTP 403 (Resource not accessible by integration). No se modificaron ramas remotas.
- En la verificación inicial, Pages estaba activo desde la raíz de gh-pages y mostraba el README. La publicación de la web se traslada al flujo de Actions.
- `.github/workflows/pages.yml` prueba y compila en pull requests y main; publica únicamente `.pages-site/` desde main. El estado de cada publicación queda registrado en Actions y en el entorno github-pages.
- Verificación estática: 347 referencias de recursos existentes, diez entradas de fichas y diez imágenes de catálogo correctas. No se pudo ejecutar la revisión visual en Chromium porque su descarga no produjo un ZIP válido.

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
- Encabezado reutilizable en todas las rutas, incluida la portada, con
  navegación principal responsive, estado activo, cierre con Escape, retorno
  de foco y acceso consistente a catálogo, servicios, ficha institucional y
  canales de atención.
- Páginas informativas de privacidad, términos y turismo responsable.
- Página `/cancelaciones` con la propuesta de política de cancelaciones y
  reembolsos (pendiente de aprobación y revisión legal), enlazada desde
  `/terminos` y el footer.
- Borradores completos de privacidad, términos, cancelaciones y contrato de
  servicios en `recursos/08_*` a `recursos/11_*`, adaptados a la identidad
  verificada y a la modalidad exclusivamente digital (sin declarar registros
  no obtenidos ni usar correos o direcciones no confirmados).
- Borradores legales fusionados: la privacidad incorpora bancos de datos,
  plazos de conservación y cookies; los términos incorporan IGV 0% de
  exportación, moneda, depósitos y fuerza mayor Cusco; las cancelaciones usan
  la escala de penalidades de 45/30/15 días. Los borradores originales
  `01_*` y `02_*` fueron reemplazados por los fusionados.
- Formularios operativos para el registro institucional en `recursos/04_*` a
  `recursos/07_*`: carta y Declaración Jurada ESNNA, Anexo II de agencia
  digital y checklist de entrega en GERCETUR Cusco.
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
- Fundamentos visuales compartidos para altura del encabezado, espaciado de
  página, títulos, textos introductorios, radios, elevación, controles y estados
  de carga/error/vacío; las páginas conservan composiciones propias donde el
  contenido lo requiere.
- Jerarquía visual transversal aplicada a las rutas públicas: estados, datos
  institucionales, cobertura y preparación de tours, documentos legales y
  Libro de Reclamaciones usan encabezados diferenciados, agrupación semántica e
  iconografía complementaria sin depender únicamente del color.
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

| Ruta                         | Propósito                 | Estado                                                                                       |
| ---------------------------- | ------------------------- | -------------------------------------------------------------------------------------------- |
| `/`                          | Landing principal         | Implementada                                                                                 |
| `/tours`                     | Catálogo de 10 tours      | Implementada; consulta informativa                                                           |
| `/tours/:slug`               | Ficha completa del tour   | Implementada; reservas desactivadas                                                          |
| `/informacion-institucional` | Ficha del canal digital   | Implementada; falta constancia turística                                                     |
| `/privacidad`                | Borrador de privacidad    | Ampliado (bancos, cookies, datos sensibles y menores); requiere revisión legal               |
| `/terminos`                  | Borrador de términos      | Ampliado (IGV 0%, depósitos, fuerza mayor, blindaje fase 1); requiere revisión legal         |
| `/cancelaciones`             | Política de cancelaciones | Propuesta escala 45/30/15 días; pendiente de aprobación                                      |
| `/turismo-responsable`       | Compromiso ESNNA          | Texto oficial y canales publicados; falta afiche gráfico y suscripción                       |
| `/libro-de-reclamaciones`    | Formulario demostrativo   | Aviso Anexo II, política, fecha de viaje y declaración jurada; requiere backend y flujo real |
| `/**`                        | Página no encontrada      | HTTP 404 mediante SSR                                                                        |

Se prerenderizan siete rutas institucionales. El catálogo y sus fichas se cargan
en cliente durante la evaluación para no depender de PostgreSQL en el build; la
ruta comodín se resuelve mediante SSR para devolver HTTP 404.

## Verificación técnica más reciente

- `pnpm test:ci`: 52 pruebas superadas en 17 archivos.
- `pnpm build`: finalizado correctamente, sin errores ni advertencias; se
  prerenderizan 7 rutas estáticas.
- Backend: lint limpio, 8 pruebas superadas, schema Prisma válido y build NestJS
  correcto hacia `dist/main.js`.
- Las 10 rutas de imágenes de tours son únicas y responden HTTP 200 desde el
  servidor de desarrollo.
- Siete rutas prerenderizadas.
- Tamaño inicial estimado del navegador: 88.53 kB.
- Contraste de texto y acciones principales verificado mediante cálculo: las
  combinaciones revisadas superan WCAG AA (mínimo medido 4.70:1).
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
- Privacidad y términos ampliados con las secciones de los borradores
  (`recursos/08_*` a `recursos/11_*`) y nueva página `/cancelaciones`
  prerenderizada con la propuesta de política; la ruta queda enlazada desde
  `/terminos` y el footer.
- Borradores legales fusionados desde el proyecto anterior: privacidad con
  bancos de datos, conservación de 5 años y cookies; términos con IGV 0% de
  exportación, depósitos 30–50% y fuerza mayor (art. 1315); cancelaciones con
  escala de penalidades 45/30/15 días; contrato con cláusulas de pago y
  penalidades. Los borradores `01_*` y `02_*` fueron reemplazados.
- `scripts/dev.mjs` corregido: compila y ejecuta `dist/main.js` y usa el correo
  placeholder `contacto@example.com` como valor por defecto.
- Auditoría DOM actualizada sobre las siete rutas prerenderizadas: un `main` y
  un `h1` por ruta, encabezado y footer compartidos, skip link, foco del
  contenido, IDs únicos, imágenes con `alt` y dimensiones, controles con nombre
  accesible y jerarquía de encabezados sin saltos. Todos los enlaces internos
  renderizados responden HTTP 200 al seguir redirecciones.
- Contraste de las combinaciones semánticas principales recalculado tras la
  unificación: mínimo 4.70:1 (`action` sobre `canvas`) y máximo 16.86:1
  (`ink` sobre `canvas`), sin alterar la paleta aprobada.
- Auditoría de dependencias de producción: las vulnerabilidades altas quedaron
  corregidas; permanecen 3 moderadas transitivas que requieren una migración
  dedicada de NestJS 10 a 11 y `file-type` 20 a una versión compatible.
- Prueba directa del servidor: rutas públicas con HTTP 200 y ruta desconocida
  con HTTP 404.
- Catálogo y ficha de tour revisados visualmente con Firefox en escritorio
  (1440 px) y móvil (500 px); imágenes, controles, jerarquía y CTA respondieron
  correctamente.
- Blindaje legal fase 1 verificado: el HTML prerenderizado de
  `/libro-de-reclamaciones` incluye el Aviso del Anexo II y la política de
  atención (15 días hábiles, Indecopi); `/terminos` incluye las cláusulas
  nuevas (cancelación por el proveedor, exactitud de datos, menores, sin
  retracto, enlaces y propiedad intelectual, modificaciones); `/privacidad`
  incluye las secciones de datos sensibles y menores. El footer exhibe el aviso
  del Libro de Reclamaciones en todas las rutas.
- Referente de mercado aplicado (14 de agosto de 2026): el formulario del
  Libro de Reclamaciones añade "Fecha del viaje contratado" y la declaración
  jurada obligatoria (veracidad, titularidad y aceptación de privacidad), la
  política refuerza la nota de campos obligatorios por ley, la precisión de que
  el reclamo no impide otras vías ni es requisito previo ante Indecopi, y la
  privacidad incorpora la confidencialidad de los datos de salud.
- Sistema Phuyu integrado (14 de agosto de 2026): la carpeta corregida con 48
  PNG y manual v1.0 es la fuente maestra. Las cinco poses que usa la web se
  sirven como WebP sin pérdida mediante `app-phuyu` en el proceso y el panel de
  contacto de la portada, la página 404 y el feedback del Libro de
  Reclamaciones; las restantes no se incorporan al directorio público.
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
- Aprobación del titular y revisión legal de las políticas de reservas, pagos,
  cambios, cancelaciones y reembolsos y del Libro de Reclamaciones (borradores
  preparados en `recursos/08_*` a `recursos/12_*`).
- Entrega en Mesa de Partes de GERCETUR de los formularios de registro y ESNNA
  (`recursos/04_*` a `recursos/07_*`) y recepción del afiche oficial gráfico.
- Responsable de privacidad y canal para ejercer derechos sobre datos.
- Pasar a operativo el proceso del Libro de Reclamaciones (hoja, constancia,
  copia y respuesta en 15 días hábiles) con el backend correspondiente, el
  correo específico y los responsables de atención.
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
