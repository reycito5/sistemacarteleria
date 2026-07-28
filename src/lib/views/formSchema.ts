import type { ViewContent } from "@/lib/views/schemas";

/**
 * Descriptores de formulario por tipo de vista.
 *
 * Definen QUÉ edita el administrador en cada plantilla, de forma declarativa,
 * para renderizar un editor genérico sin duplicar formularios. La línea
 * gráfica (cabecera, pie, colores, tipografía) NO aparece aquí: está bloqueada.
 *
 * Los campos se agrupan en PASOS. El asistente de creación recorre esos pasos
 * uno a uno, así que añadir un campo aquí lo hace editable de inmediato tanto
 * en el asistente como en la edición posterior.
 */

export type EditableKind = Exclude<
  ViewContent["kind"],
  "sincronizacion" | "sin_conexion" | "emergencia"
>;

export interface SimpleField {
  type: "text" | "textarea";
  key: string;
  label: string;
  /** Ayuda breve: qué es y dónde se verá en la pantalla. */
  hint?: string;
  placeholder?: string;
}

export interface SelectField {
  type: "select";
  key: string;
  label: string;
  hint?: string;
  options: { value: string; label: string }[];
}

export interface BooleanField {
  type: "boolean";
  key: string;
  label: string;
  hint?: string;
}

export interface MediaField {
  type: "media";
  key: string;
  label: string;
  hint?: string;
}

/** Campo de un elemento de lista. Admite texto, selección o medio propio. */
export interface ListItemField {
  key: string;
  label: string;
  type?: "text" | "select" | "media";
  options?: { value: string; label: string }[];
}

export interface ListField {
  type: "list";
  key: string;
  label: string;
  hint?: string;
  max: number;
  itemFields: ListItemField[];
}

export type FormField =
  | SimpleField
  | SelectField
  | BooleanField
  | MediaField
  | ListField;

export interface FormStep {
  id: string;
  title: string;
  /** Qué se consigue en este paso, en una línea. */
  description: string;
  fields: FormField[];
}

export interface FormSchema {
  kind: EditableKind;
  label: string;
  /** Para qué sirve esta plantilla: se muestra al elegirla. */
  purpose: string;
  /** Campo que da nombre al contenido en los listados del panel. */
  titleKey: string;
  steps: FormStep[];
}

/* --- Opciones reutilizadas ------------------------------------------------ */

const STATUS_OPTIONS = [
  { value: "open", label: "Inscripción abierta" },
  { value: "soon", label: "Próximamente" },
];

const AGENDA_STATUS_OPTIONS = [
  { value: "proxima", label: "Próxima" },
  { value: "en_curso", label: "En curso" },
  { value: "finalizada", label: "Finalizada" },
];

const NEWS_KIND_OPTIONS = [
  { value: "noticia", label: "Noticia" },
  { value: "video", label: "Video" },
];

/** Campos del código QR: texto de llamada y dirección que codifica. */
function qrFields(): FormField[] {
  return [
    {
      type: "text",
      key: "qrCaption",
      label: "Texto junto al código QR",
      hint: "La llamada a la acción. Vacío: no se muestra la banda del QR.",
    },
    {
      type: "text",
      key: "qrUrl",
      label: "Dirección del código QR",
      hint: "A dónde lleva al escanearlo. Vacío: se muestra sólo el texto, sin código.",
      placeholder: "https://posgrado.uabjb.edu.bo/inscripcion",
    },
  ];
}

/** Paso de portada común: el panel grande de video o imagen. */
function coverStep(overrides?: Partial<FormStep>): FormStep {
  return {
    id: "portada",
    title: "Portada",
    description:
      "El panel grande de la pantalla. Acepta indistintamente un video o una imagen.",
    fields: [
      {
        type: "media",
        key: "media",
        label: "Video o imagen de portada",
        hint: "Elíjalo de la biblioteca. Si es un video se reproduce solo y en bucle.",
      },
      {
        type: "text",
        key: "headlineEyebrow",
        label: "Antetítulo",
        hint: "Texto pequeño en rojo sobre el titular.",
      },
      { type: "text", key: "headline", label: "Titular sobre la portada" },
      { type: "textarea", key: "subheadline", label: "Bajada" },
    ],
    ...overrides,
  };
}

