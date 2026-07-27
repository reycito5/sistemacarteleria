import {
  AlertTriangle,
  CheckCircle2,
  Info,
  OctagonAlert,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

export type AlertTone = "info" | "ok" | "warn" | "danger";

const TONES: Record<AlertTone, { box: string; icon: LucideIcon; accent: string }> =
  {
    info: {
      box: "bg-info-soft border-info/25 text-info",
      icon: Info,
      accent: "bg-info",
    },
    ok: {
      box: "bg-ok-soft border-ok/25 text-ok",
      icon: CheckCircle2,
      accent: "bg-ok",
    },
    warn: {
      box: "bg-warn-soft border-warn/25 text-warn",
      icon: AlertTriangle,
      accent: "bg-inst-gold",
    },
    danger: {
      box: "bg-danger-soft border-danger/25 text-danger",
      icon: OctagonAlert,
      accent: "bg-inst-red",
    },
  };

interface AlertProps {
  tone?: AlertTone;
  title?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

/** Aviso contextual con icono, borde de color y acción opcional. */
export function Alert({
  tone = "info",
  title,
  children,
  actions,
  className = "",
}: AlertProps) {
  const { box, icon: Icon, accent } = TONES[tone];
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={[
        "relative flex gap-3 overflow-hidden rounded-[12px] border py-3 pl-5 pr-4",
        box,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span aria-hidden className={`absolute inset-y-0 left-0 w-1.5 ${accent}`} />
      <Icon aria-hidden size={18} className="mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1 text-sm">
        {title && <p className="font-bold">{title}</p>}
        {children && (
          <div className={title ? "mt-0.5 text-ui-ink-soft" : "text-ui-ink-soft"}>
            {children}
          </div>
        )}
        {actions && <div className="mt-2.5 flex flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}
