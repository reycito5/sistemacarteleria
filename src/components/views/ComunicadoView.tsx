import type { ComunicadoContent } from "@/lib/views/schemas";

/** Vista 5 — Comunicado importante (referencia: imagen 5). */
export function ComunicadoView({ content }: { content: ComunicadoContent }) {
  return (
    <div className="flex h-full flex-col items-center px-12 py-6 text-center">
      <span
        className="px-6 py-2 text-[24px] font-bold text-inst-white"
        style={{ background: "var(--color-inst-red)" }}
      >
        {content.badge}
      </span>

      <h1 className="mt-4 text-[80px] font-black uppercase leading-[0.95] text-inst-blue-top">
        {content.title}
      </h1>
      {content.subtitle && (
        <p className="mt-2 max-w-[75%] text-[30px] font-medium text-panel-ink">
          {content.subtitle}
        </p>
      )}
      {content.highlight && (
        <p className="mt-3 text-[56px] font-black uppercase text-inst-blue-top">
          {content.highlight}
        </p>
      )}

      <div className="mt-auto flex w-full items-center justify-center gap-12">
        {content.imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={content.imageSrc} alt="" className="h-56 w-96 rounded-sm object-cover" />
        ) : null}

        <ul className="flex flex-col gap-4 text-left">
          {content.specs.map((spec, i) => (
            <li key={i} className="flex items-center gap-3">
              <span
                className="grid h-12 w-12 place-items-center rounded-full text-[22px] text-inst-blue-top"
                style={{ border: "2px solid var(--color-inst-blue-top)" }}
                aria-hidden
              >
                ◷
              </span>
              <span className="text-[24px]">
                <span className="text-panel-muted">{spec.label}</span>
                <br />
                <span className="text-[28px] font-extrabold text-inst-blue-top">{spec.value}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="text-center">
          <div className="grid h-44 w-44 place-items-center bg-inst-white text-[14px] font-bold text-inst-blue-bottom" style={{ border: "3px solid var(--color-inst-blue-bottom)" }}>
            QR
          </div>
          <p className="mt-2 text-[24px] font-extrabold text-inst-blue-top">
            {content.qrCaption}
          </p>
        </div>
      </div>
    </div>
  );
}
