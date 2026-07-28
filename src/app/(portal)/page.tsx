import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  LayoutGrid,
  LibraryBig,
  ListVideo,
  MonitorPlay,
  QrCode,
  Radio,
  Siren,
  Timer,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

/** Portal externo de oferta académica del Posgrado (fuente canónica). */
const OFERTA_PORTAL_URL = "https://ofertaposgrado.vercel.app";

export const metadata = {
  title: "UABJB Posgrado Digital — Cartelería institucional",
  description:
    "Sistema de cartelería digital del Vicerrectorado de Posgrado de la Universidad Autónoma del Beni «José Ballivián».",
};

const SCREENS = [
  { code: "REC-01", name: "Recepción" },
  { code: "PAS-02", name: "Pasillo" },
  { code: "AUD-03", name: "Auditorio" },
  { code: "ADM-04", name: "Administración" },
];

const FLOW = [
  {
    step: "1",
    icon: LibraryBig,
    title: "Biblioteca",
    text: "Se suben los videos e imágenes en 1920×1080. Es el almacén del sistema.",
    href: "/admin/biblioteca",
  },
  {
    step: "2",
    icon: LayoutGrid,
    title: "Plantillas",
    text: "Se elige una de las plantillas institucionales y se escriben sus textos.",
    href: "/preview",
  },
  {
    step: "3",
    icon: ListVideo,
    title: "Playlist",
    text: "Se ordenan las pantallas aprobadas, se fija su duración y se publica.",
    href: "/admin/playlist",
  },
  {
    step: "4",
    icon: MonitorPlay,
    title: "Televisores",
    text: "Los cuatro equipos descargan la programación y la emiten sincronizada.",
    href: "/pantallas",
  },
];

const FEATURES = [
  {
    icon: Timer,
    title: "Sincronizado al segundo",
    text: "La posición se calcula desde una única hora oficial de inicio, no desde el encendido de cada equipo. Diferencia entre pantallas: 1 a 3 segundos.",
  },
  {
    icon: Radio,
    title: "Sigue funcionando sin internet",
    text: "Cada equipo guarda la programación y los archivos en local. Si se corta la conexión, continúa emitiendo y reintenta en segundo plano.",
  },
  {
    icon: Siren,
    title: "Comunicados urgentes",
    text: "Un aviso de emergencia interrumpe la programación de las cuatro pantallas al instante y vuelve sólo cuando se desactiva.",
  },
  {
    icon: CalendarClock,
    title: "Programación por calendario",
    text: "Cada playlist puede tener sus días y su franja horaria, con prioridades cuando dos programaciones coinciden.",
  },
];

/**
 * Reproducción a pequeña escala de una plantilla real de señalización, para
 * mostrar en el hero qué produce el sistema (no es un placeholder genérico).
 */
