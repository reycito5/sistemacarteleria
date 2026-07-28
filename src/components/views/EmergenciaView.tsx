import type { EmergenciaContent } from "@/lib/views/schemas";
import { T, LH } from "@/components/signage/scale";

/**
 * Vista 16 — Emergencia institucional.
 *
 * Prioridad absoluta: ocupa la pantalla completa sobre el fondo rojo del
 * marco. Sin decoración, sin medios y alineada a la izquierda —se lee más
 * rápido que centrada— con el texto al mayor tamaño posible.
 */
export function EmergenciaView({ content }: { content: EmergenciaContent }) {
  return (
    <div className="flex flex-1 flex-col justify-center px-[96px] py-[48px]">
      <span
        className="self-start bg-white px-8 py-3.5 font-bold uppercase tracking-[.18em] text-sig-red-deep"
        style={{ fontSize: T.meta }}
      >
        Aviso de emergencia
      </span>

      <h2
        className="mt-9 max-w-[1650px] font-serif font-black uppercase text-white"
        style={{ fontSize: T.poster, lineHeight: LH.poster }}
      >
        {content.title}
      </h2>

      {content.message && (
        <p
          className="mt-8 max-w-[1500px] font-medium text-white/90"
          style={{ fontSize: T.bodyLg, lineHeight: 1.28 }}
        >
          {content.message}
        </p>
      )}

      {content.instructions && (
        <p
          className="mt-8 max-w-[1500px] border-t-[4px] border-white/40 pt-8 font-bold text-white"
          style={{ fontSize: T.cardTitle, lineHeight: 1.25 }}
        >
          {content.instructions}
        </p>
      )}
    </div>
  );
}
