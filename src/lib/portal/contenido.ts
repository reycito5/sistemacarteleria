import type { ViewContent } from "@/lib/views/schemas";

/**
 * Textos institucionales del portal.
 *
 * Se centralizan aquí —y no dentro de cada página— porque varias rutas
 * comparten los mismos datos (los puntos de cartelería aparecen en inicio y en
 * `/pantallas`) y porque así el Vicerrectorado puede corregir la redacción sin
 * tocar la maquetación.
 */

/** Punto de información: un televisor visto desde fuera, no desde el sistema. */
export interface PuntoCarteleria {
  codigo: string;
  nombre: string;
  lugar: string;
  publico: string;
}

/**
 * Los cuatro puntos donde el Vicerrectorado informa por pantalla. Se describen
 * por su ubicación y su público, no por su estado técnico: al visitante le
 * sirve saber dónde mirar, no si el equipo envía latidos.
 */
export const PUNTOS_CARTELERIA: readonly PuntoCarteleria[] = [
  {
    codigo: "REC-01",
    nombre: "Recepción",
    lugar: "Ingreso principal del Vicerrectorado",
    publico: "Postulantes e informaciones",
  },
  {
    codigo: "PAS-02",
    nombre: "Pasillo académico",
    lugar: "Corredor de aulas",
    publico: "Estudiantes en tránsito",
  },
  {
    codigo: "AUD-03",
    nombre: "Auditorio",
    lugar: "Sala de defensas y conferencias",
    publico: "Asistentes a actos académicos",
  },
  {
    codigo: "ADM-04",
    nombre: "Administración",
    lugar: "Oficinas administrativas",
    publico: "Personal del Vicerrectorado",
  },
];

/** Pregunta frecuente del portal. */
export interface PreguntaFrecuente {
  pregunta: string;
  respuesta: string;
}

export const PREGUNTAS_FRECUENTES: readonly PreguntaFrecuente[] = [
  {
    pregunta: "¿Cómo me inscribo en un programa?",
    respuesta:
      "Revise la oferta académica, elija el programa que le interesa y siga su enlace de inscripción. Si prefiere que le orientemos, escríbanos por WhatsApp indicando el nombre del programa.",
  },
  {
    pregunta: "¿Los programas son presenciales o virtuales?",
    respuesta:
      "Depende del programa. Cada ficha de la oferta indica su modalidad —virtual, presencial o semipresencial—, su duración en meses y su fecha de inicio prevista.",
  },
  {
    pregunta: "¿Qué requisitos debo presentar?",
    respuesta:
      "Los requisitos varían según el nivel: diplomado, especialidad, maestría o doctorado. Consúltelos en el Vicerrectorado antes de iniciar el trámite; le indicaremos la documentación exacta de su programa.",
  },
  {
    pregunta: "Vi un aviso en una pantalla y quiero más información",
    respuesta:
      "Anote el título del aviso —o escanee el código que aparece en la pantalla— y comuníquese con nosotros por cualquiera de los canales de esta página.",
  },
  {
    pregunta: "¿Puedo anunciar una defensa o una conferencia?",
    respuesta:
      "Sí. Las actividades académicas del Vicerrectorado se publican en la agenda y en las pantallas. Comuníquelas con al menos dos días de antelación indicando fecha, hora y lugar.",
  },
];

/**
 * Vistas que tiene sentido enseñar al público en `/pantallas`.
 *
 * Se dejan fuera las técnicas (sincronización, sin conexión, mantenimiento) y
 * la de emergencia: describen el comportamiento del sistema, no la
 * comunicación del Vicerrectorado, y son exactamente el tipo de detalle que
 * hace que un portal institucional parezca un panel de control.
 */
export const VISTAS_PUBLICAS: readonly ViewContent["kind"][] = [
  "programacion_general",
  "programa_destacado",
  "agenda",
  "proximos_inicios",
  "noticias",
  "reconocimientos",
  "evento_vivo",
  "bienvenida",
];

/**
 * Qué comunica cada pantalla, contado para el visitante. El título se redacta
 * en lenguaje corriente y no con el nombre técnico de la plantilla, que sólo
 * significa algo para quien administra el sistema.
 */
export const QUE_COMUNICA: Partial<
  Record<ViewContent["kind"], { titulo: string; texto: string }>
> = {
  programacion_general: {
    titulo: "La oferta, de un vistazo",
    texto:
      "La portada de la formación de posgrado: qué se estudia en el Vicerrectorado y por dónde empezar.",
  },
  programa_destacado: {
    titulo: "Un programa en detalle",
    texto:
      "La ficha completa de un programa —modalidad, duración y créditos— con el código para inscribirse desde el móvil.",
  },
  agenda: {
    titulo: "La agenda del día",
    texto:
      "Las defensas, conferencias y actos previstos, con su hora y su sala.",
  },
  proximos_inicios: {
    titulo: "Los próximos inicios",
    texto:
      "Los programas que arrancan en las siguientes semanas, con la fecha de inicio en grande.",
  },
  noticias: {
    titulo: "Noticias del Vicerrectorado",
    texto: "Logros académicos, convenios y actividad institucional.",
  },
  reconocimientos: {
    titulo: "Reconocimientos",
    texto:
      "Distinciones a estudiantes, docentes e investigadores de la casa.",
  },
  evento_vivo: {
    titulo: "En vivo desde el auditorio",
    texto:
      "Defensas de tesis y conferencias mientras se están celebrando.",
  },
  bienvenida: {
    titulo: "Bienvenida y orientación",
    texto:
      "Para quien llega por primera vez: dónde queda cada oficina y a quién dirigirse.",
  },
};

/**
 * Descripción de cada plantilla para el catálogo interno (`/preview`). Aquí sí
 * se habla del sistema: esa ruta la consulta quien administra la cartelería.
 */
export const PROPOSITO_PLANTILLA: Partial<Record<ViewContent["kind"], string>> =
  {
    programacion_general:
      "Portada de la oferta académica con el video institucional al lado.",
    agenda: "Actividades del día o de la semana, con hora y lugar.",
    programa_destacado:
      "Ficha completa de un programa: modalidad, duración, créditos y QR.",
    noticias: "Logros, convenios y noticias del Vicerrectorado.",
    comunicado: "Avisos con fecha límite, como el cierre de inscripciones.",
    bienvenida: "Orientación para quien llega: dónde está cada oficina.",
    reconocimientos: "Distinciones a estudiantes, docentes e investigadores.",
    evento_vivo:
      "Defensas y conferencias que se están celebrando en ese momento.",
    testimonio: "Historias de egresados, con video y frase destacada.",
    mensaje: "Palabra de una autoridad del Vicerrectorado.",
    proximos_inicios:
      "Rejilla de los programas que arrancan, con su fecha de inicio en grande.",
    sincronizacion:
      "Pantalla técnica: aparece sola mientras el equipo descarga la programación.",
    sin_conexion: "Pantalla técnica: se muestra sola si el equipo pierde la red.",
    mantenimiento:
      "Aviso de una parada técnica prevista, con su horario y alcance.",
    emergencia:
      "Aviso urgente. Se activa desde el panel e interrumpe todo lo demás.",
  };
