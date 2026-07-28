"use client";

import { useEffect, useState } from "react";
import type { InstitutionIdentity } from "@/lib/institution/identity";

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
    <div className="ml-auto shrink-0 whitespace-nowrap pl-10 text-right">
      <p className="text-[14px] font-semibold capitalize text-sig-text-soft">
        {date}
      </p>
      <p className="mt-0.5 font-mono text-[34px] font-bold tracking-[.5px] text-sig-ink">
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
        className="h-[64px] w-auto max-w-[132px] shrink-0 object-contain"
      />
    );
  }
  return (
    <div
      className={`grid h-[64px] w-[64px] shrink-0 place-items-center border border-white/55 font-serif text-[15px] font-bold text-white ${
        round ? "rounded-full" : "rounded-[3px]"
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
    <header className="relative h-[152px] shrink-0 overflow-hidden bg-sig-paper">
      <div
        aria-hidden
        className={`absolute inset-0 w-[74%] ${
          emergency ? "bg-sig-red-deep" : "bg-sig-ink"
        }`}
        style={{
          clipPath: emergency
            ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
            : "polygon(0 0, 100% 0, calc(100% - 90px) 100%, 0% 100%)",
        }}
      >
        <span
          className={`absolute inset-x-0 bottom-0 h-[5px] ${
            emergency ? "bg-white" : "bg-sig-red"
          }`}
        />
      </div>

      <div className="relative z-[2] flex h-full items-center px-[46px]">
        <div className="flex shrink-0 items-center gap-3.5">
          <LogoSlot url={identity.logoPrimaryUrl} fallback="UAB" />
          <span aria-hidden className="h-[38px] w-px bg-white/25" />
          {identity.logoSecondaryUrl ? (
            <LogoSlot url={identity.logoSecondaryUrl} fallback="" round={false} />
          ) : (
            <p className="font-serif text-[13px] font-semibold leading-[1.3] text-white/80">
              Posgrado
              <br />
              UABJB
            </p>
          )}
        </div>

        <div className="pl-[26px]">
          <p className="text-[13.5px] font-medium tracking-[.2px] text-white/55">
            {identity.universityName}
          </p>
          <p className="mt-0.5 font-serif text-[29px] font-semibold tracking-[.2px] text-white">
            {identity.vicerrectorateName}
          </p>
        </div>

        {!emergency && <HeaderClock />}
      </div>
    </header>
  );
}

/** Rótulo desplazable inferior con la frase institucional. */
export function ScreenTicker({ identity }: { identity: InstitutionIdentity }) {
  return (
    <div className="flex h-[64px] shrink-0 items-center gap-5 overflow-hidden bg-sig-ink px-[46px]">
      <span className="shrink-0 bg-sig-red px-4 py-2 text-[11px] font-bold uppercase tracking-[1.4px] text-white">
        {identity.tickerLabel}
      </span>
      <p className="whitespace-nowrap font-serif text-[16px] font-medium italic text-white/85">
        {identity.tickerText}
      </p>
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
      className={`flex h-[96px] shrink-0 items-center justify-between px-[46px] ${
        emergency
          ? "bg-sig-red-deep"
          : "border-t border-sig-rule bg-sig-paper"
      }`}
    >
      {columns.map((c) => (
        <div key={c.label} className="flex items-center gap-3">
          <span
            aria-hidden
            className={`h-[5px] w-[5px] shrink-0 rounded-full ${
              emergency ? "bg-white" : "bg-sig-red"
            }`}
          />
          <div>
            <p
              className={`text-[9.5px] font-bold uppercase tracking-[1.1px] ${
                emergency ? "text-white/55" : "text-sig-text-faint"
              }`}
            >
              {c.label}
            </p>
            <p
              className={`mt-px text-[13.5px] font-bold ${
                emergency ? "text-white" : "text-sig-ink"
              }`}
            >
              {c.value}
            </p>
          </div>
        </div>
      ))}

      <div className="flex gap-[22px]">
        {identity.social.map((s) => (
          <span
            key={s}
            className={`text-[11px] font-bold uppercase tracking-[.5px] ${
              emergency ? "text-white/75" : "text-sig-text-soft"
            }`}
          >
            {s}
          </span>
        ))}
      </div>
    </footer>
  );
}
