const fs = require("fs");
const path = require("path");
const {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  HeadingLevel,
  ImageRun,
  PageBreak,
  PageNumber,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} = require("docx");

const ROOT = path.resolve(__dirname, "..");
const OUTPUT = path.join(ROOT, "deliverables", "AI15-documento-de-proyecto.docx");
const ASSETS = path.join(ROOT, "deliverables", "assets");

const COLORS = {
  dark: "2D3130",
  pink: "D0507C",
  pinkLight: "F8E9EF",
  gold: "D6B86B",
  goldLight: "F7F0DC",
  mist: "EAF3F2",
  gray: "6C7270",
  line: "DED9DC",
  white: "FFFFFF",
};

const noBorders = {
  top: { style: BorderStyle.NONE, size: 0, color: COLORS.white },
  bottom: { style: BorderStyle.NONE, size: 0, color: COLORS.white },
  left: { style: BorderStyle.NONE, size: 0, color: COLORS.white },
  right: { style: BorderStyle.NONE, size: 0, color: COLORS.white },
  insideHorizontal: { style: BorderStyle.NONE, size: 0, color: COLORS.white },
  insideVertical: { style: BorderStyle.NONE, size: 0, color: COLORS.white },
};

const lightBorders = {
  top: { style: BorderStyle.SINGLE, size: 6, color: COLORS.line },
  bottom: { style: BorderStyle.SINGLE, size: 6, color: COLORS.line },
  left: { style: BorderStyle.SINGLE, size: 6, color: COLORS.line },
  right: { style: BorderStyle.SINGLE, size: 6, color: COLORS.line },
  insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: COLORS.line },
  insideVertical: { style: BorderStyle.SINGLE, size: 4, color: COLORS.line },
};

function txt(text, options = {}) {
  return new TextRun({ text, font: options.font || "Aptos", ...options });
}

function p(text, options = {}) {
  const children = Array.isArray(text) ? text : [txt(text, options.run || {})];
  return new Paragraph({
    children,
    spacing: { after: options.after ?? 150, line: options.line ?? 300 },
    alignment: options.alignment,
    indent: options.indent,
    bullet: options.bullet,
    keepNext: options.keepNext,
  });
}

function bullet(text, level = 0) {
  return p(text, { bullet: { level }, after: 80 });
}

function heading(text, level = 1, pageBreakBefore = false) {
  return new Paragraph({
    text,
    heading:
      level === 1
        ? HeadingLevel.HEADING_1
        : level === 2
          ? HeadingLevel.HEADING_2
          : HeadingLevel.HEADING_3,
    pageBreakBefore,
    spacing: { before: level === 1 ? 80 : 220, after: level === 1 ? 220 : 120 },
    keepNext: true,
  });
}

function sectionTitle(number, title, intro) {
  const content = [heading(`${number}. ${title}`, 1, true)];
  if (intro) {
    content.push(
      new Paragraph({
        children: [txt(intro, { size: 25, color: COLORS.gray, italics: true })],
        spacing: { after: 260, line: 340 },
      }),
    );
  }
  return content;
}

function label(text) {
  return new Paragraph({
    children: [txt(text.toUpperCase(), { bold: true, size: 17, color: COLORS.pink, characterSpacing: 45 })],
    spacing: { after: 90 },
  });
}

function callout(title, body, fill = COLORS.pinkLight) {
  return new Paragraph({
    children: [
      txt(title, { bold: true, color: COLORS.dark }),
      txt(` ${body}`, { color: COLORS.dark }),
    ],
    shading: { fill, type: ShadingType.CLEAR },
    border: {
      left: { style: BorderStyle.SINGLE, size: 18, color: COLORS.pink },
    },
    indent: { left: 220, right: 220 },
    spacing: { before: 120, after: 220, line: 320 },
    keepLines: true,
  });
}

function table(headers, rows) {
  const runs = [
    txt(headers.join("  ·  ").toUpperCase(), {
      bold: true,
      size: 18,
      color: COLORS.pink,
    }),
  ];
  rows.forEach((row) => {
    runs.push(
      txt(String(row[0]), { bold: true, size: 19, break: 1 }),
      txt(` — ${row.slice(1).join("  |  ")}`, { size: 19, color: COLORS.dark }),
    );
  });
  return new Paragraph({
    children: runs,
    shading: { fill: "F7F7F7", type: ShadingType.CLEAR },
    border: {
      top: { style: BorderStyle.SINGLE, size: 6, color: COLORS.line },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: COLORS.line },
      left: { style: BorderStyle.SINGLE, size: 6, color: COLORS.line },
      right: { style: BorderStyle.SINGLE, size: 6, color: COLORS.line },
    },
    indent: { left: 180, right: 180 },
    spacing: { before: 80, after: 220, line: 330 },
    keepLines: true,
  });
}

