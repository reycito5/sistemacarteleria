import type { ViewContent } from "@/lib/views/schemas";

/**
 * Descriptores de formulario por tipo de vista (Fase 3).
 *
 * Definen QUÉ campos edita el administrador en cada plantilla, de forma
 * declarativa, para renderizar un editor genérico sin duplicar formularios. La
 * línea gráfica (cabecera, pie, colores, tipografía) NO aparece aquí: bloqueada.
 */

export type EditableKind = Exclude<
  ViewContent["kind"],
  "sincronizacion" | "emergencia"
>;

export interface SimpleField {
  type: "text" | "textarea";
  key: string;
  label: string;
}

export interface MediaField {
  type: "media";
  key: string; // normalmente "media"
  label: string;
}

export interface ListField {
  type: "list";
  key: string;
  label: string;
  max: number;
  itemFields: { key: string; label: string }[];
}

export type FormField = SimpleField | MediaField | ListField;

export interface FormSchema {
  kind: EditableKind;
  label: string;
  titleKey: string; // campo usado como título del content_item
  fields: FormField[];
}

export const FORM_SCHEMAS: Record<EditableKind, FormSchema> = {
  programacion_general: {
    kind: "programacion_general",
    label: "Programación general",
    titleKey: "sectionTitle",
    fields: [
      { type: "text", key: "sectionTitle", label: "Título de sección" },
      { type: "media", key: "media", label: "Video principal" },
      {
        type: "list",
        key: "offers",
        label: "Oferta académica",
        max: 4,
        itemFields: [
          { key: "title", label: "Programa" },
          { key: "modality", label: "Modalidad" },
          { key: "start", label: "Inicio" },
        ],
      },
      { type: "text", key: "strapline", label: "Frase inferior" },
    ],
  },
  agenda: {
    kind: "agenda",
    label: "Agenda académica",
    titleKey: "sectionTitle",
    fields: [
      { type: "text", key: "sectionTitle", label: "Título de sección" },
      { type: "text", key: "badge", label: "Etiqueta (badge)" },
      { type: "media", key: "media", label: "Video principal" },
      {
        type: "list",
        key: "items",
        label: "Actividades",
        max: 3,
        itemFields: [
          { key: "title", label: "Actividad" },
          { key: "date", label: "Fecha" },
          { key: "time", label: "Hora" },
          { key: "place", label: "Lugar" },
        ],
      },
      { type: "text", key: "strapline", label: "Frase inferior" },
    ],
  },
  programa_destacado: {
    kind: "programa_destacado",
    label: "Programa destacado",
    titleKey: "programName",
    fields: [
      { type: "text", key: "badge", label: "Etiqueta (badge)" },
      { type: "text", key: "programName", label: "Nombre del programa" },
      { type: "media", key: "media", label: "Video / imagen" },
      {
        type: "list",
        key: "specs",
        label: "Datos del programa",
        max: 6,
        itemFields: [
          { key: "label", label: "Campo" },
          { key: "value", label: "Valor" },
        ],
      },
      { type: "text", key: "quote", label: "Frase de impacto" },
      { type: "text", key: "qrCaption", label: "Texto del QR" },
      { type: "text", key: "strapline", label: "Frase inferior" },
    ],
  },
  noticias: {
    kind: "noticias",
    label: "Noticias y logros",
    titleKey: "title",
    fields: [
      { type: "text", key: "title", label: "Título" },
      { type: "text", key: "badge", label: "Etiqueta (badge)" },
      { type: "media", key: "media", label: "Video / imagen" },
      {
        type: "list",
        key: "items",
        label: "Noticias",
        max: 3,
        itemFields: [
          { key: "date", label: "Fecha" },
          { key: "tag", label: "Categoría" },
          { key: "headline", label: "Titular" },
        ],
      },
      { type: "text", key: "bigStat", label: "Cifra destacada" },
      { type: "text", key: "bigStatLabel", label: "Etiqueta de la cifra" },
      { type: "text", key: "strapline", label: "Frase inferior" },
    ],
  },
  comunicado: {
    kind: "comunicado",
    label: "Comunicado importante",
    titleKey: "title",
    fields: [
      { type: "text", key: "badge", label: "Etiqueta (badge)" },
      { type: "text", key: "title", label: "Título" },
      { type: "textarea", key: "subtitle", label: "Subtítulo" },
      { type: "text", key: "highlight", label: "Destacado (fecha grande)" },
      {
        type: "list",
        key: "specs",
        label: "Detalles",
        max: 3,
        itemFields: [
          { key: "label", label: "Campo" },
          { key: "value", label: "Valor" },
        ],
      },
      { type: "text", key: "qrCaption", label: "Texto del QR" },
    ],
  },
};

export const EDITABLE_KINDS = Object.values(FORM_SCHEMAS);
