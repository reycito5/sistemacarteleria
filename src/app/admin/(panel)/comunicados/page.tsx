import { Siren } from "lucide-react";
import { getActiveEmergency } from "@/lib/data/admin";
import { PageHeader } from "@/components/ui/PageHeader";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { EmergencyForm } from "./EmergencyForm";

export const dynamic = "force-dynamic";

export default async function ComunicadosPage() {
  let active = null;
  let configured = true;
  try {
    const row = await getActiveEmergency();
    active = row ? { id: row.id, title: row.title, severity: row.severity } : null;
  } catch {
    configured = false;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="2 · Emisión"
        title="Comunicados urgentes"
        description="La única excepción al flujo normal: no pasa por la playlist. Al activar un comunicado, tapa de inmediato la programación de las cuatro pantallas y se mantiene hasta que se desactiva a mano."
        actions={<Badge tone="danger" dot>Prioridad absoluta</Badge>}
      />

      {active ? (
        <Alert
          tone="danger"
          title={`Hay un comunicado activo: ${active.title}`}
        >
          Mientras siga activo, ningún otro contenido se ve en los televisores.
          Desactívelo en cuanto la situación se normalice.
        </Alert>
      ) : (
        <Alert tone="info" title="Sin comunicados activos">
          Las pantallas están emitiendo la programación normal. Use esta pantalla
          sólo ante una emergencia real o un aviso institucional inaplazable.
        </Alert>
      )}

      {configured ? (
        <EmergencyForm active={active} />
      ) : (
        <Alert tone="warn" title="Supabase no está configurado">
          Configure el entorno e inicie sesión para activar comunicados de
          emergencia.
        </Alert>
      )}

      <p className="flex items-center gap-2 text-xs text-ui-muted">
        <Siren size={14} aria-hidden />
        La activación queda registrada en la auditoría con la cuenta que la
        realizó.
      </p>
    </div>
  );
}
