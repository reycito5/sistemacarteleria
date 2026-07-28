/**
 * Mapa de navegación del panel.
 *
 * Los módulos se agrupan siguiendo el ORDEN REAL DEL TRABAJO, para que se
 * entienda de un vistazo cómo se conecta el sistema:
 *
 *   1. Contenido  — se sube el material y se arma cada pantalla.
 *   2. Emisión    — se decide qué se ve, en qué orden y cuándo.
 *   3. Operación  — se vigilan los televisores y la seguridad del panel.
 */

export type AdminIconName =
  | "dashboard"
  | "library"
  | "templates"
  | "playlist"
  | "calendar"
  | "emergency"
  | "portal"
  | "screens"
  | "security"
  | "help"
  | "identity";

export interface AdminModule {
  href: string;
  label: string;
  /** Qué se hace aquí, en una línea. Se muestra bajo el título de la página. */
  summary: string;
  icon: AdminIconName;
  /** Número de paso del flujo (1–4). Sin número: módulo de apoyo. */
  step?: number;
}

export interface AdminSection {
  title: string;
  modules: AdminModule[];
}

export const ADMIN_SECTIONS: readonly AdminSection[] = [
  {
    title: "Inicio",
    modules: [
      {
        href: "/admin",
        label: "Panel general",
        summary:
          "Estado de las cuatro pantallas, qué se está emitiendo ahora y avisos activos.",
        icon: "dashboard",
      },
      {
        href: "/admin/identidad",
        label: "Identidad institucional",
        summary:
          "Logos, contactos y rótulo de la cabecera y el pie de todas las pantallas.",
        icon: "identity",
      },
      {
        href: "/admin/ayuda",
        label: "Cómo funciona",
        summary:
          "Guía del flujo completo: de dónde sale el contenido y cómo llega al televisor.",
        icon: "help",
      },
    ],
  },
  {
    title: "1 · Contenido",
    modules: [
      {
        href: "/admin/biblioteca",
        label: "Biblioteca multimedia",
        summary:
          "Suba aquí los videos e imágenes. Es el almacén: por sí solo no sale en pantalla.",
        icon: "library",
        step: 1,
      },
      {
        href: "/admin/plantillas",
        label: "Plantillas y contenidos",
        summary:
          "Arme cada pantalla eligiendo una plantilla y escribiendo sus textos y medios.",
        icon: "templates",
        step: 2,
      },
      {
        href: "/admin/oferta",
        label: "Portal de oferta",
        summary:
          "Importe los programas publicados en el portal y conviértalos en pantallas.",
        icon: "portal",
      },
    ],
  },
  {
    title: "2 · Emisión",
    modules: [
      {
        href: "/admin/playlist",
        label: "Playlist general",
        summary:
          "Ordene las pantallas aprobadas y publique. Esto es lo que ven los televisores.",
        icon: "playlist",
        step: 3,
      },
      {
        href: "/admin/calendario",
        label: "Calendario",
        summary:
          "Programe qué playlist se emite en cada día y franja horaria.",
        icon: "calendar",
      },
      {
        href: "/admin/comunicados",
        label: "Comunicados urgentes",
        summary:
          "Interrumpe todo al instante en las cuatro pantallas. Úselo sólo para emergencias.",
        icon: "emergency",
      },
    ],
  },
  {
    title: "3 · Operación",
    modules: [
      {
        href: "/admin/pantallas",
        label: "Centro de pantallas",
        summary:
          "Registre televisores, actívelos por código y vigile su conexión en vivo.",
        icon: "screens",
        step: 4,
      },
      {
        href: "/admin/seguridad",
        label: "Seguridad",
        summary: "Verificación en dos pasos de las cuentas del panel.",
        icon: "security",
      },
    ],
  },
];

export const ADMIN_MODULES: readonly AdminModule[] = ADMIN_SECTIONS.flatMap(
  (s) => s.modules,
);

/** Módulo cuya ruta corresponde al pathname actual (coincidencia más larga). */
export function moduleForPath(pathname: string): AdminModule | undefined {
  return [...ADMIN_MODULES]
    .filter((m) =>
      m.href === "/admin"
        ? pathname === "/admin"
        : pathname === m.href || pathname.startsWith(`${m.href}/`),
    )
    .sort((a, b) => b.href.length - a.href.length)[0];
}
