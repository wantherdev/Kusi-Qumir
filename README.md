# Kusi Q’umir — Frontend institucional

Frontend institucional de experiencias turísticas en Cusco construido con Angular 22 standalone, pnpm, Tailwind CSS 4, SCSS y renderizado híbrido con prerender.

La versión actual está preparada para evaluación institucional. No recibe datos,
reclamos, reservas ni pagos reales y no afirma que la agencia ya se encuentre
registrada.

## Requisitos

- nvm 0.40.6
- Node.js 24 LTS (fijado en `.nvmrc`)
- pnpm 11

## Desarrollo

```bash
nvm use
pnpm install --frozen-lockfile
pnpm start
```

Abrir `http://localhost:4200`.

`pnpm start` compila e inicia la API en el puerto `3000` y el frontend en el
puerto `4200`. PostgreSQL debe estar disponible; puede iniciarse previamente con
`pnpm db:start` cuando Docker esté configurado.

## Verificación y producción

```bash
pnpm test:ci
pnpm build
pnpm serve:ssr
```

El build se genera en `frontend/dist/kusi-qumir/`; el servidor SSR utiliza el
puerto `4000`.

En producción, define los dominios públicos permitidos por la protección SSRF de Angular:

```bash
NG_ALLOWED_HOSTS="kusi-qumir.pe,www.kusi-qumir.pe" pnpm serve:ssr
```

El servidor Express aplica encabezados básicos de seguridad y caché diferenciada
para HTML, recursos versionados y activos públicos. Si el despliegue termina en
un hosting estático o CDN, replica esas reglas en la plataforma.

## Backend en preparación

La API propia vive en `backend/` y utiliza NestJS, Prisma y PostgreSQL. Por el
momento los formularios públicos permanecen desacoplados hasta aprobar las
políticas, configurar una base persistente y definir el flujo responsable de
atención. El catálogo de tours sí consume endpoints públicos de solo lectura.

```bash
pnpm backend:build
pnpm backend:lint
pnpm backend:test
pnpm backend:start
pnpm --dir backend prisma:seed
```

Para desarrollo local puede iniciarse PostgreSQL con `pnpm db:start`. El
frontend ya contiene la frontera HTTP tipada y el proxy `/api`, pero el
interruptor de envíos permanece apagado hasta aprobar privacidad y operación.

## Modo de evaluación

- Los datos verificables del prestador se centralizan en
  `frontend/src/app/config/agency-profile.ts`.
- Los campos sin sustento permanecen vacíos y se muestran como pendientes.
- Todas las rutas incluyen `noindex, nofollow` hasta autorizar la publicación.
- `robots.txt` permite el rastreo para que los buscadores puedan leer la
  directiva `noindex`.
- Las rutas desconocidas muestran una página propia y responden HTTP 404.

## Arquitectura de estilos

- `frontend/src/styles/_tokens.scss`: colores funcionales de KQ-DIGITAL-2.1.
- `frontend/src/styles.scss`: tipografías, tokens CSS, elementos compartidos y carga de Tailwind.
- `*.component.scss`: composiciones editoriales encapsuladas.
- Tailwind: utilidades directamente en las plantillas; no se usa `@apply` dentro de Sass.

## Antes de publicar

Revisar [docs/requisitos-publicacion.md](docs/requisitos-publicacion.md). La landing no debe aceptar datos, pagos o reclamos reales hasta completar los canales correspondientes.

## Continuidad del proyecto

Para continuar el trabajo desde otra computadora o una nueva sesión de Codex,
leer en este orden:

1. [AGENTS.md](AGENTS.md)
2. [docs/ESTADO_PROYECTO.md](docs/ESTADO_PROYECTO.md)
3. [docs/DECISIONES.md](docs/DECISIONES.md)
4. [docs/requisitos-publicacion.md](docs/requisitos-publicacion.md)

Después de cada avance importante, actualizar el estado y las decisiones antes
de hacer commit y push.

## Vista estática en GitHub Pages

El flujo `.github/workflows/pages.yml` ejecuta pruebas y compila desde `main`,
y publica únicamente `.pages-site/`. En Settings → Pages se debe seleccionar
GitHub Actions como fuente. La URL prevista es
`https://wantherdev.github.io/Kusi-Qumir/`.

`pnpm build:pages` permite reproducir el build localmente. Esta variante incluye
una instantánea de los 10 tours del catálogo confirmado y no necesita API,
PostgreSQL ni servidor Node. Cada ficha tiene un archivo de entrada para admitir
acceso directo y recargas. Los cambios del catálogo se publican al ejecutar de
nuevo el flujo desde el código actualizado.

Se conservan `noindex`, el estado de evaluación y los formularios desactivados.
Los archivos compilados no se guardan en Git ni se publica el contenido de
`docs/`, recursos internos o backend. El build SSR habitual sigue disponible
mediante `pnpm build`.

Para otra ruta de publicación: `PAGES_BASE_PATH=/otra-ruta/ pnpm build:pages`.

## Lanzamiento integrado

La publicación de Pages incluye `lanzamiento/`: hasta el **1 de noviembre de
2026, 10:00 a. m. (Perú)** las entradas oficiales muestran la cuenta regresiva.
Al llegar a cero se abre automáticamente la web; las visitas posteriores ven
la web directamente. No hace falta ejecutar Actions de nuevo a esa hora.

La fecha se configura en `frontend/public/lanzamiento/launch-config.mjs`.
El cambio depende de JavaScript y del reloj del dispositivo, no constituye
una restricción de acceso. Para publicar en la raíz de un dominio, usar
`PAGES_BASE_PATH=/ pnpm build:pages`. Los formularios y reservas conservan
su estado actual de evaluación.
