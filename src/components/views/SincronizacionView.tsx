import type {
  SinConexionContent,
  SincronizacionContent,
} from "@/lib/views/schemas";
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

/**
 * Vista 13 — Sin conexión.
 * Contingencia: la red se cayó y se emite desde la caché local.
 */
export function SinConexionView({
  content,
}: {
  content: SinConexionContent;
}) {
  return (
    <TechScreen
      glyph="⚠"
      tone="red"
      title="Conexión temporalmente interrumpida"
      sub="El contenido almacenado localmente continuará reproduciéndose con normalidad."
    >
      <div className="mt-1 flex flex-wrap justify-center gap-2.5">
        {content.lastSync && (
          <SigBadge kind="neutral">
            Última sincronización: {content.lastSync}
          </SigBadge>
        )}
        <SigBadge kind="onlight-open">Reintentando conexión</SigBadge>
      </div>
    </TechScreen>
  );
}
