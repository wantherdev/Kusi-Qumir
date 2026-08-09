# Registro de decisiones

Este documento conserva las decisiones duraderas del proyecto. No sustituye el
historial de Git ni la lista operativa de `ESTADO_PROYECTO.md`.

## 2026-08-08 — Base tecnológica

- Se utiliza Angular moderno con componentes standalone y carga diferida.
- Se utiliza pnpm como único administrador de paquetes.
- Node y pnpm quedan fijados mediante `.nvmrc`, `engines` y `packageManager`.
- Se mantiene SSR con Express, hidratación y prerender para rendimiento y SEO.

## 2026-08-08 — Sistema de estilos

- Tailwind CSS 4 se usa para utilidades directamente en las plantillas.
- SCSS se usa para tokens, estilos globales y composiciones editoriales de los
  componentes.
- No se usa `@apply` dentro de Sass.
- Las tipografías se alojan localmente para evitar dependencias externas en la
  carga inicial.

## 2026-08-08 — Marca y dirección visual

- La fuente de verdad visual es el manual y el paquete
  `Kusi_Qumir_Sistema_Marca_Digital_v2.1/` entregado por el diseñador.
- Se conserva una estética editorial andina contemporánea, cercana y natural.
- El hero debe cubrir su espacio visual sin márgenes vacíos accidentales.
- Las tarjetas de experiencias pueden usar ilustraciones generadas siempre que
  mantengan el estilo aprobado y no se presenten como fotografías documentales.
- El footer conserva la estructura de cuatro columnas de la referencia aprobada.
- El turquesa de marca es el hover común de enlaces e iconos sociales.

## 2026-08-08 — Recursos e iconos

- Los recursos necesarios para la interfaz se sirven localmente desde `public/`.
- Las redes sociales utilizan Remix Icon; sus SVG se copian desde el paquete
  instalado durante el build y no dependen de un CDN.
- Mientras no existan URLs oficiales, los iconos sociales no deben funcionar
  como enlaces falsos.

## 2026-08-08 — Seguridad jurídica de la landing

- La web no debe inventar datos comerciales ni mostrar una licencia simulada.
- Los formularios permanecen en modo demostrativo hasta implementar tratamiento
  de datos, consentimiento y backend.
- El Libro de Reclamaciones no se presenta como operativo hasta generar y
  entregar la constancia exigida y conectar un canal de atención real.
- Los borradores legales informan su condición provisional.
- La ilustración del hero es decorativa y no prueba la prestación de una
  experiencia turística real.

## 2026-08-08 — Estrategia de entrega

- Primero se publica una landing institucional técnicamente preparada.
- Las capacidades comerciales se activarán únicamente después de completar los
  requisitos legales, operativos y de seguridad.
- El sitio completo se desarrollará progresivamente sin comprometer la versión
  estable de la landing.
