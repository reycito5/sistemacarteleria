import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  HelpCircle,
  MonitorPlay,
  Siren,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { WorkflowSteps } from "@/components/admin/WorkflowSteps";
import { ADMIN_SECTIONS } from "@/lib/admin/navigation";
import { AdminIcon } from "@/components/admin/AdminIcon";

export const metadata = {
  title: "Cómo funciona — Panel UABJB Posgrado Digital",
};

/** Estados por los que pasa un contenido antes de poder emitirse. */
const STATUSES = [
  {
    label: "Borrador",
    tone: "neutral" as const,
    text: "Se está escribiendo. No sale en pantalla ni puede añadirse a la playlist.",
  },
  {
    label: "En revisión",
    tone: "warn" as const,
    text: "Terminado y enviado a quien aprueba. Todavía no sale en pantalla.",
  },
  {
    label: "Aprobado",
    tone: "ok" as const,
    text: "Listo. Ahora sí puede añadirse a la playlist y salir al aire.",
  },
  {
    label: "Archivado",
    tone: "neutral" as const,
    text: "Retirado de circulación. Se conserva, pero ya no se emite.",
  },
];

const FAQ = [
  {
    q: "Subí un video pero no aparece en ninguna pantalla. ¿Por qué?",
    a: "La biblioteca es sólo el almacén. Un archivo se ve en el televisor cuando se usa dentro de una plantilla, esa plantilla se aprueba y se añade a la playlist publicada. Revise en qué paso quedó.",
  },
  {
    q: "¿Cuánto tarda en verse un cambio en los televisores?",
    a: "Menos de un minuto. Cada equipo pide la programación cada 60 segundos; si hay una versión nueva, la descarga y la aplica sin reiniciar.",
  },
  {
    q: "¿Puedo poner contenido distinto en cada pantalla?",
    a: "No. Las cuatro pertenecen al mismo grupo y por diseño institucional emiten exactamente lo mismo, sincronizado.",
  },
  {
    q: "¿Qué pasa si se corta internet?",
    a: "Nada se apaga. Cada equipo guarda la programación y los archivos en local, sigue emitiendo y muestra un aviso discreto de reconexión mientras reintenta.",
  },
  {
    q: "¿Por qué mi imagen se ve recortada o con franjas?",
    a: "El lienzo institucional es 1920×1080 (16:9). Si el archivo tiene otra proporción, el sistema lo avisa al subirlo y lo marca como pendiente de revisión.",
  },
  {
    q: "¿Cómo interrumpo todo por una emergencia?",
    a: "Desde «Comunicados urgentes». Un comunicado activo tiene prioridad absoluta: tapa la programación en las cuatro pantallas hasta que se desactiva.",
  },
];

