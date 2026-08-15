# Phuyu

Primitive visual para mostrar las poses oficiales de Phuyu sin acoplar páginas a nombres de
archivo. La fuente maestra permanece en el sistema de marca y la aplicación publica únicamente las
poses WebP que utiliza.

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
