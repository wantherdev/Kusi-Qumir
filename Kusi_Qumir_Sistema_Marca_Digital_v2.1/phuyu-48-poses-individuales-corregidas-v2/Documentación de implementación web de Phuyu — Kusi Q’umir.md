# Documentación de implementación web de Phuyu

**Marca:** Kusi Q’umir
**Mascota:** Phuyu
**Versión:** 1.0
**Objetivo:** definir cómo integrar a Phuyu dentro del sitio web de Kusi Q’umir de forma coherente, escalable, accesible y sin perjudicar rendimiento ni conversión.

---

# 1. Objetivo de Phuyu dentro de la web

Phuyu no debe utilizarse únicamente como elemento decorativo.

Su función dentro de Kusi Q’umir será actuar como **personaje guía de la experiencia digital**, ayudando al visitante a descubrir información de una forma más cercana y reconocible.

Sus principales funciones podrán ser:

- Presentar determinados contenidos.
- Explicar tours.
- Dar recomendaciones para viajar a Cusco.
- Mostrar consejos importantes.
- Destacar información turística.
- Introducir secciones.
- Comunicar novedades.
- Guiar pequeños procesos dentro de la web.
- Reforzar mensajes importantes.
- Acompañar estados vacíos o mensajes de confirmación.
- Aparecer en determinadas llamadas a la acción.
- Participar posteriormente en videos y contenido audiovisual.

Phuyu **no reemplaza la interfaz**.

La información fundamental siempre debe seguir siendo comprensible aunque la mascota no cargue, las animaciones estén deshabilitadas o el usuario utilice tecnologías de asistencia.

---

# 2. Principio fundamental

La regla principal será:

> **Phuyu acompaña la experiencia; no interrumpe la experiencia.**

Por lo tanto, se debe evitar:

- Mascota flotando permanentemente sobre el contenido.
- Animaciones continuas sin propósito.
- Apariciones automáticas demasiado frecuentes.
- Cubrir botones o información importante.
- Sonidos automáticos.
- Diálogos inesperados.
- Bloquear la navegación hasta interactuar con Phuyu.
- Utilizarla en absolutamente todas las secciones.

La presencia de Phuyu debe ser deliberada.

---

# 3. Niveles de implementación

Se recomienda construir el sistema progresivamente.

## Nivel 1 — Mascota visual

Primera implementación recomendada.

Phuyu aparece como:

- Imagen.
- Ilustración.
- Pose contextual.
- Mensaje acompañado de una ilustración.

Ejemplo:

**Phuyu con mochila**

> ¿Vas a Machu Picchu? Recuerda reservar tus entradas con anticipación.

No requiere animación ni lógica avanzada.

---

## Nivel 2 — Mascota animada

Phuyu incorpora pequeñas animaciones:

- Saludar.
- Parpadear.
- Mover las orejas.
- Mover la cola.
- Señalar.
- Caminar.
- Celebrar.
- Mostrar sorpresa.
- Leer.
- Mirar hacia un elemento.
- Aparecer/desaparecer.

Estas animaciones deben ejecutarse solamente cuando tengan sentido.

---

## Nivel 3 — Mascota contextual

La web determina qué versión de Phuyu mostrar dependiendo de la página.

Ejemplos:

### Página Machu Picchu

Pose:

`phuyu-explorer`

Mensaje:

> Machu Picchu tiene diferentes circuitos. Revisa cuál incluye tu recorrido antes de reservar.

### Página trekking

Pose:

`phuyu-trekking`

Mensaje:

> La altura puede sentirse desde el primer día. Te recomiendo aclimatarte antes del trekking.

### Página de reserva completada

Pose:

`phuyu-celebration`

Mensaje:

> ¡Tu aventura está cada vez más cerca!

---

## Nivel 4 — Phuyu interactiva

Puede responder a interacciones simples.

Ejemplo:

**¿Qué quieres saber?**

- ¿Qué llevar?
- ¿Cuál es la mejor época?
- ¿Necesito aclimatarme?
- ¿Cómo funciona la reserva?

