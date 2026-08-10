# Estado del proyecto Kusi Q’umir

Última actualización: 10 de agosto de 2026.

Este archivo es el punto de reanudación para una persona o una nueva sesión de
IA. Debe actualizarse después de cada avance importante.

## Estado general

El frontend institucional está implementado y técnicamente funcional para su
evaluación. Aún no está habilitado para operar comercialmente porque faltan
datos oficiales de la empresa, documentos legales definitivos e integraciones
reales.

El repositorio Git está inicializado sobre la rama `main` y tiene el remoto
`origin` configurado en GitHub.

## Implementado

- Proyecto Angular 22 standalone con TypeScript, pnpm, Tailwind CSS 4 y SCSS.
- Node.js 24.19.0 fijado en `.nvmrc` y pnpm 11.20.0 fijado en `package.json`.
- SSR con Express, hidratación y prerender.
- TypeScript estricto y validación estricta de templates Angular.
- Landing responsive con navegación, hero, propuesta de valor, experiencias,
  servicios, información de confianza, contacto y footer.
- Ilustración editorial del hero completando todo su lienzo.
- Imágenes editoriales para las tarjetas de experiencias.
- Footer basado en la referencia aprobada: cuatro columnas, bloque legal,
  estado institucional, redes sociales y franja inferior.
- Hover turquesa de marca en enlaces e iconos sociales.
- Iconos sociales de Remix Icon servidos como recursos locales.
- Recursos de marca, fuentes e imágenes servidos localmente.
- SEO básico: títulos por ruta, metadatos, Open Graph, favicon, manifest y
  `robots.txt`.
- Descripciones y metadatos sociales actualizados por ruta tanto en navegación
  cliente como en el HTML prerenderizado.
- Formulario demostrativo de contacto con validación local, sin transmisión.
- Ficha `/informacion-institucional` con datos del prestador, estado del
  registro, controles previstos y acceso a los borradores documentales.
- Fuente centralizada para incorporar datos oficiales en
  `src/app/config/agency-profile.ts` sin duplicarlos entre vistas.
- Estado de evaluación visible, sin distintivo oficial, ventas, reservas ni
  captación real.
- Newsletter retirado mientras no exista consentimiento y canal operativo.
- Indexación desactivada mediante `noindex, nofollow`; `robots.txt` permite el
  rastreo para que esa directiva pueda ser observada.
- Libro de Reclamaciones demostrativo con validación local, sin registro real.
- Errores de formularios asociados a sus campos mediante texto, `aria-invalid`
  y `aria-describedby`.
- Navegación interna con skip links, retorno de foco del menú móvil y foco al
  contenido principal después de cambiar de ruta.
- Página 404 propia con estado HTTP 404 real para rutas desconocidas.
- Hero servido como imagen prioritaria detectable por el navegador; imágenes de
  experiencias con carga diferida y dimensiones reservadas.
- Servidor SSR sin exposición de `X-Powered-By`, con encabezados básicos de
  seguridad y caché diferenciada para HTML, bundles versionados y activos.
- Encabezado reutilizable para las páginas internas.
- Páginas informativas de privacidad, términos y turismo responsable.
- Servidor de desarrollo escuchando en `0.0.0.0` para pruebas dentro de la red
  local.

## Rutas actuales

| Ruta                         | Propósito               | Estado                                  |
| ---------------------------- | ----------------------- | --------------------------------------- |
| `/`                          | Landing principal       | Implementada                            |
| `/informacion-institucional` | Ficha del canal digital | Implementada; requiere datos oficiales  |
| `/privacidad`                | Borrador de privacidad  | Requiere datos y revisión legal         |
| `/terminos`                  | Borrador de términos    | Requiere políticas comerciales reales   |
| `/turismo-responsable`       | Compromiso ESNNA        | Requiere materiales y canales oficiales |
| `/libro-de-reclamaciones`    | Formulario demostrativo | Requiere backend y flujo legal completo |
| `/**`                        | Página no encontrada    | HTTP 404 mediante SSR                   |

Las seis rutas públicas se prerenderizan; la ruta comodín se resuelve mediante
SSR para devolver HTTP 404.