function codeBlock(lines) {
  return new Paragraph({
    children: lines.map((line, index) =>
      txt(line || " ", {
        font: "Consolas",
        size: 17,
        color: "F4F4F4",
        break: index === 0 ? undefined : 1,
      }),
    ),
    shading: { fill: "252A29", type: ShadingType.CLEAR },
    indent: { left: 200, right: 200 },
    spacing: { before: 80, after: 220, line: 260 },
    keepLines: true,
  });
}

function pngSize(buffer) {
  if (buffer.toString("ascii", 1, 4) !== "PNG") return { width: 1, height: 1 };
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function imageParagraph(fileName, width, caption) {
  const filePath = path.join(ASSETS, fileName);
  const data = fs.readFileSync(filePath);
  const dimensions = pngSize(data);
  const height = Math.round((width * dimensions.height) / dimensions.width);
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new ImageRun({ data, type: "png", transformation: { width, height } })],
      spacing: { before: 100, after: 80 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [txt(caption, { size: 17, italics: true, color: COLORS.gray })],
      spacing: { after: 180 },
    }),
  ];
}

function screenshotPair(left, right) {
  function picture(item) {
    const data = fs.readFileSync(path.join(ASSETS, item.file));
    const dimensions = pngSize(data);
    const width = 220;
    const height = Math.round((width * dimensions.height) / dimensions.width);
    return new ImageRun({ data, type: "png", transformation: { width, height } });
  }
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      picture(left),
      txt("     "),
      picture(right),
      txt(`${left.caption}     |     ${right.caption}`, {
        break: 1,
        size: 17,
        italics: true,
        color: COLORS.gray,
      }),
    ],
    spacing: { before: 100, after: 220, line: 270 },
  });
}

function spacer(points = 160) {
  return new Paragraph({ children: [], spacing: { after: points } });
}

const indexItems = [
  "Introducción",
  "Modalidad elegida",
  "Problema o necesidad",
  "Público objetivo",
  "User Persona",
  "Investigación y competencia",
  "Ideación",
  "Wireframes",
  "Tecnologías",
  "Integración de IA",
  "APIs utilizadas",
  "Desarrollo",
  "Prompts",
  "Aprendizajes",
  "Seguridad (API Keys)",
];

const children = [];

// Portada
children.push(
  spacer(400),
  new Paragraph({
    children: [
      txt("AI", { font: "Aptos Display", bold: true, size: 76, color: COLORS.gold }),
      txt("15", { font: "Aptos Display", size: 76, color: COLORS.dark }),
    ],
    spacing: { after: 650 },
  }),
  label("Diseño interactivo · Proyecto nuevo · MVP"),
  new Paragraph({
    children: [txt("Documento de proyecto", { font: "Aptos Display", bold: true, size: 56, color: COLORS.dark })],
    spacing: { after: 180 },
  }),
  new Paragraph({
    children: [txt("Planificador inteligente y mobile-first para fiestas de 15", { size: 28, color: COLORS.gray })],
    spacing: { after: 800, line: 360 },
  }),
  callout(
    "Estado del proyecto:",
    "MVP operativo, testeable, con inteligencia artificial real mediante Gemini y datos de demostración hardcodeados.",
    COLORS.mist,
  ),
  spacer(900),
  table(
    ["Campo", "Información"],
    [
      ["Estudiante", "________________________________________"],
      ["Proyecto", "AI15"],
      ["Curso", "Diseño Interactivo"],
      ["Fecha", "Julio de 2026"],
    ],
    [28, 72],
  ),
  new Paragraph({ children: [new PageBreak()] }),
);

// Índice estático y visible en cualquier visor.
children.push(
  heading("Índice", 1, false),
  p(
    "La estructura sigue el proceso completo del proyecto: desde la definición del problema hasta la implementación, la integración de IA y la seguridad.",
    { run: { color: COLORS.gray }, after: 250 },
  ),
  table(
    ["N.º", "Sección"],
    indexItems.map((item, index) => [String(index + 1).padStart(2, "0"), item]),
    [16, 84],
  ),
);