Todavía no necesita inteligencia artificial.

Las respuestas pueden formar parte de la propia aplicación.

---

## Nivel 5 — Asistente inteligente

Solo debería desarrollarse cuando exista una necesidad real.

Phuyu podría convertirse en una interfaz para:

- Consultar tours.
- Buscar información.
- Comparar experiencias.
- Resolver preguntas.
- Orientar reservas.
- Recomendar actividades.

En ese momento sería necesario conectar:

- Backend.
- Base de conocimiento.
- API.
- Sistema conversacional.
- Historial.
- Analítica.
- Controles de seguridad.

No recomiendo comenzar por esta etapa.

---

# 4. Arquitectura recomendada

Phuyu debe implementarse como un **sistema reutilizable**, no colocando imágenes manualmente en cada página.

La arquitectura recomendada es:

```text
Phuyu
│
├── Assets
│
├── Estados
│
├── Poses
│
├── Animaciones
│
├── Componente visual
│
├── Componente de mensaje
│
├── Configuración
│
└── Lógica contextual
```

Esto permitirá cambiar posteriormente la ilustración o animación sin modificar cada página individualmente.

---

# 5. Organización de archivos

Estructura recomendada:

```text
src/
└── assets/
    └── phuyu/
        ├── static/
        ├── animated/
        ├── expressions/
        ├── actions/
        ├── ui/
        └── optimized/
```

Ejemplo:

```text
src/assets/phuyu/

├── static/
│   ├── phuyu-default.webp
│   ├── phuyu-welcome.webp
│   ├── phuyu-pointing.webp
│   └── phuyu-thinking.webp
│
├── expressions/
│   ├── phuyu-happy.webp
│   ├── phuyu-surprised.webp
│   ├── phuyu-curious.webp
│   └── phuyu-celebrating.webp
│
├── actions/
│   ├── phuyu-travel.webp
│   ├── phuyu-trekking.webp
│   ├── phuyu-camera.webp
│   ├── phuyu-map.webp
│   └── phuyu-guide.webp
│
├── animated/
│   ├── phuyu-wave.webm
│   ├── phuyu-blink.webm
│   └── phuyu-celebration.webm
│
└── ui/
    ├── phuyu-avatar.webp
    └── phuyu-icon.webp
```

---

# 6. Convención de nombres

Utilizar siempre:

```text
phuyu-{estado}.{formato}
```

Ejemplos:

```text
phuyu-default.webp
phuyu-happy.webp
phuyu-pointing.webp
phuyu-camera.webp
phuyu-travel.webp
phuyu-thinking.webp
phuyu-celebrating.webp
```

Para animaciones:

```text
phuyu-wave.webm
phuyu-walking.webm
phuyu-celebrating.webm
```

Evitar nombres como:

```text
mascota-final.png
mascota-final2.png
nuevo-final.png
phuyu-ultima-version.png
```

---

# 7. Formatos recomendados

No debería utilizarse un único formato para todo.

## SVG

Usar para:

- Ilustraciones completamente vectoriales.
- Iconos.
- Elementos simples.
- Escalabilidad máxima.

Ventajas:

- Excelente nitidez.
- Poco peso cuando está optimizado.
- Escala perfectamente.

---

## WebP

Formato recomendado para la mayoría de poses estáticas.

Utilizar cuando la ilustración tenga suficiente complejidad como para que SVG deje de ser conveniente.

Ventajas:

- Buena compresión.
- Transparencia.
- Amplio soporte.
- Ideal para web.

---

## AVIF

Puede utilizarse como formato adicional cuando produzca una reducción significativa.

No es obligatorio.

---

## PNG

Mantener principalmente como:

- Archivo maestro.
- Compatibilidad.
- Material de diseño.

No debería ser automáticamente el formato servido en producción si pesa considerablemente más que WebP.

---

## WebM

Recomendado para animaciones complejas.

Especialmente cuando sustituyan GIF.

Evitar GIF siempre que sea posible debido a:

- Mayor peso.
- Menor eficiencia.
- Peor calidad.

---

## Lottie

