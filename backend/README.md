# API de Kusi Q’umir

Backend NestJS para el canal digital. En esta etapa incluye:

- salud de aplicación y base de datos;
- recepción futura de solicitudes de contacto;
- recepción futura de hojas de reclamación con código público de seguimiento.
- catálogo público de tours con listado y detalle.

Los endpoints de escritura no deben publicarse ni conectarse al frontend hasta
aprobar la política de privacidad, configurar PostgreSQL persistente y definir el
flujo responsable de correo y atención.

## Desarrollo

```bash
cp .env.example .env
pnpm install --frozen-lockfile
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
pnpm start:dev
```

`start:dev` recompila y arranca la API. Se evita el modo watch del CLI de Nest
porque la comilla del nombre de la carpeta raíz no es escapada correctamente por
esa herramienta en este entorno.

La API escucha en `http://localhost:3000/api/v1`.

El seed es idempotente: actualiza por `slug` los 10 tours confirmados sin borrar
otras tablas ni crear usuarios o testimonios demostrativos.

Endpoints públicos del catálogo:

- `GET /api/v1/tours`
- `GET /api/v1/tours/:slug`
