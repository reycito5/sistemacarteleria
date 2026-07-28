import {
  viewContentSchema,
  type ViewContent,
  type ViewContentInput,
} from "@/lib/views/schemas";

/**
 * Contenido de ejemplo del catálogo completo de vistas institucionales.
 *
 * Sirve para la galería de plantillas y para el reproductor de demostración
 * mientras no exista una playlist real publicada desde el panel. Las cinco
 * primeras reproducen las referencias visuales originales.
 */
const SAMPLE_INPUTS: ViewContentInput[] = [
  {
    kind: "programacion_general",
    headlineEyebrow: "Oferta de posgrado",
    headline: "Impulsa tu carrera profesional con un posgrado de la UABJB",
    subheadline:
      "Doctorados · Maestrías · Especialidades · Diplomados pensados para la realidad beniana.",
    cardEyebrow: "Vicerrectorado",
    sectionTitle: "Oferta académica",
    programs: [
      {
        name: "Maestría en Educación Superior",
        type: "Maestría",
        version: "IV Versión",
        modality: "Virtual",
        duration: "18 meses",
        credits: "64 créditos",
        dateShort: "17 AGO 2026",
        status: "open",
      },
      {
        name: "Especialidad en Gestión Universitaria",
        type: "Especialidad",
        version: "II Versión",
        modality: "Semipresencial",
        duration: "10 meses",
        credits: "40 créditos",
        dateShort: "24 AGO 2026",
        status: "open",
      },
      {
        name: "Diplomado en Tributación y Legislación Fiscal Boliviana",
        type: "Diplomado",
        version: "I Versión",
        modality: "Virtual",
        duration: "4 meses",
        credits: "20 créditos",
        dateShort: "14 SEP 2026",
        status: "soon",
      },
    ],
    nextLabel: "Agenda académica de la semana",
    qrCaption: "Explorar oferta completa",
  },
  {
    kind: "agenda",
    headlineEyebrow: "Semana académica",
    headline: "Actividades y defensas de esta semana",
    subheadline: "Coordinación académica · Dirección de Posgrado",
    badge: "Actividades",
    sectionTitle: "Agenda de la semana",
    items: [
      {
        title: "Defensa de tesis doctoral",
        time: "08:30",
        place: "Sala de Defensas · Doctorado en Educación Superior",
        status: "en_curso",
      },
      {
        title: "Coordinación académica",
        time: "10:00",
        place: "Dirección de Posgrado",
        status: "proxima",
      },
      {
        title: "Inicio de clases · Docencia Universitaria",
        time: "14:00",
        place: "Modalidad virtual",
        status: "proxima",
      },
      {
        title: "Taller de inducción",
        time: "16:30",
        place: "Auditorio del Vicerrectorado",
        status: "finalizada",
      },
    ],
    nextLabel: "Taller de inducción · 16:30",
  },
  {
    kind: "programa_destacado",
    badge: "Programa destacado",
    programName: "Diplomado en Manejo y Administración de Plataformas Virtuales",
    level: "Diplomado",
    version: "I Versión",
    parallel: 'Paralelo "A"',
    description:
      "Competencias técnicas y de gestión para administrar, configurar y optimizar plataformas educativas virtuales.",
    startDate: "31 de julio de 2026",
    modality: "Virtual",
    duration: "5 meses",
    credits: "20 créditos",
    hours: "800 horas académicas",
    phones: "72811478 · 71125341",
    audience: "Todos los profesionales",
    address: "Oficinas del Vicerrectorado de Posgrado",
    enrollmentOpen: true,
    quote: "Excelencia académica · Compromiso · Gestión",
    qrCaption: "Ver ficha completa e inscribirse",
  },
  {
    kind: "noticias",
    headlineEyebrow: "Titular institucional",
    headline: "UABJB firma convenio de cooperación académica con CEMLA",
    subheadline:
      "Fortalece la oferta de diplomados en tributación y legislación fiscal.",
    badge: "Institucional",
    title: "Noticias y logros",
    entries: [
      {
        title: "Convenio de cooperación académica con CEMLA",
        meta: "Fortalece la oferta de diplomados en tributación.",
        kind: "noticia",
      },
      {
        title: "Resumen del año académico 2025",
        meta: "Memoria audiovisual de logros institucionales",
        kind: "video",
        duration: "2:14",
      },
      {
        title: "Nueva convocatoria: Maestría en Educación Superior",
        meta: "Inscripciones abiertas hasta el 17 de agosto de 2026",
        kind: "noticia",
      },
      {
        title: "Testimonios de egresados 2025",
        meta: "Historias de titulación y aplicación profesional",
        kind: "video",
        duration: "3:08",
      },
    ],
    stats: [
      { value: "15", label: "Programas activos" },
      { value: "1,240+", label: "Profesionales titulados" },
    ],
  },
  {
    kind: "comunicado",
    badge: "Comunicado importante",
    title: "Suspensión temporal de atención administrativa",
    subtitle:
      "Por trabajos de mantenimiento eléctrico, la atención presencial se suspenderá el miércoles por la mañana.",
    body: "Las gestiones en línea continuarán con normalidad.",
    specs: [
      { label: "Fecha", value: "29 de julio de 2026" },
      { label: "Horario", value: "08:00 – 12:00" },
      { label: "Área responsable", value: "Dirección Administrativa" },
      { label: "Contacto", value: "escuelaposgrado@uabjb.edu.bo" },
    ],
    mediaEyebrow: "Vicerrectorado",
    mediaTitle: "Posgrado UABJB",
    mediaSub: "Trinidad · Beni",
  },
  {
    kind: "bienvenida",
    title: "Bienvenido al Vicerrectorado de Posgrado",
    subtitle: "Formación continua, especialización e investigación avanzada.",
    locations: [
      { label: "Recepción", place: "Planta baja" },
      { label: "Coordinación académica", place: "1er piso" },
      { label: "Sala de defensas", place: "1er piso, ala este" },
      { label: "Dirección de Posgrado", place: "1er piso" },
      { label: "Área administrativa", place: "2do piso" },
    ],
  },
  {
    kind: "reconocimientos",
    title: "Liderazgo en gestión de posgrado",
    badge: "Mérito institucional",
    items: [
      {
        name: "Dr. Camilo Antonio Rosas Ardaya, Ph.D.",
        role: "Vicerrector de Posgrado · UABJB",
        detail: "Acreditación internacional CIEES · Gestión 2023–2026",
      },
      {
        name: "Ampliación de la oferta académica",
        role: "",
        detail: "De 8 a 15 programas de posgrado en tres gestiones.",
      },
      {
        name: "Convenio internacional de acreditación",
        role: "",
        detail: "Gestionado con el CIEES de México.",
      },
    ],
    strapline:
      "Formar posgraduados con pertinencia amazónica es nuestro compromiso.",
  },
  {
    kind: "evento_vivo",
    badge: "En vivo",
    title: "Defensa pública de tesis doctoral",
    speaker: 'Modelo de Gestión Educativa "COMUNICA" · Doctorado en Educación Superior',
    schedule: [
      { time: "08:30", label: "Apertura y presentación del tribunal" },
      { time: "09:00", label: "Exposición del sustentante" },
      { time: "09:45", label: "Preguntas del tribunal" },
      { time: "10:30", label: "Deliberación y resultado" },
    ],
    qrCaption: "Seguir la transmisión",
  },
  {
    kind: "testimonio",
    name: "Ing. Fabiola Suárez Añez",
    program: "Maestría en Educación Superior · Gestión 2024",
    quote: "La Maestría me dio herramientas reales para mi región",
    result:
      "Egresada destacada que hoy aplica el modelo de gestión educativa aprendido en su institución.",
    strapline: "Profesionales que convierten el conocimiento en transformación",
  },
  {
    kind: "mensaje",
    authority: "Vicerrector de Posgrado · UABJB",
    name: "Dr. Camilo Antonio Rosas Ardaya, Ph.D.",
    quote:
      "Formar posgraduados con pertinencia amazónica es nuestro compromiso: cada programa responde a una necesidad real del Beni y de Bolivia.",
    message:
      "Desde el Posgrado impulsamos la formación, la investigación y el liderazgo al servicio del desarrollo regional.",
  },
  {
    kind: "sincronizacion",
    steps: [
      "Descargando contenidos",
      "Verificando videos",
      "Actualizando agenda",
      "Sincronizando programación",
    ],
  },
  {
    kind: "emergencia",
    title: "Evacuación preventiva del edificio",
    message:
      "Diríjase con calma a la salida más cercana siguiendo la señalización.",
    instructions:
      "El personal de seguridad guiará el proceso. No use los ascensores.",
  },
];

/**
 * Ejemplos ya normalizados: al pasar por el esquema reciben todos los valores
 * por defecto, igual que el contenido que llega de la base de datos.
 */
export const SAMPLE_VIEWS: ViewContent[] = SAMPLE_INPUTS.map((v) =>
  viewContentSchema.parse(v),
);
