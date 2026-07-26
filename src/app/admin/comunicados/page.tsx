import { getActiveEmergency } from "@/lib/data/admin";
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
    <div>
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-black text-inst-blue-top">Comunicados urgentes</h1>
        <span
          className="rounded-full px-3 py-1 text-xs font-bold text-inst-white"
          style={{ background: "var(--color-inst-red)" }}
        >
          Prioridad absoluta
        </span>
      </div>
      <p className="mt-1 max-w-2xl text-sm text-panel-muted">
        Una emergencia interrumpe la playlist y aparece simultáneamente en las cuatro
        pantallas (sección 16). Requiere confirmación especial.
      </p>

      <div className="mt-6">
        {configured ? (
          <EmergencyForm active={active} />
        ) : (
          <div
            className="rounded-md border-l-4 bg-white px-4 py-3 text-sm"
            style={{ borderColor: "var(--color-inst-gold)" }}
          >
            <strong>Supabase no configurado.</strong> Configure el entorno e inicie
            sesión para activar comunicados de emergencia.
          </div>
        )}
      </div>
    </div>
  );
}
