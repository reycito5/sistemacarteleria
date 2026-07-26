import { INSTITUTION, INSTITUTIONAL_CONTACTS } from "@/lib/design/tokens";

/**
 * Vista de respaldo institucional (sección 28): se muestra cuando no existe
 * programación o falla el contenido. Garantiza que NINGUNA pantalla quede en
 * negro ante errores.
 */
export function BackupView() {
  return (
    <div className="grid h-full place-items-center px-16 text-center">
      <div>
        <h1 className="text-[64px] font-black uppercase leading-tight text-inst-blue-top">
          {INSTITUTION.university}
        </h1>
        <p className="mt-2 text-[36px] font-extrabold text-inst-red">
          {INSTITUTION.vicerrectorate}
        </p>
        <div className="mx-auto mt-6 h-[3px] w-64" style={{ background: "var(--color-inst-gold)" }} />
        <p className="mt-6 text-[28px] font-semibold italic text-inst-blue-top">
          Excelencia académica, investigación y compromiso con el desarrollo del Beni
        </p>
        <p className="mt-8 text-[26px] font-bold text-panel-ink">
          {INSTITUTIONAL_CONTACTS.enrollmentLabel} ·{" "}
          {INSTITUTIONAL_CONTACTS.phones.join(" · ")}
        </p>
      </div>
    </div>
  );
}
