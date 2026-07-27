/**
 * Menú del portal público. Vive en su propio módulo (sin `"use client"`) para
 * que puedan importarlo tanto la cabecera —que es un componente de cliente—
 * como el pie, que se renderiza en el servidor.
 */
export interface PortalLink {
  href: string;
  label: string;
}

export const PORTAL_LINKS: readonly PortalLink[] = [
  { href: "/", label: "Inicio" },
  { href: "/oferta", label: "Oferta académica" },
  { href: "/agenda", label: "Agenda" },
  { href: "/pantallas", label: "Las pantallas" },
  { href: "/preview", label: "Plantillas" },
  { href: "/contacto", label: "Contacto" },
];
