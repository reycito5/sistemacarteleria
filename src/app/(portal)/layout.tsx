import { PortalHeader } from "@/components/portal/PortalHeader";
import { PortalFooter } from "@/components/portal/PortalFooter";

/**
 * Portal público del sistema: cabecera con menú, contenido y pie institucional.
 * El panel (`/admin`) y el reproductor (`/player`) tienen sus propios marcos.
 */
export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-ui-canvas text-ui-ink">
      <PortalHeader />
      <main className="flex-1">{children}</main>
      <PortalFooter />
    </div>
  );
}
