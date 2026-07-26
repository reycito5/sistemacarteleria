import { INSTITUTIONAL_CONTACTS } from "@/lib/design/tokens";
import { LiveClock } from "./LiveClock";

interface InstitutionalFooterProps {
  /** Texto opcional de estado (p. ej. inscripciones) */
  callToAction?: string;
  /** Contenido opcional de código QR (se muestra un marcador si no hay imagen) */
  showQr?: boolean;
}

/**
 * Pie institucional BLOQUEADO (V11.6).
 * Barra azul sólida con contactos, QR, hora y fecha. Estructura inmutable.
 */
export function InstitutionalFooter({
  callToAction = INSTITUTIONAL_CONTACTS.enrollmentLabel,
  showQr = true,
}: InstitutionalFooterProps) {
  return (
    <footer className="shrink-0">
      <div className="inst-rule-gold" />
      <div
        className="flex items-center gap-8 px-12"
        style={{ height: 104, background: "var(--color-inst-blue-bottom)" }}
      >
        <span className="text-[24px] font-extrabold tracking-wide text-inst-gold">
          {callToAction}
        </span>

        <div className="flex items-center gap-6 text-inst-white">
          {INSTITUTIONAL_CONTACTS.phones.map((phone) => (
            <span
              key={phone}
              className="flex items-center gap-2 text-[22px] font-semibold"
            >
              <span
                className="grid h-8 w-8 place-items-center rounded-full text-[16px]"
                style={{ border: "2px solid var(--color-inst-gold)" }}
                aria-hidden
              >
                ☎
              </span>
              {phone}
            </span>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-8">
          {showQr && (
            <div
              className="grid h-16 w-16 place-items-center bg-inst-white text-[10px] font-bold text-inst-blue-bottom"
              aria-label="Código QR institucional"
            >
              QR
            </div>
          )}
          <span
            className="flex items-center gap-2 text-[22px] font-semibold text-inst-white"
            aria-hidden
          >
            <span
              className="grid h-8 w-8 place-items-center rounded-full text-[15px]"
              style={{ border: "2px solid var(--color-inst-gold)" }}
            >
              ◷
            </span>
            <LiveClock />
          </span>
        </div>
      </div>
    </footer>
  );
}
