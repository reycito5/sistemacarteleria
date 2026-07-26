import type { EmergenciaContent } from "@/lib/views/schemas";

/**
 * Vista 16 — Emergencia institucional (sección 16).
 * Prioridad absoluta; se muestra a sangre completa en las cuatro pantallas.
 */
export function EmergenciaView({ content }: { content: EmergenciaContent }) {
  return (
    <div
      className="flex h-full flex-col items-center justify-center px-16 text-center text-inst-white"
      style={{ background: "var(--color-inst-red)" }}
    >
      <span className="text-[34px] font-black uppercase tracking-[0.3em]">
        ⚠ Emergencia institucional ⚠
      </span>
      <h1 className="mt-6 text-[96px] font-black uppercase leading-[0.95]">
        {content.title}
      </h1>
      {content.message && (
        <p className="mt-6 max-w-[80%] text-[40px] font-semibold">
          {content.message}
        </p>
      )}
      {content.instructions && (
        <p className="mt-8 max-w-[80%] rounded-sm bg-black/20 px-8 py-4 text-[32px] font-bold">
          {content.instructions}
        </p>
      )}
    </div>
  );
}
