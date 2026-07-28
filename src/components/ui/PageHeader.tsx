import type { ReactNode } from "react";

interface PageHeaderProps {
  /** Etiqueta corta sobre el título: en qué parte del flujo estamos. */
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

/** Encabezado uniforme de cada pantalla del panel. */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className = "",
}: PageHeaderProps) {
  return (
    <header
      className={[
        "flex flex-wrap items-end justify-between gap-4 border-b border-ui-border pb-5",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-inst-gold">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-1 text-[26px] font-black leading-tight text-inst-blue-top sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ui-muted">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      )}
    </header>
  );
}
