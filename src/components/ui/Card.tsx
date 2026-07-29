import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Elimina el relleno interno (para tablas o listas a sangre). */
  flush?: boolean;
}

export function Card({ children, className = "", flush = false }: CardProps) {
  return (
    <section
      className={[
        "ui-card overflow-hidden",
        flush ? "" : "p-5 sm:p-6",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </section>
  );
}

interface CardHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function CardHeader({
  title,
  description,
  icon,
  actions,
  className = "",
}: CardHeaderProps) {
  return (
    <div
      className={[
        "flex flex-wrap items-start justify-between gap-3",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex min-w-0 items-start gap-3">
        {icon && (
          <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-info-soft text-brand-ink">
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <h2 className="text-base font-extrabold leading-tight text-brand-ink">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-sm leading-relaxed text-ui-muted">
              {description}
            </p>
          )}
        </div>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
