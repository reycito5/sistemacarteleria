import type { MantenimientoContent } from "@/lib/views/schemas";
import { DataPoint, StatusLayout } from "@/components/signage/layouts";
import { T } from "@/components/signage/scale";

/**
 * Vista 15 — Mantenimiento programado.
 *
 * Arquetipo ESTADO. A diferencia de la sincronización, aquí el horario SÍ es
 * información útil para el público, así que va en casillas de dato y no en
 * distintivos pequeños.
 */
export function MantenimientoView({
  content,
}: {
  content: MantenimientoContent;
}) {
  const fields = [
    { label: "Inicio", value: content.startAt },
    { label: "Duración estimada", value: content.duration },
    { label: "Alcance", value: content.scope },
  ].filter((f) => Boolean(f.value));

  return (
    <StatusLayout
      kicker="Aviso técnico"
      title={content.title}
      sub={content.message}
    >
      {fields.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-x-20 gap-y-8">
          {fields.map((f) => (
            <DataPoint key={f.label} label={f.label} value={f.value} />
          ))}
        </div>
      )}

      {content.supportContact && (
        <p
          className="mt-10 border-t border-sig-rule pt-6 text-sig-text-faint"
          style={{ fontSize: T.body }}
        >
          Contacto técnico · {content.supportContact}
        </p>
      )}
    </StatusLayout>
  );
}
