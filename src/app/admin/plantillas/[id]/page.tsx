import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getContentItem,
  listMediaOptions,
  type MediaOption,
} from "@/lib/data/admin";
import { FORM_SCHEMAS, type EditableKind } from "@/lib/views/formSchema";
import { ContentForm } from "../ContentForm";

export const dynamic = "force-dynamic";

function isEditableKind(k: string): k is EditableKind {
  return k in FORM_SCHEMAS;
}

interface Loaded {
  id: string;
  kind: EditableKind;
  data: Record<string, unknown>;
  media: MediaOption[];
}

async function load(id: string): Promise<Loaded | null | "unconfigured"> {
  try {
    const [item, media] = await Promise.all([
      getContentItem(id),
      listMediaOptions(),
    ]);
    if (!item || !isEditableKind(item.kind)) return null;
    return { id: item.id, kind: item.kind, data: item.contentData, media };
  } catch {
    return "unconfigured";
  }
}

export default async function EditarContenidoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const loaded = await load(id);

  if (loaded === "unconfigured") {
    return (
      <div>
        <h1 className="text-2xl font-black text-inst-blue-top">Editar contenido</h1>
        <div
          className="mt-4 rounded-md border-l-4 bg-white px-4 py-3 text-sm"
          style={{ borderColor: "var(--color-inst-gold)" }}
        >
          <strong>Supabase no configurado.</strong> Configure el entorno e inicie
          sesión.
        </div>
      </div>
    );
  }
  if (!loaded) notFound();

  return (
    <div>
      <Link href="/admin/plantillas" className="text-sm font-bold text-inst-red">
        ← Plantillas
      </Link>
      <h1 className="mt-2 text-2xl font-black text-inst-blue-top">
        Editar: {FORM_SCHEMAS[loaded.kind].label}
      </h1>
      <div className="mt-6">
        <ContentForm
          kind={loaded.kind}
          mediaOptions={loaded.media}
          initial={loaded.data}
          contentId={loaded.id}
        />
      </div>
    </div>
  );
}
