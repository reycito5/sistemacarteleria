/**
 * Menú del portal institucional. Vive en su propio módulo (sin `"use client"`)
 * para que puedan importarlo tanto la cabecera —que es un componente de
 * cliente— como el pie, que se renderiza en el servidor.
 */
export interface PortalLink {
  href: string;
  label: string;
}

/**
 * Navegación pública. Sólo entran las secciones que le importan a un visitante
 * del Vicerrectorado: qué se estudia, qué ocurre, dónde se informa y con quién
 * hablar. Las rutas operativas (panel, reproductor, catálogo de plantillas) no
 * son navegación institucional: viven en el colofón del pie.
 */
export const PORTAL_LINKS: readonly PortalLink[] = [
  { href: "/", label: "Inicio" },
  { href: "/oferta", label: "Oferta académica" },
  { href: "/agenda", label: "Agenda" },
  { href: "/pantallas", label: "Cartelería" },
  { href: "/contacto", label: "Contacto" },
];

/**
 * Accesos de uso interno. Se listan en letra pequeña al pie para que quien
 * administra el sistema los tenga a mano sin que el portal parezca un panel.
 */
export const PORTAL_ACCESOS_INTERNOS: readonly PortalLink[] = [
  { href: "/admin/login", label: "Panel de administración" },
  { href: "/preview", label: "Catálogo de plantillas" },
  { href: "/player/activar", label: "Activar una pantalla" },
];
