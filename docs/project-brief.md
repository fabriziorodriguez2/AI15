# AI15 — Project Brief

## Problema

Organizar una fiesta de 15 implica coordinar muchas decisiones (salón, vestido,
catering, decoración, música, foto y video, invitaciones) bajo un presupuesto
acotado y con plazos largos. La información suele quedar dispersa en chats,
notas y planillas, lo que genera desorden, gastos mal distribuidos y estrés en
la familia.

## Público objetivo

Quinceañeras y familias de Uruguay que están planificando una fiesta de 15.
Perfil principalmente rioplatense, con manejo cotidiano del celular, que busca
una herramienta clara, cercana y elegante, no un software empresarial.

## Propuesta de valor

Centralizar en un solo lugar todos los datos y decisiones de la fiesta, con una
visión clara del presupuesto y del cronograma, y —en etapas futuras— una
asistente de IA especializada que dé recomendaciones personalizadas y
coherentes entre sí.

## Diferencial

- Enfoque específico en fiestas de 15 (no un planificador de eventos genérico).
- Contexto local (Uruguay: departamentos, moneda UYU/USD, tono rioplatense).
- IA pensada como organizadora personalizada que mantiene coherencia entre
  vestido, salón, torta, invitaciones, decoración, iluminación, peinado y
  maquillaje.

## Principales pain points

- Presupuesto difícil de distribuir y controlar.
- Falta de una línea de tiempo clara con hitos.
- Dificultad para comparar y elegir proveedores.
- Ideas visuales dispersas y sin traducción a decisiones concretas.

## Alcance del MVP (esta etapa)

- Creación y persistencia local del evento.
- Dashboard con métricas del evento.
- Presupuesto de referencia con gráfico.
- Catálogo de proveedores ficticios con filtros.
- Inspiración con previsualización local de imagen.
- Cronograma calculado desde la fecha.
- Infraestructura de IA lista, sin llamadas reales.

## Rol futuro de la IA

- Recomendar cómo distribuir el presupuesto.
- Crear un cronograma personalizado.
- Recomendar estilos, colores y decoración.
- Adaptar recomendaciones según decisiones anteriores.
- Analizar imágenes de vestidos o decoraciones.
- Mantener coherencia entre los elementos de la fiesta.
- Recomendar proveedores según ciudad, presupuesto y preferencias.

## Limitaciones actuales

- Sin autenticación ni base de datos en la nube (solo `localStorage`).
- Proveedores y métricas de gasto son ficticios (demo).
- La IA todavía no está conectada; no se genera ningún resultado real.
- La edición del evento reinicia el formulario (sin precarga de datos aún).

## Supuestos iniciales

- La usuaria organiza una única fiesta activa por navegador.
- El presupuesto se maneja en UYU o USD.
- La cantidad de invitados razonable está entre 20 y 500.
- La fecha de la fiesta es futura al momento de crear el evento.

## User persona preliminar

> **Nota:** esta persona es una **construcción de diseño**, no una persona real.
> Se usa solo para orientar decisiones de producto.

**Sofía, 14 años — Montevideo.**
Está terminando el liceo y sueña con una fiesta elegante con toques románticos.
Usa el celular todo el día, sigue cuentas de inspiración y le gusta tener todo
ordenado. Su mamá acompaña la organización y controla el presupuesto. Buscan una
herramienta simple que las ayude a decidir sin sentirse abrumadas, con una
estética linda y un tono cercano que no la trate como a una nena.