## Verificación técnica más reciente

- `pnpm test:ci`: 15 pruebas superadas en 8 archivos.
- `pnpm build`: finalizado correctamente, sin errores ni advertencias.
- Seis rutas prerenderizadas.
- Tamaño inicial estimado del navegador: 78.83 kB.
- Auditoría de dependencias de producción: sin vulnerabilidades conocidas.
- Prueba directa del servidor: rutas públicas con HTTP 200 y ruta desconocida
  con HTTP 404.

Estos resultados describen la última revisión realizada. Hay que volver a
ejecutar las verificaciones después de modificar código o dependencias.

## Datos y decisiones pendientes del propietario

- Razón social o nombre completo del titular.
- RUC real.
- Representante legal y documento correspondiente.
- Dirección legal y dirección pública de atención.
- Teléfono, WhatsApp y correo oficiales.
- Enlaces reales de Facebook, Instagram, YouTube y TikTok.
- Constancia de inscripción vigente ante GERCETUR/MINCETUR.
- Autorización para mostrar el distintivo oficial, si corresponde.
- Código de Conducta, afiche y canales oficiales relacionados con ESNNA.
- Políticas reales de precios, reservas, pagos, cambios, cancelaciones y
  reembolsos.
- Responsable de privacidad y canal para ejercer derechos sobre datos.
- Fotografías reales y permisos de uso de imagen.
- Proveedor de hosting, dominio final y correo transaccional.

La modalidad operativa ya fue confirmada por el titular: será exclusivamente
digital y corresponde preparar la declaración jurada del Anexo II.

Esta modalidad ya se muestra en la portada, la ficha institucional, los
borradores legales y el Libro de Reclamaciones demostrativo. La dirección se
presenta como dirección de contacto para asistencia y no como oficina física.

La clasificación también fue confirmada: minorista y operador de turismo. La
web distingue los tours propios de los prestados por terceros y exige identificar
al operador real en cada propuesta.

## Bloqueos para producción comercial

- El formulario de contacto no tiene backend ni consentimiento definitivo; el
  newsletter permanece retirado.
- El Libro de Reclamaciones no genera número de hoja, constancia, copia ni
  entrega el caso a un responsable.
- No existe todavía un flujo real de reservas o pagos.
- Los textos legales no contienen la identidad real del titular ni han sido
  aprobados profesionalmente.
- No se ha configurado analítica con consentimiento ni una política de cookies.
- Los datos de contacto y perfiles sociales siguen pendientes.
- No debe mostrarse un número o distintivo de licencia ficticio.
- Canonical, `og:url`, imagen social absoluta y sitemap permanecen pendientes
  hasta definir el dominio y habilitar indexación.
- Falta desplegar sobre el dominio definitivo, definir la política CSP del
  hosting y validar accesibilidad, rendimiento y comportamiento en dispositivos
  y navegadores reales.

Consulta el detalle regulatorio en `docs/requisitos-publicacion.md`.

## Próximos pasos recomendados

1. Recibir y validar los datos oficiales del propietario.
2. Completar `src/app/config/agency-profile.ts` con los documentos sustentatorios.
3. Completar y revisar profesionalmente los documentos legales.
4. Definir hosting, dominio, correo y backend de formularios.
5. Implementar Libro de Reclamaciones, consentimiento y tratamiento de datos.
6. Incorporar destinos, paquetes, fichas de experiencia y flujo de consultas o
   reservas del sitio completo.
7. Ejecutar una revisión final de accesibilidad, rendimiento, seguridad, SEO y
   requisitos regulatorios antes de publicar funciones comerciales.

## Cómo reanudar el trabajo

Después de clonar el repositorio:

```bash
nvm install
nvm use
pnpm install --frozen-lockfile
pnpm test:ci
pnpm start
```

Prompt sugerido para una nueva sesión:

> Lee `AGENTS.md`, `README.md`, `docs/ESTADO_PROYECTO.md`,
> `docs/DECISIONES.md` y `docs/requisitos-publicacion.md`. Revisa `git status` y
> los últimos commits. Resume el estado y continúa desde “Próximos pasos” sin
> inventar datos comerciales o legales.
