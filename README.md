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

## Catálogo conectado a Supabase

La compilación Pages consulta los tours activos de Supabase mediante la Data
API, usando solo la clave pública `sb_publishable_…` definida en
`frontend/src/app/deployment.config.pages.ts`. No contiene credenciales de
PostgreSQL ni claves de servicio. El modo SSR/desarrollo conserva la API NestJS.

La migración remota `public_read_active_tour_catalog` concede lectura por
columnas y una política RLS `active = true` a `anon` y `authenticated`. No
concede escrituras a visitantes. `ContactRequest` y `Claim` siguen sin acceso
público. El panel `/admin` incorpora permisos administrativos independientes.

Los precios y el contenido se consultan al cargar o reintentar, sin recurrir
a una copia estática cuando Supabase falla. El acceso directo en Pages a slugs
nuevos utiliza la página 404 cliente hasta regenerar sus entradas con un
despliegue. El panel admite URLs HTTPS para imágenes alojadas externamente y rutas de
recursos locales existentes. No incluye todavía subida de archivos.

La base se inicializó mediante `kusi_qumir_initial_backend_schema`, con el
SQL de las cuatro migraciones Prisma existentes, y contiene los diez tours.
Antes de ejecutar Prisma Migrate contra esta base, se deben marcar esas cuatro
migraciones como aplicadas con `prisma migrate resolve --applied <nombre>`;
no ejecutar `migrate reset`, ni aplicar de nuevo el esquema inicial. La
conexión Prisma/NestJS sigue pendiente.

## Panel administrativo de tours (rama de desarrollo)

La vista Pages/Supabase incorpora `/admin`, con inicio de sesión por correo y
contraseña, listado de tours publicados y borradores, creación de tours y
cambio de visibilidad. La versión SSR/local sin configuración Supabase muestra
el estado sin conexión configurada. Los nuevos tours siempre se insertan como
borradores. El formulario incluye precios PEN, imagen por URL, itinerario por
días, inclusiones, exclusiones, requisitos y recomendaciones. No edita el
contenido de tours existentes ni elimina registros. Una publicación cambia el
catálogo conectado a Supabase; la web principal mantiene su catálogo estático
hasta integrar esta rama. No habilita reservas, pagos ni formularios públicos.

Se usa `@supabase/supabase-js` con versión exacta y sesión en `sessionStorage`
(por pestaña). La clave pública no otorga permisos de escritura. La migración
remota `restricted_tour_administration` crea `TourAdministrator`, con RLS de
lectura exclusiva de la membresía propia y sin escritura desde el cliente.
Solo miembros asignados por el propietario pueden leer borradores, insertar
tours inactivos y actualizar `active`/`updatedAt`. No se conceden DELETE ni
edición de otros campos. No se confía en `user_metadata`. La autorización real
se aplica en PostgreSQL, además de comprobarla en el panel.

Para activar el primer administrador:

1. En el proyecto Supabase, abrir Authentication → Users → Add user → Create
   new user. El titular debe introducir su correo y contraseña directamente
   allí; no compartir la contraseña en chats ni guardarla en Git.
2. Copiar el UID del usuario. El propietario del proyecto puede asignarlo desde
   SQL Editor con la consulta siguiente (reemplazar el marcador por ese UID):

```sql
insert into public."TourAdministrator" (user_id)
values ('REEMPLAZAR-POR-EL-UID-DEL-USUARIO'::uuid)
on conflict (user_id) do nothing;
```

3. Abrir `/admin` en la vista previa e ingresar con esa cuenta. Una cuenta
   autenticada sin membresía muestra su UID y el estado de acceso pendiente.

Para revocar el permiso, el propietario elimina esa membresía desde SQL
Editor; las siguientes consultas y escrituras quedan bloqueadas por RLS.
La tabla depende de `auth.users` (Supabase), por lo que no forma parte del
esquema local Prisma. No se debe ejecutar este SQL contra la base local ni
reinicializar el esquema existente. Las tres migraciones remotas de Supabase
son el historial de los permisos; conservar también la advertencia de baseline
Prisma anterior. Mantener esta rama sin fusionar hasta autorizar su integración.