// 1. Introducción
children.push(
  ...sectionTitle(1, "Introducción", "AI15 transforma la organización de una fiesta de 15 en un proceso claro, visual y accionable desde el celular."),
  heading("Resumen del proyecto", 2),
  p("AI15 es una aplicación mobile-first dirigida a quinceañeras y familias de Uruguay. Centraliza los datos del evento, el presupuesto, el cronograma, los proveedores de demostración y las referencias visuales. Sobre ese contexto, Gemini genera un plan personalizado y una distribución sugerida del presupuesto."),
  heading("Objetivo general", 2),
  p("Reducir la desorganización y la sobrecarga de decisiones durante la preparación de una fiesta de 15, ofreciendo un único espacio para registrar información y obtener orientación contextual mediante IA."),
  heading("Estado del MVP", 2),
  bullet("Flujo de onboarding y carga de una fiesta mediante un formulario de tres pasos."),
  bullet("Dashboard, presupuesto, cronograma, inspiración, proveedores y cuenta."),
  bullet("Usuario y datos iniciales hardcodeados para una demostración reproducible."),
  bullet("Dos features reales de IA: plan integral y distribución presupuestal."),
  bullet("Validación de entradas y salidas con Zod; errores traducidos a mensajes comprensibles."),
  callout("Propuesta de valor:", "organizar toda la fiesta en un solo lugar y convertir datos dispersos en próximos pasos coherentes.", COLORS.goldLight),
);

// 2. Modalidad
children.push(
  ...sectionTitle(2, "Modalidad elegida", "Proyecto nuevo desarrollado como MVP funcional y evaluable."),
  heading("Tipo de entrega", 2),
  p("La modalidad elegida es un proyecto nuevo. No se presenta solamente una idea, un prototipo visual o una automatización aislada: se entrega una aplicación ejecutable con recorridos concretos, datos de ejemplo e integración real de inteligencia artificial."),
  heading("Criterios que cumple", 2),
  table(
    ["Criterio", "Respuesta del proyecto"],
    [
      ["Operativo", "Puede instalarse y ejecutarse localmente con Node.js y npm."],
      ["Testeable", "Incluye usuario demo, evento cargado y un recorrido de validación."],
      ["Necesidad concreta", "Ordenar presupuesto, tareas y decisiones de una fiesta de 15."],
      ["Público definido", "Quinceañeras y familias uruguayas que organizan desde el celular."],
      ["IA evaluable", "Los botones de Plan y Presupuesto invocan Gemini y muestran resultados estructurados."],
      ["Coherencia", "Problema, lenguaje, interfaz mobile y respuestas de IA comparten el mismo contexto."],
    ],
    [27, 73],
  ),
  heading("Decisión de alcance", 2),
  p("El MVP prioriza organización y personalización. No incluye autenticación real, base de datos, pagos ni búsqueda de proveedores en servicios externos. El catálogo de proveedores es ficticio, está hardcodeado y se identifica como demostración."),
);

// 3. Problema
children.push(
  ...sectionTitle(3, "Problema o necesidad", "Organizar una fiesta implica coordinar muchas variables durante meses y con un presupuesto limitado."),
  heading("Situación actual", 2),
  p("La información suele quedar repartida entre chats, notas, planillas, capturas de pantalla y conversaciones familiares. Esto vuelve difícil conocer el estado real de la organización y decidir qué hacer primero."),
  heading("Principales dolores", 2),
  table(
    ["Dolor", "Consecuencia"],
    [
      ["Presupuesto fragmentado", "Gastos duplicados, prioridades poco claras y riesgo de excederse."],
      ["Fechas dispersas", "Tareas importantes se realizan tarde o se olvidan."],
      ["Demasiadas decisiones", "Estrés y dificultad para mantener una estética coherente."],
      ["Ideas sin contexto", "La inspiración visual no se traduce fácilmente en acciones."],
      ["Herramientas genéricas", "No hablan el lenguaje de una quinceañera ni contemplan el contexto local."],
    ],
    [35, 65],
  ),
  heading("Pregunta de diseño", 2),
  callout("¿Cómo podríamos", "ayudar a una quinceañera y su familia a organizar presupuesto, tiempos y estilo desde el celular, sin aumentar su carga mental?", COLORS.pinkLight),
  heading("Necesidad validable", 2),
  p("La propuesta se valida observando si una persona puede comprender el estado de su fiesta, registrar un gasto, revisar tareas y obtener un plan personalizado sin recurrir a otras herramientas durante el recorrido principal."),
);

