# Instrucciones del proyecto para Codex

## Objetivo

Kusi Q’umir es el sitio web de una agencia de viajes ubicada en Cusco, Perú. La
primera entrega es una landing moderna y accesible; después se desarrollará el
sitio comercial completo. La experiencia debe transmitir cercanía, confianza,
identidad cusqueña y turismo responsable.

Mantén una aplicación moderna, fácil de entender, probar, desplegar y evolucionar
sin introducir complejidad accidental.

Antes de modificar el proyecto, lee también:

- `README.md`
- `docs/ESTADO_PROYECTO.md`
- `docs/DECISIONES.md`
- `docs/requisitos-publicacion.md`

## Uso de skills

- Usa `.agents/skills/frontend-master-skill/SKILL.md` como skill orquestadora
  cuando una tarea frontend sea transversal: auditoría integral, rediseño amplio
  o feature que combine varias áreas como UX/UI, Angular, testing,
  accesibilidad, SEO, seguridad y performance.
- Para una tarea acotada, carga únicamente la skill Angular especializada que
  corresponda. No cargues la skill maestra junto con varias skills específicas
  si no aporta una coordinación real.
- Para tareas de backend (crear, revisar o alinear módulos, configuraciones o
  pruebas de la API), usa `.agents/skills/nestjs-backend-architecture/SKILL.md`
  como referencia de arquitectura NestJS 10 y Prisma 5.22.
- La skill maestra complementa estas instrucciones; el stack obligatorio, las
  reglas legales, la seguridad y las convenciones de este archivo conservan
  precedencia dentro del proyecto.

## Stack obligatorio

- Angular 22 con componentes standalone.
- TypeScript 6.
- pnpm 11.20.0; no usar npm o yarn para administrar dependencias.
- Node.js 24.19.0, fijado en `.nvmrc`.
- Tailwind CSS 4 para utilidades en plantillas.
- SCSS para tokens, estilos globales y composiciones encapsuladas.
- SSR con Express y prerender de las rutas públicas.
- TypeScript en modo estricto.
- Signals para estado reactivo local y derivado.
- RxJS para streams asíncronos y composición temporal cuando aporte valor.
- Vitest para pruebas unitarias y de componentes.
- Playwright para recorridos E2E críticos cuando exista una suite configurada.
- Backend en `backend/` con NestJS 10, Prisma 5.22 + PostgreSQL, TypeScript
  estricto, validación con class-validator/Joi, seguridad con Helmet y
  throttling, Jest + ts-jest para pruebas y ESLint (typescript-eslint) para
  lint. El build usa `tsconfig.build.json` y emite en `dist/main.js`.

No actualices versiones mayores ni cambies herramientas de pruebas como parte
de una tarea no relacionada.

## Comandos de trabajo

```bash
nvm use
pnpm install --frozen-lockfile
pnpm start
pnpm test:ci
pnpm build
pnpm serve:ssr
```

Para cambios de backend, ejecuta también `pnpm backend:lint`,
`pnpm backend:test` y `pnpm backend:build`; con `pnpm build:all` y
`pnpm test:all` se validan ambas aplicaciones.

Antes de entregar cambios de código, ejecuta al menos `pnpm test:ci` y
`pnpm build`. No edites artefactos dentro de `frontend/dist/`, `backend/dist/`
ni dependencias dentro de `node_modules/`.

## Antes de modificar código

1. Consulta `git status` y `git log --oneline -10`.
2. Lee la documentación de continuidad indicada al inicio de este archivo.
3. Inspecciona `package.json`, `frontend/package.json`,
   `frontend/angular.json`, las rutas y la estructura del feature afectado.
4. Identifica patrones existentes y busca componentes, servicios, stores o
   utilidades reutilizables antes de crear alternativas.
5. Determina qué pruebas protegen actualmente el comportamiento.
6. Haz el cambio mínimo coherente con la arquitectura existente.

## Arquitectura y convenciones

- Las rutas están en `frontend/src/app/app.routes.ts` y su estrategia de
  renderizado en `frontend/src/app/app.routes.server.ts`.
- Las páginas se cargan de forma diferida desde `frontend/src/app/pages/`.
- Los colores de marca viven en `frontend/src/styles/_tokens.scss`.
- Los estilos globales, tipografías y componentes compartidos viven en
  `frontend/src/styles.scss`.
- Mantén los estilos específicos junto al componente correspondiente.
- No uses `@apply` de Tailwind dentro de Sass.
- Organiza el código principalmente por feature o dominio.
- Mantén páginas, UI, dominio y acceso a datos con responsabilidades
  diferenciadas.
- No hagas llamadas HTTP desde componentes puramente visuales.
- No importes internals arbitrarios entre features ni introduzcas dependencias
  circulares.
- Reserva `shared/` para capacidades realmente compartidas.
- Evita `CommonService`, `UtilsService`, God components y God services.
- Prefiere composición a herencia.
- No introduzcas NgRx, Nx u otra capa arquitectónica sin un problema concreto
  que la justifique.
- Conserva hidratación y compatibilidad SSR: no accedas a `window`, `document`,
  `localStorage` u otras APIs del navegador sin una protección apropiada.
- Prefiere imágenes WebP con una alternativa cuando sea necesario y conserva
  textos alternativos útiles.
- Los iconos de redes sociales provienen de Remix Icon y se sirven localmente.
- Mantén navegación por teclado, estados de foco visibles, HTML semántico y
  soporte para `prefers-reduced-motion`.

## Angular moderno y TypeScript

- Usa APIs standalone.
- Prefiere `input()`, `output()` y `model()` en código nuevo cuando sean
  apropiados.
- Prefiere `inject()` cuando encaje con el estilo del repositorio.
- Usa `computed()` para estado derivado.
- Usa `effect()` solo para efectos secundarios reales, no para copiar estado
  derivable.
