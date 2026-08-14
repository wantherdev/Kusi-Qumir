# Requisitos de publicación y formalización

Fecha de revisión: 10 de agosto de 2026. Este documento es una guía de implementación, no reemplaza asesoría legal ni la evaluación de GERCETUR Cusco.

## Registro de la actividad

La inscripción de una agencia de viajes y turismo es obligatoria. Fuera de Lima se tramita ante la DIRCETUR o GERCETUR correspondiente. La modalidad presencial o mixta utiliza el Anexo I; la operación exclusivamente digital utiliza el Anexo II.

Fuente: [MINCETUR — Registrar mi agencia de viajes y turismo](https://www.gob.pe/institucion/mincetur/pages/7375-registrar-mi-agencia-de-viajes-y-turismo).

## Contenido mínimo del canal digital

Antes de comercializar servicios, la web debe mostrar de forma clara y accesible desde el inicio:

- Teléfono, dirección, correo y datos de contacto para asistencia.
- RUC.
- Razón social o nombres y apellidos del titular.
- Nombre comercial.
- Política de protección de datos personales.
- Términos de uso, incluyendo cobros, cancelaciones y reembolsos.
- Constancia de inscripción cuando corresponda.
- Material oficial para prevenir la explotación sexual de niñas, niños y adolescentes (ESNNA).
- Medidas de seguridad para compras y pagos en línea.
- Medidas técnicas para proteger los datos recabados.

Fuentes: [D.S. N.° 005-2020-MINCETUR](https://www.gob.pe/institucion/mincetur/informes-publicaciones/575794-nuevo-reglamento-de-agencias-de-viajes-y-turismo) y [Anexo II oficial](https://cdn.www.gob.pe/uploads/document/file/1073068/ANEXO_N__II.pdf?v=1596070878).

## Distintivo MINCETUR

La denominación reservada y el distintivo “Agencia de Viajes y Turismo Registrada” solo pueden usarse cuando exista inscripción válida. Una vez autorizado, el distintivo debe mostrarse también en los canales digitales.

Fuente: [MINCETUR — Distintivo para agencias inscritas](https://www.gob.pe/institucion/mincetur/informes-publicaciones/1892198-distintivo-para-).

## Libro de Reclamaciones

El acceso debe ser permanente, visible y sencillo en plataformas digitales. El formulario debe registrar la hoja, generar una constancia o código, entregar copia al consumidor y permitir atender la queja o reclamo dentro del plazo legal de 15 días hábiles.

Fuentes: [INDECOPI — Libro de Reclamaciones](https://www.gob.pe/institucion/indecopi/campa%C3%B1as/65149-libro-de-reclamaciones-todo-lo-que-debe-saber-antes-de-solicitarlo) y [cambios de plazo](https://www.gob.pe/institucion/indecopi/campa%C3%B1as/20909-cambios-en-el-libro-de-reclamaciones).

## Datos pendientes del titular

- [x] Razón social o nombre completo.
- [x] RUC activo según Ficha RUC del 14 de agosto de 2026.
- [x] Representante legal identificado en la Ficha RUC.
- [ ] Domicilio legal verificado; falta confirmar una dirección pública de atención.
- [x] Correo general, teléfono y WhatsApp confirmados.
- [ ] Precisar días y horas exactos del horario de oficina.
- [x] Clasificación: minorista y operador de turismo.
- [x] Modalidad exclusivamente digital; corresponde el Anexo II.
- [ ] Constancia de inscripción y autorización del distintivo.
- [ ] Código de Conducta y afiche oficial contra la ESNNA.
- [ ] Políticas reales de cobro, cambios, cancelación y reembolso.
- [ ] Responsable y canal para derechos sobre datos personales.
- [ ] Backend y correo responsable del Libro de Reclamaciones.
- [ ] Fotografías reales con licencia y permisos de las personas retratadas.

Los datos destinados al frontend deben incorporarse en
`frontend/src/app/config/agency-profile.ts` solo después de contrastarlos con sus
documentos sustentatorios.

## Bloqueos de salida a producción

No activar envíos, analítica, pagos ni ventas hasta obtener la constancia de
inscripción turística y completar privacidad y condiciones. No mostrar el
distintivo ni afirmar que la empresa está registrada sin la constancia vigente.
La ilustración del hero es decorativa y no debe presentarse como evidencia de
una experiencia real.