// 4. Público
children.push(
  ...sectionTitle(4, "Público objetivo", "El producto se diseña para una experiencia compartida entre adolescente y familia, con prioridad de uso desde el celular."),
  heading("Público principal", 2),
  p("Adolescentes de 14 a 16 años residentes en Uruguay que participan activamente en la organización de su fiesta. Consumen referencias visuales, usan el teléfono como dispositivo principal y esperan una experiencia clara, contemporánea y cercana."),
  heading("Público secundario", 2),
  p("Madres, padres o referentes adultos que acompañan las decisiones y controlan el presupuesto. Necesitan información ordenada, cifras visibles y próximos pasos verificables."),
  heading("Contexto y requisitos", 2),
  bullet("Ubicación inicial: Uruguay; departamentos y monedas UYU/USD."),
  bullet("Dispositivo prioritario: smartphone en orientación vertical."),
  bullet("Tono: rioplatense, cercano y elegante; evita infantilizar."),
  bullet("Interfaz: botones grandes, navegación inferior y contenidos breves."),
  bullet("Uso: sesiones cortas para revisar el estado o completar una acción concreta."),
  heading("Hipótesis de valor", 2),
  p("Si presupuesto, cronograma, decisiones e inspiración conviven en una experiencia mobile y la IA utiliza ese contexto, las usuarias podrán decidir con mayor claridad y reducir la sensación de desorden."),
);

// 5. Persona
children.push(
  ...sectionTitle(5, "User Persona", "La persona es una construcción de diseño utilizada para orientar decisiones; no representa una entrevistada real."),
  table(
    ["Dato", "Definición"],
    [
      ["Nombre", "Sofía (Sofi)"],
      ["Edad", "14 años"],
      ["Ubicación", "Montevideo, Uruguay"],
      ["Rol", "Quinceañera; organiza junto con su madre"],
      ["Dispositivo", "Celular como pantalla principal"],
      ["Objetivo", "Lograr una fiesta elegante, romántica y bien organizada"],
    ],
    [27, 73],
  ),
  heading("Comportamientos", 2),
  bullet("Guarda referencias de vestidos, decoración y peinados en redes sociales."),
  bullet("Prefiere interfaces visuales y mensajes cortos."),
  bullet("Consulta decisiones con su familia y necesita entender el impacto económico."),
  bullet("Puede sentirse abrumada cuando muchas tareas parecen igualmente urgentes."),
  heading("Frustraciones", 2),
  bullet("No saber por dónde empezar ni qué tarea vence primero."),
  bullet("Tener ideas lindas que no combinan entre sí o no entran en el presupuesto."),
  bullet("Percibir las planillas tradicionales como frías y poco adaptadas a su edad."),
  heading("Escenario de uso", 2),
  p("Sofi abre AI15 desde el celular, carga los datos principales de la fiesta, revisa el presupuesto con su madre y genera un plan. La aplicación devuelve prioridades, una propuesta estética y advertencias; luego ambas incorporan las tareas sugeridas al cronograma."),
  callout("Frase guía:", "Quiero que mi fiesta se vea como la imagino, pero necesito saber qué decidir primero y cuánto puedo gastar.", COLORS.goldLight),
);

// 6. Investigación
children.push(
  ...sectionTitle(6, "Investigación y competencia", "Se realizó una exploración de escritorio para entender alternativas, patrones y oportunidades; no se presentan entrevistas como si hubieran ocurrido."),
  heading("Referencias de uso", 2),
  table(
    ["Alternativa", "Fortaleza", "Oportunidad para AI15"],
    [
      ["Planillas", "Flexibles y conocidas", "Reducir carga manual y traducir datos en recomendaciones."],
      ["Trello / Notion", "Organización por tareas", "Ofrecer una experiencia específica para fiestas de 15."],
      ["Pinterest / Instagram", "Inspiración visual abundante", "Conectar referencias con presupuesto, estilo y acciones."],
      ["Apps de eventos", "Listas y cronogramas", "Adaptar tono, contexto uruguayo y decisiones de una quinceañera."],
      ["Asistentes genéricos", "Generación flexible", "Usar datos estructurados del evento y validar la respuesta."],
    ],
    [25, 31, 44],
  ),
  heading("Hallazgos de diseño", 2),
  bullet("La inspiración sola no resuelve la ejecución; debe convertirse en decisiones y tareas."),
  bullet("Una herramienta genérica exige configurar demasiadas estructuras antes de aportar valor."),
  bullet("El presupuesto y la fecha condicionan casi todas las recomendaciones."),
  bullet("La IA resulta más útil cuando recibe el contexto completo y devuelve una forma controlada."),
  heading("Diferencial", 2),
  p("AI15 combina dominio específico, interfaz mobile, contexto local y generación estructurada. No intenta reemplazar contratos, cotizaciones ni decisiones familiares: funciona como una organizadora orientativa."),
);

