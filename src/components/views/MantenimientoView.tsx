import type { MantenimientoContent } from "@/lib/views/schemas";
import { SigBadge, TechScreen } from "@/components/signage/primitives";

/**
 * Vista 15 — Mantenimiento programado.
 * Aviso de parada técnica prevista, con su horario y alcance.
 */
export function MantenimientoView({
  content,
}: {
  content: MantenimientoContent;
}) {
  const chips = [
    content.startAt && `Inicio ${content.startAt}`,
    content.duration && `Duración estimada ${content.duration}`,
    content.scope,
  ].filter((c): c is string => Boolean(c));

  return (
    <TechScreen glyph="⚙" title={content.title} sub={content.message}>
      {chips.length > 0 && (
        <div className="mt-1 flex flex-wrap justify-center gap-2.5">
          {chips.map((c, i) => (
            <SigBadge key={i} kind={i === 0 ? "onlight" : "neutral"}>
              {c}
            </SigBadge>
          ))}
        </div>
      )}
      {content.supportContact && (
        <p className="mt-1.5 text-[12.5px] text-sig-text-faint">
          Contacto técnico · {content.supportContact}
        </p>
      )}
    </TechScreen>
  );
}
