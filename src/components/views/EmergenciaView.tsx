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
      <span className="bg-white px-8 py-3 text-[26px] font-bold uppercase tracking-[.14em] text-sig-red-deep">
        Aviso de emergencia
      </span>

      <h2 className="font-serif text-[64px] font-bold uppercase leading-[1.08] text-white">
        {content.title}
      </h2>

      {content.message && (
        <p className="max-w-[1500px] text-[42px] font-medium leading-[1.3] text-white/90">
          {content.message}
        </p>
      )}

      {content.instructions && (
        <p className="mt-4 max-w-[1400px] border-t-2 border-white/35 pt-8 text-[36px] font-semibold leading-[1.35] text-white">
          {content.instructions}
        </p>
      )}
    </div>
  );
}
