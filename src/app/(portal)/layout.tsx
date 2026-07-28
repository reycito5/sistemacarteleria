import { PortalHeader } from "@/components/portal/PortalHeader";
import { PortalFooter } from "@/components/portal/PortalFooter";

/**
 * Portal institucional del Vicerrectorado de Posgrado: marquilla, cuerpo y
 * colofón. El panel (`/admin`) y el reproductor (`/player`) tienen sus propios
 * marcos.
 *
 * El fondo es el papel cálido de la línea gráfica institucional —el mismo del
 * televisor—, no el gris del panel: el portal debe leerse como un impreso de
 * la universidad y no como la aplicación que lo alimenta.
 */
export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-sig-paper text-sig-text">
      <PortalHeader />
      <main className="flex-1">{children}</main>
      <PortalFooter />
    </div>
  );
}
