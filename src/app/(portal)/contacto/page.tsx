import {
  Building2,
  Clock,
  ExternalLink,
  Headset,
  Mail,
  MessageCircle,
  MonitorPlay,
  Phone,
} from "lucide-react";
import { INSTITUTION, INSTITUTIONAL_CONTACTS } from "@/lib/design/tokens";
import { Card, CardHeader } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";

export const metadata = {
  title: "Contacto — UABJB Posgrado Digital",
  description:
    "Datos de contacto del Vicerrectorado de Posgrado de la Universidad Autónoma del Beni «José Ballivián».",
};

const [whatsapp, phone] = INSTITUTIONAL_CONTACTS.phones;

const CHANNELS = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: whatsapp,
    href: `https://wa.me/591${whatsapp}`,
    note: "Consultas sobre inscripciones y programas",
  },
  {
    icon: Phone,
    label: "Teléfono",
    value: phone,
    href: `tel:+591${phone}`,
    note: "Atención directa en horario de oficina",
  },
];

const FAQ = [
  {
    q: "¿Cómo me inscribo en un programa?",
    a: "Consulte la oferta académica, elija el programa y use el enlace de inscripción. Si tiene dudas, escríbanos por WhatsApp.",
  },
  {
    q: "¿Los programas son presenciales o virtuales?",
    a: "Depende del programa: cada ficha indica su modalidad (virtual, presencial o semipresencial).",
  },
  {
    q: "Vi un aviso en una pantalla y quiero más información",
    a: "Anote el título del aviso y comuníquese por cualquiera de los canales de arriba. También puede escanear el código QR que aparece en la pantalla.",
  },
];

export default function ContactoPage() {
  return (
    <>
      <section className="ui-gradient-inst-mesh text-inst-white">
        <div className="mx-auto max-w-[1180px] px-4 py-14 sm:px-6 sm:py-20">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-inst-gold">
            {INSTITUTION.vicerrectorate}
          </p>
          <h1 className="mt-3 max-w-3xl font-serif text-[36px] font-semibold leading-[1.1] sm:text-[50px]">
            Contacto
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/75">
            Estamos para orientarle sobre la oferta académica, las inscripciones
            y las actividades del Vicerrectorado de Posgrado.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          {/* Canales */}
          <div className="space-y-6">
            <Card>
              <CardHeader
                icon={<Headset size={18} />}
                title="Canales de atención"
                description="La vía más rápida es WhatsApp."
              />
              <ul className="mt-5 space-y-3">
                {CHANNELS.map(({ icon: Icon, label, value, href, note }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center gap-4 rounded-[12px] border border-ui-border bg-ui-raised p-4 transition hover:border-inst-blue/35 hover:bg-ui-surface"
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[12px] bg-inst-blue-bottom text-inst-white">
                        <Icon size={19} aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-ui-muted">
                          {label}
                        </span>
                        <span className="ui-tnum block text-lg font-black text-inst-blue-top">
                          {value}
                        </span>
                        <span className="block text-xs text-ui-muted">{note}</span>
                      </span>
                      <ExternalLink
                        size={16}
                        aria-hidden
                        className="shrink-0 text-ui-faint transition group-hover:text-inst-red"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <CardHeader
                icon={<Building2 size={18} />}
                title="Dónde encontrarnos"
                description="Vicerrectorado de Posgrado — UABJB."
              />
              <dl className="mt-5 space-y-4 text-sm">
                <div className="flex gap-3">
                  <Building2
                    size={16}
                    className="mt-0.5 shrink-0 text-inst-gold"
                    aria-hidden
                  />
                  <div>
                    <dt className="font-bold text-inst-blue-top">Institución</dt>
                    <dd className="mt-0.5 leading-relaxed text-ui-muted">
                      {INSTITUTION.university}
                      <br />
                      {INSTITUTION.vicerrectorate}
                    </dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Clock
                    size={16}
                    className="mt-0.5 shrink-0 text-inst-gold"
                    aria-hidden
                  />
                  <div>
                    <dt className="font-bold text-inst-blue-top">
                      Horario de atención
                    </dt>
                    <dd className="mt-0.5 text-ui-muted">
                      Lunes a viernes, de 08:00 a 16:00
                    </dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Mail
                    size={16}
                    className="mt-0.5 shrink-0 text-inst-gold"
                    aria-hidden
                  />
                  <div>
                    <dt className="font-bold text-inst-blue-top">
                      Atención presencial
                    </dt>
                    <dd className="mt-0.5 text-ui-muted">
                      Recepción del Vicerrectorado de Posgrado
                    </dd>
                  </div>
                </div>
              </dl>
            </Card>
          </div>

          {/* Preguntas + soporte del sistema */}
          <div className="space-y-6">
            <Card>
              <CardHeader
                title="Preguntas frecuentes"
                description="Lo que más nos consultan."
              />
              <div className="mt-5 space-y-4">
                {FAQ.map((item) => (
                  <div
                    key={item.q}
                    className="border-b border-ui-border pb-4 last:border-0 last:pb-0"
                  >
                    <p className="text-sm font-bold text-inst-blue-top">
                      {item.q}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ui-muted">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardHeader
                icon={<MonitorPlay size={18} />}
                title="Soporte del sistema de pantallas"
                description="Si una pantalla no muestra contenido o quedó congelada."
              />
              <p className="mt-4 text-sm leading-relaxed text-ui-muted">
                Comuníquese con el soporte técnico del Vicerrectorado por
                cualquiera de los números de arriba, indicando el código de la
                pantalla (por ejemplo <strong>REC-01</strong>), visible en la
                esquina de la vista de activación.
              </p>
              <ButtonLink href="/pantallas" variant="secondary" className="mt-5">
                Ver las pantallas
              </ButtonLink>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
