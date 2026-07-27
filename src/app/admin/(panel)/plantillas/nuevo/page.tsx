import Link from "next/link";
import { notFound } from "next/navigation";
import { listMediaOptions, type MediaOption } from "@/lib/data/admin";
import { FORM_SCHEMAS, type EditableKind } from "@/lib/views/formSchema";
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
    <div>
      <Link href="/admin/plantillas" className="text-sm font-bold text-inst-red">
        ← Plantillas
      </Link>
      <h1 className="mt-2 text-2xl font-black text-inst-blue-top">
        Nuevo: {schema.label}
      </h1>
      <div className="mt-6">
        <ContentForm kind={kind} mediaOptions={mediaOptions} />
      </div>
    </div>
  );
}
