"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { INSTITUTION } from "@/lib/design/tokens";
import { PORTAL_LINKS } from "@/lib/portal/navigation";
import { Contenedor } from "./editorial";

/**
 * Cabecera del portal: una marquilla de impreso institucional, no una barra de
 * aplicación.
 *
 * La franja con el nombre de la universidad se desplaza con la página y sólo
 * queda fija la barra de navegación; por eso la cabecera se ancla con un `top`
 * negativo equivalente a la altura de esa franja (1.75rem más el filete rojo
 * de 3px). Así se ve la marquilla completa al abrir y una barra ligera durante
 * la lectura.
 */
export function PortalHeader() {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);
  const cerrar = () => setAbierto(false);

  const esActiva = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-[calc(-1.75rem-3px)] z-50">
      {/* Marquilla institucional */}
      <div className="bg-brand-ink-deep">
        <Contenedor>
          <p className="flex h-7 items-center justify-center text-center text-[9px] font-semibold uppercase tracking-[0.26em] text-white/65 sm:text-[10px]">
            <span className="truncate">{INSTITUTION.university}</span>
          </p>
        </Contenedor>
      </div>
      <div className="inst-rule" />

      <div className="border-b border-sig-rule bg-sig-paper/92 backdrop-blur-md">
        <Contenedor>
          <div className="flex h-[4.25rem] items-center gap-6 sm:h-20">
            {/* Logotipo tipográfico */}
            <Link
              href="/"
              onClick={cerrar}
              className="group flex shrink-0 items-center gap-3.5"
            >
              <span
                aria-hidden
                className="grid h-11 w-11 shrink-0 place-items-center border border-brand-ink/30 font-serif text-[17px] font-semibold text-brand-ink transition-colors group-hover:border-brand-red group-hover:text-brand-red"
              >
                UB
              </span>
              <span className="min-w-0">
                <span className="block text-[9px] font-semibold uppercase tracking-[0.26em] text-sig-text-soft">
                  Vicerrectorado de
                </span>
                <span className="block font-serif text-[19px] font-semibold leading-tight tracking-[-0.01em] text-brand-ink sm:text-[21px]">
                  Posgrado
                </span>
              </span>
            </Link>

            <nav
              aria-label="Secciones del portal"
              className="ml-auto hidden lg:block"
            >
              <ul className="flex items-center gap-8">
                {PORTAL_LINKS.map((enlace) => {
                  const activa = esActiva(enlace.href);
                  return (
                    <li key={enlace.href}>
                      <Link
                        href={enlace.href}
                        aria-current={activa ? "page" : undefined}
                        className={`relative block py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                          activa
                            ? "text-brand-ink"
                            : "text-sig-text-soft hover:text-brand-ink"
                        }`}
                      >
                        {enlace.label}
                        {activa && (
                          <span
                            aria-hidden
                            className="absolute inset-x-0 -bottom-0.5 h-[2px] bg-brand-red"
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Acceso al panel: deliberadamente discreto, en letra de colofón. */}
            <Link
              href="/admin/login"
              className="hidden shrink-0 border-l border-sig-rule pl-8 text-[10px] font-semibold uppercase tracking-[0.18em] text-sig-text-soft transition-colors hover:text-brand-red lg:block"
            >
              Acceso
            </Link>

            <button
              type="button"
              onClick={() => setAbierto((v) => !v)}
              aria-label={abierto ? "Cerrar el menú" : "Abrir el menú"}
              aria-expanded={abierto}
              aria-controls="menu-portal"
              className="ml-auto flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-[5px] text-brand-ink lg:hidden"
            >
              <span
                aria-hidden
                className={`h-px w-6 bg-current transition-transform duration-200 ${
                  abierto ? "translate-y-[3px] rotate-45" : ""
                }`}
              />
              <span
                aria-hidden
                className={`h-px w-6 bg-current transition-transform duration-200 ${
                  abierto ? "-translate-y-[3px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </Contenedor>

        {/* Menú compacto: los enlaces se leen como el índice de un impreso. */}
        {abierto && (
          <div
            id="menu-portal"
            className="border-t border-sig-rule bg-sig-paper lg:hidden"
          >
            <Contenedor className="py-4">
              <nav aria-label="Secciones del portal">
                <ul>
                  {PORTAL_LINKS.map((enlace, i) => (
                    <li key={enlace.href}>
                      <Link
                        href={enlace.href}
                        onClick={cerrar}
                        aria-current={esActiva(enlace.href) ? "page" : undefined}
                        className={`flex items-baseline gap-4 py-3.5 font-serif text-[22px] font-semibold tracking-[-0.01em] transition-colors ${
                          i > 0 ? "border-t border-sig-rule" : ""
                        } ${
                          esActiva(enlace.href)
                            ? "text-brand-red"
                            : "text-brand-ink"
                        }`}
                      >
                        <span className="font-mono text-[11px] font-medium text-sig-text-soft">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {enlace.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <Link
                href="/admin/login"
                onClick={cerrar}
                className="mt-5 inline-block border-t border-sig-rule pt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-sig-text-soft"
              >
                Acceso al panel de administración
              </Link>
            </Contenedor>
          </div>
        )}
      </div>
    </header>
  );
}
