import type { ProximosIniciosContent } from "@/lib/views/schemas";
import { IndexLayout, IndexRow, SigBadge } from "@/components/signage/layouts";
import { QrCode } from "@/components/signage/QrCode";
import { SignageMedia } from "@/components/signage/SignageMedia";
import { rowScale, T } from "@/components/signage/scale";

/**
 * Vista 6 — Próximos inicios de gestión.
 *
 * Arquetipo ÍNDICE: aquí el dato que importa es CUÁNDO empieza cada programa,
 * así que la fecha va de ancla a la izquierda —en mono, en rojo— y el nombre
 * a continuación. La portada de cada programa queda como miniatura a la
 * derecha: acompaña, pero no compite con la fecha.
 *
 * El QR va en la cabecera, no en un pie: con cabecera Y pie, entre los dos se
 * comían casi la mitad del alto útil y las filas quedaban diminutas.
 */
export function ProximosIniciosView({
  content,
}: {
  content: ProximosIniciosContent;
}) {
  const programs = content.programs.slice(0, 4);
  const row = rowScale(programs.length);

  return (
    <IndexLayout
      kicker={content.eyebrow}
      title={content.sectionTitle}
      right={
        content.qrUrl || content.qrTitle ? (
          <div className="flex items-center gap-5">
            <div className="min-w-0 text-right">
              <p
                className="font-mono font-bold uppercase tracking-[.2em] text-sig-red"
                style={{ fontSize: T.eyebrow }}
              >
                {content.qrCaption}
              </p>
              <p
                className="mt-1.5 font-serif font-bold leading-tight text-sig-ink"
                style={{ fontSize: 32 }}
              >
                {content.qrTitle}
              </p>
              {content.qrNote && (
                <p
                  className="mt-1 text-sig-text-soft"
                  style={{ fontSize: T.meta }}
                >
                  {content.qrNote}
                </p>
              )}
            </div>
            {content.qrUrl && (
              <div className="shrink-0 border-2 border-sig-rule bg-white p-2">
                <QrCode value={content.qrUrl} size={104} />
              </div>
            )}
          </div>
        ) : undefined
      }
    >
      <div className="flex flex-1 flex-col justify-center">
        {programs.map((p, i) => (
          <IndexRow
            key={`${p.name}-${i}`}
            index={i + 1}
            lead={p.dateShort || undefined}
            title={p.name}
            meta={[p.type, p.version, p.modality, p.duration]
              .filter(Boolean)
              .join(" · ")}
            accent={i === 0}
            size={row.title}
            padY={row.padY}
            right={
              <div className="flex items-center gap-6">
                <SigBadge
                  kind={p.status === "soon" ? "onlight-soon" : "onlight-live"}
                >
                  {p.status === "soon" ? "Próximamente" : "Inicio próximo"}
                </SigBadge>
                {p.media?.src && (
                  <div
                    className="relative shrink-0 overflow-hidden rounded-[4px] bg-sig-ink-deep"
                    style={{ height: row.title * 1.9, width: row.title * 3.1 }}
                  >
                    <SignageMedia media={p.media} fallbackLabel="" />
                  </div>
                )}
              </div>
            }
          />
        ))}
      </div>
    </IndexLayout>
  );
}