// 7. Ideación
children.push(
  ...sectionTitle(7, "Ideación", "Las ideas se priorizaron según valor para la usuaria, viabilidad dentro del MVP y capacidad de prueba."),
  heading("Ideas consideradas", 2),
  bullet("Dashboard general con avance, presupuesto y próxima tarea."),
  bullet("Cronograma calculado desde la fecha de la fiesta."),
  bullet("Distribución de presupuesto mediante IA."),
  bullet("Plan completo con logística, estética, recomendaciones y advertencias."),
  bullet("Catálogo de proveedores de demostración con filtros."),
  bullet("Tablero de inspiración con carga local de imágenes."),
  bullet("Autenticación, persistencia en nube y proveedores reales como evoluciones futuras."),
  heading("Priorización del MVP", 2),
  table(
    ["Nivel", "Features"],
    [
      ["Imprescindible", "Evento, dashboard, presupuesto, cronograma, usuario demo y plan con IA."],
      ["Importante", "Inspiración, catálogo demo, decisiones confirmadas y mensajes de error."],
      ["Futuro", "Login real, base de datos, análisis visual, proveedores reales y notificaciones."],
    ],
    [25, 75],
  ),
  heading("Flujo principal", 2),
  p("Onboarding → Ver demo o crear evento → Dashboard → Presupuesto / Plan con IA → Incorporar tareas → Revisar cronograma."),
  heading("Criterio de éxito", 2),
  p("Una usuaria de prueba debe poder completar el recorrido sin explicación externa, distinguir datos demo de datos reales y comprender que las respuestas de IA son sugerencias que requieren validación familiar."),
);

// 8. Wireframes
children.push(
  ...sectionTitle(8, "Wireframes", "El diseño se concibió para mobile desde el inicio, con marcos de teléfono, jerarquía compacta y acciones alcanzables con el pulgar."),
  heading("Principios de interfaz", 2),
  bullet("Una tarea principal por pantalla y CTA destacado."),
  bullet("Tarjetas con bordes suaves, contraste alto y lenguaje breve."),
  bullet("Navegación inferior persistente en el área de planificación."),
  bullet("Tipografía de lectura mobile y paleta rosa, ciruela, dorado y neutros."),
  screenshotPair(
    { file: "onboarding.png", caption: "Onboarding dentro de un marco mobile." },
    { file: "crear-evento.png", caption: "Carga guiada del evento en tres pasos." },
  ),
  new Paragraph({ children: [new PageBreak()] }),
  heading("Evolución a interfaz de alta fidelidad", 2),
  p("Los wireframes evolucionaron a pantallas funcionales conservando la misma jerarquía: resumen primero, acciones primarias visibles y detalle progresivo."),
  screenshotPair(
    { file: "dashboard.png", caption: "Dashboard con estado general de la fiesta." },
    { file: "presupuesto.png", caption: "Presupuesto y generación asistida por IA." },
  ),
  ...imageParagraph("cronograma.png", 250, "Cronograma mobile con tareas y fechas calculadas."),
);

// 9. Tecnologías
children.push(
  ...sectionTitle(9, "Tecnologías", "El stack prioriza tipado, componentes reutilizables, validación y una separación clara entre navegador y servidor."),
  table(
    ["Tecnología", "Uso"],
    [
      ["Next.js 14", "App Router, rutas, renderizado y endpoints internos."],
      ["React 18 + TypeScript", "Componentes y modelo de dominio con tipado estricto."],
      ["Tailwind CSS", "Sistema visual responsive y mobile-first."],
      ["Zustand", "Estado temporal de la sesión sin localStorage."],
      ["React Hook Form + Zod", "Formularios y validación de entradas."],
      ["Lucide React", "Iconografía consistente."],
      ["Gemini 2.5 Flash", "Generación del plan y distribución presupuestal."],
    ],
    [31, 69],
  ),
  heading("Arquitectura resumida", 2),
  codeBlock([
    "src/app/                 Pantallas y rutas API",
    "src/components/          UI, formularios y features",
    "src/data/                Usuario y datos demo hardcodeados",
    "src/lib/ai/              Contexto, prompts, schemas y proxy",
    "src/store/               Estado Zustand en memoria",
    "src/types/               Tipos del dominio",
  ]),
  heading("Decisión mobile", 2),
  p("Aunque Next.js utiliza tecnologías web, el producto se presenta y prueba como una experiencia mobile: viewport angosto, navegación táctil, marcos de dispositivo y composición vertical. El diseño de escritorio no es el caso de uso principal."),
);

