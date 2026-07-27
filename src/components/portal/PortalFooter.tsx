import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { INSTITUTION, INSTITUTIONAL_CONTACTS } from "@/lib/design/tokens";
import { PORTAL_LINKS } from "@/lib/portal/navigation";

const SYSTEM_LINKS = [
  { href: "/admin/login", label: "Panel de administración" },
  { href: "/player", label: "Reproductor (kiosco)" },
  { href: "/player/activar", label: "Activar una pantalla" },
];

/** Pie institucional del portal público. */
export function PortalFooter() {
  return (
    <footer className="mt-auto">
      <div className="inst-rule-gold" />
      <div className="ui-gradient-inst text-inst-white">
        <div className="mx-auto grid max-w-[1180px] gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-[10px] border border-inst-gold/45 bg-white/10 text-sm font-black text-inst-gold">
                UB
              </span>
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-inst-gold">
                  {INSTITUTION.systemName}
                </p>
                <p className="text-[15px] font-black leading-tight">
                  {INSTITUTION.commercialName}
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-white/65">
              Sistema institucional de cartelería digital del{" "}
              {INSTITUTION.vicerrectorate.toLowerCase()} de la{" "}
              {INSTITUTION.university}.
            </p>
          </div>

          <nav>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-inst-gold">
              Portal
            </p>
            <ul className="mt-3 space-y-2">
              {PORTAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[13px] text-white/70 transition hover:text-inst-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-inst-gold">
              Sistema
            </p>
            <ul className="mt-3 space-y-2">
              {SYSTEM_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[13px] text-white/70 transition hover:text-inst-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.16em] text-inst-gold">
              Informaciones
            </p>
            <ul className="mt-3 space-y-2">
              {INSTITUTIONAL_CONTACTS.phones.map((phone, i) => (
                <li
                  key={phone}
                  className="flex items-center gap-2 text-[13px] text-white/70"
                >
                  {i === 0 ? (
                    <MessageCircle size={14} className="text-inst-gold" aria-hidden />
                  ) : (
                    <Phone size={14} className="text-inst-gold" aria-hidden />
                  )}
                  <span className="ui-tnum">{phone}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-2 px-4 py-4 text-[11px] text-white/45 sm:px-6">
            <p>{INSTITUTION.university}</p>
            <p>Grupo {INSTITUTION.generalGroup} · Línea gráfica V11.6</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
