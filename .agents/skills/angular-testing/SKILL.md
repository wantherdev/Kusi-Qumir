---
name: angular-testing
description: Diseña, implementa o revisa tests para Angular con Vitest, Angular TestBed, HTTP testing, router testing y Playwright. Úsala para cobertura de comportamiento, regresiones y estrategia de tests.
---

# Angular Testing

## Objetivo

Crear una suite rápida y fiable que permita refactorizar con confianza. Coverage es una señal secundaria; el objetivo real es proteger comportamientos y riesgos.

## Niveles

### Unit tests

Para:

- funciones puras;
- mappers;
- validadores;
- reglas de dominio;
- reducers/transformaciones.

No uses TestBed para lógica TypeScript pura.

### Component tests

Prueba clase + template como una unidad observable desde el DOM.

Valida:

- texto y estado visible;
- inputs;
- outputs;
- interacciones;
- loading/empty/error;
- comportamiento con teclado cuando sea importante.

Evita assertions sobre métodos privados.

### Service/data-access tests

Prueba:

- request URL/method/params/body;
- mapping;
- respuestas;
- errores relevantes.

Nunca permitas red real en unit tests.

### Router tests

Prueba:

- redirecciones;
- params;
- guards/resolvers cuando existan;
- componente renderizado para navegación crítica.

### E2E

Usa Playwright para journeys de negocio que atraviesen varias capas.

No conviertas cada edge case en E2E.

## Vitest

Para proyectos nuevos configurados por Angular CLI, usa Vitest.

No copies patrones de Jasmine/Karma sin verificar compatibilidad. En particular, evita depender de `fakeAsync`/`tick` en suites Vitest: las APIs de fakeAsync basadas en Zone.js no son el camino correcto para Vitest moderno.

Prefiere async/await y utilidades soportadas por el entorno de testing.

## Arrange / Act / Assert

Mantén tests legibles:

```ts
it('shows an error when loading users fails', async () => {
  // Arrange
  // Act
  // Assert
});
```

No es obligatorio escribir los comentarios si la estructura ya es evidente.

## Naming

Describe comportamiento:

- `shows an empty state when no orders exist`
- `disables destructive action without permission`
- `maps API status pending_review to pending`

Evita `test component`, `works`, `should be truthy` como cobertura principal.

## Mocks

Mockea fronteras:

- HTTP;
- fecha/hora;
- browser APIs;
- SDKs externos.

No mockees cada clase interna: demasiados mocks hacen que el test valide la implementación y no el sistema.

## Test doubles de UI

Antes de stubear un hijo, decide qué estás probando:

- si el hijo no importa al comportamiento, un stub simple puede reducir ruido;
- si la integración template-hijo es parte del riesgo, usa el componente real.

## HTTP

Usa las utilidades oficiales de Angular HTTP testing.

Comprueba no solo que hubo request, sino el contrato relevante.

## Playwright

Prefiere locators accesibles:

```ts
page.getByRole('button', { name: 'Guardar' });
page.getByLabel('Correo electrónico');
```

Evita selectores acoplados al DOM como `div:nth-child(3)`.

Usa `data-testid` cuando no exista una semántica estable mejor.

## E2E críticos sugeridos

Según el producto:

- login/logout;
- registro;
- checkout/pago;
- creación y edición principal;
- permisos críticos;
- recuperación de errores relevantes.

## Accesibilidad automatizada

Puedes integrar axe u otra herramienta compatible en Playwright para detectar una parte de los problemas. No declares una pantalla accesible solo porque un scanner automático pasa; foco, lectura, orden y UX requieren pruebas manuales o de interacción.

## Bugs

Para una regresión:

1. reproduce;
2. escribe el test al nivel más bajo capaz de capturar la causa;
3. confirma que falla;
4. corrige;
5. confirma que pasa;
6. busca la misma clase de fallo en código similar.

## Cobertura

Usa thresholds como guardrail, no como objetivo de diseño. Si el proyecto no tiene política, una base razonable puede ser aproximadamente 80% de lines/statements/functions y 75% de branches, aumentando en lógica crítica.

No escribas tests triviales solo para alcanzar un porcentaje.

## Flakiness

Un test flaky es un bug de la suite.

No lo arregles añadiendo sleeps arbitrarios. Busca:

- estado compartido;
- timers;
- race conditions;
- dependencia de red;
- selectors ambiguos;
- datos no deterministas.

## Entrega

Informa:

- qué comportamientos quedaron cubiertos;
- qué nivel de test se eligió y por qué;
- qué comandos se ejecutaron;
- cualquier riesgo que sigue sin cobertura.
