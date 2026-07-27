import Link from "next/link";
import { listContentItems, type ContentItemSummary } from "@/lib/data/admin";
import { EDITABLE_KINDS } from "@/lib/views/formSchema";
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

  return (
    <div>
      <h1 className="text-2xl font-black text-inst-blue-top">Plantillas y contenidos</h1>
      <p className="mt-1 max-w-2xl text-sm text-panel-muted">
        Cree contenidos sobre las plantillas institucionales. Solo se editan textos,
        fechas, medios y QR; la línea gráfica V11.6 permanece bloqueada.
      </p>

      <section className="mt-6">
        <h2 className="text-sm font-bold text-panel-ink">Nuevo contenido</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {EDITABLE_KINDS.map((k) => (
            <Link
              key={k.kind}
              href={`/admin/plantillas/nuevo?kind=${k.kind}`}
              className="rounded border px-3 py-2 text-sm font-semibold text-inst-blue-top hover:bg-white"
              style={{ borderColor: "var(--color-panel-border)" }}
            >
              + {k.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-bold text-panel-ink">Contenidos existentes</h2>
        {contents === null ? (
          <div
            className="mt-3 rounded-md border-l-4 bg-white px-4 py-3 text-sm"
            style={{ borderColor: "var(--color-inst-gold)" }}
          >
            <strong>Supabase no configurado.</strong> Configure el entorno e inicie
            sesión para gestionar contenidos.
          </div>
        ) : contents.length === 0 ? (
          <p className="mt-3 text-sm text-panel-muted">
            Aún no hay contenidos. Cree el primero con los botones de arriba.
          </p>
        ) : (
          <ul className="mt-3 divide-y rounded-md border bg-white" style={{ borderColor: "var(--color-panel-border)" }}>
            {contents.map((c) => (
              <li key={c.id} className="flex items-center gap-4 px-4 py-3">
                <div className="flex-1">
                  <p className="text-sm font-bold text-inst-blue-top">{c.title}</p>
                  <p className="text-xs text-panel-muted">{c.templateName}</p>
                  <div className="mt-2">
                    <ContentStatusControls id={c.id} status={c.status} />
                  </div>
                </div>
                <Link
                  href={`/admin/plantillas/${c.id}`}
                  className="text-xs font-bold text-inst-blue-top"
                >
                  Editar
                </Link>
                <DeleteContentButton id={c.id} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
