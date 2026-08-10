---
name: angular-seo
description: Implementa o audita SEO técnico y on-page en rutas públicas Angular. Úsala para SSR/SSG, metadata, canonical, robots, sitemap, structured data, enlaces, imágenes, internacionalización y rastreabilidad.
---

# Angular SEO

## Principio inicial

Primero clasifica la ruta:

- pública e indexable;
- pública pero no indexable;
- autenticada/privada;
- duplicada/paramétrica;
- temporal.

No apliques SEO de indexación a dashboards privados.

## Rendering

Google puede procesar JavaScript, pero una aplicación pública no debe depender ciegamente de que todo contenido crítico aparezca tarde en cliente.

Para páginas donde SEO, sharing y first-load importan, evalúa:

- SSG/prerender para contenido estable;
- SSR para contenido dinámico público;
- rendering híbrido para mezclar necesidades;
- hydration para volver interactivo el HTML servido.

No uses dynamic rendering para bots como arquitectura principal; Google lo considera un workaround, no la solución recomendada.

## Contenido crítico

Asegura que el HTML renderizado/indexable contenga el contenido principal cuando uses SSR/SSG.

No cargues contenido SEO esencial únicamente tras una interacción del usuario.

## Titles

Cada página indexable necesita un título descriptivo, específico y coherente con el contenido visible.

Evita:

- títulos duplicados masivos;
- keyword stuffing;
- títulos genéricos como `Home` o `Page`;
- diferencias engañosas entre title y contenido.

## Meta description

Escribe una descripción útil y específica por plantilla/página. No asumas una longitud exacta garantizada: Google puede truncar o construir el snippet desde el contenido.

## Canonical

Define canonical cuando existan variantes o duplicados significativos.

Mantén señales consistentes entre:

- canonical;
- sitemap;
- redirects;
- enlaces internos;
- hreflang cuando aplique.

No apuntes todas las páginas a home como canonical.

## Robots

Usa `noindex` para impedir indexación cuando sea necesario.

No uses `robots.txt` como sustituto de `noindex`: robots controla crawling, no garantiza exclusión del índice.

No bloquees en robots recursos necesarios para que el crawler entienda la página.

## Sitemap

Genera sitemap con URLs canónicas importantes e indexables.

No incluyas:

- redirects;
- URLs `noindex`;
- errores 4xx/5xx;
- duplicados no canónicos.

Mantén `lastmod` solo si puedes generarlo con datos reales.

## Links

Usa enlaces HTML rastreables con destinos reales para navegación indexable.

Evita navegación esencial que solo existe en listeners JavaScript sobre elementos no-link.

El texto del enlace debe comunicar destino mejor que `click aquí` cuando sea posible.

## Structured data

Usa JSON-LD cuando el tipo de página sea elegible y los datos representen contenido real visible.

Ejemplos posibles según producto:

- Product;
- Article;
- Event;
- Organization;
- Breadcrumb.

No inventes ratings, disponibilidad, autoría ni datos para obtener rich results.

Valida con Rich Results Test y revisa las políticas específicas del tipo.

## Imágenes

- nombres descriptivos cuando tenga sentido;
- alt útil para accesibilidad y contexto;
- tamaño apropiado;
- dimensiones reservadas;
- imágenes cercanas al contenido relevante;
- URLs rastreables cuando deban indexarse.

## Meta keywords

No añadas `meta keywords` para Google Search: Google no lo usa para ranking/indexación.

## Internacionalización

Si existen URLs distintas por idioma/región, implementa `hreflang` consistente y recíproco según la estrategia del proyecto.

No detectes idioma únicamente para redirigir permanentemente a una versión que impida acceder a otras variantes.

## Paginación y filtros

Decide explícitamente qué combinaciones deben indexarse.

No permitas que parámetros de filtro creen millones de URLs indexables sin valor único.

Usa canonical/noindex/routing según la intención real; no existe una regla universal para todos los faceted navigations.

## Estado HTTP

SSR debe producir estados HTTP coherentes para:

- 200 válido;
- 301/308 redirects cuando corresponda;
- 404 para recursos inexistentes;
- 5xx para fallos reales del servidor.

No renderices una bonita página “No encontrado” con HTTP 200 en una URL inexistente si la plataforma permite devolver 404.

## Social metadata

Cuando el producto dependa de compartir URLs, añade Open Graph y metadatos sociales coherentes con título, descripción, canonical e imagen.

No confundas Open Graph con ranking SEO directo; sirve principalmente para previews sociales.

## Auditoría SEO

Revisa en este orden:

1. indexabilidad/rastreabilidad;
2. rendering de contenido principal;
3. status codes y redirects;
4. canonical;
5. title/meta description;
6. enlaces internos;
7. sitemap/robots;
8. structured data;
9. imágenes;
10. optimizaciones menores.

## Validación

Según disponibilidad del proyecto, utiliza:

- Search Console / URL Inspection;
- Rich Results Test;
- Lighthouse como señal, no como autoridad SEO completa;
- view-source o respuesta SSR;
- crawler técnico;
- tests automatizados de metadata para plantillas críticas.
