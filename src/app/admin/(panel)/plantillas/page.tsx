import Link from "next/link";
import { Pencil, Plus, SquareStack } from "lucide-react";
import { listContentItems, type ContentItemSummary } from "@/lib/data/admin";
import { EDITABLE_KINDS } from "@/lib/views/formSchema";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";
import { DeleteContentButton } from "./DeleteContentButton";
import { ContentStatusControls } from "./ContentStatusControls";

export const dynamic = "force-dynamic";

async function loadContents(): Promise<ContentItemSummary[] | null> {
  try {
    return await listContentItems();
  } catch {
    return null;
  }
}

export default async function PlantillasPage() {
  const contents = await loadContents();
  const approved = contents?.filter((c) => c.status === "aprobado").length ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Paso 2 · Contenido"
        title="Plantillas y contenidos"
        description="Aquí se arma cada pantalla: se elige una plantilla institucional y se completan sus textos, fechas y medios. La línea gráfica (colores, cabecera y pie) está bloqueada y no se edita."
        actions={<Badge tone="info">Paso 2 de 4</Badge>}
      />

      {/* Crear */}
      <Card>
        <CardHeader
          icon={<Plus size={18} />}
          title="Crear una pantalla nueva"
          description="Elija la plantilla que mejor represente lo que quiere comunicar. Puede ver cómo queda cada una en la galería de plantillas."
          actions={
            <ButtonLink
              href="/preview"
              target="_blank"
              variant="secondary"
              size="sm"
            >
              Ver la galería
            </ButtonLink>
          }
        />
        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {EDITABLE_KINDS.map((k) => (
            <Link
              key={k.kind}
              href={`/admin/plantillas/nuevo?kind=${k.kind}`}
              className="group flex items-center gap-2.5 rounded-[10px] border border-ui-border bg-ui-raised px-3.5 py-3 text-sm font-semibold text-brand-ink transition hover:border-brand-ink-soft/40 hover:bg-ui-surface hover:shadow-[var(--shadow-ui-sm)]"
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-info-soft text-brand-ink transition group-hover:bg-brand-ink-deep group-hover:text-brand-white">
                <Plus size={14} aria-hidden />
              </span>
              <span className="min-w-0 truncate">{k.label}</span>
            </Link>
          ))}
        </div>
      </Card>

      {/* Existentes */}
      <Card flush>
        <div className="border-b border-ui-border p-5 sm:p-6">
          <CardHeader
            icon={<SquareStack size={18} />}
            title={`Contenidos creados (${contents?.length ?? 0})`}
            description={
              approved > 0
                ? `${approved} aprobado(s) y listo(s) para añadirse a la playlist.`
                : "Sólo los contenidos aprobados pueden añadirse a la playlist y salir al aire."
            }
          />
        </div>

        <div className="p-5 sm:p-6">
          {contents === null ? (
            <Alert tone="warn" title="Supabase no está configurado">
              Configure el entorno e inicie sesión para gestionar contenidos.
            </Alert>
          ) : contents.length === 0 ? (
            <EmptyState
              icon={<SquareStack size={26} />}
              title="Todavía no hay contenidos"
              description="Cree el primero eligiendo una plantilla arriba. Después apruébelo y añádalo a la playlist para que se emita."
            />
          ) : (
            <ul className="divide-y divide-ui-border rounded-[12px] border border-ui-border">
              {contents.map((c) => (
                <li
                  key={c.id}
                  className="flex flex-wrap items-start gap-4 p-4 transition hover:bg-ui-raised"
                >
                  <div className="min-w-[220px] flex-1">
                    <p className="text-sm font-extrabold text-brand-ink">
                      {c.title}
                    </p>
                    <p className="mt-0.5 text-xs text-ui-muted">
                      Plantilla: {c.templateName}
                    </p>
                    <div className="mt-2.5">
                      <ContentStatusControls id={c.id} status={c.status} />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/admin/plantillas/${c.id}`}
                      className="inline-flex items-center gap-1.5 rounded-[8px] border border-ui-border-strong px-2.5 py-1 text-xs font-bold text-brand-ink transition hover:border-brand-ink-soft/45 hover:bg-info-soft"
                    >
                      <Pencil size={13} aria-hidden />
                      Editar
                    </Link>
                    <DeleteContentButton id={c.id} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </div>
  );
}
