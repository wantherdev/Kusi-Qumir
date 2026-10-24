# Phuyu

Primitive visual para mostrar las poses oficiales de Phuyu sin acoplar páginas a nombres de
archivo. La ilustración aprobada por el titular el 24 de octubre de 2026 procede de la página City Tour
del PDF `Kusi_Qumir_Tours_Diarios.pdf` (versión 2). Se publica como `phuyu-official.webp`,
sin pérdida y con transparencia. Sustituye visualmente a las poses anteriores: todos los
slots semánticos comparten esta imagen hasta aprobar nuevas poses. No se añaden apariciones.

## Uso

```html
<app-phuyu pose="welcome" size="md" />
```

Inputs:

- `pose`: pose semántica obligatoria.
- `size`: `xs`, `sm`, `md`, `lg` o `xl`.
- `decorative`: `true` por defecto; genera `alt=""` y `aria-hidden="true"`.
- `alt`: descripción requerida por contenido cuando `decorative` es `false`.
- `priority`: usa carga eager y `fetchpriority="high"`; solo corresponde sobre el primer viewport.

No debe usarse como elemento flotante permanente ni como sustituto del contenido HTML. Las poses
que aparecen después del primer viewport conservan carga diferida.