Puede utilizarse cuando la mascota pueda representarse adecuadamente mediante animaciones vectoriales.

Ventajas:

- Poco peso.
- Muy buena calidad.
- Control programático.
- Animaciones fluidas.

Pero existe una condición importante:

**no todas las ilustraciones complejas funcionan bien convertidas a Lottie.**

No debe sacrificarse la apariencia oficial de Phuyu únicamente para utilizar esta tecnología.

---

# 8. Tamaños de assets

No exportar una sola imagen enorme para todas las situaciones.

Crear versiones adaptadas.

Ejemplo:

```text
phuyu-welcome-320.webp
phuyu-welcome-640.webp
phuyu-welcome-1024.webp
```

Rangos orientativos:

| Uso | Tamaño aproximado |
|---|---:|
| Avatar | 64–128 px |
| Mensajes | 200–400 px |
| Cards | 250–500 px |
| Secciones | 500–800 px |
| Hero | 800–1200 px |

El peso real es más importante que la resolución nominal.

---

# 9. Componente base de Phuyu

Para una web desarrollada con Angular, Phuyu debería existir como componente independiente.

Ejemplo conceptual:

```html
<app-phuyu
  pose="pointing"
  size="medium"
  message="Descubre nuestros tours por Cusco">
</app-phuyu>
```

Esto es preferible a:

```html
<img src="/assets/phuyu/phuyu-pointing.webp">
```

repetido manualmente en cada página.

---

# 10. API conceptual del componente

El componente debería aceptar propiedades como:

```text
pose
expression
size
direction
message
animation
priority
decorative
```

Ejemplo:

```html
<app-phuyu
  pose="traveler"
  expression="happy"
  size="medium"
  direction="right"
  animation="wave">
</app-phuyu>
```

---

# 11. Tamaños estandarizados

Evitar introducir medidas arbitrarias diferentes en cada página.

Definir:

```text
xs
sm
md
lg
xl
```

Ejemplo:

```text
xs = avatar
sm = pequeños mensajes
md = cards
lg = secciones
xl = hero
```

---

# 12. Direcciones

También deberá existir una versión de Phuyu orientada hacia:

```text
left
right
center
```

Esto es importante porque la mascota puede utilizar su mirada o gesto para dirigir atención.

Ejemplo:

```text
PHUYU → BOTÓN RESERVAR
```

es mejor que:

```text
PHUYU ←       BOTÓN RESERVAR
```

si Phuyu estuviera mirando fuera del contenido.

---

# 13. Componente `PhuyuMessage`

Debe existir un segundo componente especializado.

Ejemplo:

```html
<app-phuyu-message
  type="tip"
  pose="pointing"
  title="Consejo de Phuyu"
  message="Lleva siempre protección solar durante tus excursiones.">
</app-phuyu-message>
```

---

# 14. Tipos de mensaje

Definir categorías.

```text
tip
warning
info
recommendation
welcome
success
discovery
```

Ejemplos:

### Tip

> Consejo de Phuyu

### Warning

> Importante antes de viajar

### Discovery

> ¿Sabías que...?

### Success

> ¡Todo listo!

---

# 15. Componente visual sugerido

Una tarjeta puede estructurarse así:

```text
┌──────────────────────────────────────────┐
│                                          │
│     PHUYU       Consejo de Phuyu         │
│                 ----------------         │
│                 Lleva agua y protección  │
│                 solar durante el tour.   │
│                                          │
└──────────────────────────────────────────┘
```

En móvil:

```text
┌─────────────────────┐
│        PHUYU        │
│                     │
│ Consejo de Phuyu    │
│                     │
│ Lleva agua y        │
│ protección solar.   │
└─────────────────────┘
```

---

# 16. Ubicaciones recomendadas

## Home

Phuyu puede aparecer:

- Hero secundario.
- Introducción de experiencias.
- Recomendaciones.
- CTA.
- Sección de ayuda.

No necesita aparecer en todas.

---

# 17. Página de tour

Es uno de los lugares donde Phuyu aporta mayor valor.

Puede mostrar:

