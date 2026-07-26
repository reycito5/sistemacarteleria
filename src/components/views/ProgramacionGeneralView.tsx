import type { ProgramacionGeneralContent } from "@/lib/views/schemas";
import { MediaPanel } from "./MediaPanel";

/** Vista 1 — Programación general (referencia: imagen 1). */
export function ProgramacionGeneralView({
  content,
}: {
  content: ProgramacionGeneralContent;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex min-h-0 flex-1">
        {/* Video institucional principal */}
        <div className="w-[61%] p-3">
          <MediaPanel media={content.media} />
        </div>

        {/* Oferta académica */}
        <div className="flex w-[39%] flex-col px-8 py-6">
          <h2 className="text-center text-[40px] font-black tracking-wide text-inst-blue-top">
            {content.sectionTitle}
          </h2>
          <div className="mx-auto mt-2 h-[3px] w-24" style={{ background: "var(--color-inst-gold)" }} />

          <ul className="mt-4 flex flex-1 flex-col justify-center gap-4">
            {content.offers.map((offer, i) => (
              <li
                key={i}
                className="flex items-center gap-4 border-b pb-4"
                style={{ borderColor: "var(--color-panel-border)" }}
              >
                <span
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-md text-[26px]"
                  style={{ color: "var(--color-inst-red)", border: "2px solid var(--color-inst-red)" }}
                  aria-hidden
                >
                  ◈
                </span>
                <div>
                  <p className="text-[24px] font-extrabold uppercase leading-tight text-inst-blue-top">
                    {offer.title}
                  </p>
                  {offer.modality && (
                    <p className="text-[18px] font-semibold text-inst-red">
                      Modalidad: <span className="font-medium">{offer.modality}</span>
                    </p>
                  )}
                  {offer.start && (
                    <p className="text-[18px] font-semibold text-inst-red">
                      Inicio: <span className="font-medium">{offer.start}</span>
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {content.nextThumb && (
            <div className="relative mt-2 overflow-hidden rounded-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={content.nextThumb} alt="" className="h-28 w-full object-cover" />
              <span
                className="absolute left-0 top-0 px-3 py-1 text-[16px] font-bold text-inst-white"
                style={{ background: "var(--color-inst-blue-bottom)" }}
              >
                {content.nextLabel}
              </span>
            </div>
          )}
        </div>
      </div>

      {content.strapline && (
        <StrapLine>{content.strapline}</StrapLine>
      )}
    </div>
  );
}

export function StrapLine({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-4 py-2">
      <span className="h-[2px] w-16" style={{ background: "var(--color-inst-gold)" }} />
      <span className="text-[22px] font-semibold italic text-inst-blue-top">{children}</span>
      <span className="h-[2px] w-16" style={{ background: "var(--color-inst-gold)" }} />
    </div>
  );
}
