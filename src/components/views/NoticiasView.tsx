import type { NoticiasContent } from "@/lib/views/schemas";
import { MediaPanel } from "./MediaPanel";
import { StrapLine } from "./ProgramacionGeneralView";

/** Vista 4 / 9 — Noticias y logros (referencia: imagen 4). */
export function NoticiasView({ content }: { content: NoticiasContent }) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-8 pt-4">
        <h2 className="text-[46px] font-black uppercase text-inst-blue-top">
          {content.title}
        </h2>
        <div className="mt-1 h-[3px] w-full" style={{ background: "var(--color-inst-gold)" }} />
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="w-[52%] p-3">
          <MediaPanel media={content.media} />
        </div>

        <div className="flex w-[48%] flex-col px-8 py-4">
          <div className="self-start">
            <span
              className="px-5 py-1.5 text-[20px] font-bold text-inst-white"
              style={{ background: "var(--color-inst-red)" }}
            >
              {content.badge}
            </span>
          </div>

          <ul className="mt-3 flex flex-col gap-3">
            {content.items.map((item, i) => (
              <li key={i} className="border-b pb-3" style={{ borderColor: "var(--color-panel-border)" }}>
                <p className="text-[17px] font-semibold">
                  <span className="text-panel-muted">{item.date}</span>
                  <span className="mx-2 text-inst-gold">|</span>
                  <span className="text-inst-red">{item.tag}</span>
                </p>
                <p className="text-[26px] font-extrabold leading-tight text-inst-blue-top">
                  {item.headline}
                </p>
              </li>
            ))}
          </ul>

          {content.bigStat && (
            <div className="mt-auto flex items-center gap-4">
              <span className="text-[68px] font-black leading-none text-inst-gold">
                {content.bigStat}
              </span>
              <span className="text-[26px] font-extrabold uppercase leading-tight text-inst-blue-top">
                {content.bigStatLabel}
              </span>
            </div>
          )}
        </div>
      </div>

      {content.strapline && <StrapLine>{content.strapline}</StrapLine>}
    </div>
  );
}
