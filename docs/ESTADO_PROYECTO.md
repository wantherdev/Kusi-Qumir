# Estado del proyecto Kusi Q’umir

Última actualización: 8 de agosto de 2026.

Este archivo es el punto de reanudación para una persona o una nueva sesión de
IA. Debe actualizarse después de cada avance importante.

## Estado general

La primera landing está implementada y técnicamente funcional. Aún no está
habilitada para operar comercialmente porque faltan datos oficiales de la
empresa, documentos legales definitivos e integraciones reales.

El repositorio Git está inicializado sobre la rama `main` y el árbol de trabajo
estaba limpio al crear este documento. Todavía no existe un remoto configurado.

## Implementado

- Proyecto Angular 22 standalone con TypeScript, pnpm, Tailwind CSS 4 y SCSS.
- Node.js 24.19.0 fijado en `.nvmrc` y pnpm 11.20.0 fijado en `package.json`.
- SSR con Express, hidratación y prerender.
- Landing responsive con navegación, hero, propuesta de valor, experiencias,
  servicios, información de confianza, contacto y footer.
- Ilustración editorial del hero completando todo su lienzo.
- Imágenes editoriales para las tarjetas de experiencias.
- Footer basado en la referencia aprobada: cuatro columnas, bloque legal,
  newsletter, redes sociales y franja inferior.
- Hover turquesa de marca en enlaces e iconos sociales.
- Iconos sociales de Remix Icon servidos como recursos locales.
- Recursos de marca, fuentes e imágenes servidos localmente.
- SEO básico: títulos por ruta, metadatos, Open Graph, favicon, manifest y
  `robots.txt`.
- Formularios de contacto y newsletter con validación local, sin transmisión.
- Libro de Reclamaciones demostrativo con validación local, sin registro real.
- Páginas informativas de privacidad, términos y turismo responsable.
- Servidor de desarrollo escuchando en `0.0.0.0` para pruebas dentro de la red
  local.

## Rutas actuales

| Ruta                      | Propósito                              | Estado                                  |
| ------------------------- | -------------------------------------- | --------------------------------------- |
| `/`                       | Landing principal                      | Implementada                            |
| `/privacidad`             | Borrador de privacidad                 | Requiere datos y revisión legal         |
| `/terminos`               | Borrador de términos                   | Requiere políticas comerciales reales   |
| `/turismo-responsable`    | Compromiso ESNNA y turismo responsable | Requiere materiales y canales oficiales |
| `/libro-de-reclamaciones` | Formulario demostrativo                | Requiere backend y flujo legal completo |

Las cinco rutas se prerenderizan en el build de producción.

## Verificación técnica más reciente

- `pnpm test:ci`: 4 pruebas superadas.
- `pnpm build`: finalizado correctamente, sin errores ni advertencias.
- Cinco rutas prerenderizadas.
- Tamaño inicial estimado del navegador: 75.71 kB.
- Auditoría de dependencias de producción: sin vulnerabilidades conocidas.

Estos resultados describen la última revisión realizada. Hay que volver a
ejecutar las verificaciones después de modificar código o dependencias.

## Datos y decisiones pendientes del propietario

- Razón social o nombre completo del titular.
- RUC real.
- Representante legal y documento correspondiente.
- Dirección legal y dirección pública de atención.
- Teléfono, WhatsApp y correo oficiales.
- Enlaces reales de Facebook, Instagram, YouTube y TikTok.
- Clasificación de la agencia: minorista, mayorista u operador.
- Modalidad: presencial/mixta o exclusivamente digital.
- Constancia de inscripción vigente ante GERCETUR/MINCETUR.
- Autorización para mostrar el distintivo oficial, si corresponde.
- Código de Conducta, afiche y canales oficiales relacionados con ESNNA.
- Políticas reales de precios, reservas, pagos, cambios, cancelaciones y
  reembolsos.
- Responsable de privacidad y canal para ejercer derechos sobre datos.
- Fotografías reales y permisos de uso de imagen.
- Proveedor de hosting, dominio final y correo transaccional.

## Bloqueos para producción comercial

- Formularios de contacto y newsletter no tienen backend ni consentimiento
  definitivo.
- El Libro de Reclamaciones no genera número de hoja, constancia, copia ni
  entrega el caso a un responsable.
- No existe todavía un flujo real de reservas o pagos.
- Los textos legales no contienen la identidad real del titular ni han sido
  aprobados profesionalmente.
- No se ha configurado analítica con consentimiento ni una política de cookies.
- Los datos de contacto y perfiles sociales siguen pendientes.
- No debe mostrarse un número o distintivo de licencia ficticio.
- Falta desplegar sobre el dominio definitivo y validar seguridad, accesibilidad,
  SEO técnico y comportamiento en dispositivos reales.

Consulta el detalle regulatorio en `docs/requisitos-publicacion.md`.

## Próximos pasos recomendados

1. Crear un repositorio remoto privado y hacer `git push -u origin main`.
2. Recibir y validar los datos oficiales del propietario.
3. Sustituir datos provisionales y completar los documentos legales.
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
