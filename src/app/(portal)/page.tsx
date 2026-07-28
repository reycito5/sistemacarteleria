import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  LayoutGrid,
  LibraryBig,
  ListVideo,
  MonitorPlay,
  Radio,
  Siren,
  Sparkles,
  Timer,
} from "lucide-react";
import { INSTITUTION } from "@/lib/design/tokens";
import { ButtonLink } from "@/components/ui/Button";

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

export default function PortalHome() {
  return (
    <>
      {/* Portada */}
      <section className="ui-gradient-inst-mesh relative overflow-hidden text-inst-white">
        <div className="mx-auto max-w-[1180px] px-4 py-16 sm:px-6 sm:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-inst-gold/40 bg-white/10 px-3 py-1 text-[11px] font-bold tracking-[0.16em] text-inst-gold">
            <Sparkles size={13} aria-hidden />
            {INSTITUTION.systemName}
          </span>

          <h1 className="mt-6 max-w-3xl text-[38px] font-black leading-[1.05] sm:text-[56px]">
            La programación institucional del Posgrado,{" "}
            <span className="text-inst-gold">en todas las pantallas</span> a la
            vez.
          </h1>

          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/75 sm:text-base">
            Cuatro televisores del Vicerrectorado de Posgrado muestran la misma
            oferta académica, agenda y comunicados, con la línea gráfica
            institucional bloqueada y administrados desde un solo panel web.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/oferta" variant="gold" size="lg">
              Ver la oferta académica
              <ArrowRight size={17} aria-hidden />
            </ButtonLink>
            <ButtonLink
              href="/preview"
              size="lg"
              className="border border-white/25 bg-white/10 text-inst-white hover:bg-white/20"
            >
              Conocer las plantillas
            </ButtonLink>
          </div>

          {/* Pantallas del grupo */}
          <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SCREENS.map((s) => (
              <div
                key={s.code}
                className="rounded-[14px] border border-white/15 bg-white/10 px-4 py-3.5 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-extrabold uppercase">{s.name}</p>
                  <MonitorPlay size={16} className="text-inst-gold" aria-hidden />
                </div>
                <p className="ui-tnum mt-1 text-[11px] tracking-widest text-white/50">
                  {s.code}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo llega el contenido a la pantalla */}
      <section className="mx-auto max-w-[1180px] px-4 py-16 sm:px-6 sm:py-20">
        <div className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-inst-gold">
            Cómo funciona
          </p>
          <h2 className="mt-2 text-[30px] font-black leading-tight text-inst-blue-top sm:text-[38px]">
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
                className="ui-card group flex h-full flex-col p-6 transition hover:-translate-y-1 hover:border-inst-blue/30 hover:shadow-[var(--shadow-ui-lg)]"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-[12px] bg-inst-blue-bottom text-inst-white">
                    <Icon size={19} aria-hidden />
                  </span>
                  <span className="ui-tnum text-[34px] font-black leading-none text-ui-border-strong">
                    {step}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-extrabold text-inst-blue-top">
                  {title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ui-muted">
                  {text}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-bold text-inst-red transition group-hover:gap-2">
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
          <h2 className="max-w-2xl text-[30px] font-black leading-tight text-inst-blue-top sm:text-[38px]">
            Pensado para funcionar solo, todo el día
          </h2>

          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-4">
                <span className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-[12px] bg-info-soft text-inst-blue-top">
                  <Icon size={19} aria-hidden />
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-inst-blue-top">
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
            <h2 className="text-2xl font-black text-inst-blue-top sm:text-[28px]">
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
