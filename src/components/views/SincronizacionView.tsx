import type { SincronizacionContent } from "@/lib/views/schemas";
import { SigBadge, TechScreen } from "@/components/signage/primitives";

/**
 * Vista 14 — Sincronización.
 * Pantalla técnica: aparece sola mientras el equipo descarga la programación.
 */
export function SincronizacionView({
  content,
}: {
  content: SincronizacionContent;
}) {
  return (
    <TechScreen
      glyph="⟳"
      title="Actualizando contenido institucional"
      sub={content.steps.join(" · ")}
    >
      <div className="mt-2 h-[3px] w-[480px] overflow-hidden bg-sig-rule">
        <div className="h-full w-[64%] bg-sig-red" />
      </div>
      <div className="mt-1 flex flex-wrap justify-center gap-2.5">
        <SigBadge kind="neutral">Reproductor activo</SigBadge>
        <SigBadge kind="onlight">Programación en caché</SigBadge>
      </div>
    </TechScreen>
  );
}

/** Pantalla técnica de contingencia: la red se cayó, se emite desde la caché. */
export function SinConexionView() {
  return (
    <TechScreen
      glyph="⚠"
      tone="red"
      title="Conexión temporalmente interrumpida"
      sub="El contenido almacenado localmente continuará reproduciéndose con normalidad."
    >
      <div className="mt-1 flex flex-wrap justify-center gap-2.5">
        <SigBadge kind="neutral">Reproduciendo desde la caché</SigBadge>
        <SigBadge kind="onlight-open">Reintentando conexión</SigBadge>
      </div>
    </TechScreen>
  );
}