function HeroScreenMock() {
  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* Cabecera */}
      <div className="relative flex items-center gap-2 bg-brand-ink-deep px-3.5 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="grid h-6 w-6 place-items-center rounded-full border border-white/40 text-[8px] font-black text-white">
            UAB
          </span>
          <span className="h-5 w-px bg-white/25" />
        </div>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-[6px] font-medium uppercase tracking-wide text-white/55">
            Universidad Autónoma del Beni
          </p>
          <p className="font-serif text-[12px] font-bold text-white">
            Vicerrectorado de Posgrado
          </p>
        </div>
        <p className="ui-tnum ml-auto font-mono text-[15px] font-bold leading-none text-white">
          16:09
        </p>
        <span className="absolute inset-x-0 bottom-0 h-[3px] bg-brand-red" />
      </div>

      {/* Cuerpo: retrato + ficha */}
      <div className="flex min-h-0 flex-1">
        <div className="flex w-[42%] flex-col justify-end bg-brand-ink p-3">
          <span className="mb-1.5 inline-flex w-fit bg-brand-red px-1.5 py-0.5 text-[6px] font-black uppercase tracking-wider text-white">
            Programa destacado
          </span>
          <p className="font-serif text-[15px] font-bold leading-[1.05] text-white">
            Maestría en Educación Superior
          </p>
          <p className="mt-1 text-[7px] font-medium text-white/55">
            UABJB · Posgrado
          </p>
        </div>

        <div className="flex w-[58%] flex-col p-3">
          <div className="flex items-center justify-between">
            <p className="text-[6px] font-black uppercase tracking-[0.14em] text-brand-red">
              Ficha del programa
            </p>
            <span className="rounded-sm bg-ok-soft px-1.5 py-0.5 text-[6px] font-black uppercase tracking-wide text-ok">
              Inscripción abierta
            </span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1.5">
            {[
              ["Modalidad", "Virtual"],
              ["Duración", "18 meses"],
              ["Créditos", "80"],
              ["Inicio", "31/07/2026"],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="text-[6px] font-bold uppercase tracking-wide text-ui-faint">
                  {k}
                </p>
                <p className="font-serif text-[10px] font-bold text-brand-ink">
                  {v}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-auto flex items-center gap-2 border-t border-ui-border pt-2">
            <span className="grid h-7 w-7 place-items-center rounded-sm bg-brand-ink text-white">
              <QrCode size={16} aria-hidden />
            </span>
            <p className="text-[7px] font-bold uppercase leading-tight tracking-wide text-brand-ink">
              Escanea el código
              <br />
              <span className="text-brand-red">Inscríbete aquí</span>
            </p>
          </div>
        </div>
      </div>

      {/* Pie */}
      <div className="flex items-center gap-2 bg-brand-ink-deep px-3.5 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
        <p className="text-[7px] font-bold text-white/80">61948267 · 72814772</p>
        <p className="ml-auto text-[7px] font-medium text-white/45">
          escuelaposgrado@uabjb.edu.bo
        </p>
      </div>
    </div>
  );
}

