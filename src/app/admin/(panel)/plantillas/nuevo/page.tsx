import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { listMediaOptions, type MediaOption } from "@/lib/data/admin";
import { FORM_SCHEMAS, type EditableKind } from "@/lib/views/formSchema";
import { PageHeader } from "@/components/ui/PageHeader";
import { Alert } from "@/components/ui/Alert";
import { ContentForm } from "../ContentForm";

export const dynamic = "force-dynamic";

function isEditableKind(k: string | undefined): k is EditableKind {
  return !!k && k in FORM_SCHEMAS;
}

async function loadMedia(): Promise<MediaOption[]> {
  try {
    return await listMediaOptions();
  } catch {
    return [];
  }
}

export default async function NuevoContenidoPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string }>;
}) {
  const { kind } = await searchParams;
  if (!isEditableKind(kind)) notFound();

  const mediaOptions = await loadMedia();
  const schema = FORM_SCHEMAS[kind];

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
        title={`Nueva pantalla: ${schema.label}`}
        description="Complete los campos editables. Los colores, la cabecera y el pie institucionales no se tocan: se aplican solos."
      />

      {mediaOptions.length === 0 && (
        <Alert tone="warn" title="La biblioteca está vacía">
          Todavía no hay videos ni imágenes que asignar a esta pantalla. Puede
          guardar el contenido igualmente y añadir el medio más tarde desde{" "}
          <strong>Biblioteca multimedia</strong>.
        </Alert>
      )}

      <ContentForm kind={kind} mediaOptions={mediaOptions} />
    </div>
  );
}
