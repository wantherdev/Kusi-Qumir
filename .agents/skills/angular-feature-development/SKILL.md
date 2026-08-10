---
name: angular-feature-development
description: Implementa o modifica features Angular de extremo a extremo. Úsala para páginas, formularios, CRUDs, flujos de usuario, integración API y cambios funcionales; no para una revisión exclusivamente SEO, UX o de arquitectura.
---

# Angular Feature Development

## Objetivo

Implementar el requisito mínimo completo sin crear arquitectura paralela ni deuda evitable.

## Flujo obligatorio

### 1. Inspeccionar antes de escribir

Lee primero:

- `package.json` y scripts relevantes;
- `angular.json`;
- rutas del área afectada;
- componentes y servicios cercanos;
- tests existentes;
- design system o primitives ya disponibles.

No asumas que el repositorio sigue una plantilla estándar.

### 2. Definir el comportamiento

Extrae de la petición:

- actor/usuario;
- entrada;
- resultado esperado;
- reglas de negocio visibles en frontend;
- estados loading/empty/error;
- permisos;
- navegación;
- requisitos responsive;
- impacto SEO si la ruta es pública.

Si faltan detalles menores, adopta la solución más simple consistente con el código existente.

### 3. Elegir límites

Determina qué corresponde a:

- page/container;
- UI presentacional;
- domain/model;
- data-access;
- estado del feature;
- routing.

No conviertas un componente pequeño en cinco capas artificiales. Divide solo cuando exista una responsabilidad distinta.

### 4. Estado

Usa Signals para estado local y derivado cuando encaje.

```ts
readonly users = signal<User[]>([]);
readonly selectedId = signal<string | null>(null);
readonly selectedUser = computed(() =>
  this.users().find(user => user.id === this.selectedId()) ?? null,
);
```

No dupliques valores derivables.

Modela estados incompatibles con un union type cuando múltiples booleanos puedan crear combinaciones inválidas.

```ts
type LoadState<T> =
  | { status: 'loading' }
  | { status: 'loaded'; data: T }
  | { status: 'error'; message: string };
```

### 5. Datos

Los componentes visuales no conocen URLs HTTP.

Mantén `HttpClient`, DTOs, mapping, cache y detalles de transporte en `data-access`.

No propagues una forma defectuosa del backend por toda la UI si un mapper puede normalizarla en la frontera.

### 6. Templates

Prefiere control flow moderno.

```html
@if (state().status === 'loading') {
  <app-skeleton />
} @else if (state().status === 'error') {
  <app-error-state />
} @else {
  @for (item of items(); track item.id) {
    <app-item-card [item]="item" />
  } @empty {
    <app-empty-state />
  }
}
```

No pongas transformaciones pesadas o reglas de negocio complejas en templates.

### 7. Formularios

- Modela explícitamente datos del formulario.
- Distingue datos de UI de request DTO cuando difieran.
- Muestra errores cerca del campo y un resumen cuando el formulario lo necesite.
- No borres datos introducidos por el usuario tras un error recuperable.
- Evita deshabilitar submit como único mecanismo para comunicar por qué el formulario es inválido.

### 8. Errores

Diferencia al menos:

- validación;
- autorización;
- recurso inexistente;
- conectividad;
- error inesperado.

No muestres excepciones internas o mensajes técnicos del backend directamente al usuario.

### 9. Tests

Añade el nivel mínimo que proteja el cambio:

- lógica pura → unit;
- componente/interacción → component test;
- HTTP/mapping → data-access test;
- navegación → router test;
- journey crítico → E2E.

Para bugs, intenta crear primero un test de regresión que falle por la causa real.

### 10. Validar

Ejecuta scripts existentes relevantes de lint, test, build y E2E.

Inspecciona el diff final buscando:

- duplicación;
- imports cruzados entre features;
- `any`;
- subscriptions manuales innecesarias;
- falta de estados de error/empty;
- accesibilidad rota;
- dependencia nueva innecesaria.

## Entrega

Resume al final:

- qué cambió;
- decisiones no obvias;
- tests añadidos/actualizados;
- validaciones ejecutadas;
- riesgo pendiente real, si existe.
