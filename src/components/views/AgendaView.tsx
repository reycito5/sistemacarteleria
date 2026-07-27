import type { AgendaContent } from "@/lib/views/schemas";
import { MediaPanel } from "./MediaPanel";
import { StrapLine } from "./ProgramacionGeneralView";

/** Vista 2 / 8 — Agenda académica (referencia: imagen 2). */
export function AgendaView({ content }: { content: AgendaContent }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex min-h-0 flex-1">
        <div className="w-[58%] p-3">
          <MediaPanel media={content.media} />
        </div>

        <div className="flex w-[42%] flex-col px-8 py-6">
          <h2 className="text-[44px] font-black tracking-wide text-inst-blue-top">
            {content.sectionTitle}
          </h2>
          <div className="mt-1 h-[3px] w-28" style={{ background: "var(--color-inst-red)" }} />
          <div className="mt-3 self-start">
            <span
              className="px-5 py-1.5 text-[20px] font-bold text-inst-white"
              style={{ background: "var(--color-inst-red)" }}
            >
              {content.badge}
            </span>
          </div>

          <ul className="mt-4 flex flex-1 flex-col justify-center gap-3">
            {content.items.map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-4 border-b pb-3"
                style={{ borderColor: "var(--color-ui-border)" }}
              >
                {item.imageSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageSrc} alt="" className="h-24 w-32 shrink-0 rounded-sm object-cover" />
                ) : (
                  <div className="grid h-24 w-32 shrink-0 place-items-center rounded-sm bg-inst-blue-bottom text-[14px] font-bold text-inst-white/70">
                    UABJB
                  </div>
                )}
                <div>
                  <p className="text-[26px] font-extrabold uppercase leading-tight text-inst-blue-top">
                    {item.title}
                  </p>
                  {item.date && (
                    <p className="text-[18px]">
                      <span className="font-bold text-inst-red">Fecha:</span> {item.date}
                    </p>
                  )}
                  {item.time && (
                    <p className="text-[18px]">
                      <span className="font-bold text-inst-red">Hora:</span> {item.time}
                    </p>
                  )}
                  {item.place && (
                    <p className="text-[18px]">
                      <span className="font-bold text-inst-red">Lugar:</span> {item.place}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {content.strapline && <StrapLine>{content.strapline}</StrapLine>}
    </div>
  );
}
