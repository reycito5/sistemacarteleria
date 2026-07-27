import Link from "next/link";
import { INSTITUTION } from "@/lib/design/tokens";

const MODULES = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/biblioteca", label: "Biblioteca multimedia" },
  { href: "/admin/plantillas", label: "Plantillas" },
  { href: "/admin/playlist", label: "Playlist general" },
  { href: "/admin/calendario", label: "Calendario" },
  { href: "/admin/comunicados", label: "Comunicados urgentes" },
  { href: "/admin/oferta", label: "Portal de oferta" },
  { href: "/admin/pantallas", label: "Centro de pantallas" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full bg-panel-bg text-panel-ink">
      <aside
        className="flex w-64 shrink-0 flex-col text-inst-white"
        style={{ background: "var(--color-inst-blue-bottom)" }}
      >
        <div className="px-5 py-5">
          <p className="text-[11px] font-semibold tracking-[0.25em] text-inst-gold">
            {INSTITUTION.systemName}
          </p>
          <p className="mt-1 text-lg font-black leading-tight">
            {INSTITUTION.commercialName}
          </p>
        </div>
        <div className="inst-rule-gold" />
        <nav className="flex-1 space-y-1 px-3 py-4">
          {MODULES.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="block rounded px-3 py-2 text-sm font-semibold text-white/85 hover:bg-white/10"
            >
              {m.label}
            </Link>
          ))}
        </nav>
        <div className="px-5 py-4 text-xs text-white/50">
          Línea gráfica V11.6 · bloqueada
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden px-8 py-8">{children}</main>
    </div>
  );
}
