import {
  Building2,
  CheckCircle2,
  MonitorPlay,
  Radio,
  Timer,
  Wifi,
} from "lucide-react";
import { INSTITUTION } from "@/lib/design/tokens";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export const metadata = {
  title: "Las pantallas — UABJB Posgrado Digital",
  description:
    "Las cuatro pantallas del Vicerrectorado de Posgrado y cómo funciona su programación sincronizada.",
};

const SCREENS = [
  {
    code: "REC-01",
    name: "Recepción",
    place: "Ingreso principal del Vicerrectorado",
    audience: "Postulantes e informaciones",
  },
  {
    code: "PAS-02",
    name: "Pasillo",
    place: "Corredor de aulas",
    audience: "Estudiantes en tránsito",
  },
  {
    code: "AUD-03",
    name: "Auditorio",
    place: "Sala de defensas y conferencias",
    audience: "Asistentes a actos académicos",
  },
  {
    code: "ADM-04",
    name: "Administración",
    place: "Oficinas administrativas",
    audience: "Personal del Vicerrectorado",
  },
];

const FACTS = [
  {
    icon: Timer,
    title: "Una sola hora oficial",
    text: "Todas calculan su posición desde el mismo instante de inicio, no desde cuando se encendieron. Por eso muestran lo mismo al mismo tiempo.",
  },
  {
    icon: Radio,
    title: "Autonomía sin red",
    text: "Cada equipo guarda la programación y los archivos. Si se cae internet sigue emitiendo y avisa en pantalla que está reconectando.",
  },
  {
    icon: Wifi,
    title: "Latido cada 20 segundos",
    text: "Los televisores informan de su estado al panel. Si uno deja de responder, aparece como desconectado en el centro de pantallas.",
  },
  {
    icon: CheckCircle2,
    title: "Activación por código",
    text: "Un televisor nuevo pide un código temporal que se confirma desde el panel. Sin esa confirmación no recibe programación.",
  },
];

export default function PantallasPublicPage() {
  return (
    <>
      <section className="ui-gradient-inst-mesh text-inst-white">
        <div className="mx-auto max-w-[1180px] px-4 py-14 sm:px-6 sm:py-20">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-inst-gold">
            Grupo {INSTITUTION.generalGroup}
          </p>
          <h1 className="mt-3 max-w-3xl text-[34px] font-black leading-[1.08] sm:text-[46px]">
            Cuatro pantallas, una sola programación
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/75">
            Las cuatro pantallas del {INSTITUTION.vicerrectorate.toLowerCase()}{" "}
            pertenecen a un único grupo y emiten exactamente el mismo contenido,
            en el mismo orden y al mismo tiempo.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 py-12 sm:px-6 sm:py-16">
        <h2 className="text-2xl font-black text-inst-blue-top">
          Ubicación de cada pantalla
        </h2>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SCREENS.map((s) => (
            <li key={s.code} className="ui-card p-5">
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-[10px] bg-info-soft text-inst-blue-top">
                  <MonitorPlay size={18} aria-hidden />
                </span>
                <Badge tone="neutral" className="ui-tnum">
                  {s.code}
                </Badge>
              </div>
              <h3 className="mt-4 text-lg font-extrabold text-inst-blue-top">
                {s.name}
              </h3>
              <p className="mt-1.5 flex items-start gap-1.5 text-xs leading-relaxed text-ui-muted">
                <Building2 size={13} className="mt-0.5 shrink-0" aria-hidden />
                {s.place}
              </p>
              <p className="mt-3 border-t border-ui-border pt-3 text-xs text-ui-muted">
                {s.audience}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-ui-border bg-ui-surface">
        <div className="mx-auto max-w-[1180px] px-4 py-12 sm:px-6 sm:py-16">
          <h2 className="text-2xl font-black text-inst-blue-top">
            Cómo se mantienen sincronizadas
          </h2>

          <div className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {FACTS.map(({ icon: Icon, title, text }) => (
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

      <section className="mx-auto max-w-[1180px] px-4 py-12 sm:px-6 sm:py-16">
        <div className="ui-card flex flex-wrap items-center justify-between gap-6 p-8">
          <div className="max-w-xl">
            <h2 className="text-xl font-black text-inst-blue-top sm:text-2xl">
              ¿Está instalando un televisor nuevo?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ui-muted">
              Abra la pantalla de activación en el equipo, anote el código que
              muestra y confírmelo desde el centro de pantallas del panel.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/player/activar" variant="secondary">
              Activar una pantalla
            </ButtonLink>
            <ButtonLink href="/player" target="_blank">
              Ver el reproductor
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
