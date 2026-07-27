import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  getContentItem,
  listMediaOptions,
  type MediaOption,
} from "@/lib/data/admin";
import { FORM_SCHEMAS, type EditableKind } from "@/lib/views/formSchema";
import { PageHeader } from "@/components/ui/PageHeader";
import { Alert } from "@/components/ui/Alert";
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
      <div className="space-y-6">
        <PageHeader eyebrow="Paso 2 · Contenido" title="Editar contenido" />
        <Alert tone="warn" title="Supabase no está configurado">
          Configure el entorno e inicie sesión para editar contenidos.
        </Alert>
      </div>
    );
  }
  if (!loaded) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/plantillas"
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ui-muted transition hover:text-inst-blue-top"
      >
        <ArrowLeft size={15} aria-hidden />
        Volver a plantillas
      </Link>

      <PageHeader
        eyebrow="Paso 2 · Contenido"
        title={`Editar: ${FORM_SCHEMAS[loaded.kind].label}`}
        description="Los cambios se aplican en cuanto guarde. Si el contenido ya está en la playlist publicada, los televisores lo recogen en menos de un minuto."
      />

      <ContentForm
        kind={loaded.kind}
        mediaOptions={loaded.media}
        initial={loaded.data}
        contentId={loaded.id}
      />
    </div>
  );
}
