import type { SincronizacionContent } from "@/lib/views/schemas";
import { INSTITUTION } from "@/lib/design/tokens";

/** Vista 14 — Sincronización (técnica, sección 11). */
export function SincronizacionView({
  content,
}: {
  content: SincronizacionContent;
}) {
  return (
    <div
      className="grid h-full place-items-center"
      style={{ background: "var(--color-inst-blue-bottom)" }}
    >
      <div className="text-center text-inst-white">
        <div
          className="mx-auto h-20 w-20 animate-spin rounded-full border-4 border-inst-white/25"
          style={{ borderTopColor: "var(--color-inst-gold)" }}
        />
        <h1 className="mt-8 text-[48px] font-black tracking-wide">
          {INSTITUTION.commercialName}
        </h1>
        <p className="mt-2 text-[26px] font-semibold text-inst-gold">
          Preparando la programación institucional
        </p>
        <ul className="mt-8 space-y-2 text-[24px] font-medium">
          {content.steps.map((step) => (
            <li key={step} className="flex items-center justify-center gap-3">
              <span className="text-inst-gold">›</span> {step}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
