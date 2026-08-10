---
name: angular-security
description: Revisa o implementa seguridad de frontend Angular. Úsala para XSS, sanitización, DOM, autenticación, autorización, tokens, almacenamiento, dependencias y exposición de datos sensibles.
---

# Angular Security

## Modelo de amenaza

El navegador es un entorno no confiable. Todo código, configuración y dato enviado al cliente puede ser inspeccionado o modificado.

## Secretos

Nunca guardes secretos reales en:

- `environment.ts`;
- bundles;
- localStorage;
- variables build-time expuestas al cliente.

API keys públicas restringidas por proveedor no son equivalentes a secretos privados; sigue las restricciones específicas del servicio.

## XSS

Prefiere bindings y templates de Angular que aplican sanitización contextual.

Evita insertar HTML arbitrario de usuario. Si el producto necesita rich text, define una política de sanitización explícita y usa una librería/proceso adecuado.

## `bypassSecurityTrust...`

Trátalo como señal de alto riesgo.

Antes de usarlo:

1. identifica origen del dato;
2. demuestra por qué la sanitización normal no sirve;
3. limita el bypass al alcance mínimo;
4. documenta el supuesto de confianza;
5. añade test/regla que evite entrada no confiable.

No uses bypass solo para eliminar un warning.

## DOM directo

Evita `innerHTML`, `document.write` y construcción manual insegura de markup.

Cuando una integración externa requiera DOM imperativo, encapsúlala y valida inputs.

## Autenticación

El frontend puede manejar sesión y UX, pero no determina la seguridad final.

No asumas que ocultar un botón protege una operación.

## Autorización

Guards y permisos UI son defense-in-depth/UX. El backend debe comprobar permisos para cada operación sensible.

## Tokens y almacenamiento

No existe una estrategia universal. Evalúa según backend y threat model:

- cookies `HttpOnly/Secure/SameSite` cuando la arquitectura las soporte;
- CSRF si se usan credenciales automáticas;
- riesgo XSS si tokens quedan accesibles a JavaScript;
- expiración y revocación.

No copies una estrategia de tokens de otro proyecto sin analizar el modelo de amenaza.

## URLs y redirects

Valida destinos de redirects. Evita open redirects derivados directamente de parámetros no confiables.

## Logging

No envíes a consola/analytics:

- tokens;
- passwords;
- PII innecesaria;
- payloads sensibles completos.

## Dependencias

Antes de añadir paquete:

- necesidad real;
- mantenimiento;
- superficie de ataque;
- tamaño;
- licencia;
- historial de vulnerabilidades cuando sea pertinente.

Mantén lockfile y procesos de actualización.

## CSP y headers

La aplicación Angular no controla por sí sola todos los security headers. Cuando el producto sea web público o sensible, coordina con hosting/backend para CSP, framing, referrer policy y headers relevantes.

No inventes CSP sin probarla: una política incorrecta puede romper la aplicación o ser tan permisiva que no proteja nada.

## File uploads

Frontend puede validar UX, extensión y tamaño, pero backend debe validar contenido real, autorización y almacenamiento seguro.

## Review

Prioriza:

1. ejecución de contenido no confiable;
2. exposición de credenciales/tokens;
3. autorización solo cliente;
4. redirects/URLs inseguras;
5. datos sensibles en logs/storage;
6. dependencias vulnerables/redundantes;
7. hardening adicional.
