import Link from "next/link";
import { ExternalLink, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
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
      <div className="inst-rule" />
      <div className="ui-gradient-inst text-brand-white">
        <div className="mx-auto grid max-w-[1180px] gap-9 px-4 py-12 sm:px-6 md:grid-cols-2 xl:grid-cols-[1.05fr_0.72fr_1.2fr_1.15fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-[10px] border border-brand-red/45 bg-white/10 text-sm font-black text-brand-red">
                UAB
              </span>
              <div>
                <p className="text-[13px] font-extrabold leading-[1.15] text-white">
                  {INSTITUTION.university}
                </p>
                <p className="mt-1 text-[11px] font-bold leading-[1.2] text-white/85">
                  {INSTITUTION.vicerrectorate}
                </p>
                <p className="mt-1 text-[9px] font-semibold uppercase leading-[1.2] tracking-[.04em] text-brand-red">
                  Acreditado internacionalmente · CIEES – México
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-white/65">
              Sistema institucional de cartelería digital del Vicerrectorado de
              Posgrado de la Universidad Autónoma del Beni «José Ballivián».
            </p>
          </div>

          <nav>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-red">
              Portal
            </p>
            <ul className="mt-3 space-y-2">
              {PORTAL_LINKS.map((l) => (
                <li key={l.href}>
                  {l.external ? (
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[13px] text-white/70 transition hover:text-brand-white"
                    >
                      {l.label}
                    </a>
                  ) : (
                    <Link
                      href={l.href}
                      className="text-[13px] text-white/70 transition hover:text-brand-white"
                    >
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-red">
              Sistema
            </p>
            <ul className="mt-3 space-y-2">
              {SYSTEM_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[13px] text-white/70 transition hover:text-brand-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-red">
              Contacto
            </p>
            <ul className="mt-3 space-y-2">
              {INSTITUTIONAL_CONTACTS.phones.map((phone, i) => (
                <li
                  key={phone}
                  className="flex items-center gap-2 text-[13px] text-white/70"
                >
                  {i === 0 ? (
                    <MessageCircle size={14} className="text-brand-red" aria-hidden />
                  ) : (
                    <Phone size={14} className="text-brand-red" aria-hidden />
                  )}
                  <span className="ui-tnum">{phone}</span>
                </li>
              ))}
              <li className="flex items-start gap-2 text-[13px] leading-relaxed text-white/70">
                <Mail size={14} className="mt-0.5 shrink-0 text-brand-red" aria-hidden />
                <span className="break-all">escuelaposgrado@uabjb.edu.bo</span>
              </li>
              <li className="flex items-start gap-2 text-[13px] leading-relaxed text-white/70">
                <MapPin size={14} className="mt-0.5 shrink-0 text-brand-red" aria-hidden />
                <span>Zona Virgen de Loreto, intersección Av. 6 de Agosto, Trinidad</span>
              </li>
            </ul>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-red">
                Ubicación
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Vicerrectorado+de+Posgrado+UABJB+Trinidad+Bolivia"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/65 transition hover:text-white"
              >
                Abrir mapa <ExternalLink size={12} aria-hidden />
              </a>
            </div>
            <div className="mt-3 overflow-hidden rounded-[14px] border border-white/15 bg-white/5 p-1.5 shadow-2xl">
              <iframe
                title="Ubicación del Vicerrectorado de Posgrado UABJB"
                src="https://www.google.com/maps?q=Vicerrectorado%20de%20Posgrado%20UABJB%20Trinidad%20Bolivia&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[180px] w-full rounded-[10px] border-0"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-2 px-4 py-4 text-[11px] text-white/45 sm:px-6">
            <p>© 2026 Vicerrectorado de Posgrado UABJB</p>
            <p>Grupo {INSTITUTION.generalGroup}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