export const FORM_SCHEMAS: Record<EditableKind, FormSchema> = {
  programacion_general: {
    kind: "programacion_general",
    label: "Programación general y oferta académica",
    purpose:
      "Portada de la oferta con el video institucional al lado y el listado de programas.",
    titleKey: "sectionTitle",
    steps: [
      coverStep(),
      {
        id: "listado",
        title: "Listado de programas",
        description:
          "Hasta cuatro programas. Cada uno puede llevar su propia miniatura.",
        fields: [
          { type: "text", key: "cardEyebrow", label: "Antetítulo de la ficha" },
          { type: "text", key: "sectionTitle", label: "Título de la ficha" },
          {
            type: "list",
            key: "programs",
            label: "Programas",
            max: 4,
            itemFields: [
              { key: "name", label: "Nombre del programa" },
              { key: "type", label: "Nivel (Maestría, Diplomado…)" },
              { key: "version", label: "Versión" },
              { key: "modality", label: "Modalidad" },
              { key: "duration", label: "Duración" },
              { key: "credits", label: "Créditos" },
              { key: "dateShort", label: "Inicio (corto: 17 AGO 2026)" },
              { key: "status", label: "Estado", type: "select", options: STATUS_OPTIONS },
              { key: "media", label: "Miniatura", type: "media" },
            ],
          },
        ],
      },
      {
        id: "cierre",
        title: "Bandas inferiores",
        description: "Lo que aparece al pie de la ficha.",
        fields: [
          { type: "text", key: "nextLabel", label: "Próximo contenido" },
          ...qrFields(),
        ],
      },
    ],
  },

  agenda: {
    kind: "agenda",
    label: "Agenda académica",
    purpose:
      "Actividades del día o de la semana, con su hora, lugar y estado.",
    titleKey: "sectionTitle",
    steps: [
      coverStep(),
      {
        id: "actividades",
        title: "Actividades",
        description: "Hasta cinco actividades ordenadas por hora.",
        fields: [
          { type: "text", key: "badge", label: "Antetítulo de la ficha" },
          { type: "text", key: "sectionTitle", label: "Título de la ficha" },
          {
            type: "list",
            key: "items",
            label: "Actividades",
            max: 5,
            itemFields: [
              { key: "time", label: "Hora (08:30)" },
              { key: "title", label: "Actividad" },
              { key: "place", label: "Lugar" },
              { key: "date", label: "Fecha" },
              {
                key: "status",
                label: "Estado",
                type: "select",
                options: AGENDA_STATUS_OPTIONS,
              },
            ],
          },
          { type: "text", key: "nextLabel", label: "Próximo contenido" },
        ],
      },
    ],
  },

  programa_destacado: {
    kind: "programa_destacado",
    label: "Programa destacado",
    purpose:
      "Ficha completa de un programa: modalidad, duración, créditos, horas y QR.",
    titleKey: "programName",
    steps: [
      {
        id: "identificacion",
        title: "Identificación",
        description: "Nombre y encuadre del programa.",
        fields: [
          { type: "text", key: "programName", label: "Nombre del programa" },
          {
            type: "text",
            key: "level",
            label: "Nivel",
            placeholder: "Maestría, Especialidad, Diplomado…",
          },
          { type: "text", key: "version", label: "Versión (IV Versión)" },
          { type: "text", key: "parallel", label: "Paralelo o ejecutor" },
          { type: "text", key: "badge", label: "Distintivo de la ficha" },
          { type: "textarea", key: "description", label: "Descripción" },
        ],
      },
      {
        id: "portada",
        title: "Portada",
        description: "Video o imagen del programa.",
        fields: [
          {
            type: "media",
            key: "media",
            label: "Video o imagen",
            hint: "Si elige un video, se reproduce solo y en bucle.",
          },
        ],
      },
      {
        id: "ficha",
        title: "Ficha del programa",
        description:
          "Cada campo lleno ocupa una casilla numerada de la rejilla. Los vacíos se omiten.",
        fields: [
          { type: "text", key: "startDate", label: "Inicio" },
          { type: "text", key: "modality", label: "Modalidad" },
          { type: "text", key: "duration", label: "Duración" },
          { type: "text", key: "credits", label: "Créditos" },
          { type: "text", key: "hours", label: "Horas académicas" },
          { type: "text", key: "phones", label: "Teléfonos" },
          { type: "text", key: "audience", label: "Dirigido a" },
          { type: "text", key: "address", label: "Dirección" },
          {
            type: "boolean",
            key: "enrollmentOpen",
            label: "Inscripciones abiertas",
            hint: "Controla el distintivo verde o naranja de la esquina.",
          },
        ],
      },
      {
        id: "cierre",
        title: "Cierre",
        description: "Frase institucional y llamada del QR.",
        fields: [
          { type: "text", key: "quote", label: "Frase destacada" },
          ...qrFields(),
        ],
      },
    ],
  },

  noticias: {
    kind: "noticias",
    label: "Noticias y logros",
    purpose: "Titular institucional, lista de noticias o videos, y métricas.",
    titleKey: "title",
    steps: [
      coverStep(),
      {
        id: "entradas",
        title: "Noticias",
        description:
          "Hasta cuatro entradas. Cada una puede ser una noticia o un video con su portada.",
        fields: [
          { type: "text", key: "badge", label: "Antetítulo de la ficha" },
          { type: "text", key: "title", label: "Título de la ficha" },
          {
            type: "list",
            key: "entries",
            label: "Entradas",
            max: 4,
            itemFields: [
              { key: "title", label: "Titular" },
              { key: "meta", label: "Detalle" },
              { key: "kind", label: "Tipo", type: "select", options: NEWS_KIND_OPTIONS },
              { key: "duration", label: "Duración (si es video)" },
              { key: "media", label: "Portada", type: "media" },
            ],
          },
        ],
      },
      {
        id: "metricas",
        title: "Métricas",
        description: "Dos cifras destacadas al pie de la ficha.",
        fields: [
          {
            type: "list",
            key: "stats",
            label: "Cifras",
            max: 2,
            itemFields: [
              { key: "value", label: "Cifra (1,240+)" },
              { key: "label", label: "Descripción" },
            ],
          },
        ],
      },
    ],
  },

  comunicado: {
    kind: "comunicado",
    label: "Comunicado importante",
    purpose: "Avisos con fecha límite, suspensiones o convocatorias.",
    titleKey: "title",
    steps: [
      {
        id: "mensaje",
        title: "Mensaje",
        description: "Lo que se lee en grande desde lejos.",
        fields: [
          { type: "text", key: "badge", label: "Distintivo" },
          { type: "text", key: "title", label: "Título del comunicado" },
          { type: "textarea", key: "subtitle", label: "Subtítulo" },
          {
            type: "text",
            key: "highlight",
            label: "Dato destacado",
            hint: "Se pinta grande y en rojo. Ej.: «Viernes 28 de agosto».",
          },
          { type: "textarea", key: "body", label: "Cuerpo del comunicado" },
        ],
      },
      {
        id: "datos",
        title: "Datos",
        description: "Filas de fecha, horario, área responsable o contacto.",
        fields: [
          {
            type: "list",
            key: "specs",
            label: "Filas de datos",
            max: 6,
            itemFields: [
              { key: "label", label: "Concepto" },
              { key: "value", label: "Valor" },
            ],
          },
        ],
      },
      {
        id: "apoyo",
        title: "Panel de apoyo",
        description: "Video o imagen que acompaña al comunicado.",
        fields: [
          { type: "media", key: "media", label: "Video o imagen" },
          { type: "text", key: "mediaEyebrow", label: "Antetítulo del panel" },
          { type: "text", key: "mediaTitle", label: "Título del panel" },
          { type: "text", key: "mediaSub", label: "Bajada del panel" },
          ...qrFields(),
        ],
      },
    ],
  },

  bienvenida: {
    kind: "bienvenida",
    label: "Bienvenida y orientación",
    purpose: "Orientación al visitante: dónde está cada oficina.",
    titleKey: "title",
    steps: [
      {
        id: "portada",
        title: "Portada",
        description: "Mensaje de bienvenida y su video o imagen.",
        fields: [
          { type: "media", key: "media", label: "Video o imagen" },
          { type: "text", key: "title", label: "Título" },
          { type: "textarea", key: "subtitle", label: "Subtítulo" },
        ],
      },
      {
        id: "ubicaciones",
        title: "Ubicaciones",
        description: "Hasta seis dependencias con su piso o sala.",
        fields: [
          {
            type: "list",
            key: "locations",
            label: "Dependencias",
            max: 6,
            itemFields: [
              { key: "label", label: "Dependencia" },
              { key: "place", label: "Ubicación" },
            ],
          },
          ...qrFields(),
        ],
      },
    ],
  },

  reconocimientos: {
    kind: "reconocimientos",
    label: "Reconocimientos",
    purpose: "Distinciones a estudiantes, docentes e investigadores.",
    titleKey: "title",
    steps: [
      {
        id: "encabezado",
        title: "Encabezado",
        description: "Categoría del reconocimiento y su portada.",
        fields: [
          { type: "media", key: "media", label: "Video o imagen" },
          { type: "text", key: "title", label: "Categoría" },
          { type: "text", key: "badge", label: "Distintivo" },
        ],
      },
      {
        id: "personas",
        title: "Reconocidos",
        description:
          "El primero encabeza la pantalla; el resto aparece como lista numerada.",
        fields: [
          {
            type: "list",
            key: "items",
            label: "Reconocimientos",
            max: 4,
            itemFields: [
              { key: "name", label: "Nombre o logro" },
              { key: "role", label: "Cargo o distinción" },
              { key: "detail", label: "Detalle" },
            ],
          },
          { type: "text", key: "strapline", label: "Frase institucional" },
        ],
      },
    ],
  },

  evento_vivo: {
    kind: "evento_vivo",
    label: "Transmisión o evento en vivo",
    purpose: "Defensas y conferencias que ocurren en ese momento.",
    titleKey: "title",
    steps: [
      {
        id: "evento",
        title: "Evento",
        description: "Qué se está transmitiendo.",
        fields: [
          { type: "media", key: "media", label: "Video o imagen" },
          { type: "text", key: "badge", label: "Distintivo (En vivo)" },
          { type: "text", key: "title", label: "Título del evento" },
          { type: "text", key: "speaker", label: "Sustentante o expositor" },
        ],
      },
      {
        id: "programa",
        title: "Desarrollo",
        description: "Momentos del acto, con su hora.",
        fields: [
          {
            type: "list",
            key: "schedule",
            label: "Momentos",
            max: 4,
            itemFields: [
              { key: "time", label: "Hora" },
              { key: "label", label: "Momento" },
            ],
          },
          ...qrFields(),
        ],
      },
    ],
  },

  testimonio: {
    kind: "testimonio",
    label: "Testimonios",
    purpose: "Historias de egresados, con video y frase destacada.",
    titleKey: "name",
    steps: [
      {
        id: "persona",
        title: "Persona",
        description: "Quién habla y desde qué programa.",
        fields: [
          {
            type: "media",
            key: "media",
            label: "Video del testimonio o foto",
            hint: "Lo habitual aquí es un video con subtítulos.",
          },
          { type: "text", key: "name", label: "Nombre" },
          { type: "text", key: "program", label: "Programa y gestión" },
        ],
      },
      {
        id: "mensaje",
        title: "Mensaje",
        description: "La frase que se destaca y su contexto.",
        fields: [
          { type: "text", key: "quote", label: "Frase destacada" },
          { type: "textarea", key: "result", label: "Resultado o contexto" },
          { type: "text", key: "strapline", label: "Frase institucional" },
        ],
      },
    ],
  },

  proximos_inicios: {
    kind: "proximos_inicios",
    label: "Próximos inicios",
    purpose:
      "Rejilla con los próximos programas que arrancan, cada uno con su fecha y portada.",
    titleKey: "sectionTitle",
    steps: [
      {
        id: "encabezado",
        title: "Encabezado",
        description: "Título de la rejilla.",
        fields: [
          { type: "text", key: "eyebrow", label: "Antetítulo" },
          { type: "text", key: "sectionTitle", label: "Título" },
        ],
      },
      {
        id: "programas",
        title: "Programas",
        description:
          "Hasta cuatro. La fecha corta se pinta grande sobre la portada.",
        fields: [
          {
            type: "list",
            key: "programs",
            label: "Programas",
            max: 4,
            itemFields: [
              { key: "name", label: "Nombre del programa" },
              { key: "type", label: "Nivel" },
              { key: "modality", label: "Modalidad" },
              { key: "duration", label: "Duración" },
              { key: "credits", label: "Créditos" },
              { key: "dateShort", label: "Inicio (corto: 17 AGO 2026)" },
              { key: "status", label: "Estado", type: "select", options: STATUS_OPTIONS },
              { key: "media", label: "Portada", type: "media" },
            ],
          },
        ],
      },
      {
        id: "qr",
        title: "Panel de inscripción",
        description: "La columna estrecha con el código QR.",
        fields: [
          { type: "text", key: "qrCaption", label: "Antetítulo del panel" },
          { type: "text", key: "qrTitle", label: "Llamada a la acción" },
          { type: "text", key: "qrNote", label: "Nota (dirección web)" },
          {
            type: "text",
            key: "qrUrl",
            label: "Dirección del código QR",
            hint: "A dónde lleva al escanearlo.",
            placeholder: "https://posgrado.uabjb.edu.bo/inscripcion",
          },
        ],
      },
    ],
  },

  mantenimiento: {
    kind: "mantenimiento",
    label: "Mantenimiento programado",
    purpose:
      "Avisa de una parada técnica prevista, indicando horario y alcance.",
    titleKey: "title",
    steps: [
      {
        id: "aviso",
        title: "Aviso",
        description: "Qué se va a hacer y cuándo.",
        fields: [
          { type: "text", key: "title", label: "Título" },
          { type: "textarea", key: "message", label: "Mensaje" },
          { type: "text", key: "startAt", label: "Inicio (22:00)" },
          { type: "text", key: "duration", label: "Duración estimada" },
          {
            type: "text",
            key: "scope",
            label: "Alcance",
            placeholder: "Pantalla: Hall Principal",
          },
          { type: "text", key: "supportContact", label: "Contacto técnico" },
        ],
      },
    ],
  },

  mensaje: {
    kind: "mensaje",
    label: "Mensaje institucional",
    purpose: "Palabra de una autoridad del Vicerrectorado.",
    titleKey: "name",
    steps: [
      {
        id: "autoridad",
        title: "Autoridad",
        description: "Quién firma el mensaje.",
        fields: [
          { type: "media", key: "media", label: "Retrato en video o imagen" },
          { type: "text", key: "name", label: "Nombre" },
          { type: "text", key: "authority", label: "Cargo" },
        ],
      },
      {
        id: "mensaje",
        title: "Mensaje",
        description: "La cita y su desarrollo.",
        fields: [
          { type: "textarea", key: "quote", label: "Frase institucional" },
          { type: "textarea", key: "message", label: "Mensaje" },
          ...qrFields(),
        ],
      },
    ],
  },
};

export const EDITABLE_KINDS = Object.values(FORM_SCHEMAS);

/** Todos los campos de una plantilla, sin agrupar (edición directa). */
export function fieldsOf(kind: EditableKind): FormField[] {
  return FORM_SCHEMAS[kind].steps.flatMap((s) => s.fields);
}
