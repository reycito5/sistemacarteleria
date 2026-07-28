import type { ProgramacionGeneralContent } from "@/lib/views/schemas";
import {
  IndexRow,
  Kicker,
  QrFooter,
  RedBar,
  SplitLayout,
  type ProgramLike,
} from "@/components/signage/layouts";
import { T, LH, autoSize, rowScale } from "@/components/signage/scale";

/**
 * Vista 1 — Programación general y oferta académica.
 *
 * Arquetipo SPLIT: el medio ocupa un tercio a sangre —con el titular encima—
 * y la oferta se lista numerada en el resto. La numeración da ritmo al listado
 * y permite leer «cuántas hay» antes de leer «cuáles son».
 *
 * Acepta las fichas completas (`programs`) o, si no las hay, el formato simple
 * y antiguo (`offers`), de modo que el contenido ya guardado sigue viéndose.
 */
export function ProgramacionGeneralView({
  content,
}: {
  content: ProgramacionGeneralContent;
}) {
  const programs: ProgramLike[] =
    content.programs.length > 0
      ? content.programs
      : content.offers.map((o) => ({
          name: o.title,
          modality: o.modality,
          dateShort: o.start,
        }));

  const shown = programs.slice(0, 4);
  const row = rowScale(shown.length);
  const title = content.headline || content.sectionTitle;

  return (
    <SplitLayout
      media={content.media}
      mediaSide="left"
      mediaSpan={4}
      stretch
      mediaOverlay={
        <>
          {content.headlineEyebrow && (
            <Kicker onDark>{content.headlineEyebrow}</Kicker>
          )}
          <h2
            className="mt-4 font-serif font-black text-white"
            style={{
              fontSize: autoSize(title, T.headline, 42, 26),
              lineHeight: LH.headline,
              textShadow: "0 4px 40px rgba(0,0,0,.55)",
            }}
          >
            {title}
          </h2>
          {(content.subheadline || content.strapline) && (
            <p
              className="mt-5 line-clamp-3 font-medium text-white/85"
              style={{ fontSize: T.body, lineHeight: LH.body }}
            >
              {content.subheadline || content.strapline}
            </p>
          )}
        </>
      }
    >
      <header className="flex shrink-0 items-center justify-between gap-8 border-b-[6px] border-sig-ink px-[52px] pb-5 pt-[30px]">
        <div className="min-w-0">
          {content.cardEyebrow && <Kicker>{content.cardEyebrow}</Kicker>}
          <h3
            className="mt-2 font-serif font-black text-sig-ink"
            style={{
              fontSize: autoSize(content.sectionTitle, T.headline, 40, 22),
              lineHeight: LH.headline,
            }}
          >
            {content.sectionTitle}
          </h3>
        </div>
        <RedBar>{shown.length} programas</RedBar>
      </header>

      <div className="flex flex-1 flex-col justify-center px-[52px]">
        {shown.map((p, i) => (
          <IndexRow
            key={`${p.name}-${i}`}
            index={i + 1}
            title={p.name}
            meta={[p.type, p.modality, p.duration, p.credits]
              .filter(Boolean)
              .join(" · ")}
            accent={p.status !== "soon" && i === 0}
            size={row.title}
            padY={row.padY}
            right={
              p.dateShort ? (
                <span
                  className="whitespace-nowrap font-mono font-bold text-sig-ink"
                  style={{ fontSize: Math.max(24, row.title - 8) }}
                >
                  {p.dateShort}
                </span>
              ) : undefined
            }
          />
        ))}
      </div>

      {(content.qrCaption || content.qrUrl) && (
        <QrFooter
          url={content.qrUrl || undefined}
          label={content.qrCaption}
          note={content.nextLabel ? `A continuación · ${content.nextLabel}` : undefined}
        />
      )}
    </SplitLayout>
  );
}
