import type { ComponentProps, ReactNode } from "react";

const CONTROL =
  "w-full rounded-[10px] border border-ui-border-strong bg-ui-surface px-3 " +
  "text-sm text-ui-ink placeholder:text-ui-faint outline-none transition " +
  "hover:border-brand-ink-soft/35 focus:border-brand-ink-soft focus:ring-4 " +
  "focus:ring-brand-ink-soft/12 disabled:bg-ui-canvas disabled:text-ui-faint";

export const inputClasses = `${CONTROL} h-10`;
export const textareaClasses = `${CONTROL} py-2.5 leading-relaxed`;
export const selectClasses = `${CONTROL} h-10 appearance-none pr-9`;

interface FieldProps {
  label: ReactNode;
  /** Texto de ayuda bajo el control: explica qué hace y dónde se verá. */
  hint?: ReactNode;
  error?: string | null;
  required?: boolean;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Envoltorio de campo de formulario: etiqueta, ayuda y error en una sola
 * estructura, para que todos los formularios del panel se lean igual.
 */
export function Field({
  label,
  hint,
  error,
  required,
  htmlFor,
  children,
  className = "",
}: FieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-1.5 text-sm font-semibold text-ui-ink"
      >
        {label}
        {required && (
          <span className="text-brand-red" aria-hidden>
            *
          </span>
        )}
      </label>
      {hint && <p className="mt-0.5 text-xs leading-relaxed text-ui-muted">{hint}</p>}
      <div className="mt-1.5">{children}</div>
      {error && (
        <p role="alert" className="mt-1.5 text-xs font-semibold text-brand-red">
          {error}
        </p>
      )}
    </div>
  );
}

export function Input({ className = "", ...rest }: ComponentProps<"input">) {
  return <input className={`${inputClasses} ${className}`} {...rest} />;
}

export function Textarea({ className = "", ...rest }: ComponentProps<"textarea">) {
  return <textarea className={`${textareaClasses} ${className}`} {...rest} />;
}

export function Select({ className = "", children, ...rest }: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select className={`${selectClasses} ${className}`} {...rest}>
        {children}
      </select>
      <span
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ui-faint"
      >
        ▾
      </span>
    </div>
  );
}
