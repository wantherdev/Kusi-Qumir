---
name: angular-design-system
description: Crea o mantiene un design system Angular: tokens, primitives, componentes compartidos, variantes, documentación y APIs estables. Úsala cuando varias pantallas necesitan consistencia y reutilización real.
---

# Angular Design System

## Objetivo

Construir un conjunto pequeño de primitives y patrones que elimine inconsistencias sin crear un framework interno difícil de mantener.

## Capas

Distingue:

1. tokens;
2. primitives UI;
3. patrones compuestos reutilizables;
4. componentes de dominio;
5. páginas.

No subas componentes de dominio a `shared/ui` solo porque aparecen en dos pantallas del mismo feature.

## Tokens

Centraliza cuando exista consistencia suficiente:

- color semántico;
- typography;
- spacing;
- radius;
- elevation;
- motion;
- breakpoints cuando el stack los modele como tokens.

Prefiere nombres semánticos sobre valores físicos:

```css
--color-text-muted
--color-surface-danger
--space-3
```

Evita tokens como `--gray-437-for-user-card`.

## Component API

Mantén APIs pequeñas y semánticas.

Antes de añadir otro boolean input, pregunta si:

- es una variante real;
- el componente hace demasiado;
- una composición sería más clara.

Evita:

```ts
compact
rounded
small
noPadding
hideIcon
inline
specialMode
```

acumulados en un componente universal.

## Variantes

Modela variantes finitas con union types cuando sea apropiado:

```ts
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
```

No expongas colores arbitrarios si el sistema tiene semántica definida.

## Composición

Prefiere contenido proyectado y primitives composables antes que mega componentes configurados por objetos enormes.

## Headless vs styled

Si el proyecto necesita control visual fuerte, considera primitives headless accesibles. Cuando Angular Aria/CDK ya resuelva interacción compleja, evita reconstruir foco y teclado desde cero sin necesidad.

## Componentes complejos

Para dialogs, menus, comboboxes, tabs, listboxes y similares, trata accesibilidad y teclado como parte de la API, no como mejora posterior.

## CSS

- Evita selectores dependientes de estructuras DOM profundas.
- Mantén estilos de componente cerca del componente.
- No uses `!important` como estrategia estándar.
- Diseña estados hover/focus/disabled/error de forma coherente.

## Documentación

Cada primitive importante debe documentar:

- propósito;
- cuándo usar/no usar;
- inputs/outputs relevantes;
- variantes;
- estados;
- accesibilidad;
- ejemplo mínimo.

No documentes cada implementación interna.

## Testing

Prueba contratos de componentes compartidos con más rigor que componentes de una sola página, porque una regresión tiene radio de impacto mayor.

Cubrir especialmente:

- eventos;
- disabled;
- teclado;
- focus;
- variantes críticas;
- accessible name/role cuando sea relevante.

## Criterio de extracción

No extraigas a design system por apariencia similar solamente. Hazlo cuando exista un patrón estable de semántica, interacción y estilo que varias áreas necesiten mantener igual.
