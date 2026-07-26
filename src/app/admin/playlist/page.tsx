import { getWorkingPlaylist, listContentItems } from "@/lib/data/admin";
import { labelForKind } from "@/lib/views/registry";
import type { ViewContent } from "@/lib/views/schemas";
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
      .filter((c) => c.kind !== "sincronizacion" && c.kind !== "emergencia")
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
    <div>
      <h1 className="text-2xl font-black text-inst-blue-top">Playlist general</h1>
      <p className="mt-1 text-sm text-panel-muted">
        Una sola playlist institucional activa. Al publicar, las cuatro pantallas
        reciben la misma programación sincronizada por hora oficial.
      </p>

      <div className="mt-6">
        {data ? (
          <PlaylistEditor
            playlist={data.playlist}
            items={data.items}
            available={data.available}
          />
        ) : (
          <div
            className="rounded-md border-l-4 bg-white px-4 py-3 text-sm"
            style={{ borderColor: "var(--color-inst-gold)" }}
          >
            <strong>Supabase no configurado.</strong> Configure las variables de
            entorno e inicie sesión para gestionar la playlist.
          </div>
        )}
      </div>
    </div>
  );
}
