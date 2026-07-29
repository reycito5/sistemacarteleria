"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Menu, X } from "lucide-react";
import { INSTITUTION } from "@/lib/design/tokens";
import { ADMIN_SECTIONS } from "@/lib/admin/navigation";
import { AdminIcon } from "./AdminIcon";

/**
 * Navegación del panel.
 *
 *  - Escritorio (lg+): barra lateral fija con los módulos agrupados por etapa
 *    del flujo de trabajo.
 *  - Móvil/tablet: botón de menú + cajón deslizante.
 */
export function AdminNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  // Bloquea el scroll del fondo mientras el cajón está abierto.
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
    <Link
      href="/admin"
      className="flex items-center gap-3 px-5 py-5 transition hover:opacity-90"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] border border-brand-red/45 bg-white/10 text-sm font-black text-brand-red">
        UAB
      </span>
      <span className="min-w-0">
        <span className="block text-[10px] font-bold tracking-[0.22em] text-brand-red">
          {INSTITUTION.systemName}
        </span>
        <span className="mt-0.5 block text-[14px] font-black leading-tight text-brand-white">
          {INSTITUTION.commercialName}
        </span>
      </span>
    </Link>
  );

  const links = (
    <nav className="ui-scroll flex-1 overflow-y-auto px-3 py-3">
      {ADMIN_SECTIONS.map((section) => (
        <div key={section.title} className="mb-4 last:mb-0">
          <p className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
            {section.title}
          </p>
          <ul className="space-y-0.5">
            {section.modules.map((m) => {
              const active = isActive(m.href);
              return (
                <li key={m.href}>
                  <Link
                    href={m.href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "group relative flex items-center gap-3 rounded-[10px] px-3 py-2.5",
                      "text-[13px] font-semibold transition",
                      active
                        ? "bg-white/15 text-brand-white"
                        : "text-white/70 hover:bg-white/10 hover:text-brand-white",
                    ].join(" ")}
                  >
                    <span
                      aria-hidden
                      className={[
                        "absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full transition",
                        active ? "bg-brand-red" : "bg-transparent",
                      ].join(" ")}
                    />
                    <AdminIcon
                      name={m.icon}
                      size={17}
                      className={active ? "text-brand-red" : "text-white/55"}
                    />
                    <span className="min-w-0 truncate">{m.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  const bottom = (
    <div className="border-t border-white/10 px-3 py-3">
      <Link
        href="/player"
        target="_blank"
        onClick={close}
        className="flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[13px] font-semibold text-white/70 transition hover:bg-white/10 hover:text-brand-white"
      >
        <ExternalLink size={16} className="text-white/55" aria-hidden />
        Ver el reproductor
      </Link>
      <p className="px-3 pt-2 text-[10px] leading-relaxed text-white/35">
        Línea gráfica institucional V12
      </p>
    </div>
  );

  const panel = (
    <>
      {brand}
      <div className="inst-rule" />
      {links}
      {bottom}
    </>
  );

  return (
    <>
      {/* Barra lateral fija — escritorio */}
      <aside className="ui-gradient-inst hidden w-[264px] shrink-0 flex-col lg:sticky lg:top-0 lg:flex lg:h-dvh">
        {panel}
      </aside>

      {/* Botón de menú — móvil / tablet */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-40 grid h-13 w-13 place-items-center rounded-full bg-brand-ink-deep p-3.5 text-brand-white shadow-[var(--shadow-ui-lg)] transition hover:bg-brand-ink lg:hidden"
      >
        <Menu size={22} />
      </button>

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
            "absolute inset-0 bg-black/55 backdrop-blur-[2px] transition-opacity duration-200",
            open ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menú de administración"
          className={[
            "ui-gradient-inst absolute inset-y-0 left-0 flex w-[280px] max-w-[86%] flex-col",
            "shadow-2xl transition-transform duration-200 ease-out",
            open ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
            className="absolute right-3 top-4 grid h-9 w-9 place-items-center rounded-[10px] border border-white/25 text-brand-white transition hover:bg-white/10"
          >
            <X size={17} />
          </button>
          {panel}
        </div>
      </div>
    </>
  );
}
