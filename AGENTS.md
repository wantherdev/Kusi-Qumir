# Instrucciones del proyecto para Codex

## Objetivo

Kusi Q’umir es el sitio web de una agencia de viajes ubicada en Cusco, Perú. La
primera entrega es una landing moderna y accesible; después se desarrollará el
sitio comercial completo. La experiencia debe transmitir cercanía, confianza,
identidad cusqueña y turismo responsable.

Antes de modificar el proyecto, lee también:

- `README.md`
- `docs/ESTADO_PROYECTO.md`
- `docs/DECISIONES.md`
- `docs/requisitos-publicacion.md`

## Stack obligatorio

- Angular 22 con componentes standalone.
- TypeScript 6.
- pnpm 11.20.0; no usar npm o yarn para administrar dependencias.
- Node.js 24.19.0, fijado en `.nvmrc`.
- Tailwind CSS 4 para utilidades en plantillas.
- SCSS para tokens, estilos globales y composiciones encapsuladas.
- SSR con Express y prerender de las rutas públicas.

## Comandos de trabajo

```bash
nvm use
pnpm install --frozen-lockfile
pnpm start
pnpm test:ci
pnpm build
pnpm serve:ssr
```

Antes de entregar cambios de código, ejecuta al menos `pnpm test:ci` y
`pnpm build`. No edites artefactos dentro de `dist/` ni dependencias dentro de
`node_modules/`.

## Arquitectura y convenciones

- Las rutas están en `src/app/app.routes.ts` y su estrategia de renderizado en
  `src/app/app.routes.server.ts`.
- Las páginas se cargan de forma diferida desde `src/app/pages/`.
- Los colores de marca viven en `src/styles/_tokens.scss`.
- Los estilos globales, tipografías y componentes compartidos viven en
  `src/styles.scss`.
- Mantén los estilos específicos junto al componente correspondiente.
- No uses `@apply` de Tailwind dentro de Sass.
- Conserva hidratación y compatibilidad SSR: no accedas a `window`, `document`,
  `localStorage` u otras APIs del navegador sin una protección apropiada.
- Prefiere imágenes WebP con una alternativa cuando sea necesario y conserva
  textos alternativos útiles.
- Los iconos de redes sociales provienen de Remix Icon y se sirven localmente.
- Mantén navegación por teclado, estados de foco visibles, HTML semántico y
  soporte para `prefers-reduced-motion`.

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

## Flujo de continuidad

- Consulta `git status` y `git log --oneline -10` antes de comenzar.
- No sobrescribas cambios ajenos o no relacionados.
- Registra decisiones duraderas en `docs/DECISIONES.md`.
- Actualiza `docs/ESTADO_PROYECTO.md` cuando cambien el estado, los bloqueos o
  los próximos pasos.
- No guardes secretos en Git. Documenta únicamente sus nombres en un archivo
  `.env.example` cuando se incorporen variables de entorno.
