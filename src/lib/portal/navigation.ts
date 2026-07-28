/**
 * Menú del portal público. Vive en su propio módulo (sin `"use client"`) para
 * que puedan importarlo tanto la cabecera —que es un componente de cliente—
 * como el pie, que se renderiza en el servidor.
 */
export interface PortalLink {
  href: string;
  label: string;
  /** Abre en pestaña nueva hacia un sitio externo (p. ej. el portal de oferta). */
  external?: boolean;
}

/** Portal externo de oferta académica del Posgrado (fuente canónica). */
export const OFERTA_PORTAL_URL = "https://ofertaposgrado.vercel.app";

/**
 * El sitio de la cartelería no duplica el catálogo de oferta: «Oferta
 * académica» y «Agenda» enlazan al portal de Posgrado. El menú queda enfocado
 * en lo que es propio del sistema de señalización.
 */
export const PORTAL_LINKS: readonly PortalLink[] = [
  { href: "/", label: "Inicio" },
  { href: OFERTA_PORTAL_URL, label: "Oferta académica", external: true },
  { href: "/pantallas", label: "Las pantallas" },
  { href: "/preview", label: "Plantillas" },
];
