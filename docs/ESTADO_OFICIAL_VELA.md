VELA — ESTADO OFICIAL DE PROYECTO
Documento de transferencia de contexto
Versión: 1 · Fecha de corte: 2026-06

Propósito: continuidad exacta en nuevo chat. Registra decisiones, no las resume. Todo lo aquí contenido tiene estado aprobado salvo indicación contraria.

1. DECISIONES VIGENTES HEREDADAS (FASE 1–10)
Arquitectura: SaaS de invitaciones digitales. React 18 + Vite 5 + Tailwind + Vercel. RSVP via Google Sheets + Apps Script. Sin base de datos. Laboratorio: xv-platform-lab. Producción: xv-sofia — NO TOCAR BAJO NINGUNA CIRCUNSTANCIA.
Fases completadas 1–10: setup, invitación funcional, RSVP, Admin MVP, hardening, templates, modularización standard1, soporte sheet_id, arquitectura SaaS inicial, templateRegistry + TemplateLoader, contratos Clientes y Catálogo, AdminShell + ClientesPage (FASE 9, validada en producción), PRODUCTOS.md (FASE 10).
Deudas técnicas activas diferidas: DEUDA-001 (doble useConfig), DEUDA-002 (duplicación S1/S2).
Decisiones arquitectónicas oficiales vigentes:

8.3.A: slug como identidad central, inmutable una vez desplegado.
8.3.C: estados deploy_estado — draft→deployed→archived. Prohibido: deployed→draft.
8.3.D: AdminPage responsabilidad única (generar config.json).
FASE 8: templates como variantes visuales; divergencia funcional entre variantes = defecto.
FASE 9: index.json solo desde ClientesPage por import estático.
FASE 10: STANDARD y PREMIUM son los productos; S1–S3/P1–P3 son variantes visuales.

Restricciones vigentes: xv-sofia intocable; AdminPage sin modificación sin análisis; index.json solo lectura/solo panel admin/sin datos sensibles; slug "admin" reservado; no marcar template disponible sin 4 condiciones cumplidas (§5.3 PRODUCTOS.md); no nuevas dependencias sin consumidor real; no automatización prematura.
Catálogo visual oficial: data/catalogo/VARIANTES.md es fuente de verdad visual. Si una propuesta la contradice, VARIANTES.md prevalece.
Protocolo: Análisis→Riesgos→Alternativas→Recomendación→Cambio mínimo→Impacto→Esperando confirmación. No implementar sin aprobación. Diffs quirúrgicos. Preservar comentarios y deuda documentada. "Si algo funciona, no se toca."

2. FASE 11 — CERRADA Y VALIDADA
Entregable: data/catalogo/VARIANTES.md v1, aprobado. Tres familias visuales:
FamiliaPropósitoSTANDARDPREMIUMEmotivaConmoverS1P1Con CarácterDestacarS2P2EleganteRefinarS3P3
Regla de evolución §6.2 (CRÍTICO): las familias prevalecen sobre las implementaciones históricas — incluyendo S1. S1 es una implementación de Emotiva en un momento dado, no su definición. VARIANTES.md §3 es la fuente de verdad visual de Emotiva. Ninguna variante es visualmente definitiva.
Estado de implementación registrado: S1 = implementada y validada. S2, S3, P1, P2, P3 = declaradas, sin implementación.

3. FASE 12.1 — CERRADA Y VALIDADA (incluye FASE 12.0)
FASE 12.0: criterios de validación aprobados para las tres familias (versión revisada final con todos los ajustes de auditabilidad). Señales obligatorias de identidad + señales de riesgo hacia cada otra familia + condiciones mínimas de pertenencia. Regla de autoridad: criterios de 12.0 prevalecen sobre reglas operativas posteriores.
Regla de referencias 12.1: toda referencia incluye criterios que demuestra / que NO demuestra / por qué pertenece y no a las otras dos / Señales visuales extraídas (activo permanente; la referencia es temporal).
Referencias aprobadas:

Emotiva: inclusión — Lana Del Rey (Ultraviolence/Born to Die), Maison Margiela Replica. Exclusión — Glossier 2014–2019 (borde Con Carácter), Loro Piana editorial (borde Elegante).
Con Carácter: inclusión — Off-White (Virgil Abloh), Aesop packaging. Exclusión — Chanel sistema clásico (borde Elegante), Spotify 2015–2018 (borde por exceso).
Elegante: inclusión — Aman Resorts, Kinfolk editorial. Exclusión — informe corporativo genérico ("ordenado ≠ Elegante"), minimalismo escandinavo genérico IKEA ("económico ≠ refinado").

