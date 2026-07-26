import { INSTITUTION } from "@/lib/design/tokens";

/**
 * Cabecera institucional BLOQUEADA (V11.6).
 * Barra azul sólida + filete dorado fino. No debe modificarse desde plantillas.
 * El espacio de logos queda reservado (los archivos oficiales se colocan luego).
 */
export function InstitutionalHeader() {
  return (
    <header className="shrink-0">
      <div
        className="flex items-center gap-6 px-12"
        style={{ height: 92, background: "var(--color-inst-blue-bottom)" }}
      >
        {/* Espacio reservado para logos oficiales UABJB / Posgrado */}
        <div className="flex items-center gap-4" aria-hidden>
          <div
            className="grid h-14 w-14 place-items-center rounded-sm border-2 font-black text-inst-white"
            style={{ borderColor: "var(--color-inst-gold)" }}
          >
            <span className="text-[13px] leading-none">UABJB</span>
          </div>
          <div
            className="h-12 w-px"
            style={{ background: "var(--color-inst-gold)", opacity: 0.6 }}
          />
        </div>

        <div className="flex-1 text-center">
          <p className="text-[26px] font-extrabold tracking-wide text-inst-white">
            {INSTITUTION.university}
            <span className="mx-3 text-inst-gold">·</span>
            {INSTITUTION.vicerrectorate}
          </p>
        </div>

        {/* Simetría con el bloque de logos */}
        <div className="w-[92px]" aria-hidden />
      </div>
      <div className="inst-rule-gold" />
    </header>
  );
}