### Antes de reservar

> Verifica tu documento de identidad antes de realizar la reserva.

### Dificultad

> Este recorrido requiere una condición física moderada.

### Altitud

> Cusco se encuentra a gran altitud. Considera aclimatarte antes de actividades exigentes.

### Equipaje

> Lleva únicamente lo necesario durante la excursión.

---

# 18. Blog

Phuyu puede aparecer como:

- Autora visual de consejos.
- Indicador de información relevante.
- Separador editorial.

Ejemplo:

```text
Consejo de Phuyu
```

Esto puede convertirse en una categoría editorial propia.

---

# 19. Página 404

Es un lugar especialmente adecuado para utilizar la mascota.

Ejemplo conceptual:

```text
             PHUYU BUSCANDO EL CAMINO

        Parece que nos desviamos de la ruta.

              [ Volver al inicio ]
```

Aquí el componente emocional de la mascota aporta valor sin interferir con una tarea importante.

---

# 20. Estados vacíos

Ejemplo:

```text
Phuyu mirando un mapa vacío

Todavía no tienes viajes guardados.
```

---

# 21. Confirmaciones

Después de una acción:

```text
Phuyu celebrando

¡Listo!
Guardamos este tour en tus favoritos.
```

---

# 22. Errores

Evitar utilizar una representación excesivamente triste o dramática.

Ejemplo correcto:

```text
Phuyu confundida

No pudimos cargar esta información.
Inténtalo nuevamente.
```

---

# 23. Uso en formularios

Phuyu no debería acompañar cada campo.

Puede utilizarse estratégicamente:

```text
Reserva enviada

[Phuyu celebrando]

Recibimos tu solicitud.
```

---

# 24. Responsive design

Phuyu deberá adaptarse a:

```text
Desktop
Tablet
Mobile
```

No simplemente reducirse proporcionalmente.

---

# 25. Desktop

Permite composiciones más amplias:

```text
PHUYU                CONTENIDO
```

o:

```text
CONTENIDO             PHUYU
```

---

# 26. Mobile

La composición recomendada suele ser:

```text
PHUYU

CONTENIDO
```

o:

```text
[avatar] Consejo de Phuyu
```

No colocar una ilustración enorme que obligue al usuario a desplazarse antes de llegar al contenido.

---

# 27. Animaciones

Toda animación debería tener una razón.

Buenas razones:

- Primera aparición.
- Confirmación.
- Saludo.
- Señalar una función nueva.
- Celebrar una reserva.
- Explicar una acción.

Malas razones:

> “Porque queda bonito.”

---

# 28. Animaciones recomendadas

Crear un repertorio limitado.

```text
idle
blink
wave
point
walk
jump
celebrate
think
look
sleep
```

---

# 29. Estado `idle`

Debe ser extremadamente sutil.

Por ejemplo:

- Respiración ligera.
- Parpadeo ocasional.
- Movimiento mínimo de orejas.

No:

- Saltos permanentes.
- Movimiento continuo por toda la pantalla.

---

# 30. `prefers-reduced-motion`

Es obligatorio respetar usuarios que solicitan reducir movimiento.

CSS:

```css
@media (prefers-reduced-motion: reduce) {
  .phuyu-animation {
    animation: none !important;
    transition: none !important;
  }
}
```

También debe existir una versión estática de cualquier animación importante.

---

# 31. Accesibilidad

Hay dos situaciones.

## Phuyu decorativa

Utilizar:

```html
<img
  src="phuyu.webp"
  alt=""
  aria-hidden="true">
```

---

## Phuyu transmite información

El texto debe existir como contenido HTML real.

Incorrecto:

```text
Texto dibujado dentro de la propia imagen.
```

Correcto:

```html
<section>
  <img src="phuyu.webp" alt="">
  <p>
    Recuerda llevar protección solar.
  </p>
</section>
```

Los lectores de pantalla podrán acceder al mensaje.

---

# 32. Texto alternativo

Evitar:

```text
alt="imagen"
```

o:

```text
alt="mascota"
```

