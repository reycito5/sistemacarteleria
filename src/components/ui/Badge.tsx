import type { ReactNode } from "react";

export type BadgeTone = "neutral" | "info" | "ok" | "warn" | "danger" | "gold";

const TONES: Record<BadgeTone, string> = {
  neutral: "bg-ui-canvas text-ui-muted border-ui-border-strong",
  info: "bg-info-soft text-info border-info/20",
  ok: "bg-ok-soft text-ok border-ok/20",
  warn: "bg-warn-soft text-warn border-warn/20",
  danger: "bg-danger-soft text-danger border-danger/20",
  gold: "bg-inst-gold/12 text-warn border-inst-gold/35",
};

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  /** Punto de color a la izquierda (estados en vivo). */
  dot?: boolean;
  className?: string;
}

export function Badge({
  children,
  tone = "neutral",
  dot = false,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5",
        "text-[11px] font-bold uppercase tracking-wide",
        TONES[tone],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {dot && (
        <span
          aria-hidden
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-current"
        />
      )}
      {children}
    </span>
  );
}
