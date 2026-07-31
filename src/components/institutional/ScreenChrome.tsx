"use client";

import { useEffect, useState } from "react";
import type { InstitutionIdentity } from "@/lib/institution/identity";
import { SocialIcon, hasSocialIcon } from "@/components/signage/SocialIcon";
import { T } from "@/components/signage/scale";

const DAYS = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];
const MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

/** Reloj de la cabecera. Se hidrata en el cliente y refresca cada 15 s. */
function HeaderClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);

  const date = now
    ? `${DAYS[now.getDay()]}, ${now.getDate()} de ${MONTHS[now.getMonth()]}`
    : "—";
  const time = now
    ? `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes(),
      ).padStart(2, "0")}`
    : "--:--";

  return (
    <div className="ml-auto shrink-0 whitespace-nowrap border-l border-white/15 pl-10 text-right">
      <p
        className="font-semibold capitalize text-white/60"
        style={{ fontSize: T.meta }}
      >
        {date}
      </p>
      <p className="mt-1 font-mono text-[62px] font-bold leading-none tracking-tight text-white">
        {time}
      </p>
    </div>
  );
}

/** Monograma de respaldo cuando todavía no se ha subido el logo. */
function LogoSlot({
  url,
  fallback,
  round = true,
}: {
  url: string | null;
  fallback: string;
  round?: boolean;
}) {
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt=""
        className="h-[112px] w-auto max-w-[190px] shrink-0 object-contain"
      />
    );
  }
  return (
    <div
      className={`grid h-[104px] w-[104px] shrink-0 place-items-center border-2 border-white/55 font-serif text-[28px] font-extrabold text-white ${
        round ? "rounded-full" : "rounded-[6px]"
      }`}
    >
      {fallback}
    </div>
  );
}

/**
 * Cabecera institucional de las pantallas: bloque azul con corte diagonal,
 * los dos logos, la identidad y el reloj sobre el papel.
 */
export function ScreenHeader({
  identity,
  emergency = false,
}: {
  identity: InstitutionIdentity;
  emergency?: boolean;
}) {
  return (
    <header
      className={`relative flex h-[184px] shrink-0 items-center overflow-hidden px-[52px] ${
        emergency ? "bg-sig-red-deep" : "bg-sig-ink"
      }`}
    >
      {/* Franja de acento inferior a todo el ancho (sin corte diagonal). */}
      <span
        aria-hidden
        className={`absolute inset-x-0 bottom-0 h-[8px] ${
          emergency ? "bg-white" : "bg-sig-red"
        }`}
      />

      <div className="relative z-[2] flex w-full items-center">
        {/* Una sola marca, acompañada por una jerarquía institucional de tres niveles. */}
        <div className="flex shrink-0 items-center">
          {identity.logoPrimaryUrl || identity.logoSecondaryUrl ? (
            <LogoSlot
              url={identity.logoPrimaryUrl ?? identity.logoSecondaryUrl}
              fallback="UAB"
              round={false}
            />
          ) : (
            <LogoSlot url={null} fallback="UAB" round={false} />
          )}
        </div>

        <div className="min-w-0 pl-[30px]">
          <p
            className="truncate font-sans font-bold leading-[1.18] tracking-[-0.015em] text-white"
            style={{ fontSize: 22 }}
          >
            {identity.universityName}
          </p>
          <p
            className="mt-1 truncate font-sans font-bold leading-[1.18] tracking-[-0.015em] text-white"
            style={{ fontSize: 22 }}
          >
            {identity.vicerrectorateName}
          </p>
          <p
            className="mt-1 flex min-w-0 items-center gap-2.5 truncate font-sans font-bold leading-[1.18] tracking-[-0.015em] text-white"
            style={{ fontSize: 22 }}
          >
            <span
              aria-hidden
              className="h-[9px] w-[9px] shrink-0 rounded-full bg-sig-red"
            />
            Acreditado internacionalmente · CIEES – México
          </p>
        </div>

        {!emergency && <HeaderClock />}
      </div>
    </header>
  );
}

