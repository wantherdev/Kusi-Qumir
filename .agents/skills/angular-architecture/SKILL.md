---
name: angular-architecture
description: Diseña, revisa o refactoriza arquitectura de aplicaciones Angular. Úsala para estructura por features, boundaries, Signals/RxJS, data-access, estado, routing y escalabilidad; no para cambios visuales aislados.
---

# Angular Architecture

## Principio rector

Optimiza para que un desarrollador pueda entender y modificar un feature con contexto local. La arquitectura debe reducir el número de cosas que una persona necesita conocer para realizar un cambio seguro.

## Estructura preferida

Para aplicaciones medianas/grandes, organiza por feature o dominio:

```text
src/app/
├── core/
├── layout/
├── shared/
└── features/
    ├── users/
    │   ├── pages/
    │   ├── ui/
    │   ├── data-access/
    │   ├── domain/
    │   └── users.routes.ts
    └── orders/
```

No obligues esta estructura si el proyecto ya tiene una organización coherente distinta.

## Responsabilidades

### Pages

Componen la pantalla, conectan route params, estado y UI. No deben convertirse en repositorios HTTP ni contener grandes reglas de negocio.

### UI

Componentes visuales con API pequeña y semántica. Reciben datos y emiten intención. Pueden contener comportamiento local de interacción.

### Data-access

Contiene integración externa: HttpClient, DTOs, adapters, repositories, caches y stores de acceso a datos.

### Domain

Tipos, reglas y funciones puras con mínimo acoplamiento a Angular.

## Boundaries

Evita:

- feature A importando archivos internos profundos de feature B;
- ciclos;
- `shared/` como vertedero;
- services globales para estado que solo pertenece a una pantalla;
- barrels que oculten ciclos.

Cuando dos features comparten algo, primero determina si realmente es:

- primitive UI;
- dominio común;
- infraestructura común;
- o simplemente duplicación pequeña aceptable.

## Standalone

Para código nuevo, usa APIs standalone salvo interoperabilidad legacy.

No crees NgModules nuevos sin una razón concreta.

## Dependency Injection

Prefiere dependencias específicas. Evita servicios genéricos como `CommonService`, `HelperService` o `AppService` que acumulan responsabilidades.

Usa `inject()` cuando sea coherente con el repositorio y facilite composición/test.

## Signals

Signals son apropiados para:

- estado de UI;
- selección;
- filtros;
- estado local de feature;
- valores derivados.

Usa `computed()` para derivar:

```ts
readonly filteredUsers = computed(() => {
  const query = this.query().trim().toLowerCase();
  return this.users().filter(user => user.name.toLowerCase().includes(query));
});
```

No sincronices dos signals mediante `effect()` si uno puede ser `computed()`.

Usa `effect()` para efectos externos: storage, analytics o adapters imperativos.

## RxJS

Mantén RxJS cuando el problema sea naturalmente un stream:

- WebSockets;
- cancelación;
- debounce;
- retry;
- composición temporal;
- coordinación de múltiples streams.

No conviertas RxJS a Signals por moda ni Signals a Observables sin necesidad.

## Estado global

No introduzcas una librería global de estado automáticamente.

Escala en este orden cuando sea suficiente:

1. estado local de componente;
2. service/store de feature;
3. estado compartido explícito;
4. librería global cuando las transiciones, efectos y coordinación justifiquen el coste.

Muchas pantallas por sí solas no justifican NgRx.

## Modelos y DTOs

Separa DTO de dominio cuando la API externa tenga convenciones o formas que no deberían dominar la aplicación.

```text
API DTO -> mapper -> domain model -> view model (si hace falta)
```

No crees ViewModels ceremoniales si el modelo de dominio ya encaja con la vista.

## Estado de página

Evita combinaciones booleanas incoherentes:

```ts
loading = signal(false);
error = signal(false);
success = signal(false);
```

si un union type representa mejor los estados válidos.

## Routing

- Agrupa rutas por feature.
- Lazy load de features cuando reduzca trabajo inicial sin crear waterfalls absurdos.
- No escondas reglas de autorización exclusivamente en routing: el backend debe autorizar.

## SSR/SSG

Para rutas públicas sensibles a SEO o first-load, evalúa server-side o pre-rendering. Para dashboards privados, CSR puede ser suficiente.

No conviertas toda la aplicación a SSR si solo unas pocas rutas públicas lo necesitan y el stack permite rendering híbrido.

## Abstracciones

No crees antes de tiempo:

- generic CRUD engines;
- base components;
- universal repositories;
- mega tables configurables para cualquier dominio;
- formularios completamente dinámicos sin requisito real.

Abstrae cuando varios casos reales compartan semántica, no solo sintaxis.

## Evaluación de una arquitectura

Clasifica los problemas por impacto:

1. ciclos y acoplamiento entre dominios;
2. estado global innecesario o inconsistente;
3. lógica de negocio dispersa en templates/componentes;
4. acceso a API duplicado o mal encapsulado;
5. componentes demasiado grandes;
6. abstracciones prematuras;
7. naming/estructura menor.

Al refactorizar, evita reescribir áreas estables que no bloquean el cambio actual.
