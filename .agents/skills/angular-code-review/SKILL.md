---
name: angular-code-review
description: Revisa cambios Angular o pull requests con foco en bugs, regresiones, arquitectura, tests, accesibilidad, SEO, performance y seguridad. Úsala cuando el objetivo principal sea encontrar problemas y priorizarlos.
---

# Angular Code Review

## Objetivo

Encontrar defectos que importan. No generar una lista larga de preferencias personales.

## Orden de revisión

### 1. Correctitud

Comprueba:

- requisitos incumplidos;
- estados no manejados;
- race conditions;
- null/undefined;
- pérdida de datos;
- navegación incorrecta;
- manejo de errores.

### 2. Seguridad

Busca:

- HTML/URLs no confiables;
- bypass de sanitización;
- secretos;
- autorización solo frontend;
- datos sensibles en logs;
- redirects inseguros.

### 3. Accesibilidad

Busca bloqueos reales:

- control no accesible por teclado;
- botones falsos;
- labels ausentes;
- foco roto;
- dialogs incorrectos;
- estado expresado solo por color.

### 4. SEO

Solo para rutas públicas indexables:

- pérdida de SSR/SSG;
- títulos/canonical incorrectos;
- `noindex` accidental;
- links no rastreables;
- contenido principal cargado solo por interacción;
- structured data falsa.

### 5. Performance

Prioriza regresiones medibles o plausibles de impacto alto:

- librería pesada en bundle inicial;
- request duplicado;
- lista masiva;
- trabajo costoso por interacción;
- imagen LCP lazy-loaded;
- CLS evidente.

No bloquees por microoptimizaciones especulativas.

### 6. Arquitectura

Busca:

- dependencia circular;
- feature boundaries rotos;
- HTTP en UI;
- estado duplicado;
- God component/service;
- abstracción genérica prematura;
- nuevo patrón inconsistente sin necesidad.

### 7. Testing

Pregunta qué riesgo nuevo quedó sin protección.

No exijas tests de cada getter trivial. Sí exige regresión cuando un bug crítico podría reaparecer fácilmente.

## Severidad sugerida

- **P0**: seguridad crítica, corrupción/pérdida grave, aplicación inutilizable.
- **P1**: bug importante o regresión que afecta flujo principal.
- **P2**: riesgo real de mantenimiento, accesibilidad, SEO o performance con impacto moderado.
- **P3**: mejora menor no bloqueante.

No infles severidad para hacer que un comentario parezca importante.

## Formato de cada hallazgo

Incluye:

1. archivo/línea o área;
2. problema concreto;
3. condición que lo activa;
4. impacto;
5. corrección sugerida mínima.

Evita comentarios vagos como “esto no escala” sin explicar cómo falla.

## Antes de reportar

Verifica que el problema exista en el diff y no sea resuelto por código cercano, framework o test.

No reportes preferencias de formato cubiertas por lint/formatter salvo que causen un problema funcional.

## Conclusión

Si no encuentras problemas significativos, dilo. No inventes observaciones para llenar la revisión.
