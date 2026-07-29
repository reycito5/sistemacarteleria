"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, LogOut, MonitorPlay } from "lucide-react";
import { moduleForPath } from "@/lib/admin/navigation";
import { signOut } from "@/lib/actions/session";
import { LiveClock } from "@/components/institutional/LiveClock";

interface AdminTopbarProps {
  /** Correo de la cuenta con la sesión abierta, si hay Supabase configurado. */
  userEmail: string | null;
}

/**
 * Barra superior del panel: ruta actual, reloj institucional, acceso directo
 * al reproductor y cierre de sesión.
 */
export function AdminTopbar({ userEmail }: AdminTopbarProps) {
  const pathname = usePathname();
  const current = moduleForPath(pathname);
  const isRoot = pathname === "/admin";

  const initials = (userEmail ?? "??").slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-ui-border bg-ui-surface/85 px-4 backdrop-blur-md sm:px-6">
      <nav aria-label="Ruta actual" className="flex min-w-0 items-center gap-1.5">
        <Link
          href="/admin"
          className="shrink-0 text-[13px] font-semibold text-ui-muted transition hover:text-brand-ink"
        >
          Panel
        </Link>
        {!isRoot && current && (
          <>
            <ChevronRight size={14} className="shrink-0 text-ui-faint" aria-hidden />
            <span className="truncate text-[13px] font-bold text-brand-ink">
              {current.label}
            </span>
          </>
        )}
      </nav>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <LiveClock className="ui-tnum hidden text-[13px] font-semibold text-ui-muted sm:block" />

        <Link
          href="/player"
          target="_blank"
          title="Abrir el reproductor en una pestaña nueva"
          className="hidden h-9 items-center gap-2 rounded-[10px] border border-ui-border-strong px-3 text-[13px] font-semibold text-brand-ink transition hover:border-brand-ink-soft/45 hover:bg-info-soft sm:inline-flex"
        >
          <MonitorPlay size={15} aria-hidden />
          Reproductor
        </Link>

        <div className="flex items-center gap-2 border-l border-ui-border pl-2 sm:pl-3">
          <span
            title={userEmail ?? "Sesión no identificada"}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-info-soft text-[12px] font-black text-brand-ink"
          >
            {initials}
          </span>
          <span className="hidden max-w-[180px] truncate text-[13px] font-semibold text-ui-ink lg:block">
            {userEmail ?? "Sin sesión"}
          </span>
          <form action={signOut}>
            <button
              type="submit"
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
              className="grid h-9 w-9 place-items-center rounded-[10px] text-ui-muted transition hover:bg-danger-soft hover:text-brand-red"
            >
              <LogOut size={16} aria-hidden />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