Principios sintetizadores y mecanismos — APROBADOS, NO REABRIR:
FamiliaModoPrincipioMecanismoEmotivaAtmósferaEmoción sofisticadaEmoción via atmósfera/temperatura/jerarquía/ritmo — no ornamento tradicional. Recursos contemporáneos/cinematográficos/atmosféricos.Con CarácterEstructuraPostura visibleDecisiones visuales existen para afirmar postura perceptible antes de la lectura; no justificable por funcionalidad/jerarquía/refinamiento; incluso a costa de notarse.EleganteServicioRefinamiento inevitableServicio Absoluto: ningún elemento existe para ser notado por sí mismo; subordinado a jerarquía/contenido/evento.
Hallazgo estructural 12.1: las tres familias responden de forma mutuamente excluyente a "¿en función de qué existe cada decisión visual?" — Emotiva: la sensación; Con Carácter: la postura; Elegante: todo aquello que no es la decisión misma.

4. FASE 12.2 — EN CURSO
Reglas transversales activas:

Regla de diferenciación obligatoria (3 preguntas): por qué fortalece su familia + por qué no sería válida para cada una de las otras dos.
Hipótesis cromática compartida (verificada): las tres familias usan los 5 colores oficiales VELA (#F8F5EF, #B9A68E, #8B7355, #1A1A1A, #E6D3A8). Se diferencian por función/rol. Extensión = excepción justificada.
Filtro de modo (hipótesis validada, NO axioma definitivo): Emotiva=Atmósfera / Con Carácter=Estructura / Elegante=Servicio. Aplica a color, tipografía, composición y movimiento. Condición de permanencia: reabrirse si aparece decisión correcta no describible mediante estos tres modos.
Orden: Paleta → Tipografía → Composición → (Movimiento en 12.3). Emotiva → Con Carácter → Elegante dentro de cada capa.
Separación Familia (roles invariantes) / Instanciación (manifestación concreta S1–S3/P1–P3). Instanciación puede alterar dominancias pero no eliminar roles.
Prueba de reemplazo: si sustituir por alternativa genérica NO cambia identidad perceptiblemente → el elemento es instanciación, no rol obligatorio.

CAPA PALETA — CERRADA
FamiliaRol obligatorio (signature)Roles complementariosEmotivaLuz emocional — tono cálido luminoso como foco emocionalProfundidad, Transición, SoporteCon CarácterAfirmación cromática — decisión cromática en modo Estructura (borde duro / proporción inusual / posición asimétrica). Manifestaciones: bloque, tipografía, línea, proporción inusualCampo, Tipografía con carácter, SoporteEleganteCohesión tonal — todos los tonos en banda estrecha de temperatura/valor; ninguna transición percibida como oposiciónJerarquía, Acento (opcional)
Instanciaciones de referencia (paleta oficial, sin extensión):

Emotiva S1/P1 (polaridad oscura): Negro cálido=Profundidad (fondo+gradiente) / Mocha=Transición / Champagne=Luz emocional / Taupe=Soporte / Crema suave=texto alto contraste mínimo.
Con Carácter S2/P2: Crema suave=Campo / Negro cálido=Afirmación cromática (bloque sólido) / Negro cálido o Mocha=Tipografía con carácter / Taupe=Soporte.
Elegante S3/P3: Crema suave+Champagne=Cohesión tonal / Mocha=Jerarquía texto principal / Taupe=Jerarquía texto secundario / Negro cálido=Acento opcional mínimo.

Prueba operativa Con Carácter vs Elegante: ¿hay elemento que se recorta contra el campo con borde duro? Sí → Con Carácter. No (todo cohesiona) → Elegante.
Hallazgo de capa: los tres invariantes son relaciones: oposición tonal con foco (Emotiva) / oposición perceptible (Con Carácter) / ausencia de oposición (Elegante). Mutuamente excluyentes.
CAPA TIPOGRAFÍA — CERRADA
FamiliaRol obligatorio tipográficoEje de identidadEmotivaNinguno positivo. Restricción: ningún nivel tipográfico puede operar en modo Estructura.Todo intercambiableCon CarácterTipografía con intención identitaria — reemplazarla por genérica cambiaría perceptiblemente la identidad.Voz/tipo de letra NO intercambiable; proporción síEleganteTipografía proporcional — identidad en relaciones de escala/espaciado/ritmo.Sistema de proporción NO intercambiable; voz sí
Instanciaciones: Emotiva S1/P1 — script/caligráfica para nombre (instanciación recomendada, no obligatoria) + serif clásica títulos + sans-serif cuerpo. Con Carácter S2/P2 — tracking amplio/rasgos distintivos en títulos. Elegante S3/P3 — Cormorant Garamond + jerarquía por tamaño/espaciado + interletrado generoso + sin contraste dramático de peso.
Hallazgo estructural (CRÍTICO): tres ejes de identidad tipográfica mutuamente excluyentes — ausencia (Emotiva) / voz (Con Carácter) / proporción (Elegante). Cada familia concentra su carga identitaria en un eje distinto.
CAPA COMPOSICIÓN — EN CURSO
Emotiva — APROBADA:

Rol obligatorio: Continuidad atmosférica — ausencia de divisiones duras, bordes marcados o puntos de tensión localizables en cualquier punto de la experiencia, incluyendo la entrada. Los elementos fluyen mediante transiciones graduales.
"Umbral con pantalla de cover" → reclasificado a instanciación de referencia S1/P1 (Cover.jsx actual). Una implementación con scroll-reveal continuo sin cover también cumpliría.
Validación cruzada: no Con Carácter (Estructura exige punto de tensión localizable — Continuidad lo prohíbe). No Elegante (Elegante = precisión discreta con límites calculados invisibles, distinto a "todo fluye sin límites").

Con Carácter — PENDIENTE. PRÓXIMO PASO INMEDIATO.
Elegante — PENDIENTE.

5. HALLAZGOS ESTRUCTURALES
5.1 Los 5 colores oficiales sirven a los tres roles de paleta sin extensión. Diferenciación funcional, no cromática.
5.2 Roles de paleta son relaciones, no contenidos: oposición con foco / oposición perceptible / ausencia de oposición.
5.3 Capa tipográfica: tres ejes de identidad mutuamente excluyentes (ausencia/voz/proporción). Cada familia concentra identidad en un sistema distinto.
5.4 Las reformulaciones de roles surgieron de evidencia ya aprobada dentro del propio sistema — el sistema se autocorrige con su propio historial.
5.5 (En curso) "Continuidad atmosférica" generaliza el "umbral de entrada" de FASE 12.0 a toda la experiencia. Pendiente verificar si patrones equivalentes aparecen en Con Carácter y Elegante.

6. DECISIONES DESCARTADAS

Estructuras familiares: Romántica/Moderna/Elegante (superposición + "Moderna" por negación); Emotiva/Contemporánea/Elegante ("Contemporánea" sin territorio propio).
Nombres: "Identidad legible" (consecuencia compartida); "Inevitabilidad" sola; "Intención calculada"/"Precisión percibida" (cualidades generales); "Resolución perfecta" (no auditable); "Editorial" como descriptor de Emotiva.
Reclasificaciones via prueba de reemplazo: "Bloque de postura"→"Afirmación cromática"; "Campo dominante"→"Cohesión tonal"; "Tipografía expresiva/caligráfica" (Emotiva) →instanciación; "Serif clásica" (Elegante)→instanciación; "Umbral con pantalla de cover" (Emotiva)→instanciación.
Camino B (extender paleta Emotiva con rosas/burdeos) → descartado en favor de Camino A (5 colores oficiales reconfigurados).


7. QUÉ NO DEBE REABRIRSE
Todo lo de sección 1 (FASE 1–10). FASE 11 completa. FASE 12.0 completa. FASE 12.1 completa. Capa Paleta y Capa Tipografía de FASE 12.2. Composición de Emotiva (Continuidad atmosférica).
Excepción: filtro de modo puede reabrirse si aparece decisión correcta no describible mediante Atmósfera/Estructura/Servicio.

8. PUNTO EXACTO DE CONTINUACIÓN
Próximo paso: auditoría de composición de Con Carácter bajo modo Estructura. Formato de 5 pasos:

Candidato inicial (derivado de "punto de tensión visual deliberado" / asimetría compositiva, FASE 12.0).
Pregunta de validación (¿puede existir Con Carácter sin ese candidato, sosteniendo Postura Visible por otros medios?).
Distinción rol obligatorio / instanciación (prueba de reemplazo).
Validación cruzada contra Emotiva (Continuidad atmosférica) y Elegante (composición pendiente).
Rol obligatorio + instanciación S2/P2.

Después: Elegante → cierre Capa Composición → cierre FASE 12.2 → apertura FASE 12.3 (movimiento + recursos permitidos/prohibidos + reglas de validación operativas).
Pregunta activa: ¿el hallazgo 5.5 (generalización del umbral) tiene equivalente en Con Carácter y Elegante, o cada familia requiere su propio tipo de generalización?