// 10. Integración IA
children.push(
  ...sectionTitle(10, "Integración de IA", "La IA no es decorativa: interpreta variables relacionadas y produce una guía que sería costosa de escribir manualmente para cada fiesta."),
  heading("Servicio y modelo", 2),
  table(
    ["Elemento", "Implementación"],
    [
      ["Proveedor", "Proxy estudiantil Gemini / Vertex"],
      ["Modelo", "gemini-2.5-flash"],
      ["Rol", "Organizadora orientativa especializada en fiestas de 15"],
      ["Interacción", "Botones específicos; no es un chat abierto"],
      ["Formato", "JSON estructurado, validado con Zod"],
    ],
    [28, 72],
  ),
  heading("Features evaluables", 2),
  bullet("Plan integral: resumen, presupuesto, cronograma, propuesta estética, recomendaciones y advertencias."),
  bullet("Presupuesto inteligente: porcentajes por categoría con justificación, normalizados al total disponible."),
  heading("Datos que recibe", 2),
  p("Fecha, ubicación, homenajeada, invitados, presupuesto, estilos, temática, colores, gastos, decisiones confirmadas, proveedores seleccionados y descripciones de inspiración."),
  heading("Flujo técnico", 2),
  p("Interfaz → contexto validado → endpoint Next.js → prompt + schema → proxy Gemini → parseo de JSON → validación Zod → normalización → resultado visible."),
  heading("Decisión de robustez", 2),
  p("El plan completo se divide en dos generaciones breves y paralelas: una logística y otra creativa. Luego se combinan y validan. Esta decisión reduce el riesgo de respuestas truncadas y mantiene el resultado predecible."),
  heading("Limitaciones", 2),
  bullet("Puede producir recomendaciones imprecisas o demasiado generales."),
  bullet("No conoce precios, contratos ni disponibilidad real de proveedores."),
  bullet("Depende de la conectividad, del proxy y de una API key válida."),
  bullet("La familia debe revisar costos, fechas y decisiones antes de actuar."),
);

// 11. APIs
children.push(
  ...sectionTitle(11, "APIs utilizadas", "El alcance actual utiliza una sola API externa. Los proveedores se mantienen hardcodeados para asegurar una demo reproducible."),
  heading("API externa", 2),
  table(
    ["API", "Función", "Configuración"],
    [["Gemini / Vertex Proxy", "Generación estructurada de plan y presupuesto", "GEMINI_PROXY_API_KEY"]],
    [28, 43, 29],
  ),
  heading("Endpoints internos", 2),
  table(
    ["Ruta", "Responsabilidad"],
    [
      ["POST /api/ai/plan", "Genera en paralelo la parte logística y creativa, las combina y valida."],
      ["POST /api/ai/budget", "Genera la distribución porcentual y normaliza importes."],
    ],
    [34, 66],
  ),
  heading("Configuración", 2),
  codeBlock([
    "GEMINI_PROXY_API_KEY=CLAVE_ENTREGADA_POR_EL_CURSO",
    "GEMINI_PROXY_BASE_URL=https://gemini-vertex-student-proxy.vercel.app",
    "GEMINI_TEXT_MODEL=gemini-2.5-flash",
  ]),
  heading("Proveedores", 2),
  p("No existe una API externa de proveedores ni se realiza scraping. El archivo src/data/providers.ts contiene negocios ficticios con isMock: true, rangos de precio orientativos y etiquetas. Este contenido permite probar búsqueda, filtros y tarjetas sin depender de otra cuenta o servicio."),
  callout("Alcance declarado:", "los datos demo no deben interpretarse como recomendaciones comerciales ni como cotizaciones reales.", COLORS.goldLight),
);

