import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: ReactNode;
  /** Explica el siguiente paso concreto, no sólo que está vacío. */
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center rounded-[16px] border border-dashed",
        "border-ui-border-strong bg-ui-raised px-6 py-12 text-center",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {icon && (
        <span className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-info-soft text-inst-blue-top">
          {icon}
        </span>
      )}
      <p className="text-base font-extrabold text-inst-blue-top">{title}</p>
      {description && (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-ui-muted">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