/**
 * Rótulo inferior único y delgado. Sustituye al pie recargado: lleva la frase
 * institucional y, de forma compacta a la derecha, el contacto y las redes.
 */
export function ScreenTicker({ identity }: { identity: InstitutionIdentity }) {
  return (
    <div className="relative flex h-[84px] shrink-0 items-center gap-6 overflow-hidden bg-sig-ink px-[52px]">
      <span aria-hidden className="absolute inset-x-0 top-0 h-[4px] bg-sig-red" />

      <span
        className="shrink-0 bg-sig-red px-5 py-2.5 font-bold uppercase tracking-[.12em] text-white"
        style={{ fontSize: 19 }}
      >
        {identity.tickerLabel}
      </span>
      {/* Una sola instancia en movimiento: nunca aparecen dos frases simultáneas. */}
      <div className="sig-marquee-mask min-w-0 flex-1 overflow-hidden">
        <div className="sig-marquee">
          <span
            className="font-sans font-medium text-white/90"
            style={{ fontSize: 27 }}
          >
            {identity.tickerText}
          </span>
        </div>
      </div>

      {/* Contacto compacto + redes (lo esencial del antiguo pie). */}
      <div className="flex shrink-0 items-center gap-6">
        {identity.phones.length > 0 && (
          <span
            className="hidden items-center gap-2.5 font-bold text-white/85 xl:flex"
            style={{ fontSize: 22 }}
          >
            <span
              aria-hidden
              className="grid h-8 w-8 place-items-center rounded-full border-2 border-sig-red text-sig-red"
              style={{ fontSize: 16 }}
            >
              ☎
            </span>
            {identity.phones.join(" · ")}
          </span>
        )}
        {identity.social.length > 0 && (
          <span className="flex items-center gap-4 text-white/90">
            {identity.social.slice(0, 4).map((name) =>
              hasSocialIcon(name) ? (
                <SocialIcon key={name} name={name} size={30} />
              ) : null,
            )}
          </span>
        )}
      </div>
    </div>
  );
}

/** Pie institucional: contactos, correo, ubicación y redes. */
export function ScreenFooter({
  identity,
  emergency = false,
}: {
  identity: InstitutionIdentity;
  emergency?: boolean;
}) {
  const columns = [
    { label: "Contacto", value: identity.phones.join(" · ") },
    { label: "Correo", value: identity.email },
    { label: "Ubicación", value: identity.location },
  ];

  return (
    <footer
      className={`flex h-[132px] shrink-0 items-center justify-between gap-8 px-[52px] ${
        emergency
          ? "bg-sig-red-deep"
          : "border-t border-sig-rule bg-sig-paper"
      }`}
    >
      {columns.map((c) => (
        <div key={c.label} className="flex min-w-0 items-center gap-3.5">
          <span
            aria-hidden
            className={`h-[10px] w-[10px] shrink-0 rounded-full ${
              emergency ? "bg-white" : "bg-sig-red"
            }`}
          />
          <div className="min-w-0">
            <p
              className={`font-bold uppercase tracking-[.12em] ${
                emergency ? "text-white/60" : "text-sig-text-faint"
              }`}
              style={{ fontSize: 19 }}
            >
              {c.label}
            </p>
            <p
              className={`mt-0.5 truncate font-bold ${
                emergency ? "text-white" : "text-sig-ink"
              }`}
              style={{ fontSize: T.body }}
            >
              {c.value}
            </p>
          </div>
        </div>
      ))}

      {/* Redes: icono cuando la marca se reconoce, texto si no. */}
      <div className="flex shrink-0 items-center gap-6">
        {identity.social.map((name) => (
          <span
            key={name}
            className={emergency ? "text-white" : "text-sig-ink"}
            title={name}
          >
            {hasSocialIcon(name) ? (
              <SocialIcon name={name} size={40} />
            ) : (
              <span
                className="font-bold uppercase tracking-[.08em]"
                style={{ fontSize: 20 }}
              >
                {name}
              </span>
            )}
          </span>
        ))}
      </div>
    </footer>
  );
}
