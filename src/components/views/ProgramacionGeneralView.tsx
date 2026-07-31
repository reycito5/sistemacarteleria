import type { ProgramacionGeneralContent } from "@/lib/views/schemas";
import {
  CardBody,
  CardHead,
  NextStrip,
  PhotoPanel,
  ProgramTicket,
  QrStrip,
  SigCard,
  type ProgramLike,
} from "@/components/signage/primitives";
import { VerticalPager } from "@/components/signage/VerticalPager";

/**
 * Vista 1 — Programación general y oferta académica.
 *
 * Panel de video o imagen a la izquierda y listado de programas a la derecha.
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

  return (
    <>
      <PhotoPanel
        span={7}
        media={content.media}
        eyebrow={content.headlineEyebrow}
        title={content.headline || content.sectionTitle}
        sub={content.subheadline || content.strapline}
      />

      <SigCard span={5}>
        <CardHead eyebrow={content.cardEyebrow} title={content.sectionTitle} />
        <CardBody>
          <VerticalPager
            pageSize={3}
            items={programs.map((p, i) => (
              <ProgramTicket key={`${p.name}-${i}`} program={p} />
            ))}
          />
        </CardBody>
        {/* Una sola banda inferior: el QR manda; si no hay, se muestra el
            «A continuación». Evita apilar dos franjas y tapar los listados. */}
        {content.qrCaption ? (
          <QrStrip label={content.qrCaption} url={content.qrUrl} />
        ) : (
          content.nextLabel && <NextStrip label={content.nextLabel} />
        )}
      </SigCard>
    </>
  );
}
