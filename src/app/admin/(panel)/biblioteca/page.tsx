import { listMediaAssets, type MediaAssetSummary } from "@/lib/data/admin";
import { MediaUploader } from "./MediaUploader";
import { MediaList } from "./MediaList";

export const dynamic = "force-dynamic";

async function loadAssets(): Promise<MediaAssetSummary[] | null> {
  try {
    return await listMediaAssets();
  } catch {
    return null; // entorno no configurado
  }
}

export default async function BibliotecaPage() {
  const assets = await loadAssets();

  return (
    <div>
      <h1 className="text-2xl font-black text-inst-blue-top">Biblioteca multimedia</h1>
      <p className="mt-1 max-w-2xl text-sm text-ui-muted">
        Videos MP4 (H.264) e imágenes 16:9. Los archivos se validan y quedan
        disponibles para las plantillas y la playlist.
      </p>

      {assets === null ? (
        <div
          className="mt-6 rounded-md border-l-4 bg-white px-4 py-3 text-sm"
          style={{ borderColor: "var(--color-inst-gold)" }}
        >
          <strong>Supabase no configurado.</strong> Configure el entorno, aplique la
          migración de almacenamiento (0004) e inicie sesión para subir archivos.
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          <MediaUploader />
          <section>
            <h2 className="mb-3 text-lg font-extrabold text-inst-blue-top">
              Archivos ({assets.length})
            </h2>
            <MediaList assets={assets} />
          </section>
        </div>
      )}
    </div>
  );
}
