import type { ProgramaDestacadoContent } from "@/lib/views/schemas";
import { MediaPanel } from "./MediaPanel";

/** Vista 3 — Programa destacado (referencia: imagen 3). */
export function ProgramaDestacadoView({
  content,
}: {
  content: ProgramaDestacadoContent;
}) {
  return (
    <div className="flex h-full">
      <div className="w-[55%] p-3">
        <MediaPanel media={content.media} />
      </div>

      <div className="flex w-[45%] flex-col px-8 py-6">
        <div className="self-start">
          <span
            className="px-5 py-1.5 text-[20px] font-bold text-inst-white"
            style={{ background: "var(--color-inst-red)" }}
          >
            {content.badge}
          </span>
        </div>

        <h2 className="mt-3 text-[52px] font-black uppercase leading-[0.95] text-inst-blue-top">
          {content.programName}
        </h2>

        <div className="mt-5 flex gap-8">
          <ul className="flex flex-col gap-3">
            {content.specs.map((spec, i) => (
              <li key={i} className="flex items-center gap-3">
                <span
                  className="grid h-9 w-9 place-items-center rounded-md text-[18px]"
                  style={{ color: "var(--color-inst-red)", border: "2px solid var(--color-inst-red)" }}
                  aria-hidden
                >
                  ◆
                </span>
                <span className="text-[22px]">
                  <span className="font-extrabold text-inst-blue-top">{spec.label}:</span>{" "}
                  {spec.value}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto flex items-end justify-between gap-6">
          {content.quote && (
            <p className="max-w-[55%] text-[30px] font-black uppercase italic leading-tight text-inst-blue-top">
              “{content.quote}”
            </p>
          )}
          <div className="text-center">
            <div className="grid h-32 w-32 place-items-center bg-inst-white text-[12px] font-bold text-inst-blue-bottom" style={{ border: "3px solid var(--color-inst-blue-bottom)" }}>
              QR
            </div>
            <p className="mt-1 text-[16px] font-bold text-inst-blue-top">{content.qrCaption}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
