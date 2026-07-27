import { fetchPortalPrograms, type PortalResult } from "@/lib/integration/portalServer";
import { ImportPortalList } from "./ImportPortalList";

export const dynamic = "force-dynamic";

async function load(): Promise<PortalResult> {
  return fetchPortalPrograms();
}

export default async function OfertaPage() {
  const { programs, source } = await load();

  return (
    <div>
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-black text-inst-blue-top">Portal de oferta</h1>
        <span
          className="rounded-full px-3 py-1 text-xs font-bold text-inst-white"
          style={{ background: source === "portal" ? "#137333" : "var(--color-inst-gold)" }}
        >
          {source === "portal" ? "Conectado al portal" : "Datos de muestra"}
        </span>
      </div>
      <p className="mt-1 max-w-2xl text-sm text-panel-muted">
        El portal de oferta es la fuente de programas, modalidad, inicio, duración,
        créditos y contactos (sección 23). Importe un programa para generar o
        actualizar su plantilla «Programa destacado» sin reescribir la información.
      </p>

      {source === "muestra" && (
        <div
          className="mt-4 rounded-md border-l-4 bg-white px-4 py-3 text-sm"
          style={{ borderColor: "var(--color-inst-gold)" }}
        >
          Configure <code>OFERTA_PORTAL_URL</code> para conectar el portal real.
          Mientras tanto se muestra una oferta de ejemplo.
        </div>
      )}

      <div className="mt-6">
        <ImportPortalList programs={programs} />
      </div>
    </div>
  );
}