// 12. Desarrollo
children.push(
  ...sectionTitle(12, "Desarrollo", "El MVP se implementó por capas: dominio y datos, recorridos mobile, estado, IA estructurada y verificación."),
  heading("Etapas realizadas", 2),
  table(
    ["Etapa", "Resultado"],
    [
      ["1. Definición", "Problema, público, user persona, propuesta y alcance."],
      ["2. Experiencia", "Onboarding, formulario, dashboard y navegación mobile."],
      ["3. Organización", "Presupuesto, cronograma, proveedores e inspiración."],
      ["4. IA", "Contexto, prompts, schemas, endpoints y manejo de errores."],
      ["5. Curaduría", "Límites de longitud, decisiones confirmadas y warnings."],
      ["6. Verificación", "TypeScript, ESLint y pruebas reales de endpoints."],
    ],
    [26, 74],
  ),
  heading("Instalación y ejecución", 2),
  codeBlock([
    "npm ci",
    "Copy-Item .env.example .env.local",
    "# completar GEMINI_PROXY_API_KEY",
    "npm run dev",
    "# abrir http://localhost:3000",
  ]),
  heading("Credenciales y datos de prueba", 2),
  table(
    ["Campo", "Valor"],
    [
      ["Nombre", "Sofi"],
      ["Correo", "sofi@ai15.demo"],
      ["Rol", "Quinceañera"],
      ["Contraseña", "No corresponde: no hay login"],
      ["Persistencia", "Memoria de sesión; al recargar se restaura la demo"],
    ],
    [30, 70],
  ),
  heading("Recorrido de prueba", 2),
  bullet("Entrar mediante Ver demo y revisar el dashboard."),
  bullet("Generar distribución con IA desde Presupuesto."),
  bullet("Generar el plan y agregar tareas sugeridas al cronograma."),
  bullet("Probar filtros en Proveedores > Ejemplos."),
  bullet("Ejecutar npx tsc --noEmit, npm run lint y npm run build."),
);

// 13. Prompts
children.push(
  ...sectionTitle(13, "Prompts", "Los prompts se construyen desde datos estructurados del evento y se acompañan con un schema de salida."),
  heading("Reglas de sistema principales", 2),
  bullet("Responder siempre en español rioplatense, con tono cercano y elegante."),
  bullet("No inventar proveedores, precios concretos, direcciones ni disponibilidad."),
  bullet("No superar el presupuesto y mantener coherencia estética."),
  bullet("Priorizar según los días restantes y respetar decisiones confirmadas."),
  bullet("Señalar incertidumbre mediante warnings."),
  bullet("Devolver exclusivamente JSON válido según el esquema."),
  heading("Prompt logístico", 2),
  codeBlock([
    "Generá una versión MUY CONCISA de la parte logística del plan.",
    "Incluí exactamente 4 categorías de presupuesto; la suma debe ser 100.",
    "Incluí exactamente 3 tareas prioritarias con fecha YYYY-MM-DD.",
    "No agregues introducciones ni campos no solicitados.",
  ]),
  heading("Prompt creativo", 2),
  codeBlock([
    "Generá un resumen y una propuesta estética muy concisos.",
    "Incluí 3 colores, 2 recomendaciones y como máximo una advertencia.",
    "No incluyas presupuesto ni cronograma.",
  ]),
  heading("Prompt de presupuesto", 2),
  codeBlock([
    "Proponé una distribución adaptada a esta fiesta.",
    "Incluí entre 4 y 5 categorías y porcentajes que sumen 100.",
    "No calcules importes en dinero; la aplicación los normaliza.",
  ]),
  heading("Curaduría", 2),
  p("Se redujo la longitud de campos, se separaron responsabilidades y se desactivó el presupuesto interno de thinking para evitar que el JSON quedara truncado. La respuesta nunca se usa directamente: primero se parsea, valida y normaliza."),
);

// 14. Aprendizajes
children.push(
  ...sectionTitle(14, "Aprendizajes", "El proceso mostró que integrar IA implica diseñar contexto, formato, validación, errores y expectativas; no solamente enviar un prompt."),
  heading("Aprendizajes de producto", 2),
  bullet("La especialización en fiestas de 15 permite una experiencia más clara que una herramienta genérica."),
  bullet("Mobile-first obliga a priorizar información y reducir la carga visual."),
  bullet("Los datos demo bien identificados hacen que el MVP sea reproducible sin fingir información real."),
  heading("Aprendizajes técnicos", 2),
  bullet("Los modelos pueden devolver JSON incompleto aun cuando se solicita salida estructurada."),
  bullet("Dividir una generación compleja en llamadas breves mejora la estabilidad."),
  bullet("Zod protege la interfaz frente a respuestas con formas inesperadas."),
  bullet("Los mensajes de error deben ayudar a reintentar sin filtrar detalles sensibles."),
  heading("Limitaciones y próximos pasos", 2),
  table(
    ["Limitación actual", "Evolución posible"],
    [
      ["Estado temporal", "Autenticación y base de datos con cuentas familiares."],
      ["Proveedores ficticios", "Fuente verificada, carga propia o acuerdos con comercios."],
      ["Inspiración descriptiva", "Análisis multimodal con consentimiento."],
      ["Sin notificaciones", "Recordatorios opcionales y configurables."],
      ["Sin pruebas con usuarios documentadas", "Sesiones moderadas y medición de tareas."],
    ],
    [38, 62],
  ),
  heading("Criterio de responsabilidad", 2),
  p("AI15 acompaña la organización, pero no reemplaza la revisión de presupuestos, contratos, disponibilidad ni decisiones de la familia."),
);

