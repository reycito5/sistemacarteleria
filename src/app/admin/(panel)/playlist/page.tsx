import { ListVideo } from "lucide-react";
import { getWorkingPlaylist, listContentItems } from "@/lib/data/admin";
import { labelForKind } from "@/lib/views/registry";
import { PLAYABLE_STATUSES } from "@/lib/views/workflow";
import type { ViewContent } from "@/lib/views/schemas";
import { PageHeader } from "@/components/ui/PageHeader";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import {
  PlaylistEditor,
  type EditorContent,
  type EditorItem,
  type EditorPlaylist,
} from "./PlaylistEditor";

export const dynamic = "force-dynamic";

interface LoadedData {
  playlist: EditorPlaylist | null;
  items: EditorItem[];
  available: EditorContent[];
}

async function loadData(): Promise<LoadedData | null> {
  try {
    const [working, contents] = await Promise.all([
      getWorkingPlaylist(),
      listContentItems(),
    ]);

    const available = contents
      .filter(
        (c) =>
          c.kind !== "sincronizacion" &&
          c.kind !== "emergencia" &&
          PLAYABLE_STATUSES.includes(c.status),
      )
      .map((c) => ({
        id: c.id,
        title: c.title,
        label: labelForKind(c.kind as ViewContent["kind"]),
      }));

    return {
      playlist: working
        ? {
            id: working.playlist.id,
            name: working.playlist.name,
            status: working.playlist.status,
            version: working.playlist.version,
          }
        : null,
      items:
        working?.items.map((i) => ({
          id: i.id,
          contentTitle: i.contentTitle,
          contentKind: i.contentKind,
          durationSeconds: i.duration_seconds,
        })) ?? [],
      available,
    };
  } catch {
    return null; // entorno no configurado
  }
}

export default async function PlaylistPage() {
  const data = await loadData();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Paso 3 · Emisión"
        title="Playlist general"
        description="Esto es exactamente lo que se ve en los televisores. Se ordenan las pantallas aprobadas, se fija cuánto dura cada una y se publica: los equipos recogen la nueva versión en menos de un minuto."
        actions={<Badge tone="info">Paso 3 de 4</Badge>}
      />

      <Alert tone="info">
        Sólo aparecen aquí los contenidos <strong>aprobados</strong>. Si no
        encuentra el que busca, revise su estado en{" "}
        <strong>Plantillas y contenidos</strong>.
      </Alert>

      {data ? (
        <PlaylistEditor
          playlist={data.playlist}
          items={data.items}
          available={data.available}
        />
      ) : (
        <Alert tone="warn" title="Supabase no está configurado">
          Configure las variables de entorno e inicie sesión para gestionar la
          playlist.
        </Alert>
      )}

      <p className="flex items-center gap-2 text-xs text-ui-muted">
        <ListVideo size={14} aria-hidden />
        Las pantallas reciben el mismo orden publicado. Las colas de noticias y
        programas terminan completas antes de dar paso al siguiente contenido.
      </p>
    </div>
  );
}