export default function AyudaPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Inicio"
        title="Cómo funciona el sistema"
        description="Qué hace cada módulo, en qué orden se usan y cómo llega un archivo desde su computadora hasta los televisores del Vicerrectorado."
      />

      {/* El flujo */}
      <Card>
        <CardHeader
          icon={<ArrowRight size={18} />}
          title="El recorrido, de principio a fin"
          description="Los pasos son consecutivos: saltarse uno es la causa más común de que algo no aparezca en pantalla."
        />
        <WorkflowSteps className="mt-5" />

        <Alert tone="info" className="mt-5" title="La regla de oro">
          Un contenido llega al televisor sólo si está <strong>aprobado</strong>{" "}
          y forma parte de la <strong>playlist publicada</strong>. Cualquier otra
          combinación se queda en el panel.
        </Alert>
      </Card>

      {/* Estados */}
      <Card>
        <CardHeader
          icon={<CheckCircle2 size={18} />}
          title="Los estados de un contenido"
          description="Todo lo que se crea en «Plantillas» pasa por estos cuatro estados."
        />
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {STATUSES.map((s) => (
            <li
              key={s.label}
              className="rounded-[12px] border border-ui-border bg-ui-raised p-4"
            >
              <Badge tone={s.tone}>{s.label}</Badge>
              <p className="mt-2 text-sm leading-relaxed text-ui-muted">{s.text}</p>
            </li>
          ))}
        </ul>
      </Card>

      {/* Qué hace cada módulo */}
      <Card>
        <CardHeader
          icon={<HelpCircle size={18} />}
          title="Qué hace cada pantalla del panel"
          description="El menú lateral sigue este mismo orden."
        />

        <div className="mt-5 space-y-6">
          {ADMIN_SECTIONS.map((section) => (
            <div key={section.title}>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-red">
                {section.title}
              </p>
              <ul className="mt-2.5 divide-y divide-ui-border rounded-[12px] border border-ui-border">
                {section.modules.map((m) => (
                  <li key={m.href}>
                    <Link
                      href={m.href}
                      className="group flex items-start gap-3.5 p-4 transition hover:bg-ui-raised"
                    >
                      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-info-soft text-brand-ink">
                        <AdminIcon name={m.icon} size={17} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="text-sm font-extrabold text-brand-ink">
                            {m.label}
                          </span>
                          {m.step && <Badge tone="info">Paso {m.step}</Badge>}
                        </span>
                        <span className="mt-0.5 block text-sm leading-relaxed text-ui-muted">
                          {m.summary}
                        </span>
                      </span>
                      <ArrowRight
                        size={16}
                        aria-hidden
                        className="mt-1 shrink-0 text-ui-faint transition group-hover:translate-x-0.5 group-hover:text-brand-red"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      {/* Excepciones al flujo */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader
            icon={<Siren size={18} />}
            title="Comunicados urgentes"
            description="La única excepción al flujo normal."
          />
          <p className="mt-4 text-sm leading-relaxed text-ui-muted">
            No pasan por la playlist. Al activar uno, tapa de inmediato la
            programación de las cuatro pantallas y se mantiene hasta que se
            desactiva a mano. Úselo sólo cuando corresponda: mientras esté
            activo, nada más se ve.
          </p>
        </Card>

        <Card>
          <CardHeader
            icon={<CalendarClock size={18} />}
            title="Calendario"
            description="Para programar por días y franjas horarias."
          />
          <p className="mt-4 text-sm leading-relaxed text-ui-muted">
            Permite que una playlist se emita sólo ciertos días u horas. Si dos
            programaciones coinciden en el mismo momento, gana la de mayor
            prioridad. Sin programaciones activas se emite la playlist publicada.
          </p>
        </Card>
      </div>

      {/* Preguntas frecuentes */}
      <Card>
        <CardHeader
          icon={<AlertTriangle size={18} />}
          title="Dudas frecuentes"
          description="Las consultas que más se repiten al operar el sistema."
        />
        <div className="mt-5 space-y-2">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group rounded-[12px] border border-ui-border bg-ui-raised px-4 py-3 transition open:bg-ui-surface"
            >
              <summary className="cursor-pointer list-none text-sm font-bold text-brand-ink marker:hidden">
                <span className="flex items-center justify-between gap-3">
                  {item.q}
                  <ArrowRight
                    size={15}
                    aria-hidden
                    className="shrink-0 text-ui-faint transition group-open:rotate-90"
                  />
                </span>
              </summary>
              <p className="mt-2.5 text-sm leading-relaxed text-ui-muted">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </Card>

      <Card className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-extrabold text-brand-ink">
            ¿Quiere ver cómo queda antes de publicar?
          </h2>
          <p className="mt-1 text-sm text-ui-muted">
            La galería de plantillas muestra las vistas institucionales tal cual
            se verán en el televisor.
          </p>
        </div>
        <Link
          href="/preview"
          target="_blank"
          className="inline-flex items-center gap-2 text-[13px] font-bold text-brand-red transition hover:gap-3"
        >
          <MonitorPlay size={15} aria-hidden />
          Abrir la galería
        </Link>
      </Card>
    </div>
  );
}
