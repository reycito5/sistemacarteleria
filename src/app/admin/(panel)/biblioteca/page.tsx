import { LibraryBig } from "lucide-react";
import { listMediaAssets, type MediaAssetSummary } from "@/lib/data/admin";
import { PageHeader } from "@/components/ui/PageHeader";
import { Alert } from "@/components/ui/Alert";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
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
    <div className="space-y-6">
      <PageHeader
        eyebrow="Paso 1 · Contenido"
        title="Biblioteca multimedia"
        description="El almacén de videos e imágenes del sistema. Subir un archivo aquí NO lo pone en pantalla: para eso hay que usarlo después dentro de una plantilla."
        actions={<Badge tone="info">Paso 1 de 4</Badge>}
      />

      {assets === null ? (
        <Alert tone="warn" title="Supabase no está configurado">
          Configure las variables de entorno, aplique la migración de
          almacenamiento (<code>0004_storage.sql</code>) e inicie sesión para
          poder subir archivos.
        </Alert>
      ) : (
        <>
          <MediaUploader />

          <Card flush>
            <div className="border-b border-ui-border p-5 sm:p-6">
              <CardHeader
                icon={<LibraryBig size={18} />}
                title={`Archivos guardados (${assets.length})`}
                description="Pulse sobre cualquier miniatura para verla a tamaño grande. Los videos se abren con un reproductor de controles reales."
              />
            </div>
            <div className="p-5 sm:p-6">
              <MediaList assets={assets} />
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
