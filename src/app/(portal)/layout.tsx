import { PortalHeader } from "@/components/portal/PortalHeader";
import { PortalFooter } from "@/components/portal/PortalFooter";
import { getInstitutionIdentity } from "@/lib/data/institution";
import { DEFAULT_IDENTITY } from "@/lib/institution/identity";

/**
 * Portal público del sistema: cabecera con menú, contenido y pie institucional.
 * El panel (`/admin`) y el reproductor (`/player`) tienen sus propios marcos.
 *
 * Carga la identidad institucional (logos incluidos) para que la cabecera
 * muestre el logo real del Vicerrectorado cuando está cargado.
 */
export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let logoUrl: string | null = DEFAULT_IDENTITY.logoPrimaryUrl;
  try {
    const identity = await getInstitutionIdentity();
    logoUrl = identity.logoPrimaryUrl;
  } catch {
    // Sin Supabase configurado: se usa el monograma de respaldo.
  }

  return (
    <div className="flex min-h-dvh flex-col bg-ui-canvas text-ui-ink">
      <PortalHeader logoUrl={logoUrl} />
      <main className="flex-1">{children}</main>
      <PortalFooter />
    </div>
  );
}