Si la ilustración es informativa:

```text
alt="Phuyu señalando un mapa"
```

Si es puramente decorativa:

```text
alt=""
```

---

# 33. Rendimiento

Phuyu nunca debe convertirse en uno de los elementos más pesados de la web.

Aplicar:

- Compresión.
- Lazy loading.
- Formatos modernos.
- Caché.
- Responsive images.
- Precarga únicamente cuando corresponda.

Ejemplo:

```html
<img
  src="phuyu.webp"
  loading="lazy"
  decoding="async"
  alt="">
```

---

# 34. Above the fold

Si Phuyu aparece en el hero principal, no utilizar `loading="lazy"`.

Si aparece más abajo, sí puede utilizarse.

---

# 35. Lazy loading de animaciones

No descargar una animación compleja si el usuario todavía no puede verla.

Puede cargarse cuando el componente se acerque al viewport mediante:

```text
Intersection Observer
```

---

# 36. Presupuesto de rendimiento

Como regla de diseño:

> La mascota debe añadir personalidad, no varios megabytes innecesarios a cada página.

La página debería cargar solamente los assets de Phuyu que realmente utilizará.

---

# 37. Evitar Sprite Sheets como solución principal

Los sprites pueden ser útiles en casos específicos, pero no deberían ser la arquitectura central de una mascota moderna.

Para Phuyu conviene trabajar con:

- Assets independientes.
- SVG.
- WebP.
- WebM.
- Lottie cuando corresponda.

Esto permitirá mayor control y mejor mantenimiento.

---

# 38. Sistema contextual

Puede crearse un archivo de configuración:

```typescript
export const PHUYU_CONTEXT = {
  home: {
    pose: 'welcome',
    message: '¡Descubre Cusco conmigo!'
  },

  machuPicchu: {
    pose: 'explorer',
    message: 'Antes de viajar revisa tu circuito.'
  },

  trekking: {
    pose: 'trekking',
    message: 'Prepárate para la altura.'
  },

  bookingSuccess: {
    pose: 'celebrating',
    message: '¡Tu aventura comienza pronto!'
  }
};
```

La ilustración deja de estar ligada directamente a una página concreta.

---

# 39. Modelo de datos recomendado

Una definición más escalable:

```typescript
export interface PhuyuState {
  pose: string;
  expression?: string;
  animation?: string;
  message?: string;
  direction?: 'left' | 'right' | 'center';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}
```

---

# 40. Servicio de Phuyu

En una implementación más avanzada se podría crear:

```text
PhuyuService
```

Responsable de determinar:

```text
qué mostrar
dónde mostrarlo
cuándo mostrarlo
qué pose utilizar
qué mensaje utilizar
```

Ejemplo conceptual:

```typescript
phuyuService.show({
  pose: 'celebrating',
  message: '¡Reserva completada!'
});
```

---

# 41. Analítica

No debe asumirse que la mascota mejora automáticamente la web.

Hay que medirlo.

Eventos posibles:

```text
phuyu_view
phuyu_interaction
phuyu_tip_open
phuyu_cta_click
phuyu_help_open
```

---

# 42. Métricas

Analizar:

- CTR.
- Conversión.
- Interacción.
- Rebote.
- Uso de consejos.
- Conversión después de ver contenido de Phuyu.
- Cierre de componentes.
- Tiempo de permanencia.

Si una implementación de Phuyu reduce conversión, debe modificarse aunque visualmente resulte atractiva.

---

# 43. Frecuencia de aparición

No mostrar automáticamente el mismo mensaje continuamente.

Puede utilizarse:

```text
sessionStorage
```

para recordar determinados mensajes durante la sesión.

Ejemplo:

```text
phuyu_welcome_seen = true
```

---

# 44. Sonido

Por defecto:

**Phuyu no debe reproducir audio automáticamente.**

Cuando posteriormente disponga de voz:

```text
🔊 Escuchar a Phuyu
```

debe requerir interacción directa.

---

# 45. Videos

Para explicaciones más extensas:

```text
[ Phuyu animada ]

▶ Ver consejo de Phuyu
```

