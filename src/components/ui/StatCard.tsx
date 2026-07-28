import type { ReactNode } from "react";
import { Badge, type BadgeTone } from "./Badge";

interface StatCardProps {
  label: ReactNode;
  value: ReactNode;
  icon?: ReactNode;
  /** Nota breve bajo el valor (contexto, unidad o última actualización). */
  note?: ReactNode;
  tone?: BadgeTone;
  badge?: ReactNode;
}

const ACCENTS: Record<BadgeTone, string> = {
  neutral: "from-ui-border to-transparent",
  info: "from-inst-blue/45 to-transparent",
  ok: "from-ok/45 to-transparent",
  warn: "from-inst-gold/60 to-transparent",
  danger: "from-inst-red/45 to-transparent",
  gold: "from-inst-gold/60 to-transparent",
};

export function StatCard({
  label,
  value,
  icon,
  note,
  tone = "info",
  badge,
}: StatCardProps) {
  return (
    <div className="ui-card relative overflow-hidden p-5">
      <span
        aria-hidden
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${ACCENTS[tone]}`}
      />
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-ui-muted">
          {label}
        </p>
        {icon && <span className="shrink-0 text-ui-faint">{icon}</span>}
      </div>
      <p className="ui-tnum mt-2 text-[32px] font-black leading-none text-inst-blue-top">
        {value}
      </p>
      <div className="mt-2 flex items-center gap-2">
        {badge && <Badge tone={tone}>{badge}</Badge>}
        {note && <p className="text-xs text-ui-muted">{note}</p>}
      </div>
    </div>
  );
}
