import type {
  SinConexionContent,
  SincronizacionContent,
} from "@/lib/views/schemas";
import { SigBadge, StatusLayout } from "@/components/signage/layouts";
import { T } from "@/components/signage/scale";

/**
 * Vista 14 — Sincronización.
 *
 * Arquetipo ESTADO: sin foto, sin tarjeta, alineado a la izquierda. Se
 * distingue al instante de una pantalla de contenido, que es exactamente lo
 * que hace falta cuando el equipo está trabajando y no emitiendo.
 */
export function SincronizacionView({
  content,
}: {
  content: SincronizacionContent;
}) {
  return (
    <StatusLayout
      kicker="Estado del sistema"
      title="Actualizando contenido institucional"
      sub="La programación se reanudará automáticamente al terminar la descarga."
    >
      <div className="mt-9 h-[10px] w-[720px] overflow-hidden bg-sig-rule">
        <div className="h-full w-[64%] bg-sig-red" />
      </div>

      <ol className="mt-8 flex flex-wrap gap-x-12 gap-y-4">
        {content.steps.map((step, i) => (
          <li
            key={i}
            className="flex items-baseline gap-4 font-medium text-sig-text-soft"
            style={{ fontSize: T.body }}
          >
            <span className="font-mono font-bold text-sig-red">
              {String(i + 1).padStart(2, "0")}
            </span>
            {step}
          </li>
        ))}
      </ol>

      <div className="mt-9 flex flex-wrap gap-3">
        <SigBadge kind="neutral">Reproductor activo</SigBadge>
        <SigBadge kind="onlight">Programación en caché</SigBadge>
      </div>
    </StatusLayout>
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
    <StatusLayout
      tone="red"
      kicker="Contingencia"
      title="Conexión temporalmente interrumpida"
      sub="El contenido almacenado localmente continúa reproduciéndose con normalidad. No hace falta intervenir el equipo."
    >
      <div className="mt-9 flex flex-wrap gap-3">
        {content.lastSync && (
          <SigBadge kind="neutral">
            Última sincronización: {content.lastSync}
          </SigBadge>
        )}
        <SigBadge kind="onlight-open">Reintentando conexión</SigBadge>
      </div>
    </StatusLayout>
  );
}
