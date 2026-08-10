---
name: angular-ui-ux
description: Diseña, implementa o revisa UI/UX en aplicaciones Angular. Úsala para layout, responsive, formularios, estados, flujos, interacción, jerarquía visual y usabilidad; no sustituye una auditoría específica WCAG o SEO.
---

# Angular UI/UX

## Objetivo

Crear interfaces claras y eficientes que comuniquen estado, jerarquía y próxima acción sin depender de conocimiento implícito del usuario.

## Antes de diseñar

Identifica:

- usuario y tarea principal;
- contexto de uso;
- información necesaria para decidir;
- acción primaria;
- acciones secundarias;
- errores previsibles;
- estados vacíos y de carga;
- restricciones mobile/desktop.

No empieces por componentes visuales si el flujo aún es ambiguo.

## Jerarquía

Cada pantalla debe responder rápidamente:

1. ¿Dónde estoy?
2. ¿Qué información importa?
3. ¿Qué puedo hacer?
4. ¿Qué ocurrió después de una acción?

Evita múltiples CTAs visualmente equivalentes si existe una acción primaria clara.

## Layout

- Agrupa elementos por tarea y significado.
- Evita densidad innecesaria.
- Mantén alineaciones y spacing consistentes.
- Optimiza primero para escaneo visual.
- No sacrifiques legibilidad por mostrar más datos above-the-fold.

## Responsive

Diseña comportamiento, no solo breakpoints.

Evalúa:

- columnas que pasan a stack;
- tablas que necesitan priorización, scroll o vista alternativa;
- barras de acciones;
- navegación;
- modales en pantallas pequeñas;
- contenido largo e internacionalización.

No ocultes funcionalidad esencial en mobile solo porque no cabe.

## Estados

Para datos remotos diseña explícitamente:

- initial/loading;
- loaded;
- empty;
- error;
- refreshing;
- partial data cuando aplique.

Un spinner indefinido sin contexto suele ser peor que un skeleton o mensaje que preserve estructura.

## Empty states

Un empty state debe explicar qué significa la ausencia y, cuando exista una siguiente acción razonable, ofrecerla.

No uses mensajes genéricos como “No data”.

## Errores

Un buen error responde:

- qué no pudo completarse;
- si los datos del usuario siguen seguros;
- qué puede intentar ahora.

No culpes al usuario con lenguaje técnico.

## Feedback

Toda acción relevante debe producir feedback proporcional:

- estado pending;
- confirmación;
- error recuperable;
- actualización visible del resultado.

Evita toasts para información que el usuario debe consultar durante más tiempo; usa estado persistente en la interfaz cuando corresponda.

## Acciones destructivas

No añadas confirm dialogs a cada acción. Úsalos cuando el coste de error sea alto o difícil de revertir.

Cuando sea posible, preferir undo sobre confirmación previa para acciones reversibles.

## Formularios

- Labels visibles y persistentes.
- Ayuda contextual antes de que ocurra el error cuando la regla no es obvia.
- Validación clara y cercana al campo.
- Preserva datos tras errores de servidor.
- No uses placeholder como sustituto del label.
- Usa tipos de input y autocomplete apropiados.
- No impidas pegar contraseñas/códigos sin una razón de seguridad demostrable.

## Tablas y datos densos

Prioriza:

- orden y filtros que representen tareas reales;
- columnas esenciales;
- alineación numérica;
- estados y acciones previsibles;
- navegación por teclado cuando la tabla sea interactiva.

No conviertas una tabla en un dashboard de iconos ambiguos.

## Navegación

La ubicación actual debe ser clara. Mantén rutas y breadcrumbs cuando aporten orientación real.

No uses modales para flujos largos que merecen una página navegable y compartible.

## Microcopy

Prefiere verbos específicos:

- `Guardar cambios`
- `Enviar invitación`
- `Eliminar usuario`

frente a:

- `Aceptar`
- `Continuar`
- `Sí`

cuando el significado dependa demasiado del contexto.

## Motion

La animación debe comunicar relación, continuidad o feedback. No añadas movimiento ornamental que retrase interacción.

Respeta `prefers-reduced-motion` cuando exista movimiento no esencial.

## UX review

Al revisar una pantalla, prioriza:

1. bloqueo de tarea;
2. información faltante para decidir;
3. estados y errores confusos;
4. accesibilidad;
5. responsive;
6. jerarquía visual;
7. consistencia del design system;
8. polish cosmético.

No inventes rediseños completos cuando un ajuste local resuelve el problema.
