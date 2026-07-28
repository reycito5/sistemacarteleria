import { CheckCircle2, GraduationCap, Link2, XCircle } from "lucide-react";
import {
  fetchPortalPrograms,
  type PortalResult,
} from "@/lib/integration/portalServer";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { Card, CardHeader } from "@/components/ui/Card";
import { ImportPortalList } from "./ImportPortalList";

export const dynamic = "force-dynamic";

async function load(): Promise<PortalResult> {
  return fetchPortalPrograms();
}

export default async function OfertaPage() {
  const { programs, source, configuredUrl, resolvedUrl, attempts } = await load();
  const connected = source === "portal";

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="1 · Contenido"
        title="Portal de oferta"
        description="Trae los programas publicados en el portal de oferta académica y los convierte en pantallas «Programa destacado», sin reescribir la información a mano."
        actions={
          <Badge tone={connected ? "ok" : "warn"} dot>
            {connected ? "Conectado al portal" : "Datos de muestra"}
          </Badge>
        }
      />

      {/* Estado de la conexión */}
      <Card>
        <CardHeader
          icon={<Link2 size={18} />}
          title="Conexión con el portal"
          description={
            connected
              ? "Los programas de esta página vienen del portal real."
              : "Todavía no se pudo leer el portal, así que abajo se muestra una oferta de ejemplo."
          }
        />

        <dl className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-wide text-ui-muted">
              Dirección configurada
            </dt>
            <dd className="mt-1 break-all text-sm font-semibold text-ui-ink">
              {configuredUrl ?? (
                <span className="text-ui-faint">Sin configurar</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-wide text-ui-muted">
              Origen de los datos
            </dt>
            <dd className="mt-1 break-all text-sm font-semibold text-ui-ink">
              {resolvedUrl ?? (
                <span className="text-ui-faint">Oferta de muestra interna</span>
              )}
            </dd>
          </div>
        </dl>

        {!configuredUrl && (
          <Alert tone="warn" className="mt-5" title="Falta configurar el portal">
            Defina la variable de entorno <code>OFERTA_PORTAL_URL</code> con la
            dirección del portal (por ejemplo{" "}
            <code>https://ofertaposgrado.vercel.app</code>) y vuelva a desplegar.
            No hace falta indicar la ruta exacta: el sistema prueba por sí mismo
            las rutas <code>/api/programas</code>, <code>/api/programs</code>,{" "}
            <code>/api/oferta</code> y, si ninguna responde, lee los datos
            incrustados en la página.
          </Alert>
        )}

        {configuredUrl && !connected && (
          <Alert
            tone="danger"
            className="mt-5"
            title="No se pudo leer la oferta del portal"
          >
            Se probaron todas las rutas conocidas sin éxito. Lo más fiable es
            publicar en el portal una ruta JSON —por ejemplo{" "}
            <code>/api/programas</code>— que devuelva una lista de programas con
            los campos <code>nombre</code>, <code>modalidad</code>,{" "}
            <code>inicio</code>, <code>duracion</code>, <code>creditos</code> y{" "}
            <code>horas</code>.
          </Alert>
        )}

        {attempts.length > 0 && (
          <details className="mt-5 rounded-[12px] border border-ui-border bg-ui-raised p-4">
            <summary className="cursor-pointer text-sm font-bold text-inst-blue-top">
              Detalle de los intentos ({attempts.length})
            </summary>
            <ul className="mt-3 space-y-2">
              {attempts.map((a, i) => (
                <li key={`${a.url}-${i}`} className="flex items-start gap-2.5 text-xs">
                  {a.ok ? (
                    <CheckCircle2
                      size={15}
                      className="mt-0.5 shrink-0 text-ok"
                      aria-hidden
                    />
                  ) : (
                    <XCircle
                      size={15}
                      className="mt-0.5 shrink-0 text-ui-faint"
                      aria-hidden
                    />
                  )}
                  <span className="min-w-0">
                    <span className="block break-all font-mono text-ui-ink">
                      {a.url}
                    </span>
                    <span className="text-ui-muted">{a.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          </details>
        )}
      </Card>

      {/* Programas */}
      <Card flush>
        <div className="border-b border-ui-border p-5 sm:p-6">
          <CardHeader
            icon={<GraduationCap size={18} />}
            title={`Programas disponibles (${programs.length})`}
            description="Al importar se crea —o se actualiza— una pantalla «Programa destacado» en borrador. Después hay que aprobarla y añadirla a la playlist para que salga al aire."
          />
        </div>
        <div className="p-5 sm:p-6">
          <ImportPortalList programs={programs} />
        </div>
      </Card>
    </div>
  );
}
