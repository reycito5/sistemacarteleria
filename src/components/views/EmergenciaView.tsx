import type { EmergenciaContent } from "@/lib/views/schemas";

/**
 * Vista 16 — Emergencia institucional.
 *
 * Prioridad absoluta: ocupa la pantalla completa sobre el fondo rojo del
 * marco. Sin decoración, sin medios y con el texto al mayor tamaño posible
 * para leerse desde lejos.
 */
export function EmergenciaView({ content }: { content: EmergenciaContent }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-[120px] text-center">
      <span className="bg-white px-[18px] py-[7px] text-[11px] font-bold uppercase tracking-[1.6px] text-sig-red-deep">
        Aviso de emergencia
      </span>

      <h2 className="font-serif text-[64px] font-bold uppercase leading-[1.08] text-white">
        {content.title}
      </h2>

      {content.message && (
        <p className="max-w-[1200px] text-[26px] font-medium leading-[1.5] text-white/90">
          {content.message}
        </p>
      )}

      {content.instructions && (
        <p className="mt-2 max-w-[1100px] border-t border-white/30 pt-6 text-[22px] font-semibold leading-[1.5] text-white">
          {content.instructions}
        </p>
      )}
    </div>
  );
}
