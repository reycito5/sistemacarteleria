import type { ViewContent } from "@/lib/views/schemas";

/**
 * Contenido de ejemplo basado en las referencias visuales (imágenes 1–5).
 * Sirve para vista previa y para el reproductor de demostración mientras no
 * exista una playlist real publicada desde el panel.
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
];