El video debe activarse solamente cuando el usuario lo solicite.

---

# 46. Uso futuro de voz

Arquitectura conceptual:

```text
Phuyu
│
├── Visual
├── Animación
├── Texto
└── Voz
```

El texto debe seguir existiendo incluso cuando haya audio.

Esto beneficia:

- Accesibilidad.
- SEO.
- Traducción.
- Usuarios sin sonido.

---

# 47. Internacionalización

Kusi Q’umir tendrá visitantes de diferentes países.

Por eso los mensajes de Phuyu no deben incorporarse directamente dentro de las imágenes.

Separar:

```text
Ilustración
+
Texto traducible
```

Ejemplo:

```json
{
  "phuyu.tips.altitude": {
    "es": "Recuerda aclimatarte antes de realizar actividades exigentes.",
    "en": "Remember to acclimatize before strenuous activities."
  }
}
```

---

# 48. CMS

A largo plazo conviene permitir que algunos mensajes de Phuyu puedan administrarse desde el CMS.

Ejemplo:

```text
Página
Pose
Título
Mensaje
CTA
Activo
```

De esta forma no será necesario recompilar toda la web para cambiar cada consejo.

---

# 49. SEO

La mascota no debería contener información turística importante únicamente dentro de:

- Canvas.
- Video.
- Imagen.
- Animación.

El contenido relevante debe permanecer disponible como HTML.

Phuyu es la interfaz visual; el contenido sigue siendo indexable.

---

# 50. Seguridad

Si en el futuro Phuyu incorpora inteligencia artificial:

Nunca permitir que sea la fuente autoritativa de:

- Disponibilidad.
- Precio final.
- Confirmación de reservas.
- Requisitos legales.
- Condiciones contractuales.

Esos datos deben provenir directamente de los sistemas correspondientes.

---

# 51. Design tokens

Crear variables específicas para el componente.

Ejemplo:

```css
--phuyu-size-xs
--phuyu-size-sm
--phuyu-size-md
--phuyu-size-lg
--phuyu-size-xl

--phuyu-gap
--phuyu-message-radius
--phuyu-message-padding
```

No definir estilos manualmente en cada sección.

---

# 52. Componente Angular sugerido

Estructura:

```text
shared/
└── components/
    └── phuyu/
        ├── phuyu.component.ts
        ├── phuyu.component.html
        ├── phuyu.component.scss
        ├── phuyu.component.spec.ts
        └── phuyu.types.ts
```

Y:

```text
shared/
└── components/
    └── phuyu-message/
```

---

# 53. Ejemplo básico Angular

```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-phuyu',
  standalone: true,
  templateUrl: './phuyu.component.html',
  styleUrl: './phuyu.component.scss'
})
export class PhuyuComponent {

  @Input() pose = 'default';

  @Input() size:
    'xs' |
    'sm' |
    'md' |
    'lg' |
    'xl' = 'md';

  @Input() alt = '';

  get src(): string {
    return `/assets/phuyu/static/phuyu-${this.pose}.webp`;
  }
}
```

---

# 54. Template

```html
<img
  class="phuyu"
  [class]="'phuyu phuyu--' + size"
  [src]="src"
  [alt]="alt"
  decoding="async">
```

---

# 55. CSS conceptual

```css
.phuyu {
  display: block;
  width: auto;
  height: auto;
  max-width: 100%;
}

.phuyu--xs {
  width: 64px;
}

.phuyu--sm {
  width: 128px;
}

.phuyu--md {
  width: 240px;
}

.phuyu--lg {
  width: 420px;
}

.phuyu--xl {
  width: 640px;
}
```

Los valores finales deberán definirse durante la implementación visual.

---

# 56. Uso

```html
<app-phuyu
  pose="welcome"
  size="lg"
  alt="Phuyu dando la bienvenida">
</app-phuyu>
```

---

# 57. Phuyu Message

Estructura recomendada:

```text
phuyu-message/
├── phuyu-message.component.ts
├── phuyu-message.component.html
├── phuyu-message.component.scss
└── phuyu-message.types.ts
```

