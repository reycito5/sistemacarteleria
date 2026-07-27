import type { ViewContent } from "@/lib/views/schemas";

/**
 * Contenido de ejemplo del catálogo completo de vistas institucionales.
 *
 * Sirve para la galería de plantillas y para el reproductor de demostración
 * mientras no exista una playlist real publicada desde el panel. Las cinco
 * primeras reproducen las referencias visuales originales.
 */
export const SAMPLE_VIEWS: ViewContent[] = [
  {
    kind: "programacion_general",
    sectionTitle: "OFERTA ACADÉMICA",
    offers: [
      { title: "Maestría en Educación Superior", modality: "Virtual", start: "31/07/2026" },
      { title: "Diplomado en Inteligencia Artificial", modality: "Virtual", start: "10/08/2026" },
      { title: "Diplomado en Manejo y Administración de Plataformas Virtuales", modality: "Virtual", start: "28/08/2026" },
    ],
    nextLabel: "A CONTINUACIÓN",
    strapline: "Conocimiento que transforma el desarrollo del Beni",
  },
  {
    kind: "agenda",
    sectionTitle: "AGENDA ACADÉMICA",
    badge: "ACTIVIDADES DE ESTA SEMANA",
    items: [
      { title: "Inicio de Diplomado", date: "24/07/2026", time: "19:00", place: "Aula Virtual Posgrado" },
      { title: "Defensa de Tesis", date: "26/07/2026", time: "16:00", place: "Auditorio de Posgrado" },
      { title: "Conferencia Académica", date: "28/07/2026", time: "18:30", place: "Paraninfo Universitario" },
    ],
    strapline: "Formación avanzada para transformar el Beni",
  },
  {
    kind: "programa_destacado",
    badge: "PROGRAMA DESTACADO",
    programName: "Diplomado en Inteligencia Artificial",
    specs: [
      { label: "Modalidad", value: "Virtual" },
      { label: "Duración", value: "5 meses" },
      { label: "Créditos", value: "20 créditos" },
      { label: "Horas", value: "800 horas" },
      { label: "Inicio", value: "10 de agosto de 2026" },
    ],
    quote: "Transforma datos en decisiones inteligentes",
    qrCaption: "CONOCE EL PROGRAMA",
    strapline: "Programas de Posgrado para profesionales que lideran el cambio",
  },
  {
    kind: "noticias",
    title: "NOTICIAS Y LOGROS DE POSGRADO",
    badge: "ACREDITACIÓN INTERNACIONAL",
    items: [
      { date: "21/07/2026", tag: "Logro institucional", headline: "Posgrado fortalece su proyección académica internacional." },
      { date: "19/07/2026", tag: "Defensa académica", headline: "Nuevos profesionales culminan con éxito sus programas de posgrado." },
      { date: "17/07/2026", tag: "Convenios", headline: "UABJB Posgrado consolida alianzas para ampliar su oferta académica." },
    ],
    bigStat: "+500",
    bigStatLabel: "Profesionales formados",
    strapline: "Excelencia académica, investigación y compromiso con el desarrollo del Beni",
  },
  {
    kind: "comunicado",
    badge: "COMUNICADO IMPORTANTE",
    title: "Cierre de inscripciones",
    subtitle: "Últimos días para formar parte de nuestros programas de Posgrado.",
    highlight: "Viernes 28 de agosto",
    specs: [
      { label: "Atención de", value: "08:00 a 16:00" },
      { label: "Modalidad", value: "Presencial y virtual" },
    ],
    qrCaption: "INSCRÍBETE AQUÍ",
  },
  {
    kind: "bienvenida",
    title: "BIENVENIDOS AL POSGRADO",
    subtitle: "Le orientamos para que encuentre lo que necesita.",
    locations: [
      { label: "Informaciones e inscripciones", place: "Recepción · Planta baja" },
      { label: "Coordinación académica", place: "Segundo piso · Oficina 204" },
      { label: "Defensas y conferencias", place: "Auditorio de Posgrado" },
    ],
    strapline: "Formación avanzada al servicio del desarrollo del Beni",
  },
  {
    kind: "reconocimientos",
    title: "RECONOCIMIENTOS",
    badge: "ORGULLO INSTITUCIONAL",
    items: [
      {
        name: "Lic. María Fernanda Suárez",
        role: "Maestría en Educación Superior",
        detail: "Defensa de tesis aprobada con mención de honor.",
      },
      {
        name: "Ing. Carlos Andrés Rojas",
        role: "Diplomado en Inteligencia Artificial",
        detail: "Mejor proyecto final de la promoción 2026.",
      },
      {
        name: "Dra. Lucía Camacho",
        role: "Docente investigadora",
        detail: "Publicación destacada en innovación educativa.",
      },
    ],
    strapline: "Reconocemos el esfuerzo de quienes elevan el nivel académico",
  },
  {
    kind: "evento_vivo",
    badge: "EN VIVO",
    title: "DEFENSA DE TESIS",
    speaker: "Lic. María Fernanda Suárez",
    schedule: [
      { time: "09:00", label: "Presentación del tribunal" },
      { time: "09:15", label: "Exposición de la tesis" },
      { time: "10:00", label: "Preguntas del tribunal" },
      { time: "10:30", label: "Deliberación y resultado" },
    ],
    qrCaption: "SÍGUELO EN LÍNEA",
  },
  {
    kind: "testimonio",
    name: "Lic. Andrea Suárez",
    program: "Maestría en Educación Superior · Gestión 2026",
    quote: "El Posgrado me dio herramientas para liderar mejor",
    result:
      "Hoy lidero proyectos con más visión, seguridad y compromiso con mi comunidad.",
    strapline: "Profesionales que convierten el conocimiento en transformación",
  },
  {
    kind: "mensaje",
    authority: "Vicerrector de Posgrado — UABJB",
    name: "Camilo Antonio Rosas Ardaya Ph.D.",
    message:
      "Desde el Posgrado impulsamos la formación, la investigación y el liderazgo al servicio del desarrollo del Beni.",
    quote: "El conocimiento transforma nuestro futuro",
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
    title: "SUSPENSIÓN DE ACTIVIDADES",
    message:
      "Las actividades académicas de hoy quedan suspendidas por disposición del Vicerrectorado.",
    instructions:
      "Diríjase a la salida más cercana con calma y siga las indicaciones del personal.",
  },
];
