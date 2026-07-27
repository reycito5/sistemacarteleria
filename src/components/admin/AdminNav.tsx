"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { INSTITUTION } from "@/lib/design/tokens";

export interface AdminModule {
  href: string;
  label: string;
}

/**
 * Navegación del panel con dos modos:
 *  - Escritorio (lg+): barra lateral fija.
 *  - Móvil/tablet: cabecera compacta + cajón deslizante (drawer) accesible.
 *
 * La línea gráfica institucional (colores, tipografía) se respeta; sólo cambia
 * el chrome del panel de administración, que no forma parte de la V11.6 bloqueada.
 */
export function AdminNav({ modules }: { modules: AdminModule[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Bloquea el scroll del fondo mientras el cajón está abierto (móvil).
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/admin"
      ? pathname === "/admin"
      : pathname === href || pathname.startsWith(`${href}/`);

  const brand = (
    <div className="px-5 py-5">
      <p className="text-[11px] font-semibold tracking-[0.25em] text-inst-gold">
        {INSTITUTION.systemName}
      </p>
      <p className="mt-1 text-lg font-black leading-tight text-inst-white">
        {INSTITUTION.commercialName}
      </p>
    </div>
  );

  const links = (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
      {modules.map((m) => {
        const active = isActive(m.href);
        return (
          <Link
            key={m.href}
            href={m.href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={[
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition",
              active
                ? "bg-white/15 text-inst-white shadow-sm"
                : "text-white/75 hover:bg-white/10 hover:text-inst-white",
            ].join(" ")}
          >
            <span
              aria-hidden
              className={[
                "h-5 w-1 rounded-full transition",
                active ? "bg-inst-gold" : "bg-transparent",
              ].join(" ")}
            />
            {m.label}
          </Link>
        );
      })}
    </nav>
  );

  const footerNote = (
    <div className="px-5 py-4 text-xs text-white/45">
      Línea gráfica V11.6 · bloqueada
    </div>
  );

  return (
    <>
      {/* Barra lateral fija — escritorio */}
      <aside
        className="hidden w-64 shrink-0 flex-col lg:flex lg:sticky lg:top-0 lg:h-dvh"
        style={{ background: "var(--color-inst-blue-bottom)" }}
      >
        {brand}
        <div className="inst-rule-gold" />
        {links}
        {footerNote}
      </aside>

      {/* Cabecera compacta — móvil / tablet */}
      <header
        className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 text-inst-white lg:hidden"
        style={{ background: "var(--color-inst-blue-bottom)" }}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
          aria-expanded={open}
          className="grid h-10 w-10 place-items-center rounded-lg border border-white/25 transition hover:bg-white/10"
        >
          <span className="space-y-[5px]" aria-hidden>
            <span className="block h-0.5 w-5 bg-inst-white" />
            <span className="block h-0.5 w-5 bg-inst-white" />
            <span className="block h-0.5 w-5 bg-inst-white" />
          </span>
        </button>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold tracking-[0.2em] text-inst-gold">
            {INSTITUTION.systemName}
          </p>
          <p className="truncate text-sm font-black leading-tight">
            {INSTITUTION.commercialName}
          </p>
        </div>
      </header>

      {/* Cajón deslizante — móvil / tablet */}
      <div
        className={[
          "fixed inset-0 z-50 lg:hidden",
          open ? "" : "pointer-events-none",
        ].join(" ")}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={[
            "absolute inset-0 bg-black/50 transition-opacity duration-200",
            open ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menú de administración"
          className={[
            "absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col shadow-2xl transition-transform duration-200 ease-out",
            open ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
          style={{ background: "var(--color-inst-blue-bottom)" }}
        >
          <div className="flex items-start justify-between">
            {brand}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
              className="m-3 grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/25 text-inst-white transition hover:bg-white/10"
            >
              <span aria-hidden className="text-lg leading-none">
                ×
              </span>
            </button>
          </div>
          <div className="inst-rule-gold" />
          {links}
          {footerNote}
        </div>
      </div>
    </>
  );
}