Ejemplo de utilización:

```html
<app-phuyu-message
  type="tip"
  pose="explorer"
  title="Consejo de Phuyu"
  message="Aclimátate antes de realizar actividades de alta exigencia física.">
</app-phuyu-message>
```

---

# 58. Estados mínimos que deberían producirse

Antes de desarrollar el componente definitivo deberían existir, como mínimo:

### Base

```text
default
welcome
happy
```

### Comunicación

```text
pointing-left
pointing-right
thinking
explaining
```

### Turismo

```text
traveler
map
camera
trekking
explorer
```

### Sistema

```text
success
error
empty
search
```

### Celebración

```text
celebrating
```

---

# 59. Sistema recomendado de estados

No sería conveniente crear cientos de ilustraciones sin estructura.

Clasificarlas como:

```text
EXPRESIÓN
+
ACCIÓN
+
CONTEXTO
```

Ejemplo:

```text
happy + camera + tourism
```

Esto ayudará posteriormente a definir un sistema completo de poses.

---

# 60. Implementación progresiva recomendada

## Fase 1

Construir:

- Componente `PhuyuComponent`.
- Assets estáticos.
- Sistema de tamaños.
- Sistema de poses.
- Responsive.
- Accesibilidad.

---

## Fase 2

Construir:

- `PhuyuMessageComponent`.
- Consejos.
- Avisos.
- Estados vacíos.
- Confirmaciones.
- Página 404.

---

## Fase 3

Incorporar:

- Animaciones.
- Lazy loading.
- `prefers-reduced-motion`.
- Estados interactivos.

---

## Fase 4

Implementar:

- Mensajes contextuales.
- PhuyuService.
- CMS.
- Analítica.

---

## Fase 5

Evaluar:

- Voz.
- Video.
- Asistente conversacional.
- IA.

---

# 61. Qué no recomiendo

No recomiendo comenzar implementando:

```text
Phuyu flotante
+
chatbot
+
voz
+
animación constante
+
IA
```

todo al mismo tiempo.

Eso añade:

- Complejidad.
- Peso.
- Distracción.
- Riesgo.
- Mantenimiento.

sin haber demostrado todavía que mejore la experiencia.

---

# 62. Arquitectura objetivo

La estructura final debería aproximarse a:

```text
                    ┌─────────────────┐
                    │     CONTENT     │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ Phuyu Context   │
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼

     Phuyu Visual       Phuyu Message      Phuyu Animation
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
                    ┌────────▼────────┐
                    │     Assets      │
                    └─────────────────┘
```

Posteriormente:

```text
                         Phuyu
                           │
             ┌─────────────┼─────────────┐
             │             │             │
           Visual         Voice        Content
             │             │             │
             └─────────────┼─────────────┘
                           │
                     Phuyu Service
                           │
                 ┌─────────┴─────────┐
                 │                   │
               CMS                 Backend
```

---

# 63. Criterio de éxito

La implementación será correcta si ocurre esto:

> Un usuario puede reconocer a Phuyu, entender qué representa, recibir información útil gracias a ella y completar sus objetivos en la web sin que la mascota interfiera con la navegación.

La implementación será incorrecta si:

> Phuyu se convierte en una animación llamativa que distrae del producto turístico.

---

# 64. Recomendación final

La primera versión de Phuyu en la web de Kusi Q’umir debería limitarse a cuatro funciones:

1. **Presentación de marca.**
2. **Consejos contextuales.**
3. **Estados de interfaz.**
4. **Llamadas a la acción seleccionadas.**

Construir primero:

```text
PhuyuComponent
        ↓
PhuyuMessageComponent
        ↓
Sistema de poses
        ↓
Estados contextuales
        ↓
Animación
        ↓
Interactividad
        ↓
Voz / IA
```

No invertir el orden.

La siguiente tarea necesaria antes de comenzar la implementación será crear el **sistema oficial de poses, expresiones y estados de Phuyu**, ya que esos archivos se convertirán directamente en los assets consumidos por esta arquitectura.