export default function PortalHome() {
  return (
    <>
      {/* Portada */}
      <section className="ui-gradient-inst-mesh relative overflow-hidden text-brand-white">
        {/* Rejilla técnica sutil de fondo (aire de sala de control). */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        <div className="relative mx-auto grid max-w-[1180px] items-center gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          {/* Columna de texto */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm">
              <span className="ui-pulse h-2 w-2 rounded-full bg-brand-red" />
              Señalización digital · Vicerrectorado de Posgrado
            </span>

            <h1 className="mt-6 text-[40px] font-black leading-[1.02] tracking-[-0.01em] sm:text-[58px]">
              Una sola programación,
              <br />
              <span className="text-brand-red">en las cuatro pantallas</span>
              <br />
              del Posgrado.
            </h1>

            <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-white/70">
              La cartelería digital del Vicerrectorado: agenda, programas y
              comunicados en los televisores de Recepción, Pasillo, Auditorio y
              Administración, sincronizados al segundo y gestionados desde un
              único panel.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink href="/admin/login" size="lg">
                Acceder al panel
                <ArrowRight size={17} aria-hidden />
              </ButtonLink>
              <ButtonLink
                href="/preview"
                size="lg"
                className="border border-white/25 bg-white/10 text-brand-white hover:bg-white/20"
              >
                Ver las plantillas
              </ButtonLink>
            </div>

            <a
              href={OFERTA_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-white/60 underline-offset-4 transition hover:text-white hover:underline"
            >
              ¿Buscas la oferta académica? Visita el portal de Posgrado
              <ArrowUpRight size={15} aria-hidden />
            </a>
          </div>

          {/* Maqueta de televisor con una plantilla real de señalización */}
          <div className="relative mx-auto w-full max-w-[540px]">
            <div className="absolute -right-4 -top-4 z-20 inline-flex items-center gap-2 rounded-full bg-brand-red px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-white shadow-lg">
              <span className="ui-pulse h-2 w-2 rounded-full bg-white" />
              En vivo
            </div>

            {/* Bisel del monitor */}
            <div className="rounded-[18px] border border-white/10 bg-[#05060f] p-3 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)] ring-1 ring-white/5">
              <div className="overflow-hidden rounded-[8px] bg-brand-ink-deep [aspect-ratio:16/9]">
                <HeroScreenMock />
              </div>
            </div>
            {/* Pie / soporte del monitor */}
            <div aria-hidden className="mx-auto mt-0 h-5 w-24 rounded-b-[10px] bg-[#05060f]" />
            <div aria-hidden className="mx-auto h-1.5 w-40 rounded-full bg-black/40" />

            {/* Pastillas de las cuatro pantallas */}
            <div className="mt-7 grid grid-cols-4 gap-2">
              {SCREENS.map((s) => (
                <div
                  key={s.code}
                  className="rounded-[10px] border border-white/12 bg-white/5 px-2.5 py-2 text-center backdrop-blur-sm"
                >
                  <p className="truncate text-[11px] font-bold uppercase tracking-wide text-white/80">
                    {s.name}
                  </p>
                  <p className="ui-tnum text-[9px] tracking-widest text-white/40">
                    {s.code}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cómo llega el contenido a la pantalla */}
      <section className="mx-auto max-w-[1180px] px-4 py-16 sm:px-6 sm:py-20">
        <div className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-red">
            Cómo funciona
          </p>
          <h2 className="mt-2 text-[30px] font-black leading-tight text-brand-ink sm:text-[38px]">
            Del archivo al televisor, en cuatro pasos
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ui-muted">
            Cada paso depende del anterior. Un archivo subido a la biblioteca no
            aparece en pantalla hasta que se usa en una plantilla, se aprueba y
            se publica en la playlist.
          </p>
        </div>

        <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {FLOW.map(({ step, icon: Icon, title, text, href }, i) => (
            <li key={title} className="relative">
              <Link
                href={href}
                className="ui-card group flex h-full flex-col p-6 transition hover:-translate-y-1 hover:border-brand-ink-soft/30 hover:shadow-[var(--shadow-ui-lg)]"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-[12px] bg-brand-ink-deep text-brand-white">
                    <Icon size={19} aria-hidden />
                  </span>
                  <span className="ui-tnum text-[34px] font-black leading-none text-ui-border-strong">
                    {step}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-extrabold text-brand-ink">
                  {title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ui-muted">
                  {text}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-bold text-brand-red transition group-hover:gap-2">
                  Abrir <ArrowRight size={14} aria-hidden />
                </span>
              </Link>

              {i < FLOW.length - 1 && (
                <span
                  aria-hidden
                  className="absolute -right-2 top-1/2 hidden h-px w-4 bg-ui-border-strong lg:block"
                />
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* Capacidades */}
      <section className="border-y border-ui-border bg-ui-surface">
        <div className="mx-auto max-w-[1180px] px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="max-w-2xl text-[30px] font-black leading-tight text-brand-ink sm:text-[38px]">
            Pensado para funcionar solo, todo el día
          </h2>

          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-4">
                <span className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-[12px] bg-info-soft text-brand-ink">
                  <Icon size={19} aria-hidden />
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-brand-ink">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ui-muted">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Llamada final */}
      <section className="mx-auto max-w-[1180px] px-4 py-16 sm:px-6 sm:py-20">
        <div className="ui-card flex flex-wrap items-center justify-between gap-6 p-8 sm:p-10">
          <div className="max-w-xl">
            <h2 className="text-2xl font-black text-brand-ink sm:text-[28px]">
              ¿Administra la cartelería del Posgrado?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ui-muted">
              Ingrese al panel para subir contenido, armar la programación y
              vigilar el estado de las cuatro pantallas en tiempo real.
            </p>
          </div>
          <ButtonLink href="/admin/login" size="lg">
            Acceder al panel
            <ArrowRight size={17} aria-hidden />
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