- Usa control flow moderno (`@if`, `@for`, `@switch`) en código nuevo; en
  `@for`, utiliza una identidad estable cuando exista.
- No uses `any` salvo en una integración externa inevitable y encapsulada.
- Usa `unknown` y narrowing cuando el tipo sea desconocido.
- No uses type assertions para ocultar un diseño de tipos incorrecto.
- Modela estados inválidos fuera del sistema cuando sea razonable.
- Prefiere nombres basados en la intención y el dominio.

## UI, UX y accesibilidad

- Toda pantalla que consuma datos debe considerar los estados aplicables:
  loading, success, empty y error; añade unauthorized, forbidden, offline o
  refreshing cuando el dominio lo requiera.
- Usa HTML semántico, conserva navegación por teclado y foco visible.
- Diseña responsive y prueba contenido largo en móvil, tableta y escritorio.
- No uses hover como único mecanismo para revelar información esencial.
- Los mensajes de error deben explicar el problema y la acción siguiente.

## Dirección visual

- Respetar el manual de marca y los recursos aprobados incluidos en
  `Kusi_Qumir_Sistema_Marca_Digital_v2.1/`.
- Mantener la estética editorial andina ya establecida: moderna, humana,
  luminosa y sin clichés visuales excesivos.
- Preservar la estructura actual del footer oscuro, su jerarquía de columnas y
  el color turquesa de marca como hover de enlaces e iconos sociales.
- Las nuevas imágenes deben integrarse con el estilo de las ilustraciones
  existentes y ocupar correctamente su contenedor, sin espacios vacíos
  accidentales.
- Probar los cambios en móvil, tableta y escritorio.

## SEO

Para rutas públicas indexables:

- Evalúa SSR, SSG o renderizado híbrido.
- Define título y descripción específicos.
- Controla canonical e indexación.
- Usa enlaces HTML rastreables.
- Añade datos estructurados solo cuando representen contenido visible y real.
- No bloquees accidentalmente recursos o contenido esencial a los crawlers.

Las rutas privadas no deben optimizarse para indexación pública. Mientras la
web permanezca en evaluación institucional, conserva el bloqueo de indexación
documentado en el estado del proyecto.

## Seguridad

- No almacenes secretos reales en el frontend.
- No uses APIs `bypassSecurityTrust...` sin justificación explícita y revisión
  de riesgo.
- No insertes HTML arbitrario proporcionado por usuarios.
- Los guards de Angular no sustituyen la autorización del backend.
- No registres tokens, credenciales ni datos personales en consola o
  telemetría.

## Reglas comerciales y legales

- Nunca inventes ni publiques RUC, razón social, número de licencia, constancia
  GERCETUR/MINCETUR, dirección, teléfono, correo o perfiles sociales.
- No afirmar que Kusi Q’umir es una agencia registrada hasta recibir una
  constancia vigente y autorización para usar el distintivo correspondiente.
- Los textos actuales de privacidad y términos son borradores informativos; no
  deben presentarse como documentos finales sin datos reales y revisión legal.
- No activar captación de datos, analítica, newsletter, pagos, reservas ni el
  Libro de Reclamaciones hasta contar con consentimiento, canales oficiales,
  seguridad, backend y responsables definidos.
- Mantener visible el estado demostrativo de los formularios mientras no exista
  una integración real.
- Antes de implementar requisitos regulatorios, verificar fuentes oficiales
  vigentes de MINCETUR, GERCETUR Cusco, INDECOPI y la Autoridad Nacional de
  Protección de Datos Personales.

## Pruebas y validación

Añade pruebas cuando el cambio introduzca comportamiento o corrija un bug.
Prioriza:

1. Funciones puras y dominio con pruebas unitarias.
2. Componentes con pruebas de comportamiento DOM.
3. Acceso a datos con HTTP testing.
4. Navegación crítica con pruebas de router.
5. Recorridos de negocio críticos con E2E.

No escribas pruebas vacías de valor solo para aumentar cobertura. Detecta
siempre los scripts reales de `package.json`; no inventes comandos. Si una suite
completa es demasiado costosa, ejecuta primero pruebas focalizadas e informa
qué validaciones quedan pendientes.

## Definition of Done

Una tarea termina cuando, según corresponda:

- El comportamiento solicitado funciona.
- Los estados relevantes de la interfaz están cubiertos.
- No se introducen errores de TypeScript.
- Las pruebas afectadas y el build de producción pasan.
- Se mantiene la accesibilidad básica.
- No hay regresiones SEO en rutas públicas.
- No existe una degradación evidente de rendimiento.
- No se añadieron dependencias sin justificación.
- El diff es más simple o, al menos, no más complejo de lo necesario.

## Revisión de código

Prioriza hallazgos por impacto:

1. Bugs y pérdida de datos.
2. Vulnerabilidades y exposición de datos.
3. Regresiones funcionales.
4. Problemas de accesibilidad que bloqueen el uso.
5. Problemas SEO en páginas públicas.
6. Degradaciones significativas de rendimiento.
7. Acoplamiento y deuda arquitectónica.
8. Pruebas insuficientes.
9. Estilo menor.

No conviertas preferencias cosméticas en bloqueos si el código es correcto y
consistente con el repositorio.

## Flujo de continuidad

- No sobrescribas cambios ajenos o no relacionados.
- Registra decisiones duraderas en `docs/DECISIONES.md`.
- Actualiza `docs/ESTADO_PROYECTO.md` cuando cambien el estado, los bloqueos o
  los próximos pasos.
- No guardes secretos en Git. Documenta únicamente sus nombres en un archivo
  `.env.example` cuando se incorporen variables de entorno.
