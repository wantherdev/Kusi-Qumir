---
name: angular-accessibility
description: Implementa o audita accesibilidad en Angular según WCAG 2.2 AA. Úsala para semántica, teclado, foco, formularios, dialogs, ARIA, lectores de pantalla y pruebas a11y.
---

# Angular Accessibility

## Objetivo

Apuntar a WCAG 2.2 nivel AA para interfaces de producto salvo una política de conformidad más estricta del proyecto.

## HTML primero

Usa elementos nativos antes de ARIA.

Preferir:

```html
<button type="button">Guardar</button>
```

frente a un `div` con roles y listeners reconstruidos manualmente.

ARIA complementa semántica; no repara automáticamente una interacción incorrecta.

## Teclado

Todo control interactivo debe poder usarse sin ratón.

Verifica:

- Tab/Shift+Tab;
- Enter/Space cuando corresponda;
- Escape para overlays cuando el patrón lo requiera;
- flechas para widgets cuyo patrón ARIA lo establece;
- ausencia de keyboard traps.

No añadas `tabindex="0"` a contenido no interactivo solo para hacerlo “accesible”.

## Foco

- Mantén indicador visible.
- No elimines outline sin reemplazo equivalente.
- Tras abrir dialogs, mueve foco según el patrón usado.
- Tras cerrar overlays, devuelve foco de forma predecible.
- Tras navegación o cambios grandes, evalúa si el usuario necesita anuncio o gestión de foco.

## Target size

Para WCAG 2.2 AA, diseña targets de pointer al menos 24x24 CSS px o asegúrate de cumplir las excepciones de spacing/equivalencia aplicables. En productos táctiles suele ser mejor usar targets mayores por usabilidad.

## Formularios

Cada control necesita nombre accesible.

- Usa `<label for>` o asociación equivalente.
- Mantén el label visible cuando sea útil.
- Conecta help/error con `aria-describedby` cuando corresponda.
- Indica estado inválido de forma programática.
- No comuniques error solo por color.
- Permite paste y password managers salvo restricción demostrable.

## Icon buttons

Un botón solo con icono necesita accessible name:

```html
<button type="button" aria-label="Cerrar">...</button>
```

Si el texto visible ya describe la acción, evita duplicar ARIA innecesario.

## Headings

Mantén una jerarquía útil para navegación por lectores de pantalla. No elijas `h1-h6` por tamaño visual; usa CSS para apariencia.

## Landmarks

Usa semántica estructural apropiada: `header`, `nav`, `main`, `aside`, `footer` cuando representen esas regiones.

## Imágenes

- Imagen informativa → alt que comunique la función o contenido necesario.
- Imagen decorativa → `alt=""`.
- No repitas texto adyacente innecesariamente en alt.

## Color

No uses color como único indicador de estado. Comprueba contraste según WCAG aplicable.

## Motion

Respeta preferencias de reducción de movimiento. Evita animaciones que causen pérdida de contexto o dificulten interacción.

## Components complejos

Para tabs, listbox, menu, dialog, combobox y patrones similares, considera Angular Aria/CDK u otra primitive accesible ya adoptada por el proyecto antes de implementar interacción desde cero.

## Live regions

Usa anuncios para cambios realmente importantes que no reciben foco, como resultado de una acción asíncrona. No conviertas cada cambio de UI en una live region porque genera ruido.

## Testing

Combina:

- lint rules de template;
- unit/component tests para roles, labels y estados;
- Playwright para navegación por teclado;
- scanner automático como axe cuando exista;
- revisión manual de flujo de foco y lector de pantalla en journeys críticos.

Las herramientas automáticas no detectan todos los problemas WCAG.

## Auditoría

Prioriza:

1. controles imposibles de usar con teclado;
2. dialogs/menus con foco roto;
3. inputs sin label;
4. nombres/roles/estados incorrectos;
5. orden de foco ilógico;
6. contraste y uso exclusivo de color;
7. headings/landmarks;
8. mejoras menores de announcements.

Al reportar un problema indica el impacto para el usuario y una corrección concreta.
