---
name: angular-performance
description: Diagnostica y mejora performance de aplicaciones Angular. Úsala para Core Web Vitals, bundle, lazy loading, @defer, SSR/hydration, imágenes, red y rendering; primero mide antes de optimizar.
---

# Angular Performance

## Regla principal

No optimices por intuición cuando puedes medir. Identifica el cuello real y el journey afectado.

## Métricas prioritarias

Core Web Vitals actuales:

- LCP: loading de contenido principal;
- INP: capacidad de respuesta a interacciones;
- CLS: estabilidad visual.

Distingue datos de laboratorio de datos reales de usuarios. Un Lighthouse perfecto no garantiza buen rendimiento de campo.

## LCP

Investiga:

1. TTFB;
2. descubrimiento del recurso LCP;
3. prioridad;
4. tamaño/compresión;
5. render-blocking CSS/JS;
6. hidratación o trabajo de cliente antes de mostrar contenido.

No lazy-load de forma indiscriminada la imagen LCP.

## INP

Busca:

- handlers largos;
- listas enormes;
- computaciones sin memoización útil;
- parsing/formatting pesado;
- librerías costosas;
- tareas largas en main thread.

Reduce trabajo por interacción antes de aplicar trucos cosméticos.

## CLS

Reserva espacio para:

- imágenes;
- banners;
- embeds;
- skeletons;
- contenido async.

No insertes contenido por encima del viewport sin una razón de UX clara.

## Bundles

Analiza:

- bundle inicial;
- dependencias de terceros;
- imports accidentales de librerías completas;
- duplicación;
- chunks de rutas.

No reemplaces una dependencia estable solo por unos KB sin medir impacto total de mantenimiento.

## Routing lazy

Lazy-load features que no sean necesarias al arranque. Evita fragmentar tanto que cada interacción cause cascadas de requests y latencia visible.

## `@defer`

Buenos candidatos:

- charts pesados;
- editors;
- maps;
- widgets below-the-fold;
- componentes secundarios con dependencias grandes.

Incluye placeholder/loading/error apropiados cuando el contenido lo necesite.

## SSR/SSG/hydration

Para páginas públicas o first-load crítico, evalúa rendering de servidor/pre-rendering.

Hydration reutiliza DOM existente y puede mejorar métricas al evitar recreación innecesaria. Angular moderno también soporta hydration incremental; úsala cuando ayude al caso real y mide el resultado.

No habilites SSR en una app privada completa únicamente por “performance” sin comprobar coste operativo y beneficio.

## Signals

Signals pueden reducir trabajo reactivo cuando el estado está bien modelado. No conviertas cada valor en signal si no participa en reactividad.

Mantén `computed()` puro y evita trabajo caro repetido dentro de templates.

## Listas

- usa tracking estable;
- pagina/virtualiza datasets grandes cuando la UX lo permita;
- no renderices miles de nodos ocultos.

## Imágenes

- usa formatos/tamaños adecuados;
- `NgOptimizedImage` cuando encaje;
- `srcset/sizes` cuando exista responsive imagery;
- reserva width/height o aspect-ratio;
- lazy-load imágenes below-the-fold, no el contenido visual prioritario.

## Fonts

Minimiza variantes y pesos. Evita bloquear contenido por fuentes no esenciales. Evalúa self-hosting/CDN según producto y compliance.

## Red

- evita requests duplicados;
- cachea cuando la semántica lo permita;
- cancela requests obsoletos;
- agrupa llamadas solo si reduce latencia sin acoplar APIs indebidamente.

## Third-party scripts

Analytics, chat, A/B testing y widgets externos pueden dominar el main thread. Cárgalos con intención y mide su impacto.

## Presupuesto

En productos importantes define budgets observables para:

- JS inicial;
- imágenes hero;
- LCP/INP/CLS;
- número/peso de third-party scripts.

No conviertas un presupuesto arbitrario en requisito si no representa experiencia real.

## Entrega de una optimización

Documenta:

- métrica/problema observado;
- causa;
- cambio;
- antes/después cuando existan datos;
- trade-offs;
- cómo evitar regresión.
