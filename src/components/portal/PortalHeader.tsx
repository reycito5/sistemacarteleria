"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, LogIn, Menu, X } from "lucide-react";
import { INSTITUTION } from "@/lib/design/tokens";
import { PORTAL_LINKS } from "@/lib/portal/navigation";

/** Cabecera del portal público: marca institucional, menú y acceso al panel. */
export function PortalHeader({ logoUrl = null }: { logoUrl?: string | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40">
      {/* Franja institucional superior */}
      <div className="ui-gradient-inst px-4 py-1.5 sm:px-6">
        <p className="mx-auto max-w-[1180px] text-center text-[10px] font-bold tracking-[0.16em] text-brand-white/85 sm:text-[11px]">
          {INSTITUTION.university}
        </p>
      </div>
      <div className="inst-rule" />

      <div className="border-b border-ui-border bg-ui-surface/92 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3 transition hover:opacity-85">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt="Vicerrectorado de Posgrado — UABJB"
                className="h-11 w-auto max-w-[150px] shrink-0 object-contain"
              />
            ) : (
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-brand-ink-deep text-sm font-black text-brand-red">
                UB
              </span>
            )}
            <span className="min-w-0">
              <span className="block text-[9px] font-bold tracking-[0.2em] text-brand-red">
                {INSTITUTION.vicerrectorate}
              </span>
              <span className="block truncate text-[15px] font-black leading-tight text-brand-ink">
                {INSTITUTION.commercialName}
              </span>
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-1 md:flex">
            {PORTAL_LINKS.map((l) =>
              l.external ? (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-[8px] px-3 py-2 text-[13px] font-semibold text-ui-muted transition hover:bg-ui-canvas hover:text-brand-ink"
                >
                  {l.label}
                  <ArrowUpRight size={13} aria-hidden className="opacity-70" />
                </a>
              ) : (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={close}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={[
                    "relative rounded-[8px] px-3 py-2 text-[13px] font-semibold transition",
                    isActive(l.href)
                      ? "text-brand-ink"
                      : "text-ui-muted hover:bg-ui-canvas hover:text-brand-ink",
                  ].join(" ")}
                >
                  {l.label}
                  {isActive(l.href) && (
                    <span
                      aria-hidden
                      className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand-red"
                    />
                  )}
                </Link>
              ),
            )}
          </nav>

          <Link
            href="/admin/login"
            className="ml-auto hidden h-10 items-center gap-2 rounded-[10px] bg-brand-ink-deep px-4 text-[13px] font-bold text-brand-white transition hover:bg-brand-ink md:ml-3 md:inline-flex"
          >
            <LogIn size={15} aria-hidden />
            Panel
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            className="ml-auto grid h-10 w-10 place-items-center rounded-[10px] border border-ui-border-strong text-brand-ink transition hover:bg-ui-canvas md:hidden"
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>

        {/* Menú móvil */}
        {open && (
          <nav className="border-t border-ui-border bg-ui-surface px-4 py-3 md:hidden">
            <ul className="space-y-0.5">
              {PORTAL_LINKS.map((l) => (
                <li key={l.href}>
                  {l.external ? (
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={close}
                      className="flex items-center gap-1.5 rounded-[8px] px-3 py-2.5 text-sm font-semibold text-ui-muted transition hover:bg-ui-canvas"
                    >
                      {l.label}
                      <ArrowUpRight size={15} aria-hidden className="opacity-70" />
                    </a>
                  ) : (
                    <Link
                      href={l.href}
                      onClick={close}
                      className={[
                        "block rounded-[8px] px-3 py-2.5 text-sm font-semibold transition",
                        isActive(l.href)
                          ? "bg-info-soft text-brand-ink"
                          : "text-ui-muted hover:bg-ui-canvas",
                      ].join(" ")}
                    >
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <Link
              href="/admin/login"
              onClick={close}
              className="mt-3 flex h-11 items-center justify-center gap-2 rounded-[10px] bg-brand-ink-deep text-sm font-bold text-brand-white"
            >
              <LogIn size={16} aria-hidden />
              Acceder al panel
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
