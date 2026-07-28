import Link from "next/link";
import { INSTITUTION, INSTITUTIONAL_CONTACTS } from "@/lib/design/tokens";
import { PORTAL_ACCESOS_INTERNOS, PORTAL_LINKS } from "@/lib/portal/navigation";
import {
  CampoTinta,
  Contenedor,
  DATO,
  FOCO_TINTA,
  ROTULO,
  TITULAR_M,
} from "./editorial";

const [whatsapp, telefono] = INSTITUTIONAL_CONTACTS.phones;

/**
 * Colofón del portal.
 *
 * Cierra el impreso: quién firma, cómo se le encuentra y —en letra pequeña, al
 * final de todo— los accesos operativos. El panel no puede desaparecer, pero
 * tampoco puede competir con la información pública, así que baja al último
 * renglón junto a la nota de créditos.
 */
export function PortalFooter() {
  return (
    <footer className="mt-auto">
      <div className="inst-rule" />
      <CampoTinta>
        <Contenedor className="py-14 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-20">
            <div>
              <p className={`${ROTULO} text-white/60`}>
                {INSTITUTION.university}
              </p>
              <p className={`mt-5 text-balance text-white ${TITULAR_M}`}>
                Vicerrectorado de Posgrado
              </p>
              <p className="mt-6 max-w-[46ch] text-[15px] leading-[1.75] text-white/70">
                Formación de cuarto nivel de la Universidad Autónoma del Beni
                «José Ballivián»: doctorados, maestrías, especialidades y
                diplomados para el ejercicio profesional en el departamento.
              </p>
            </div>

            <div>
              <p className={`${ROTULO} text-white/60`}>Informaciones</p>
              <ul className="mt-6 space-y-5">
                <li>
                  <a
                    href={`https://wa.me/591${whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className={`${DATO} ${FOCO_TINTA} block text-[26px] font-semibold leading-none text-white transition-colors hover:text-brand-red sm:text-[30px]`}
                  >
                    {whatsapp}
                  </a>
                  <span className="mt-2 block text-[11px] uppercase tracking-[0.2em] text-white/60">
                    WhatsApp
                  </span>
                </li>
                <li>
                  <a
                    href={`tel:+591${telefono}`}
                    className={`${DATO} ${FOCO_TINTA} block text-[26px] font-semibold leading-none text-white transition-colors hover:text-brand-red sm:text-[30px]`}
                  >
                    {telefono}
                  </a>
                  <span className="mt-2 block text-[11px] uppercase tracking-[0.2em] text-white/60">
                    Teléfono · Lunes a viernes, 08:00 a 16:00
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <nav
            aria-label="Índice del portal"
            className="mt-14 border-t border-white/15 pt-8"
          >
            <ul className="flex flex-wrap gap-x-10 gap-y-4">
              {PORTAL_LINKS.map((enlace) => (
                <li key={enlace.href}>
                  <Link
                    href={enlace.href}
                    className={`text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75 transition-colors hover:text-white ${FOCO_TINTA}`}
                  >
                    {enlace.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Contenedor>

        <div className="border-t border-white/12">
          <Contenedor>
            <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-6 text-[10px] uppercase tracking-[0.18em] text-white/60">
              <p>
                {INSTITUTION.commercialName} · {INSTITUTION.generalGroup}
              </p>
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
                {PORTAL_ACCESOS_INTERNOS.map((enlace) => (
                  <li key={enlace.href}>
                    <Link
                      href={enlace.href}
                      className={`transition-colors hover:text-white ${FOCO_TINTA}`}
                    >
                      {enlace.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Contenedor>
        </div>
      </CampoTinta>
    </footer>
  );
}
