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

## Verificación y producción

```bash
pnpm test:ci
pnpm build
pnpm serve:ssr
```

El build se genera en `dist/kusi-qumir/`; el servidor SSR utiliza el puerto `4000`.

En producción, define los dominios públicos permitidos por la protección SSRF de Angular:

```bash
NG_ALLOWED_HOSTS="kusi-qumir.pe,www.kusi-qumir.pe" pnpm serve:ssr
```

El servidor Express aplica encabezados básicos de seguridad y caché diferenciada
para HTML, recursos versionados y activos públicos. Si el despliegue termina en
un hosting estático o CDN, replica esas reglas en la plataforma.

## Modo de evaluación

- Los datos verificables del prestador se centralizan en
  `src/app/config/agency-profile.ts`.
- Los campos sin sustento permanecen vacíos y se muestran como pendientes.
- Todas las rutas incluyen `noindex, nofollow` hasta autorizar la publicación.
- `robots.txt` permite el rastreo para que los buscadores puedan leer la
  directiva `noindex`.
- Las rutas desconocidas muestran una página propia y responden HTTP 404.

## Arquitectura de estilos

- `src/styles/_tokens.scss`: colores funcionales de KQ-DIGITAL-2.1.
- `src/styles.scss`: tipografías, tokens CSS, elementos compartidos y carga de Tailwind.
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
