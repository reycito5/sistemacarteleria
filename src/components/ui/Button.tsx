import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "gold";
export type ButtonSize = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-[10px] font-bold " +
  "transition duration-150 select-none whitespace-nowrap " +
  "disabled:cursor-not-allowed disabled:opacity-55 disabled:shadow-none";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-ink-deep text-brand-white shadow-[var(--shadow-ui-sm)] " +
    "hover:bg-brand-ink hover:shadow-[var(--shadow-ui)] active:translate-y-px",
  secondary:
    "bg-ui-surface text-brand-ink border border-ui-border-strong " +
    "hover:border-brand-ink-soft/45 hover:bg-info-soft active:translate-y-px",
  ghost:
    "bg-transparent text-ui-muted hover:bg-ui-canvas hover:text-ui-ink",
  danger:
    "bg-brand-red text-brand-white shadow-[var(--shadow-ui-sm)] " +
    "hover:brightness-110 hover:shadow-[var(--shadow-ui)] active:translate-y-px",
  gold:
    "bg-brand-red text-brand-ink-deep shadow-[var(--shadow-ui-sm)] " +
    "hover:bg-brand-red active:translate-y-px",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Ocupa todo el ancho disponible. */
  block?: boolean;
  className?: string;
  children?: ReactNode;
}

export function buttonClasses({
  variant = "primary",
  size = "md",
  block = false,
  className = "",
}: CommonProps = {}): string {
  return [
    BASE,
    VARIANTS[variant],
    SIZES[size],
    block ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

type ButtonProps = CommonProps &
  Omit<ComponentProps<"button">, "className" | "children">;

export function Button({
  variant,
  size,
  block,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, block, className })}
      {...rest}
    >
      {children}
    </button>
  );
}

type ButtonLinkProps = CommonProps & ComponentProps<typeof Link>;

/** Mismo aspecto que `Button`, pero navega como enlace. */
export function ButtonLink({
  variant,
  size,
  block,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link className={buttonClasses({ variant, size, block, className })} {...rest}>
      {children}
    </Link>
  );
}