// 15. Seguridad
children.push(
  ...sectionTitle(15, "Seguridad (API Keys)", "La credencial de Gemini permanece en el servidor y nunca se entrega al navegador ni se incluye en el repositorio."),
  heading("Medidas implementadas", 2),
  bullet("La clave se guarda en .env.local, archivo ignorado por Git."),
  bullet("La variable no utiliza el prefijo NEXT_PUBLIC_."),
  bullet("El cliente Gemini importa server-only; un uso accidental desde el navegador falla en build."),
  bullet("La cabecera Authorization se construye únicamente en la ruta del servidor."),
  bullet("La clave no se registra en logs ni se devuelve en mensajes de error."),
  bullet("Los errores externos se traducen a respuestas genéricas."),
  bullet("Existe timeout mediante AbortController y límite de tamaño para prompts."),
  bullet("Entradas y salidas se validan antes de incorporarse al estado."),
  heading("Configuración segura", 2),
  codeBlock([
    "# .env.local (NO subir al repositorio)",
    "GEMINI_PROXY_API_KEY=...",
    "GEMINI_PROXY_BASE_URL=https://gemini-vertex-student-proxy.vercel.app",
    "GEMINI_TEXT_MODEL=gemini-2.5-flash",
  ]),
  heading("Qué no debe hacerse", 2),
  bullet("No pegar la clave en componentes React, capturas, PDFs o documentación."),
  bullet("No compartir .env.local ni convertir la clave en NEXT_PUBLIC_."),
  bullet("No mostrar el cuerpo completo de errores del proveedor a la usuaria."),
  bullet("Si una clave se expone, revocarla y generar otra inmediatamente."),
  heading("Cierre", 2),
  callout("Resultado:", "el proyecto entrega una solución coherente y testeable, con IA real, alcance transparente, datos demo reproducibles y medidas concretas de seguridad.", COLORS.mist),
);

const document = new Document({
  creator: "AI15",
  title: "AI15 — Documento de proyecto",
  subject: "MVP mobile con integración de inteligencia artificial",
  description: "Documento de proyecto de AI15 con índice, proceso, integración de IA, prompts y seguridad.",
  styles: {
    default: {
      document: {
        run: { font: "Aptos", size: 21, color: COLORS.dark },
        paragraph: { spacing: { after: 150, line: 300 } },
      },
      heading1: {
        run: { font: "Aptos Display", size: 38, bold: true, color: COLORS.dark },
        paragraph: { spacing: { before: 120, after: 220 }, outlineLevel: 0 },
      },
      heading2: {
        run: { font: "Aptos Display", size: 27, bold: true, color: COLORS.dark },
        paragraph: { spacing: { before: 220, after: 110 }, outlineLevel: 1 },
      },
      heading3: {
        run: { font: "Aptos", size: 23, bold: true, color: COLORS.pink },
        paragraph: { spacing: { before: 170, after: 90 }, outlineLevel: 2 },
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 900, right: 1050, bottom: 900, left: 1050, header: 450, footer: 450 },
        },
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              border: { top: { style: BorderStyle.SINGLE, size: 4, color: COLORS.line } },
              children: [
                txt("AI15 · Documento de proyecto", { size: 16, color: COLORS.gray }),
                txt("                                                            ", { size: 16 }),
                txt("Página ", { size: 16, color: COLORS.gray }),
                new TextRun({ children: [PageNumber.CURRENT], size: 16, color: COLORS.gray }),
              ],
              spacing: { before: 80 },
            }),
          ],
        }),
      },
      children,
    },
  ],
});

Packer.toBuffer(document)
  .then((buffer) => {
    fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
    fs.writeFileSync(OUTPUT, buffer);
    console.log(OUTPUT);
    console.log(`${buffer.length} bytes`);
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
