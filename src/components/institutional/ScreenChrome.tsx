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
    <div className="ml-auto shrink-0 whitespace-nowrap pl-12 text-right">
      <p
        className="font-semibold capitalize text-sig-text-soft"
        style={{ fontSize: T.meta }}
      >
        {date}
      </p>
      <p className="mt-1 font-mono text-[62px] font-bold leading-none tracking-tight text-sig-ink">
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
        className="h-[86px] w-auto max-w-[200px] shrink-0 object-contain"
      />
    );
  }
  return (
    <div
      className={`grid h-[86px] w-[86px] shrink-0 place-items-center border-2 border-white/55 font-serif text-[26px] font-bold text-white ${
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
    <header className="relative h-[168px] shrink-0 overflow-hidden bg-sig-paper">
      <div
        aria-hidden
        className={`absolute inset-0 w-[74%] ${
          emergency ? "bg-sig-red-deep" : "bg-sig-ink"
        }`}
        style={{
          clipPath: emergency
            ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
            : "polygon(0 0, 100% 0, calc(100% - 100px) 100%, 0% 100%)",
        }}
      >
        <span
          className={`absolute inset-x-0 bottom-0 h-[8px] ${
            emergency ? "bg-white" : "bg-sig-red"
          }`}
        />
      </div>

      <div className="relative z-[2] flex h-full items-center px-[52px]">
        <div className="flex shrink-0 items-center gap-6">
          <LogoSlot url={identity.logoPrimaryUrl} fallback="UAB" />
          <span aria-hidden className="h-[58px] w-px bg-white/30" />
          {identity.logoSecondaryUrl ? (
            <LogoSlot url={identity.logoSecondaryUrl} fallback="" round={false} />
          ) : (
            <p className="font-serif text-[23px] font-bold leading-[1.2] text-white/85">
              Posgrado
              <br />
              UABJB
            </p>
          )}
        </div>

        <div className="min-w-0 pl-[34px]">
          <p
            className="truncate font-medium text-white/65"
            style={{ fontSize: T.meta }}
          >
            {identity.universityName}
          </p>
          <p className="mt-1 font-serif text-[44px] font-bold leading-none text-white">
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
    <div className="flex h-[78px] shrink-0 items-center gap-7 overflow-hidden bg-sig-ink px-[52px]">
      <span
        className="shrink-0 bg-sig-red px-6 py-3 font-bold uppercase tracking-[.12em] text-white"
        style={{ fontSize: T.eyebrow }}
      >
        {identity.tickerLabel}
      </span>
      <p
        className="truncate font-serif font-medium italic text-white/90"
        style={{ fontSize: T.bodyLg }}
      >
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
      className={`flex h-[108px] shrink-0 items-center justify-between gap-8 px-[52px] ${
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
              <SocialIcon name={name} size={36} />
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
